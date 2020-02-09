import sphericalCurve from '@/chem/distribution/sphericalCurve';
import hilbertCurve from '@/chem/distribution/hilbertCurve';

export type NucleonDistribution = { positions: Float32Array, attributes: Float32Array };

export default {
  sphericalCurve,
  hilbertCurve,
};
