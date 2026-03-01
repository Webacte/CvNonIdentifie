/**
 * Constantes partagées pour les animations de scroll.
 * Tous les réglages de timing et de seuils sont centralisés ici.
 *
 * Stratégie responsive : scène = desktop golden viewport (VIEWPORT_REFERENCE_WIDTH × WORLD_REFERENCE_HEIGHT),
 * adaptation par camera scale ; UI = mobile-first dans les CSS.
 */

// =============================================================================
// Scroll horizontal – blocs et phases (horizontalScroll.ts)
// =============================================================================

/** Scroll (px de référence) pendant lequel le premier écran reste fixe (phase Présentation). À cette valeur commence la transition vers About. */
export const SECOND_SECTION_BLOCK_START = 230

/** Scroll (px de référence) sur lequel la caméra panne du premier écran vers le second, après le bloc fixe. */
export const FIRST_SECTION_PAN_SCROLL = 600

/**
 * Plage de scroll (multiple de ROCKET_PHASE1_END_SCROLL) sur laquelle la fusée fait 0→1.
 * Plus grand = fusée plus lente. Ex. 1.2 = 120 % de ROCKET_PHASE1_END_SCROLL.
 */
export const ROCKET_PROGRESS_RANGE_RATIO = 1.9

/**
 * Fin de la phase 1 pour la fusée uniquement (px de scroll de référence).
 * La fusée anime 0→1 sur [délai, ROCKET_PHASE1_END_SCROLL × ROCKET_PROGRESS_RANGE_RATIO].
 * N'affecte pas le moment où l'écran commence à bouger.
 */
export const ROCKET_PHASE1_END_SCROLL = SECOND_SECTION_BLOCK_START

/** Fin du bloc « About » en px de scroll. = fin de la phase 2 (alien, hologramme). */
export const SECOND_SECTION_BLOCK_END = 2800

/** Décalage (px de référence) avant le début de la phase 2 : alien et hologramme commencent leur animation à (phase2Start - PHASE2_EARLY_START_OFFSET). */
export const PHASE2_EARLY_START_OFFSET = 380

/** Début du bloc « Expérience » en px de scroll (scroll bloqué sur la section Expérience). */
export const THIRD_SECTION_BLOCK_START = 3100

/** Fin du bloc « Expérience » en px de scroll (durée x3 + 1/3 : 2800 px). */
export const THIRD_SECTION_BLOCK_END = 5900

/** Début du bloc « Projets » en px de scroll (écran bloqué sur la section Projets). Ajustable. */
export const FOURTH_SECTION_BLOCK_START = 6200

/** Fin du bloc « Projets » en px de scroll. Ajustable pour régler la durée d'arrêt sur Projets. */
export const FOURTH_SECTION_BLOCK_END = 8500

/** Début de l’animation convoyeur/battant : bien avant la fin Expérience (plus tôt = valeur plus basse). */
export const CONVOYEUR_PROJET_PHASE_START = 4500

/** Fin de l’animation convoyeur/battant : fin du bloc Projets. */
export const CONVOYEUR_PROJET_PHASE_END = FOURTH_SECTION_BLOCK_END

/** Début du bloc « Contact » en px de scroll (écran bloqué sur la section Contact). Doit être > FOURTH_SECTION_BLOCK_END. */
export const FIFTH_SECTION_BLOCK_START = 8600

/** Fin du bloc « Contact » en px de scroll. Ajustable pour régler la durée d'arrêt sur Contact. Doit être > FIFTH_SECTION_BLOCK_START. */
export const FIFTH_SECTION_BLOCK_END = 9500

/** Pixels de scroll après le bloc Contact jusqu’à la fin.  */
export const SCROLL_FROM_FIFTH_BLOCK = 2000

/** Largeur de référence du viewport (px) pour le ratio de mise à l’échelle.  */
export const VIEWPORT_REFERENCE_WIDTH = 1050

/** Monde de référence (World + Camera) : largeur du monde en unités. Réutilise la même valeur que le viewport de référence. */
export const WORLD_REFERENCE_WIDTH = VIEWPORT_REFERENCE_WIDTH

/** Monde de référence (World + Camera) : hauteur du monde en unités. Cohérent avec le design à 100% zoom ; la caméra fait contain viewport dans ce monde. */
export const WORLD_REFERENCE_HEIGHT = 650


// =============================================================================
// Portrait et description (ScrollTrigger, format GSAP)
// =============================================================================

