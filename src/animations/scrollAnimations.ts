import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ScrollValues } from './horizontalScroll'
import type { ResponsiveTokens } from '@/scene/responsiveTokens'
import {
    ROCKET_ANIMATION_START_DELAY,
    ROCKET_PROGRESS_RANGE_RATIO,
    FIRST_SECTION_PAN_SCROLL,
    PHASE2_EARLY_START_OFFSET,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    VIEWPORT_REFERENCE_WIDTH,
    ROCKET_END_Y_PERCENTAGE,
    ROCKET_Y_COMPLETION_PROGRESS,
    ROCKET_END_Y_PERCENTAGE_425,
    ROCKET_END_Y_PERCENTAGE_MOBILE_SMALL,
    ROCKET_END_Y_PERCENTAGE_MOBILE,
    LARGE_DESKTOP_MIN_WIDTH,
    ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER,
    ROCKET_X_BASE_SPEED_EASE,
    ROCKET_END_X_MIN_PX,
    ROCKET_END_X_MIN_RATIO,
    FIRE_HORIZONTAL_PROGRESS_MULTIPLIER,
    FIRE_CYCLES_PER_SCROLL,
    ALIEN_ANIMATION_START,
    ALIEN_ANIMATION_END,
    ALIEN_LEG_RETURN_START,
    ALIEN_LEG_RETURN_END,
    HOLOGRAM_BASES_ANIMATION_START,
    HOLOGRAM_BASES_ANIMATION_END,
    HOLOGRAM_BASES_TABLET_MAX,
    HOLOGRAM_BASES_MOBILE_MAX,
    HOLOGRAM_BASES_SMALL_PHONE_MAX,
    HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX,
    HOLOGRAM_REFLECTEURS_ANIMATION_START,
    HOLOGRAM_REFLECTEURS_ANIMATION_END,
    HOLOGRAM_ECRA_ANIMATION_START,
    HOLOGRAM_ECRA_ANIMATION_END,
    HOLOGRAM_HANDWRITING_START,
    HOLOGRAM_HANDWRITING_END,
    PORTRAIT_SCROLL_START,
    PORTRAIT_SCROLL_END,
    DESCRIPTION_SCROLL_START,
    DESCRIPTION_SCROLL_END,
    ROCKET_START_X,
    ROCKET_START_Y,
    ROCKET_START_ROTATE,
    ROCKET_END_ROTATE,
    ROCKET_LANDED_PROGRESS_THRESHOLD,
    ROCKET_LANDED_X_RIGHT_OFFSET,
    ROCKET_LANDED_X_LEFT_OFFSET,
    ROCKET_LANDED_Y_PERCENTAGE,
    ROCKET_LANDED_ROTATE,
    ROCKET_LANDED_X_1920,
    ROCKET_LANDED_Y_1920,
    ROCKET_FUMEE_OPACITY_END,
    ROCKET_FUMEE_ROTATE,
    ROCKET_FUMEE_PULSE_COUNT,
    ROCKET_FIRE_OPACITY_END,
    ROCKET_TETE_LANDED_X,
    ROCKET_TETE_LANDED_Y,
    ROCKET_TETE_LANDED_ROTATE,
    ALIEN_BRAS_GAUCHE_START_ROTATE,
    ALIEN_BRAS_GAUCHE_END_ROTATE,
    ALIEN_AVANT_BRAS_GAUCHE_START_ROTATE,
    ALIEN_AVANT_BRAS_GAUCHE_END_ROTATE,
    ALIEN_AVANT_BRAS_GAUCHE_START_Y,
    ALIEN_AVANT_BRAS_GAUCHE_END_Y,
    ALIEN_AVANT_BRAS_GAUCHE_START_X,
    ALIEN_AVANT_BRAS_GAUCHE_END_X,
    ALIEN_AVANT_BRAS_GAUCHE_END_X2,
    ALIEN_BRAS_DROIT_START_ROTATE,
    ALIEN_BRAS_DROIT_END_ROTATE,
    ALIEN_AVANT_BRAS_DROIT_START_ROTATE,
    ALIEN_AVANT_BRAS_DROIT_END_ROTATE,
    ALIEN_AVANT_BRAS_DROIT_START_Y,
    ALIEN_AVANT_BRAS_DROIT_END_Y,
    ALIEN_AVANT_BRAS_DROIT_START_X,
    ALIEN_AVANT_BRAS_DROIT_END_X,
    ALIEN_AVANT_BRAS_DROIT_END_X2,
    ALIEN_JAMBES_HAUT_DROITE_START_ROTATE,
    ALIEN_JAMBES_HAUT_DROITE_END_ROTATE,
    ALIEN_JAMBES_BAS_DROITE_START_ROTATE,
    ALIEN_JAMBES_BAS_DROITE_END_ROTATE,
    ALIEN_JAMBES_BAS_DROITE_START_Y,
    ALIEN_JAMBES_BAS_DROITE_END_Y,
    ALIEN_JAMBES_BAS_DROITE_START_X,
    ALIEN_JAMBES_BAS_DROITE_END_X,
    ALIEN_EXTRATERRESTRE_START_ROTATE,
    ALIEN_EXTRATERRESTRE_END_ROTATE,
    ALIEN_AVANT_BRAS_PHASE1_THRESHOLD,
    ALIEN_AVANT_BRAS_SLOWED_ROTATION,
    ALIEN_AVANT_BRAS_SLOWED_XY,
    HOLOGRAM_BASES_DESKTOP_DROITE_X,
    HOLOGRAM_BASES_DESKTOP_DROITE_Y,
    HOLOGRAM_BASES_DESKTOP_GAUCHE_X,
    HOLOGRAM_BASES_DESKTOP_GAUCHE_Y,
    HOLOGRAM_BASES_TABLET_SCALE_DROITE_X,
    HOLOGRAM_BASES_TABLET_SCALE_GAUCHE_X,
    HOLOGRAM_BASES_TABLET_Y_DROITE,
    HOLOGRAM_BASES_TABLET_Y_GAUCHE,
    HOLOGRAM_BASES_VERY_SMALL_SCALE_DROITE_X,
    HOLOGRAM_BASES_VERY_SMALL_SCALE_GAUCHE_X,
    HOLOGRAM_BASES_VERY_SMALL_Y_DROITE,
    HOLOGRAM_BASES_VERY_SMALL_Y_GAUCHE,
    HOLOGRAM_BASES_SMALL_PHONE_SCALE_DROITE_X,
    HOLOGRAM_BASES_SMALL_PHONE_SCALE_GAUCHE_X,
    HOLOGRAM_BASES_SMALL_PHONE_Y_DROITE,
    HOLOGRAM_BASES_SMALL_PHONE_Y_GAUCHE,
    HOLOGRAM_BASES_MOBILE_SCALE_DROITE_X,
    HOLOGRAM_BASES_MOBILE_SCALE_GAUCHE_X,
    HOLOGRAM_BASES_MOBILE_Y_DROITE,
    HOLOGRAM_BASES_MOBILE_Y_GAUCHE,
    HOLOGRAM_BASES_DROITE_END_X,
    HOLOGRAM_BASES_DROITE_END_Y,
    HOLOGRAM_BASES_DROITE_START_ROTATE,
    HOLOGRAM_BASES_DROITE_END_ROTATE,
    HOLOGRAM_BASES_GAUCHE_END_X,
    HOLOGRAM_BASES_GAUCHE_END_Y,
    HOLOGRAM_BASES_GAUCHE_START_ROTATE,
    HOLOGRAM_BASES_GAUCHE_END_ROTATE,
    HOLOGRAM_BASES_ARC_HEIGHT,
    HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y,
    HOLOGRAM_REFLECTEURS_GAUCHE_END_SCALE_Y,
    HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y,
    HOLOGRAM_REFLECTEURS_DROIT_END_SCALE_Y,
    HOLOGRAM_ECRAN_START_SCALE_X,
    HOLOGRAM_ECRAN_END_SCALE_X,
    THIRD_SECTION_BLOCK_START,
    THIRD_SECTION_BLOCK_END,
    FOURTH_SECTION_BLOCK_START,
    FOURTH_SECTION_BLOCK_END,
    FIFTH_SECTION_BLOCK_START,
    FIFTH_SECTION_BLOCK_END,
    CONVOYEUR_PROJET_PHASE_START,
    CONVOYEUR_PROJET_PHASE_END,
    EXP_ALIEN_IN_START,
    EXP_ALIEN_IN_END,
    EXP_DOOR_OPEN_START,
    EXP_DOOR_OPEN_END,
    EXP_CHIMNEY_RISE_START,
    EXP_CHIMNEY_RISE_END,
    EXP_SMOKE_FADE_START,
    EXP_SMOKE_FADE_END,
    EXP_WINDOW_SWAP_START,
    EXP_WINDOW_SWAP_END,
    EXP_CONVEYOR_ROTATE_START,
    EXP_CONVEYOR_ROTATE_END,
    EXP_CONVEYOR_SLIDE_START,
    EXP_CONVEYOR_SLIDE_END,
    ALIEN2_WALK_CYCLES,
    ALIEN2_LEG_SWING_DEG,
    ALIEN2_ARM_SWING_DEG,
    ALIEN2_FOREARM_SWING_DEG,
    ALIEN2_START_X,
    ALIEN2_END_X_PERCENT_OF_HOUSE,
    ALIEN2_FADE_START,
    EXP_DOOR_SCALE_MIN,
    EXP_CHIMNEY_START_Y,
    EXP_CHIMNEY_RISE_Y,
    EXP_CONVEYOR_SLIDE_X,
    EXP_CONVEYOR_START_X,
    getConvoyeurScaleX,
    CONVOYEUR_SCALE_Y,
    CONVOYEUR_TOP_PERCENT,
    CONVOYEUR_PROJET_VIEWBOX_HEIGHT,
    EXP_BATTANT_OFFSET_X,
    EXP_BATTANT_OFFSET_Y,
    EXP_BATTANT_SCALE_X,
    EXP_BATTANT_SCALE_Y,
    SMOKE_PULSE_COUNT,
    EXP_BATTANT_ROTATE_START,
    EXP_BATTANT_ROTATE_END,
    EXP_QUEST_TITRE_VISIBLE_START,
    EXP_QUEST_CYCLE_COUNT,
    EXP_QUEST_WRITE_RATIO,
    EXP_QUEST_STAY_RATIO,
    EXP_QUEST_ERASE_RATIO,
    getRobotYPercentByViewport,
    ROBOT_SIZE_SCALE,
    ROBOT_FALL_DIAGONAL_X_VW,
    ROBOT_FALL_ROLL_RIGHT_X_VW,
    ROBOT_FALL_DIAGONAL_RATIO,
    ROBOT_HAND_FALL_DIAGONAL_RATIO,
    ROBOT_HAND_ROLL_FINISH_AT_FALL_PROGRESS,
    ROBOT_HAND_ROLL_EASE_POWER,
    ROBOT_HAND_ROLL_ROTATION_EASE_POWER,
    ROBOT_ROLL_TRANSFORM_ORIGIN,
    ROBOT_FALL_ORIGIN_BLEND_START,
    ROBOT_FALL_ORIGIN_BLEND_END,
    ROBOT_HEAD_SLIDE_START,
    ROBOT_HEAD_SLIDE_END,
    ROBOT_HEAD_FALL_START,
    ROBOT_HEAD_FALL_END,
    ROBOT_HAND_SLIDE_START,
    ROBOT_HAND_SLIDE_END,
    ROBOT_HAND_FALL_START,
    ROBOT_HAND_FALL_END,
    ROBOT_HAND_ROLL_DEG,
    ROBOT_HAND_FINAL_X_EXTRA_VW_LARGE,
    ROBOT_ABOVE_CONVOYEUR_BREAKPOINT_PX,
    ROBOT_HEAD_ROLL_DEG,
    PROJET_SCANIA_TEXT_START,
    PROJET_SCANIA_TEXT_END,
    PROJET_LIKETHAT_TEXT_START,
    PROJET_LIKETHAT_TEXT_END,
    PROJET_WRITE_RATIO,
    PROJET_STAY_RATIO,
    PROJET_ERASE_RATIO,
} from './constants'
import { createHandwritingAnimation } from './handwriting'
import type { ClothWipeController } from './wipeCloth'
import { setupClothWipeForClone } from './wipeCloth'

/** DEBUG : désactive temporairement l'effacement pour tester la vitesse d'écriture. */
const DISABLE_WIPE_CLOTH = false
if (DISABLE_WIPE_CLOTH) {
    console.warn('[DEBUG] wipe cloth disabled')
}

/**
 * Handwriting Expérience/Projets : modèle À propos (direct scroll-driven).
 * - WRITE : writeProgress = clamp(cycleLocal/writeEnd, 0, 1) → hw.setProgress(writeProgress)
 * - STAY / ERASE : hw.setProgress(1)
 * - Effacement : wipe cloth uniquement, n'affecte pas l'écriture
 * Réglages : EXP_QUEST_WRITE_RATIO, EXP_QUEST_STAY_RATIO, EXP_QUEST_ERASE_RATIO, PROJET_*_RATIO
 */
/** Debug handwriting/effacement : section, phase, writeProgress, eraseProgress (throttle 100 ms). */
const DEBUG_HANDWRITING = false
const DEBUG_HANDWRITING_THROTTLE_MS = 100
const _debugHandwritingLastLog: Record<string, number> = {}

/** Debug effacement clone overlay : entrée erase, clone créé/supprimé, wipe sur clone uniquement. */
const DEBUG_ERASE_CLONE = false
function debugEraseClone(...args: unknown[]) {
    if (DEBUG_ERASE_CLONE) console.log('[Erase]', ...args)
}

/** Debug scroll inverse erase : phase, transitions, clone/overlay/original. */
const DEBUG_ERASE_REVERSE = false
function debugEraseReverse(
    key: string,
    data: {
        section: string
        cycleOrProjet?: number | string
        phase: string
        previousPhase: string | null
        direction?: 'forward' | 'backward'
        eraseLocal?: number
        cloneExists?: boolean
        overlayVisible?: boolean
        originalVisible?: boolean
        event?: string
    }
) {
    if (DEBUG_ERASE_REVERSE) console.log('[Erase Reverse]', key, data)
}

/**
 * Debug activable pour la transition wipe en scroll inverse.
 * Log : section, cycle/projet, phase, previousPhase, direction, eraseLocal,
 * cloneExists, overlayVisible, originalVisible, et moments exacts
 * (clone créé / clone supprimé / overlay masqué / SVG original réaffiché).
 * Activer avec DEBUG_WIPE_REVERSE = true.
 */
const DEBUG_WIPE_REVERSE = false
function debugWipeReverse(
    moment: 'clone-created' | 'clone-removed' | 'overlay-hidden' | 'original-shown' | 'erase-update' | 'cleanup-exit-erase',
    data: {
        section: string
        cycleOrProjet: number | string
        phase: string
        previousPhase: string | null
        direction?: 'forward' | 'backward'
        eraseLocal?: number
        cloneExists?: boolean
        overlayVisible?: boolean
        originalVisible?: boolean
    }
) {
    if (DEBUG_WIPE_REVERSE) console.log('[Wipe Reverse]', moment, data)
}

function debugHandwritingLog(key: string, data: Record<string, unknown>): void {
    if (!DEBUG_HANDWRITING) return
    const now = performance.now()
    if (_debugHandwritingLastLog[key] != null && now - _debugHandwritingLastLog[key] < DEBUG_HANDWRITING_THROTTLE_MS) return
    _debugHandwritingLastLog[key] = now
    console.log('[Handwriting Debug]', key, data)
}

