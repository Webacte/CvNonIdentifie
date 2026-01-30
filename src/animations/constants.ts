/**
 * Constantes partagées pour les animations de scroll.
 * Tous les réglages de timing et de seuils sont centralisés ici.
 */

// =============================================================================
// Scroll horizontal – blocs et phases
// Utilisées dans : horizontalScroll.ts (timeline, pin, phases)
// =============================================================================

/** Pixels de scroll pendant lesquels l’écran ne bouge pas au début (phase Présentation). Fusée/flamme s’animent pendant cette phase. */
/** Fin de la phase 1 (fusée) en px de scroll. L'écran reste fixe jusqu'à cette valeur (= fusée finit sa rotation), puis commence à se déplacer. */
export const SECOND_SECTION_BLOCK_START = 1000

/**
 * Proportion de l'animation fusée (0–1) à partir de laquelle l'écran commence à se déplacer.
 * Plus bas = l'écran suit plus tôt (fusée reste visible, ne sort pas à droite).
 * Ex. 0.35 = l'écran bouge quand la fusée est à 35 % de sa trajectoire.
 */
export const ROCKET_PAN_START_RATIO = 0.25

/** Fin du bloc « About » en px de scroll. = fin de la phase 2 (alien, hologramme). */
export const SECOND_SECTION_BLOCK_END = 2800

/** Début du bloc « Expérience » en px de scroll (scroll bloqué sur la section Expérience). */
export const THIRD_SECTION_BLOCK_START = 3100

/** Fin du bloc « Expérience » en px de scroll. */
export const THIRD_SECTION_BLOCK_END = 3800

/** Pixels de scroll après le bloc Expérience jusqu’à la fin. Utilisée dans : horizontalScroll.ts (durée du dernier mouvement). */
export const SCROLL_FROM_THIRD_BLOCK = 4800

/** Largeur de référence du viewport (px) pour le ratio de mise à l’échelle. Utilisée dans : horizontalScroll.ts, scrollAnimations.ts (fusée, flamme, fallback). */
export const VIEWPORT_REFERENCE_WIDTH = 1050

// =============================================================================
// Fusée (createRocketScrollAnimation)
// =============================================================================

/** Position X de référence (px) à partir de laquelle la fusée accélère. Utilisée dans : scrollAnimations.ts createRocketScrollAnimation (getAccelerateRocketX). */
export const ROCKET_ACCELERATE_X_REFERENCE = 450

/** Hauteur (px) à soustraire pour le point d’atterrissage sur tablette. Utilisée dans : scrollAnimations.ts getRocketEndY (601–768px). */
export const ROCKET_HEIGHT_PX = 300

/** Pourcentage de la hauteur du viewport pour le point d’atterrissage (desktop). Ex. 1.05 = 105%. Utilisée dans : scrollAnimations.ts getRocketEndY. */
export const ROCKET_END_Y_PERCENTAGE = 1.05

/** Progress (0–1) à laquelle le mouvement Y de la fusée se termine (desktop). Utilisée dans : scrollAnimations.ts getYCompletionProgress. */
export const ROCKET_Y_COMPLETION_PROGRESS = 1 / 3.8

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤375px. Utilisée dans : scrollAnimations.ts getYCompletionProgress. */
export const ROCKET_Y_COMPLETION_MOBILE_SMALL_FACTOR = 76 / 65

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤600px. Utilisée dans : scrollAnimations.ts getYCompletionProgress. */
export const ROCKET_Y_COMPLETION_MOBILE_FACTOR = 72 / 65

/** Seuil viewport (px) : en dessous, sol à 55% et atterrissage fusée à 55%. Utilisée dans : scrollAnimations.ts getRocketEndY, getYCompletionProgress. */
export const GROUND_LINE_425_MAX_WIDTH = 425

/** Pourcentage (0–1) hauteur viewport pour atterrissage fusée quand sol à 55% (≤425px). */
export const ROCKET_END_Y_PERCENTAGE_425 = 0.55

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤425px (sol à 55%). */
export const ROCKET_Y_COMPLETION_425_FACTOR = 55 / 65

/** Seuil viewport (px) : en dessous, atterrissage à 76% hauteur. Utilisée dans : scrollAnimations.ts getRocketEndY, getYCompletionProgress. */
export const MOBILE_SMALL_MAX_WIDTH = 375

/** Seuil viewport (px) : en dessous, atterrissage à 72% hauteur. Utilisée dans : scrollAnimations.ts getRocketEndY, getYCompletionProgress. */
export const MOBILE_MAX_WIDTH = 600

