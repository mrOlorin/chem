import Atom from './Atom'

export type QuantumNumbers = {
  n: number; // главное; энергетический уровень | размер орбитали; 1, 2, 3..
  l: number; // орбитальное; форма орбитали; 0–s, 1–p, 2–d, 3–f
  m: number; // магнитное; ориентация орбитали; -l..l
  ms: number; // спиновое; спин; -1/2 | 1/2
}

export default class Electron implements QuantumNumbers {
  public n: number;
  public l: number;
  public m: number;
  public ms: number;
  public atom?: Atom;

  public constructor (props: QuantumNumbers, atom?: Atom) {
    this.n = props.n;
    this.l = props.l;
    this.m = props.m;
    this.ms = props.ms;
    this.atom = atom;
  }

  // Константа Ридберга
  public get R () {
    return this.atom ? this.atom.R : 0;
  }

  public get rBohr () {
    return this.atom ? this.atom.electronRadius(this) : 0;
  }

  public get v () {
    return this.atom ? this.atom.electronVelocity(this) : 0;
  }

  public get energy () {
    return this.atom ? this.atom.electronEnergy(this) : 0;
  }
}