import Vivus from 'vivus'
import { HANDWRITING_PROFILE_SCALE } from './constants'

/**
 * Options pour l'animation handwriting
 */
export interface HandwritingOptions {
    /** Durée totale de l'animation (en millisecondes) */
    duration?: number
}

/**
 * Contrôleur retourné par createHandwritingAnimation
 */
export interface HandwritingController {
    /** Définir la progression de l'animation (0 à 1) pour synchroniser avec le scroll */
    setProgress: (progress: number) => void
    /** Arrêter et nettoyer l'animation */
    kill: () => void
}

/**
 * Crée une animation handwriting (effet d'écriture au stylo) sur les paths d'un SVG
 * Utilise Vivus pour un rendu optimal lettre par lettre
 * 
 * @param svgElement Le SVG ou un élément wrapper contenant le SVG avec la classe "handwriting-svg"
 * @param options Options d'animation (duration)
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

    const duration = options.duration ?? 800

    let vivusInstance: Vivus | null = null
    try {
        vivusInstance = new Vivus(svg, {
            type: 'oneByOne',
            duration,
            start: 'manual',
            timingFunction: Vivus.LINEAR,
        } as Vivus.VivusOptions)
    } catch (error) {
        console.warn('Erreur lors de la création de l\'animation Vivus:', error)
        return null
    }

    if (!vivusInstance) {
        return null
    }

    vivusInstance.setFrameProgress(0)

    return {
        setProgress: (progress: number) => {
            const clampedProgress = Math.max(0, Math.min(1, progress))
            vivusInstance?.setFrameProgress(clampedProgress)
        },
        kill: () => {
            vivusInstance?.stop()
            vivusInstance?.destroy()
        },
    }
}
