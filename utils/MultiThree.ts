import * as THREE from 'three';

export interface MultiThreeScene {
  element: Element;
  scene: THREE.Scene;
  dispose?: () => void;
  tick?: (time: number, deltaTime: number) => void;
}

export default class MultiThree {
  public camera: THREE.Camera;
  public scenes: { [key: string]: MultiThreeScene } = {};
  public readonly visibleScenes: Array<MultiThreeScene> = [];
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private doRender: boolean = false;

  public constructor (canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('Canvas required');
    }
    this.canvas = canvas;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context: this.canvas.getContext('webgl2', { alpha: true, antialias: true }) as WebGLRenderingContext,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setScissorTest(true);
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
    this.camera.position.z = 1;
    this.adjustCanvasAndCheckVisibility();
    this.startRender();
  }

  public async addScene (multiThreeScene: MultiThreeScene) {
    if (!multiThreeScene.element.id) {
      console.error('Element id required.', multiThreeScene.element);
    }
    const id = multiThreeScene.element.id;
    this.scenes[id] && this.removeScene(this.scenes[id]);
    this.scenes[id] = multiThreeScene;
    if (this.renderer && this.isVisible(multiThreeScene.element)) {
      this.visibleScenes.push(this.scenes[id]);
      this.adjustCanvas();
    }
  }

  public async removeScene (multiThreeScene: MultiThreeScene) {
    const scene = this.scenes[multiThreeScene.element.id];
    scene && scene.scene.traverse(MultiThree.dispose);
    delete this.scenes[multiThreeScene.element.id];
    this.adjustCanvasAndCheckVisibility();
  }

  public dispose (): void {
    this.stopRender();
    requestAnimationFrame(() => {
      this.visibleScenes.length = 0;
      Object.keys(this.scenes).forEach(key => this.removeScene(this.scenes[key]));
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      delete this.renderer.context;
      delete this.renderer.domElement;
      delete this.renderer;
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
      for (let i = 0, len = this.visibleScenes.length; i < len; i++) {
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
    window.addEventListener('scroll', this.adjustCanvasAndCheckVisibility);
    window.addEventListener('resize', this.adjustCanvasAndCheckVisibility);
  }

  private removeEventListeners () {
    window.removeEventListener('scroll', this.adjustCanvasAndCheckVisibility);
    window.removeEventListener('resize', this.adjustCanvasAndCheckVisibility);
  }

  private adjustCanvasAndCheckVisibility = () => {
    this.adjustCanvas();
    this.checkVisibility();
  }

  private adjustCanvas () {
    this.canvas.style.transform = `translate(${window.pageXOffset}px, ${window.pageYOffset}px)`;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
  }

  private checkVisibility () {
    this.visibleScenes.length = 0;
    for (const i in this.scenes) {
      this.scenes[i] && this.isVisible(this.scenes[i].element) && this.visibleScenes.push(this.scenes[i]);
    }
  }

  private isVisible (element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.top <= this.renderer.domElement.clientHeight &&
      rect.right >= 0 && rect.left <= this.renderer.domElement.clientWidth;
  }
}
