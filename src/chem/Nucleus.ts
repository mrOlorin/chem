import ELEMENTS from '@/chem/elements';
import Nucleon from '@/chem/Nucleon';
import { r0, magneticMoment } from '@/chem/constants';

export default class Nucleus {
  public readonly protons: Array<Nucleon>
  public readonly neutrons: Array<Nucleon>

  constructor (protons: Array<Nucleon>, neutrons: Array<Nucleon>) {
    this.protons = protons;
    this.neutrons = neutrons;
  }

  public get name (): string {
    return ELEMENTS[this.Z - 1];
  }

  // Число протонов
  public get Z (): number {
    return this.protons.length;
  }

  public get electricCharge (): number {
    return this.Z;
  }

  // Число нейтронов (изотопическое число)
  public get N (): number {
    return this.neutrons.length;
  }

  // Массовое число
  public get A (): number {
    return this.Z + this.N;
  }

  // Радиус в метрах
  public get R (): number {
    return r0 * this.A ** (1 / 3);
  }

  public get spin (): number {
    let spin = 0;
    for (const proton of this.protons) {
      spin += proton.spin;
    }
    for (const neutron of this.neutrons) {
      spin += neutron.spin;
    }
    return spin;
  }

  // В ядерных магнетонах
  public get magneticMoment (): number {
    return this.Z * magneticMoment.proton + this.N * magneticMoment.neutron;
  }
}
