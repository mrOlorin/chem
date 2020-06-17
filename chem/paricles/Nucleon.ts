import Quark from './Quark'

export default class Nucleon {
  public readonly quarks: Array<Quark>

  constructor (quarks: Array<Quark>) {
    if (quarks.length === 0) {
      throw new Error('Quarks required');
    }
    this.quarks = quarks;
  }

  public get electricCharge (): number {
    return this.quarks.reduce((charge: number, quark: Quark) => charge + quark.electricCharge, 0);
  }

  public get spin (): number {
    return this.quarks.reduce((isospin: number, quark: Quark) => isospin + quark.isospin, 0);
  }

  public get mass (): number {
    return this.quarks.reduce((mass: number, quark: Quark) => mass + quark.mass, 0);
  }

  // Барионное число
  public get B (): number {
    return this.quarks.length / 3;
  }
}