/** Seuil viewport (px) : tablette, atterrissage remonté d’une hauteur fusée. Utilisée dans : scrollAnimations.ts getRocketEndY. */
export const TABLET_MAX_WIDTH = 768

/** Coefficient pour le mouvement horizontal de la fusée (progress X). Utilisée dans : scrollAnimations.ts updateRocketPositionX. */
export const ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER = 3

/** Valeur minimale (px) pour rocketEndX si le ratio donne moins. Utilisée dans : scrollAnimations.ts getRocketEndX. */
export const ROCKET_END_X_MIN_PX = 500

/** Ratio minimal (0–1) de scrollDistance pour rocketEndX. Utilisée dans : scrollAnimations.ts getRocketEndX. */
export const ROCKET_END_X_MIN_RATIO = 0.3

/** Position/rotation de départ de la fusée (createRocketScrollAnimation). */
export const ROCKET_START_X = 0
export const ROCKET_START_Y = 0
export const ROCKET_START_ROTATE = 480
export const ROCKET_END_ROTATE = 90

/** Terme constant dans le facteur d’accélération de la fusée (zone X). Formule : 5 + (accelerationZone²). Utilisée dans : scrollAnimations.ts updateRocketPositionX. */
export const ROCKET_ACCELERATION_FACTOR_BASE = 5

// =============================================================================
// Flamme de la fusée (createRocketFireScrollAnimation)
// =============================================================================

/** Position X minimale (px, référence) de la fusée pour que la flamme s’affiche. Utilisée dans : scrollAnimations.ts getFireMinX. */
export const FIRE_MIN_X_REFERENCE = 650

/** Multiplicateur du progress pour la position horizontale « virtuelle » de la fusée (cycle des feux). Utilisée dans : scrollAnimations.ts updateFireVisibility. */
export const FIRE_HORIZONTAL_PROGRESS_MULTIPLIER = 3

/** Nombre de cycles de feux (feu1/feu2/feu3) pendant la phase 1. Utilisée dans : scrollAnimations.ts updateFireVisibility (totalCycles). */
export const FIRE_CYCLES_PER_SCROLL = 10

/** Marge (px) sous FIRE_MIN_X en dessous de laquelle la flamme est cachée. Utilisée dans : scrollAnimations.ts updateFireVisibility. */
export const FIRE_HIDE_OFFSET_PX = 100

// =============================================================================
// Alien (createAlienScrollAnimation) – phase 2 (bloc About), 0 = début, 1 = fin
// =============================================================================

/** Début de l’animation des membres de l’alien (fraction de la phase 2). Utilisée dans : scrollAnimations.ts updateAlienLimbs (mapProgressToAnimation). */
export const ALIEN_ANIMATION_START = 0

/** Fin de l’animation des membres de l’alien. Utilisée dans : scrollAnimations.ts updateAlienLimbs. */
export const ALIEN_ANIMATION_END = 0.25

/** Début du retour des jambes de l’alien. Utilisée dans : scrollAnimations.ts mapProgressToLegReturn. */
export const ALIEN_LEG_RETURN_START = 0.15

/** Fin du retour des jambes. Utilisée dans : scrollAnimations.ts mapProgressToLegReturn. */
export const ALIEN_LEG_RETURN_END = 0.25

/** Seuil viewport (px) : en dessous, transform-origin alien = 'right bottom'. Utilisée dans : scrollAnimations.ts createAlienScrollAnimation. */
export const ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX = 425

/** Rotations et positions initiales/finales des membres de l’alien (createAlienScrollAnimation). Angles en degrés, x/y en px. */
export const ALIEN_BRAS_GAUCHE_START_ROTATE = 0
export const ALIEN_BRAS_GAUCHE_END_ROTATE = 130
export const ALIEN_AVANT_BRAS_GAUCHE_START_ROTATE = 0
export const ALIEN_AVANT_BRAS_GAUCHE_END_ROTATE = 100
export const ALIEN_AVANT_BRAS_GAUCHE_START_Y = 0
export const ALIEN_AVANT_BRAS_GAUCHE_END_Y = -45
export const ALIEN_AVANT_BRAS_GAUCHE_START_X = 0
export const ALIEN_AVANT_BRAS_GAUCHE_END_X = -5
export const ALIEN_AVANT_BRAS_GAUCHE_END_X2 = 35
export const ALIEN_BRAS_DROIT_START_ROTATE = 0
export const ALIEN_BRAS_DROIT_END_ROTATE = 150
export const ALIEN_AVANT_BRAS_DROIT_START_ROTATE = 0
export const ALIEN_AVANT_BRAS_DROIT_END_ROTATE = 100
export const ALIEN_AVANT_BRAS_DROIT_START_Y = 0
export const ALIEN_AVANT_BRAS_DROIT_END_Y = -50
export const ALIEN_AVANT_BRAS_DROIT_START_X = 0
export const ALIEN_AVANT_BRAS_DROIT_END_X = -5
export const ALIEN_AVANT_BRAS_DROIT_END_X2 = 50
export const ALIEN_JAMBES_HAUT_DROITE_START_ROTATE = 0
export const ALIEN_JAMBES_HAUT_DROITE_END_ROTATE = 70
export const ALIEN_JAMBES_BAS_DROITE_START_ROTATE = 0
export const ALIEN_JAMBES_BAS_DROITE_END_ROTATE = 50
export const ALIEN_JAMBES_BAS_DROITE_START_Y = 0
export const ALIEN_JAMBES_BAS_DROITE_END_Y = -18
export const ALIEN_JAMBES_BAS_DROITE_START_X = 0
export const ALIEN_JAMBES_BAS_DROITE_END_X = -18
export const ALIEN_EXTRATERRESTRE_START_ROTATE = 0
export const ALIEN_EXTRATERRESTRE_END_ROTATE = 90

