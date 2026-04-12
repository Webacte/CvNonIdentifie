/**
 * Config unique de la scène (World + Camera + scroll + positions).
 * Référence constants.ts sans dupliquer les valeurs.
 *
 * Mode desktop-only : valeurs de référence fixes.
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
    ROCKET_START_X,
    ROCKET_START_Y,
    ROCKET_START_ROTATE,
    ROCKET_END_ROTATE,
    ROCKET_LANDED_PROGRESS_THRESHOLD,
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

/** Positions fusée */
export const rocket = {
    start: { x: ROCKET_START_X, y: ROCKET_START_Y, rotate: ROCKET_START_ROTATE },
    endRotate: ROCKET_END_ROTATE,
    landedProgressThreshold: ROCKET_LANDED_PROGRESS_THRESHOLD,
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

/** Config unique de la scène (référence pour HomePage / horizontalScroll) */
export const sceneConfig = {
    world,
    scroll,
    rocket,
    hologram,
} as const