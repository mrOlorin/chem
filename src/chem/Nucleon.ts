import Quark from '@/chem/Quark';

export default class Nucleon {
  public readonly quarks: Array<Quark>

  constructor (quarks: Array<Quark>) {
    if (quarks.length === 0) {
      throw new Error('Quarks required');
    }
    this.quarks = quarks;
  }

  public get electricCharge (): number {
    let electricCharge = 0;
    for (const quark of this.quarks) {
      electricCharge += quark.electricCharge;
    }
    return electricCharge;
  }

  public get spin (): number {
    let spin = 0;
    for (const quark of this.quarks) {
      spin += quark.isospin;
    }
    return spin;
  }

  // Барионное число
  public get B (): number {
    return this.quarks.length / 3;
  }
}