/** Seuil (0–1) dans l’animation des avant-bras de l’alien : phase 1 (déplacement vers endX/Y) vs phase 2 (vers endX2). Utilisée dans : scrollAnimations.ts updateAlienLimbs. */
export const ALIEN_AVANT_BRAS_PHASE1_THRESHOLD = 0.7

/** Facteur de ralentissement (0–1) des rotations des avant-bras pour suivre les bras. Utilisée dans : scrollAnimations.ts updateAlienLimbs. */
export const ALIEN_AVANT_BRAS_SLOWED_ROTATION = 0.85
export const ALIEN_AVANT_BRAS_SLOWED_XY = 0.8

// =============================================================================
// Hologramme – bases (createHologramBasesScrollAnimation) – phase 2
// =============================================================================

/** Début du mouvement des bases de l’hologramme (fraction phase 2). Utilisée dans : scrollAnimations.ts updateHologramBases. */
export const HOLOGRAM_BASES_ANIMATION_START = 0

/** Fin du mouvement des bases. Utilisée dans : scrollAnimations.ts updateHologramBases. */
export const HOLOGRAM_BASES_ANIMATION_END = 0.2

/** Breakpoint (px) : au-dessus = desktop pour positions des bases. Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_TABLET_MAX = 850

/** Breakpoint (px) : au-dessus = tablette. Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_MOBILE_MAX = 480

/** Breakpoint (px) : au-dessus = petit mobile. Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_SMALL_PHONE_MAX = 375

/** Breakpoint (px) : en dessous = très petit téléphone. Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX = 320

/** Position de départ desktop des bases (px). Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_DESKTOP_DROITE_X = -595
export const HOLOGRAM_BASES_DESKTOP_DROITE_Y = -11
export const HOLOGRAM_BASES_DESKTOP_GAUCHE_X = -140
export const HOLOGRAM_BASES_DESKTOP_GAUCHE_Y = -80

/** Tablette : scale X et Y des bases. Utilisée dans : scrollAnimations.ts getHologramBasesStartPositions. */
export const HOLOGRAM_BASES_TABLET_SCALE_DROITE_X = 0.775
export const HOLOGRAM_BASES_TABLET_SCALE_GAUCHE_X = 0.05
export const HOLOGRAM_BASES_TABLET_Y_DROITE = -20
export const HOLOGRAM_BASES_TABLET_Y_GAUCHE = -90

/** Très petit téléphone (≤320px) : scale X et Y des bases. */
export const HOLOGRAM_BASES_VERY_SMALL_SCALE_DROITE_X = 0.65
export const HOLOGRAM_BASES_VERY_SMALL_SCALE_GAUCHE_X = -0.48
export const HOLOGRAM_BASES_VERY_SMALL_Y_DROITE = 64
export const HOLOGRAM_BASES_VERY_SMALL_Y_GAUCHE = -5

/** Petit téléphone (≤375px) : scale X et Y des bases. */
export const HOLOGRAM_BASES_SMALL_PHONE_SCALE_DROITE_X = 0.65
export const HOLOGRAM_BASES_SMALL_PHONE_SCALE_GAUCHE_X = -0.48
export const HOLOGRAM_BASES_SMALL_PHONE_Y_DROITE = 50
export const HOLOGRAM_BASES_SMALL_PHONE_Y_GAUCHE = -20