/** Smoothstep pour transition douce (t=0→0, t=1→1, dérivée nulle aux bords). */
function smoothstep(x: number): number {
    const t = Math.max(0, Math.min(1, x))
    return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

/** Largeur de référence pour interpolation large desktop (tWide=1 à 1920px). */
const ROCKET_WIDE_DESKTOP_WIDTH = 1920

/**
 * Paramètres responsive fusée pour la partie pilotée en JS :
 * - endYOffsetPx : offset en pixels appliqué à la position Y finale (tablette uniquement)
 * - yCompletionProgress : progress (0–1) auquel le mouvement Y se termine et où X commence.
 *
 * Le ratio de hauteur (point bas atteint avant le départ sur X) n'est plus déterminé ici :
 * il est piloté exclusivement par les responsive tokens via `rocketPhase1EndYRatio`.
 */
function getRocketResponsiveParams(viewportW: number, _viewportH: number): {
    endYOffsetPx: number
    yCompletionProgress: number
} {
    void viewportW
    // Mode desktop-only : pas d'adaptation selon la largeur.
    return {
        endYOffsetPx: 0,
        yCompletionProgress: ROCKET_Y_COMPLETION_PROGRESS,
    }
}

/** Transform-origin alien en mode desktop-only. */
function getAlienResponsiveParams(viewportW: number): { transformOrigin: 'right bottom' | 'bottom center' } {
    void viewportW
    return { transformOrigin: 'bottom center' }
}

type Point = {x: number, y: number}
/**
 * Configuration pour une animation liée au scroll
 */
export interface ScrollAnimationConfig {
    /** L'élément à animer */
    element: HTMLElement | null
    /** Les propriétés d'animation GSAP */
    animationProps: gsap.TweenVars
    /** Configuration du ScrollTrigger (optionnel, sera fusionné avec la config par défaut) */
    scrollTriggerConfig?: ScrollTrigger.Vars
}

/**
 * Configuration principale pour le système d'animations au scroll
 */
export interface ScrollAnimationsSetup {
    /** Le conteneur principal (trigger pour le scroll) */
    container: HTMLElement
    /** La distance totale du scroll (sans mouvement d'écran) */
    scrollDistance: number
    /** La largeur du viewport */
    viewportWidth: number
    /** Les animations à configurer */
    animations: ScrollAnimationConfig[]
}

/**
 * Configure toutes les animations liées au scroll horizontal
 * 
 * Ce fichier centralise toutes les animations qui suivent le scroll.
 * Pour ajouter une nouvelle animation, ajoutez-la dans le tableau animations.
 * 
 * @param setup Configuration complète des animations
 */
export function setupScrollAnimations(setup: ScrollAnimationsSetup, scrollValues: ScrollValues): void {
    const { container, animations } = setup
    // Utiliser la distance totale de scroll (sans mouvement) pour les ScrollTriggers
    const scrollDistance = scrollValues.scrollDistanceWithoutMovement

    // Configuration par défaut du ScrollTrigger pour toutes les animations
    const defaultScrollTriggerConfig: ScrollTrigger.Vars = {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        scrub: true, // Suit le scroll en temps réel - si on ne scroll pas, l'animation ne bouge pas
        invalidateOnRefresh: true,
    }

    // Configurer chaque animation
    animations.forEach((config) => {
        if (!config.element) return

        // Fusionner la config par défaut avec la config spécifique
        const scrollTriggerConfig: ScrollTrigger.Vars = {
            ...defaultScrollTriggerConfig,
            ...config.scrollTriggerConfig,
        }

        // Extraire les propriétés "from" si elles existent
        const fromProps: gsap.TweenVars = (config.animationProps as any).from || {}
        const toProps: gsap.TweenVars = { ...config.animationProps }
        delete (toProps as any).from

        // Créer l'animation avec ScrollTrigger
        // Utiliser fromTo pour s'assurer que l'animation part de la position initiale
        // Le scrollTrigger doit être dans les options du fromTo, pas dans les propriétés
        gsap.fromTo(config.element, fromProps, {
            ...toProps,
            scrollTrigger: scrollTriggerConfig,
        } as gsap.TweenVars)
    })
}

 // Fonction pour mapper le progress global vers le progress local de l'animation
 export const mapProgressToAnimation = (globalProgress: number, animationStartProgress: number, animationEndProgress: number): number => {
    if (globalProgress < animationStartProgress) {
        return 0  // Animation pas encore commencée
    }
    if (globalProgress > animationEndProgress) {
        return 1  // Animation terminée
    }
    // Mapper progress entre animationStartProgress et animationEndProgress vers 0 à 1
    const animationRange = animationEndProgress - animationStartProgress
    const localProgress = (globalProgress - animationStartProgress) / animationRange
    return Math.max(0, Math.min(1, localProgress))
}

/** Calcule scrollY, progressPhase1 et progressPhase2 à partir du progress global et des scrollValues */
export function getPhaseProgress(progress: number, scrollValues: ScrollValues): { scrollY: number; progressPhase1: number; progressPhase2: number } {
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const progressPhase1 = Math.min(1, scrollY / scrollValues.phase1EndScroll)
    const phase2Range = scrollValues.phase2EndScroll - scrollValues.phase2StartScroll
    const progressPhase2 = phase2Range <= 0 ? 0 : Math.max(0, Math.min(1, (scrollY - scrollValues.phase2StartScroll) / phase2Range))
    return { scrollY, progressPhase1, progressPhase2 }
}

/** Progression 0→1 pour alien et hologramme : commence à phase2EarlyStartScroll, fin à phase2EndScroll (avant le début officiel de la phase 2). */
export function getPhase2EarlyProgress(progress: number, scrollValues: ScrollValues): number {
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const earlyStart = scrollValues.phase2EarlyStartScroll
    const range = scrollValues.phase2EndScroll - earlyStart
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (scrollY - earlyStart) / range))
}

/**
 * Progression phase 1 pour la fusée et la flamme : 0 tant que le scroll est dans le bloc initial,
 * puis 0→1 entre la fin du bloc initial et la fin de la phase 1. Ainsi la fusée reste visible
 * au début et ne part qu’une fois que l’écran commence à bouger.
 */
export function getRocketPhase1Progress(progress: number, scrollValues: ScrollValues): number {
    const { scrollY } = getPhaseProgress(progress, scrollValues)
    const endScroll = scrollValues.rocketPhase1EndScroll ?? scrollValues.phase1EndScroll
    // Plage fusée indépendante de rocketPhase1EndScroll : retarder la caméra n’accélère plus la fusée
    const rangeRocket = endScroll * ROCKET_PROGRESS_RANGE_RATIO
    if (rangeRocket <= 0) return scrollY / endScroll
    const delay = ROCKET_ANIMATION_START_DELAY
    const startScroll = delay * rangeRocket
    if (scrollY <= startScroll) return 0
    return Math.min(1, (scrollY - startScroll) / rangeRocket)
}

/**
 * Retourne la progression du scroll (0..1) de façon sécurisée à partir du scrollTween.
 * À utiliser pour uniformiser l'accès à la progression au lieu d'accéder directement à scrollTween.scrollTrigger.progress.
 */
export function getScrollProgress(scrollTween: gsap.core.Tween | null | undefined): number {
    const st = scrollTween?.scrollTrigger
    if (!st) return 0
    const p = st.progress
    return typeof p === 'number' ? Math.max(0, Math.min(1, p)) : 0
}

/**
 * Animation de la fusée qui suit le scroll
 * Utilise containerAnimation pour synchroniser avec le scroll horizontal
 */
export function createRocketScrollAnimation(
    rocketElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween,
    firstSection?: HTMLElement | null,
    rocketPhase1EndYRatio?: number,
    responsiveTokens?: Pick<ResponsiveTokens, 'cssVars'> | null
): (() => void) | void {
    if (!rocketElement) {
        return
    }

    // Fumée fusée : une seule #fumee, alternance miroir selon diagonale haut-gauche → bas-droite, l’opacité 0 en vol / 1 atterrie
    const teteElement = rocketElement.querySelector('#tete') as HTMLElement | null
    const feuElement1 = rocketElement.querySelector('#feu1') as HTMLElement | null
    const feuElement2 = rocketElement.querySelector('#feu2') as HTMLElement | null
    const feuElement3 = rocketElement.querySelector('#feu3') as HTMLElement | null
    const fireElements = [feuElement1, feuElement2, feuElement3].filter(Boolean) as HTMLElement[]

    // ----- Fumée fusée (#fumee) : opacité + scale uniquement l’animation -----
    // En vol : opacity 0. Atterrie : opacity 1 + alternance scaleX 1 / -1 selon le scroll.
    // Constantes : ROCKET_FUMEE_OPACITY_END, ROCKET_FUMEE_PULSE_COUNT, ROCKET_LANDED_PROGRESS_THRESHOLD.

    const fumeeElement = rocketElement.querySelector('#fumee') as HTMLElement | null

    /** Applique opacity et scaleX (1 ou -1). mirror = scaleX -1. */
    const applyFumeeState = (landed: boolean, mirror: boolean): void => {
        if (!fumeeElement) return
        gsap.set(fumeeElement, {
            rotate: ROCKET_FUMEE_ROTATE,
            translateX: 30,
            opacity: landed ? ROCKET_FUMEE_OPACITY_END : 0,
            scale: mirror ? -1 : 1,
            transformOrigin: '50% 50%',
            force3D: false,
        })
    }

    /** Dernier état appliqué : on ne met à jour le DOM que si landed ou mirror change (évite flicker). */
    let fumeeState = { landed: false, mirror: false }
    /** À appeler à chaque frame avec le progress du scroll : calcule (landed, mirror) et applique si changé. */
    const updateFumeeFromProgress = (progress: number): void => {
        if (!fumeeElement) return
        const landed = progress >= ROCKET_LANDED_PROGRESS_THRESHOLD
        let mirror = false
        if (landed) {
            const t = mapProgressToAnimation(progress, ROCKET_LANDED_PROGRESS_THRESHOLD, 1)
            mirror = Math.floor(t * ROCKET_FUMEE_PULSE_COUNT) % 2 !== 0
        }
        if (landed !== fumeeState.landed || mirror !== fumeeState.mirror) {
            fumeeState = { landed, mirror }
            applyFumeeState(landed, mirror)
        }
    }

    if (fumeeElement) applyFumeeState(false, false)

    // Utiliser les valeurs uniformisées
    const scrollDistance = scrollValues.scrollDistanceWithMovement
    const rocketStartX = ROCKET_START_X
    const rocketStartY = ROCKET_START_Y
    const rocketStartRotate = ROCKET_START_ROTATE
    const rocketEndRotate = ROCKET_END_ROTATE
    
    const viewportW = scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1050)
    const viewportH = scrollValues.viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 800)
    const rocketParams = getRocketResponsiveParams(viewportW, viewportH)
    const getRocketEndX = () => {
        // Normalise le plancher X sur la largeur de référence pour garder un rendu
        // cohérent entre mobile, desktop et ultrawide.
        const viewportScale = viewportW / VIEWPORT_REFERENCE_WIDTH
        const clampedViewportScale = Math.max(0.7, Math.min(viewportScale, 2))
        const responsiveMinPx = ROCKET_END_X_MIN_PX * clampedViewportScale
        return Math.max(scrollDistance * ROCKET_END_X_MIN_RATIO, responsiveMinPx)
    }

    /** Position Y à la fin de la phase 1 (point bas atteint avant le départ sur X). Phase 2 part exactement de cette position. */
    const getPhase1EndY = () => {
        const referenceHeight = firstSection?.offsetHeight ?? viewportH
        // Correction ciblée 2560×1440 : si le token px existe, on l'utilise pour obtenir le point bas exact.
        // Cela ne touche qu'à la phase 1 (début de trajectoire), sans impacter l’atterrissage final.
        const tW2560 =
            viewportW <= 2380 || viewportW >= 2725
                ? 0
                : smoothstep((viewportW - 2380) / (2560 - 2380)) *
                  (1 - smoothstep((viewportW - 2560) / (2725 - 2560)))
        const tH2560 =
            viewportH <= 1320 || viewportH >= 1525
                ? 0
                : smoothstep((viewportH - 1320) / (1440 - 1320)) *
                  (1 - smoothstep((viewportH - 1440) / (1525 - 1440)))
        const t2560 = tW2560 * tH2560
        if (t2560 > 0 && rocketParams.endYOffsetPx === 0) {
            const tokenPhase1EndYPx = responsiveTokens?.cssVars?.['--rocket-phase1-end-y-px']
            const tokenPx = tokenPhase1EndYPx != null && tokenPhase1EndYPx !== '' ? parseFloat(tokenPhase1EndYPx) : NaN
            if (Number.isFinite(tokenPx)) return tokenPx
        }

        const ratio = (typeof rocketPhase1EndYRatio === 'number' && !Number.isNaN(rocketPhase1EndYRatio) && rocketPhase1EndYRatio > 0 && rocketPhase1EndYRatio < 2)
            ? rocketPhase1EndYRatio
            : ROCKET_END_Y_PERCENTAGE
        return referenceHeight * ratio + rocketParams.endYOffsetPx
    }

    gsap.set(rocketElement, {
        clearProps: 'left',
        x: rocketStartX,
        y: rocketStartY,
        rotate: rocketStartRotate,
        force3D: true,
    })

    const getYCompletionProgress = () => (typeof window === 'undefined' ? ROCKET_Y_COMPLETION_PROGRESS : rocketParams.yCompletionProgress)

    const updateRocketPositionX = (progress: number) => {
        const yCompletionProgress = getYCompletionProgress()
        if (progress < yCompletionProgress) return rocketStartX
        const remainingProgress = progress - yCompletionProgress
        const maxRemainingProgress = 1 - yCompletionProgress
        const xProgress = Math.min(remainingProgress / maxRemainingProgress, 1)
        // Ease-in sur toute la phase X (0→1) : plus l'exposant est élevé, plus l'accélération est progressive
        const easedProgress = Math.pow(xProgress, ROCKET_X_BASE_SPEED_EASE)
        const currentRocketEndX = getRocketEndX()
        return rocketStartX + (currentRocketEndX - rocketStartX) * easedProgress
    }

    const updateRocketRotate = (progress: number) => {
        let currentRotate: number
        const rotateProgress = progress * ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER
        currentRotate = rocketStartRotate + (rotateProgress * (rocketEndRotate - rocketStartRotate))
        if (currentRotate < rocketEndRotate) {
            currentRotate = rocketEndRotate
        }
        return currentRotate
    }

    const updateRocketPositionY = (progress: number) => {
        let currentY: number
        const verticalProgress = progress * ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER
        const phase1EndY = getPhase1EndY()
        currentY = rocketStartY + (verticalProgress * (phase1EndY - rocketStartY))
        if (currentY > phase1EndY) {
            currentY = phase1EndY
        }
        return currentY
    }

    /** Position de la fusée « atterrie » sur l'écran Contact (droite, niveau du sol). À 1920×1080 : interpolation vers (ROCKET_LANDED_X_1920, ROCKET_LANDED_Y_1920). Override via tokens --rocket-landed-x-px / --rocket-landed-y-px / --rocket-landed-rotate-deg (ex. 1024×768). */
    const getLandedPosition = (): { landedX: number; landedY: number; landedRotateDeg: number } => {
        const tokenX = responsiveTokens?.cssVars?.['--rocket-landed-x-px']
        const tokenY = responsiveTokens?.cssVars?.['--rocket-landed-y-px']
        const tokenRotate = responsiveTokens?.cssVars?.['--rocket-landed-rotate-deg']
        const overrideX = tokenX != null && tokenX !== '' ? parseFloat(tokenX) : NaN
        const overrideY = tokenY != null && tokenY !== '' ? parseFloat(tokenY) : NaN
        const overrideRotate = tokenRotate != null && tokenRotate !== '' ? parseFloat(tokenRotate) : NaN

        const inBand1680 = (() => {
            // Calibration doit rester cohérente avec responsiveTokens.ts (bande w/h).
            const CALIBRATION_1680_1050_WIDTH_MIN = 1640
            const CALIBRATION_1680_1050_WIDTH_PEAK = 1680
            const CALIBRATION_1680_1050_WIDTH_MAX = 1725
            const CALIBRATION_1680_1050_HEIGHT_MIN = 1010
            const CALIBRATION_1680_1050_HEIGHT_PEAK = 1050
            const CALIBRATION_1680_1050_HEIGHT_MAX = 1068

            const tW =
                viewportW <= CALIBRATION_1680_1050_WIDTH_MIN ||
                viewportW >= CALIBRATION_1680_1050_WIDTH_MAX
                    ? 0
                    : smoothstep((viewportW - CALIBRATION_1680_1050_WIDTH_MIN) / (CALIBRATION_1680_1050_WIDTH_PEAK - CALIBRATION_1680_1050_WIDTH_MIN)) *
                      (1 - smoothstep((viewportW - CALIBRATION_1680_1050_WIDTH_PEAK) / (CALIBRATION_1680_1050_WIDTH_MAX - CALIBRATION_1680_1050_WIDTH_PEAK)))
            if (tW === 0) return 0

            const tH =
                viewportH <= CALIBRATION_1680_1050_HEIGHT_MIN ||
                viewportH >= CALIBRATION_1680_1050_HEIGHT_MAX
                    ? 0
                    : smoothstep((viewportH - CALIBRATION_1680_1050_HEIGHT_MIN) / (CALIBRATION_1680_1050_HEIGHT_PEAK - CALIBRATION_1680_1050_HEIGHT_MIN)) *
                      (1 - smoothstep((viewportH - CALIBRATION_1680_1050_HEIGHT_PEAK) / (CALIBRATION_1680_1050_HEIGHT_MAX - CALIBRATION_1680_1050_HEIGHT_PEAK)))
            if (tH === 0) return 0

            return tW * tH
        })()

        const hasOverride = Number.isFinite(overrideX) && Number.isFinite(overrideY)
        const referenceHeight = firstSection?.offsetHeight ?? viewportH
        const baseLandedX =
            scrollValues.scrollDistanceWithMovement +
            scrollValues.viewportWidth -
            (rocketElement.offsetWidth || 0) -
            ROCKET_LANDED_X_RIGHT_OFFSET -
            (rocketElement.offsetLeft || 0) -
            ROCKET_LANDED_X_LEFT_OFFSET
        const baseLandedY = referenceHeight * ROCKET_LANDED_Y_PERCENTAGE
        const tWide = smoothstep((viewportW - LARGE_DESKTOP_MIN_WIDTH) / (ROCKET_WIDE_DESKTOP_WIDTH - LARGE_DESKTOP_MIN_WIDTH))
        const landedX = lerp(baseLandedX, ROCKET_LANDED_X_1920, tWide)
        const landedY = lerp(baseLandedY, ROCKET_LANDED_Y_1920, tWide)

        // Comportement historique inchangé en dehors de la bande 1680×1050 :
        // si tokens override existent, on les applique directement.
        if (inBand1680 === 0) {
            if (hasOverride) {
                return {
                    landedX: overrideX,
                    landedY: overrideY,
                    landedRotateDeg: Number.isFinite(overrideRotate) ? overrideRotate : ROCKET_LANDED_ROTATE,
                }
            }
            return { landedX, landedY, landedRotateDeg: ROCKET_LANDED_ROTATE }
        }

        // Dans la bande 1680×1050 uniquement : blend progressif fallback -> override.
        const landedRotateDeg = hasOverride
            ? lerp(ROCKET_LANDED_ROTATE, Number.isFinite(overrideRotate) ? overrideRotate : ROCKET_LANDED_ROTATE, inBand1680)
            : ROCKET_LANDED_ROTATE
        return {
            landedX: hasOverride ? lerp(landedX, overrideX, inBand1680) : landedX,
            landedY: hasOverride ? lerp(landedY, overrideY, inBand1680) : landedY,
            landedRotateDeg,
        }
    }

    /** Position atterrissage figée : calculée une seule fois au franchissement du seuil pour éviter que la fusée bouge/tourne encore avec le scroll. */
    let landedPositionCache: { landedX: number; landedY: number; landedRotateDeg: number } | null = null

    const applyLandedState = (landedX: number, landedY: number, landedRotateDeg: number) => {
        gsap.set(rocketElement, {
            x: landedX,
            y: landedY,
            rotate: landedRotateDeg,
            force3D: true,
        })
        if (teteElement) {
            gsap.set(teteElement, {
                x: ROCKET_TETE_LANDED_X,
                y: ROCKET_TETE_LANDED_Y,
                rotate: ROCKET_TETE_LANDED_ROTATE,
                force3D: true,
            })
        }
    }

    // Si scrollTween est disponible, utiliser containerAnimation avec gsap.to
    // Sinon, créer un nouveau ScrollTrigger
    const rocketDebugEnabled = typeof window !== 'undefined' && (window as Window & { __ROCKET_DEBUG__?: boolean }).__ROCKET_DEBUG__
    let rocketDebugLogged = false

    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase1 = getRocketPhase1Progress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                if (!rocketDebugLogged && rocketDebugEnabled) {
                    rocketDebugLogged = true
                    const referenceHeight = firstSection?.offsetHeight ?? viewportH
                    const phase1EndY = getPhase1EndY()
                    const yCompletionProgress = getYCompletionProgress()
                    const phase2StartY = updateRocketPositionY(yCompletionProgress)
                    const sameY = Math.abs(phase2StartY - phase1EndY) < 1
                    // eslint-disable-next-line no-console
                    console.log('[rocket] phase1/phase2 continuity', {
                        rocketPhase1EndYRatio: rocketPhase1EndYRatio ?? 'fallback:ROCKET_END_Y_PERCENTAGE',
                        referenceHeight,
                        phase1EndY,
                        phase2StartY,
                        sameY,
                    })
                }

                if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD) {
                    if (landedPositionCache === null) {
                        landedPositionCache = getLandedPosition()
                    }
                    applyLandedState(
                        landedPositionCache.landedX,
                        landedPositionCache.landedY,
                        landedPositionCache.landedRotateDeg
                    )
                } else {
                    landedPositionCache = null
                    const currentX = updateRocketPositionX(progressPhase1)
                    const currentY = updateRocketPositionY(progressPhase1)
                    const currentRotate = updateRocketRotate(progressPhase1)
                    gsap.set(rocketElement, {
                        x: currentX,
                        y: currentY,
                        rotate: currentRotate,
                        force3D: true,
                    })
                    if (teteElement) {
                        gsap.set(teteElement, { x: 0, y: 0, rotate: 0, force3D: true })
                    }
                }
            }

            updateFumeeFromProgress(progress)
            if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD && fireElements.length) {
                gsap.set(fireElements, { opacity: ROCKET_FIRE_OPACITY_END })
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        let landedCache: { landedX: number; landedY: number; landedRotateDeg: number } | null = null
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress
                const progressPhase1 = getRocketPhase1Progress(progress, scrollValues)
                if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD) {
                    if (landedCache === null) {
                        landedCache = getLandedPosition()
                    }
                    applyLandedState(landedCache.landedX, landedCache.landedY, landedCache.landedRotateDeg)
                    updateFumeeFromProgress(progress)
                    if (fireElements.length) {
                        gsap.set(fireElements, { opacity: ROCKET_FIRE_OPACITY_END })
                    }
                } else {
                    landedCache = null
                    const currentX = updateRocketPositionX(progressPhase1)
                    const currentY = updateRocketPositionY(progressPhase1)
                    const currentRotate = updateRocketRotate(progressPhase1)
                    gsap.set(rocketElement, {
                        x: currentX,
                        y: currentY,
                        rotate: currentRotate,
                        force3D: true,
                    })
                    if (teteElement) {
                        gsap.set(teteElement, { x: 0, y: 0, rotate: 0, force3D: true })
                    }
                    updateFumeeFromProgress(progress)
                }
            }
        })
    }
}
    