/** Début de la transition d’opacité du portrait (scroll en px). Format GSAP : '200px top'. */
export const PORTRAIT_SCROLL_START = '100px top'

/** Fin de la transition d’opacité du portrait. Format GSAP : '600px top'. */
export const PORTRAIT_SCROLL_END = '400px top'

/** Début de la transition d’opacité du descriptionContainer. Format GSAP : 'top top' = 0. */
export const DESCRIPTION_SCROLL_START = 'top top'

/** Fin de la transition d’opacité du descriptionContainer. Format GSAP : '500px top'. */
export const DESCRIPTION_SCROLL_END = '300px top'

// =============================================================================
// Fusée (createRocketScrollAnimation)
// =============================================================================

/** Délai au début de l'animation fusée (0–1). Fraction de la plage phase 1 pendant laquelle la fusée reste immobile avant de démarrer. 0 = démarrage immédiat, 0.15 = 15 % de scroll avant que la fusée bouge. */
export const ROCKET_ANIMATION_START_DELAY = 0.3

/** Hauteur (px) à soustraire pour le point d’atterrissage sur tablette. */
export const ROCKET_HEIGHT_PX = 200

/** Pourcentage de la hauteur du viewport pour le point d’atterrissage (desktop). Ex. 1.05 = 105%. */
export const ROCKET_END_Y_PERCENTAGE = .95

/** Progress (0–1) à laquelle le mouvement Y de la fusée se termine (desktop). */
export const ROCKET_Y_COMPLETION_PROGRESS = 1 / 2.5

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤375px. */
export const ROCKET_Y_COMPLETION_MOBILE_SMALL_FACTOR = 76 / 65

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤600px. */
export const ROCKET_Y_COMPLETION_MOBILE_FACTOR = 72 / 65

/** Seuil viewport (px) : en dessous, sol à 55% et atterrissage fusée à 55%. */
export const GROUND_LINE_425_MAX_WIDTH = 425

/** Pourcentage (0–1) hauteur viewport pour atterrissage fusée quand sol à 55% (≤425px). */
export const ROCKET_END_Y_PERCENTAGE_425 = 0.55

/** Facteur appliqué à ROCKET_Y_COMPLETION_PROGRESS pour écrans ≤425px (sol à 55%). */
export const ROCKET_Y_COMPLETION_425_FACTOR = 55 / 65

/** Seuil viewport (px) : en dessous, atterrissage à 76% hauteur. */
export const MOBILE_SMALL_MAX_WIDTH = 375

/** Seuil viewport (px) : en dessous, atterrissage à 72% hauteur. */
export const MOBILE_MAX_WIDTH = 600

/** Seuil viewport (px) : tablette, atterrissage remonté d’une hauteur fusée. */
export const TABLET_MAX_WIDTH = 768

/** Coefficient pour le mouvement horizontal de la fusée (progress X). */
export const ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER = 3

/**
 * Exposant ease-in pour la vitesse de base sur l’axe X. Appliqué à la progression X (0→1).
 * 1 = linéaire (comportement par défaut). > 1 = démarrage plus lent (ralentit le début du déplacement).
 * Plus la valeur est élevée, plus l'accélération est progressive (montée en vitesse lente).
 */
export const ROCKET_X_BASE_SPEED_EASE = 2

/** Valeur minimale (px) pour rocketEndX : la fusée doit sortir du champ visuel avant Contact. */
export const ROCKET_END_X_MIN_PX = 1800

/** Ratio minimal (0–1) de scrollDistance pour rocketEndX. */
export const ROCKET_END_X_MIN_RATIO = 0.3

/** Position/rotation de départ de la fusée (createRocketScrollAnimation). */
export const ROCKET_START_X = 0
export const ROCKET_START_Y = 0
export const ROCKET_START_ROTATE = 480
export const ROCKET_END_ROTATE = 90

/** Terme constant dans le facteur d’accélération de la fusée (zone X). Formule : 5 + (accelerationZone²). */
// =============================================================================
// Fusée – position finale sur l'écran Contact (après disparition en transition)
// =============================================================================

/** Seuil de progress (0–1) à partir duquel la fusée est affichée en position « atterrie » sur Contact. */
export const ROCKET_LANDED_PROGRESS_THRESHOLD = 0.30

/** Marge (px) entre le bord droit du viewport et la fusée en position atterrie sur Contact. */
export const ROCKET_LANDED_X_RIGHT_OFFSET = 200

/** Décalage (px) vers la gauche de la fusée en position atterrie. */
export const ROCKET_LANDED_X_LEFT_OFFSET = 1500

