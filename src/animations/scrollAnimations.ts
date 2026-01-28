import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ScrollValues } from './horizontalScroll'
import { INITIAL_SCROLL_BLOCK } from './constants'
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

/**
 * Animation de la fusée qui suit le scroll
 * Utilise containerAnimation pour synchroniser avec le scroll horizontal
 */
export function createRocketScrollAnimation(
    rocketElement: HTMLElement | null,
    container: HTMLElement,
    scrollValues: ScrollValues,
    scrollTween?: gsap.core.Tween
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
    const rocketStartX = 0
    const rocketStartY = 0
    const rocketStartRotate = 680
    const rocketEndRotate = 90
    
    // Valeurs de référence pour un écran de 1050px (taille de référence)
    const REFERENCE_VIEWPORT_WIDTH = 1050
    // Pour la hauteur, on utilise un pourcentage du viewport pour une adaptation responsive
    // Sur un écran de référence (1050px de large), rocketEndY = 450px
    // Si on suppose une hauteur typique de ~700px pour cet écran, cela représente ~64% de la hauteur
    // On utilise donc un pourcentage fixe pour s'adapter à toutes les hauteurs d'écran
    const ROCKET_END_Y_PERCENTAGE = 1.05 // 64% de la hauteur du viewport
    const REFERENCE_ACCELERATE_ROCKET_X = 450
    
    // Fonctions helper pour calculer les valeurs responsive dynamiquement
    // Cela permet de s'adapter au redimensionnement de la fenêtre
    const getScaleRatio = () => {
        const currentViewportWidth = window.innerWidth
        return currentViewportWidth / REFERENCE_VIEWPORT_WIDTH
    }
    
    const getRocketEndX = () => {
        const scaleRatio = getScaleRatio()
        return Math.max(scrollDistance * 0.3, 500 * scaleRatio)
    }
    
    const getRocketEndY = () => {
        // Utiliser un pourcentage fixe de la hauteur du viewport pour une adaptation responsive
        const currentViewportHeight = window.innerHeight
        return currentViewportHeight * ROCKET_END_Y_PERCENTAGE
    }
    
    const getAccelerateRocketX = () => {
        const scaleRatio = getScaleRatio()
        return REFERENCE_ACCELERATE_ROCKET_X * scaleRatio
    }

    // Initialiser la position de départ
    // Utiliser clearProps pour effacer le left CSS et utiliser x (translateX) à la place
    gsap.set(rocketElement, {
        clearProps: 'left',
        x: rocketStartX,
        y: rocketStartY,
        rotate: rocketStartRotate,
        force3D: true,
    })

    // Calculer le ratio du bloc initial
    const blockRatio = scrollValues.initialScrollBlock / scrollValues.scrollDistanceWithoutMovement
    
    // Calculer la progression nécessaire pour terminer le mouvement Y
    // Le mouvement Y utilise progress * 1.5, donc il se termine quand progress * 1.5 >= 1
    // Ce qui signifie progress >= 1/1.5 = 0.667
    const Y_COMPLETION_PROGRESS = 1/3.8
    
    // Fonction pour calculer et appliquer la position de la fusée
    const updateRocketPositionX = (progress: number) => {
        let currentX: number
        
        // Si le mouvement Y n'est pas encore terminé, la fusée reste à sa position de départ X
        if (progress < Y_COMPLETION_PROGRESS) {
            return rocketStartX
        }
        
        // Une fois le mouvement Y terminé, calculer la progression restante pour le mouvement X
        // La progression totale pour X commence après Y_COMPLETION_PROGRESS
        const remainingProgress = progress - Y_COMPLETION_PROGRESS
        const maxRemainingProgress = 1 - Y_COMPLETION_PROGRESS
        // Normaliser la progression X entre 0 et 1
        const xProgress = Math.min(remainingProgress / maxRemainingProgress, 1)
        
        // Multiplier par 3 pour accélérer le mouvement horizontal (comme avant)
        const horizontalProgress = xProgress * 3
        
        // Calculer les valeurs responsive dynamiquement
        const currentRocketEndX = getRocketEndX()
        const currentAccelerateRocketX = getAccelerateRocketX()
        
        // Calculer la position X normale (sans accélération)
        const normalX = rocketStartX + (currentRocketEndX - rocketStartX) * horizontalProgress
        
        // Calculer à quel point de progression on atteint le point d'accélération
        // accelerateRocketX est une position X absolue (responsive), on doit trouver la progression correspondante
        const accelerateProgress = (currentAccelerateRocketX - rocketStartX) / (currentRocketEndX - rocketStartX)
        
        if (horizontalProgress <= accelerateProgress) {
            // Avant le point d'accélération : mouvement normal
            currentX = normalX
        } else {
            // Après le point d'accélération : accélération progressive jusqu'à 2x la vitesse
            // Calculer la progression dans la zone d'accélération (0 à 1)
            const accelerationZone = (horizontalProgress - accelerateProgress) / (1 - accelerateProgress)
            
            // Facteur d'accélération progressif : passe de 1 à 2 de manière fluide (ease-in)
            // Utiliser une courbe d'ease-in pour une accélération progressive
            const accelerationFactor = 5 + (accelerationZone * accelerationZone) // ease-in quadratique
            
            // Position au point d'accélération
            const accelerateX = rocketStartX + (currentRocketEndX - rocketStartX) * accelerateProgress
            
            // Distance supplémentaire parcourue avec l'accélération
            // La vitesse double progressivement, donc la distance parcourue augmente
            const extraDistance = (normalX - accelerateX) * (accelerationFactor - 1)
            
            currentX = normalX + extraDistance
        }
        
        return currentX
    }

    // Fonction pour calculer et appliquer la rotation de la fusée
    const updateRocketRotate = (progress: number) => {
        let currentRotate: number
        
        const rotateProgress = progress * 3
        currentRotate = rocketStartRotate + (rotateProgress * (rocketEndRotate - rocketStartRotate))
        if (currentRotate < rocketEndRotate) {
            currentRotate = rocketEndRotate
        }
        return currentRotate
    }

    // Fonction calculant la hauteur de la fusée
    const updateRocketPositionY = (progress: number) => {
        let currentY: number
        const verticalProgress = progress * 3
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
            
            // Mettre à jour seulement si la progression a changé
            if (progress !== lastProgress) {
                lastProgress = progress
                const currentX = updateRocketPositionX(progress)
                const currentY = updateRocketPositionY(progress)
                const currentRotate = updateRocketRotate(progress)
                
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
                const currentX = updateRocketPositionX(progress)
                const currentY = updateRocketPositionY(progress)
                const currentRotate = updateRocketRotate(progress)

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
    const REFERENCE_FIRE_MIN_X = 650
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
        const horizontalProgress = progress * horizontalProgressMultiplier
        const currentRocketEndX = getRocketEndX()
        const rocketX = currentRocketEndX * horizontalProgress
        const currentFireMinX = getFireMinX()
        const scaleRatio = getScaleRatio()

        if (rocketX < currentFireMinX - (100 * scaleRatio)) {
            gsap.set([feuElement1, feuElement2, feuElement3], { opacity: 0 })
            return
        }

        // Créer un cycle qui se répète : chaque cycle dure 1/3 de la progression totale
        // On multiplie par un nombre pour créer plusieurs cycles pendant le scroll
        const cyclesPerScroll = 10 // Nombre de cycles complets pendant tout le scroll
        const totalCycles = progress * 10 * cyclesPerScroll
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
            
            if (progress !== lastProgress) {
                lastProgress = progress
                updateFireVisibility(progress)
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
                updateFireVisibility(self.progress)
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
        start: '400px top',
        end: '900px top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            // Calculer l'opacité basée sur la progression (0 à 1)
            // Quand scroll = 0, opacity = 0
            // Quand scroll = 500px, opacity = 1
            const opacity = Math.max(0, Math.min(1, self.progress))
            gsap.set(portraitElement, { opacity, immediateRender: false })
        }
    })
}

