const QUARKS: {
  [key: string]: {
    electricCharge: number,
    spin: number,
    isospin: number,
    mass: number, // МэВ/c²
  }
} = {
  down: {
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 4.8,
  },
  up: {
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 2.3,
  },

  strange: {
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 95,
  },
  charm: {
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 1275,
  },

  beauty: {
    electricCharge: -1 / 3,
    spin: 1 / 2,
    isospin: -1 / 2,
    mass: 4180,
  },
  truth: {
    electricCharge: 2 / 3,
    spin: 1 / 2,
    isospin: 1 / 2,
    mass: 174340,
  }
};
export default QUARKS;
