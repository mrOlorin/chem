//https://ru.wikipedia.org/wiki/Список_химических_элементов_по_электронной_конфигурации
const ELECTRON_CONFIGURATIONS: Array<[string, string, Array<number>]> = [
  ['0s0', '0s0', [0]],
  ['1s¹', '1s¹', [1]],
  ['1s²', '1s²', [2]],
  ['1s²2s¹', '1s²2s¹', [2, 1]],
  ['1s²2s²', '1s²2s²', [2, 2]],
  ['1s²2s²2p¹', '1s²2s²2p¹', [2, 3]],
  ['1s²2s²2p²', '1s²2s²2p²', [2, 4]],
  ['1s²2s²2p³', '1s²2s²2p³', [2, 5]],
  ['1s²2s²2p⁴', '1s²2s²2p⁴', [2, 6]],
  ['1s²2s²2p⁵', '1s²2s²2p⁵', [2, 7]],
  ['1s²2s²2p⁶', '1s²2s²2p⁶', [2, 8]],
  ['3s¹', '1s²2s²2p⁶3s¹', [2, 8, 1]],
  ['3s²', '1s²2s²2p⁶3s²', [2, 8, 2]],
  ['3s²3p¹', '1s²2s²2p⁶3s²3p¹', [2, 8, 3]],
  ['3s²3p²', '1s²2s²2p⁶3s²3p²', [2, 8, 4]],
  ['3s²3p³', '1s²2s²2p⁶3s²3p³', [2, 8, 5]],
  ['3s²3p⁴', '1s²2s²2p⁶3s²3p⁴', [2, 8, 6]],
  ['3s²3p⁵', '1s²2s²2p⁶3s²3p⁵', [2, 8, 7]],
  ['3s²3p⁶', '1s²2s²2p⁶3s²3p⁶', [2, 8, 8]],
  ['4s¹', '1s²2s²2p⁶3s²3p⁶4s¹', [2, 8, 8, 1]],
  ['4s²', '1s²2s²2p⁶3s²3p⁶4s²', [2, 8, 8, 2]],
  ['3d¹⁴s²', '1s²2s²2p⁶3s²3p⁶3d¹⁴s²', [2, 8, 9, 2]],
  ['3d²4s²', '1s²2s²2p⁶3s²3p⁶3d²4s²', [2, 8, 10, 2]],
  ['3d³4s²', '1s²2s²2p⁶3s²3p⁶3d³4s²', [2, 8, 11, 2]],
  ['3d⁵4s¹', '1s²2s²2p⁶3s²3p⁶3d⁵4s¹', [2, 8, 13, 1]],
  ['3d⁵4s²', '1s²2s²2p⁶3s²3p⁶3d⁵4s²', [2, 8, 13, 2]],
  ['3d⁶4s²', '1s²2s²2p⁶3s²3p⁶3d⁶4s²', [2, 8, 14, 2]],
  ['3d⁷4s²', '1s²2s²2p⁶3s²3p⁶3d⁷4s²', [2, 8, 15, 2]],
  ['3d⁸4s²', '1s²2s²2p⁶3s²3p⁶3d⁸4s²', [2, 8, 16, 2]],
  ['3d¹⁰4s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s¹', [2, 8, 18, 1]],
  ['3d¹⁰4s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²', [2, 8, 18, 2]],
  ['3d¹⁰4s²4p¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p¹', [2, 8, 18, 3]],
  ['3d¹⁰4s²4p²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p²', [2, 8, 18, 4]],
  ['3d¹⁰4s²4p³', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p³', [2, 8, 18, 5]],
  ['3d¹⁰4s²4p⁴', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁴', [2, 8, 18, 6]],
  ['3d¹⁰4s²4p⁵', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁵', [2, 8, 18, 7]],
  ['3d¹⁰4s²4p⁶', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶', [2, 8, 18, 8]],
  ['5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶5s¹', [2, 8, 18, 8, 1]],
  ['5s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶5s²', [2, 8, 18, 8, 2]],
  ['4d¹5s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹5s²', [2, 8, 18, 9, 2]],
  ['4d²5s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d²5s²', [2, 8, 18, 10, 2]],
  ['4d⁴5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁴5s¹', [2, 8, 18, 12, 1]],
  ['4d⁵5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁵5s¹', [2, 8, 18, 13, 1]],
  ['4d⁵5s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁵5s²', [2, 8, 18, 13, 2]],
  ['4d⁷5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁷5s¹', [2, 8, 18, 15, 1]],
  ['4d⁸5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d⁸5s¹', [2, 8, 18, 16, 1]],
  ['4d¹⁰', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰', [2, 8, 18, 18]],
  ['4d¹⁰5s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s¹', [2, 8, 18, 18, 1]],
  ['4d¹⁰5s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²', [2, 8, 18, 18, 2]],
  ['4d¹⁰5s²5p¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p¹', [2, 8, 18, 18, 3]],
  ['4d¹⁰5s²5p²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p²', [2, 8, 18, 18, 4]],
  ['4d¹⁰5s²5p³', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p³', [2, 8, 18, 18, 5]],
  ['4d¹⁰5s²5p⁴', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁴', [2, 8, 18, 18, 6]],
  ['4d¹⁰5s²5p⁵', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁵', [2, 8, 18, 18, 7]],
  ['4d¹⁰5s²5p⁶', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶', [2, 8, 18, 18, 8]],
  ['6s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶6s¹', [2, 8, 18, 18, 8, 1]],
  ['6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶6s²', [2, 8, 18, 18, 8, 2]],
  ['5d¹6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰5s²5p⁶5d¹6s²', [2, 8, 18, 18, 9, 2]],
  ['4f26s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f²5s²5p⁶6s²', [2, 8, 18, 20, 8, 2]],
  ['4f³6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f³5s²5p⁶6s²', [2, 8, 18, 21, 8, 2]],
  ['4f⁴6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁴5s²5p⁶6s²', [2, 8, 18, 22, 8, 2]],
  ['4f⁵6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁵5s²5p⁶6s²', [2, 8, 18, 23, 8, 2]],
  ['4f⁶6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁶5s²5p⁶6s²', [2, 8, 18, 24, 8, 2]],
  ['4f⁷6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁷5s²5p⁶6s²', [2, 8, 18, 25, 8, 2]],
  ['4f⁷5d¹6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁷5s²5p⁶5d¹6s²', [2, 8, 18, 25, 9, 2]],
  ['4f⁹6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f⁹5s²5p⁶6s²', [2, 8, 18, 27, 8, 2]],
  ['4f¹⁰6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁰5s²5p⁶6s²', [2, 8, 18, 28, 8, 2]],
  ['4f¹16s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹15s²5p⁶6s²', [2, 8, 18, 29, 8, 2]],
  ['4f¹26s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹25s²5p⁶6s²', [2, 8, 18, 30, 8, 2]],
  ['4f¹36s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹35s²5p⁶6s²', [2, 8, 18, 31, 8, 2]],
  ['4f¹⁴6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶6s²', [2, 8, 18, 32, 8, 2]],
  ['4f¹⁴5d¹6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹6s²', [2, 8, 18, 32, 9, 2]],
  ['4f¹⁴5d²6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d²6s²', [2, 8, 18, 32, 10, 2]],
  ['4f¹⁴5d³6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d³6s²', [2, 8, 18, 32, 11, 2]],
  ['4f¹⁴5d⁴6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁴6s²', [2, 8, 18, 32, 12, 2]],
  ['4f¹⁴5d⁵6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁵6s²', [2, 8, 18, 32, 13, 2]],
  ['4f¹⁴5d⁶6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁶6s²', [2, 8, 18, 32, 14, 2]],
  ['4f¹⁴5d⁷6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁷6s²', [2, 8, 18, 32, 15, 2]],
  ['4f¹⁴5d⁹6s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d⁹6s¹', [2, 8, 18, 32, 17, 1]],
  ['4f¹⁴5d¹⁰6s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s¹', [2, 8, 18, 32, 18, 1]],
  ['4f¹⁴5d¹⁰6s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²', [2, 8, 18, 32, 18, 2]],
  ['4f¹⁴5d¹⁰6s²6p¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p¹', [2, 8, 18, 32, 18, 3]],
  ['4f¹⁴5d¹⁰6s²6p²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p²', [2, 8, 18, 32, 18, 4]],
  ['4f¹⁴5d¹⁰6s²6p³', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p³', [2, 8, 18, 32, 18, 5]],
  ['4f¹⁴5d¹⁰6s²6p⁴', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁴', [2, 8, 18, 32, 18, 6]],
  ['4f¹⁴5d¹⁰6s²6p⁵', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁵', [2, 8, 18, 32, 18, 7]],
  ['4f¹⁴5d¹⁰6s²6p⁶', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶', [2, 8, 18, 32, 18, 8]],
  ['7s¹', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶7s¹', [2, 8, 18, 32, 18, 8, 1]],
  ['7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶7s²', [2, 8, 18, 32, 18, 8, 2]],
  ['6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶6d¹7s²', [2, 8, 18, 32, 18, 9, 2]],
  ['6d²7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰6s²6p⁶6d²7s²', [2, 8, 18, 32, 18, 10, 2]],
  ['5f²6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f²6s²6p⁶6d¹7s²', [2, 8, 18, 32, 20, 9, 2]],
  ['5f³6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f³6s²6p⁶6d¹7s²', [2, 8, 18, 32, 21, 9, 2]],
  ['5f⁴6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁴6s²6p⁶6d¹7s²', [2, 8, 18, 32, 22, 9, 2]],
  ['5f⁶7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁶6s²6p⁶7s²', [2, 8, 18, 32, 24, 8, 2]],
  ['5f⁷7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁷6s²6p⁶7s²', [2, 8, 18, 32, 25, 8, 2]],
  ['5f⁷6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁷6s²6p⁶6d¹7s²', [2, 8, 18, 32, 25, 9, 2]],
  ['5f⁹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f⁹6s²6p⁶7s²', [2, 8, 18, 32, 27, 8, 2]],
  ['5f¹⁰7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁰6s²6p⁶7s²', [2, 8, 18, 32, 28, 8, 2]],
  ['5f¹17s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹16s²6p⁶7s²', [2, 8, 18, 32, 29, 8, 2]],
  ['5f¹27s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹26s²6p⁶7s²', [2, 8, 18, 32, 30, 8, 2]],
  ['5f¹37s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹36s²6p⁶7s²', [2, 8, 18, 32, 31, 8, 2]],
  ['5f¹⁴7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶7s²', [2, 8, 18, 32, 32, 8, 2]],
  ['5f¹⁴6d¹7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d¹7s²', [2, 8, 18, 32, 32, 9, 2]],
  ['5f¹⁴6d²7s²', '1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁶4d¹⁰4f¹⁴5s²5p⁶5d¹⁰5f¹⁴6s²6p⁶6d²7s²', [2, 8, 18, 32, 32, 10, 2]]
];
export default ELECTRON_CONFIGURATIONS;