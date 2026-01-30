import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ScrollValues } from './horizontalScroll'
import {
    ROCKET_PAN_START_RATIO,
    SECOND_SECTION_BLOCK_START,
    SECOND_SECTION_BLOCK_END,
    VIEWPORT_REFERENCE_WIDTH,
    ROCKET_ACCELERATE_X_REFERENCE,
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
    ROCKET_ACCELERATION_FACTOR_BASE,
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

/**
 * Progression phase 1 pour la fusée et la flamme : 0 tant que le scroll est dans le bloc initial,
 * puis 0→1 entre la fin du bloc initial et la fin de la phase 1. Ainsi la fusée reste visible
 * au début et ne part qu’une fois que l’écran commence à bouger.
 */
export function getRocketPhase1Progress(progress: number, scrollValues: ScrollValues): number {
    const { scrollY } = getPhaseProgress(progress, scrollValues)
    const { initialScrollBlock, phase1EndScroll } = scrollValues
    const range = phase1EndScroll - initialScrollBlock
    if (range <= 0) return scrollY / phase1EndScroll
    if (scrollY <= initialScrollBlock) return 0
    return Math.min(1, (scrollY - initialScrollBlock) / range)
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
): void {
    if (!rocketElement) {
        return
    }

    // Cacher la fumée
    const fumeeElement = rocketElement.querySelector('#fumee')
    if (fumeeElement) {
        gsap.set(fumeeElement, { opacity: 0 })
    }

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

    const getAccelerateRocketX = () => ROCKET_ACCELERATE_X_REFERENCE * getScaleRatio()

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
        let currentX: number
        const yCompletionProgress = getYCompletionProgress()
        if (progress < yCompletionProgress) return rocketStartX
        const remainingProgress = progress - yCompletionProgress
        const maxRemainingProgress = 1 - yCompletionProgress
        const xProgress = Math.min(remainingProgress / maxRemainingProgress, 1)
        const horizontalProgress = xProgress * ROCKET_HORIZONTAL_PROGRESS_MULTIPLIER
        const currentRocketEndX = getRocketEndX()
        const currentAccelerateRocketX = getAccelerateRocketX()
        
        const normalX = rocketStartX + (currentRocketEndX - rocketStartX) * horizontalProgress
        const accelerateProgress = (currentAccelerateRocketX - rocketStartX) / (currentRocketEndX - rocketStartX)
        if (horizontalProgress <= accelerateProgress) {
            currentX = normalX
        } else {
            const accelerationZone = (horizontalProgress - accelerateProgress) / (1 - accelerateProgress)
            const accelerationFactor = ROCKET_ACCELERATION_FACTOR_BASE + (accelerationZone * accelerationZone)
            const accelerateX = rocketStartX + (currentRocketEndX - rocketStartX) * accelerateProgress
            const extraDistance = (normalX - accelerateX) * (accelerationFactor - 1)
            currentX = normalX + extraDistance
        }
        
        return currentX
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
    
    // Si scrollTween est disponible, utiliser containerAnimation avec gsap.to
    // Sinon, créer un nouveau ScrollTrigger
    if (scrollTween && scrollTween.scrollTrigger) {
        // Utiliser le ScrollTrigger du scrollTween pour obtenir la progression
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Utiliser requestAnimationFrame pour surveiller la progression du ScrollTrigger principal
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase1 } = getPhaseProgress(progress, scrollValues)

            // Mettre à jour seulement si la progression a changé
            if (progress !== lastProgress) {
                lastProgress = progress
                const currentX = updateRocketPositionX(progressPhase1)
                const currentY = updateRocketPositionY(progressPhase1)
                const currentRotate = updateRocketRotate(progressPhase1)

                // Appliquer la transformation
                gsap.set(rocketElement, {
                    x: currentX,
                    y: currentY,
                    rotate: currentRotate,
                    force3D: true,
                })
            }

            requestAnimationFrame(updateLoop)
        }
        updateLoop()
    } else {
        // Fallback : créer un ScrollTrigger indépendant
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress
                const { progressPhase1 } = getPhaseProgress(progress, scrollValues)
                const currentX = updateRocketPositionX(progressPhase1)
                const currentY = updateRocketPositionY(progressPhase1)
                const currentRotate = updateRocketRotate(progressPhase1)

                gsap.set(rocketElement, {
                    x: currentX,
                    y: currentY,
                    rotate: currentRotate,
                    force3D: true,
                })
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
): ScrollAnimationConfig[] {
    if (!rocketElement) {
        return []
    }

    const feuElement1 = rocketElement.querySelector('#feu1')
    const feuElement2 = rocketElement.querySelector('#feu2')
    const feuElement3 = rocketElement.querySelector('#feu3')

    if (!feuElement1 || !feuElement2 || !feuElement3) {
        return []
    }

    // Initialiser tous les feux à une opacité de 0
    gsap.set([feuElement1, feuElement2, feuElement3], { opacity: 0 })

    // Valeurs responsive pour les feux (doivent correspondre à celles de la fusée)
    const REFERENCE_VIEWPORT_WIDTH = 1050
    const REFERENCE_FIRE_MIN_X = 1050
    const scrollDistance = scrollValues.scrollDistanceWithMovement
    const horizontalProgressMultiplier = 3
    
    // Fonctions helper pour calculer les valeurs responsive dynamiquement
    const getScaleRatio = () => {
        const currentViewportWidth = window.innerWidth
        return currentViewportWidth / REFERENCE_VIEWPORT_WIDTH
    }
    
    const getFireMinX = () => {
        const scaleRatio = getScaleRatio()
        return REFERENCE_FIRE_MIN_X * scaleRatio
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
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase1 } = getPhaseProgress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                updateFireVisibility(progressPhase1)
            }
            
            requestAnimationFrame(updateLoop)
        }
        updateLoop()
    } else {
        // Créer un ScrollTrigger indépendant
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollValues.scrollDistanceWithoutMovement}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const { progressPhase1 } = getPhaseProgress(self.progress, scrollValues)
                updateFireVisibility(progressPhase1)
            }
        })
    }

    // Retourner un tableau vide car la timeline gère déjà les animations
    return []
}