/** Pourcentage (0–1) de la hauteur du viewport pour la position Y atterrie (niveau du sol). Ex. 1.003 = niveau du sol. */
export const ROCKET_LANDED_Y_PERCENTAGE = 1.003

/** Rotation (degrés) de la fusée en position atterrie sur Contact. */
export const ROCKET_LANDED_ROTATE = 140

/** Opacité de #fumee à la fin de l'animation (écran Contact). */
export const ROCKET_FUMEE_OPACITY_END = 1

/** Rotation (degrés) de #fumee (angle constant appliqué à la fumée). */
export const ROCKET_FUMEE_ROTATE = -10

/** Rotation (degrés) de #fumee en position atterrie (écran Contact). */
export const ROCKET_FUMEE_LANDED_ROTATE = 0

/** Nombre de pulses pour l’alternance miroir (scaleX 1/-1) de #fumee en position atterrie. */
export const ROCKET_FUMEE_PULSE_COUNT = 25

/** Opacité des feux (#feu1, #feu2, #feu3) à la fin de l'animation (écran Contact). */
export const ROCKET_FIRE_OPACITY_END = 0

// =============================================================================
// Fusée – #tete : position/rotation en état atterri (écran Contact)
// =============================================================================

/** Décalage X (px) appliqué à #tete en position atterrie. */
export const ROCKET_TETE_LANDED_X = -100

/** Décalage Y (px) appliqué à #tete en position atterrie. */
export const ROCKET_TETE_LANDED_Y = 120

/** Rotation (degrés) appliquée à #tete en position atterrie. */
export const ROCKET_TETE_LANDED_ROTATE = 250

// =============================================================================
// Flamme de la fusée (createRocketFireScrollAnimation)
// =============================================================================

/** Position X minimale (px, référence) de la fusée pour que la flamme s’affiche. */
export const FIRE_MIN_X_REFERENCE = 650

/** Multiplicateur du progress pour la position horizontale « virtuelle » de la fusée (cycle des feux). */
export const FIRE_HORIZONTAL_PROGRESS_MULTIPLIER = 3

/** Nombre de cycles de feux (feu1/feu2/feu3) pendant la phase 1. */
export const FIRE_CYCLES_PER_SCROLL = 10

/** Marge (px) sous FIRE_MIN_X en dessous de laquelle la flamme est cachée. */
export const FIRE_HIDE_OFFSET_PX = 100

// =============================================================================
// Alien (createAlienScrollAnimation) – phase 2 (bloc About), 0 = début, 1 = fin
// =============================================================================

/** Début de l’animation des membres de l’alien (fraction de la phase 2). */
export const ALIEN_ANIMATION_START = 0

/** Fin de l’animation des membres de l’alien. */
export const ALIEN_ANIMATION_END = 0.25

/** Début du retour des jambes de l’alien. */
export const ALIEN_LEG_RETURN_START = 0.15

/** Fin du retour des jambes. */
export const ALIEN_LEG_RETURN_END = 0.25

/** Seuil viewport (px) : en dessous, transform-origin alien = 'right bottom'. */
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

/** Seuil (0–1) dans l’animation des avant-bras de l’alien : phase 1 (déplacement vers endX/Y) vs phase 2 (vers endX2). */
export const ALIEN_AVANT_BRAS_PHASE1_THRESHOLD = 0.7

/** Facteur de ralentissement (0–1) des rotations des avant-bras pour suivre les bras. */
export const ALIEN_AVANT_BRAS_SLOWED_ROTATION = 0.85
export const ALIEN_AVANT_BRAS_SLOWED_XY = 0.8

// =============================================================================
// Hologramme – bases (createHologramBasesScrollAnimation) – phase 2
// =============================================================================

/** Début du mouvement des bases de l’hologramme (fraction phase 2). */
export const HOLOGRAM_BASES_ANIMATION_START = 0

/** Fin du mouvement des bases. */
export const HOLOGRAM_BASES_ANIMATION_END = 0.2

/** Breakpoint (px) : au-dessus = desktop pour positions des bases. */
export const HOLOGRAM_BASES_TABLET_MAX = 850

/** Breakpoint (px) : au-dessus = tablette. */
export const HOLOGRAM_BASES_MOBILE_MAX = 480

/** Breakpoint (px) : au-dessus = petit mobile. */
export const HOLOGRAM_BASES_SMALL_PHONE_MAX = 375

/** Breakpoint (px) : en dessous = très petit téléphone. */
export const HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX = 320

