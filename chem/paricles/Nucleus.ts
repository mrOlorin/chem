import Nucleon from './Nucleon'
import ELEMENTS from '../literals/elements'
import magneticMoment from '../literals/magneticMoment'
import { r0 } from '../literals/constants'

// нечёт-нечёт | нечёт | чёт-чёт
export type Parity = -1 | 0 | 1;

export default class Nucleus {
  public readonly nucleons: Array<Nucleon>;

  constructor (protons: Array<Nucleon>, neutrons: Array<Nucleon>) {
    this.nucleons = protons.concat(neutrons);
  }

  public get name (): string {
    return ELEMENTS[this.Z - 1];
  }

  // Количество протонов / Атомное число
  public get Z (): number {
    return this.nucleons.reduce((z: number, nucleon: Nucleon) => z + nucleon.electricCharge, 0);
  }

  // Количество нейтронов (изотопическое число)
  public get N (): number {
    return this.nucleons.reduce((z: number, nucleon: Nucleon) => z + 1 - nucleon.electricCharge, 0);
  }

  // Количество нуклонов / Массовое число (A = Z + N)
  public get A (): number {
    return this.nucleons.length;
  }

  public get electricCharge (): number {
    return this.nucleons.reduce((charge: number, nucleon: Nucleon) => charge + nucleon.electricCharge, 0);
  }

  public get spin (): number {
    return this.nucleons.reduce((spin: number, nucleon: Nucleon) => spin + nucleon.spin, 0) % 1.5;
  }

  public get mass (): number {
    return this.nucleons.reduce((mass: number, nucleon: Nucleon) => mass + nucleon.mass, 0);
  }

  // https://en.wikipedia.org/wiki/Woods–Saxon_potential
  public woodSaxonPotential (distance: number): number {
    const V0 = 50; // MeV
    const surfaceThickness = 0.5;
    return -V0 / (1 + Math.exp((distance - this.R) / surfaceThickness));
  }

  // https://ru.wikipedia.org/wiki/Атомное_ядро#Радиус
  public get R (): number {
    return r0 * this.A ** (1 / 3);
  }

  public get surfaceArea (): number {
    const a2 = 1; // Квадрупольная деформация
    return 4 * Math.PI * (this.R ** 2) * (1 + (2 / 5) * (a2 ** 2));
  }

  public get parity (): Parity {
    return (this.A % 2 === 1) ? 0 : this.Z % 2 === 0 ? 1 : -1;
  }

  // https://ru.wikipedia.org/wiki/Капельная_модель_ядра#Вывод_формулы_Вайцзеккера
  public get bindingEnergy (): number {
    // Первое приближение
    const a1 = 15.56;
    let energy = a1 * this.A;

    // Поправка на поверхностное натяжение
    const a2 = 17.23;
    energy -= a2 * (this.A ** (2 / 3));

    // Поправка на кулоновское отталкивание
    const a3 = 0.71;
    energy -= a3 * (this.Z ** 2) / (this.A ** (1 / 3));

    // Поправка на протон-нейтронную асимметрию
    const a4 = 94.8;
    energy -= a4 * (((this.A / 2 - this.Z) ** 2) / this.A);

    // Поправка на влияние чётности
    const a5 = this.parity * (12 * (this.A ** (-3 / 4)));
    energy += a5 * (this.A ** (-3 / 4));

    return energy;
  }

  // В ядерных магнетонах
  public get magneticMoment (): number {
    return this.Z * magneticMoment.proton + this.N * magneticMoment.neutron;
  }

}