/**
 * Animation des feux de la fusée qui suivent le scroll
 */
export function createRocketFireScrollAnimation(
    rocketElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
): (() => void) | void {
    if (!rocketElement) {
        return
    }

    const feuElement1 = rocketElement.querySelector('#feu1')
    const feuElement2 = rocketElement.querySelector('#feu2')
    const feuElement3 = rocketElement.querySelector('#feu3')

    if (!feuElement1 || !feuElement2 || !feuElement3) {
        return
    }

    // Initialiser tous les feux à une opacité de 0
    gsap.set([feuElement1, feuElement2, feuElement3], { opacity: 0 })

    // Valeurs responsive pour les feux (doivent correspondre à celles de la fusée)
    const scrollDistance = scrollValues.scrollDistanceWithMovement
    const horizontalProgressMultiplier = 3

    const getFireMinX = () => {
        return scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : VIEWPORT_REFERENCE_WIDTH)
    }
    
    const getRocketEndX = () => {
        return Math.max(scrollDistance * 0.3, 500)
    }

    // Fonction pour déterminer quel feu doit être visible en fonction de la progression
    const updateFireVisibility = (progress: number) => {
        const horizontalProgress = progress * FIRE_HORIZONTAL_PROGRESS_MULTIPLIER
        const currentRocketEndX = getRocketEndX()
        const rocketX = currentRocketEndX * horizontalProgress
        const currentFireMinX = getFireMinX()
        if (rocketX < currentFireMinX - 100) {
            gsap.set([feuElement1, feuElement2, feuElement3], { opacity: 0 })
            return
        }

        const totalCycles = progress * 10 * FIRE_CYCLES_PER_SCROLL
        const cyclePosition = totalCycles % 3 // Position dans le cycle actuel (0-3)
        
        // Éteindre tous les feux d'abord
        gsap.set([feuElement1, feuElement2, feuElement3], { opacity: 0 })
        
        // Allumer le feu approprié selon la position dans le cycle
        if (cyclePosition < 1) {
            // Premier tiers du cycle : feu1 visible
            gsap.set(feuElement1, { opacity: 1 })
        } else if (cyclePosition < 2) {
            // Deuxième tiers du cycle : feu2 visible
            gsap.set(feuElement2, { opacity: 1 })
        } else {
            // Troisième tiers du cycle : feu3 visible
            gsap.set(feuElement3, { opacity: 1 })
        }
    }

    // Créer un ScrollTrigger qui met à jour les feux en fonction du scroll
    if (scrollTween && scrollTween.scrollTrigger) {
        // Utiliser le ScrollTrigger du scrollTween
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les feux
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase1 = getRocketPhase1Progress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD) {
                    gsap.set([feuElement1, feuElement2, feuElement3], { opacity: ROCKET_FIRE_OPACITY_END })
                } else {
                    updateFireVisibility(progressPhase1)
                }
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        // Créer un ScrollTrigger indépendant
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress
                if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD) {
                    gsap.set([feuElement1, feuElement2, feuElement3], { opacity: ROCKET_FIRE_OPACITY_END })
                } else {
                    const progressPhase1 = getRocketPhase1Progress(progress, scrollValues)
                    updateFireVisibility(progressPhase1)
                }
            }
        })
    }
}

/**
 * Animation du portrait qui apparaît avec une opacité de 0 à 1 quand le scroll atteint 500px.
 * Note : utilise trigger document.body avec start/end en px (scroll global). Pour une cohérence
 * totale avec le scroll horizontal, on pourrait à l'avenir dériver l'opacité de getScrollProgress(scrollTween).
 */
export function createPortraitScrollAnimation(
    portraitElement: HTMLElement | null
): void {
    if (!portraitElement) {
        return
    }

    // Initialiser l'opacité à 0 immédiatement
    gsap.set(portraitElement, { opacity: 0, immediateRender: true })

    // Créer un ScrollTrigger qui surveille le scroll vertical
    ScrollTrigger.create({
        trigger: document.body,
        start: PORTRAIT_SCROLL_START,
        end: PORTRAIT_SCROLL_END,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            const opacity = Math.max(0, Math.min(1, self.progress))
            gsap.set(portraitElement, { opacity, immediateRender: false })
        }
    })
}

/**
 * Animation du descriptionContainer (opacité 0 à 1).
 * Note : utilise trigger document.body avec start/end en px (scroll global). Pour une cohérence
 * totale avec le scroll horizontal, on pourrait à l'avenir dériver l'opacité de getScrollProgress(scrollTween).
 */
export function createDescriptionContainerScrollAnimation(
    descriptionContainerElement: HTMLElement | null
): void {
    if (!descriptionContainerElement) {
        return
    }

    // Initialiser l'opacité à 0 immédiatement
    gsap.set(descriptionContainerElement, { opacity: 0, immediateRender: true })

    // Créer un ScrollTrigger qui surveille le scroll vertical
    ScrollTrigger.create({
        trigger: document.body,
        start: DESCRIPTION_SCROLL_START,
        end: DESCRIPTION_SCROLL_END,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            const opacity = Math.max(0, Math.min(1, self.progress))
            gsap.set(descriptionContainerElement, { opacity, immediateRender: false })
        }
    })
}

/**
 * Animation des membres de l'extraterrestre qui bougent en fonction du scroll
 * Anime les bras, avant-bras, jambes-haut-droite et jambes-bas-droite
 */
export function createAlienScrollAnimation(
    alienElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
): (() => void) | void {
    if (!alienElement) {
        return
    }

    // Trouver les éléments à animer dans le SVG
    const brasGauche = alienElement.querySelector('#bras-gauche') as HTMLElement | null
    const avantBrasGauche = alienElement.querySelector('#avant-bras-gauche') as HTMLElement | null
    const brasDroit = alienElement.querySelector('#bras-droit') as HTMLElement | null
    const avantBrasDroit = alienElement.querySelector('#avant-bras-droit') as HTMLElement | null
    const jambesHautDroite = alienElement.querySelector('#jambes-haut-droite') as HTMLElement | null
    const jambesBasDroite = alienElement.querySelector('#jambes-bas-droite') as HTMLElement | null
    const extraterrestre = alienElement as HTMLElement | null

    if (!brasDroit || !avantBrasDroit || !jambesHautDroite || !jambesBasDroite || !brasGauche || !avantBrasGauche || !extraterrestre) {
        return
    }

    const brasGaucheStartRotate = ALIEN_BRAS_GAUCHE_START_ROTATE
    const brasGaucheEndRotate = ALIEN_BRAS_GAUCHE_END_ROTATE
    const avantBrasGaucheStartRotate = ALIEN_AVANT_BRAS_GAUCHE_START_ROTATE
    const avantBrasGaucheEndRotate = ALIEN_AVANT_BRAS_GAUCHE_END_ROTATE
    const avantBrasGaucheStartY = ALIEN_AVANT_BRAS_GAUCHE_START_Y
    const avantBrasGaucheEndY = ALIEN_AVANT_BRAS_GAUCHE_END_Y
    const avantBrasGaucheStartX = ALIEN_AVANT_BRAS_GAUCHE_START_X
    const avantBrasGaucheEndX = ALIEN_AVANT_BRAS_GAUCHE_END_X
    const avantBrasGaucheEndX2 = ALIEN_AVANT_BRAS_GAUCHE_END_X2
    const brasDroitStartRotate = ALIEN_BRAS_DROIT_START_ROTATE
    const brasDroitEndRotate = ALIEN_BRAS_DROIT_END_ROTATE
    const avantBrasDroitStartRotate = ALIEN_AVANT_BRAS_DROIT_START_ROTATE
    const avantBrasDroitEndRotate = ALIEN_AVANT_BRAS_DROIT_END_ROTATE
    const avantBrasDroitStartY = ALIEN_AVANT_BRAS_DROIT_START_Y
    const avantBrasDroitEndY = ALIEN_AVANT_BRAS_DROIT_END_Y
    const avantBrasDroitStartX = ALIEN_AVANT_BRAS_DROIT_START_X
    const avantBrasDroitEndX = ALIEN_AVANT_BRAS_DROIT_END_X
    const avantBrasDroitEndX2 = ALIEN_AVANT_BRAS_DROIT_END_X2
    const jambesHautDroiteStartRotate = ALIEN_JAMBES_HAUT_DROITE_START_ROTATE
    const jambesHautDroiteEndRotate = ALIEN_JAMBES_HAUT_DROITE_END_ROTATE
    const jambesBasDroiteStartRotate = ALIEN_JAMBES_BAS_DROITE_START_ROTATE
    const jambesBasDroiteEndRotate = ALIEN_JAMBES_BAS_DROITE_END_ROTATE
    const jambesBasDroiteStartY = ALIEN_JAMBES_BAS_DROITE_START_Y
    const jambesBasDroiteEndY = ALIEN_JAMBES_BAS_DROITE_END_Y
    const jambesBasDroiteStartX = ALIEN_JAMBES_BAS_DROITE_START_X
    const jambesBasDroiteEndX = ALIEN_JAMBES_BAS_DROITE_END_X
    const extraterrestreStartRotate = ALIEN_EXTRATERRESTRE_START_ROTATE
    const extraterrestreEndRotate = ALIEN_EXTRATERRESTRE_END_ROTATE

        gsap.set(brasGauche, {
            transformOrigin: 'top center',
            rotation: brasGaucheStartRotate,
            force3D: true,
        })
        gsap.set(avantBrasGauche, {
            transformOrigin: 'top center',
            rotation: avantBrasGaucheStartRotate,
            x: avantBrasGaucheStartX,
            y: avantBrasGaucheStartY,
            force3D: true,
        })
    gsap.set(brasDroit, {
        transformOrigin: 'top center',
        rotation: brasDroitStartRotate,
        force3D: true,
    })
    gsap.set(avantBrasDroit, {
        transformOrigin: 'top center',
        rotation: avantBrasDroitStartRotate,
        x: avantBrasDroitStartX,
        y: avantBrasDroitStartY,
        force3D: true,
    })
    gsap.set(jambesHautDroite, {
        transformOrigin: 'top center',
        rotation: jambesHautDroiteStartRotate,
        force3D: true,
    })
    gsap.set(jambesBasDroite, {
        transformOrigin: 'top center',
        rotation: jambesBasDroiteStartRotate,
        x: jambesBasDroiteStartX,
        y: jambesBasDroiteStartY,
        force3D: true,
    })
    const alienParams = getAlienResponsiveParams(scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1050))
    gsap.set(extraterrestre, {
        transformOrigin: alienParams.transformOrigin,
        rotation: extraterrestreStartRotate,
        force3D: true,
    })

    const getAlienAnimationStart = () => ALIEN_ANIMATION_START
    const getAlienAnimationEnd = () => ALIEN_ANIMATION_END
    const getAlienLegReturnStart = () => ALIEN_LEG_RETURN_START
    const getAlienLegReturnEnd = () => ALIEN_LEG_RETURN_END

    // Fonction pour mapper le progress global vers le progress local pour le retour des jambes
    const mapProgressToLegReturn = (globalProgress: number, legReturnStart?: number, legReturnEnd?: number): number => {
        const start = legReturnStart ?? getAlienLegReturnStart()
        const end = legReturnEnd ?? getAlienLegReturnEnd()
        if (globalProgress < start) {
            return 0  // Retour pas encore commencé
        }
        if (globalProgress > end) {
            return 1  // Retour terminé
        }
        const returnRange = end - start
        const rawProgress = (globalProgress - start) / returnRange
        const acceleratedProgress = rawProgress * rawProgress
        return Math.max(0, Math.min(1, acceleratedProgress))
    }

    // Fonction pour mettre à jour les rotations en fonction du progress
    const updateAlienLimbs = (globalProgress: number) => {
        const animationStart = getAlienAnimationStart()
        const animationEnd = getAlienAnimationEnd()
        const legReturnStart = getAlienLegReturnStart()
        const legReturnEnd = getAlienLegReturnEnd()
        const animationProgress = mapProgressToAnimation(globalProgress, animationStart, animationEnd)
        const legReturnProgress = mapProgressToLegReturn(globalProgress, legReturnStart, legReturnEnd)
        
        // Calculer les rotations basées sur le progress local (0 à 1)
        const brasGaucheRotate = brasGaucheStartRotate + (brasGaucheEndRotate - brasGaucheStartRotate) * animationProgress
        const brasDroitRotate = brasDroitStartRotate + (brasDroitEndRotate - brasDroitStartRotate) * animationProgress
        const extraterrestreRotate = extraterrestreStartRotate + (extraterrestreEndRotate - extraterrestreStartRotate) * animationProgress
        
        // Ralentir les rotations des avant-bras pour qu'ils suivent mieux les bras
        // Utiliser un facteur de ralentissement pour synchroniser avec les bras
        const slowedRotationProgress = animationProgress * ALIEN_AVANT_BRAS_SLOWED_ROTATION
        const avantBrasGaucheRotate = avantBrasGaucheStartRotate + (avantBrasGaucheEndRotate - avantBrasGaucheStartRotate) * slowedRotationProgress
        const avantBrasDroitRotate = avantBrasDroitStartRotate + (avantBrasDroitEndRotate - avantBrasDroitStartRotate) * slowedRotationProgress
        
        // Calculer les déplacements des avant-bras
        // Utiliser animationProgress pour une transition fluide, mais ralentir pour suivre les bras
        let avantBrasGaucheX: number
        let avantBrasGaucheY: number
        let avantBrasDroitX: number
        let avantBrasDroitY: number
        
        // Ralentir l'animation des avant-bras pour qu'ils suivent mieux les bras
        // Utiliser un facteur de ralentissement pour synchroniser avec les bras
        const slowedProgress = animationProgress * ALIEN_AVANT_BRAS_SLOWED_XY
        const phase1Threshold = ALIEN_AVANT_BRAS_PHASE1_THRESHOLD
        if (slowedProgress < phase1Threshold) {
            const phase1Progress = slowedProgress / phase1Threshold
            avantBrasGaucheX = avantBrasGaucheStartX + (avantBrasGaucheEndX - avantBrasGaucheStartX) * phase1Progress
            avantBrasDroitX = avantBrasDroitStartX + (avantBrasDroitEndX - avantBrasDroitStartX) * phase1Progress
            avantBrasGaucheY = avantBrasGaucheStartY + (avantBrasGaucheEndY - avantBrasGaucheStartY) * phase1Progress
            avantBrasDroitY = avantBrasDroitStartY + (avantBrasDroitEndY - avantBrasDroitStartY) * phase1Progress
        } else {
            // Phase 2 : de end à endX2 (0.7 à 1 de animationProgress ralenti)
            const phase2Progress = (slowedProgress - phase1Threshold) / (1 - phase1Threshold)
            avantBrasGaucheX = avantBrasGaucheEndX + (avantBrasGaucheEndX2 - avantBrasGaucheEndX) * phase2Progress
            avantBrasDroitX = avantBrasDroitEndX + (avantBrasDroitEndX2 - avantBrasDroitEndX) * phase2Progress
            avantBrasGaucheY = avantBrasGaucheEndY // Y reste constant dans la phase 2
            avantBrasDroitY = avantBrasDroitEndY // Y reste constant dans la phase 2
        }
        
        // Pour les jambes : utiliser animationProgress avant legReturnStart, puis legReturnProgress après
        let jambesHautDroiteRotate: number
        let jambesBasDroiteRotate: number
        let jambesBasDroiteX: number
        let jambesBasDroiteY: number
        
        if (globalProgress < legReturnStart) {
            // Phase d'extension : utiliser animationProgress
            jambesHautDroiteRotate = jambesHautDroiteStartRotate + (jambesHautDroiteEndRotate - jambesHautDroiteStartRotate) * animationProgress
            jambesBasDroiteRotate = jambesBasDroiteStartRotate + (jambesBasDroiteEndRotate - jambesBasDroiteStartRotate) * animationProgress
            jambesBasDroiteX = jambesBasDroiteStartX + (jambesBasDroiteEndX - jambesBasDroiteStartX) * animationProgress
            jambesBasDroiteY = jambesBasDroiteStartY + (jambesBasDroiteEndY - jambesBasDroiteStartY) * animationProgress
        } else {
            // Phase de retour : partir des valeurs finales et revenir vers les valeurs initiales
            const finalAnimationProgress = mapProgressToAnimation(legReturnStart, animationStart, animationEnd)
            const jambesHautDroiteFinalRotate = jambesHautDroiteStartRotate + (jambesHautDroiteEndRotate - jambesHautDroiteStartRotate) * finalAnimationProgress
            const jambesBasDroiteFinalRotate = jambesBasDroiteStartRotate + (jambesBasDroiteEndRotate - jambesBasDroiteStartRotate) * finalAnimationProgress
            const jambesBasDroiteFinalX = jambesBasDroiteStartX + (jambesBasDroiteEndX - jambesBasDroiteStartX) * finalAnimationProgress
            const jambesBasDroiteFinalY = jambesBasDroiteStartY + (jambesBasDroiteEndY - jambesBasDroiteStartY) * finalAnimationProgress
            
            // Interpoler depuis les valeurs finales vers les valeurs initiales
            jambesHautDroiteRotate = jambesHautDroiteFinalRotate + (jambesHautDroiteStartRotate - jambesHautDroiteFinalRotate) * legReturnProgress
            jambesBasDroiteRotate = jambesBasDroiteFinalRotate + (jambesBasDroiteStartRotate - jambesBasDroiteFinalRotate) * legReturnProgress
            jambesBasDroiteX = jambesBasDroiteFinalX + (jambesBasDroiteStartX - jambesBasDroiteFinalX) * legReturnProgress
            jambesBasDroiteY = jambesBasDroiteFinalY + (jambesBasDroiteStartY - jambesBasDroiteFinalY) * legReturnProgress
        }
        
        // Appliquer les rotations
        gsap.set(brasGauche, { rotation: brasGaucheRotate, force3D: true })
        gsap.set(avantBrasGauche, { rotation: avantBrasGaucheRotate, x: avantBrasGaucheX, y: avantBrasGaucheY, force3D: true })
        gsap.set(brasDroit, { rotation: brasDroitRotate, force3D: true })
        gsap.set(avantBrasDroit, { rotation: avantBrasDroitRotate, x: avantBrasDroitX, y: avantBrasDroitY, force3D: true })

        // Appliquer les animations des jambes de manière continue
        gsap.set(jambesHautDroite, { rotation: jambesHautDroiteRotate, force3D: true })
        gsap.set(jambesBasDroite, { rotation: jambesBasDroiteRotate, x: jambesBasDroiteX, y: jambesBasDroiteY, force3D: true })
        
        const alienTransform = getAlienResponsiveParams(scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1050))
        gsap.set(extraterrestre, { transformOrigin: alienTransform.transformOrigin, rotation: extraterrestreRotate, force3D: true })
    }

    // Initialiser les valeurs dès le début pour éviter les sauts
    updateAlienLimbs(0)
    
    // Si scrollTween est disponible, utiliser son ScrollTrigger
    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les membres (progress phase 2 early = alien commence avant le début phase 2)
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase2Early = getPhase2EarlyProgress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                updateAlienLimbs(progressPhase2Early)
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        // Initialiser les valeurs dès le début
        updateAlienLimbs(0)

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progressPhase2Early = getPhase2EarlyProgress(self.progress, scrollValues)
                updateAlienLimbs(progressPhase2Early)
            }
        })
    }
}