/**
 * Animation du portrait qui apparaît avec une opacité de 0 à 1 quand le scroll atteint 500px
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
 * Animation du descriptionContainer (opacité 0 à 1)
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
): void {
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

        // Surveiller la progression et mettre à jour les membres (progressPhase2 = bloc About)
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase2 } = getPhaseProgress(progress, scrollValues)

            if (progress !== lastProgress) {
                lastProgress = progress
                updateAlienLimbs(progressPhase2)
            }

            requestAnimationFrame(updateLoop)
        }
        updateLoop()
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
                const { progressPhase2 } = getPhaseProgress(self.progress, scrollValues)
                updateAlienLimbs(progressPhase2)
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
): void {
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

        // Surveiller la progression et mettre à jour les transformations (progressPhase2 = bloc About)
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase2 } = getPhaseProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramBases(progressPhase2)
            }

            requestAnimationFrame(updateLoop)
        }
        updateLoop()
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
                const { progressPhase2 } = getPhaseProgress(self.progress, scrollValues)
                updateHologramBases(progressPhase2)
            }
        })
    }
}

export function createHologramReflecteursScrollAnimation(
    hologramElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
): void {
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

        // Surveiller la progression et mettre à jour les transformations (progressPhase2 = bloc About)
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase2 } = getPhaseProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramReflecteurs(progressPhase2)
            }

            requestAnimationFrame(updateLoop)
        }
        updateLoop()
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
                const { progressPhase2 } = getPhaseProgress(self.progress, scrollValues)
                updateHologramReflecteurs(progressPhase2)
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
): void {
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

        // Surveiller la progression et mettre à jour les transformations (progressPhase2 = bloc About)
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            const { progressPhase2 } = getPhaseProgress(progress, scrollValues)
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramEcran(progressPhase2)
            }

            requestAnimationFrame(updateLoop)
        }
        updateLoop()
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
                const { progressPhase2 } = getPhaseProgress(self.progress, scrollValues)
                updateHologramEcran(progressPhase2)
            }
        })
    }
}

/**
 * Configuration complète de toutes les animations au scroll
 * 
 * C'est ici que vous ajoutez vos nouvelles animations.
 * Chaque animation suivra automatiquement le rythme du scroll.
 */
