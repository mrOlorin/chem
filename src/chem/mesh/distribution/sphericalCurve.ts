import Nucleus from '@/chem/paricles/Nucleus';
import { NucleonDistribution } from './NucleonDistribution';

export default (nucleus: Nucleus, scale: number = 1): NucleonDistribution => {
  const sphericalCurve = (a: number, t: number): [number, number, number] => {
    const q = Math.sqrt(1 + a * a * t * t);
    return [
      Math.cos(t) / q,
      Math.sin(t) / q,
      -(a * t) / q
    ];
  };
  const positions = new Float32Array(nucleus.A * 3);
  const attributes = new Float32Array(nucleus.A * 3);

  let aSign = 1;
  let offset = 0;
  let radius;
  let pos: [number, number, number];
  scale *= 1e14;
  for (let i = Number.EPSILON; i < nucleus.Z; i++) {
    radius = nucleus.R * scale;
    aSign = -aSign;
    pos = sphericalCurve(aSign / nucleus.Z, nucleus.Z - i);
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  for (let i = Number.EPSILON; i < nucleus.N; i++) {
    radius = nucleus.R * scale;
    aSign = -aSign;
    pos = sphericalCurve(aSign / nucleus.N, nucleus.N - i);
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = 1 / nucleus.woodSaxonPotential(Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2));
  }
  return { positions, attributes };
};
