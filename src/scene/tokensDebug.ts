/**
 * Instrumentation debug pour diagnostic régressions WideDesktop / CSS vars.
 * Activer avec : window.__TOKENS_DEBUG__ = true (logs) et/ou window.__TOKENS_DEBUG_OVERLAY__ = true (overlay).
 */

import { getNearGoldenT, getTWide } from './responsiveTokens'

const WIDE_WIDTH_MIN = 1500
const WIDE_WIDTH_MAX = 1920
const WIDE_HEIGHT_MIN = 768
const WIDE_HEIGHT_MAX = 1080

function smoothstep(x: number): number {
    const t = Math.max(0, Math.min(1, x))
    return t * t * (3 - 2 * t)
}

function getFW(w: number): number {
    if (w < WIDE_WIDTH_MIN) return 0
    return smoothstep((w - WIDE_WIDTH_MIN) / (WIDE_WIDTH_MAX - WIDE_WIDTH_MIN))
}
function getFH(h: number): number {
    if (h < WIDE_HEIGHT_MIN) return 0
    return smoothstep((h - WIDE_HEIGHT_MIN) / (WIDE_HEIGHT_MAX - WIDE_HEIGHT_MIN))
}

type Metrics = { width: number; height: number }

const VAR_KEYS = [
    '--ground-bottom-vh',
    '--presentation-margin-top-vh',
    '--home-myname-font-size-base-vw',
    '--home-myname-font-size-delta-vw',
    '--home-description-font-size-base-vw',
    '--home-description-font-size-delta-vw',
    '--handwriting-svg-width',
] as const

function getVarRaw(stage: HTMLElement, key: string): string {
    const raw = stage.style.getPropertyValue(key)?.trim()
    if (raw !== '') return raw
    return getComputedStyle(stage).getPropertyValue(key).trim()
}

function buildSnapshot(metrics: Metrics, stage: HTMLElement) {
    const w = metrics.width
    const h = metrics.height
    const tNearGolden = getNearGoldenT(w)
    const tWide = getTWide(w, h)
    const fw = getFW(w)
    const fh = getFH(h)

    const varsRaw: Record<string, string> = {}
    VAR_KEYS.forEach((key) => {
        varsRaw[key] = getVarRaw(stage, key) || '(vide)'
    })

    const groundLine = document.querySelector('.ground-line') as HTMLElement | null
    const groundOvercoat = document.querySelector('.ground-overcoat') as HTMLElement | null
    const myName = document.getElementById('myName')
    const descriptionContainer = document.querySelector('.descriptionContainer') as HTMLElement | null
    const presentationContainer = document.querySelector('.presentationContainer') as HTMLElement | null
    const contactPlaceholder = document.querySelector('.contact-section-placeholder') as HTMLElement | null
    const contactFormIllustratedWrapper = document.querySelector('.contact-form-illustrated-wrapper') as HTMLElement | null

    const computed = (el: Element | null, ...props: string[]) => {
        if (!el) return null
        const s = getComputedStyle(el)
        const o: Record<string, string> = {}
        props.forEach((p) => {
            o[p] = s.getPropertyValue(p) || (s as unknown as Record<string, string>)[p] || ''
        })
        return o
    }

    return {
        viewport: { w, h },
        factors: { tNearGolden, tWide, fw, fh },
        varsRaw,
        elements: {
            groundLine: groundLine
                ? {
                      bottom: getComputedStyle(groundLine).bottom,
                      position: getComputedStyle(groundLine).position,
                      transform: getComputedStyle(groundLine).transform,
                      offsetParent: groundLine.offsetParent
                          ? (groundLine.offsetParent as HTMLElement).className || (groundLine.offsetParent as HTMLElement).tagName
                          : null,
                      rectTop: groundLine.getBoundingClientRect().top,
                  }
                : null,
            groundOvercoat: groundOvercoat
                ? {
                      bottom: getComputedStyle(groundOvercoat).bottom,
                      height: getComputedStyle(groundOvercoat).height,
                  }
                : null,
            myName: myName
                ? (() => {
                      const s = getComputedStyle(myName)
                      const baseVw = s.getPropertyValue('--home-myname-font-size-base-vw').trim()
                      const deltaVw = s.getPropertyValue('--home-myname-font-size-delta-vw').trim()
                      if (typeof window !== 'undefined' && (window as Window & { __TOKENS_DEBUG__?: boolean }).__TOKENS_DEBUG__) {
                          console.log('[TokensDebug] #myName typo vars', { baseVw: baseVw || '(vide)', deltaVw: deltaVw || '(vide)', nonVides: !!(baseVw && deltaVw) })
                      }
                      return {
                          fontSize: s.fontSize,
                          lineHeight: s.lineHeight,
                          baseVarResolved: baseVw || '(vide)',
                          deltaVarResolved: deltaVw || '(vide)',
                      }
                  })()
                : null,
            descriptionContainer: descriptionContainer
                ? { fontSize: getComputedStyle(descriptionContainer).fontSize }
                : null,
            presentationContainer: presentationContainer
                ? { marginTop: getComputedStyle(presentationContainer).marginTop }
                : null,
            contactPlaceholder: contactPlaceholder
                ? {
                      top: getComputedStyle(contactPlaceholder).top,
                      left: getComputedStyle(contactPlaceholder).left,
                      transform: getComputedStyle(contactPlaceholder).transform,
                      marginTop: getComputedStyle(contactPlaceholder).marginTop,
                      marginLeft: getComputedStyle(contactPlaceholder).marginLeft,
                      offsetTop: contactPlaceholder.offsetTop,
                  }
                : null,
            contactFormIllustratedWrapper: contactFormIllustratedWrapper
                ? {
                      top: getComputedStyle(contactFormIllustratedWrapper).top,
                      left: getComputedStyle(contactFormIllustratedWrapper).left,
                  }
                : null,
        },
    }
}

