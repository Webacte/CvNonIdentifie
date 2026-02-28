/**
 * Config unique de la scène (World + Camera + scroll + breakpoints + positions).
 * Référence constants.ts sans dupliquer les valeurs.
 *
 * Stratégie responsive : scène = desktop « golden viewport » (WORLD_REFERENCE_WIDTH × WORLD_REFERENCE_HEIGHT),
 * adaptation par camera.scale ; UI = mobile-first dans les CSS (base petit écran, puis min-width).
 */

import {
    WORLD_REFERENCE_WIDTH,
    WORLD_REFERENCE_HEIGHT,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    THIRD_SECTION_BLOCK_START,
    THIRD_SECTION_BLOCK_END,
    FOURTH_SECTION_BLOCK_START,
    FOURTH_SECTION_BLOCK_END,
    FIFTH_SECTION_BLOCK_START,
    FIFTH_SECTION_BLOCK_END,
    FIRST_SECTION_PAN_SCROLL,
    GROUND_LINE_425_MAX_WIDTH,
    MOBILE_SMALL_MAX_WIDTH,
    MOBILE_MAX_WIDTH,
    TABLET_MAX_WIDTH,
    ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX,
    HOLOGRAM_BASES_TABLET_MAX,
    HOLOGRAM_BASES_MOBILE_MAX,
    HOLOGRAM_BASES_SMALL_PHONE_MAX,
    HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX,
    ROCKET_START_X,
    ROCKET_START_Y,
    ROCKET_START_ROTATE,
    ROCKET_END_ROTATE,
    ROCKET_LANDED_PROGRESS_THRESHOLD,
    ROCKET_LANDED_X_RIGHT_OFFSET,
    ROCKET_LANDED_Y_PERCENTAGE,
    ROCKET_LANDED_ROTATE,
    HOLOGRAM_BASES_DESKTOP_DROITE_X,
    HOLOGRAM_BASES_DESKTOP_DROITE_Y,
    HOLOGRAM_BASES_DESKTOP_GAUCHE_X,
    HOLOGRAM_BASES_DESKTOP_GAUCHE_Y,
    HOLOGRAM_BASES_DROITE_END_X,
    HOLOGRAM_BASES_DROITE_END_Y,
    HOLOGRAM_BASES_GAUCHE_END_X,
    HOLOGRAM_BASES_GAUCHE_END_Y,
} from './constants'

/** World + Camera : dimensions du monde de référence */
export const world = {
    width: WORLD_REFERENCE_WIDTH,
    height: WORLD_REFERENCE_HEIGHT,
} as const

/** Options caméra : cover = remplit tout l'écran (plus de bandes vides sur les côtés en desktop) */
export const cameraOptions = {
    mode: 'cover' as const,
    center: true,
}

/** Scroll : blocs et segments (unités monde) */
export const scroll = {
    blocks: {
        secondBlockStart: SECOND_SECTION_BLOCK_START,
        secondBlockEnd: SECOND_SECTION_BLOCK_END,
        thirdBlockStart: THIRD_SECTION_BLOCK_START,
        thirdBlockEnd: THIRD_SECTION_BLOCK_END,
        fourthBlockStart: FOURTH_SECTION_BLOCK_START,
        fourthBlockEnd: FOURTH_SECTION_BLOCK_END,
        fifthBlockStart: FIFTH_SECTION_BLOCK_START,
        fifthBlockEnd: FIFTH_SECTION_BLOCK_END,
    },
    phases: {},
    ratios: {
        firstSectionPanScroll: FIRST_SECTION_PAN_SCROLL,
    },
} as const

/** Breakpoints viewport (px) */
export const breakpoints = {
    viewportReferenceWidth: WORLD_REFERENCE_WIDTH,
    groundLine425MaxWidth: GROUND_LINE_425_MAX_WIDTH,
    mobileSmallMaxWidth: MOBILE_SMALL_MAX_WIDTH,
    mobileMaxWidth: MOBILE_MAX_WIDTH,
    tabletMaxWidth: TABLET_MAX_WIDTH,
    alienTransformOriginMobileMax: ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX,
    hologramBasesTabletMax: HOLOGRAM_BASES_TABLET_MAX,
    hologramBasesMobileMax: HOLOGRAM_BASES_MOBILE_MAX,
    hologramBasesSmallPhoneMax: HOLOGRAM_BASES_SMALL_PHONE_MAX,
    hologramBasesVerySmallPhoneMax: HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX,
} as const

/** Positions fusée */
export const rocket = {
    start: { x: ROCKET_START_X, y: ROCKET_START_Y, rotate: ROCKET_START_ROTATE },
    endRotate: ROCKET_END_ROTATE,
    landedProgressThreshold: ROCKET_LANDED_PROGRESS_THRESHOLD,
    landedXRightOffset: ROCKET_LANDED_X_RIGHT_OFFSET,
    landedYPercentage: ROCKET_LANDED_Y_PERCENTAGE,
    landedRotate: ROCKET_LANDED_ROTATE,
} as const

/** Positions bases hologramme */
export const hologram = {
    basesDesktopStart: {
        droite: { x: HOLOGRAM_BASES_DESKTOP_DROITE_X, y: HOLOGRAM_BASES_DESKTOP_DROITE_Y },
        gauche: { x: HOLOGRAM_BASES_DESKTOP_GAUCHE_X, y: HOLOGRAM_BASES_DESKTOP_GAUCHE_Y },
    },
    basesEnd: {
        droite: { x: HOLOGRAM_BASES_DROITE_END_X, y: HOLOGRAM_BASES_DROITE_END_Y },
        gauche: { x: HOLOGRAM_BASES_GAUCHE_END_X, y: HOLOGRAM_BASES_GAUCHE_END_Y },
    },
} as const

/** Seuils UI pour currentBreakpoint (alignés avec constants) */
const BP_SM = GROUND_LINE_425_MAX_WIDTH      // 425
const BP_MD = TABLET_MAX_WIDTH               // 768
const BP_LG = WORLD_REFERENCE_WIDTH         // 1050
const BP_XL = 1349

export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl'

/** Retourne true si viewport considéré comme mobile (≤ tablette). */
export function isMobile(viewportW: number): boolean {
    return viewportW <= breakpoints.tabletMaxWidth
}

/** Retourne le nom du breakpoint actuel pour la largeur donnée. */
export function currentBreakpoint(viewportW: number): BreakpointName {
    if (viewportW <= BP_SM) return 'sm'
    if (viewportW <= BP_MD) return 'md'
    if (viewportW <= BP_LG) return 'lg'
    return 'xl'
}

/** Config unique de la scène (référence pour HomePage / horizontalScroll) */
export const sceneConfig = {
    world,
    cameraOptions,
    scroll,
    breakpoints,
    rocket,
    hologram,
} as const