function getHologramBasesStartPositions(viewportWidth?: number): {
    baseDroite: Point
    baseGauche: Point
} {
    const w = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200)
    const desktopDroite = { x: HOLOGRAM_BASES_DESKTOP_DROITE_X, y: HOLOGRAM_BASES_DESKTOP_DROITE_Y }
    const desktopGauche = { x: HOLOGRAM_BASES_DESKTOP_GAUCHE_X, y: HOLOGRAM_BASES_DESKTOP_GAUCHE_Y }
    if (w > HOLOGRAM_BASES_TABLET_MAX) {
        return { baseDroite: desktopDroite, baseGauche: desktopGauche }
    }
    if (w > HOLOGRAM_BASES_MOBILE_MAX) {
        return {
            baseDroite: { x: desktopDroite.x * HOLOGRAM_BASES_TABLET_SCALE_DROITE_X, y: HOLOGRAM_BASES_TABLET_Y_DROITE },
            baseGauche: { x: desktopGauche.x * HOLOGRAM_BASES_TABLET_SCALE_GAUCHE_X, y: HOLOGRAM_BASES_TABLET_Y_GAUCHE },
        }
    }
    if (w <= HOLOGRAM_BASES_VERY_SMALL_PHONE_MAX) {
        return {
            baseDroite: { x: desktopDroite.x * HOLOGRAM_BASES_VERY_SMALL_SCALE_DROITE_X, y: HOLOGRAM_BASES_VERY_SMALL_Y_DROITE },
            baseGauche: { x: desktopGauche.x * HOLOGRAM_BASES_VERY_SMALL_SCALE_GAUCHE_X, y: HOLOGRAM_BASES_VERY_SMALL_Y_GAUCHE },
        }
    }
    if (w <= HOLOGRAM_BASES_SMALL_PHONE_MAX) {
        return {
            baseDroite: { x: desktopDroite.x * HOLOGRAM_BASES_SMALL_PHONE_SCALE_DROITE_X, y: HOLOGRAM_BASES_SMALL_PHONE_Y_DROITE },
            baseGauche: { x: desktopGauche.x * HOLOGRAM_BASES_SMALL_PHONE_SCALE_GAUCHE_X, y: HOLOGRAM_BASES_SMALL_PHONE_Y_GAUCHE },
        }
    }
    return {
        baseDroite: { x: desktopDroite.x * HOLOGRAM_BASES_MOBILE_SCALE_DROITE_X, y: HOLOGRAM_BASES_MOBILE_Y_DROITE },
        baseGauche: { x: desktopGauche.x * HOLOGRAM_BASES_MOBILE_SCALE_GAUCHE_X, y: HOLOGRAM_BASES_MOBILE_Y_GAUCHE },
    }
}

/**
 * Animation de l'hologramme qui bouge avec le scroll
 */
export function createHologramBasesScrollAnimation(
    hologramElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
): (() => void) | void {
    if (!hologramElement) return

    // Trouver les éléments de l'hologramme
    const baseDroite = hologramElement.querySelector('#base-droite') as HTMLElement | null
    const baseGauche = hologramElement.querySelector('#base-gauche') as HTMLElement | null

    if (!baseDroite || !baseGauche) return

    const applyInitialBases = () => {
        const { baseDroite: startD, baseGauche: startG } = getHologramBasesStartPositions(scrollValues.viewportWidth)
        gsap.set(baseDroite, {
            x: startD.x,
            y: startD.y,
            rotation: HOLOGRAM_BASES_DROITE_START_ROTATE,
            force3D: true,
        })
        gsap.set(baseGauche, {
            x: startG.x,
            y: startG.y,
            rotation: HOLOGRAM_BASES_GAUCHE_START_ROTATE,
            force3D: true,
        })
    }
    applyInitialBases()

    function arcPosition(start: Point, end: Point, progress: number, height: number): Point {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t
        const x = lerp(start.x, end.x, progress)
        const y = lerp(start.y, end.y, progress)

        const angle = Math.sin(Math.PI * progress)
        return { x, y: y - height * angle }
    }

    // Fonction pour mettre à jour les transformations en fonction du progress (progressPhase2 = bloc About)
    const updateHologramBases = (progressPhase2: number) => {
        const { baseDroite: startD, baseGauche: startG } = getHologramBasesStartPositions(scrollValues.viewportWidth)

        const animationProgress = mapProgressToAnimation(progressPhase2, HOLOGRAM_BASES_ANIMATION_START, HOLOGRAM_BASES_ANIMATION_END)

        const baseDroiteRotate = HOLOGRAM_BASES_DROITE_START_ROTATE + (HOLOGRAM_BASES_DROITE_END_ROTATE - HOLOGRAM_BASES_DROITE_START_ROTATE) * animationProgress
        const baseGaucheRotate = HOLOGRAM_BASES_GAUCHE_START_ROTATE + (HOLOGRAM_BASES_GAUCHE_END_ROTATE - HOLOGRAM_BASES_GAUCHE_START_ROTATE) * animationProgress

        const baseDroitePosition = arcPosition(
            { x: startD.x, y: startD.y },
            { x: HOLOGRAM_BASES_DROITE_END_X, y: HOLOGRAM_BASES_DROITE_END_Y },
            animationProgress,
            HOLOGRAM_BASES_ARC_HEIGHT
        )
        const baseGauchePosition = arcPosition(
            { x: startG.x, y: startG.y },
            { x: HOLOGRAM_BASES_GAUCHE_END_X, y: HOLOGRAM_BASES_GAUCHE_END_Y },
            animationProgress,
            HOLOGRAM_BASES_ARC_HEIGHT
        )

        gsap.set(baseDroite, {
            x: baseDroitePosition.x,
            y: baseDroitePosition.y,
            rotation: baseDroiteRotate,
            force3D: true,
        })
        gsap.set(baseGauche, {
            x: baseGauchePosition.x,
            y: baseGauchePosition.y,
            rotation: baseGaucheRotate,
            force3D: true,
        })
    }

    // Initialiser les valeurs dès le début pour éviter les sauts
    updateHologramBases(0)
    
    // Si scrollTween est disponible, utiliser son ScrollTrigger
    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les transformations (progress phase 2 early = hologramme commence avant le début phase 2)
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase2Early = getPhase2EarlyProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramBases(progressPhase2Early)
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        // Initialiser les valeurs dès le début
        updateHologramBases(0)

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progressPhase2Early = getPhase2EarlyProgress(self.progress, scrollValues)
                updateHologramBases(progressPhase2Early)
            }
        })
    }
}

export function createHologramReflecteursScrollAnimation(
    hologramElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
): (() => void) | void {
    if (!hologramElement) return

    const reflecteurGauche = hologramElement.querySelector('#reflecteur-gauche') as HTMLElement | null
    const reflecteurDroit = hologramElement.querySelector('#reflecteur-droit') as HTMLElement | null
    const ecran = hologramElement.querySelector('#ecran') as HTMLElement | null

    if (!reflecteurGauche || !reflecteurDroit || !ecran) return

    gsap.set(reflecteurGauche, {
        transformOrigin: 'bottom',
        scaleY: HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y,
        force3D: true,
    })

    gsap.set(reflecteurDroit, {
        transformOrigin: 'bottom',
        scaleY: HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y,
        force3D: true,
    })

    const updateHologramReflecteurs = (progressPhase2: number) => {
        const animationProgress = mapProgressToAnimation(progressPhase2, HOLOGRAM_REFLECTEURS_ANIMATION_START, HOLOGRAM_REFLECTEURS_ANIMATION_END)
        const reflecteurGaucheY = HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y + (HOLOGRAM_REFLECTEURS_GAUCHE_END_SCALE_Y - HOLOGRAM_REFLECTEURS_GAUCHE_START_SCALE_Y) * animationProgress
        const reflecteurDroitY = HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y + (HOLOGRAM_REFLECTEURS_DROIT_END_SCALE_Y - HOLOGRAM_REFLECTEURS_DROIT_START_SCALE_Y) * animationProgress
        gsap.set(reflecteurGauche, { scaleY: reflecteurGaucheY, force3D: true })
        gsap.set(reflecteurDroit, { scaleY: reflecteurDroitY, force3D: true })
    }

    // Initialiser les valeurs dès le début pour éviter les sauts
    updateHologramReflecteurs(0)

    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les transformations (progress phase 2 early = hologramme commence avant le début phase 2)
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase2Early = getPhase2EarlyProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramReflecteurs(progressPhase2Early)
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        // Initialiser les valeurs dès le début
        updateHologramReflecteurs(0)

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progressPhase2Early = getPhase2EarlyProgress(self.progress, scrollValues)
                updateHologramReflecteurs(progressPhase2Early)
            }
        })
    }
}

export function createHologramEcranScrollAnimation(
    hologramElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween,
    handwritingElement?: HTMLElement | null
): (() => void) | void {
    if (!hologramElement) return

    const ecran = hologramElement.querySelector('#ecran') as HTMLElement | null

    if (!ecran) return

    gsap.set(ecran, {
        transformOrigin: 'left',
        scaleX: HOLOGRAM_ECRAN_START_SCALE_X,
        force3D: true,
    })

    // Créer l'animation handwriting dès le début pour pouvoir la contrôler avec le scroll
    let handwritingController: ReturnType<typeof createHandwritingAnimation> | null = null
    if (handwritingElement) {
        // Durée réduite de 800 à 600 ms (+1/3 vitesse) pour la section À propos
        handwritingController = createHandwritingAnimation(handwritingElement, { duration: 600 })
    }

    const updateHologramEcran = (progressPhase2: number) => {
        const animationProgress = mapProgressToAnimation(progressPhase2, HOLOGRAM_ECRA_ANIMATION_START, HOLOGRAM_ECRA_ANIMATION_END)
        const ecranScaleX = HOLOGRAM_ECRAN_START_SCALE_X + (HOLOGRAM_ECRAN_END_SCALE_X - HOLOGRAM_ECRAN_START_SCALE_X) * animationProgress
        gsap.set(ecran, { scaleX: ecranScaleX, force3D: true })

        // Contrôler l'animation handwriting en fonction du scroll (forward et backward)
        if (handwritingController) {
            if (progressPhase2 >= HOLOGRAM_HANDWRITING_START) {
                const handwritingProgress = mapProgressToAnimation(
                    progressPhase2,
                    HOLOGRAM_HANDWRITING_START,
                    HOLOGRAM_HANDWRITING_END
                )
                // Mettre à jour la progression de l'animation
                handwritingController.setProgress(handwritingProgress)
            } else {
                // Avant le début de l'animation handwriting, s'assurer qu'elle est à 0
                handwritingController.setProgress(0)
            }
        }
    }
    
    // Initialiser les valeurs dès le début pour éviter les sauts
    updateHologramEcran(0)

    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les transformations (progress phase 2 early = hologramme commence avant le début phase 2)
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase2Early = getPhase2EarlyProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramEcran(progressPhase2Early)
            }

            rafId = requestAnimationFrame(updateLoop)
        }
        rafId = requestAnimationFrame(updateLoop)
        return () => cancelAnimationFrame(rafId)
    } else {
        // Initialiser les valeurs dès le début
        updateHologramEcran(0)

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progressPhase2Early = getPhase2EarlyProgress(self.progress, scrollValues)
                updateHologramEcran(progressPhase2Early)
            }
        })
    }
}

/** Paramètres pour createExperienceSectionScrollAnimation */
export interface ExperienceSectionScrollAnimationParams {
    container: HTMLElement
    scrollValues: ScrollValues
    scrollTween: gsap.core.Tween
    experiencesHabitationBackElement: HTMLElement | null
    experiencesHabitationFrontElement: HTMLElement | null
    alien2Element: HTMLElement | null
}

