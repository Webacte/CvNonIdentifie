/**
 * Source de vérité pour les métriques du viewport (container pinné).
 * Utilisé pour recalculer le scroll horizontal et les animations au resize/zoom.
 */

import { VIEWPORT_REFERENCE_WIDTH } from './constants'

export interface ViewportMetrics {
    width: number
    height: number
    dpr: number
    scaleGuess?: number
}

/**
 * Retourne les métriques du viewport basées sur le container (élément pinné).
 * Si le container n'a pas encore de taille, fallback sur window.
 */
export function getViewportMetrics(containerEl: HTMLElement): ViewportMetrics {
    const rect = containerEl.getBoundingClientRect()
    const width = rect.width > 0 ? rect.width : (typeof window !== 'undefined' ? window.innerWidth : 0)
    const height = rect.height > 0 ? rect.height : (typeof window !== 'undefined' ? window.innerHeight : 0)
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1
    const scaleGuess = width > 0 ? width / VIEWPORT_REFERENCE_WIDTH : undefined
    return { width, height, dpr, scaleGuess }
}

/**
 * Observe les changements de taille du container (et de la fenêtre en fallback).
 * Le callback reçoit les métriques à jour. Retourne une fonction unsubscribe.
 */
export function observeViewport(
    containerEl: HTMLElement,
    callback: (metrics: ViewportMetrics) => void
): () => void {
    const onResize = () => callback(getViewportMetrics(containerEl))
    const cleanups: (() => void)[] = []

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(onResize)
        resizeObserver.observe(containerEl)
        cleanups.push(() => resizeObserver.disconnect())
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', onResize)
        cleanups.push(() => window.removeEventListener('resize', onResize))
    }

    return () => cleanups.forEach((fn) => fn())
}
