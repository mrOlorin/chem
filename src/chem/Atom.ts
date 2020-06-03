import Nucleus from '@/chem/Nucleus';
import ELECTRON_ORBITALS from '@/chem/literals/electronOrbitals';

export interface Electron {
  n: number; // главное; энергетический уровень | размер орбитали; 1..
  l: number; // орбитальное; форма орбитали; 0–s, 1–p, 2–d, 3–f
  m: number; // магнитное; ориентация орбитали; -l..l
  ms: number; // спиновое; спин; -1/2 | 1/2
}

const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷', '¹⁸', '¹⁹'];

export default class Atom {
  public readonly nucleus: Nucleus;
  public readonly electrons: Array<Electron> = [];
  public readonly energyLevels: Array<Array<number>> = [];

  public constructor (nucleus: Nucleus) {
    this.nucleus = nucleus;
    const electrons = Atom.electronGenerator();
    for (let i = 0; i < this.nucleus.Z; i++) {
      const electron = electrons.next().value;
      this.electrons.push(electron);
      if (!this.energyLevels[electron.n]) {
        this.energyLevels[electron.n] = [];
      }
      this.energyLevels[electron.n][electron.l] = (this.energyLevels[electron.n][electron.l] || 0) + 1;
    }
  }

  public get mass (): number {
    return this.nucleus.mass + this.electrons.length * 0.51099895; // МэВ
  }

  public get outerLevel () {
    const reducer = (maxN: number, electron: Electron) => Math.max(electron.n, maxN);
    return this.electrons.reduce(reducer, this.electrons[0].n);
  }

  public get electronConfiguration (): string {
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => n + 'spdf'[l] + SUP[count]
      ).join('')
    ).join('');
  }

  public get electronConfigurationShort (): string {
    const outerLevel = this.outerLevel;
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => (count < 2 * (2 * l + 1) || n === outerLevel) ? (n + 'spdf'[l] + SUP[count]) : ''
      ).join('')
    ).join('');
  }

  public static * electronGenerator (): IterableIterator<Electron> {
    // TODO: Провал электрона мб?
    for (let x = 1, isEven = 0; ; x += isEven, isEven = 1 - isEven) {
      for (let n = x, l = x - (2 - isEven), ms = 0.5; l >= 0; n += +(ms < 0), l -= +(ms < 0), ms = -ms) {
        for (let m = -l; m <= l; m++) yield { n, l, m, ms };
      }
    }
  }

  public static testElectronGenerator () {
    const compare = (e1: Electron, e2: typeof ELECTRON_ORBITALS[0]) => {
      return e1.n === e2[0] && e1.l === e2[1] && e1.m === e2[2] && e1.ms === e2[3];
    };
    const electrons = Atom.electronGenerator();
    const n = 118;
    for (let i = 0; i < n; i++) {
      const toCheck = electrons.next().value;
      const isEq = compare(toCheck, ELECTRON_ORBITALS[i]);
      const message = '%c ' +
        Object.values(ELECTRON_ORBITALS[i]).join(',') +
        (isEq ? ' = ' : ' != ') +
        Object.values(toCheck).join(',');
      if (isEq) {
        // console.log(message, 'color: #007700;');
      } else {
        console.log(message, 'color: #aa0000;');
      }
    }
  }
}
