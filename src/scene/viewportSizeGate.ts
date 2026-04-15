/**
 * Détecte un changement de taille d’affichage (viewport) depuis le dernier `commit()`.
 * Réutilisable pour tout élément dont la position dépend de `innerWidth` / `innerHeight`.
 */
export type ViewportSizePx = { width: number; height: number }

export function createViewportSizeGate(getViewportSize: () => ViewportSizePx): {
    hasChangedSinceLastCommit: () => boolean
    commit: () => void
    clear: () => void
} {
    let committed: ViewportSizePx | null = null

    return {
        hasChangedSinceLastCommit(): boolean {
            const cur = getViewportSize()
            if (!committed) return true
            return cur.width !== committed.width || cur.height !== committed.height
        },
        commit(): void {
            committed = { ...getViewportSize() }
        },
        clear(): void {
            committed = null
        },
    }
}

