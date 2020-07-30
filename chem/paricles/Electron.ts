import { c, e, ε0, ħj, electronMassKg } from '../literals/constants'
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
  public atom: Atom;

  public constructor (props: QuantumNumbers, atom: Atom) {
    this.n = props.n;
    this.l = props.l;
    this.m = props.m;
    this.ms = props.ms;
    this.atom = atom;
  }

  // Константа Ридберга
  public get R () {
    return (1 / ((4 * Math.PI * ε0) ** 2)) * ((electronMassKg * (e ** 4)) / (4 * Math.PI * (ħj ** 3) * c));
  }

  public get rBohr () {
    return (4 * Math.PI * ε0) * ((ħj ** 2) / (electronMassKg * (e ** 2) * this.atom.Z)) * (this.n ** 2);
  }

  public get v () {
    return ((1 / (4 * Math.PI * ε0))) * ((this.atom.Z * (e ** 2)) / (this.n * ħj));
  }

  public get energy () {
    return (1 / ((4 * Math.PI * ε0) ** 2)) * ((electronMassKg * (this.atom.Z ** 2) * (e ** 4)) / (2 * Math.PI * (this.n ** 2)));
  }
}