/** Calcule la progression 0–1 dans le bloc Expérience. Début/fin alignés sur le scroll horizontal (timeline), sinon fallback en px layout. */
function getExperiencePhaseProgress(progress: number, scrollValues: ScrollValues): number {
    const start = (scrollValues as ScrollValues & { progressAtStartOfThirdBlock?: number }).progressAtStartOfThirdBlock
    const end = (scrollValues as ScrollValues & { progressAtEndOfThirdBlock?: number }).progressAtEndOfThirdBlock
    if (typeof start === 'number' && typeof end === 'number') {
        const range = end - start
        if (range <= 0) return 0
        return Math.max(0, Math.min(1, (progress - start) / range))
    }
    /* Fallback si scrollValues sans progressions (ex. build manuel) : formule en px layout. */
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const referenceUnit =
        scrollValues.initialScrollBlock > 0
            ? scrollValues.initialScrollBlock / SECOND_SECTION_BLOCK_START
            : (scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH)
    const thirdBlockStart = (THIRD_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * referenceUnit
    const thirdBlockEnd = (THIRD_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * referenceUnit
    const range = thirdBlockEnd - thirdBlockStart
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (scrollY - thirdBlockStart) / range))
}

/** Calcule la progression 0–1 pour l’animation convoyeur : démarre avant la fin Expérience (progressAtConvoyeurPhaseStart), se termine à la fin Projets. */
function getProjetsPhaseProgress(progress: number, scrollValues: ScrollValues): number {
    const phaseStart = (scrollValues as ScrollValues & { progressAtConvoyeurPhaseStart?: number }).progressAtConvoyeurPhaseStart
    const end = (scrollValues as ScrollValues & { progressAtEndOfFourthBlock?: number }).progressAtEndOfFourthBlock
    if (typeof phaseStart === 'number' && typeof end === 'number') {
        const range = end - phaseStart
        if (range <= 0) return 0
        return Math.max(0, Math.min(1, (progress - phaseStart) / range))
    }
    const start = (scrollValues as ScrollValues & { progressAtEndOfThirdBlock?: number }).progressAtEndOfThirdBlock
    if (typeof start === 'number' && typeof end === 'number') {
        const range = end - start
        if (range <= 0) return 0
        return Math.max(0, Math.min(1, (progress - start) / range))
    }
    /* Fallback si scrollValues sans progressions (ex. calcul local) : formule en px layout. */
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const referenceUnit =
        scrollValues.initialScrollBlock > 0
            ? scrollValues.initialScrollBlock / SECOND_SECTION_BLOCK_START
            : (scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH)
    const phaseStartPx = (CONVOYEUR_PROJET_PHASE_START + FIRST_SECTION_PAN_SCROLL) * referenceUnit
    const phaseEndPx = (CONVOYEUR_PROJET_PHASE_END + FIRST_SECTION_PAN_SCROLL) * referenceUnit
    const range = phaseEndPx - phaseStartPx
    if (range <= 0) return 0
    return Math.max(0, Math.min(1, (scrollY - phaseStartPx) / range))
}

/**
 * Animation de la section Expérience (habitation + alien2) synchronisée au scroll.
 * Retourne une fonction cleanup pour annuler la boucle rAF.
 */
export function createExperienceSectionScrollAnimation(
    params: ExperienceSectionScrollAnimationParams
): (() => void) | void {
    const {
        scrollValues,
        scrollTween,
        experiencesHabitationBackElement,
        experiencesHabitationFrontElement,
        alien2Element,
    } = params

    if (!scrollTween?.scrollTrigger) return
    if (!experiencesHabitationBackElement && !experiencesHabitationFrontElement && !alien2Element) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.warn('[createExperienceSectionScrollAnimation] No habitation or alien2 elements provided')
        }
        return
    }

    const back = experiencesHabitationBackElement
    const front = experiencesHabitationFrontElement
    const alien2 = alien2Element
    const chemineFumee = back?.querySelector('#chemine-fumee') as HTMLElement | null
    const fumee = back?.querySelector('#fumee') as HTMLElement | null
    const avantFenetre = front?.querySelector('#avant-fenetre') as HTMLElement | null
    const fenetre = front?.querySelector('#fenetre') as HTMLElement | null
    const porte = front?.querySelector('#porte') as HTMLElement | null

    const alien2LimbIds = [
        'jambes-bas-gauche',
        'jambes-bas-droite',
        'jambes-haut-gauche',
        'jambes-haut-droite',
        'bras-gauche',
        'bras-droit',
        'avant-bras-gauche',
        'avant-bras-droit',
    ] as const
    const alien2Limbs: Record<(typeof alien2LimbIds)[number], HTMLElement | null> = {} as any
    if (alien2) {
        alien2LimbIds.forEach((id) => {
            alien2Limbs[id] = alien2.querySelector(`#${id}`) as HTMLElement | null
        })
    }

    const hasAnyExpElement =
        chemineFumee || fumee || avantFenetre || fenetre || porte || alien2
    if (!hasAnyExpElement) return

    const legOrigin = '50% 10%'
    const armOrigin = '50% 50%'

    if (alien2) {
        gsap.set(alien2, { x: ALIEN2_START_X, opacity: 1, force3D: true })
        alien2LimbIds.forEach((id) => {
            const el = alien2Limbs[id]
            if (el) {
                gsap.set(el, {
                    transformOrigin: id.startsWith('jambes') ? legOrigin : armOrigin,
                    rotation: 0,
                    force3D: true,
                })
            }
        })
    }
    if (chemineFumee) gsap.set(chemineFumee, { y: EXP_CHIMNEY_START_Y, force3D: true })
    if (fumee) gsap.set(fumee, { opacity: 0, scaleX: 1, transformOrigin: 'center center', force3D: true })
    if (avantFenetre) gsap.set(avantFenetre, { opacity: 1, force3D: true })
    if (fenetre) gsap.set(fenetre, { opacity: 0, force3D: true })
    if (porte) gsap.set(porte, { transformOrigin: 'left center', scaleX: 1, force3D: true })

    const updateExperienceSection = (progress: number) => {
        const progressExp = getExperiencePhaseProgress(progress, scrollValues)

        const alienInProgress = mapProgressToAnimation(progressExp, EXP_ALIEN_IN_START, EXP_ALIEN_IN_END)
        const doorProgress = mapProgressToAnimation(progressExp, EXP_DOOR_OPEN_START, EXP_DOOR_OPEN_END)
        const chimneyProgress = mapProgressToAnimation(progressExp, EXP_CHIMNEY_RISE_START, EXP_CHIMNEY_RISE_END)
        const smokeFadeProgress = mapProgressToAnimation(progressExp, EXP_SMOKE_FADE_START, EXP_SMOKE_FADE_END)
        const windowSwapProgress = mapProgressToAnimation(progressExp, EXP_WINDOW_SWAP_START, EXP_WINDOW_SWAP_END)

        if (alien2) {
            const habitationContainer = alien2.parentElement
            const houseWidth = habitationContainer?.offsetWidth ?? 1032
            const endX = houseWidth * ALIEN2_END_X_PERCENT_OF_HOUSE
            const moveX = ALIEN2_START_X + endX * alienInProgress
            const fadeStart = ALIEN2_FADE_START
            const opacity = alienInProgress >= fadeStart ? Math.max(0, 1 - (alienInProgress - fadeStart) / (1 - fadeStart)) : 1
            gsap.set(alien2, { x: moveX, opacity, force3D: true })

            const localWalkProgress = mapProgressToAnimation(alienInProgress, 0, Math.min(1, 1 - 0.01))
            const walkPhase = localWalkProgress * ALIEN2_WALK_CYCLES * Math.PI * 2
            const legSwing = ALIEN2_LEG_SWING_DEG
            const armSwing = ALIEN2_ARM_SWING_DEG
            const forearmSwing = ALIEN2_FOREARM_SWING_DEG

            const jambesBasGauche = alien2Limbs['jambes-bas-gauche']
            const jambesBasDroite = alien2Limbs['jambes-bas-droite']
            const jambesHautGauche = alien2Limbs['jambes-haut-gauche']
            const jambesHautDroite = alien2Limbs['jambes-haut-droite']
            const brasGauche = alien2Limbs['bras-gauche']
            const brasDroit = alien2Limbs['bras-droit']
            const avantBrasGauche = alien2Limbs['avant-bras-gauche']
            const avantBrasDroit = alien2Limbs['avant-bras-droit']

            if (jambesBasGauche)
                gsap.set(jambesBasGauche, { rotation: Math.sin(walkPhase) * legSwing, force3D: true })
            if (jambesBasDroite)
                gsap.set(jambesBasDroite, { rotation: Math.sin(walkPhase + Math.PI) * legSwing, force3D: true })
            if (jambesHautGauche)
                gsap.set(jambesHautGauche, {
                    rotation: Math.sin(walkPhase) * (legSwing * 0.6),
                    force3D: true,
                })
            if (jambesHautDroite)
                gsap.set(jambesHautDroite, {
                    rotation: Math.sin(walkPhase + Math.PI) * (legSwing * 0.6),
                    force3D: true,
                })
            if (brasGauche)
                gsap.set(brasGauche, {
                    rotation: Math.sin(walkPhase + Math.PI) * armSwing,
                    force3D: true,
                })
            if (brasDroit) gsap.set(brasDroit, { rotation: Math.sin(walkPhase) * armSwing, force3D: true })
            if (avantBrasGauche)
                gsap.set(avantBrasGauche, {
                    rotation: Math.sin(walkPhase + Math.PI / 2) * forearmSwing,
                    force3D: true,
                })
            if (avantBrasDroit)
                gsap.set(avantBrasDroit, {
                    rotation: Math.sin(walkPhase - Math.PI / 2) * forearmSwing,
                    force3D: true,
                })
        }

        if (porte) {
            const openAmount = doorProgress <= 0.5 ? doorProgress * 2 : 2 - doorProgress * 2
            const scaleX = 1 - (1 - EXP_DOOR_SCALE_MIN) * Math.sin(openAmount * (Math.PI / 2))
            gsap.set(porte, {
                scaleX,
                force3D: true,
            })
        }

        if (chemineFumee) {
            gsap.set(chemineFumee, {
                y: EXP_CHIMNEY_START_Y - chimneyProgress * EXP_CHIMNEY_RISE_Y,
                force3D: true,
            })
        }

        if (fumee) {
            const smokeSplitLocal = mapProgressToAnimation(progressExp, EXP_SMOKE_FADE_START, 1)
            const pulseIndex = Math.floor(smokeSplitLocal * SMOKE_PULSE_COUNT)
            const scaleX = pulseIndex % 2 === 0 ? 1 : -1
            gsap.set(fumee, { opacity: smokeFadeProgress, scaleX, force3D: true })
        }

        if (avantFenetre) gsap.set(avantFenetre, { opacity: 1 - windowSwapProgress, force3D: true })
        if (fenetre) gsap.set(fenetre, { opacity: windowSwapProgress, force3D: true })
    }

    updateExperienceSection(0)

    const mainScrollTrigger = scrollTween.scrollTrigger
    let rafId = 0

    const updateLoop = () => {
        const progress = mainScrollTrigger.progress
        updateExperienceSection(progress)
        rafId = requestAnimationFrame(updateLoop)
    }
    rafId = requestAnimationFrame(updateLoop)

    return () => {
        cancelAnimationFrame(rafId)
    }
}

/** Paramètres pour createExperienceQuestScrollAnimation */
export interface ExperienceQuestScrollAnimationParams {
    scrollValues: ScrollValues
    scrollTween: gsap.core.Tween
    experienceQuestTitreRef: RefObject<HTMLDivElement | null>
    experienceQuestDescripRefs: RefObject<HTMLDivElement | null>[]
    /** Racine contenant tous les .quest-descrip-svg-wrapper (ex. viewport) pour le wipe cloth. */
    root?: ParentNode
}

/**
 * Animation des écrits Quest (titre + descrip 1-6) dans la section Expérience.
 * Synchronisée au scroll, réversible.
 */
export function createExperienceQuestScrollAnimation(
    params: ExperienceQuestScrollAnimationParams
): (() => void) | void {
    const { scrollValues, scrollTween, experienceQuestTitreRef, experienceQuestDescripRefs, root } = params
    if (!scrollTween?.scrollTrigger) return
    if (!experienceQuestDescripRefs || experienceQuestDescripRefs.length < EXP_QUEST_CYCLE_COUNT) return

    const handwritingControllers: (ReturnType<typeof createHandwritingAnimation> | null)[] = []
    const clothWipeControllers: (ClothWipeController | undefined)[] = []
    const overlayCloneByCycle: (SVGSVGElement | null)[] = [null, null, null, null, null, null]
    let controllersInitialized = false

    let _lastProgressExp = -1
    const exitEraseOverlay = (container: HTMLElement, i: number, event: string) => {
        const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
        const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        if (DEBUG_WIPE_REVERSE) {
            debugWipeReverse('clone-removed', { section: 'experience', cycleOrProjet: i, phase: 'exit', previousPhase: 'erase' })
            debugWipeReverse('overlay-hidden', { section: 'experience', cycleOrProjet: i, phase: 'exit', previousPhase: 'erase' })
            debugWipeReverse('original-shown', { section: 'experience', cycleOrProjet: i, phase: 'exit', previousPhase: 'erase' })
        }
        overlayCloneByCycle[i] = null
        clothWipeControllers[i] = undefined
        if (overlay) {
            overlay.innerHTML = ''
            gsap.set(overlay, { display: 'none', visibility: 'hidden', force3D: true })
        }
        if (wrapper) gsap.set(wrapper, { visibility: 'visible', force3D: true })
        if (DEBUG_ERASE_CLONE) debugEraseClone(`clone removed block ${i}`)
        if (DEBUG_ERASE_REVERSE) debugEraseReverse(`exitEraseOverlay-${i}`, { section: 'experience', cycleOrProjet: i, phase: 'exit', previousPhase: 'erase', event })
    }

    const ensureEraseExited = (container: HTMLElement, i: number, event: string) => {
        // Règle : hors erase = original seul
        if (!DISABLE_WIPE_CLOTH && (overlayCloneByCycle[i] != null || clothWipeControllers[i] != null)) {
            exitEraseOverlay(container, i, event)
        } else {
            const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
            const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
            if (overlay) gsap.set(overlay, { display: 'none', visibility: 'hidden', force3D: true })
            if (wrapper) gsap.set(wrapper, { visibility: 'visible', force3D: true })
        }
    }

    const ensureEraseActive = (container: HTMLElement, i: number, eraseLocal: number, direction?: 'forward' | 'backward') => {
        // Règle : en erase = overlay (clone) seul, piloté en continu par eraseLocal
        const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
        const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        if (!overlay || !wrapper) return

        // Toujours forcer le mode overlay/original selon la règle
        gsap.set(wrapper, { visibility: 'hidden', force3D: true })
        // On évite tout flash : overlay rendu (display:block) mais peut rester hidden le temps d'init
        gsap.set(overlay, { display: 'block', visibility: 'hidden', force3D: true })

        if (!DISABLE_WIPE_CLOTH && clothWipeControllers[i] == null) {
            const liveSvg = container.querySelector('.quest-descrip-svg-wrapper svg.handwriting-svg') as SVGSVGElement | null
            if (liveSvg) {
                const clone = liveSvg.cloneNode(true) as SVGSVGElement
                clone.removeAttribute('data-wipe-initialized')
                overlayCloneByCycle[i] = clone
                const cloneWrapper = document.createElement('div')
                cloneWrapper.className = 'quest-erase-clone-wrapper'
                cloneWrapper.style.cssText = 'width:100%;height:100%'
                cloneWrapper.appendChild(clone)
                overlay.innerHTML = ''
                overlay.appendChild(cloneWrapper)
                const ctrl = setupClothWipeForClone(clone, i)
                clothWipeControllers[i] = ctrl
                ctrl.setProgress(eraseLocal)
                if (DEBUG_WIPE_REVERSE) debugWipeReverse('clone-created', { section: 'experience', cycleOrProjet: i, phase: 'erase', previousPhase: 'erase', direction, eraseLocal })
            }
        }

        // Mise à jour continue (réversible)
        clothWipeControllers[i]?.setProgress(eraseLocal)
        gsap.set(overlay, { display: 'block', visibility: 'visible', force3D: true })
    }

    const initControllers = () => {
        if (controllersInitialized) return
        for (let i = 0; i < EXP_QUEST_CYCLE_COUNT; i++) {
            const container = experienceQuestDescripRefs[i]?.current
            const wrapper = container?.querySelector('.quest-descrip-svg-wrapper')
            const ctrl = createHandwritingAnimation(wrapper as HTMLElement | null, { duration: 600 })
            handwritingControllers[i] = ctrl
        }
        controllersInitialized = true
    }

    const updateQuest = (progress: number) => {
        const progressExp = getExperiencePhaseProgress(progress, scrollValues)

        const titreEl = experienceQuestTitreRef?.current
        if (titreEl) {
            gsap.set(titreEl, {
                opacity: progressExp >= EXP_QUEST_TITRE_VISIBLE_START ? 1 : 0,
                force3D: true,
            })
        }

        const cycleLength = 1 / EXP_QUEST_CYCLE_COUNT
        const writeEnd = EXP_QUEST_WRITE_RATIO
        const stayEnd = EXP_QUEST_WRITE_RATIO + EXP_QUEST_STAY_RATIO
        const eraseLength = EXP_QUEST_ERASE_RATIO

        for (let i = 0; i < EXP_QUEST_CYCLE_COUNT; i++) {
            const container = experienceQuestDescripRefs[i]?.current
            if (!container) continue

            const cycleStart = i * cycleLength
            const cycleEnd = (i + 1) * cycleLength

            if (progressExp < cycleStart) {
                gsap.set(container, { opacity: 0, visibility: 'hidden', force3D: true })
                ensureEraseExited(container, i, 'before-cycle')
                debugHandwritingLog(`experience-cycle-${i}`, {
                    section: 'experience',
                    cycle: i,
                    phase: 'reset',
                    cycleLocal: 0,
                    writeProgress: 0,
                    eraseProgress: 0,
                    reset: true,
                })
                continue
            }

            if (progressExp >= cycleEnd) {
                gsap.set(container, { opacity: 0, visibility: 'hidden', force3D: true })
                ensureEraseExited(container, i, 'after-cycle')
                debugHandwritingLog(`experience-cycle-${i}`, {
                    section: 'experience',
                    cycle: i,
                    phase: 'reset',
                    cycleLocal: 1,
                    writeProgress: 0,
                    eraseProgress: 0,
                    reset: true,
                })
                continue
            }

            const cycleLocal = (progressExp - cycleStart) / cycleLength

            if (!controllersInitialized) initControllers()
            const hw = handwritingControllers[i]

            const phase = cycleLocal <= writeEnd ? 'write' : cycleLocal <= stayEnd ? 'stay' : 'erase'
            const isInErase = phase === 'erase'
            gsap.set(container, { opacity: 1, visibility: 'visible', force3D: true })
            const direction: 'forward' | 'backward' = _lastProgressExp >= 0 && progressExp < _lastProgressExp ? 'backward' : 'forward'
            _lastProgressExp = progressExp
            const eraseProgress = phase === 'erase' ? (cycleLocal - stayEnd) / eraseLength : 0

            const writeProgress = phase === 'write'
                ? Math.max(0, Math.min(1, cycleLocal / writeEnd))
                : 1
            hw?.setProgress(writeProgress)

            debugHandwritingLog(`experience-cycle-${i}`, {
                section: 'experience',
                cycle: i,
                phase,
                cycleLocal,
                writeProgress,
                eraseProgress,
            })

            if (!isInErase) {
                // write ou stay : original seul
                ensureEraseExited(container, i, `non-erase:${phase}`)
                if (DEBUG_ERASE_REVERSE && (phase === 'write' || phase === 'stay')) {
                    debugEraseReverse(`exp-${phase}-${i}`, { section: 'experience', cycleOrProjet: i, phase, previousPhase: phase, direction, event: `${phase}-branch` })
                }
            } else {
                const eraseLocal = (cycleLocal - stayEnd) / eraseLength
                if (DEBUG_ERASE_REVERSE) {
                    const overlayEl = container.querySelector('.quest-erase-overlay') as HTMLElement | null
                    const wrapperEl = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
                    debugEraseReverse(`exp-erase-${i}`, {
                        section: 'experience',
                        cycleOrProjet: i,
                        phase: 'erase',
                        previousPhase: 'erase',
                        direction,
                        eraseLocal,
                        cloneExists: !!overlayCloneByCycle[i],
                        overlayVisible: !!(overlayEl && getComputedStyle(overlayEl).display !== 'none'),
                        originalVisible: !!(wrapperEl && getComputedStyle(wrapperEl).visibility !== 'hidden'),
                        event: 'update-erase',
                    })
                }
                if (DEBUG_WIPE_REVERSE) {
                    const overlayEl = container.querySelector('.quest-erase-overlay') as HTMLElement | null
                    const wrapperEl = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
                    debugWipeReverse('erase-update', {
                        section: 'experience',
                        cycleOrProjet: i,
                        phase: 'erase',
                        previousPhase: 'erase',
                        direction,
                        eraseLocal,
                        cloneExists: !!overlayCloneByCycle[i],
                        overlayVisible: !!(overlayEl && getComputedStyle(overlayEl).display !== 'none'),
                        originalVisible: !!(wrapperEl && getComputedStyle(wrapperEl).visibility !== 'hidden'),
                    })
                }
                ensureEraseActive(container, i, eraseLocal, direction)
            }
        }
    }

    updateQuest(0)

    const mainScrollTrigger = scrollTween.scrollTrigger
    let rafId = 0
    const updateLoop = () => {
        updateQuest(mainScrollTrigger.progress)
        rafId = requestAnimationFrame(updateLoop)
    }
    rafId = requestAnimationFrame(updateLoop)

    return () => {
        cancelAnimationFrame(rafId)
        handwritingControllers.forEach((c) => c?.kill())
    }
}

