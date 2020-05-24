import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class MultiThree {
  public readonly camera: THREE.Camera;
  public timeScale: number = 0.005;
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly stats: Stats;
  private readonly scenes: Array<THREE.Scene> = [];
  private readonly visibleScenes: Array<THREE.Scene> = [];
  private doRender: boolean = false;

  public constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true
    };
    const context = this.canvas.getContext('webgl2', contextAttributes) as WebGLRenderingContext;
    const rendererParameters: THREE.WebGLRendererParameters = {
      canvas: this.canvas,
      context,
      antialias: true
    };
    this.renderer = new THREE.WebGLRenderer(rendererParameters);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setScissorTest(true);
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
    this.camera.position.z = 1;
    this.stats = Stats();
    (this.canvas.parentElement as HTMLElement).appendChild(this.stats.domElement);
    this.startRender();
  }

  public addScene (scene: THREE.Scene, element: HTMLElement, tick: (time: number, deltaTime: number) => void = () => undefined) {
    scene.userData.element = element;
    scene.userData.tick = tick;
    this.scenes.push(scene);
    if (this.isVisible(scene.userData.element)) {
      this.visibleScenes.push(scene);
    }
  }

  public startRender () {
    this.doRender = true;
    this.addEventListeners();
    requestAnimationFrame(this.adjustCanvas);

    let y: number;
    let deltaTime: number;
    let previousTime = 0;
    let rect: ClientRect;
    const animate = (time: number): void => {
      time *= this.timeScale;
      deltaTime = time - previousTime;
      for (let i = 0, len = this.visibleScenes.length; i < len; i++) {
        this.visibleScenes[i].userData.tick(time, deltaTime);
        rect = this.visibleScenes[i].userData.element.getBoundingClientRect();
        y = this.renderer.domElement.clientHeight - rect.bottom;
        this.renderer.setViewport(rect.left, y, rect.width, rect.height);
        this.renderer.setScissor(rect.left, y, rect.width, rect.height);
        this.renderer.render(this.visibleScenes[i], this.camera);
      }
      previousTime = time;
      this.stats.update();
      if (this.doRender) {
        requestAnimationFrame(animate);
      }
    };
    animate(0);
  }

  public stopRender () {
    this.doRender = false;
    this.removeEventListeners();
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
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    }
    this.visibleScenes.length = 0;
    for (const scene of this.scenes) {
      if (this.isVisible(scene.userData.element)) {
        this.visibleScenes.push(scene);
      }
    }
  }

  private isVisible (element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return !(
      rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
      rect.right < 0 || rect.left > this.renderer.domElement.clientWidth
    );
  }
}