export function runTokensDebugSnapshot(
    metrics: Metrics,
    stage: HTMLElement
): void {
    if (typeof window === 'undefined') return
    const win = window as Window & { __TOKENS_DEBUG__?: boolean; __TOKENS_DEBUG_OVERLAY__?: boolean }
    if (!win.__TOKENS_DEBUG__ && !win.__TOKENS_DEBUG_OVERLAY__) return

    const snapshot = buildSnapshot(metrics, stage)

    if (win.__TOKENS_DEBUG__) {
        console.log('[TokensDebug] snapshot', snapshot)
        console.table(snapshot.varsRaw)
    }

    if (win.__TOKENS_DEBUG_OVERLAY__) {
        updateOverlay(snapshot)
    }
}

function updateOverlay(snapshot: ReturnType<typeof buildSnapshot>): void {
    if (typeof document === 'undefined') return
    let el = document.getElementById('tokens-debug-overlay')
    if (!el) {
        el = document.createElement('div')
        el.id = 'tokens-debug-overlay'
        Object.assign(el.style, {
            position: 'fixed',
            top: '8px',
            left: '8px',
            zIndex: '99999',
            fontFamily: 'monospace',
            fontSize: '11px',
            background: 'rgba(0,0,0,0.9)',
            color: '#0f0',
            padding: '6px 8px',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
        })
        document.body.appendChild(el)
    }
    const lines = [
        `w=${snapshot.viewport.w} h=${snapshot.viewport.h}`,
        `tNearGolden=${snapshot.factors.tNearGolden.toFixed(3)} tWide=${snapshot.factors.tWide.toFixed(3)}`,
        `fw=${snapshot.factors.fw.toFixed(3)} fh=${snapshot.factors.fh.toFixed(3)}`,
        '--- vars ---',
        ...VAR_KEYS.map((k) => `${k}: ${snapshot.varsRaw[k] || '(vide)'}`),
    ]
    el.textContent = lines.join('\n')
}
