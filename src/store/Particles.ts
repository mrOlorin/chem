import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import Atom from '@/chem/Atom';
import ParticleBuilderCached from '@/chem/ParticleBuilderCached';
import ISOTOPES from '@/chem/literals/isotopes';
import Nucleus from '@/chem/Nucleus';

@Module
export default class Particles extends VuexModule {
  public atoms: Array<Atom> = [];
  public nuclides: Array<Array<Nucleus>> = [];

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
  public setNuclides (nuclides: Array<Array<Nucleus>>): void {
    this.nuclides = nuclides;
  }

  @Action({ commit: 'setNuclides' })
  public async buildNuclides () {
    if (this.nuclides.length > 0) return this.nuclides;
    const nuclides: Array<Array<Nucleus>> = [];
    for (let Z = 1; Z <= 118; Z++) {
      nuclides[Z] = [];
      for (let N = ISOTOPES[Z][0]; N <= ISOTOPES[Z][1]; N++) {
        nuclides[Z][N] = ParticleBuilderCached.buildNucleus(Z, N);
      }
    }
    return nuclides;
  }
}