/** Mobile (375–480px) : scale X et Y des bases. */
export const HOLOGRAM_BASES_MOBILE_SCALE_DROITE_X = 0.67
export const HOLOGRAM_BASES_MOBILE_SCALE_GAUCHE_X = -0.4
export const HOLOGRAM_BASES_MOBILE_Y_DROITE = 30
export const HOLOGRAM_BASES_MOBILE_Y_GAUCHE = -40

/** Valeurs de fin (position et rotation) des bases de l’hologramme. Utilisées dans : scrollAnimations.ts createHologramBasesScrollAnimation. */
export const HOLOGRAM_BASES_DROITE_END_X = 0
export const HOLOGRAM_BASES_DROITE_END_Y = 0
export const HOLOGRAM_BASES_DROITE_START_ROTATE = 180
export const HOLOGRAM_BASES_DROITE_END_ROTATE = 0
export const HOLOGRAM_BASES_GAUCHE_END_X = 0
export const HOLOGRAM_BASES_GAUCHE_END_Y = 0
export const HOLOGRAM_BASES_GAUCHE_START_ROTATE = 0
export const HOLOGRAM_BASES_GAUCHE_END_ROTATE = 0

/** Hauteur (px) de l’arc de trajectoire des bases. Utilisée dans : scrollAnimations.ts arcPosition (createHologramBasesScrollAnimation). */
export const HOLOGRAM_BASES_ARC_HEIGHT = 200

// =============================================================================
// Hologramme – réflecteurs (createHologramReflecteursScrollAnimation) – phase 2
// =============================================================================

/** Début de l’animation des réflecteurs (fraction phase 2). Utilisée dans : scrollAnimations.ts updateHologramReflecteurs. */
export const HOLOGRAM_REFLECTEURS_ANIMATION_START = 0.2

/** Fin de l’animation des réflecteurs. Utilisée dans : scrollAnimations.ts updateHologramReflecteurs. */
export const HOLOGRAM_REFLECTEURS_ANIMATION_END = 0.4

/** Scale Y initial/final des réflecteurs. Utilisées dans : scrollAnimations.ts createHologramReflecteursScrollAnimation. */
export const HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y = 0
export const HOLOGRAM_REFLECTEURS_GAUCHE_END_SCALE_Y = 1
export const HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y = 0
export const HOLOGRAM_REFLECTEURS_DROIT_END_SCALE_Y = 1

// =============================================================================
// Hologramme – écran et handwriting (createHologramEcranScrollAnimation) – phase 2
// =============================================================================

/** Début de l’animation de l’écran (scaleX). Utilisée dans : scrollAnimations.ts updateHologramEcran. */
export const HOLOGRAM_ECRA_ANIMATION_START = 0.4

/** Fin de l’animation de l’écran. Utilisée dans : scrollAnimations.ts updateHologramEcran. Début du handwriting par défaut. */
export const HOLOGRAM_ECRA_ANIMATION_END = 0.55

/** Début de l’animation handwriting (après l’écran). Utilisée dans : scrollAnimations.ts updateHologramEcran. */
export const HOLOGRAM_HANDWRITING_START = 0.55

/** Fin de l’animation handwriting (fin du bloc About = 1). Utilisée dans : scrollAnimations.ts updateHologramEcran. */
export const HOLOGRAM_HANDWRITING_END = 1

/** Scale X initial/final de l’écran de l’hologramme. Utilisées dans : scrollAnimations.ts createHologramEcranScrollAnimation. */
export const HOLOGRAM_ECRAN_START_SCALE_X = 0
export const HOLOGRAM_ECRAN_END_SCALE_X = 1

// =============================================================================
// Handwriting (handwriting.ts)
// =============================================================================

/** Scale appliqué au groupe du profil dans le SVG handwriting. Utilisée dans : handwriting.ts. */
export const HANDWRITING_PROFILE_SCALE = 0.82

// =============================================================================
// Portrait et description (ScrollTrigger en px absolus)
// Utilisées dans : scrollAnimations.ts createPortraitScrollAnimation, createDescriptionContainerScrollAnimation
// =============================================================================

/** Début de la transition d’opacité du portrait (scroll en px). Format GSAP : '400px top'. */
export const PORTRAIT_SCROLL_START = '400px top'

/** Fin de la transition d’opacité du portrait. Format GSAP : '900px top'. */
export const PORTRAIT_SCROLL_END = '900px top'

/** Début de la transition d’opacité du descriptionContainer. Format GSAP : 'top top' = 0. */
export const DESCRIPTION_SCROLL_START = 'top top'

/** Fin de la transition d’opacité du descriptionContainer. Format GSAP : '500px top'. */
export const DESCRIPTION_SCROLL_END = '500px top'
