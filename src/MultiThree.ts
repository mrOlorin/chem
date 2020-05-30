import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface MultiThreeScene {
  element: Element;
  scene: THREE.Scene;
  tick?: (time: number, deltaTime: number) => void;
}

export default class MultiThree {
  public static timeScale: number = 0.1;
  public static camera: THREE.Camera;
  public static scenes: {[key: string]: MultiThreeScene} = {};
  public static readonly visibleScenes: Array<MultiThreeScene> = [];
  public static canvas: HTMLCanvasElement;
  public static renderer: THREE.WebGLRenderer;
  public static stats: Stats;
  private static doRender: boolean = false;

  public static init (canvas: HTMLCanvasElement) {
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
    this.stats = Stats();
    (this.canvas.parentElement as HTMLElement).appendChild(this.stats.domElement);
    this.startRender();
  }

  public static addScene (multiThreeScene: MultiThreeScene) {
    delete this.scenes[multiThreeScene.element.id];
    this.scenes[multiThreeScene.element.id] = multiThreeScene;
    if (this.isVisible(this.scenes[multiThreeScene.element.id].element)) {
      this.visibleScenes.push(this.scenes[multiThreeScene.element.id]);
      this.adjustCanvas();
    }
  }

  public static removeScene (multiThreeScene: MultiThreeScene) {
    delete this.scenes[multiThreeScene.element.id];
  }

  public static stopRender () {
    this.doRender = false;
    this.removeEventListeners();
  }

  public static startRender () {
    this.doRender = true;
    this.addEventListeners();
    this.adjustCanvas();

    let y: number;
    let deltaTime: number;
    let previousTime = 0;
    let rect: ClientRect;
    let rendererHeight: number;
    const animate = (time: number): void => {
      time *= this.timeScale;
      deltaTime = time - previousTime;
      rendererHeight = this.renderer.domElement.clientHeight;
      for (let i = 0, len = this.visibleScenes.length; i < len; i++) {
        // @ts-ignore
        this.visibleScenes[i].tick && this.visibleScenes[i].tick(time, deltaTime);
        rect = this.visibleScenes[i].element.getBoundingClientRect();
        y = rendererHeight - rect.bottom;
        this.renderer.setViewport(rect.left, y, rect.width, rect.height);
        this.renderer.setScissor(rect.left, y, rect.width, rect.height);
        this.renderer.render(this.visibleScenes[i].scene, this.camera);
      }
      previousTime = time;
      this.stats.update();
      if (this.doRender) {
        requestAnimationFrame(animate);
      }
    };
    animate(0);
  }

  private static addEventListeners () {
    window.addEventListener('scroll', this.adjustCanvasAndCheckVisibility);
    window.addEventListener('resize', this.adjustCanvasAndCheckVisibility);
  }

  private static removeEventListeners () {
    window.removeEventListener('scroll', this.adjustCanvasAndCheckVisibility);
    window.removeEventListener('resize', this.adjustCanvasAndCheckVisibility);
  }

  private static adjustCanvas () {
    this.canvas.style.transform = `translate(${window.pageXOffset}px, ${window.pageYOffset}px)`;
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    }
  }

  private static checkVisibility () {
    this.visibleScenes.length = 0;
    for (const i in this.scenes) {
      this.scenes[i] && this.isVisible(this.scenes[i].element) && this.visibleScenes.push(this.scenes[i]);
    }
  }

  private static isVisible (element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.top <= this.renderer.domElement.clientHeight &&
      rect.right >= 0 && rect.left <= this.renderer.domElement.clientWidth;
  }

  private static adjustCanvasAndCheckVisibility = () => {
    MultiThree.adjustCanvas();
    MultiThree.checkVisibility();
  }
}
