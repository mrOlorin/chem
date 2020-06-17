import Nucleon from './paricles/Nucleon'
import QUARKS from './literals/quarks'
import Quark from './paricles/Quark'
import Nucleus from './paricles/Nucleus'
import Atom from './paricles/Atom'

export default class ParticleBuilder {
  protected static buildNucleon (quarks: Array<Quark>) {
    return new Nucleon(quarks);
  }

  protected static buildProton (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
    ]);
  }

  protected static buildNeutron (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
      new Quark(QUARKS.down),
    ]);
  }

  public static buildNucleus (protonsNumber: number, neutronsNumber: number): Nucleus {
    const protons: Array<Nucleon> = [];
    const neutrons: Array<Nucleon> = [];
    for (let i = 0; i < protonsNumber; i++) {
      protons.push(this.buildProton());
    }
    for (let i = 0; i < neutronsNumber; i++) {
      neutrons.push(this.buildNeutron());
    }
    return new Nucleus(protons, neutrons);
  }

  public static buildAtom (z: number, n: number = z): Atom {
    const nucleus = this.buildNucleus(z, n);
    return new Atom(nucleus);
  }
}