import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import Atom from '@/chem/paricles/Atom';
import ParticleBuilderCached from '@/chem/ParticleBuilderCached';
import ISOTOPES from '@/chem/literals/isotopes';
import Nucleus from '@/chem/paricles/Nucleus';

type Nuclides = { [key: number]: { [key: number]: Nucleus } };

@Module
export default class Particles extends VuexModule {
  public atoms: Array<Atom> = [];
  public nuclides: Nuclides = {};

  @Mutation
  public setAtoms (atoms: Array<Atom>): void {
    this.atoms = atoms;
  }

  @Action({ commit: 'setAtoms' })
  public buildAtoms () {
    if (this.atoms.length > 0) return this.atoms;
    const atoms = [];
    for (let i = 0; i < 118; i++) {
      atoms[i] = ParticleBuilderCached.buildAtom(i + 1, ISOTOPES[i + 1][2]);
    }
    return atoms;
  }

  @Mutation
  public setNuclides (nuclides: Nuclides): void {
    this.nuclides = nuclides;
  }

  @Action({ commit: 'setNuclides' })
  public async buildNuclides () {
    if (!this.nuclides[1]) {
      for (let Z = 1; Z <= 118; Z++) {
        this.nuclides[Z] = {};
        for (let N = ISOTOPES[Z][0]; N <= ISOTOPES[Z][1]; N++) {
          this.nuclides[Z][N] = ParticleBuilderCached.buildNucleus(Z, N);
        }
      }
    }
    return this.nuclides;
  }
}
