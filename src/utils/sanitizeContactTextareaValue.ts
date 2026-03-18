/**
 * Remplace les caractères accentués et ligatures françaises par leurs équivalents ASCII
 * pour assurer la compatibilité avec les polices qui ne les prennent pas en charge.
 */

const REPLACEMENTS: Array<[string | RegExp, string]> = [
  // Ligatures d'abord (éviter remplacements partiels)
  ['œ', 'oe'],
  ['Œ', 'OE'],
  ['æ', 'ae'],
  ['Æ', 'AE'],
  // Minuscules accentuées
  [/[àâäáãå]/g, 'a'],
  ['ç', 'c'],
  [/[éèêë]/g, 'e'],
  [/[îïìí]/g, 'i'],
  [/[ôöòóõ]/g, 'o'],
  [/[ùûüú]/g, 'u'],
  ['ÿ', 'y'],
  ['ñ', 'n'],
  // Majuscules accentuées
  [/[ÀÂÄÁÃÅ]/g, 'A'],
  ['Ç', 'C'],
  [/[ÉÈÊË]/g, 'E'],
  [/[ÎÏÌÍ]/g, 'I'],
  [/[ÔÖÒÓÕ]/g, 'O'],
  [/[ÙÛÜÚ]/g, 'U'],
  ['Ÿ', 'Y'],
  ['Ñ', 'N'],
]

export function sanitizeContactTextareaValue(value: string): string {
  let result = value
  for (const [search, replacement] of REPLACEMENTS) {
    result = result.replace(search, replacement)
  }
  return result
}
