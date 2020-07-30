import Nucleon from './paricles/Nucleon'
import QUARKS from './literals/quarks'
import ISOTOPES from './literals/isotopes'
import Quark from './paricles/Quark'
import Nucleus from './paricles/Nucleus'
import Atom, { Electron, ElectronShell, ElectronSHellSublevel } from './paricles/Atom'

export default class ParticleBuilder {
  protected static buildNucleon (quarks: Array<Quark>) {
    return new Nucleon(quarks);
  }

  protected static buildProton (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.up),
      new Quark(QUARKS.down)
    ]);
  }

  protected static buildNeutron (): Nucleon {
    return this.buildNucleon([
      new Quark(QUARKS.up),
      new Quark(QUARKS.down),
      new Quark(QUARKS.down)
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
    return new Atom(this.buildNucleus(z, n));
  }

  public static buildNuclides () {
    const isotopes = [];
    for (let Z = 1, ZMax = ISOTOPES.length - 1; Z <= ZMax; Z++) {
      for (let N = ISOTOPES[Z][0], NMax = ISOTOPES[Z][1]; N <= NMax; N++) {
        isotopes.push(this.buildNucleus(Z, N));
      }
    }
    return isotopes;
  }

  public static buildElectronShell (n: number = 4): ElectronShell {
    const subLevels: ElectronShell = [];
    for (let l = 0; l <= n; l++) {
      subLevels[l] = this.buildElectronShellSublevel(n, l);
    }
    return subLevels;
  }

  public static buildElectronShellSublevel (n: number = 4, l: number = 0): ElectronSHellSublevel {
    const electrons: Array<[Electron, Electron]> = [];
    for (let m = -l; m <= l; m++) {
      electrons.push([{ n, l, m, ms: 0.5 }, { n, l, m, ms: -0.5 }]);
    }
    return electrons;
  }

  public static buildAtoms (): Array<Atom> {
    const atoms = [];
    for (let i = 1; i <= 118; i++) {
      atoms.push(this.buildAtom(i))
    }
    return atoms;
  }
}
