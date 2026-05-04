import { VIEWPORT_REFERENCE_WIDTH } from '@/animations/constants'

export type ViewportMetricsInput = { width: number; height: number; aspect?: number }
export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl'
type ResponsiveTokensFlags = { is425: boolean; is768: boolean; is1050: boolean; is1349: boolean; is1500: boolean; shortH: boolean; ultraWide: boolean }
export interface ResponsiveTokens {
    bp: BreakpointName
    w: number
    h: number
    aspect: number
    shortH: boolean
    scale: number
    scaleClamped: number
    flags: ResponsiveTokensFlags
    cssVars: Record<string, string>
}

const clamp = (min: number, value: number, max: number): number => Math.max(min, Math.min(max, value))
const round = (value: number, decimals = 2): string => value.toFixed(decimals).replace(/\.?0+$/, '')

function getViewport(metrics?: ViewportMetricsInput): { width: number; height: number } {
    if (metrics?.width && metrics?.height) return { width: metrics.width, height: metrics.height }
    if (typeof window !== 'undefined') return { width: window.innerWidth, height: window.innerHeight }
    return { width: VIEWPORT_REFERENCE_WIDTH, height: 768 }
}

export const getNearGoldenT = (w: number): number => clamp(0, (w - 1348) / 18, 1)
export const getTWide = (w: number, h: number): number => clamp(0, (w - 1500) / 420, 1) * clamp(0, (h - 768) / 312, 1)

