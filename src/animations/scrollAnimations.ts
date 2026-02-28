import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ScrollValues } from './horizontalScroll'
import {
    ROCKET_ANIMATION_START_DELAY,
    ROCKET_PROGRESS_RANGE_RATIO,
    FIRST_SECTION_PAN_SCROLL,
    PHASE2_EARLY_START_OFFSET,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    VIEWPORT_REFERENCE_WIDTH,
    ROCKET_HEIGHT_PX,
    ROCKET_END_Y_PERCENTAGE,
    ROCKET_Y_COMPLETION_PROGRESS,
    ROCKET_Y_COMPLETION_MOBILE_SMALL_FACTOR,
    ROCKET_Y_COMPLETION_MOBILE_FACTOR,
    GROUND_LINE_425_MAX_WIDTH,
    ROCKET_END_Y_PERCENTAGE_425,
    ROCKET_Y_COMPLETION_425_FACTOR,
    MOBILE_SMALL_MAX_WIDTH,
    MOBILE_MAX_WIDTH,
    TABLET_MAX_WIDTH,
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
    ROCKET_FUMEE_OPACITY_END,
    ROCKET_FUMEE_ROTATE,
    ROCKET_FUMEE_PULSE_COUNT,
    ROCKET_FIRE_OPACITY_END,
    ROCKET_TETE_LANDED_X,
    ROCKET_TETE_LANDED_Y,
    ROCKET_TETE_LANDED_ROTATE,
    ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX,
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
    ALIEN2_END_X,
    ALIEN2_FADE_START,
    EXP_DOOR_SCALE_MIN,
    EXP_CHIMNEY_START_Y,
    EXP_CHIMNEY_RISE_Y,
    EXP_CONVEYOR_SLIDE_X,
    EXP_CONVEYOR_START_X,
    CONVOYEUR_SCALE_X,
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
    ROBOT_ABOVE_CONVOYEUR_Y_PERCENT,
    ROBOT_GROUND_Y_PERCENT,
    ROBOT_SIZE_SCALE,
    ROBOT_FALL_DIAGONAL_X_VW,
    ROBOT_FALL_ROLL_RIGHT_X_VW,
    ROBOT_FALL_DIAGONAL_RATIO,
    ROBOT_ROLL_TRANSFORM_ORIGIN,
    ROBOT_HEAD_SLIDE_START,
    ROBOT_HEAD_SLIDE_END,
    ROBOT_HEAD_FALL_START,
    ROBOT_HEAD_FALL_END,
    ROBOT_HAND_SLIDE_START,
    ROBOT_HAND_SLIDE_END,
    ROBOT_HAND_FALL_START,
    ROBOT_HAND_FALL_END,
    ROBOT_HAND_ROLL_DEG,
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
    firstSection?: HTMLElement | null
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
    
    const getScaleRatio = () => window.innerWidth / VIEWPORT_REFERENCE_WIDTH

    const getRocketEndX = () => {
        const scaleRatio = getScaleRatio()
        return Math.max(scrollDistance * ROCKET_END_X_MIN_RATIO, ROCKET_END_X_MIN_PX * scaleRatio)
    }
    
    const getRocketEndY = () => {
        const referenceHeight = firstSection?.offsetHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 0)
        if (typeof window === 'undefined') {
            return referenceHeight * ROCKET_END_Y_PERCENTAGE
        }
        const w = window.innerWidth
        // ≤425px : sol à 55%, fusée atterrit sur la ligne de sol
        if (w <= GROUND_LINE_425_MAX_WIDTH) return referenceHeight * ROCKET_END_Y_PERCENTAGE_425
        // ≤375px : fusée descend plus, atterrit à 76% de la hauteur du viewport
        if (w <= MOBILE_SMALL_MAX_WIDTH) return referenceHeight * 0.76
        // ≤600px : atterrit à 72%
        if (w <= MOBILE_MAX_WIDTH) return referenceHeight * 0.72
        // Tablette 601–768px : remonter d’une hauteur de fusée (trop bas sinon)
        if (w <= TABLET_MAX_WIDTH) return referenceHeight * ROCKET_END_Y_PERCENTAGE - ROCKET_HEIGHT_PX
        return referenceHeight * ROCKET_END_Y_PERCENTAGE
    }

    gsap.set(rocketElement, {
        clearProps: 'left',
        x: rocketStartX,
        y: rocketStartY,
        rotate: rocketStartRotate,
        force3D: true,
    })

    const getYCompletionProgress = () => {
        if (typeof window === 'undefined') return ROCKET_Y_COMPLETION_PROGRESS
        const w = window.innerWidth
        if (w <= GROUND_LINE_425_MAX_WIDTH) return ROCKET_Y_COMPLETION_PROGRESS * ROCKET_Y_COMPLETION_425_FACTOR
        if (w <= MOBILE_SMALL_MAX_WIDTH) return ROCKET_Y_COMPLETION_PROGRESS * ROCKET_Y_COMPLETION_MOBILE_SMALL_FACTOR
        if (w <= MOBILE_MAX_WIDTH) return ROCKET_Y_COMPLETION_PROGRESS * ROCKET_Y_COMPLETION_MOBILE_FACTOR
        return ROCKET_Y_COMPLETION_PROGRESS
    }

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
        const currentRocketEndY = getRocketEndY()
        currentY = rocketStartY + (verticalProgress * (currentRocketEndY - rocketStartY))
        if (currentY > currentRocketEndY) {
            currentY = currentRocketEndY
        }
        return currentY
    }

    /** Position de la fusée « atterrie » sur l'écran Contact (droite, niveau du sol). */
    const getLandedPosition = () => {
        const referenceHeight = firstSection?.offsetHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 0)
        const landedX =
            scrollValues.scrollDistanceWithMovement +
            scrollValues.viewportWidth -
            (rocketElement.offsetWidth || 0) -
            ROCKET_LANDED_X_RIGHT_OFFSET -
            (rocketElement.offsetLeft || 0) -
            ROCKET_LANDED_X_LEFT_OFFSET
        const landedY = referenceHeight * ROCKET_LANDED_Y_PERCENTAGE
        return { landedX, landedY }
    }
    
    // Si scrollTween est disponible, utiliser containerAnimation avec gsap.to
    // Sinon, créer un nouveau ScrollTrigger
    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger
        let lastProgress = -1
        let rafId = 0
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const progressPhase1 = getRocketPhase1Progress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                if (progress >= ROCKET_LANDED_PROGRESS_THRESHOLD) {
                    const { landedX, landedY } = getLandedPosition()
                    gsap.set(rocketElement, {
                        x: landedX,
                        y: landedY,
                        rotate: ROCKET_LANDED_ROTATE,
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
                } else {
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
                    const { landedX, landedY } = getLandedPosition()
                    gsap.set(rocketElement, {
                        x: landedX,
                        y: landedY,
                        rotate: ROCKET_LANDED_ROTATE,
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
                    updateFumeeFromProgress(progress)
                    if (fireElements.length) {
                        gsap.set(fireElements, { opacity: ROCKET_FIRE_OPACITY_END })
                    }
                } else {
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

    const getScaleRatio = () => {
        const currentViewportWidth = window.innerWidth
        return currentViewportWidth / VIEWPORT_REFERENCE_WIDTH
    }

    const getFireMinX = () => {
        const scaleRatio = getScaleRatio()
        return VIEWPORT_REFERENCE_WIDTH * scaleRatio
    }
    
    const getRocketEndX = () => {
        const scaleRatio = getScaleRatio()
        return Math.max(scrollDistance * 0.3, 500 * scaleRatio)
    }

    // Fonction pour déterminer quel feu doit être visible en fonction de la progression
    const updateFireVisibility = (progress: number) => {
        const horizontalProgress = progress * FIRE_HORIZONTAL_PROGRESS_MULTIPLIER
        const currentRocketEndX = getRocketEndX()
        const rocketX = currentRocketEndX * horizontalProgress
        const currentFireMinX = getFireMinX()
        const scaleRatio = getScaleRatio()

        if (rocketX < currentFireMinX - (100 * scaleRatio)) {
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
    const alienTransformOrigin = typeof window !== 'undefined' && window.innerWidth <= ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX ? 'right bottom' : 'bottom center'
    gsap.set(extraterrestre, {
        transformOrigin: alienTransformOrigin,
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
        
        const transformOrigin = typeof window !== 'undefined' && window.innerWidth <= ALIEN_TRANSFORM_ORIGIN_MOBILE_MAX ? 'right bottom' : 'bottom center'
        gsap.set(extraterrestre, { transformOrigin, rotation: extraterrestreRotate, force3D: true })
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

function getHologramBasesStartPositions(): {
    baseDroite: Point
    baseGauche: Point
} {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
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
        const { baseDroite: startD, baseGauche: startG } = getHologramBasesStartPositions()
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
        const { baseDroite: startD, baseGauche: startG } = getHologramBasesStartPositions()

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
        handwritingController = createHandwritingAnimation(handwritingElement)
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

/** Calcule la progression 0–1 dans le bloc Expérience. Début/fin alignés sur le scroll horizontal : l’animation ne démarre que lorsque la section Expérience est à l’écran (après FIRST_SECTION_PAN_SCROLL). */
function getExperiencePhaseProgress(progress: number, scrollValues: ScrollValues): number {
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const scaleRatio = scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH
    const thirdBlockStart = (THIRD_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * scaleRatio
    const thirdBlockEnd = (THIRD_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * scaleRatio
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
    /* Fallback si scrollValues sans progressions (ex. calcul local) : ancienne formule en px (peut être décalée). */
    const scrollY = progress * scrollValues.scrollDistanceWithoutMovement
    const scaleRatio = scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH
    const phaseStartPx = (CONVOYEUR_PROJET_PHASE_START + FIRST_SECTION_PAN_SCROLL) * scaleRatio
    const phaseEndPx = (CONVOYEUR_PROJET_PHASE_END + FIRST_SECTION_PAN_SCROLL) * scaleRatio
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
            const moveX = ALIEN2_START_X + (ALIEN2_END_X - ALIEN2_START_X) * alienInProgress
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
}

/**
 * Animation des écrits Quest (titre + descrip 1-6) dans la section Expérience.
 * Synchronisée au scroll, réversible.
 */
export function createExperienceQuestScrollAnimation(
    params: ExperienceQuestScrollAnimationParams
): (() => void) | void {
    const { scrollValues, scrollTween, experienceQuestTitreRef, experienceQuestDescripRefs } = params
    if (!scrollTween?.scrollTrigger) return
    if (!experienceQuestDescripRefs || experienceQuestDescripRefs.length < EXP_QUEST_CYCLE_COUNT) return

    const handwritingControllers: (ReturnType<typeof createHandwritingAnimation> | null)[] = []
    let controllersInitialized = false

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
                continue
            }

            if (progressExp >= cycleEnd) {
                gsap.set(container, { opacity: 0, visibility: 'hidden', force3D: true })
                continue
            }

            gsap.set(container, { opacity: 1, visibility: 'visible', force3D: true })

            const cycleLocal = (progressExp - cycleStart) / cycleLength

            if (!controllersInitialized) initControllers()
            const hw = handwritingControllers[i]

            if (cycleLocal <= writeEnd) {
                const writeProgress = cycleLocal / writeEnd
                hw?.setProgress(writeProgress)
                const masks = container.querySelectorAll('.quest-erase-mask')
                masks.forEach((m) => gsap.set(m as HTMLElement, { '--a': '0deg', force3D: true }))
            } else if (cycleLocal <= stayEnd) {
                hw?.setProgress(1)
                const masks = container.querySelectorAll('.quest-erase-mask')
                masks.forEach((m) => gsap.set(m as HTMLElement, { '--a': '0deg', force3D: true }))
            } else {
                hw?.setProgress(1)
                const eraseLocal = (cycleLocal - stayEnd) / eraseLength
                const mask1 = container.querySelector('.quest-erase-mask-1') as HTMLElement | null
                const mask2 = container.querySelector('.quest-erase-mask-2') as HTMLElement | null
                const mask3 = container.querySelector('.quest-erase-mask-3') as HTMLElement | null
                const mask4 = container.querySelector('.quest-erase-mask-4') as HTMLElement | null
                const s1 = Math.min(1, Math.max(0, eraseLocal * 4))
                const s2 = eraseLocal <= 1 / 4 ? 0 : Math.min(1, Math.max(0, (eraseLocal - 1 / 4) * 4))
                const s3 = eraseLocal <= 2 / 4 ? 0 : Math.min(1, Math.max(0, (eraseLocal - 2 / 4) * 4))
                const s4 = eraseLocal <= 3 / 4 ? 0 : Math.min(1, Math.max(0, (eraseLocal - 3 / 4) * 4))
                if (mask1) gsap.set(mask1, { '--a': `${s1 * 220}deg`, force3D: true })
                if (mask2) gsap.set(mask2, { '--a': `${s2 * 220}deg`, force3D: true })
                if (mask3) gsap.set(mask3, { '--a': `${s3 * 220}deg`, force3D: true })
                if (mask4) gsap.set(mask4, { '--a': `${s4 * 220}deg`, force3D: true })
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
}

/**
 * Animation des textes Scania (titre + desc) et LikeThat (titre + desc) dans la section Projets.
 * Synchronisée au scroll, réversible. Écriture : titre puis desc. Effacement : desc puis titre.
 */
export function createProjetsTextScrollAnimation(params: ProjetsTextScrollAnimationParams): (() => void) | void {
    const { scrollValues, scrollTween, scaniaTitreRef, scaniaDescRef, likethatTitreRef, likethatDescRef } = params
    if (!scrollTween?.scrollTrigger) return

    const handwritingControllers: {
        titre: ReturnType<typeof createHandwritingAnimation> | null
        desc: ReturnType<typeof createHandwritingAnimation> | null
    }[] = [{ titre: null, desc: null }, { titre: null, desc: null }]
    let controllersInitialized = false

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
        ctrl: { titre: ReturnType<typeof createHandwritingAnimation> | null; desc: ReturnType<typeof createHandwritingAnimation> | null }
    ) => {
        if (!containerTitre || !containerDesc || !containerParent) return
        if (progressLocal <= 0 || progressLocal >= 1) {
            gsap.set(containerParent, { opacity: 0, visibility: 'hidden', force3D: true })
            return
        }
        gsap.set(containerParent, { opacity: 1, visibility: 'visible', force3D: true })
        if (!controllersInitialized) initControllers()

        const writeEnd = PROJET_WRITE_RATIO
        const stayEnd = PROJET_WRITE_RATIO + PROJET_STAY_RATIO
        const eraseLength = PROJET_ERASE_RATIO

        if (progressLocal <= writeEnd) {
            const writeProgress = progressLocal / writeEnd
            const titreProgress = Math.min(1, writeProgress * 2)
            const descProgress = writeProgress <= 0.5 ? 0 : Math.min(1, (writeProgress - 0.5) * 2)
            ctrl.titre?.setProgress(titreProgress)
            ctrl.desc?.setProgress(descProgress)
            ;[containerTitre, containerDesc].forEach((c) => {
                c.querySelectorAll('.quest-erase-mask').forEach((m) => gsap.set(m as HTMLElement, { '--a': '0deg', force3D: true }))
            })
        } else if (progressLocal <= stayEnd) {
            ctrl.titre?.setProgress(1)
            ctrl.desc?.setProgress(1)
            ;[containerTitre, containerDesc].forEach((c) => {
                c.querySelectorAll('.quest-erase-mask').forEach((m) => gsap.set(m as HTMLElement, { '--a': '0deg', force3D: true }))
            })
        } else {
            ctrl.titre?.setProgress(1)
            ctrl.desc?.setProgress(1)
            const eraseLocal = (progressLocal - stayEnd) / eraseLength
            const descErase = Math.min(1, eraseLocal * 2)
            const titreErase = eraseLocal <= 0.5 ? 0 : Math.min(1, (eraseLocal - 0.5) * 2)
            const applyMasks = (container: HTMLElement, t: number) => {
                const mask1 = container.querySelector('.quest-erase-mask-1') as HTMLElement | null
                const mask2 = container.querySelector('.quest-erase-mask-2') as HTMLElement | null
                const mask3 = container.querySelector('.quest-erase-mask-3') as HTMLElement | null
                const mask4 = container.querySelector('.quest-erase-mask-4') as HTMLElement | null
                const s1 = Math.min(1, Math.max(0, t * 4))
                const s2 = t <= 1 / 4 ? 0 : Math.min(1, Math.max(0, (t - 1 / 4) * 4))
                const s3 = t <= 2 / 4 ? 0 : Math.min(1, Math.max(0, (t - 2 / 4) * 4))
                const s4 = t <= 3 / 4 ? 0 : Math.min(1, Math.max(0, (t - 3 / 4) * 4))
                if (mask1) gsap.set(mask1, { '--a': `${s1 * 220}deg`, force3D: true })
                if (mask2) gsap.set(mask2, { '--a': `${s2 * 220}deg`, force3D: true })
                if (mask3) gsap.set(mask3, { '--a': `${s3 * 220}deg`, force3D: true })
                if (mask4) gsap.set(mask4, { '--a': `${s4 * 220}deg`, force3D: true })
            }
            applyMasks(containerDesc, descErase)
            applyMasks(containerTitre, titreErase)
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
            updateProjetText(scaniaTitreRef?.current ?? null, scaniaDescRef?.current ?? null, scaniaParent, scaniaLocal, handwritingControllers[0])
        } else if (scaniaTitreRef?.current?.parentElement) {
            gsap.set(scaniaTitreRef.current.parentElement, { opacity: 0, visibility: 'hidden', force3D: true })
        }

        if (likethatLocal >= 0) {
            updateProjetText(likethatTitreRef?.current ?? null, likethatDescRef?.current ?? null, likethatParent, likethatLocal, handwritingControllers[1])
        } else if (likethatTitreRef?.current?.parentElement) {
            gsap.set(likethatTitreRef.current.parentElement, { opacity: 0, visibility: 'hidden', force3D: true })
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
}

/**
 * Animation de la section Projets : convoyeur/battant pilotés par la plage de scroll Projets (FOURTH_SECTION_BLOCK_*).
 * La boucle rAF démarre même si le SVG n'est pas encore chargé (résolution du conteneur à chaque frame).
 * Retourne une fonction cleanup pour annuler la boucle rAF.
 */
const DEBUG_PROJETS_CONVOYEUR = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'

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
    let frameCount = 0

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
        if (conv && !convoyeurInited) {
            setSvgTransform(conv, `translate(${EXP_CONVEYOR_START_X}, ${convoyeurTranslateY}) scale(${CONVOYEUR_SCALE_X}, ${CONVOYEUR_SCALE_Y})`)
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
                const scaleRatio = scrollValues.viewportWidth / VIEWPORT_REFERENCE_WIDTH
                const phaseStart = (CONVOYEUR_PROJET_PHASE_START + FIRST_SECTION_PAN_SCROLL) * scaleRatio
                const phaseEnd = (CONVOYEUR_PROJET_PHASE_END + FIRST_SECTION_PAN_SCROLL) * scaleRatio
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
            if (DEBUG_PROJETS_CONVOYEUR && frameCount % 120 === 0 && progressProjets > 0) {
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
                console.log('[Projets convoyeur] tick (toutes les ~2s)', {
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
                const slideX =
                    EXP_CONVEYOR_START_X +
                    (EXP_CONVEYOR_SLIDE_X - EXP_CONVEYOR_START_X) * conveyorSlideProgress
                setSvgTransform(conv, `translate(${slideX}, ${convoyeurTranslateY}) scale(${CONVOYEUR_SCALE_X}, ${CONVOYEUR_SCALE_Y})`)
            }
        }

        // Animation head-robot et hand-robot
        if (robotHeadElement || robotHandElement) {
            if (!robotsInited) {
                robotsInited = true
                if (robotHeadElement) {
                    gsap.set(robotHeadElement, {
                        position: 'absolute',
                        left: '50%',
                        top: `${ROBOT_ABOVE_CONVOYEUR_Y_PERCENT}%`,
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
                        top: `${ROBOT_ABOVE_CONVOYEUR_Y_PERCENT}%`,
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
            if (robotHeadElement) {
                const headOpacity = progressProjets >= ROBOT_HEAD_SLIDE_START ? 1 : 0
                let headX: number
                let headYPercent: number
                let headRotation: number
                let transformOrigin: string = ROBOT_ROLL_TRANSFORM_ORIGIN
                if (headSlideProgress < 1) {
                    headX = -50 + 50.5 * headSlideProgress
                    headYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT
                    headRotation = 0
                } else if (headFallProgress <= 0) {
                    headX = .5
                    headYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT
                    headRotation = 0
                } else {
                    transformOrigin = 'center center'
                    const diagonalProgress = Math.min(1, headFallProgress / ROBOT_FALL_DIAGONAL_RATIO)
                    const rollRightProgress = ROBOT_FALL_DIAGONAL_RATIO < 1
                        ? Math.max(0, (headFallProgress - ROBOT_FALL_DIAGONAL_RATIO) / (1 - ROBOT_FALL_DIAGONAL_RATIO))
                        : 0
                    headYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT +
                        (ROBOT_GROUND_Y_PERCENT - ROBOT_ABOVE_CONVOYEUR_Y_PERCENT) * diagonalProgress
                    headX = diagonalProgress < 1
                        ? ROBOT_FALL_DIAGONAL_X_VW * diagonalProgress
                        : ROBOT_FALL_DIAGONAL_X_VW + ROBOT_FALL_ROLL_RIGHT_X_VW * rollRightProgress
                    headRotation = ROBOT_HEAD_ROLL_DEG * headFallProgress
                }
                gsap.set(robotHeadElement, {
                    opacity: headOpacity,
                    x: `${headX}vw`,
                    top: `${headYPercent}%`,
                    rotation: headRotation,
                    transformOrigin: transformOrigin,
                    scale: ROBOT_SIZE_SCALE,
                    force3D: true,
                })
            }
            if (robotHandElement) {
                const handOpacity = progressProjets >= ROBOT_HAND_SLIDE_START ? 1 : 0
                let handX: number
                let handYPercent: number
                let handRotation: number
                let transformOrigin: string = ROBOT_ROLL_TRANSFORM_ORIGIN
                if (handSlideProgress < 1) {
                    handX = -50 + 50 * handSlideProgress
                    handYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT
                    handRotation = 0
                } else if (handFallProgress <= 0) {
                    handX = 0
                    handYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT
                    handRotation = 0
                } else {
                    transformOrigin = 'center center'
                    const diagonalProgress = Math.min(1, handFallProgress / ROBOT_FALL_DIAGONAL_RATIO)
                    const rollRightProgress = ROBOT_FALL_DIAGONAL_RATIO < 1
                        ? Math.max(0, (handFallProgress - ROBOT_FALL_DIAGONAL_RATIO) / (1 - ROBOT_FALL_DIAGONAL_RATIO))
                        : 0
                    handYPercent = ROBOT_ABOVE_CONVOYEUR_Y_PERCENT +
                        ((ROBOT_GROUND_Y_PERCENT + .5) - ROBOT_ABOVE_CONVOYEUR_Y_PERCENT) * diagonalProgress
                    handX = diagonalProgress < 1
                        ? ROBOT_FALL_DIAGONAL_X_VW * diagonalProgress
                        : ROBOT_FALL_DIAGONAL_X_VW + (ROBOT_FALL_ROLL_RIGHT_X_VW - 7) * rollRightProgress
                    handRotation = ROBOT_HAND_ROLL_DEG * handFallProgress
                }
                gsap.set(robotHandElement, {
                    opacity: handOpacity,
                    x: `${handX}vw`,
                    top: `${handYPercent}%`,
                    rotation: handRotation,
                    transformOrigin: transformOrigin,
                    scale: ROBOT_SIZE_SCALE,
                    force3D: true,
                })
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
    likethatDescRef?: RefObject<HTMLDivElement | null>
): (() => void) | void {
    // Si scrollValues n'est pas fourni, calculer les valeurs (fallback)
    if (!scrollValues) {
        const totalWidth = sections.reduce((sum, section) => sum + section.offsetWidth, 0)
        const viewportWidth = window.innerWidth
        const scrollDistance = totalWidth - viewportWidth
        const scaleRatio = viewportWidth / VIEWPORT_REFERENCE_WIDTH
        const initialScrollBlock = SECOND_SECTION_BLOCK_START * scaleRatio
        const phase1EndScroll = (SECOND_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * scaleRatio
        const phase2StartScroll = phase1EndScroll
        const phase2EndScroll = (SECOND_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * scaleRatio
        const phase2EarlyStartScroll = Math.max(0, phase2StartScroll - PHASE2_EARLY_START_OFFSET * scaleRatio)
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
        const cumulativeAtEndOfThird =
            SECOND_SECTION_BLOCK_START +
            scrollBeforeSecondBlockWorld +
            secondBlockDurationWorld +
            scrollBeforeThirdBlockWorld +
            thirdBlockDurationWorld
        const cumulativeAtEndOfFourth = cumulativeAtEndOfThird + scrollBeforeFourthBlockWorld + fourthBlockDurationWorld
        const cumulativeAtConvoyeurPhaseStart = cumulativeAtEndOfThird - thirdBlockDurationWorld * 1.5
        scrollValues = {
            scrollDistanceWithMovement: scrollDistance,
            scrollDistanceWithoutMovement: initialScrollBlock + FIRST_SECTION_PAN_SCROLL * scaleRatio + scrollDistance,
            initialScrollBlock,
            totalWidth,
            viewportWidth,
            phase1EndScroll,
            phase2StartScroll,
            phase2EarlyStartScroll: phase2EarlyStartScroll,
            phase2EndScroll,
            rocketPhase1EndScroll: SECOND_SECTION_BLOCK_START * scaleRatio,
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

    // 3. Animation de la fusée (utilise les valeurs uniformisées)
    const rocketCleanup = createRocketScrollAnimation(rocketElement, container, scrollValues, scrollTween, sections[0] ?? null)
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
