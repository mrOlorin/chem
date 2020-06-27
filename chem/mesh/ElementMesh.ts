import * as THREE from 'three';
import Atom from '../paricles/Atom'
import ElectronCloudMesh from './ElectronCloudMesh'

interface ElementMeshOptions {
  atom: Atom;
  timeScale: number;
}

export default class ElementMesh extends THREE.Mesh {
  private readonly electronCloudMesh: ElectronCloudMesh;
  private readonly options: ElementMeshOptions;

  public constructor (options: ElementMeshOptions) {
    super();
    this.options = options;
    this.electronCloudMesh = new ElectronCloudMesh({
      electrons: this.options.atom.electrons,
      timeScale: this.options.timeScale
    });
    this.add(this.electronCloudMesh);
  }

}
