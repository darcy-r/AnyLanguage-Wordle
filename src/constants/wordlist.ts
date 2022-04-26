import { CONFIG } from './config'

export const WORDS = [
  'gamil', 'gilaa', 'dhina', 'yiili', 'gurru', 'madja', 'ngaya', 'nguru',
  'yulay', 'guwaa', 'balal', 'bagay', 'bilay', 'gugil', 'dhula', 'gayaa',
  'maaru', 'bundi', 'mayan', 'guduu', 'dhuru', 'yugal', 'milan', 'wagun',
  'buurr', 'balaa', 'ganay', 'yilaa', 'nguwa', 'minya', 'biyal', 'ngulu',
  'giirr', 'dhuga', 'galay', 'banay', 'nhuwi', 'biiba', 'bibil', 'ngama',
  'maang', 'yiyal', 'dhulu', 'gulay', 'mirri', 'yaama', 'wanda', 'bigal',
  'dhaal', 'mubal', 'dhiin', 'muurr', 'gurra', 'wamba', 'ngamu', 'baril',
  'ngaay', 'wulan', 'warru', 'gunii', 'biruu', 'nhama', 'wawal', 'nginu',
  'gabaa', 'bagii', 'buyal', 'dhaya', 'waabi', 'garra', 'gumay', 'budhi',
  'guway', 'baayl', 'murru', 'wudha', 'gayrr', 'mirii', 'dhaay', 'wugan',
  'wanaa', 'munhi', 'ganal', 'garay', 'giyal', 'baraa', 'dhuwi', 'bamba',
  'maala', 'badha', 'gilay', 'yabaa', 'yaray', 'ngali', 'gagil', 'muwan',
  'yaluu', 'bubaa',
]

if (CONFIG.normalization) {
  WORDS.forEach((val, i) => (WORDS[i] = val.normalize(CONFIG.normalization)))
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

if (CONFIG.shuffle) {
  shuffle(WORDS)
}
