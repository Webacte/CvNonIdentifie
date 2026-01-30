import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    ROCKET_PAN_START_RATIO,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    THIRD_SECTION_BLOCK_START,
    THIRD_SECTION_BLOCK_END,
    SCROLL_FROM_THIRD_BLOCK,
    VIEWPORT_REFERENCE_WIDTH,
} from './constants'

/**
 * Valeurs de scroll uniformisées pour toutes les animations
 */
export interface ScrollValues {
    /** Distance de scroll avec mouvement d'écran (distance horizontale réelle) */
    scrollDistanceWithMovement: number
    /** Distance totale de scroll de la souris (inclut le bloc initial, plus grande) */
    scrollDistanceWithoutMovement: number
    /** Distance du bloc initial (scroll bloqué au début) */
    initialScrollBlock: number
    /** Largeur totale du contenu */
    totalWidth: number
    /** Largeur du viewport */
    viewportWidth: number
    /** Position de scroll (px) à laquelle la phase 1 (Présentation) se termine = début bloc About */
    phase1EndScroll: number
    /** Position de scroll (px) à laquelle la phase 2 (About) commence */
    phase2StartScroll: number
    /** Position de scroll (px) à laquelle la phase 2 (About) se termine */
    phase2EndScroll: number
}

/**
 * Configure le scroll horizontal contrôlé
 * Convertit le scroll vertical en mouvement horizontal
 * Retourne le tween et les valeurs de scroll uniformisées
 */
