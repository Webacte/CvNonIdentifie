import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { INITIAL_SCROLL_BLOCK, SECOND_SECTION_BLOCK_START, SECOND_SECTION_BLOCK_END } from './constants'

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
    
    // Valeurs de référence pour un écran de 1050px (taille de référence)
    const REFERENCE_VIEWPORT_WIDTH = 1050
    const REFERENCE_INITIAL_SCROLL_BLOCK = INITIAL_SCROLL_BLOCK
    const REFERENCE_SECOND_SECTION_BLOCK_START = SECOND_SECTION_BLOCK_START
    const REFERENCE_SECOND_SECTION_BLOCK_END = SECOND_SECTION_BLOCK_END
    
    // Calculer le ratio de mise à l'échelle basé sur la largeur du viewport
    const scaleRatio = viewportWidth / REFERENCE_VIEWPORT_WIDTH
    
    // Calculer les valeurs responsive pour tous les blocs de scroll
    // Utiliser un ratio pour adapter aux différentes tailles d'écran
    const initialScrollBlock = REFERENCE_INITIAL_SCROLL_BLOCK * scaleRatio
    const secondBlockStart = REFERENCE_SECOND_SECTION_BLOCK_START * scaleRatio
    const secondBlockEnd = REFERENCE_SECOND_SECTION_BLOCK_END * scaleRatio
    const secondBlockDuration = secondBlockEnd - secondBlockStart
    
    // Calculer les distances de scroll pour chaque phase
    // scrollBeforeSecondBlock : distance de scroll vertical entre la fin du bloc initial et le début du deuxième bloc
    const scrollBeforeSecondBlock = secondBlockStart - initialScrollBlock // 3800 - 2500 = 1300px
    
    // Pour calculer la position X au deuxième bloc, on doit déterminer quelle fraction de scrollDistance
    // a été parcourue. On utilise une proportion basée sur scrollBeforeSecondBlock.
    // Si scrollDistance représente la distance horizontale totale, on calcule la position X proportionnellement.
    // On suppose que scrollBeforeSecondBlock représente une partie de la distance totale de scroll vertical
    // nécessaire pour parcourir scrollDistance horizontalement.
    // Pour simplifier, on utilise scrollBeforeSecondBlock comme limite pour la première phase,
    // et le reste (scrollDistance - scrollBeforeSecondBlock) pour la deuxième phase.
    // Mais on doit s'assurer que scrollBeforeSecondBlock ne dépasse pas scrollDistance.
    const maxScrollBeforeSecondBlock = Math.min(scrollBeforeSecondBlock, scrollDistance)
    const scrollAfterSecondBlock = Math.max(0, scrollDistance - maxScrollBeforeSecondBlock)
    
    // Distance totale de scroll incluant tous les blocs
    const scrollDistanceWithoutMovement = initialScrollBlock + scrollBeforeSecondBlock + secondBlockDuration + scrollAfterSecondBlock
    
    // Calculer la position X atteinte à la fin du premier mouvement (avant le deuxième bloc)
    // La position X est directement liée à maxScrollBeforeSecondBlock
    // Si scrollBeforeSecondBlock <= scrollDistance, on a parcouru scrollBeforeSecondBlock pixels horizontalement
    const xPositionAtSecondBlock = -maxScrollBeforeSecondBlock
    
    const scrollDistanceWithMovement = scrollDistance // Distance avec mouvement d'écran (distance horizontale réelle)
    
    // Créer l'objet de valeurs uniformisées
    const scrollValues: ScrollValues = {
        scrollDistanceWithMovement,
        scrollDistanceWithoutMovement,
        initialScrollBlock,
        totalWidth,
        viewportWidth,
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
            }
        }
    })
    
    // Calculer les durées relatives pour chaque phase de la timeline
    const initialBlockDuration = initialScrollBlock / scrollDistanceWithoutMovement
    const firstMovementDuration = scrollBeforeSecondBlock / scrollDistanceWithoutMovement
    const secondBlockDurationRatio = secondBlockDuration / scrollDistanceWithoutMovement
    const secondMovementDuration = scrollAfterSecondBlock / scrollDistanceWithoutMovement
    
    // Ajouter les animations à la timeline avec les différentes phases
    timeline
        .to(wrapper, { x: 0, duration: initialBlockDuration, ease: 'none' }) // Bloc initial : reste à 0
        .to(wrapper, { x: xPositionAtSecondBlock, duration: firstMovementDuration, ease: 'none' }) // Premier mouvement jusqu'à 3800px
        .to(wrapper, { x: xPositionAtSecondBlock, duration: secondBlockDurationRatio, ease: 'none' }) // Bloc deuxième section : reste à la position atteinte
        .to(wrapper, { x: -scrollDistanceWithMovement, duration: secondMovementDuration, ease: 'none' }) // Deuxième mouvement jusqu'à la fin
    
    // Retourner le tween principal de la timeline pour containerAnimation
    const scrollTween = timeline as any as gsap.core.Tween

    // Rafraîchir ScrollTrigger pour s'assurer que tout est bien calculé
    ScrollTrigger.refresh()

    return { scrollTween, scrollValues }
}
