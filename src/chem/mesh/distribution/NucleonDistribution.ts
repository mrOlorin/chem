import sphericalCurve from './sphericalCurve';
import hilbertCurve from './hilbertCurve';
import sphere from './sphere';

export type NucleonDistribution = { positions: Float32Array, attributes: Float32Array };

export default {
  sphericalCurve,
  hilbertCurve,
  sphere,
};