/** Paramètres pour createProjetsTextScrollAnimation */
export interface ProjetsTextScrollAnimationParams {
    scrollValues: ScrollValues
    scrollTween: gsap.core.Tween
    scaniaTitreRef: RefObject<HTMLDivElement | null>
    scaniaDescRef: RefObject<HTMLDivElement | null>
    likethatTitreRef: RefObject<HTMLDivElement | null>
    likethatDescRef: RefObject<HTMLDivElement | null>
    /** Racine contenant tous les .quest-descrip-svg-wrapper pour le wipe cloth. */
    root?: ParentNode
}

/**
 * Animation des textes Scania (titre + desc) et LikeThat (titre + desc) dans la section Projets.
 * Synchronisée au scroll, réversible. Écriture : titre puis desc. Effacement : desc puis titre.
 */
/** Indices des contrôleurs wipe cloth pour Projets (après les 6 blocs Expérience) : Scania titre=6, desc=7, LikeThat titre=8, desc=9 */
const PROJET_CLOTH_INDEX = { scaniaTitre: 6, scaniaDesc: 7, likethatTitre: 8, likethatDesc: 9 } as const

export function createProjetsTextScrollAnimation(params: ProjetsTextScrollAnimationParams): (() => void) | void {
    const { scrollValues, scrollTween, scaniaTitreRef, scaniaDescRef, likethatTitreRef, likethatDescRef, root } = params
    if (!scrollTween?.scrollTrigger) return

    const handwritingControllers: {
        titre: ReturnType<typeof createHandwritingAnimation> | null
        desc: ReturnType<typeof createHandwritingAnimation> | null
    }[] = [{ titre: null, desc: null }, { titre: null, desc: null }]
    const clothWipeControllers: (ClothWipeController | undefined)[] = []
    const overlayCloneByClothIndex: Record<number, SVGSVGElement | null> = {}
    let controllersInitialized = false

    let _lastProgressProjet: Record<string, number> = { scania: -1, likethat: -1 }
    const exitEraseOverlayProjet = (container: HTMLElement, clothIdx: number, event: string) => {
        const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
        const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        if (DEBUG_WIPE_REVERSE) {
            debugWipeReverse('clone-removed', { section: 'projets', cycleOrProjet: clothIdx, phase: 'exit', previousPhase: 'erase' })
            debugWipeReverse('overlay-hidden', { section: 'projets', cycleOrProjet: clothIdx, phase: 'exit', previousPhase: 'erase' })
            debugWipeReverse('original-shown', { section: 'projets', cycleOrProjet: clothIdx, phase: 'exit', previousPhase: 'erase' })
        }
        overlayCloneByClothIndex[clothIdx] = null
        clothWipeControllers[clothIdx] = undefined
        if (overlay) {
            overlay.innerHTML = ''
            gsap.set(overlay, { display: 'none', visibility: 'hidden', force3D: true })
        }
        if (wrapper) gsap.set(wrapper, { visibility: 'visible', force3D: true })
        if (DEBUG_ERASE_CLONE) debugEraseClone(`clone removed block ${clothIdx}`)
        if (DEBUG_ERASE_REVERSE) debugEraseReverse(`exitProjet-${clothIdx}`, { section: 'projets', phase: 'exit', previousPhase: 'erase', event })
    }

    const ensureEraseExitedProjet = (container: HTMLElement, clothIdx: number, event: string) => {
        // Règle : hors erase = original seul
        if (!DISABLE_WIPE_CLOTH && (overlayCloneByClothIndex[clothIdx] != null || clothWipeControllers[clothIdx] != null)) {
            exitEraseOverlayProjet(container, clothIdx, event)
        } else {
            const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
            const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
            if (overlay) gsap.set(overlay, { display: 'none', visibility: 'hidden', force3D: true })
            if (wrapper) gsap.set(wrapper, { visibility: 'visible', force3D: true })
        }
    }

    const ensureEraseActiveProjet = (
        container: HTMLElement,
        clothIdx: number,
        eraseProgress: number,
        meta: { projetKey: string; direction?: 'forward' | 'backward' }
    ) => {
        // Règle : en erase = overlay (clone) seul, piloté en continu
        const overlay = container.querySelector('.quest-erase-overlay') as HTMLElement | null
        const wrapper = container.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        if (!overlay || !wrapper) return

        gsap.set(wrapper, { visibility: 'hidden', force3D: true })
        gsap.set(overlay, { display: 'block', visibility: 'hidden', force3D: true })

        if (!DISABLE_WIPE_CLOTH && clothWipeControllers[clothIdx] == null) {
            const liveSvg = container.querySelector('.quest-descrip-svg-wrapper svg.handwriting-svg') as SVGSVGElement | null
            if (liveSvg) {
                const clone = liveSvg.cloneNode(true) as SVGSVGElement
                clone.removeAttribute('data-wipe-initialized')
                overlayCloneByClothIndex[clothIdx] = clone
                const cloneWrapper = document.createElement('div')
                cloneWrapper.className = 'quest-erase-clone-wrapper'
                cloneWrapper.style.cssText = 'width:100%;height:100%'
                cloneWrapper.appendChild(clone)
                overlay.innerHTML = ''
                overlay.appendChild(cloneWrapper)
                const ctrl = setupClothWipeForClone(clone, clothIdx)
                clothWipeControllers[clothIdx] = ctrl
                ctrl.setProgress(eraseProgress)
                if (DEBUG_WIPE_REVERSE) {
                    debugWipeReverse('clone-created', {
                        section: 'projets',
                        cycleOrProjet: meta.projetKey,
                        phase: 'erase',
                        previousPhase: 'erase',
                        direction: meta.direction,
                        eraseLocal: eraseProgress,
                    })
                }
            }
        }

        clothWipeControllers[clothIdx]?.setProgress(eraseProgress)
        gsap.set(overlay, { display: 'block', visibility: 'visible', force3D: true })
    }

    const initControllers = () => {
        if (controllersInitialized) return
        const scaniaTitreContainer = scaniaTitreRef?.current
        const scaniaDescContainer = scaniaDescRef?.current
        const likethatTitreContainer = likethatTitreRef?.current
        const likethatDescContainer = likethatDescRef?.current
        const t1 = scaniaTitreContainer?.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        const d1 = scaniaDescContainer?.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        const t2 = likethatTitreContainer?.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        const d2 = likethatDescContainer?.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
        handwritingControllers[0].titre = createHandwritingAnimation(t1, { duration: 600 })
        handwritingControllers[0].desc = createHandwritingAnimation(d1, { duration: 600 })
        handwritingControllers[1].titre = createHandwritingAnimation(t2, { duration: 600 })
        handwritingControllers[1].desc = createHandwritingAnimation(d2, { duration: 600 })
        controllersInitialized = true
    }

    const updateProjetText = (
        containerTitre: HTMLDivElement | null,
        containerDesc: HTMLDivElement | null,
        containerParent: HTMLElement | null,
        progressLocal: number,
        ctrl: { titre: ReturnType<typeof createHandwritingAnimation> | null; desc: ReturnType<typeof createHandwritingAnimation> | null },
        clothIndices: { titre: number; desc: number }
    ) => {
        if (!containerTitre || !containerDesc || !containerParent) return
        const projetIdx = clothIndices.titre === PROJET_CLOTH_INDEX.scaniaTitre ? 0 : 1
        const prevKey = projetIdx === 0 ? 'scania' : 'likethat'
        if (progressLocal <= 0 || progressLocal >= 1) {
            gsap.set(containerParent, { opacity: 0, visibility: 'hidden', force3D: true })
            if (!DISABLE_WIPE_CLOTH) {
                ensureEraseExitedProjet(containerTitre, clothIndices.titre, 'progress-outside')
                ensureEraseExitedProjet(containerDesc, clothIndices.desc, 'progress-outside')
            }
            _lastProgressProjet[prevKey] = -1
            debugHandwritingLog(`projets-${projetIdx === 0 ? 'scania' : 'likethat'}`, {
                section: 'projets',
                projet: projetIdx === 0 ? 'scania' : 'likethat',
                phase: 'reset',
                progressLocal,
                writeProgress: { titre: 0, desc: 0 },
                eraseProgress: { titre: 0, desc: 0 },
                reset: true,
            })
            return
        }
        const writeEnd = PROJET_WRITE_RATIO
        const stayEnd = PROJET_WRITE_RATIO + PROJET_STAY_RATIO
        const eraseLength = PROJET_ERASE_RATIO

        const phase = progressLocal <= writeEnd ? 'write' : progressLocal <= stayEnd ? 'stay' : 'erase'
        const isInErase = phase === 'erase'
        gsap.set(containerParent, { opacity: 1, visibility: 'visible', force3D: true })
        if (!controllersInitialized) initControllers()
        const directionProjet: 'forward' | 'backward' =
            _lastProgressProjet[prevKey] >= 0 && progressLocal < _lastProgressProjet[prevKey] ? 'backward' : 'forward'
        _lastProgressProjet[prevKey] = progressLocal
        const eraseLocal = phase === 'erase' ? (progressLocal - stayEnd) / eraseLength : 0
        const eraseProgressTitre = phase === 'erase' ? (eraseLocal <= 0.5 ? 0 : Math.min(1, (eraseLocal - 0.5) * 2)) : 0
        const eraseProgressDesc = phase === 'erase' ? Math.min(1, eraseLocal * 2) : 0

        const writeProgressLocal = progressLocal / writeEnd
        const writeTitre = progressLocal <= writeEnd ? Math.min(1, writeProgressLocal * 2) : 1
        const writeDesc = progressLocal <= writeEnd
            ? (writeProgressLocal <= 0.5 ? 0 : Math.min(1, (writeProgressLocal - 0.5) * 2))
            : 1
        ctrl.titre?.setProgress(writeTitre)
        ctrl.desc?.setProgress(writeDesc)

        debugHandwritingLog(`projets-${projetIdx === 0 ? 'scania' : 'likethat'}`, {
            section: 'projets',
            projet: projetIdx === 0 ? 'scania' : 'likethat',
            phase,
            progressLocal,
            writeProgress: { titre: writeTitre, desc: writeDesc },
            eraseProgress: { titre: eraseProgressTitre, desc: eraseProgressDesc },
        })

        if (!isInErase) {
            // write ou stay : original seul
            ensureEraseExitedProjet(containerTitre, clothIndices.titre, `non-erase:${phase}`)
            ensureEraseExitedProjet(containerDesc, clothIndices.desc, `non-erase:${phase}`)
        } else {
            // erase : overlay seul, progression continue et réversible
            if (DEBUG_ERASE_REVERSE) {
                const ot = containerTitre.querySelector('.quest-erase-overlay') as HTMLElement | null
                const od = containerDesc.querySelector('.quest-erase-overlay') as HTMLElement | null
                const wt = containerTitre.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
                const wd = containerDesc.querySelector('.quest-descrip-svg-wrapper') as HTMLElement | null
                debugEraseReverse(`projet-erase-${prevKey}`, {
                    section: 'projets',
                    cycleOrProjet: prevKey,
                    phase: 'erase',
                    previousPhase: 'erase',
                    direction: directionProjet,
                    eraseLocal,
                    cloneExists: !!overlayCloneByClothIndex[clothIndices.titre] || !!overlayCloneByClothIndex[clothIndices.desc],
                    overlayVisible: !!(ot && getComputedStyle(ot).display !== 'none') || !!(od && getComputedStyle(od).display !== 'none'),
                    originalVisible: !!(wt && getComputedStyle(wt).visibility !== 'hidden') || !!(wd && getComputedStyle(wd).visibility !== 'hidden'),
                    event: 'update-erase',
                })
            }
            ensureEraseActiveProjet(containerTitre, clothIndices.titre, eraseProgressTitre, { projetKey: prevKey, direction: directionProjet })
            ensureEraseActiveProjet(containerDesc, clothIndices.desc, eraseProgressDesc, { projetKey: prevKey, direction: directionProjet })
        }
    }

    const updateProjetsText = (progress: number) => {
        const progressProjets = getProjetsPhaseProgress(progress, scrollValues)

        const scaniaLocal =
            progressProjets >= PROJET_SCANIA_TEXT_START && progressProjets < PROJET_SCANIA_TEXT_END
                ? (progressProjets - PROJET_SCANIA_TEXT_START) / (PROJET_SCANIA_TEXT_END - PROJET_SCANIA_TEXT_START)
                : -1
        const likethatLocal =
            progressProjets >= PROJET_LIKETHAT_TEXT_START && progressProjets < PROJET_LIKETHAT_TEXT_END
                ? (progressProjets - PROJET_LIKETHAT_TEXT_START) / (PROJET_LIKETHAT_TEXT_END - PROJET_LIKETHAT_TEXT_START)
                : -1

        const scaniaParent = scaniaTitreRef?.current?.parentElement ?? null
        const likethatParent = likethatTitreRef?.current?.parentElement ?? null

        if (scaniaLocal >= 0) {
            updateProjetText(
                scaniaTitreRef?.current ?? null,
                scaniaDescRef?.current ?? null,
                scaniaParent,
                scaniaLocal,
                handwritingControllers[0],
                { titre: PROJET_CLOTH_INDEX.scaniaTitre, desc: PROJET_CLOTH_INDEX.scaniaDesc }
            )
        } else if (scaniaTitreRef?.current?.parentElement && scaniaDescRef?.current) {
            gsap.set(scaniaTitreRef.current.parentElement, { opacity: 0, visibility: 'hidden', force3D: true })
            if (!DISABLE_WIPE_CLOTH) {
                exitEraseOverlayProjet(scaniaTitreRef.current, PROJET_CLOTH_INDEX.scaniaTitre, 'scania-outside')
                exitEraseOverlayProjet(scaniaDescRef.current, PROJET_CLOTH_INDEX.scaniaDesc, 'scania-outside')
            }
        }

        if (likethatLocal >= 0) {
            updateProjetText(
                likethatTitreRef?.current ?? null,
                likethatDescRef?.current ?? null,
                likethatParent,
                likethatLocal,
                handwritingControllers[1],
                { titre: PROJET_CLOTH_INDEX.likethatTitre, desc: PROJET_CLOTH_INDEX.likethatDesc }
            )
        } else if (likethatTitreRef?.current?.parentElement && likethatTitreRef?.current && likethatDescRef?.current) {
            gsap.set(likethatTitreRef.current.parentElement, { opacity: 0, visibility: 'hidden', force3D: true })
            if (!DISABLE_WIPE_CLOTH) {
                exitEraseOverlayProjet(likethatTitreRef.current, PROJET_CLOTH_INDEX.likethatTitre, 'likethat-outside')
                exitEraseOverlayProjet(likethatDescRef.current, PROJET_CLOTH_INDEX.likethatDesc, 'likethat-outside')
            }
        }
    }

    updateProjetsText(0)

    const mainScrollTrigger = scrollTween.scrollTrigger
    let rafId = 0
    const updateLoop = () => {
        updateProjetsText(mainScrollTrigger.progress)
        rafId = requestAnimationFrame(updateLoop)
    }
    rafId = requestAnimationFrame(updateLoop)

    return () => {
        cancelAnimationFrame(rafId)
        handwritingControllers.forEach(({ titre, desc }) => {
            titre?.kill()
            desc?.kill()
        })
    }
}

