export default class Quark {
  readonly electricCharge: number;
  readonly spin: number;
  readonly isospin: number;
  readonly mass: number;

  constructor (props: Quark) {
    this.electricCharge = props.electricCharge;
    this.spin = props.spin;
    this.isospin = props.isospin;
    this.mass = props.mass;
  }
}
