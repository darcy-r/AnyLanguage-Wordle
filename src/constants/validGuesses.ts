import { CONFIG } from './config'

export const VALIDGUESSES = [
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
  VALIDGUESSES.forEach(
    (val, i) => (VALIDGUESSES[i] = val.normalize(CONFIG.normalization))
  )
}