/** Paramètres pour createProjectsSectionScrollAnimation (stub) */
export interface ProjectsSectionScrollAnimationParams {
    container: HTMLElement
    scrollValues: ScrollValues
    scrollTween?: gsap.core.Tween | null
    robotHeadElement?: HTMLElement | null
    robotHandElement?: HTMLElement | null
    /** Getter du conteneur du SVG convoyeur-projet (section Projets), pour résolution après chargement async */
    getConvoyeurProjetElement?: () => HTMLElement | null
    /** Tokens responsive (robot above/ground Y %) — priorité sur getComputedStyle et getRobotYPercentByViewport */
    responsiveTokens?: Pick<ResponsiveTokens, 'robotAboveYPercent' | 'robotGroundYPercent'>
}

/**
 * Animation de la section Projets : convoyeur/battant pilotés par la plage de scroll Projets (FOURTH_SECTION_BLOCK_*).
 * La boucle rAF démarre même si le SVG n'est pas encore chargé (résolution du conteneur à chaque frame).
 * Retourne une fonction cleanup pour annuler la boucle rAF.
 */
const DEBUG_PROJETS_CONVOYEUR = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
/** Calibration robot-hand end X : activer avec window.__DEBUG_ROBOT_HAND_END_X__ = true */
const DEBUG_ROBOT_HAND_END_X = typeof window !== 'undefined' && !!(window as Window & { __DEBUG_ROBOT_HAND_END_X__?: boolean }).__DEBUG_ROBOT_HAND_END_X__

export function createProjectsSectionScrollAnimation(params: ProjectsSectionScrollAnimationParams): (() => void) | void {
    const { scrollValues, scrollTween, getConvoyeurProjetElement, robotHeadElement, robotHandElement } = params
    if (DEBUG_PROJETS_CONVOYEUR) {
        console.log('[Projets convoyeur] createProjectsSectionScrollAnimation appelé', {
            hasScrollTrigger: !!scrollTween?.scrollTrigger,
            hasGetter: !!getConvoyeurProjetElement,
            containerFromGetter: getConvoyeurProjetElement?.(),
        })
    }
    if (!scrollTween?.scrollTrigger || !getConvoyeurProjetElement) {
        if (DEBUG_PROJETS_CONVOYEUR) console.log('[Projets convoyeur] sortie early (scrollTrigger ou getter manquant)')
        return
    }

    const mainScrollTrigger = scrollTween.scrollTrigger
    let rafId = 0
    let convoyeurInited = false
    let battantInited = false
    let robotsInited = false
    let loggedFirstContainer = false
    let loggedFirstElementsFound = false
    let loggedFirstProgressInRange = false
    let loggedNeverInRange = false
    let loggedProgressOne = false
    let loggedHandEndX = false
    let frameCount = 0
    /** Debug robot (window.__ROBOT_DEBUG__ = true) : throttle et valeurs précédentes pour deltas */
    let _robotDebugLastLog = 0
    const _robotDebugPrev: { headX?: number; headY?: number; headR?: number; handX?: number; handY?: number; handR?: number } = {}

    if (DEBUG_PROJETS_CONVOYEUR) console.log('[Projets convoyeur] boucle rAF démarrée')

    const updateLoop = () => {
        frameCount++
        const progress = mainScrollTrigger.progress
        const progressProjets = getProjetsPhaseProgress(progress, scrollValues)
        const container = getConvoyeurProjetElement() ?? null
        const conv = (container?.querySelector('#convoyeur') ?? null) as HTMLElement | null
        const batt = (container?.querySelector('#battant') ?? null) as HTMLElement | null

        if (DEBUG_PROJETS_CONVOYEUR && !loggedFirstContainer) {
            loggedFirstContainer = true
            console.log('[Projets convoyeur] premier container', { container: !!container, tagName: container?.tagName })
        }
        if (DEBUG_PROJETS_CONVOYEUR && (conv || batt) && !loggedFirstElementsFound) {
            loggedFirstElementsFound = true
            console.log('[Projets convoyeur] #convoyeur / #battant trouvés', { conv: !!conv, batt: !!batt })
        }

        const isSvgEl = (el: Element): el is SVGElement => el.namespaceURI === 'http://www.w3.org/2000/svg'
        const setSvgTransform = (el: Element, value: string) => {
            if (isSvgEl(el)) el.setAttribute('transform', value)
            else (el as HTMLElement).style.transform = value
        }

        const convoyeurTranslateY = CONVOYEUR_PROJET_VIEWBOX_HEIGHT * (CONVOYEUR_TOP_PERCENT / 100)
        const convoyeurScaleX = getConvoyeurScaleX(scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1500))
        if (conv && !convoyeurInited) {
            setSvgTransform(conv, `translate(${EXP_CONVEYOR_START_X}, ${convoyeurTranslateY}) scale(${convoyeurScaleX}, ${CONVOYEUR_SCALE_Y})`)
            convoyeurInited = true
        }
        if (batt && !battantInited) {
            // À la verticale (-90°) on garde scaleX = scaleY pour ne pas réduire la longueur.
            setSvgTransform(batt, `translate(${EXP_BATTANT_OFFSET_X}, ${EXP_BATTANT_OFFSET_Y}) rotate(${EXP_BATTANT_ROTATE_START}) scale(${EXP_BATTANT_SCALE_Y}, ${EXP_BATTANT_SCALE_Y})`)
            battantInited = true
        }

        if (conv || batt) {
            if (DEBUG_PROJETS_CONVOYEUR && frameCount === 300 && !loggedNeverInRange && progressProjets <= 0) {
                loggedNeverInRange = true
                const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
                const referenceUnit =
                    scrollValues.initialScrollBlock > 0
                        ? scrollValues.initialScrollBlock / SECOND_SECTION_BLOCK_START
                        : (scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH)
                const phaseStart = (CONVOYEUR_PROJET_PHASE_START + FIRST_SECTION_PAN_SCROLL) * referenceUnit
                const phaseEnd = (CONVOYEUR_PROJET_PHASE_END + FIRST_SECTION_PAN_SCROLL) * referenceUnit
                console.log('[Projets convoyeur] après ~5s: progressProjets toujours 0', {
                    progress,
                    progressProjets,
                    scrollY,
                    phaseStart,
                    phaseEnd,
                    scrollDistanceWithoutMovement: scrollValues.scrollDistanceWithoutMovement,
                })
            }
            if (DEBUG_PROJETS_CONVOYEUR && progressProjets > 0 && !loggedFirstProgressInRange) {
                loggedFirstProgressInRange = true
                const conveyorRotateProgress = mapProgressToAnimation(
                    progressProjets,
                    EXP_CONVEYOR_ROTATE_START,
                    EXP_CONVEYOR_ROTATE_END
                )
                const conveyorSlideProgress = mapProgressToAnimation(
                    progressProjets,
                    EXP_CONVEYOR_SLIDE_START,
                    EXP_CONVEYOR_SLIDE_END
                )
                console.log('[Projets convoyeur] première frame avec progressProjets > 0', {
                    progress,
                    progressProjets,
                    conveyorRotateProgress,
                    conveyorSlideProgress,
                })
            }
            const conveyorRotateProgress = mapProgressToAnimation(
                progressProjets,
                EXP_CONVEYOR_ROTATE_START,
                EXP_CONVEYOR_ROTATE_END
            )
            const conveyorSlideProgress = mapProgressToAnimation(
                progressProjets,
                EXP_CONVEYOR_SLIDE_START,
                EXP_CONVEYOR_SLIDE_END
            )
            if (batt) {
                const battantRotation = EXP_BATTANT_ROTATE_START + conveyorRotateProgress * (EXP_BATTANT_ROTATE_END - EXP_BATTANT_ROTATE_START)
                // scaleX dépend de l'angle : scaleY à la verticale, EXP_BATTANT_SCALE_X à l'horizontale (réduit uniquement la longueur horizontale).
                const battantRotateRange = EXP_BATTANT_ROTATE_END - EXP_BATTANT_ROTATE_START
                const t = battantRotateRange !== 0 ? (battantRotation - EXP_BATTANT_ROTATE_START) / battantRotateRange : 0
                const battantScaleX = EXP_BATTANT_SCALE_Y + t * (EXP_BATTANT_SCALE_X - EXP_BATTANT_SCALE_Y)
                setSvgTransform(batt, `translate(${EXP_BATTANT_OFFSET_X}, ${EXP_BATTANT_OFFSET_Y}) rotate(${battantRotation}) scale(${battantScaleX}, ${EXP_BATTANT_SCALE_Y})`)
            }
            if (conv) {
                const stage = container?.closest?.('.horizontal-scroll-stage') as HTMLElement | null
                const endCorrection = parseFloat(stage ? getComputedStyle(stage).getPropertyValue('--convoyeur-end-correction-x-px').trim() : '') || 0
                const slideX =
                    EXP_CONVEYOR_START_X +
                    (EXP_CONVEYOR_SLIDE_X + endCorrection - EXP_CONVEYOR_START_X) * conveyorSlideProgress
                setSvgTransform(conv, `translate(${slideX}, ${convoyeurTranslateY}) scale(${convoyeurScaleX}, ${CONVOYEUR_SCALE_Y})`)
                if (DEBUG_PROJETS_CONVOYEUR && progressProjets >= 1 && !loggedProgressOne) {
                    loggedProgressOne = true
                    const finalSlideX = EXP_CONVEYOR_SLIDE_X + endCorrection
                    const tokens = stage ? {
                        '--convoyeur-left-px': getComputedStyle(stage).getPropertyValue('--convoyeur-left-px').trim(),
                        '--convoyeur-bottom-px': getComputedStyle(stage).getPropertyValue('--convoyeur-bottom-px').trim(),
                        '--convoyeur-w-px': getComputedStyle(stage).getPropertyValue('--convoyeur-w-px').trim(),
                        '--convoyeur-end-correction-x-px': getComputedStyle(stage).getPropertyValue('--convoyeur-end-correction-x-px').trim(),
                        '--robot-above-y-percent': getComputedStyle(stage).getPropertyValue('--robot-above-y-percent').trim(),
                        '--exp-hab-left-px': getComputedStyle(stage).getPropertyValue('--exp-hab-left-px').trim(),
                    } : {}
                    console.log('[Projets] progressProjets >= 1 — tokens appliqués et slideX final', { tokens, finalSlideX, progressProjets })
                }
            }
        }

        // Animation head-robot et hand-robot : priorité tokens injectés > vars CSS stage (parseFloat safe, fallback golden) > getRobotYPercentByViewport
        if (robotHeadElement || robotHandElement) {
            const viewportW = scrollValues.viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1500)
            const viewportH = scrollValues.viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 800)
            const fallbackFromViewport = getRobotYPercentByViewport(viewportW, viewportH)
            const stage = (container?.closest?.('.horizontal-scroll-stage') ?? robotHeadElement?.closest?.('.horizontal-scroll-stage') ?? robotHandElement?.closest?.('.horizontal-scroll-stage')) as HTMLElement | null
            const robotFinalXMultToken = stage ? parseFloat(getComputedStyle(stage).getPropertyValue('--robot-final-x-mult').trim()) : NaN
            const robotFinalXMult = Number.isFinite(robotFinalXMultToken) ? robotFinalXMultToken : 1
            const parseTokenPercent = (val: string, goldenFallback: number): number => {
                const n = parseFloat(val)
                return Number.isNaN(n) ? goldenFallback : n
            }
            const ROBOT_ABOVE_GOLDEN = 50
            const ROBOT_GROUND_GOLDEN = 61
            let robotAboveYPercent: number
            let robotGroundYPercent: number
            let robotSource: 'tokens' | 'stage' | 'fallback'
            if (params.responsiveTokens != null) {
                robotAboveYPercent = params.responsiveTokens.robotAboveYPercent
                robotGroundYPercent = params.responsiveTokens.robotGroundYPercent
                robotSource = 'tokens'
            } else if (stage) {
                const tokenAbove = getComputedStyle(stage).getPropertyValue('--robot-above-y-percent').trim()
                const tokenGround = getComputedStyle(stage).getPropertyValue('--robot-ground-y-percent').trim()
                robotAboveYPercent = tokenAbove ? parseTokenPercent(tokenAbove, ROBOT_ABOVE_GOLDEN) : fallbackFromViewport.above
                robotGroundYPercent = tokenGround ? parseTokenPercent(tokenGround, ROBOT_GROUND_GOLDEN) : fallbackFromViewport.ground
                robotSource = 'stage'
            } else {
                robotAboveYPercent = fallbackFromViewport.above
                robotGroundYPercent = fallbackFromViewport.ground
                robotSource = 'fallback'
            }
            const robotDebug = typeof window !== 'undefined' && ((window as Window & { __RESPONSIVE_DEBUG__?: boolean }).__RESPONSIVE_DEBUG__ || (window as Window & { __ROBOT_DEBUG__?: boolean }).__ROBOT_DEBUG__)
            if (robotDebug && !robotsInited) {
                console.log('[robot] scrollAnimations applied', { source: robotSource, appliedAbove: robotAboveYPercent, appliedGround: robotGroundYPercent })
            }
            if (!robotsInited) {
                robotsInited = true
                if (robotHeadElement) {
                    gsap.set(robotHeadElement, {
                        position: 'absolute',
                        left: '50%',
                        top: `${robotAboveYPercent}%`,
                        xPercent: -50,
                        yPercent: -50,
                        x: '-50vw',
                        opacity: 0,
                        scale: ROBOT_SIZE_SCALE,
                        force3D: true,
                    })
                }
                if (robotHandElement) {
                    gsap.set(robotHandElement, {
                        position: 'absolute',
                        left: '50%',
                        top: `${robotAboveYPercent}%`,
                        xPercent: -50,
                        yPercent: -50,
                        x: '-50vw',
                        opacity: 0,
                        scale: ROBOT_SIZE_SCALE,
                        force3D: true,
                    })
                }
            }
            const headSlideProgress = mapProgressToAnimation(progressProjets, ROBOT_HEAD_SLIDE_START, ROBOT_HEAD_SLIDE_END)
            const headFallProgress = mapProgressToAnimation(progressProjets, ROBOT_HEAD_FALL_START, ROBOT_HEAD_FALL_END)
            const handSlideProgress = mapProgressToAnimation(progressProjets, ROBOT_HAND_SLIDE_START, ROBOT_HAND_SLIDE_END)
            const handFallProgress = mapProgressToAnimation(progressProjets, ROBOT_HAND_FALL_START, ROBOT_HAND_FALL_END)

            // Head : calcul des positions (toujours pour debug, puis gsap si élément présent)
            const headOpacity = progressProjets >= ROBOT_HEAD_SLIDE_START ? 1 : 0
            let headX: number
            let headYPercent: number
            let headRotation: number
            let headTransformOrigin: string = ROBOT_ROLL_TRANSFORM_ORIGIN
            if (headSlideProgress < 1) {
                headX = -50 + 50.5 * headSlideProgress
                headYPercent = robotAboveYPercent
                headRotation = 0
            } else if (headFallProgress <= 0) {
                headX = .5
                headYPercent = robotAboveYPercent
                headRotation = 0
            } else {
                const diagonalProgress = Math.min(1, headFallProgress / ROBOT_FALL_DIAGONAL_RATIO)
                if (diagonalProgress < ROBOT_FALL_ORIGIN_BLEND_START) {
                    headTransformOrigin = ROBOT_ROLL_TRANSFORM_ORIGIN
                } else if (diagonalProgress >= ROBOT_FALL_ORIGIN_BLEND_END) {
                    headTransformOrigin = 'center center'
                } else {
                    const t = (diagonalProgress - ROBOT_FALL_ORIGIN_BLEND_START) / (ROBOT_FALL_ORIGIN_BLEND_END - ROBOT_FALL_ORIGIN_BLEND_START)
                    const originY = 100 - 50 * t
                    headTransformOrigin = `50% ${originY}%`
                }
                const rollRightProgress = ROBOT_FALL_DIAGONAL_RATIO < 1
                    ? Math.max(0, (headFallProgress - ROBOT_FALL_DIAGONAL_RATIO) / (1 - ROBOT_FALL_DIAGONAL_RATIO))
                    : 0
                headYPercent = robotAboveYPercent +
                    (robotGroundYPercent - robotAboveYPercent) * diagonalProgress
                headX = diagonalProgress < 1
                    ? 0.5 + (ROBOT_FALL_DIAGONAL_X_VW - 0.5) * diagonalProgress
                    : ROBOT_FALL_DIAGONAL_X_VW + ROBOT_FALL_ROLL_RIGHT_X_VW * robotFinalXMult * rollRightProgress
                headRotation = ROBOT_HEAD_ROLL_DEG * headFallProgress
            }
            if (robotHeadElement) {
                gsap.set(robotHeadElement, {
                    opacity: headOpacity,
                    x: `${headX}vw`,
                    top: `${headYPercent}%`,
                    rotation: headRotation,
                    transformOrigin: headTransformOrigin,
                    scale: ROBOT_SIZE_SCALE,
                    force3D: true,
                })
            }

            // Hand : calcul des positions (toujours pour debug, puis gsap si élément présent)
            const handOpacity = progressProjets >= ROBOT_HAND_SLIDE_START ? 1 : 0
            let handX: number
            let handYPercent: number
            let handRotation: number
            let handTransformOrigin: string = ROBOT_ROLL_TRANSFORM_ORIGIN
            if (handSlideProgress < 1) {
                handX = -50 + 50 * handSlideProgress
                handYPercent = robotAboveYPercent
                handRotation = 0
            } else if (handFallProgress <= 0) {
                handX = 0
                handYPercent = robotAboveYPercent
                handRotation = 0
            } else {
                const handDiagonalRatio = ROBOT_HAND_FALL_DIAGONAL_RATIO
                const diagonalProgress = Math.min(1, handFallProgress / handDiagonalRatio)
                if (diagonalProgress < ROBOT_FALL_ORIGIN_BLEND_START) {
                    handTransformOrigin = ROBOT_ROLL_TRANSFORM_ORIGIN
                } else if (diagonalProgress >= ROBOT_FALL_ORIGIN_BLEND_END) {
                    handTransformOrigin = 'center center'
                } else {
                    const t = (diagonalProgress - ROBOT_FALL_ORIGIN_BLEND_START) / (ROBOT_FALL_ORIGIN_BLEND_END - ROBOT_FALL_ORIGIN_BLEND_START)
                    const originY = 100 - 50 * t
                    handTransformOrigin = `50% ${originY}%`
                }
                // Accélérer la phase rotation/roulage de manière perceptible en compressant le progress (scrub scroll)
                const handRollBase = Math.min(
                    1,
                    ROBOT_HAND_ROLL_FINISH_AT_FALL_PROGRESS > 0
                        ? handFallProgress / ROBOT_HAND_ROLL_FINISH_AT_FALL_PROGRESS
                        : handFallProgress
                )
                const rollRightProgress = handDiagonalRatio < 1
                    ? Math.max(0, (handRollBase - handDiagonalRatio) / (1 - handDiagonalRatio))
                    : 0
                const rollRightEased = Math.pow(Math.min(1, rollRightProgress), ROBOT_HAND_ROLL_EASE_POWER)
                handYPercent = robotAboveYPercent +
                    ((robotGroundYPercent + .5) - robotAboveYPercent) * diagonalProgress
                // X en linéaire (rollRightProgress) pour éviter l'effet "arrêt puis saut" dû à l'ease-in sur rollRightEased
                handX = diagonalProgress < 1
                    ? ROBOT_FALL_DIAGONAL_X_VW * diagonalProgress
                    : ROBOT_FALL_DIAGONAL_X_VW + (ROBOT_FALL_ROLL_RIGHT_X_VW - 7) * robotFinalXMult * rollRightProgress
                if (diagonalProgress >= 1) {
                    if (viewportW > ROBOT_ABOVE_CONVOYEUR_BREAKPOINT_PX) {
                        handX += ROBOT_HAND_FINAL_X_EXTRA_VW_LARGE * robotFinalXMult * rollRightProgress
                    }
                    if (stage) {
                        const handEndXDelta = parseFloat(getComputedStyle(stage).getPropertyValue('--robot-hand-end-x-delta')) || 0
                        if (DEBUG_ROBOT_HAND_END_X && !loggedHandEndX && rollRightProgress >= 1) {
                            loggedHandEndX = true
                            console.log('[robot-hand end X]', { handXBase: handX, handEndXDelta, endXFinal: handX + handEndXDelta })
                        }
                        handX += handEndXDelta * robotFinalXMult * rollRightProgress
                    }
                }
                handRotation = ROBOT_HAND_ROLL_DEG * Math.pow(handRollBase, ROBOT_HAND_ROLL_ROTATION_EASE_POWER)
            }
            if (robotHandElement) {
                gsap.set(robotHandElement, {
                    opacity: handOpacity,
                    x: `${handX}vw`,
                    top: `${handYPercent}%`,
                    rotation: handRotation,
                    transformOrigin: handTransformOrigin,
                    scale: ROBOT_SIZE_SCALE,
                    force3D: true,
                })
            }

            // Debug robot : window.__ROBOT_DEBUG__ = true (throttle ~120 ms, deltas optionnels)
            const ROBOT_DEBUG = typeof window !== 'undefined' && !!(window as Window & { __ROBOT_DEBUG__?: boolean }).__ROBOT_DEBUG__
            if (ROBOT_DEBUG) {
                const now = Date.now()
                if (now - _robotDebugLastLog >= 120) {
                    _robotDebugLastLog = now
                    const headDelta = _robotDebugPrev.headX != null ? { x: headX - _robotDebugPrev.headX, y: headYPercent - (_robotDebugPrev.headY ?? 0), r: headRotation - (_robotDebugPrev.headR ?? 0) } : null
                    const handDelta = _robotDebugPrev.handX != null ? { x: handX - _robotDebugPrev.handX, y: handYPercent - (_robotDebugPrev.handY ?? 0), r: handRotation - (_robotDebugPrev.handR ?? 0) } : null
                    console.log('[Robot Debug]', {
                        progressProjets,
                        head: { slideP: headSlideProgress, fallP: headFallProgress, x: headX, y: headYPercent, rotate: headRotation, delta: headDelta },
                        hand: { slideP: handSlideProgress, fallP: handFallProgress, x: handX, y: handYPercent, rotate: handRotation, delta: handDelta },
                    })
                    _robotDebugPrev.headX = headX
                    _robotDebugPrev.headY = headYPercent
                    _robotDebugPrev.headR = headRotation
                    _robotDebugPrev.handX = handX
                    _robotDebugPrev.handY = handYPercent
                    _robotDebugPrev.handR = handRotation
                }
            }
        }

        rafId = requestAnimationFrame(updateLoop)
    }
    rafId = requestAnimationFrame(updateLoop)

    return () => cancelAnimationFrame(rafId)
}

