import * as THREE from 'three';
import Atom from '@/chem/Atom';
import NucleusMesh from '@/chem/mesh/NucleusMesh';

export default class ElementMesh extends THREE.Mesh {
  private nuclideMesh: NucleusMesh;

  public constructor (atom: Atom) {
    super();
    this.nuclideMesh = new NucleusMesh(atom.nucleus);
    this.add(this.nuclideMesh);
  }

  public tick = (time: number, deltTime: number) => {
    this.nuclideMesh.tick(time, deltTime);
  }
}
