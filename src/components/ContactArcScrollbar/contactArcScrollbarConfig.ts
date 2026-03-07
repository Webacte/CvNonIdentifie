/**
 * Config géométrie et comportement de la scrollbar courbe (contact textarea).
 * Modifier ici : courbe du track, viewBox, rotation du thumb.
 * Candidats futurs pour responsiveTokens : viewBoxWidth/Height, trackStart/Curve/End.
 *
 * Affiner le track soi-même :
 * - Le path = M (start) → Q (contrôle1, fin1) → Q (contrôle2, fin2).
 * - Plus le point de contrôle (Cp) est éloigné de la droite entre début et fin de la courbe,
 *   plus l’arrondi est marqué. Le rapprocher de cette droite rend la courbe plus plate.
 * - Première courbe (trackCurve1*) : arrondi en haut. Modifier CpX/CpY pour accentuer
 *   ou adoucir ; modifier EndX/EndY pour où la courbe “atterrit”.
 * - Deuxième courbe (trackCurve2*) : arrondi du milieu vers le bas. Même logique.
 * - Pour garder une courbe fluide, faire évoluer les valeurs par petits pas.
 */

export const contactArcScrollbarConfig = {
  /** viewBox SVG (largeur / hauteur) */
  viewBoxWidth: 100,
  viewBoxHeight: 400,

  /** Path : point de départ M */
  trackStartX: 70,
  trackStartY: 0,

  /** Première courbe Q : point de contrôle (tire la courbe → arrondi plus marqué si éloigné de la corde) et point d'arrivée */
  trackCurve1CpX: 30,
  trackCurve1CpY: 60,
  trackCurve1EndX: 20,
  trackCurve1EndY: 200,

  /** Deuxième courbe Q : point de contrôle et point d'arrivée */
  trackCurve2CpX: 15,
  trackCurve2CpY: 300,
  trackCurve2EndX: 20,
  trackCurve2EndY: 400,

  /** Limites progression thumb (0..1) */
  thumbMinProgress: 0,
  thumbMaxProgress: 1,

  /** Rotation du thumb : suivre la tangente du path */
  thumbRotationFromPath: true,
  /** Offset manuel de rotation en degrés */
  thumbRotationManualOffset: 0,
  /** Delta de longueur pour calculer la tangente (getPointAtLength(t) vs getPointAtLength(t+delta)) */
  thumbTangentDelta: 2,

  debugPath: false,
} as const

export type ContactArcScrollbarConfig = typeof contactArcScrollbarConfig

/** Génère l'attribut `d` du path SVG à partir de la config. Modifier la courbe via contactArcScrollbarConfig. */
export function getContactArcScrollbarPathD(
  config: ContactArcScrollbarConfig
): string {
  const {
    trackStartX,
    trackStartY,
    trackCurve1CpX,
    trackCurve1CpY,
    trackCurve1EndX,
    trackCurve1EndY,
    trackCurve2CpX,
    trackCurve2CpY,
    trackCurve2EndX,
    trackCurve2EndY,
  } = config
  return [
    `M ${trackStartX} ${trackStartY}`,
    `Q ${trackCurve1CpX} ${trackCurve1CpY} ${trackCurve1EndX} ${trackCurve1EndY}`,
    `Q ${trackCurve2CpX} ${trackCurve2CpY} ${trackCurve2EndX} ${trackCurve2EndY}`,
  ].join(' ')
}
