import * as THREE from 'three';
import Atom from '@/chem/paricles/Atom';
import ElectronCloudMesh from '@/chem/mesh/ElectronCloudMesh';

export default class ElementMesh extends THREE.Mesh {
  private readonly electronCloudMesh: ElectronCloudMesh;

  public constructor (atom: Atom) {
    super();
    this.electronCloudMesh = new ElectronCloudMesh(atom.outerVacantElectrons);
    this.add(this.electronCloudMesh);
  }

  public tick = (time: number, deltTime: number) => {
    this.electronCloudMesh.tick(time, deltTime);
  }

  public dispose () {
    this.electronCloudMesh.dispose();
  }
}
