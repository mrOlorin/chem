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

  public sphericalHarmonics (p: THREE.Vector3): number {
    return this.electrons.reduce((sh, e: Electron) => sh * this.sphericalHarmonic[e.l][e.m](p), 1);
  }

  // http://en.wikipedia.org/wiki/Table_of_spherical_harmonics#Real_spherical_harmonics
  private sphericalHarmonic: { [l: number]: { [m: number]: (p: THREE.Vector3) => number } } = {
    0: {
      0: () => 0.28
    },
    1: {
      [-1]: p => 0.49 * (p.y / p.length()),
      [0]: p => 0.49 * (p.z / p.length()),
      [1]: p => 0.49 * (p.x / p.length())
    },
    2: {
      [-2]: p => 1.09 * ((p.x * p.y) / (p.length() ** 2)),
      [-1]: p => 1.09 * ((p.y * p.z) / (p.length() ** 2)),
      [0]: p => 0.49 * 0.32 * ((-(p.x * p.x) - (p.y * p.y) + 2.0 * (p.z * p.z)) / (p.length() ** 2)),
      [1]: p => 0.49 * ((p.z * p.x) / (p.length() ** 2)),
      [2]: p => 0.49 * (((p.x * p.x) - (p.y * p.y)) / (p.length() ** 2))
    },
    3: {
      [-3]: p => 0.59 * (((3.0 * p.x * p.x - p.y * p.y) * p.y) / (p.length() ** 3)),
      [-2]: p => 2.89 * ((p.x * p.y * p.z) / (p.length() ** 3)),
      [-1]: p => 0.46 * ((p.y * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (p.length() ** 3)),
      [0]: p => 0.37 * ((p.z * (2.0 * p.z * p.z - 3.0 * p.x * p.x - 3.0 * p.y * p.y)) / (p.length() ** 3)),
      [1]: p => 0.46 * ((p.x * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (p.length() ** 3)),
      [2]: p => 1.45 * (((p.x * p.x - p.y * p.y) * p.z) / (p.length() ** 3)),
      [3]: p => 0.59 * (((p.x * p.x - 3.0 * p.y * p.y) * p.x) / (p.length() ** 3))
    },
    4: {
      [-4]: p => 2.50 * (((p.x * p.y) * (p.x * p.x - p.y * p.y)) / (p.length() ** 4)),
      [-3]: p => 1.77 * (((3. * (p.x * p.x) - (p.y * p.y)) * p.y * p.z) / (p.length() ** 4)),
      [-2]: p => 0.95 * (((p.x * p.y) * (7. * (p.z * p.z) - (p.length() ** 2))) / (p.length() ** 4)),
      [-1]: p => 0.67 * (((p.y * p.z) * (7. * (p.z * p.z) - 3. * (p.length() ** 2))) / (p.length() ** 4)),
      [0]: p => 0.11 * ((35. * (p.z * p.z * p.z * p.z) - 30. * (p.z * p.z) * (p.length() ** 2) + 3. * (p.length() ** 4)) / (p.length() ** 4)),
      [1]: p => 0.67 * (((p.x * p.z) * (7. * p.z * p.z - 3. * (p.length() ** 2))) / (p.length() ** 4)),
      [2]: p => 0.47 * (((p.x * p.x - p.y * p.y) * (7. * (p.z * p.z) - (p.length() ** 2))) / (p.length() ** 4)),
      [3]: p => 1.77 * (((p.x * p.x - 3. * (p.y * p.y)) * p.x * p.z) / (p.length() ** 4)),
      [4]: p => 0.63 * (((p.x * p.x) * (p.x * p.x - 3. * (p.y * p.y)) - (p.y * p.y) * (3. * (p.x * p.x) - p.y * p.y)) / (p.length() ** 4))
    }
  }
}