/** Position de départ desktop des bases (px). */
export const HOLOGRAM_BASES_DESKTOP_DROITE_X = -595
export const HOLOGRAM_BASES_DESKTOP_DROITE_Y = -11
export const HOLOGRAM_BASES_DESKTOP_GAUCHE_X = -140
export const HOLOGRAM_BASES_DESKTOP_GAUCHE_Y = -80

/** Tablette : scale X et Y des bases. */
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

/** Valeurs de fin (position et rotation) des bases de l’hologramme. */
export const HOLOGRAM_BASES_DROITE_END_X = 0
export const HOLOGRAM_BASES_DROITE_END_Y = 0
export const HOLOGRAM_BASES_DROITE_START_ROTATE = 180
export const HOLOGRAM_BASES_DROITE_END_ROTATE = 0
export const HOLOGRAM_BASES_GAUCHE_END_X = 0
export const HOLOGRAM_BASES_GAUCHE_END_Y = 0
export const HOLOGRAM_BASES_GAUCHE_START_ROTATE = 0
export const HOLOGRAM_BASES_GAUCHE_END_ROTATE = 0

/** Hauteur (px) de l’arc de trajectoire des bases. */
export const HOLOGRAM_BASES_ARC_HEIGHT = 200

// =============================================================================
// Hologramme – réflecteurs (createHologramReflecteursScrollAnimation) – phase 2
// =============================================================================

/** Début de l’animation des réflecteurs (fraction phase 2). */
export const HOLOGRAM_REFLECTEURS_ANIMATION_START = 0.2

/** Fin de l’animation des réflecteurs. */
export const HOLOGRAM_REFLECTEURS_ANIMATION_END = 0.4

/** Scale Y initial/final des réflecteurs. */
export const HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y = 0
export const HOLOGRAM_REFLECTEURS_GAUCHE_END_SCALE_Y = 1
export const HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y = 0
export const HOLOGRAM_REFLECTEURS_DROIT_END_SCALE_Y = 1

// =============================================================================
// Hologramme – écran et handwriting (createHologramEcranScrollAnimation) – phase 2
// =============================================================================

/** Début de l’animation de l’écran (scaleX). */
export const HOLOGRAM_ECRA_ANIMATION_START = 0.4

/** Fin de l’animation de l’écran. Début du handwriting par défaut. */
export const HOLOGRAM_ECRA_ANIMATION_END = 0.55

/** Début de l’animation handwriting (après l’écran). */
export const HOLOGRAM_HANDWRITING_START = 0.55

/** Fin de l’animation handwriting (fin du bloc About = 1). */
export const HOLOGRAM_HANDWRITING_END = 1

/** Scale X initial/final de l’écran de l’hologramme. */
export const HOLOGRAM_ECRAN_START_SCALE_X = 0
export const HOLOGRAM_ECRAN_END_SCALE_X = 1

// =============================================================================
// Handwriting (handwriting.ts)
// =============================================================================

/** Scale appliqué au groupe du profil dans le SVG handwriting. */
export const HANDWRITING_PROFILE_SCALE = 0.82

// =============================================================================
// Section Expérience (createExperienceSectionScrollAnimation)
// Sous-plages 0–1 dans le bloc Expérience (THIRD_SECTION_BLOCK_*)
// =============================================================================

/** Début de l’animation alien2 entre dans la cabane (fraction du bloc Expérience). */
export const EXP_ALIEN_IN_START = 0
/** Fin de l’animation alien2 entre + disparition. */
export const EXP_ALIEN_IN_END = 0.35

/** Début ouverture de la porte (#porte). */
export const EXP_DOOR_OPEN_START = 0.1
/** Fin fermeture de la porte (#porte). */
export const EXP_DOOR_OPEN_END = 0.3

/** Début montée de la cheminée-fumée (#chemine-fumee). */
export const EXP_CHIMNEY_RISE_START = 0.3
/** Fin montée cheminée-fumée. */
export const EXP_CHIMNEY_RISE_END = 0.5

/** Début apparition fumée cheminée (#fumee). */
export const EXP_SMOKE_FADE_START = 0.52
/** Fin opacité fumée + début effet split. */
export const EXP_SMOKE_FADE_END = 0.62

/** Début swap fenêtre (#avant-fenetre -> #fenetre). */
export const EXP_WINDOW_SWAP_START = 0.65
/** Fin swap fenêtre (fenetre visible à 1). */
export const EXP_WINDOW_SWAP_END = 0.75

