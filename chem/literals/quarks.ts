const QUARKS: {
  [key: string]: {
    electricCharge: number;
    spin: number;
    isospin: number;
    mass: number; // МэВ/c²
    constituentMass: number;
    charm: number;
    strangeness: number;
    topness: number;
    bottomness: number;
  }
} = {
  down: {
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 4.8,
    constituentMass: 340,
    charm: 0,
    strangeness: 0,
    topness: 0,
    bottomness: 0,
  },
  up: {
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 2.3,
    constituentMass: 336,
    charm: 0,
    strangeness: 0,
    topness: 0,
    bottomness: 0,
  },

  strange: {
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 95,
    constituentMass: 486,
    charm: 0,
    strangeness: -1,
    topness: 0,
    bottomness: 0,
  },
  charm: {
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 1275,
    constituentMass: 1550,
    charm: 1,
    strangeness: 0,
    topness: 0,
    bottomness: 0,
  },

  beauty: { // Bottom
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 4180,
    constituentMass: 4730,
    charm: 0,
    strangeness: 0,
    topness: 1,
    bottomness: 0,
  },
  truth: { // Top
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 174340,
    constituentMass: 177000,
    charm: 0,
    strangeness: 0,
    topness: 0,
    bottomness: -1,
  }
};
export default QUARKS;
