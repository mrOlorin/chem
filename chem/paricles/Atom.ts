import Nucleus from './Nucleus';
import ELECTRON_ORBITALS from '../literals/electronOrbitals';
import Electron, { QuantumNumbers } from './Electron';
import Utils from '../../utils/Utils';
import { c, e, FOUR_PI_ε0, kg, ħj } from '../literals/constants'

export type ElectronShell = Array<ElectronSHellSublevel>;

export type ElectronSHellSublevel = Array<[Electron, Electron]>;

export default class Atom {
  public readonly nucleus: Nucleus;
  public readonly electrons: Array<Electron> = [];
  public readonly energyLevels: Array<Array<number>> = [];

  public constructor (nucleus: Nucleus) {
    this.nucleus = nucleus;
    const electrons = Atom.quantumNumbersGenerator();
    for (let i = 0; i < this.nucleus.Z; i++) {
      const electron = new Electron(electrons.next().value, this);
      this.electrons.push(electron);
      if (!this.energyLevels[electron.n]) {
        this.energyLevels[electron.n] = [];
      }
      this.energyLevels[electron.n][electron.l] = (this.energyLevels[electron.n][electron.l] || 0) + 1;
    }
  }

  public static byEnergyLevel = (acc: Array<Array<Atom>>, atom: Atom) => {
    if (!acc[atom.maxN]) acc[atom.maxN] = [];
    acc[atom.maxN].push(atom);
    return acc;
  };

  public get outerElectrons (): Array<Electron> {
    const outerLevel = this.maxN;
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

  public get maxN (): number {
    return this.electrons.reduce((maxN: number, electron: Electron) => Math.max(electron.n, maxN), this.electrons[0].n);
  }

  public shell (n: number) {
    return this.electrons.filter(e => e.n === n);
  }

  public subShell (n: number, l: number) {
    return this.electrons.filter(e => e.n === n && e.l === l);
  }

  public electronsOnShell = (n: number) => this.shell(n).length;
  public static maxElectronsOnShell = (n: number) => 2 * (n ** 2);
  public static maxElectronsOnSubShell = (l: number) => 2 * (2 * l + 1);

  public get outerVacantLevel (): number {
    const reducer = (maxN: number, electron: Electron) =>
      this.electronsOnShell(electron.n) <= Atom.maxElectronsOnSubShell(electron.l) ? Math.max(electron.n, maxN) : electron.n;
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
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => n + 'spdf'[l] + Utils.superPower(count)
      ).join('')
    ).join('');
  }

  public get electronConfigurationTex (): string {
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => n + 'spdf'[l] + ` ^ ${count}`
      ).join('')
    ).join('');
  }

  public get electronConfigurationShort (): string {
    const outerLevel = this.maxN;
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => (count < 2 * (2 * l + 1) || n === outerLevel) ? (n + 'spdf'[l] + Utils.superPower(count)) : ''
      ).join('')
    ).join('');
  }

  public get electronConfigurationShortTex (): string {
    const outerLevel = this.maxN;
    return this.energyLevels.map(
      (energySublevel: any, n: any) => energySublevel.map(
        (count: any, l: any) => (count < 2 * (2 * l + 1) || n === outerLevel) ? (n + 'spdf'[l] + ` ^ ${count}`) : ''
      ).join('')
    ).join('');
  }

  public static * quantumNumbersGenerator (): IterableIterator<QuantumNumbers> {
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
    const electrons = Atom.quantumNumbersGenerator();
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

  public get R () {
    return (1 / (FOUR_PI_ε0 ** 2)) * ((Electron.mass * kg * (e ** 4)) / (4 * Math.PI * (ħj ** 3) * c));
  }

  public electronRadiusOnLevel (n: number) {
    return FOUR_PI_ε0 * ((ħj ** 2) / (Electron.mass * kg * (e ** 2) * this.Z)) * (n ** 2);
  }

  public electronVelocityOnLevel (n: number) {
    return ((1 / FOUR_PI_ε0)) * ((this.Z * (e ** 2)) / (n * ħj));
  }

  public energyOnLevel (n: number) {
    return (1 / (FOUR_PI_ε0 ** 2)) * ((Electron.mass * kg * (this.Z ** 2) * (e ** 4)) / (2 * Math.PI * (n ** 2)));
  }
}