export function computeResponsiveTokens(metrics: ViewportMetricsInput): ResponsiveTokens {
    const { width: w, height: h } = getViewport(metrics)
    const aspect = metrics.aspect ?? (h > 0 ? w / h : 16 / 9)
    const bp: BreakpointName = 'lg'
    const scale = w / VIEWPORT_REFERENCE_WIDTH
    const scaleClamped = clamp(0.7, scale, 2)
    const shortH = false
    const ultraWide = false
    // La demande utilisateur : forcer --ground-bottom-vh à 25 (toutes largeurs).
    const groundBottomVh = 25
    /** Marge depuis la droite pour le titre Contact (la fusée atterrie utilise cette valeur + 3vw en JS). */
    const contactSectionTitleWrapperRight = '8vw'
    // About (alien + hologramme) : sur viewport très haut ou écran portrait, on augmente l’échelle globale (x1.5).
    // Base actuelle pensée pour un scaling "x2" côté SVG ; en mode grand (x3), on garde la proportion.
    const aboutBigScale = (h > 1000 || h > w) ? 1.5 : 1
    const isPortraitViewport = h > w

    // Point marqueur `.about-hologram-bases-anchor-mark` : % du rect alien. En portrait (boîte plus haute, hologramme très large) on rapproche horizontalement et on baisse le % vertical pour viser le perso.
    let aboutHologramBasesAnchorLeft: string
    let aboutHologramBasesAnchorTop: string
    if (isPortraitViewport) {
        aboutHologramBasesAnchorLeft = '25%'
        /** En portrait `aboutBigScale` est déjà 1.5 ; boîte alien haute → % vertical plus bas pour viser le corps du SVG. */
        aboutHologramBasesAnchorTop = '20%'
    } else if (aboutBigScale === 1.5) {
        aboutHologramBasesAnchorLeft = '12%'
        aboutHologramBasesAnchorTop = '8%'
    } else {
        aboutHologramBasesAnchorLeft = '14%'
        aboutHologramBasesAnchorTop = '9%'
    }

    const cssVars: Record<string, string> = {
        '--vw': `${w}px`,
        '--vh': `${h}px`,
        '--ar': round(aspect, 4),
        '--scale': round(scale, 4),
        '--scale-clamped': round(scaleClamped, 4),
        '--ground-bottom-vh': round(groundBottomVh, 1),
        // Ajustement fusée atterrie (en vh, positif = remonte la fusée au-dessus du sol)
        '--rocket-landed-ground-offset-vh': '0',
        // Ajustement fin de chute phase 1 (en vh, positif = remonte la fusée au-dessus du sol)
        '--rocket-phase1-ground-offset-vh': '18',
        // Point d’ancrage sol (dans le SVG fusée) — à ajuster si le viewBox a des marges.
        '--rocket-ground-anchor-cx': '55%',
        '--rocket-ground-anchor-cy': '18%',
        '--presentation-margin-top-vh': '-5',
        '--home-myname-font-size-base-vw': '7',
        '--home-myname-font-size-delta-vw': '0',
        '--home-description-font-size-base-vw': '3.5',
        '--home-description-font-size-delta-vw': '0',
        '--portrait-image-top-vh': '5',
        '--rocket-width': 'max(230px, 27vw)',
        '--rocket-height': 'max(230px, 27vw)',
        '--rocket-left': '10vw',
        '--rocket-top': '-60vh',
        '--about-alien-width': aboutBigScale === 1.5 ? 'min(25.5vw, 330px)' : 'min(17vw, 220px)',
        '--about-alien-left': '10vw',
        '--about-hologram-width': aboutBigScale === 1.5 ? 'min(90vw, 1650px)' : 'min(90vw, 1160px)',
        '--about-hologram-right': '11vw',
        '--about-hologram-rise': 'clamp(60px, 6vh, 136px)',
        /* Ancrage hologramme — `.about-hologram-bases-anchor-mark` (voir aboutHologramBasesAnchor* ci-dessus). */
        '--about-hologram-bases-anchor-left': aboutHologramBasesAnchorLeft,
        '--about-hologram-bases-anchor-top': aboutHologramBasesAnchorTop,
        '--exp-hab-left-px': round(w * 0.72, 0),
        '--exp-hab-w-px': round(w * 0.74, 0),
        '--mask-convoyeur-bottom': '8.5',
        '--mask-convoyeur-height': '43',
        '--mask-convoyeur-bottom-vh': '0.2',
        '--mask-chemine-bottom': '18',
        '--mask-chemine-height': '59',
        '--mask-chemine-clip-raw': 'polygon(65% 21%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
        '--exp-alien2-left-percent': '-14',
        '--exp-alien2-width-percent': '10.5',
        '--convoyeur-left-vw': '-55',
        '--convoyeur-w-vw': '105',
        /* Convoyeur SVG (Projets) : hauteur ≈ scaleY, fin de translate X (unités SVG, parse JS) */
        '--projets-convoyeur-scale-x': '0.65',
        '--projets-convoyeur-scale-y': '0.5',
        '--projets-convoyeur-slide-end-x': '80',
        '--projets-convoyeur-bbox-height': '0px',
        /* Ajustement visuel (vh) : appliqué uniquement pendant la chute (via diagonalProgress) pour corriger l'atterrissage. */
        '--robot-ground-nudge-vh': '6',
        '--quest-titre-left': '50vw',
        '--quest-titre-top': '3vh',
        '--quest-titre-max-width': '50vw',
        '--quest-descrip-top': '11vh',
        '--quest-descrip-max-width': '40vw',
        '--projets-text-top': '5vh',
        '--projets-text-right': '10vw',
        '--projets-text-max-width': '40vw',
        '--contact-form-wrapper-left': '15',
        '--contact-form-wrapper-top': '36.5',
        '--contact-form-wrapper-height-vh': '75',
        '--contact-section-title-wrapper-right': contactSectionTitleWrapperRight,
        '--contact-section-title-wrapper-top': '10vh',
        '--handwriting-svg-width': '58vw',
        '--paper-step-mult': '1',
    }

    return {
        bp,
        w,
        h,
        aspect,
        shortH,
        scale,
        scaleClamped,
        flags: { is425: false, is768: false, is1050: true, is1349: false, is1500: false, shortH, ultraWide },
        cssVars,
    }
}

const UI_TOKEN_PREFIXES = ['--mask-chemine-', '--mask-convoyeur-', '--contact-form-wrapper-', '--contact-section-title-wrapper-']

export function applyResponsiveTokens(stage: HTMLElement, tokens: ResponsiveTokens): void {
    Object.entries(tokens.cssVars).forEach(([key, value]) => stage.style.setProperty(key, value))
    if (typeof document !== 'undefined' && document.body) {
        Object.entries(tokens.cssVars).forEach(([key, value]) => {
            if (UI_TOKEN_PREFIXES.some(prefix => key.startsWith(prefix))) document.body.style.setProperty(key, value)
        })
    }
    stage.dataset.bp = tokens.bp
    stage.dataset.short = tokens.shortH ? '1' : '0'
    stage.dataset.ar = tokens.aspect.toFixed(2)
    stage.dataset.scale = tokens.scaleClamped.toFixed(2)
}
