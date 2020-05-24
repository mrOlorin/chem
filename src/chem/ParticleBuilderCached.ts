import Nucleus from '@/chem/Nucleus';
import NucleusCached from '@/chem/NucleusCached';
import Atom from '@/chem/Atom';
import ParticleBuilder from '@/chem/ParticleBuilder';
import Nucleon from '@/chem/Nucleon';

export default class ParticleBuilderCached extends ParticleBuilder {
  private static proton: Nucleon = ParticleBuilder.buildProton();
  private static neutron: Nucleon = ParticleBuilder.buildNeutron();

  private static protons: Array<Nucleon> = [];
  private static neutrons: Array<Nucleon> = [];

  static buildNucleus (protonsNumber: number, neutronsNumber: number): Nucleus {
    if (this.protons.length < protonsNumber) {
      for (let i = this.protons.length; i < protonsNumber; i++) {
        this.protons[i] = this.proton;
      }
    }
    if (this.neutrons.length < neutronsNumber) {
      for (let i = this.neutrons.length; i < neutronsNumber; i++) {
        this.neutrons[i] = this.neutron;
      }
    }
    return new NucleusCached(
      this.protons.slice(0, protonsNumber),
      this.neutrons.slice(0, neutronsNumber)
    );
  }

  static buildAtom (z: number, n: number = z): Atom {
    const nucleus = this.buildNucleus(z, n);
    return new Atom(nucleus);
  }
}
