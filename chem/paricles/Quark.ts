export default class Quark {
  readonly electricCharge: number;
  readonly spin: number;
  readonly isospin: number;
  readonly mass: number;
  readonly constituentMass: number;
  readonly charm: number;
  readonly strangeness: number;
  readonly topness: number;
  readonly bottomness: number;

  constructor (props: Quark) {
    this.electricCharge = props.electricCharge;
    this.spin = props.spin;
    this.isospin = props.isospin;
    this.mass = props.mass;
    this.constituentMass = props.constituentMass;
    this.charm = props.charm;
    this.strangeness = props.strangeness;
    this.topness = props.topness;
    this.bottomness = props.bottomness;
  }
}
