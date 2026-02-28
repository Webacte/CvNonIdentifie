import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Camera } from './camera'
import {
    FIRST_SECTION_PAN_SCROLL,
    PHASE2_EARLY_START_OFFSET,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    THIRD_SECTION_BLOCK_START,
    THIRD_SECTION_BLOCK_END,
    FOURTH_SECTION_BLOCK_START,
    FOURTH_SECTION_BLOCK_END,
    FIFTH_SECTION_BLOCK_START,
    FIFTH_SECTION_BLOCK_END,
} from './constants'
import { sceneConfig } from './sceneConfig'

/**
 * Valeurs de scroll uniformisées pour toutes les animations (en px pour ScrollTrigger et scrollAnimations).
 */
export interface ScrollValues {
    /** Distance de scroll avec mouvement d'écran (distance horizontale réelle) en px */
    scrollDistanceWithMovement: number
    /** Distance totale du scroll (inclut les pauses) en px */
    scrollDistanceWithoutMovement: number
    /** Distance du bloc initial (scroll bloqué au début) en px */
    initialScrollBlock: number
    /** Largeur totale du contenu en px (world × scale) */
    totalWidth: number
    /** Largeur du viewport en px */
    viewportWidth: number
    /** Position de scroll (px) à laquelle la phase 1 (Présentation) se termine = début bloc About */
    phase1EndScroll: number
    /** Position de scroll (px) à laquelle la phase 2 (About) commence */
    phase2StartScroll: number
    /** Position de scroll (px) à laquelle alien et hologramme commencent (avant phase 2). */
    phase2EarlyStartScroll: number
    /** Position de scroll (px) à laquelle la phase 2 (About) se termine */
    phase2EndScroll: number
    /** Fin de la phase 1 pour la fusée uniquement (px). La fusée s'anime indépendamment du déplacement de l'écran. */
    rocketPhase1EndScroll: number
    /** Progression 0–1 du ScrollTrigger à la fin du bloc Expérience (pour animation convoyeur). */
    progressAtEndOfThirdBlock: number
    /** Progression 0–1 du ScrollTrigger à la fin du bloc Projets (pour animation convoyeur). */
    progressAtEndOfFourthBlock: number
    /** Progression 0–1 au début de la phase convoyeur : avant la fin Expérience, pour lancer l’animation avant d’arriver sur Projets. */
    progressAtConvoyeurPhaseStart: number
}

/**
 * Configure le scroll horizontal contrôlé (World + Camera).
 * Wrapper.x en unités monde ; ScrollTrigger end en px (world × scale).
 * Retourne le tween, les valeurs de scroll uniformisées et une fonction kill pour teardown/rebuild.
 */
