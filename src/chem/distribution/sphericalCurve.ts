import Nucleus from '@/chem/Nucleus';
import { NucleonDistribution } from '@/chem/distribution/NucleonDistribution';

export default (isotope: Nucleus, scale: number): NucleonDistribution => {
  const sphericalCurve = (a: number, t: number): [number, number, number] => {
    const q = Math.sqrt(1 + a * a * t * t);
    return [
      Math.cos(t) / q,
      Math.sin(t) / q,
      -(a * t) / q
    ];
  };
  const getA = (isotope: Nucleus): number => {
    return (isotope.bindingEnergy / isotope.A) * (isotope.magneticMoment / isotope.A);
  };
  const positions = new Float32Array(isotope.A * 3);
  const attributes = new Float32Array(isotope.A * 3);

  let aSign = 1;
  let offset = 0;
  let radius;
  let pos: [number, number, number];
  scale *= 1e14;
  for (let i = Number.EPSILON; i < isotope.Z; i++) {
    radius = isotope.R * scale;
    aSign = -aSign;
    pos = sphericalCurve(aSign * getA(isotope) / i, isotope.Z - i);
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = isotope.bindingEnergy / isotope.A;
  }
  for (let i = Number.EPSILON; i < isotope.N; i++) {
    radius = isotope.R * scale;
    aSign = -aSign;
    pos = sphericalCurve(aSign * getA(isotope) / i, isotope.N - i);
    positions[offset] = pos[0] * radius;
    attributes[offset++] = 0;
    positions[offset] = pos[1] * radius;
    attributes[offset++] = 1;
    positions[offset] = pos[2] * radius;
    attributes[offset++] = isotope.bindingEnergy / isotope.A;
  }
  return { positions, attributes };
};
