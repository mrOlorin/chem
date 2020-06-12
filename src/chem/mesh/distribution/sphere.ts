import Nucleus from '@/chem/paricles/Nucleus';
import { NucleonDistribution } from './NucleonDistribution';

export default (nucleus: Nucleus, scale: number = 1): NucleonDistribution => {
  const sphere = (radius: number = 1): [number, number, number] => {
    // http://mathworld.wolfram.com/SpherePointPicking.html
    const TAU = Math.PI * 2;
    const cosTheta = 2 * Math.random() - 1;
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const phi = Math.random() * TAU;
    radius *= Math.random();
    return [
      radius * sinTheta * Math.cos(phi),
      radius * sinTheta * Math.sin(phi),
      radius * cosTheta
    ];
  };
  const positions = new Float32Array(nucleus.A * 3);
  const attributes = new Float32Array(nucleus.A * 3);
  let offset = 0;
  let pos: [number, number, number];
  for (let i = Number.EPSILON; i < nucleus.Z; i++) {
    pos = sphere(scale);
    positions[offset] = pos[0];
    attributes[offset++] = 1;
    positions[offset] = pos[1];
    attributes[offset++] = 0;
    positions[offset] = pos[2];
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  for (let i = Number.EPSILON; i < nucleus.N; i++) {
    pos = sphere(scale);
    positions[offset] = pos[0];
    attributes[offset++] = 0;
    positions[offset] = pos[1];
    attributes[offset++] = 1;
    positions[offset] = pos[2];
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  return { positions, attributes };
};
