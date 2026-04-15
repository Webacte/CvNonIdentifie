/**
 * Applique la position du point d’ancrage sol sur le SVG fusée (`#rocket-ground-anchor`).
 *
 * Réglage via variables CSS sur le stage (`.horizontal-scroll-stage`) :
 * - `--rocket-ground-anchor-cx`
 * - `--rocket-ground-anchor-cy`
 *
 * Les valeurs peuvent être des pourcentages (`50%`, `100%`) ou des coordonnées utilisateur (`120`).
 */
export function applyRocketGroundAnchorFromTokens(
    rocketContainer: HTMLElement | null,
    cssVars: Record<string, string> | null | undefined,
    stageFallback?: HTMLElement | null
): void {
    if (!rocketContainer || typeof document === 'undefined') return
    const anchor = rocketContainer.querySelector('#rocket-ground-anchor') as SVGCircleElement | null
    if (!anchor) return

    const stage =
        stageFallback ?? (rocketContainer.closest?.('.horizontal-scroll-stage') as HTMLElement | null)

    const fromStage = (key: string): string => {
        if (!stage) return ''
        return getComputedStyle(stage).getPropertyValue(key).trim()
    }

    const cx =
        (cssVars?.['--rocket-ground-anchor-cx']?.trim() ||
            fromStage('--rocket-ground-anchor-cx') ||
            '50%') || '50%'
    const cy =
        (cssVars?.['--rocket-ground-anchor-cy']?.trim() ||
            fromStage('--rocket-ground-anchor-cy') ||
            '100%') || '100%'

    anchor.setAttribute('cx', cx)
    anchor.setAttribute('cy', cy)
}

