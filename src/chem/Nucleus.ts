import ELEMENTS from '@/chem/elements';
import Nucleon from '@/chem/Nucleon';

// нечёт-нечёт | нечёт | чёт-чёт
export type Parity = -1 | 0 | 1;

export default class Nucleus {
  public readonly protons: Array<Nucleon>
  public readonly neutrons: Array<Nucleon>

  constructor (protons: Array<Nucleon>, neutrons: Array<Nucleon>) {
    this.protons = protons;
    this.neutrons = neutrons;
  }

  public get nucleons () {
    return [...this.protons, ...this.neutrons];
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
    const r0 = 1.23e-15;
    return r0 * this.A ** (1 / 3);
  }

  public get surfaceArea (): number {
    const a2 = 1; // Квадрупольная деформация
    return 4 * Math.PI * (this.R ** 2) * (1 + (2 / 5) * (a2 ** 2));
  }

  public get spin (): number {
    let spin = 0;
    for (const nucleon of this.nucleons) {
      spin += nucleon.spin;
    }
    return spin;
  }

  public get mass (): number {
    let mass = 0;
    for (const nucleon of this.nucleons) {
      mass += nucleon.mass;
    }
    return mass;
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
    const magneticMoment = {
      proton: 2.79284734463,
      neutron: -1.91304273
    };
    return this.Z * magneticMoment.proton + this.N * magneticMoment.neutron;
  }
}
