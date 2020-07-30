export default class Utils {

  public static SUPER_POWER: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };

  public static orderOfMagnitude = (n: number) =>
    Math.pow(10, Math.floor(Math.log(n) / Math.LN10 + Number.EPSILON));

  public static superPower = (n: number): string =>
    ((n < 0) ? '⁻' : '') + (('' + n).split('').map(char => Utils.SUPER_POWER[char]).join(''));

  public static roundSuperPower = (n: number, precision: number = 3): string => {
    let power = Math.floor(Math.log10(Math.abs(n)));
    const precisionPower = 10 ** precision;
    const rounded = Math.round((n * 10 ** -power + Number.EPSILON) * precisionPower) / precisionPower;
    return rounded + ' * 10' + Utils.superPower(power);
  }

}