export function setupHorizontalScroll(
    container: HTMLElement,
    stage: HTMLElement,
    wrapper: HTMLElement,
    sections: HTMLElement[],
    camera: Camera
): { scrollTween: gsap.core.Tween; scrollValues: ScrollValues; kill: () => void } {
    const { scale: cameraScale, viewportW } = camera
    const WORLD_REFERENCE_WIDTH = sceneConfig.world.width
    const totalWorldWidth = sections.length * WORLD_REFERENCE_WIDTH
    const travelWorld = totalWorldWidth - WORLD_REFERENCE_WIDTH

    // Réinitialiser wrapper
    gsap.set(wrapper, { x: 0, clearProps: 'transform' })
    gsap.set(container, { clearProps: 'transform,top,left' })
    gsap.set(wrapper, { width: totalWorldWidth })
    sections.forEach((section) => {
        gsap.set(section, { width: WORLD_REFERENCE_WIDTH, flexShrink: 0 })
    })

    // Premier écran : fixe comme les autres blocs (0 à SECOND_SECTION_BLOCK_START), puis pan sur FIRST_SECTION_PAN_SCROLL
    const initialScrollBlockWorld = SECOND_SECTION_BLOCK_START
    const secondBlockStartWorld = SECOND_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
    const secondBlockEndWorld = SECOND_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
    const secondBlockDurationWorld = secondBlockEndWorld - secondBlockStartWorld
    const thirdBlockStartWorld = THIRD_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
    const thirdBlockEndWorld = THIRD_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
    const thirdBlockDurationWorld = thirdBlockEndWorld - thirdBlockStartWorld
    const fourthBlockStartWorld = FOURTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
    const fourthBlockEndWorld = FOURTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
    const fourthBlockDurationWorld = fourthBlockEndWorld - fourthBlockStartWorld
    const fifthBlockStartWorld = FIFTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL
    const fifthBlockEndWorld = FIFTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL
    const fifthBlockDurationWorld = fifthBlockEndWorld - fifthBlockStartWorld

    const scrollBeforeSecondBlockWorld = FIRST_SECTION_PAN_SCROLL
    const scrollBeforeThirdBlockWorld = thirdBlockStartWorld - secondBlockEndWorld
    const scrollBeforeFourthBlockWorld = fourthBlockStartWorld - thirdBlockEndWorld
    const scrollBeforeFifthBlockWorld = fifthBlockStartWorld - fourthBlockEndWorld

    const scrollDistanceWithoutMovementWorld =
        initialScrollBlockWorld +
        scrollBeforeSecondBlockWorld +
        secondBlockDurationWorld +
        scrollBeforeThirdBlockWorld +
        thirdBlockDurationWorld +
        scrollBeforeFourthBlockWorld +
        fourthBlockDurationWorld +
        scrollBeforeFifthBlockWorld +
        fifthBlockDurationWorld

    const totalScrollPx = scrollDistanceWithoutMovementWorld * cameraScale
    const travelPx = travelWorld * cameraScale

    const initialScrollBlockPx = initialScrollBlockWorld * cameraScale
    const secondBlockStartPx = secondBlockStartWorld * cameraScale
    const secondBlockEndPx = secondBlockEndWorld * cameraScale

    const phase2EarlyStartPx = Math.max(0, secondBlockStartPx - PHASE2_EARLY_START_OFFSET * cameraScale)
    const cumulativeWorldAtEndOfThird =
        initialScrollBlockWorld +
        scrollBeforeSecondBlockWorld +
        secondBlockDurationWorld +
        scrollBeforeThirdBlockWorld +
        thirdBlockDurationWorld
    const cumulativeWorldAtEndOfFourth =
        cumulativeWorldAtEndOfThird + scrollBeforeFourthBlockWorld + fourthBlockDurationWorld
    /* Début phase convoyeur : au premier quart du bloc Expérience, pour que l’animation démarre bien avant d’arriver sur Projets. */
    const cumulativeWorldAtConvoyeurPhaseStart =
        cumulativeWorldAtEndOfThird - thirdBlockDurationWorld * 1.5
    const scrollValues: ScrollValues = {
        scrollDistanceWithMovement: travelPx,
        scrollDistanceWithoutMovement: totalScrollPx,
        initialScrollBlock: initialScrollBlockPx,
        totalWidth: totalWorldWidth * cameraScale,
        viewportWidth: viewportW,
        phase1EndScroll: secondBlockStartPx,
        phase2StartScroll: secondBlockStartPx,
        phase2EarlyStartScroll: phase2EarlyStartPx,
        phase2EndScroll: secondBlockEndPx,
        rocketPhase1EndScroll: SECOND_SECTION_BLOCK_START * cameraScale,
        progressAtEndOfThirdBlock: cumulativeWorldAtEndOfThird / scrollDistanceWithoutMovementWorld,
        progressAtEndOfFourthBlock: cumulativeWorldAtEndOfFourth / scrollDistanceWithoutMovementWorld,
        progressAtConvoyeurPhaseStart: Math.max(0, cumulativeWorldAtConvoyeurPhaseStart / scrollDistanceWithoutMovementWorld),
    }

    // Positions wrapper.x en unités monde (négatives)
    const xPositionAtSecondBlockWorld = -WORLD_REFERENCE_WIDTH
    const xPositionAtThirdBlockWorld = -2 * WORLD_REFERENCE_WIDTH
    const xPositionAtFourthBlockWorld = -3 * WORLD_REFERENCE_WIDTH
    const xPositionAtFifthBlockWorld = -4 * WORLD_REFERENCE_WIDTH

    const initialBlockDuration = initialScrollBlockWorld / scrollDistanceWithoutMovementWorld
    const firstMovementDuration = scrollBeforeSecondBlockWorld / scrollDistanceWithoutMovementWorld
    const secondBlockDurationRatio = secondBlockDurationWorld / scrollDistanceWithoutMovementWorld
    const scrollBeforeThirdBlockDuration = scrollBeforeThirdBlockWorld / scrollDistanceWithoutMovementWorld
    const thirdBlockDurationRatio = thirdBlockDurationWorld / scrollDistanceWithoutMovementWorld
    const scrollBeforeFourthBlockDuration = scrollBeforeFourthBlockWorld / scrollDistanceWithoutMovementWorld
    const fourthBlockDurationRatio = fourthBlockDurationWorld / scrollDistanceWithoutMovementWorld
    const scrollBeforeFifthBlockDuration = scrollBeforeFifthBlockWorld / scrollDistanceWithoutMovementWorld
    const fifthBlockDurationRatio = fifthBlockDurationWorld / scrollDistanceWithoutMovementWorld

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${totalScrollPx}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
                gsap.set(container, { clearProps: 'top,left' })
            },
            onLeave: () => {
                gsap.set(container, { clearProps: 'top,left' })
            },
        },
    })

    timeline
        .to(wrapper, { x: 0, duration: initialBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtSecondBlockWorld, duration: firstMovementDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtSecondBlockWorld, duration: secondBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtThirdBlockWorld, duration: scrollBeforeThirdBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtThirdBlockWorld, duration: thirdBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtFourthBlockWorld, duration: scrollBeforeFourthBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtFourthBlockWorld, duration: fourthBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtFifthBlockWorld, duration: scrollBeforeFifthBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtFifthBlockWorld, duration: fifthBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: -travelWorld, duration: 0, ease: 'none' })

    const scrollTween = timeline as unknown as gsap.core.Tween

    const kill = () => {
        const st = (timeline as { scrollTrigger?: { kill: () => void } }).scrollTrigger
        if (st) st.kill()
        timeline.kill()
    }

    ScrollTrigger.refresh()

    return { scrollTween, scrollValues, kill }
}