/** Début élément battant (après apparition fenetre). */
export const EXP_CONVEYOR_ROTATE_START = 0.55
/** Fin rotation. */
export const EXP_CONVEYOR_ROTATE_END = 0.60

/** Début glissement convoyeur (après apparition fenetre). */
export const EXP_CONVEYOR_SLIDE_START = 0.59
/** Fin glissement. */
export const EXP_CONVEYOR_SLIDE_END = 0.69

/** Nombre de cycles de marche alien2 pendant EXP_ALIEN_IN. */
export const ALIEN2_WALK_CYCLES = 4
/** Amplitude rotation jambes (degrés). */
export const ALIEN2_LEG_SWING_DEG = 18
/** Amplitude rotation bras (degrés). */
export const ALIEN2_ARM_SWING_DEG = 12
/** Amplitude rotation avant-bras (degrés). */
export const ALIEN2_FOREARM_SWING_DEG = 8
/** Position X de départ du conteneur alien2 (px). */
export const ALIEN2_START_X = 0
/** Position X d’arrivée alien2 à la cabane (px). */
export const ALIEN2_END_X = 280
/** Début de la sous-plage (0–1 dans EXP_ALIEN_IN) où l’opacité alien2 passe à 0. */
export const ALIEN2_FADE_START = 0.75
/** Rotation porte ouverte (#porte, degrés) — non utilisé si scale activé. */
export const EXP_DOOR_OPEN_ROTATE = -75
/** Scale X minimum porte (#porte) — rétrécit puis agrandit, côté gauche fixe. */
export const EXP_DOOR_SCALE_MIN = 0.2
/** Position Y initiale cheminée-fumée (#chemine-fumee, px) — en bas avant montée. */
export const EXP_CHIMNEY_START_Y = 200
/** Translation Y cheminée-fumée montée (#chemine-fumee, px) — valeur positive, appliquée en y: -progress * valeur pour monter. */
export const EXP_CHIMNEY_RISE_Y = 200
/** Translation X finale convoyeur (#convoyeur, px). */
export const EXP_CONVEYOR_SLIDE_X = 100
/** Translation X initiale convoyeur (déjà appliquée dans ProjectsSection : -700). */
export const EXP_CONVEYOR_START_X = -300
/** Décalage X fixe du battant pour l'aligner sur le bord droit du convoyeur (viewBox). */
export const EXP_BATTANT_OFFSET_X = 210
/** Décalage Y fixe du battant (alignement vertical). */
export const EXP_BATTANT_OFFSET_Y = 0
/** Début visibilité titre-quest (fraction du bloc Expérience). */
export const EXP_QUEST_TITRE_VISIBLE_START = 0
/** Nombre de cycles descrip-quest (1 à 6). */
export const EXP_QUEST_CYCLE_COUNT = 6
/** Ratio écriture dans chaque cycle (0–1). */
export const EXP_QUEST_WRITE_RATIO = 0.4
/** Ratio affichage (stay) dans chaque cycle (0–1). */
export const EXP_QUEST_STAY_RATIO = 0.15
/** Ratio effacement dans chaque cycle (0–1). */
export const EXP_QUEST_ERASE_RATIO = 0.45

/** Pivot du battant : défini en CSS sur #battant (transform-origin: bottom left) pour rester responsive. */
/** Scale du battant : X = longueur à l’horizontale, Y = épaisseur / longueur à la verticale l’allongement à l’horizontale. */
export const EXP_BATTANT_SCALE_X = 0.4437
export const EXP_BATTANT_SCALE_Y = 0.665
/** Rotation de départ battant (degrés). */
export const EXP_BATTANT_ROTATE_START = -90
/** Rotation finale battant (degrés). */
export const EXP_BATTANT_ROTATE_END = 0

/** Scale X de l’élément #convoyeur (enfant du SVG convoyeur-projet, section Projets). */
export const CONVOYEUR_SCALE_X = .8
/** Scale Y de l’élément #convoyeur (enfant du SVG convoyeur-projet, section Projets). */
export const CONVOYEUR_SCALE_Y = .6
/** Hauteur du viewBox du SVG convoyeur-projet (unités SVG), pour calcul du top %. */
export const CONVOYEUR_PROJET_VIEWBOX_HEIGHT = 93
/** Décalage vertical (top) en % de la hauteur du viewBox du SVG convoyeur-projet (0–100). Ex. 40 = top 40 %. */
export const CONVOYEUR_TOP_PERCENT = 40

