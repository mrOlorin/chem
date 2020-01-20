import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class ThreeML {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.Camera;
  private stats: Stats;
  private scenes: Array<THREE.Scene> = [];
  private visibleScenes: Array<THREE.Scene> = [];
  private doRender: boolean = false;
  public timeScale: number = 0.01;

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
      antialias: false
    };
    const context = this.canvas.getContext('webgl2', contextAttributes) as WebGLRenderingContext;
    const renrederParameters: THREE.WebGLRendererParameters = {
      canvas: this.canvas,
      context,
      antialias: false
    };
    this.renderer = new THREE.WebGLRenderer(renrederParameters);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setScissorTest(true);
    const cynicallyHardcodedAspectRatio = 0.954545;
    this.camera = new THREE.PerspectiveCamera(90, cynicallyHardcodedAspectRatio, 1, 10);
    this.camera.position.z = 2.5;
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
    const dirtyHackY = -100;
    let x: number;
    let y: number;
    let width: number;
    let height: number;
    this.doRender = true;
    let previousTime = 0;
    let deltaTime = 0;
    const animate = (time: number) => {
      time *= this.timeScale;
      deltaTime = time - previousTime;
      for (let i = 0, len = this.visibleScenes.length; i < len; i++) {
        const rect: ClientRect = this.visibleScenes[i].userData.element.getBoundingClientRect();
        x = rect.left;
        y = this.renderer.domElement.clientHeight - rect.top + dirtyHackY;
        width = rect.right - rect.left;
        height = rect.bottom - rect.top;
        this.renderer.setViewport(x, y, width, height);
        this.renderer.setScissor(x, y, width, height);
        this.visibleScenes[i].userData.tick(time, deltaTime);
        this.renderer.render(this.visibleScenes[i], this.camera);
      }
      previousTime = time;
      this.stats.update();
      if (this.doRender) {
        requestAnimationFrame(animate);
      }
    };
    this.addEventListeners();
    this.adjustCanvas();
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
    this.visibleScenes = [];
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