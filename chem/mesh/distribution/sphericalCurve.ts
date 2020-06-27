import { NucleonDistribution } from './NucleonDistribution';
import Nucleus from '../../paricles/Nucleus'
import { r0 } from '../../literals/constants'

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
  let pos: [number, number, number];
  scale *= nucleus.R / r0;
  for (let i = 0; i < nucleus.Z; i++) {
    aSign = -aSign;
    pos = sphericalCurve(aSign / nucleus.Z, i);
    positions[offset] = pos[1] * scale;
    attributes[offset++] = 1;
    positions[offset] = pos[2] * scale;
    attributes[offset++] = 0;
    positions[offset] = pos[0] * scale;
    attributes[offset++] = 0;
  }
  for (let i = 0; i < nucleus.N; i++) {
    aSign = -aSign;
    pos = sphericalCurve(aSign / nucleus.N, i);
    positions[offset] = pos[1] * scale;
    attributes[offset++] = 0;
    positions[offset] = pos[2] * scale;
    attributes[offset++] = 1;
    positions[offset] = pos[0] * scale;
    attributes[offset++] = 0;
  }
  return { positions, attributes };
};
