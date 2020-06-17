// import * as THREE from 'three';
import { NucleonDistribution } from './NucleonDistribution';
// import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils';
import Nucleus from '../../paricles/Nucleus'

const hilbertPoints: Array<{ x: number, y: number, z: number }> = []; //GeometryUtils.hilbert3D(new THREE.Vector3(0.2, -0.2, 0), 1, 2);

export default (isotope: Nucleus): NucleonDistribution => {
  const positions = new Float32Array(isotope.A * 3);
  const attributes = new Float32Array(isotope.A * 3);

  let offset = 0;
  for (let i = 0; i < isotope.Z * 2; i += 2) {
    positions[offset] = hilbertPoints[i].x;
    attributes[offset++] = 1;
    positions[offset] = hilbertPoints[i].y;
    attributes[offset++] = 0;
    positions[offset] = hilbertPoints[i].z;
    attributes[offset++] = isotope.bindingEnergy / isotope.A;
  }
  for (let i = 1; i < isotope.N * 2; i += 2) {
    positions[offset] = hilbertPoints[i].x;
    attributes[offset++] = 0;
    positions[offset] = hilbertPoints[i].y;
    attributes[offset++] = 1;
    positions[offset] = hilbertPoints[i].z;
    attributes[offset++] = isotope.bindingEnergy / isotope.A;
  }
  return { positions, attributes };
};
