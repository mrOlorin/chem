import Nucleus from '@/chem/paricles/Nucleus';
import NucleusCached from '@/chem/paricles/NucleusCached';
import ParticleBuilder from '@/chem/ParticleBuilder';
import Nucleon from '@/chem/paricles/Nucleon';

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
}