/**
 * Configuration complète de toutes les animations au scroll
 * 
 * C'est ici que vous ajoutez vos nouvelles animations.
 * Chaque animation suivra automatiquement le rythme du scroll.
 */
export function configureAllScrollAnimations(
    container: HTMLElement,
    sections: HTMLElement[],
    wrapper: HTMLElement,
    rocketElement: HTMLElement | null,
    scrollTween?: gsap.core.Tween,
    scrollValues?: ScrollValues,
    portraitElement?: HTMLElement | null,
    descriptionContainerElement?: HTMLElement | null,
    alienElement?: HTMLElement | null,
    hologramElement?: HTMLElement | null,
    handwritingElement?: HTMLElement | null,
    experiencesHabitationBackElement?: HTMLElement | null,
    experiencesHabitationFrontElement?: HTMLElement | null,
    alien2Element?: HTMLElement | null,
    getConvoyeurProjetElement?: () => HTMLElement | null,
    robotHeadElement?: HTMLElement | null,
    robotHandElement?: HTMLElement | null,
    experienceQuestTitreRef?: RefObject<HTMLDivElement | null>,
    experienceQuestDescripRefs?: RefObject<HTMLDivElement | null>[],
    scaniaTitreRef?: RefObject<HTMLDivElement | null>,
    scaniaDescRef?: RefObject<HTMLDivElement | null>,
    likethatTitreRef?: RefObject<HTMLDivElement | null>,
    likethatDescRef?: RefObject<HTMLDivElement | null>,
    responsiveTokens?: Pick<ResponsiveTokens, 'robotAboveYPercent' | 'robotGroundYPercent' | 'cssVars'>
): (() => void) | void {
    // Si scrollValues n'est pas fourni, calculer les valeurs (fallback)
    if (!scrollValues) {
        const totalWidth = sections.reduce((sum, section) => sum + section.offsetWidth, 0)
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1050
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
        const scrollDistance = totalWidth - viewportWidth
        const referenceUnit = viewportWidth / VIEWPORT_REFERENCE_WIDTH
        const initialScrollBlock = SECOND_SECTION_BLOCK_START * referenceUnit
        const phase1EndScroll = (SECOND_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * referenceUnit
        const phase2StartScroll = phase1EndScroll
        const phase2EndScroll = (SECOND_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * referenceUnit
        const phase2EarlyStartScroll = Math.max(0, phase2StartScroll - PHASE2_EARLY_START_OFFSET * referenceUnit)
        const secondBlockStartWorld = SECOND_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
        const secondBlockEndWorld = SECOND_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
        const thirdBlockStartWorld = THIRD_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
        const thirdBlockEndWorld = THIRD_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
        const fourthBlockStartWorld = FOURTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
        const fourthBlockEndWorld = FOURTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
        const fifthBlockStartWorld = FIFTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
        const fifthBlockEndWorld = FIFTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
        const scrollBeforeSecondBlockWorld = FIRST_SECTION_PAN_SCROLL
        const secondBlockDurationWorld = secondBlockEndWorld - secondBlockStartWorld
        const scrollBeforeThirdBlockWorld = thirdBlockStartWorld - secondBlockEndWorld
        const thirdBlockDurationWorld = thirdBlockEndWorld - thirdBlockStartWorld
        const scrollBeforeFourthBlockWorld = fourthBlockStartWorld - thirdBlockEndWorld
        const fourthBlockDurationWorld = fourthBlockEndWorld - fourthBlockStartWorld
        const scrollBeforeFifthBlockWorld = fifthBlockStartWorld - fourthBlockEndWorld
        const fifthBlockDurationWorld = fifthBlockEndWorld - fifthBlockStartWorld
        const totalWorld =
            SECOND_SECTION_BLOCK_START +
            scrollBeforeSecondBlockWorld +
            secondBlockDurationWorld +
            scrollBeforeThirdBlockWorld +
            thirdBlockDurationWorld +
            scrollBeforeFourthBlockWorld +
            fourthBlockDurationWorld +
            scrollBeforeFifthBlockWorld +
            fifthBlockDurationWorld
        const cumulativeAtStartOfThird =
            SECOND_SECTION_BLOCK_START +
            scrollBeforeSecondBlockWorld +
            secondBlockDurationWorld +
            scrollBeforeThirdBlockWorld
        const cumulativeAtEndOfThird = cumulativeAtStartOfThird + thirdBlockDurationWorld
        const cumulativeAtEndOfFourth = cumulativeAtEndOfThird + scrollBeforeFourthBlockWorld + fourthBlockDurationWorld
        const cumulativeAtConvoyeurPhaseStart = cumulativeAtEndOfThird - thirdBlockDurationWorld * 1.5
        scrollValues = {
            scrollDistanceWithMovement: scrollDistance,
            scrollDistanceWithoutMovement: initialScrollBlock + FIRST_SECTION_PAN_SCROLL * referenceUnit + scrollDistance,
            initialScrollBlock,
            totalWidth,
            viewportWidth,
            viewportHeight,
            phase1EndScroll,
            phase2StartScroll,
            phase2EarlyStartScroll: phase2EarlyStartScroll,
            phase2EndScroll,
            rocketPhase1EndScroll: SECOND_SECTION_BLOCK_START * referenceUnit,
            progressAtStartOfThirdBlock: cumulativeAtStartOfThird / totalWorld,
            progressAtEndOfThirdBlock: cumulativeAtEndOfThird / totalWorld,
            progressAtEndOfFourthBlock: cumulativeAtEndOfFourth / totalWorld,
            progressAtConvoyeurPhaseStart: Math.max(0, cumulativeAtConvoyeurPhaseStart / totalWorld),
        }
    }

    // Rassembler toutes les animations et collecter les cleanups (rAF)
    const animations: ScrollAnimationConfig[] = []
    const cleanups: (() => void)[] = []

    // 1. Animation du portrait (opacité 0 à 1 à 500px de scroll)
    createPortraitScrollAnimation(portraitElement || null)

    // 2. Animation des feux de la fusée (utilise les valeurs uniformisées)
    const rocketFireCleanup = createRocketFireScrollAnimation(rocketElement, container, scrollValues, scrollTween)
    if (typeof rocketFireCleanup === 'function') cleanups.push(rocketFireCleanup)

    // 3. Animation de la fusée (phase 1 = chute jusqu'au point bas piloté par rocketPhase1EndYRatio)
    const rocketPhase1EndYRatioFromTokens =
        responsiveTokens && responsiveTokens.cssVars
            ? parseFloat(responsiveTokens.cssVars['--rocket-phase1-end-y-ratio'] ?? '')
            : NaN
    const rocketCleanup = createRocketScrollAnimation(
        rocketElement,
        container,
        scrollValues,
        scrollTween,
        sections[0] ?? null,
        rocketPhase1EndYRatioFromTokens,
        responsiveTokens ?? null
    )
    if (typeof rocketCleanup === 'function') cleanups.push(rocketCleanup)

    // 4. Animation du descriptionContainer (opacité 0 à 1 à 500px de scroll)
    createDescriptionContainerScrollAnimation(descriptionContainerElement || null)

    // 5. Animation des membres de l'extraterrestre
    const alienCleanup = createAlienScrollAnimation(alienElement || null, container, scrollValues, scrollTween)
    if (typeof alienCleanup === 'function') cleanups.push(alienCleanup)

    // 6. Animation de l'hologramme
    const hologramBasesCleanup = createHologramBasesScrollAnimation(hologramElement || null, container, scrollValues, scrollTween)
    if (typeof hologramBasesCleanup === 'function') cleanups.push(hologramBasesCleanup)
    const hologramReflecteursCleanup = createHologramReflecteursScrollAnimation(hologramElement || null, container, scrollValues, scrollTween)
    if (typeof hologramReflecteursCleanup === 'function') cleanups.push(hologramReflecteursCleanup)
    const hologramEcranCleanup = createHologramEcranScrollAnimation(hologramElement || null, container, scrollValues, scrollTween, handwritingElement || null)
    if (typeof hologramEcranCleanup === 'function') cleanups.push(hologramEcranCleanup)

    if (scrollTween) {
        const experienceCleanup = createExperienceSectionScrollAnimation({
            container,
            scrollValues,
            scrollTween,
            experiencesHabitationBackElement: experiencesHabitationBackElement ?? null,
            experiencesHabitationFrontElement: experiencesHabitationFrontElement ?? null,
            alien2Element: alien2Element ?? null,
        })
        if (experienceCleanup) cleanups.push(experienceCleanup)
        if (experienceQuestTitreRef && experienceQuestDescripRefs && experienceQuestDescripRefs.length >= EXP_QUEST_CYCLE_COUNT) {
            const questCleanup = createExperienceQuestScrollAnimation({
                scrollValues,
                scrollTween,
                experienceQuestTitreRef,
                experienceQuestDescripRefs,
                root: container,
            })
            if (questCleanup) cleanups.push(questCleanup)
        }
    }
    const projectsCleanup = createProjectsSectionScrollAnimation({
        container,
        scrollValues,
        scrollTween: scrollTween ?? null,
        robotHeadElement: robotHeadElement ?? null,
        robotHandElement: robotHandElement ?? null,
        getConvoyeurProjetElement: getConvoyeurProjetElement ?? undefined,
        responsiveTokens: responsiveTokens ?? undefined,
    })
    if (projectsCleanup) cleanups.push(projectsCleanup)

    if (scrollTween && scaniaTitreRef && scaniaDescRef && likethatTitreRef && likethatDescRef) {
        const projetsTextCleanup = createProjetsTextScrollAnimation({
            scrollValues,
            scrollTween,
            scaniaTitreRef,
            scaniaDescRef,
            likethatTitreRef,
            likethatDescRef,
            root: container,
        })
        if (projetsTextCleanup) cleanups.push(projetsTextCleanup)
    }

    // Configurer toutes les animations (utilise les valeurs uniformisées)
    setupScrollAnimations({
        container,
        scrollDistance: scrollValues.scrollDistanceWithoutMovement, // Utiliser la distance totale pour les ScrollTriggers
        viewportWidth: scrollValues.viewportWidth,
        animations,
    }, scrollValues)

    return () => cleanups.forEach((fn) => fn())
}