/**
 * Animation du descriptionContainer qui apparaît avec une opacité de 0 à 1 quand le scroll atteint 500px
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
        start: 'top top',
        end: '500px top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            // Calculer l'opacité basée sur la progression (0 à 1)
            // Quand scroll = 0, opacity = 0
            // Quand scroll = 500px, opacity = 1
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

    // Valeurs de rotation initiales et finales
    const brasGaucheStartRotate = 0  // Le SVG a déjà une rotation de 20° par défaut
    const brasGaucheEndRotate = 130

    const avantBrasGaucheStartRotate = 0
    const avantBrasGaucheEndRotate = 100
    const avantBrasGaucheStartY = 0
    const avantBrasGaucheEndY = -45
    const avantBrasGaucheStartX = 0
    const avantBrasGaucheEndX = -5
    const avantBrasGaucheEndX2 = 35

    const brasDroitStartRotate = 0  // Le SVG a déjà une rotation de 20° par défaut
    const brasDroitEndRotate = 150

    const avantBrasDroitStartRotate = 0
    const avantBrasDroitEndRotate = 100
    const avantBrasDroitStartY = 0
    const avantBrasDroitEndY = -50
    const avantBrasDroitStartX = 0
    const avantBrasDroitEndX = -5
    const avantBrasDroitEndX2 = 50

    const jambesHautDroiteStartRotate = 0
    const jambesHautDroiteEndRotate = 70

    const jambesBasDroiteStartRotate = 0
    const jambesBasDroiteEndRotate = 50
    const jambesBasDroiteStartY = 0
    const jambesBasDroiteEndY = -18
    const jambesBasDroiteStartX = 0
    const jambesBasDroiteEndX = -18

    const extraterrestreStartRotate = 0
    const extraterrestreEndRotate = 90

    // Initialiser les rotations de départ
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
    gsap.set(extraterrestre, {
        transformOrigin: 'bottom center', // Centre original du SVG (64/2, 188/2) ajusté pour le nouveau viewBox
        rotation: extraterrestreStartRotate,
        force3D: true,
    })

    // Timing de l'animation
    const ANIMATION_START_PROGRESS = 0.42
    const ANIMATION_END_PROGRESS = 0.48
    const LEG_RETURN_START_PROGRESS = 0.46
    const LEG_RETURN_END_PROGRESS = 0.48

    // Fonction pour mapper le progress global vers le progress local pour le retour des jambes
    const mapProgressToLegReturn = (globalProgress: number): number => {
        if (globalProgress < LEG_RETURN_START_PROGRESS) {
            return 0  // Retour pas encore commencé
        }
        if (globalProgress > LEG_RETURN_END_PROGRESS) {
            return 1  // Retour terminé
        }
        // Mapper progress entre LEG_RETURN_START_PROGRESS et LEG_RETURN_END_PROGRESS vers 0 à 1
        // Utiliser une courbe accélérée pour un retour plus rapide
        const returnRange = LEG_RETURN_END_PROGRESS - LEG_RETURN_START_PROGRESS
        const rawProgress = (globalProgress - LEG_RETURN_START_PROGRESS) / returnRange
        // Appliquer une courbe d'accélération (quadratique) pour rendre le retour plus rapide
        const acceleratedProgress = rawProgress * rawProgress
        return Math.max(0, Math.min(1, acceleratedProgress))
    }

    // Fonction pour mettre à jour les rotations en fonction du progress
    const updateAlienLimbs = (globalProgress: number) => {
        // Convertir le progress global en progress local pour l'animation
        const animationProgress = mapProgressToAnimation(globalProgress, ANIMATION_START_PROGRESS, ANIMATION_END_PROGRESS)
        const legReturnProgress = mapProgressToLegReturn(globalProgress)
        
        // Calculer les rotations basées sur le progress local (0 à 1)
        const brasGaucheRotate = brasGaucheStartRotate + (brasGaucheEndRotate - brasGaucheStartRotate) * animationProgress
        const brasDroitRotate = brasDroitStartRotate + (brasDroitEndRotate - brasDroitStartRotate) * animationProgress
        const extraterrestreRotate = extraterrestreStartRotate + (extraterrestreEndRotate - extraterrestreStartRotate) * animationProgress
        
        // Ralentir les rotations des avant-bras pour qu'ils suivent mieux les bras
        // Utiliser un facteur de ralentissement pour synchroniser avec les bras
        const slowedRotationProgress = animationProgress * 0.85 // Ralentir de 15% pour mieux suivre les bras
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
        const slowedProgress = animationProgress * 0.8 // Ralentir de 20% pour mieux suivre les bras
        
        // Phase 1 : de start à end (0 à ~0.7 de animationProgress ralenti)
        const phase1Threshold = 0.7
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
        
        // Pour les jambes : utiliser animationProgress avant LEG_RETURN_START_PROGRESS, puis legReturnProgress après
        let jambesHautDroiteRotate: number
        let jambesBasDroiteRotate: number
        let jambesBasDroiteX: number
        let jambesBasDroiteY: number
        
        if (globalProgress < LEG_RETURN_START_PROGRESS) {
            // Phase d'extension : utiliser animationProgress
            // S'assurer que animationProgress est utilisé de manière continue
            jambesHautDroiteRotate = jambesHautDroiteStartRotate + (jambesHautDroiteEndRotate - jambesHautDroiteStartRotate) * animationProgress
            jambesBasDroiteRotate = jambesBasDroiteStartRotate + (jambesBasDroiteEndRotate - jambesBasDroiteStartRotate) * animationProgress
            jambesBasDroiteX = jambesBasDroiteStartX + (jambesBasDroiteEndX - jambesBasDroiteStartX) * animationProgress
            jambesBasDroiteY = jambesBasDroiteStartY + (jambesBasDroiteEndY - jambesBasDroiteStartY) * animationProgress
        } else {
            // Phase de retour : partir des valeurs finales et revenir vers les valeurs initiales
            // À globalProgress = LEG_RETURN_START_PROGRESS, legReturnProgress = 0, donc on utilise les valeurs finales
            // Calculer les valeurs finales pour assurer la continuité
            const finalAnimationProgress = mapProgressToAnimation(LEG_RETURN_START_PROGRESS, LEG_RETURN_START_PROGRESS, LEG_RETURN_END_PROGRESS)
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
        
        gsap.set(extraterrestre, { rotation: extraterrestreRotate, force3D: true })
    }

    // Initialiser les valeurs dès le début pour éviter les sauts
    updateAlienLimbs(0)
    
    // Si scrollTween est disponible, utiliser son ScrollTrigger
    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger
        
        // Surveiller la progression et mettre à jour les membres
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            
            if (progress !== lastProgress) {
                lastProgress = progress
                updateAlienLimbs(progress)
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
                updateAlienLimbs(self.progress)
            }
        })
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

    // Valeurs de départ pour la base droite
    const BaseDroiteStartX = -595
    const BaseDroiteStartY = -11
    const BaseDroiteEndX = 0
    const BaseDroiteEndY = 0
    const BaseDroiteStartRotate = 180
    const BaseDroiteEndRotate = 0

    // Valeurs de départ pour la base gauche
    const BaseGaucheStartX = -140
    const BaseGaucheStartY = -80
    const BaseGaucheEndX = 0
    const BaseGaucheEndY = 0
    const BaseGaucheStartRotate = 0
    const BaseGaucheEndRotate = 0

    // Initialiser les valeurs dès le début pour éviter les sauts
    gsap.set(baseDroite, {
        x: BaseDroiteStartX,
        y: BaseDroiteStartY,
        rotation: BaseDroiteStartRotate,
        force3D: true,
    })

    gsap.set(baseGauche, {
        x: BaseGaucheStartX,
        y: BaseGaucheStartY,
        rotation: BaseGaucheStartRotate,
        force3D: true,
    })

    // Timing de l'animation
    const ANIMATION_START_BASES_PROGRESS = 0.42
    const ANIMATION_END_BASES_PROGRESS = 0.48

    function arcPosition(start: Point, end: Point, progress: number, height: number): Point {
         const lerp = (a: number, b: number, t: number) => a + (b - a) * t
         const x = lerp(start.x, end.x, progress)
         const y = lerp(start.y, end.y, progress)

         const angle = Math.sin(Math.PI * progress)
         return {x, y: y - height * angle}
    }

    // Fonction pour mettre à jour les transformations en fonction du progress
    const updateHologramBases = (globalProgress: number) => {
        // Convertir le progress global en progress local pour l'animation
        const animationProgress = mapProgressToAnimation(globalProgress, ANIMATION_START_BASES_PROGRESS, ANIMATION_END_BASES_PROGRESS)
        
        // Calculer les transformations basées sur le progress local (0 à 1)
        const baseDroiteRotate = BaseDroiteStartRotate + (BaseDroiteEndRotate - BaseDroiteStartRotate) * animationProgress
        const baseGaucheRotate = BaseGaucheStartRotate + (BaseGaucheEndRotate - BaseGaucheStartRotate) * animationProgress

        const baseDroitePosition = arcPosition({x: BaseDroiteStartX, y: BaseDroiteStartY}, {x: BaseDroiteEndX, y: BaseDroiteEndY}, animationProgress, 200)
        const baseGauchePosition = arcPosition({x: BaseGaucheStartX, y: BaseGaucheStartY}, {x: BaseGaucheEndX, y: BaseGaucheEndY}, animationProgress, 200)

        // Appliquer les transformations
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

        // Surveiller la progression et mettre à jour les transformations
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramBases(progress)
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
                updateHologramBases(self.progress)
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

    // Valeurs de départ pour le reflecteur gauche
    const ReflecteurGaucheStartScaleY =  0
    const ReflecteurGaucheEndScaleY = 1

    // Valeurs de départ pour le reflecteur droit
    const ReflecteurDroitStartScaleY = 0
    const ReflecteurDroitEndScaleY = 1

    gsap.set(reflecteurGauche, {
        transformOrigin: 'bottom',
        scaleY: ReflecteurGaucheStartScaleY,
        force3D: true,
    })

    gsap.set(reflecteurDroit, {
        transformOrigin: 'bottom',
        scaleY: ReflecteurDroitStartScaleY,
        force3D: true,
    })

    const ANIMATION_START_REFLECTEURS_PROGRESS = 0.48
    const ANIMATION_END_REFLECTEURS_PROGRESS = 0.54

    const updateHologramReflecteurs = (globalProgress: number) => {
        const animationProgress = mapProgressToAnimation(globalProgress, ANIMATION_START_REFLECTEURS_PROGRESS, ANIMATION_END_REFLECTEURS_PROGRESS)
        const reflecteurGaucheY = ReflecteurGaucheStartScaleY + (ReflecteurGaucheEndScaleY - ReflecteurGaucheStartScaleY) * animationProgress
        const reflecteurDroitY = ReflecteurDroitStartScaleY + (ReflecteurDroitEndScaleY - ReflecteurDroitStartScaleY) * animationProgress
        gsap.set(reflecteurGauche, { scaleY: reflecteurGaucheY, force3D: true })
        gsap.set(reflecteurDroit, { scaleY: reflecteurDroitY, force3D: true })
    }

    // Initialiser les valeurs dès le début pour éviter les sauts
    updateHologramReflecteurs(0)

    if (scrollTween && scrollTween.scrollTrigger) {
        const mainScrollTrigger = scrollTween.scrollTrigger

        // Surveiller la progression et mettre à jour les transformations
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramReflecteurs(progress)
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
                updateHologramReflecteurs(self.progress)
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

    const EcranStartScaleX = 0
    const EcranEndScaleX = 1

    gsap.set(ecran, {
        transformOrigin: 'left',
        scaleX: EcranStartScaleX,
        force3D: true,
    })

    const ANIMATION_START_ECRA_PROGRESS = 0.54
    const ANIMATION_END_ECRA_PROGRESS = 0.6
    // L'animation handwriting commence après #ecran et dure jusqu'à la fin du scroll
    const HANDWRITING_START_PROGRESS = ANIMATION_END_ECRA_PROGRESS
    const HANDWRITING_END_PROGRESS = .75

    // Créer l'animation handwriting dès le début pour pouvoir la contrôler avec le scroll
    let handwritingController: ReturnType<typeof createHandwritingAnimation> | null = null
    if (handwritingElement) {
        handwritingController = createHandwritingAnimation(handwritingElement)
    }

    const updateHologramEcran = (globalProgress: number) => {
        const animationProgress = mapProgressToAnimation(globalProgress, ANIMATION_START_ECRA_PROGRESS, ANIMATION_END_ECRA_PROGRESS)
        const ecranScaleX = EcranStartScaleX + (EcranEndScaleX - EcranStartScaleX) * animationProgress
        gsap.set(ecran, { scaleX: ecranScaleX, force3D: true })

        // Contrôler l'animation handwriting en fonction du scroll (forward et backward)
        if (handwritingController) {
            if (globalProgress >= HANDWRITING_START_PROGRESS) {
                // Calculer le progress local de l'animation handwriting (0 à 1)
                const handwritingProgress = mapProgressToAnimation(
                    globalProgress,
                    HANDWRITING_START_PROGRESS,
                    HANDWRITING_END_PROGRESS
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

        // Surveiller la progression et mettre à jour les transformations
        let lastProgress = -1
        const updateLoop = () => {
            const progress = mainScrollTrigger.progress
            if (progress !== lastProgress) {
                lastProgress = progress
                updateHologramEcran(progress)
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
                updateHologramEcran(self.progress)
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
        const initialScrollBlock = INITIAL_SCROLL_BLOCK
        scrollValues = {
            scrollDistanceWithMovement: scrollDistance,
            scrollDistanceWithoutMovement: initialScrollBlock + scrollDistance,
            initialScrollBlock,
            totalWidth,
            viewportWidth,
        }
    }

    // Rassembler toutes les animations
    const animations: ScrollAnimationConfig[] = []

    // 1. Animation de la fusée (utilise les valeurs uniformisées)
    createRocketScrollAnimation(rocketElement, container, scrollValues, scrollTween)

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
