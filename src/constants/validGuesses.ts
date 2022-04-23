import { CONFIG } from './config'

export const VALIDGUESSES = [
  'yaama',
  'yaluu',
  'gamil',
  'minya',
  'wanda',
  'miyay',
  'dhina',
  'mubal',
  'ngaay',
]

if (CONFIG.normalization) {
  VALIDGUESSES.forEach(
    (val, i) => (VALIDGUESSES[i] = val.normalize(CONFIG.normalization))
  )
}
