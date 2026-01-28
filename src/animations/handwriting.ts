import Vivus from 'vivus'

/**
 * Options pour l'animation handwriting
 */
export interface HandwritingOptions {
    /** Durée totale de l'animation (en millisecondes) */
    duration?: number
    /** Type d'animation : 'oneByOne' pour lettre par lettre, 'delayed' pour simultané avec délai, 'sync' pour synchronisé */
    type?: 'oneByOne' | 'delayed' | 'sync'
    /** Délai entre chaque path (en millisecondes, pour type 'delayed') */
    delay?: number
    /** Fonction de timing personnalisée */
    timingFunction?: (input: number) => number
}

/**
 * Contrôleur retourné par createHandwritingAnimation
 */
export interface HandwritingController {
    /** L'instance Vivus */
    vivus: Vivus
    /** Jouer l'animation */
    play: () => void
    /** Redémarrer l'animation (reset puis play) */
    restart: () => void
    /** Arrêter et nettoyer l'animation */
    kill: () => void
    /** Définir la progression de l'animation (0 à 1) pour synchroniser avec le scroll */
    setProgress: (progress: number) => void
}

/**
 * Crée une animation handwriting (effet d'écriture au stylo) sur les paths d'un SVG
 * Utilise Vivus pour un rendu optimal lettre par lettre
 * 
 * @param svgElement Le SVG ou un élément wrapper contenant le SVG avec la classe "handwriting-svg"
 * @param options Options d'animation (duration, type, delay, timingFunction)
 * @returns Un contrôleur pour gérer l'animation
 */
export function createHandwritingAnimation(
    svgElement: SVGSVGElement | HTMLElement | null,
    options: HandwritingOptions = {}
): HandwritingController | null {
    if (!svgElement) {
        return null
    }

    // Trouver le SVG : si c'est un wrapper, chercher svg.handwriting-svg à l'intérieur
    let svg: SVGSVGElement | null = null
    
    if (svgElement instanceof SVGSVGElement) {
        svg = svgElement
    } else {
        svg = svgElement.querySelector('svg.handwriting-svg') as SVGSVGElement | null
    }

    if (!svg) {
        return null
    }

    // Vérifier qu'il y a des paths dans le SVG
    const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[]
    
    if (paths.length === 0) {
        return null
    }

    // Corriger l'ordre d'écriture : trier les paths par ligne (Y) puis par position X (gauche-droite)
    // pour que les lignes s'écrivent de haut en bas et de gauche à droite
    if (paths.length > 1) {
        const parent = paths[0].parentElement
        if (parent) {
            // Obtenir la position de chaque path
            const pathsWithPosition = paths.map(path => {
                const rect = path.getBoundingClientRect()
                return { 
                    path, 
                    y: rect.top + rect.height / 2, // Centre Y du path
                    x: rect.left + rect.width / 2   // Centre X du path
                }
            })
            
            // Trier d'abord par Y (haut vers bas), puis par X (gauche vers droite)
            pathsWithPosition.sort((a, b) => {
                // Si la différence Y est significative (> 5px), c'est une ligne différente
                if (Math.abs(a.y - b.y) > 5) {
                    return a.y - b.y // Trier par Y (haut vers bas)
                }
                // Sinon, même ligne, trier par X (gauche vers droite)
                return a.x - b.x
            })
            
            // Réorganiser les paths dans le DOM dans le bon ordre
            pathsWithPosition.forEach(({ path }) => {
                parent.appendChild(path)
            })
        }
    }

    // Valeurs par défaut pour Vivus
    // Pour un rendu path par path optimal, on utilise 'oneByOne' avec une durée par path
    // duration en millisecondes pour Vivus - réduite pour accélérer l'écriture
    const duration = options.duration ?? 800 // Réduit de 2000 à 800ms pour plus de rapidité
    const type = options.type ?? 'oneByOne' // 'oneByOne' pour lettre par lettre
    const delay = options.delay ?? 10 // Délai entre chaque path pour type 'delayed'
    const timingFunction = options.timingFunction

    // Créer l'instance Vivus
    // Vivus nécessite soit un ID, soit un élément SVG directement
    // On va utiliser l'élément SVG directement
    let vivusInstance: Vivus | null = null

    try {
        // Fonction de timing linéaire pour un contrôle précis avec setFrameProgress
        const linearTiming = (input: number) => input
        
        vivusInstance = new Vivus(svg, {
            type,
            duration,
            delay,
            timingFunction: timingFunction ?? linearTiming,
            start: 'manual', // Ne pas démarrer automatiquement
        } as Vivus.VivusOptions)
    } catch (error) {
        console.warn('Erreur lors de la création de l\'animation Vivus:', error)
        return null
    }

    if (!vivusInstance) {
        return null
    }

    // S'assurer que l'animation est initialisée à 0 (complètement invisible)
    // Vivus gère automatiquement l'invisibilité avec strokeDasharray/offset
    vivusInstance.setFrameProgress(0)

    // Retourner le contrôleur
    return {
        vivus: vivusInstance,
        play: () => {
            vivusInstance?.play()
        },
        restart: () => {
            // Reset puis rejouer
            vivusInstance?.reset()
            // Petit délai pour s'assurer que le reset est bien appliqué
            setTimeout(() => {
                vivusInstance?.play()
            }, 10)
        },
        kill: () => {
            // Arrêter l'animation et nettoyer
            vivusInstance?.stop()
            vivusInstance?.destroy()
        },
        setProgress: (progress: number) => {
            // Clamper progress entre 0 et 1
            const clampedProgress = Math.max(0, Math.min(1, progress))
            // Utiliser setFrameProgress pour contrôler précisément l'animation
            vivusInstance?.setFrameProgress(clampedProgress)
        },
    }
}
