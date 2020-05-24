import Quark from '@/chem/Quark';
import QUARKS from '@/chem/literals/quarks';
import Nucleon from '@/chem/Nucleon';
import Nucleus from '@/chem/Nucleus';
import NucleusCached from '@/chem/NucleusCached';
import Atom from '@/chem/Atom';

export default class ParticleBuilder {
  private static buildNucleon (quarks: Array<Quark>) {
    return new Nucleon(quarks);
  }

  private static buildProton (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
    ]);
  }

  private static buildNeutron (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
      new Quark(QUARKS.down),
    ]);
  }

  static buildNucleus (protonsNumber: number, neutronsNumber: number): Nucleus {
    const protons: Array<Nucleon> = [];
    const neutrons: Array<Nucleon> = [];
    for (let i = 0; i < protonsNumber; i++) {
      protons.push(this.buildProton());
    }
    for (let i = 0; i < neutronsNumber; i++) {
      neutrons.push(this.buildNeutron());
    }
    return new NucleusCached(protons, neutrons);
  }

  static buildAtom (z: number, n: number = z): Atom {
    const nucleus = this.buildNucleus(z, n);
    return new Atom(nucleus);
  }
}
