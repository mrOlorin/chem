import Nucleus from './Nucleus'
import ELECTRON_ORBITALS from '../literals/electronOrbitals'

export type Electron = {
  n: number; // главное; энергетический уровень | размер орбитали; 1..
  l: number; // орбитальное; форма орбитали; 0–s, 1–p, 2–d, 3–f
  m: number; // магнитное; ориентация орбитали; -l..l
  ms: number; // спиновое; спин; -1/2 | 1/2
}

export type ElectronShell = Array<ElectronSHellSublevel>;

export type ElectronSHellSublevel = Array<[Electron, Electron]>;

const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷', '¹⁸', '¹⁹'];

export default class Atom {
  public readonly nucleus: Nucleus;
  public readonly electrons: Array<Electron> = [];
  public readonly orbitals: Array<Array<number>> = [];

  public constructor (nucleus: Nucleus) {
    this.nucleus = nucleus;
    const electrons = Atom.electronGenerator();
    for (let i = 0; i < this.nucleus.Z; i++) {
      const electron = electrons.next().value;
      this.electrons.push(electron);
      if (!this.orbitals[electron.n]) {
        this.orbitals[electron.n] = [];
      }
      this.orbitals[electron.n][electron.l] = (this.orbitals[electron.n][electron.l] || 0) + 1;
    }
  }

  public get outerElectrons (): Array<Electron> {
    const outerLevel = this.outerLevel;
    const outerVacantLevel = this.outerVacantLevel;
    return this.electrons.filter(e => e.n === outerLevel || e.n > outerVacantLevel);
  };

  public get outerVacantElectrons (): Array<Electron> {
    const level = this.outerVacantLevel;
    return this.electrons.filter(e => e.n >= level);
  };

  public get mass (): number {
    return this.nucleus.mass + this.electrons.length * 0.51099895; // МэВ
  }

  public get outerLevel (): number {
    const reducer = (maxN: number, electron: Electron) => Math.max(electron.n, maxN);
    return this.electrons.reduce(reducer, this.electrons[0].n);
  }

  public get outerVacantLevel (): number {
    const sumReducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    const reducer = (maxN: number, electron: Electron) => this.orbitals[electron.n].reduce(sumReducer) <= 2 * (2 * electron.l + 1) ? Math.max(electron.n, maxN) : electron.n;
    return this.electrons.reduce(reducer, this.electrons[0].n);
  }

  // Постоянная экранирования
  public get S (): number {
    // TODO
    return 0;
  }

  // Эффективный атомарный номер
  public get Z (): number {
    return this.nucleus.Z - this.S;
  }

  public get electronConfiguration (): string {
    return this.orbitals.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => n + 'spdf'[l] + SUP[count]
      ).join('')
    ).join('');
  }

  public get electronConfigurationShort (): string {
    const outerLevel = this.outerLevel;
    return this.orbitals.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => (count < 2 * (2 * l + 1) || n === outerLevel) ? (n + 'spdf'[l] + SUP[count]) : ''
      ).join('')
    ).join('');
  }

  public static * electronGenerator (): IterableIterator<Electron> {
    // TODO: Провал электрона мб?
    for (let x = 1, isEven = 0; ; x += isEven, isEven = 1 - isEven) {
      for (let n = x, l = x - (2 - isEven), ms = 0.5; l >= 0; n += +(ms < 0), l += -(ms < 0), ms = -ms) {
        for (let m = -l; m <= l; m++) yield { n, l, m, ms };
      }
    }
  }

  public static testElectronGenerator (): void {
    const compare = (e1: Electron, e2: typeof ELECTRON_ORBITALS[0]) => {
      return e1.n === e2[0] && e1.l === e2[1] && e1.m === e2[2] && e1.ms === e2[3];
    };
    const electrons = Atom.electronGenerator();
    const n = 118;
    const result = [];
    for (let i = 0; i < n; i++) {
      const toCheck = electrons.next().value;
      const isCorrect = compare(toCheck, ELECTRON_ORBITALS[i]);
      result.push({
        predefined: JSON.stringify(ELECTRON_ORBITALS[i]),
        calculated: JSON.stringify(Object.values(toCheck)),
        isEqual: isCorrect
      });
    }
    console.table(result);
  }
}
