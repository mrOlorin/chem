import Nucleus, { Parity } from './Nucleus'

export default class NucleusCached extends Nucleus {
  private cache: { [key in keyof Nucleus]?: any } = {};

  private cached<T extends keyof Nucleus> (prop: T) {
    if (!this.cache[prop]) {
      this.cache[prop] = super[prop];
    }
    return this.cache[prop];
  }

  public get name (): string {
    return this.cached('name');
  }

  public get Z (): number {
    return this.cached('Z');
  }

  public get electricCharge (): number {
    return this.cached('electricCharge');
  }

  public get N (): number {
    return this.cached('N');
  }

  public get A (): number {
    return this.cached('A');
  }

  public get R (): number {
    return this.cached('R');
  }

  public get surfaceArea (): number {
    return this.cached('surfaceArea');
  }

  public get spin (): number {
    return this.cached('spin');
  }

  public get mass (): number {
    return this.cached('mass');
  }

  public get parity (): Parity {
    return this.cached('parity');
  }

  public get bindingEnergy (): number {
    return this.cached('bindingEnergy');
  }

  public get magneticMoment (): number {
    return this.cached('magneticMoment');
  }
}
