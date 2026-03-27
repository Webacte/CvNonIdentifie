import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
    /** Largeur totale du contenu en px */
    totalWidth: number
    /** Largeur du viewport en px */
    viewportWidth: number
    /** Hauteur du viewport en px (pour fusée, robot, hologramme) */
    viewportHeight: number
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
    /** Progression 0–1 du ScrollTrigger au début du bloc Expérience (pour timing handwriting / habitation). */
    progressAtStartOfThirdBlock: number
    /** Progression 0–1 du ScrollTrigger à la fin du bloc Expérience (pour animation convoyeur). */
    progressAtEndOfThirdBlock: number
    /** Progression 0–1 du ScrollTrigger à la fin du bloc Projets (pour animation convoyeur). */
    progressAtEndOfFourthBlock: number
    /** Progression 0–1 au début de la phase convoyeur : avant la fin Expérience, pour lancer l’animation avant d’arriver sur Projets. */
    progressAtConvoyeurPhaseStart: number
}

/**
 * Configure le scroll horizontal contrôlé en layout réel.
 * Wrapper.x en px ; ScrollTrigger end en px réels.
 * Retourne le tween, les valeurs de scroll uniformisées et une fonction kill pour teardown/rebuild.
 */
export function setupHorizontalScroll(
    container: HTMLElement,
    stage: HTMLElement,
    wrapper: HTMLElement,
    sections: HTMLElement[]
): { scrollTween: gsap.core.Tween; scrollValues: ScrollValues; kill: () => void } {
    const viewportW = Math.max(1, Math.round(container.clientWidth || window.innerWidth || 1))
    const viewportH = Math.max(1, Math.round(container.clientHeight || window.innerHeight || 1))
    const sectionWidth = viewportW
    const totalWidth = sections.length * sectionWidth
    const travelPx = Math.max(0, totalWidth - sectionWidth)
    const pxPerReferenceUnit = sectionWidth / sceneConfig.world.width

    // Réinitialiser wrapper
    gsap.set(wrapper, { x: 0, clearProps: 'transform' })
    gsap.set(container, { clearProps: 'transform,top,left' })
    gsap.set(stage, { clearProps: 'x,y,scale,transform' })
    gsap.set(wrapper, { width: totalWidth })
    sections.forEach((section) => {
        gsap.set(section, { width: sectionWidth, flexShrink: 0 })
    })

    // Premier écran : fixe comme les autres blocs (0 à SECOND_SECTION_BLOCK_START), puis pan sur FIRST_SECTION_PAN_SCROLL
    const initialScrollBlock = SECOND_SECTION_BLOCK_START * pxPerReferenceUnit
    const secondBlockStart = (SECOND_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const secondBlockEnd = (SECOND_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const secondBlockDuration = secondBlockEnd - secondBlockStart
    const thirdBlockStart = (THIRD_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const thirdBlockEnd = (THIRD_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const thirdBlockDuration = thirdBlockEnd - thirdBlockStart
    const fourthBlockStart = (FOURTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const fourthBlockEnd = (FOURTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const fourthBlockDuration = fourthBlockEnd - fourthBlockStart
    const fifthBlockStart = (FIFTH_SECTION_BLOCK_START + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const fifthBlockEnd = (FIFTH_SECTION_BLOCK_END + FIRST_SECTION_PAN_SCROLL) * pxPerReferenceUnit
    const fifthBlockDuration = fifthBlockEnd - fifthBlockStart

    const scrollBeforeSecondBlock = FIRST_SECTION_PAN_SCROLL * pxPerReferenceUnit
    const scrollBeforeThirdBlock = thirdBlockStart - secondBlockEnd
    const scrollBeforeFourthBlock = fourthBlockStart - thirdBlockEnd
    const scrollBeforeFifthBlock = fifthBlockStart - fourthBlockEnd

    const scrollDistanceWithoutMovement =
        initialScrollBlock +
        scrollBeforeSecondBlock +
        secondBlockDuration +
        scrollBeforeThirdBlock +
        thirdBlockDuration +
        scrollBeforeFourthBlock +
        fourthBlockDuration +
        scrollBeforeFifthBlock +
        fifthBlockDuration

    const phase2EarlyStartPx = Math.max(0, secondBlockStart - PHASE2_EARLY_START_OFFSET * pxPerReferenceUnit)
    const cumulativeAtStartOfThird =
        initialScrollBlock +
        scrollBeforeSecondBlock +
        secondBlockDuration +
        scrollBeforeThirdBlock
    const cumulativeAtEndOfThird =
        cumulativeAtStartOfThird + thirdBlockDuration
    const cumulativeAtEndOfFourth =
        cumulativeAtEndOfThird + scrollBeforeFourthBlock + fourthBlockDuration
    /* Début phase convoyeur : au premier quart du bloc Expérience, pour que l’animation démarre bien avant d’arriver sur Projets. */
    const cumulativeAtConvoyeurPhaseStart =
        cumulativeAtEndOfThird - thirdBlockDuration * 1.5
    const scrollValues: ScrollValues = {
        scrollDistanceWithMovement: travelPx,
        scrollDistanceWithoutMovement,
        initialScrollBlock,
        totalWidth,
        viewportWidth: viewportW,
        viewportHeight: viewportH,
        phase1EndScroll: secondBlockStart,
        phase2StartScroll: secondBlockStart,
        phase2EarlyStartScroll: phase2EarlyStartPx,
        phase2EndScroll: secondBlockEnd,
        rocketPhase1EndScroll: SECOND_SECTION_BLOCK_START * pxPerReferenceUnit,
        progressAtStartOfThirdBlock: cumulativeAtStartOfThird / scrollDistanceWithoutMovement,
        progressAtEndOfThirdBlock: cumulativeAtEndOfThird / scrollDistanceWithoutMovement,
        progressAtEndOfFourthBlock: cumulativeAtEndOfFourth / scrollDistanceWithoutMovement,
        progressAtConvoyeurPhaseStart: Math.max(0, cumulativeAtConvoyeurPhaseStart / scrollDistanceWithoutMovement),
    }

    // Positions wrapper.x en px (négatives)
    const xPositionAtSecondBlock = -sectionWidth
    const xPositionAtThirdBlock = -2 * sectionWidth
    const xPositionAtFourthBlock = -3 * sectionWidth
    const xPositionAtFifthBlock = -4 * sectionWidth

    const initialBlockDuration = initialScrollBlock / scrollDistanceWithoutMovement
    const firstMovementDuration = scrollBeforeSecondBlock / scrollDistanceWithoutMovement
    const secondBlockDurationRatio = secondBlockDuration / scrollDistanceWithoutMovement
    const scrollBeforeThirdBlockDuration = scrollBeforeThirdBlock / scrollDistanceWithoutMovement
    const thirdBlockDurationRatio = thirdBlockDuration / scrollDistanceWithoutMovement
    const scrollBeforeFourthBlockDuration = scrollBeforeFourthBlock / scrollDistanceWithoutMovement
    const fourthBlockDurationRatio = fourthBlockDuration / scrollDistanceWithoutMovement
    const scrollBeforeFifthBlockDuration = scrollBeforeFifthBlock / scrollDistanceWithoutMovement
    const fifthBlockDurationRatio = fifthBlockDuration / scrollDistanceWithoutMovement

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollDistanceWithoutMovement}`,
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
        .to(wrapper, { x: xPositionAtSecondBlock, duration: firstMovementDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtSecondBlock, duration: secondBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtThirdBlock, duration: scrollBeforeThirdBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtThirdBlock, duration: thirdBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtFourthBlock, duration: scrollBeforeFourthBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtFourthBlock, duration: fourthBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: xPositionAtFifthBlock, duration: scrollBeforeFifthBlockDuration, ease: 'none' })
        .to(wrapper, { x: xPositionAtFifthBlock, duration: fifthBlockDurationRatio, ease: 'none' })
        .to(wrapper, { x: -travelPx, duration: 0, ease: 'none' })

    const scrollTween = timeline as unknown as gsap.core.Tween

    const kill = () => {
        const st = (timeline as { scrollTrigger?: { kill: () => void } }).scrollTrigger
        if (st) st.kill()
        timeline.kill()
    }

    ScrollTrigger.refresh()

    return { scrollTween, scrollValues, kill }
}
