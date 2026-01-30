import Vivus from 'vivus'
import { HANDWRITING_PROFILE_SCALE } from './constants'

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

    // Réordonner chaque ligne gauche→droite et appliquer l'écartement via <g> wrapper
    const LETTER_SPACING_GAP = 0.75
    for (let line = 1; line <= 4; line++) {
        const lineEl = svg.querySelector(`#line-${line}`)
        if (!lineEl) continue
        const pathList = Array.from(lineEl.querySelectorAll('path')) as SVGPathElement[]
        if (pathList.length === 0) continue

        const withPos = pathList.map((p) => {
            const b = p.getBBox()
            return { path: p, x: b.x + b.width / 2 }
        })
        withPos.sort((a, b) => a.x - b.x)

        withPos.forEach(({ path }, i) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            g.setAttribute('transform', `translate(${i * LETTER_SPACING_GAP}, 0)`)
            g.appendChild(path)
            lineEl.appendChild(g)
        })
    }

    // Réduire la taille du contenu et le centrer dans le viewBox
    const profile = svg.querySelector('#profile-desktop') as SVGGElement | null
    if (profile?.parentNode) {
        const b = profile.getBBox()
        const cx = b.x + b.width / 2
        const cy = b.y + b.height / 2
        const viewBox = svg.getAttribute('viewBox')
        const [, , vw, vh] = (viewBox || '0 0 263 91').split(/\s+/).map(Number)
        const vbCx = (vw || 263) / 2
        const vbCy = (vh || 91) / 2
        const scale = HANDWRITING_PROFILE_SCALE
        const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        wrap.setAttribute(
            'transform',
            `translate(${vbCx},${vbCy}) scale(${scale}) translate(${-cx},${-cy})`
        )
        profile.parentNode.insertBefore(wrap, profile)
        wrap.appendChild(profile)
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
            start: 'manual',
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

    const pathList = Array.from(svg.querySelectorAll('path')) as SVGPathElement[]
    const pathCount = pathList.length

    // Remplissage plus réaliste : plus rapide au fur et à mesure, avec ease-out
    const FILL_RAMP_RATIO = 0.35 // fill 0→1 sur les 35 % premiers du tracé de chaque lettre
    const easeOut = (x: number) => 1 - (1 - x) * (1 - x)

    function updateFillOpacity(progress: number) {
        const p = Math.max(0, Math.min(1, progress))
        for (let i = 0; i < pathCount; i++) {
            const t = p * pathCount - i
            if (t <= 0) {
                pathList[i].style.fillOpacity = '0'
                continue
            }
            const tFill = Math.min(1, t / FILL_RAMP_RATIO)
            const opacity = easeOut(tFill)
            pathList[i].style.fillOpacity = String(opacity)
        }
    }

    updateFillOpacity(0)

    return {
        vivus: vivusInstance,
        play: () => {
            vivusInstance?.play()
        },
        restart: () => {
            vivusInstance?.reset()
            updateFillOpacity(0)
            setTimeout(() => {
                vivusInstance?.play()
            }, 10)
        },
        kill: () => {
            vivusInstance?.stop()
            vivusInstance?.destroy()
        },
        setProgress: (progress: number) => {
            const clampedProgress = Math.max(0, Math.min(1, progress))
            vivusInstance?.setFrameProgress(clampedProgress)
            updateFillOpacity(clampedProgress)
        },
    }
}
