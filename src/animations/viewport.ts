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
 * En dev : si window.__VIEWPORT_DEBUG__ === true, log une fois rect vs window pour vérifier la source des métriques.
 */
export function getViewportMetrics(containerEl: HTMLElement): ViewportMetrics {
    const rect = containerEl.getBoundingClientRect()
    const width = rect.width > 0 ? rect.width : (typeof window !== 'undefined' ? window.innerWidth : 0)
    const height = rect.height > 0 ? rect.height : (typeof window !== 'undefined' ? window.innerHeight : 0)
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1
    const scaleGuess = width > 0 ? width / VIEWPORT_REFERENCE_WIDTH : undefined

    if (typeof window !== 'undefined' && (window as Window & { __VIEWPORT_DEBUG__?: boolean }).__VIEWPORT_DEBUG__) {
        const winW = window.innerWidth
        const winH = window.innerHeight
        const mismatch = Math.abs(rect.width - winW) > 1 || Math.abs(rect.height - winH) > 1
        console.log('[VIEWPORT_DEBUG]', {
            containerRect: { width: rect.width, height: rect.height },
            window: { innerWidth: winW, innerHeight: winH },
            used: { width, height },
            mismatch: mismatch ? 'Container size differs from window' : 'ok',
        })
    }

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
