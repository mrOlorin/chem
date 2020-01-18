import Quark, { QUARKS } from '@/chem/Quark';
import Nucleon from '@/chem/Nucleon';
import Nucleus from '@/chem/Nucleus';

export default class ParticleBuilder {
  static buildNucleon (quarks: Array<Quark>) {
    return new Nucleon(quarks);
  }

  static buildProton (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
    ]);
  }

  static buildNeutron (): Nucleon {
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
    return new Nucleus(protons, neutrons);
  }
}
