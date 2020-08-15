import Atom from './Atom';

export type QuantumNumbers = {
  n: number; // главное; энергетический уровень | размер орбитали; 1, 2, 3..
  l: number; // орбитальное; форма орбитали; 0–s, 1–p, 2–d, 3–f
  m: number; // магнитное; ориентация орбитали; -l..l
  ms: number; // спиновое; спин; -1/2 | 1/2
}

export default class Electron implements QuantumNumbers {
  public static mass: number = 0.51099895000e6; // эВ
  public n: number;
  public l: number;
  public m: number;
  public ms: number;
  public atom?: Atom;

  public constructor (props: QuantumNumbers, atom?: Atom) {
    this.n = props.n;
    this.l = props.l;
    this.m = props.m;
    this.ms = props.ms;
    this.atom = atom;
  }

  public get rBohr (): number {
    return this.atom ? this.atom.electronRadiusOnLevel(this.n) : 0;
  }

  public get v (): number {
    return this.atom ? this.atom.electronVelocityOnLevel(this.n) : 0;
  }

  public get energy (): number {
    return this.atom ? this.atom.energyOnLevel(this.n) : 0;
  }

  public get psi (): number {
    return Math.sqrt((2. / (this.n * this.rBohr)) ** 3);
  }

  public get sphericalHarmonic (): string {
    return Electron.sphericalHarmonics[this.l][this.m];
  }

  // http://en.wikipedia.org/wiki/Table_of_spherical_harmonics#Real_spherical_harmonics
  private static sphericalHarmonics: { [l: number]: { [m: number]: string } } = {
    0: {
      0: '0.28209479177387814'
    },
    1: {
      [-1]: '0.4886025119029199 * (p.y / r)',
      [0]: '0.4886025119029199 * (p.z / r)',
      [1]: '0.4886025119029199 * (p.x / r)'
    },
    2: {
      [-2]: '1.0925484305920792 * ((p.x * p.y) / (r2))',
      [-1]: '1.0925484305920792 * ((p.y * p.z) / (r2))',
      [0]: '0.31539156525252005 * ((-(p.x * p.x) - (p.y * p.y) + 2.0 * (p.z * p.z)) / (r2))',
      [1]: '1.0925484305920792 * ((p.z * p.x) / (r2))',
      [2]: '0.5462742152960396 * (((p.x * p.x) - (p.y * p.y)) / (r2))'
    },
    3: {
      [-3]: '0.5900435899266435 * (((3.0 * p.x * p.x - p.y * p.y) * p.y) / (r3))',
      [-2]: '2.890611442640554 * ((p.x * p.y * p.z) / (r3))',
      [-1]: '0.4570457994644658 * ((p.y * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (r3))',
      [0]: '0.3731763325901154 * ((p.z * (2.0 * p.z * p.z - 3.0 * p.x * p.x - 3.0 * p.y * p.y)) / (r3))',
      [1]: '0.4570457994644658 * ((p.x * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (r3))',
      [2]: '1.445305721320277 * (((p.x * p.x - p.y * p.y) * p.z) / (r3))',
      [3]: '0.5900435899266435 * (((p.x * p.x - 3.0 * p.y * p.y) * p.x) / (r3))'
    },
    4: {
      [-4]: '2.5033429417967046 * (((p.x * p.y) * (p.x * p.x - p.y * p.y)) / (r4))',
      [-3]: '1.7701307697799304 * (((3. * (p.x * p.x) - (p.y * p.y)) * p.y * p.z) / (r4))',
      [-2]: '0.9461746957575601 * (((p.x * p.y) * (7. * (p.z * p.z) - (r2))) / (r4))',
      [-1]: '0.6690465435572892 * (((p.y * p.z) * (7. * (p.z * p.z) - 3. * (r2))) / (r4))',
      [0]: '0.10578554691520431 * ((35. * (p.z * p.z * p.z * p.z) - 30. * (p.z * p.z) * (r2) + 3. * (r4)) / (r4))',
      [1]: '0.6690465435572892 * (((p.x * p.z) * (7. * p.z * p.z - 3. * (r2))) / (r4))',
      [2]: '0.47308734787878004 * (((p.x * p.x - p.y * p.y) * (7. * (p.z * p.z) - (r2))) / (r4))',
      [3]: '1.7701307697799304 * (((p.x * p.x - 3. * (p.y * p.y)) * p.x * p.z) / (r4))',
      [4]: '0.6258357354491761 * (((p.x * p.x) * (p.x * p.x - 3. * (p.y * p.y)) - (p.y * p.y) * (3. * (p.x * p.x) - p.y * p.y)) / (r4))'
    }
  }
}