/** Hauteur Y (%) pour head/hand-robot au-dessus du convoyeur (en entrée). Ajustable. */
export const ROBOT_ABOVE_CONVOYEUR_Y_PERCENT = 50.5
/** Hauteur Y (%) pour head/hand-robot au niveau du sol (après chute). Ajustable. */
export const ROBOT_GROUND_Y_PERCENT = 61
/** Chute diagonale : décalage X (vw) à droite au moment de l'atterrissage. Ajustable. */
export const ROBOT_FALL_DIAGONAL_X_VW = 4
/** Après atterrissage : déplacement X (vw) supplémentaire vers la droite (roule sur le sol). Ajustable. */
export const ROBOT_FALL_ROLL_RIGHT_X_VW = 16
/** Rotation totale (degrés) pendant la chute et la roulade de la tete-robot. Ex. 360 = un tour. Ajustable. */
export const ROBOT_HEAD_ROLL_DEG = 360
/** Rotation totale (degrés) pendant la chute et la roulade de la main-robot. Ex. 360 = un tour. Ajustable. */
export const ROBOT_HAND_ROLL_DEG = 279
/** Ratio 0–1 : fraction de la phase fall pour la chute diagonale (reste = roule à droite). Ex. 0.4 = 40% diagonal, 60% roll right. */
export const ROBOT_FALL_DIAGONAL_RATIO = 0.4
/** Origine de la rotation pour la roulade. Ex. "center bottom" = roule sur le bord bas. */
export const ROBOT_ROLL_TRANSFORM_ORIGIN = 'center bottom'
/** Facteur de réduction de taille pour head-robot et hand-robot (0–1). */
export const ROBOT_SIZE_SCALE = 0.85
/** Début des animations robots : après la fin du glissement convoyeur (EXP_CONVEYOR_SLIDE_END). */
export const ROBOT_ANIMATION_START = EXP_CONVEYOR_SLIDE_END
/** Sous-phases dans progressProjets (0–1) : début/fin slide head, début/fin fall head, idem hand. */
export const ROBOT_HEAD_SLIDE_START = ROBOT_ANIMATION_START
export const ROBOT_HEAD_SLIDE_END = 0.80
export const ROBOT_HEAD_FALL_START = ROBOT_HEAD_SLIDE_END
export const ROBOT_HEAD_FALL_END = 0.84
export const ROBOT_HAND_SLIDE_START = ROBOT_HEAD_FALL_END
export const ROBOT_HAND_SLIDE_END = ROBOT_HEAD_FALL_END + (ROBOT_HEAD_SLIDE_END - ROBOT_HEAD_SLIDE_START)
export const ROBOT_HAND_FALL_START = ROBOT_HAND_SLIDE_END
export const ROBOT_HAND_FALL_END = .99

/** Plage progressProjets (0–1) : Scania apparaît au début tête, s’efface juste avant la fin tête. */
export const PROJET_SCANIA_TEXT_START = ROBOT_HEAD_SLIDE_START
export const PROJET_SCANIA_TEXT_END = ROBOT_HEAD_FALL_END - 0.01
/** Plage progressProjets (0–1) : LikeThat apparaît au début main, s’efface juste avant la fin main. */
export const PROJET_LIKETHAT_TEXT_START = ROBOT_HAND_SLIDE_START
export const PROJET_LIKETHAT_TEXT_END = ROBOT_HAND_FALL_END - 0.01
/** Ratios écriture / stay / effacement pour chaque projet (somme = 1). */
export const PROJET_WRITE_RATIO = 0.4
export const PROJET_STAY_RATIO = 0.15
export const PROJET_ERASE_RATIO = 0.45

/** Nombre de pulses pour l’effet split fumée cheminée. */
export const SMOKE_PULSE_COUNT = 12
/** Seuil (0–1) : quand frac(localProgress * SMOKE_PULSE_COUNT) < seuil => split actif. */
export const SMOKE_SPLIT_THRESHOLD = 0.15

// =============================================================================
// Fumée fusée – effet split (plage finale, transition vers Contact)
// =============================================================================

/** Progress (0–1) début effet split sur #fumee fusée. */
export const ROCKET_SMOKE_SPLIT_START = 0.85
/** Progress (0–1) fin effet split. */
export const ROCKET_SMOKE_SPLIT_END = 1
/** Nombre de pulses pour l’effet split fumée fusée. */
export const ROCKET_SMOKE_PULSE_COUNT = 5
/** Seuil pour pulse fumée fusée. */
export const ROCKET_SMOKE_SPLIT_THRESHOLD = 0.2
