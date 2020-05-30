import Nucleus from '@/chem/Nucleus';
import ELECTRON_ORBITALS from '@/chem/literals/electronOrbitals';

export interface Electron {
  n: number; // главное; энергетический уровень | размер орбитали
  l: number; // орбитальное; форма орбитали
  m: number; // магнитное; ориентация орбитали
  ms: number; // спиновое; спин
}

export default class Atom {
  public readonly nucleus: Nucleus;
  public readonly electrons: Array<Electron> = [];

  public constructor (nucleus: Nucleus) {
    this.nucleus = nucleus;
    const electrons = Atom.electronGenerator();
    for (let i = 0; i < this.nucleus.Z; i++) {
      this.electrons.push(electrons.next().value);
    }
  }

  public get mass () : number {
    return this.nucleus.mass + this.electrons.length * 0.51099895; // МэВ
  }

  public get outerLevel () {
    const reducer = (maxN: number, electron: Electron) => Math.max(electron.n, maxN);
    return this.electrons.reduce(reducer, this.electrons[0].n);
  }

  public get electronConfiguration (): string {
    const energyLevel: Array<any> = [];
    for (const electron of this.electrons) {
      if (!energyLevel[electron.n]) {
        energyLevel[electron.n] = [];
      }
      energyLevel[electron.n][electron.l] = (energyLevel[electron.n][electron.l] || 0) + 1;
    }
    const sup = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷', '¹⁸', '¹⁹'];
    return energyLevel.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => n + 'spdf'[l] + sup[count]
      ).join('')
    ).join('');
  }

  public get electronConfigurationShort (): string {
    const config = this.electronConfiguration;
    return config.substring(config.indexOf('' + this.outerLevel));
  }

  public static * electronGenerator (): IterableIterator<Electron> {
    // TODO: Провал электрона мб?
    let spinUp = 1;
    let ms = 0.5;
    for (let x = 1, isEven = 0; ; x += isEven, isEven = 1 - isEven) {
      let n = x;
      for (let l = x - (2 - isEven); l >= 0; l -= spinUp) {
        spinUp = 1 - spinUp;
        for (let m = -l; m <= l; m++) yield { n, l, m, ms };
        ms = -ms;
        n += spinUp;
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
