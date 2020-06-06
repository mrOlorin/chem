import Nucleus from '@/chem/paricles/Nucleus';
import { NucleonDistribution } from './NucleonDistribution';

export default (nucleus: Nucleus, scale: number = 1): NucleonDistribution => {
  const sphere = (): [number, number, number] => {
    // http://mathworld.wolfram.com/SpherePointPicking.html
    const TAU = Math.PI * 2;
    const cosTheta = 2 * Math.random() - 1;
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const phi = Math.random() * TAU;
    const radius = Math.random();
    return [
      radius * sinTheta * Math.cos(phi),
      radius * sinTheta * Math.sin(phi),
      radius * cosTheta
    ];
  };
  const positions = new Float32Array(nucleus.A * 3);
  const attributes = new Float32Array(nucleus.A * 3);

  let offset = 0;
  let radius;
  let pos: [number, number, number];
  scale *= 1.3e14;
  for (let i = Number.EPSILON; i < nucleus.Z; i++) {
    radius = nucleus.R * scale;
    pos = sphere();
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  for (let i = Number.EPSILON; i < nucleus.N; i++) {
    radius = nucleus.R * scale;
    pos = sphere();
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  return { positions, attributes };
};
