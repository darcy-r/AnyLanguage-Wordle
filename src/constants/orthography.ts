import { CONFIG } from './config'

export const ORTHOGRAPHY = [
  'a',
  'b',
  'd',
  'g',
  'h',
  'i',
  'j',
  'l',
  'm',
  'n',
  'r',
  'u',
  'w',
  'y',
  "'y",
  "'",
  '?',
]

if (CONFIG.normalization) {
  ORTHOGRAPHY.forEach(
    (val, i) => (ORTHOGRAPHY[i] = val.normalize(CONFIG.normalization))
  )
}