export function setupHorizontalScroll(
    container: HTMLElement,
    wrapper: HTMLElement,
    sections: HTMLElement[]
): { scrollTween: gsap.core.Tween; scrollValues: ScrollValues } {
    // Calculer la largeur totale nécessaire pour le scroll horizontal
    const totalWidth = sections.reduce((sum, section) => sum + section.offsetWidth, 0)
    const viewportWidth = window.innerWidth
    const scrollDistance = totalWidth - viewportWidth

    // Réinitialiser toutes les positions avant de configurer
    gsap.set(wrapper, {
        x: 0,
        clearProps: 'transform'
    })

    // S'assurer que le container n'a pas de transform initial
    gsap.set(container, {
        clearProps: 'transform,top,left'
    })

    // Définir la largeur du wrapper pour permettre le scroll
    gsap.set(wrapper, {
        width: totalWidth,
    })

    // Créer le scroll horizontal contrôlé
    // Le scroll vertical déclenche le mouvement horizontal
    // Le scroll est bloqué pendant les premiers pixels, puis commence
    
    const scaleRatio = viewportWidth / VIEWPORT_REFERENCE_WIDTH
    const initialScrollBlock = SECOND_SECTION_BLOCK_START * ROCKET_PAN_START_RATIO * scaleRatio
    const secondBlockStart = SECOND_SECTION_BLOCK_START * scaleRatio
    const secondBlockEnd = SECOND_SECTION_BLOCK_END * scaleRatio
    const secondBlockDuration = secondBlockEnd - secondBlockStart
    const thirdBlockStart = THIRD_SECTION_BLOCK_START * scaleRatio
    const thirdBlockEnd = THIRD_SECTION_BLOCK_END * scaleRatio
    const thirdBlockDuration = thirdBlockEnd - thirdBlockStart
    const scrollFromThirdBlock = SCROLL_FROM_THIRD_BLOCK * scaleRatio

    const scrollBeforeSecondBlock = secondBlockStart - initialScrollBlock

    // scrollBeforeThirdBlock : distance de scroll vertical entre la fin du bloc About et le début du bloc Expérience
    const scrollBeforeThirdBlock = thirdBlockStart - secondBlockEnd

    // Position X pour afficher la section Expérience (section 3) : largeur des sections 0 + 1
    const xPositionAtThirdBlock = sections.length >= 3
        ? -(sections[0].offsetWidth + sections[1].offsetWidth)
        : -scrollDistance

    // Distance totale de scroll incluant tous les blocs (initial, move1, block2, move2, block3, move3)
    const scrollDistanceWithoutMovement = initialScrollBlock + scrollBeforeSecondBlock + secondBlockDuration + scrollBeforeThirdBlock + thirdBlockDuration + scrollFromThirdBlock

    // Position X pour afficher la section About (section 1) : largeur de la section 0
    const xPositionAtSecondBlock = sections.length >= 1 ? -sections[0].offsetWidth : 0
    
    const scrollDistanceWithMovement = scrollDistance // Distance avec mouvement d'écran (distance horizontale réelle)
    
    // Créer l'objet de valeurs uniformisées
    const scrollValues: ScrollValues = {
        scrollDistanceWithMovement,
        scrollDistanceWithoutMovement,
        initialScrollBlock,
        totalWidth,
        viewportWidth,
        phase1EndScroll: secondBlockStart,
        phase2StartScroll: secondBlockStart,
        phase2EndScroll: secondBlockEnd,
    }
    
    // Créer une timeline avec plusieurs phases : bloc initial, mouvement, bloc deuxième section, mouvement final
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
                gsap.set(container, {
                    clearProps: 'top,left'
                })
            },
            onLeave: () => {
                gsap.set(container, {
                    clearProps: 'top,left'
                })
            },
            onUpdate: (self) => {
                const scrollY = self.progress * scrollDistanceWithoutMovement
                let phase = 'bloc initial'
                if (scrollY >= thirdBlockEnd) phase = 'après bloc Expérience'
                else if (scrollY >= thirdBlockStart) phase = 'bloc Expérience'
                else if (scrollY >= secondBlockEnd) phase = 'mouvement vers Expérience'
                else if (scrollY >= secondBlockStart) phase = 'bloc About'
                else if (scrollY >= initialScrollBlock) phase = 'mouvement vers About'
                console.log(
                    `[Scroll] ${Math.round(scrollY)} px / ${Math.round(scrollDistanceWithoutMovement)} | progress: ${(self.progress * 100).toFixed(1)}% | ${phase}`
                )
            }
        }
    })
    
    // Calculer les durées relatives pour chaque phase de la timeline
    const initialBlockDuration = initialScrollBlock / scrollDistanceWithoutMovement
    const firstMovementDuration = scrollBeforeSecondBlock / scrollDistanceWithoutMovement
    const secondBlockDurationRatio = secondBlockDuration / scrollDistanceWithoutMovement
    const scrollBeforeThirdBlockDuration = scrollBeforeThirdBlock / scrollDistanceWithoutMovement
    const thirdBlockDurationRatio = thirdBlockDuration / scrollDistanceWithoutMovement
    const scrollFromThirdBlockDuration = scrollFromThirdBlock / scrollDistanceWithoutMovement

    // Ajouter les animations à la timeline avec les différentes phases
    timeline
        .to(wrapper, { x: 0, duration: initialBlockDuration, ease: 'none' }) // Bloc initial : reste à 0
        .to(wrapper, { x: xPositionAtSecondBlock, duration: firstMovementDuration, ease: 'none' }) // Premier mouvement jusqu'à la section About
        .to(wrapper, { x: xPositionAtSecondBlock, duration: secondBlockDurationRatio, ease: 'none' }) // Bloc section About : reste à la position atteinte
        .to(wrapper, { x: xPositionAtThirdBlock, duration: scrollBeforeThirdBlockDuration, ease: 'none' }) // Mouvement jusqu'à la section Expérience
        .to(wrapper, { x: xPositionAtThirdBlock, duration: thirdBlockDurationRatio, ease: 'none' }) // Bloc section Expérience : reste sur place
        .to(wrapper, { x: -scrollDistanceWithMovement, duration: scrollFromThirdBlockDuration, ease: 'none' }) // Dernier mouvement jusqu'à la fin
    
    // Retourner le tween principal de la timeline pour containerAnimation
    const scrollTween = timeline as any as gsap.core.Tween

    // Rafraîchir ScrollTrigger pour s'assurer que tout est bien calculé
    ScrollTrigger.refresh()

    return { scrollTween, scrollValues }
}