export function configureAllScrollAnimations(
    container: HTMLElement,
    wrapper: HTMLElement,
    sections: HTMLElement[],
    rocketElement: HTMLElement | null,
    scrollTween?: gsap.core.Tween,
    scrollValues?: ScrollValues,
    portraitElement?: HTMLElement | null,
    descriptionContainerElement?: HTMLElement | null,
    alienElement?: HTMLElement | null,
    hologramElement?: HTMLElement | null,
    handwritingElement?: HTMLElement | null
): void {
    // Si scrollValues n'est pas fourni, calculer les valeurs (fallback)
    if (!scrollValues) {
        const totalWidth = sections.reduce((sum, section) => sum + section.offsetWidth, 0)
        const viewportWidth = window.innerWidth
        const scrollDistance = totalWidth - viewportWidth
        const scaleRatio = viewportWidth / VIEWPORT_REFERENCE_WIDTH
        const initialScrollBlock = SECOND_SECTION_BLOCK_START * ROCKET_PAN_START_RATIO * scaleRatio
        const phase1EndScroll = SECOND_SECTION_BLOCK_START * scaleRatio
        const phase2StartScroll = SECOND_SECTION_BLOCK_START * scaleRatio
        const phase2EndScroll = SECOND_SECTION_BLOCK_END * scaleRatio
        scrollValues = {
            scrollDistanceWithMovement: scrollDistance,
            scrollDistanceWithoutMovement: initialScrollBlock + scrollDistance,
            initialScrollBlock,
            totalWidth,
            viewportWidth,
            phase1EndScroll,
            phase2StartScroll,
            phase2EndScroll,
        }
    }

    // Rassembler toutes les animations
    const animations: ScrollAnimationConfig[] = []

    // 1. Animation de la fusée (utilise les valeurs uniformisées)
    createRocketScrollAnimation(rocketElement, container, scrollValues, scrollTween, sections[0] ?? null)

    // 2. Animation des feux de la fusée (utilise les valeurs uniformisées)
    createRocketFireScrollAnimation(rocketElement, container, scrollValues, scrollTween)

    // 3. Animation du portrait (opacité 0 à 1 à 500px de scroll)
    createPortraitScrollAnimation(portraitElement || null)

    // 4. Animation du descriptionContainer (opacité 0 à 1 à 500px de scroll)
    createDescriptionContainerScrollAnimation(descriptionContainerElement || null)

    // 5. Animation des membres de l'extraterrestre
    createAlienScrollAnimation(alienElement || null, container, scrollValues, scrollTween)

    // 6. Animation de l'hologramme
    createHologramBasesScrollAnimation(hologramElement || null, container, scrollValues, scrollTween)
    createHologramReflecteursScrollAnimation(hologramElement || null, container, scrollValues, scrollTween)
    createHologramEcranScrollAnimation(hologramElement || null, container, scrollValues, scrollTween, handwritingElement || null)

    // Configurer toutes les animations (utilise les valeurs uniformisées)
    setupScrollAnimations({
        container,
        scrollDistance: scrollValues.scrollDistanceWithoutMovement, // Utiliser la distance totale pour les ScrollTriggers
        viewportWidth: scrollValues.viewportWidth,
        animations,
    }, scrollValues)
}
