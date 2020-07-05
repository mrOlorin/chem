import * as THREE from 'three';

export interface MultiThreeScene {
  element: Element;
  scene: THREE.Scene;
  tick?: (time: number, deltaTime: number) => void;
}

export default class MultiThree {
  public camera: THREE.Camera;
  public scenes: { [key: string]: MultiThreeScene } = {};
  public readonly visibleScenes: { [id: string]: MultiThreeScene } = {};
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private doRender: boolean = false;
  private intersectionObserver: IntersectionObserver;

  public constructor (canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('Canvas required');
    }
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context: this.canvas.getContext('webgl2', { alpha: true, antialias: true }) as WebGLRenderingContext,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setScissorTest(true);
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
    this.camera.position.z = 1;
    this.intersectionObserver = this.initIntersectionObserver();
    this.startRender();
  }

  private initIntersectionObserver (): IntersectionObserver {
    return new IntersectionObserver(entries => entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        this.visibleScenes[entry.target.id] = this.scenes[entry.target.id];
      } else {
        delete this.visibleScenes[entry.target.id];
      }
      this.adjustCanvas();
    }), {
      root: null, // null == document's viewport
      rootMargin: '0px',
      threshold: 0.4
    });
  }

  public addScene (multiThreeScene: MultiThreeScene) {
    if (!multiThreeScene.element.id) {
      console.error('Element id required.', multiThreeScene.element);
    }
    const id = multiThreeScene.element.id;
    this.scenes[id] && this.removeScene(this.scenes[id]);
    this.scenes[id] = multiThreeScene;
    this.intersectionObserver.observe(multiThreeScene.element);
  }

  public removeScene (multiThreeScene: MultiThreeScene) {
    this.intersectionObserver.unobserve(multiThreeScene.element);
    this.scenes[multiThreeScene.element.id].scene.traverse(MultiThree.dispose);
    delete this.scenes[multiThreeScene.element.id];
  }

  public dispose (): void {
    this.stopRender();
    this.intersectionObserver.disconnect();
    this.scenes = {};
    requestAnimationFrame(() => {
      Object.keys(this.scenes).forEach(key => this.removeScene(this.scenes[key]));
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    });
  }

  private static dispose (obj: THREE.Object3D) {
    const geometry = (obj as THREE.Mesh).geometry;
    const material = (obj as THREE.Mesh).material;
    geometry && geometry.dispose();
    if (material) {
      if (Array.isArray(material)) {
        material.forEach(m => m.dispose())
      } else {
        material.dispose();
      }
    }
  }

  public stopRender () {
    this.doRender = false;
    this.removeEventListeners();
  }

  public startRender () {
    this.doRender = true;
    this.addEventListeners();
    this.adjustCanvas();
    let y: number;
    let rect: ClientRect;
    let rendererHeight: number;
    const animate = (): void => {
      rendererHeight = this.renderer.domElement.clientHeight;
      for (const i of Object.keys(this.visibleScenes)) {
        rect = this.visibleScenes[i].element.getBoundingClientRect();
        y = rendererHeight - rect.bottom;
        this.renderer.setViewport(rect.left, y, rect.width, rect.height);
        this.renderer.setScissor(rect.left, y, rect.width, rect.height);
        this.renderer.render(this.visibleScenes[i].scene, this.camera);
      }
      this.doRender && requestAnimationFrame(animate);
    };
    animate();
  }

  private addEventListeners () {
    window.addEventListener('scroll', this.adjustCanvas);
    window.addEventListener('resize', this.adjustCanvas);
  }

  private removeEventListeners () {
    window.removeEventListener('scroll', this.adjustCanvas);
    window.removeEventListener('resize', this.adjustCanvas);
  }

  private adjustCanvas = () => {
    this.canvas.style.transform = `translate(${window.pageXOffset}px, ${window.pageYOffset}px)`;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
  }

}
