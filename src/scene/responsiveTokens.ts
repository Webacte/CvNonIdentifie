/**
 * Couche Responsive Tokens : source unique calculée depuis getViewportMetrics(container).
 * Exposée en CSS variables sur le stage et réutilisable en JS pour aligner breakpoints CSS/JS.
 * Référence : VIEWPORT_REFERENCE_WIDTH = 1050 ; breakpoints 320, 425, 768, 1050, 1349, 1500.
 */

import type { ViewportMetrics as ViewportMetricsBase } from '@/animations/viewport'
import {
    VIEWPORT_REFERENCE_WIDTH,
    GROUND_LINE_425_MAX_WIDTH,
    MOBILE_MAX_WIDTH,
    TABLET_MAX_WIDTH,
    LARGE_DESKTOP_MIN_WIDTH,
} from '@/animations/constants'

/** Seuils de breakpoint (px) alignés sceneConfig/constants. */
const BP_XS = 320
const BP_SM = 425  // GROUND_LINE_425_MAX_WIDTH
const BP_MD = 768  // TABLET_MAX_WIDTH
const BP_LG = 1050 // VIEWPORT_REFERENCE_WIDTH
/** Largeur de référence visuelle "golden" : ne pas modifier le rendu à 1348×768. */
const GOLDEN_REF_WIDTH = 1348
/** Largeur max pour le palier "nearGolden" (1366×768) : ajustements spécifiques sans régresser golden. */
const NEAR_GOLDEN_MAX_WIDTH = 1366
const BP_XL = 1349
const BP_XXL = 1500 // LARGE_DESKTOP_MIN_WIDTH

function isGoldenViewport(w: number, h: number): boolean {
    return w >= 1347 && w <= 1349 && h >= 763 && h <= 773
}
function isNearGoldenViewport(w: number, h: number): boolean {
    return w > 1348 && w <= NEAR_GOLDEN_MAX_WIDTH && h >= 763 && h <= 773
}

/** Smoothstep pour transition douce : t=0 à 1348, t=1 à 1366. Ne modifie jamais les valeurs à w=1348 (t=0). */
function smoothstep(x: number): number {
    const t = Math.max(0, Math.min(1, x))
    return t * t * (3 - 2 * t)
}

/** Facteur d'interpolation nearGolden : 0 à w=1348, 1 à w=1366, transition douce entre. */
export function getNearGoldenT(w: number): number {
    if (w <= GOLDEN_REF_WIDTH) return 0
    if (w >= NEAR_GOLDEN_MAX_WIDTH) return 1
    const tRaw = (w - GOLDEN_REF_WIDTH) / (NEAR_GOLDEN_MAX_WIDTH - GOLDEN_REF_WIDTH)
    return smoothstep(tRaw)
}

/** Seuils wideDesktop : 1920×1080. tWide=0 en dessous de 1500 ou h<768, tWide=1 à 1920×1080. */
const WIDE_WIDTH_MIN = 1500
const WIDE_WIDTH_MAX = 1920
const WIDE_HEIGHT_MIN = 768
const WIDE_HEIGHT_MAX = 1080

/** Facteur d'interpolation wideDesktop : 0 en dessous de 1500×768, 1 à 1920×1080. fw * fh pour éviter application sur écran large mais bas (ou l'inverse). */
export function getTWide(w: number, h: number): number {
    if (w < WIDE_WIDTH_MIN || h < WIDE_HEIGHT_MIN) return 0
    const fw = smoothstep((w - WIDE_WIDTH_MIN) / (WIDE_WIDTH_MAX - WIDE_WIDTH_MIN))
    const fh = smoothstep((h - WIDE_HEIGHT_MIN) / (WIDE_HEIGHT_MAX - WIDE_HEIGHT_MIN))
    return fw * fh
}

/** Preset 1920×1080 (valeurs numériques : % stockés en nombre, vh/vw idem). Typo delta -2 pour rendu correct à 1920. */
const WIDE_1920_1080 = {
    groundLineTop: 45,
    groundOvercoatTop: 45.5,
    aboutHologramTop: 29.5,
    aboutAlienTop: 44.5,
    handwritingSvgWidth: 67,
    presentationMarginTopVh: -35,
    homeMynameFontSizeDeltaVw: -2,
    homeDescriptionFontSizeDeltaVw: -2,
    profileTextLeft: 79,
    profileTextTop: 30,
    profileTextWidth: 44,
    expHabTopPx: 634,
    expHabWPx: 1300,
    expAlien2TopPercent: 40.7,
    expAlien2WidthPx: 82,
    contactSvgLeft: 16,
    contactSvgTop: 25,
    contactSvgHeightVh: 41,
    contactPrenomTop: 5.2,
    contactPrenomLeft: 35.2,
    contactPrenomWidth: 12.5,
    contactPrenomRotateDeg: 10,
    contactSocieteTop: 15.1,
    contactSocieteLeft: 24.8,
    contactSocieteWidth: 14.5,
    contactSocieteLabelTxVw: -6.5,
    contactSocieteLabelTyVh: -1,
    contactLabelFontSizeRem: 0.65,
    contactEmailTop: 9.7,
    contactEmailLeft: 41,
    contactEmailWidth: 17,
    contactEmailLabelTxVh: 3,
    contactEmailLabelTyVh: -4,
    contactMessageTop: 25.5,
    contactMessageTextareaFocusMtVh: 0.4,
    contactMessageTextareaFocusMlVw: 0.3,
    contactMessageTextareaFocusWidth: 93,
    contactMessageLabelTxVw: -4,
    contactMessageLabelTyVh: -14,
    contactSubmitTop: 28,
    contactSubmitLeft: 48.5,
    contactSubmitWidth: 12.5,
    contactSubmitRotateDeg: 27,
    contactSubmitHeight: 3,
    maskChemineBottom: 12.5,
    maskChemineHeight: 68,
    maskConvoyeurBottom: 12.5,
    maskConvoyeurHeight: 33,
    convoyeurLeftPx: -1203,
    convoyeurBottomPx: 1075,
    convoyeurWPx: 2200,
    convoyeurH: 16,
    convoyeurEndCorrectionXPx: 10,
    robotAboveYPercent: 33.5,
    robotGroundYPercent: 40.5,
} as const

const PRESENTATION_MARGIN_TOP_VH_BASE = -5

function parsePercent(s: string): number {
    const n = parseFloat(String(s).replace(/%/g, '').trim())
    return Number.isNaN(n) ? 0 : n
}
function parseVw(s: string): number {
    const n = parseFloat(String(s).replace(/vw/gi, '').trim())
    return Number.isNaN(n) ? 0 : n
}
function parseVh(s: string): number {
    const n = parseFloat(String(s).replace(/vh/gi, '').trim())
    return Number.isNaN(n) ? 0 : n
}
function parsePx(s: string, fallback: number): number {
    const n = parseFloat(String(s).trim())
    return Number.isNaN(n) ? fallback : n
}

/** Applique le mix wideDesktop sur les clés concernées ; valeurs numériques (CSS utilisera * 1% / * 1vh / * 1vw). */
function applyWideDesktopMix(
    cssVars: Record<string, string>,
    w: number,
    h: number
): void {
    const tWide = getTWide(w, h)
    const debug = typeof window !== 'undefined' && (window as Window & { __TOKENS_DEBUG__?: boolean }).__TOKENS_DEBUG__

    const groundLine = parsePercent(cssVars['--ground-line-top'] ?? '70')
    const outGroundLine = String(Math.round(lerp(groundLine, WIDE_1920_1080.groundLineTop, tWide)))
    if (debug) console.log('[applyWideDesktopMix] --ground-line-top', { baseParsed: groundLine, preset: WIDE_1920_1080.groundLineTop, tWide, output: outGroundLine })
    cssVars['--ground-line-top'] = outGroundLine

    const groundOvercoat = parsePercent(cssVars['--ground-overcoat-top'] ?? '60')
    const outGroundOvercoat = String(lerp(groundOvercoat, WIDE_1920_1080.groundOvercoatTop, tWide).toFixed(1))
    if (debug) console.log('[applyWideDesktopMix] --ground-overcoat-top', { baseParsed: groundOvercoat, preset: WIDE_1920_1080.groundOvercoatTop, tWide, output: outGroundOvercoat })
    cssVars['--ground-overcoat-top'] = outGroundOvercoat

    const aboutHologram = parsePercent(cssVars['--about-hologram-top'] ?? '42')
    const aboutAlien = parsePercent(cssVars['--about-alien-top'] ?? '65')
    cssVars['--about-hologram-top'] = String(lerp(aboutHologram, WIDE_1920_1080.aboutHologramTop, tWide).toFixed(1))
    cssVars['--about-alien-top'] = String(lerp(aboutAlien, WIDE_1920_1080.aboutAlienTop, tWide).toFixed(1))
    if (debug) {
        console.log('[applyWideDesktopMix] --about-hologram-top', { baseParsed: aboutHologram, preset: WIDE_1920_1080.aboutHologramTop, tWide, output: cssVars['--about-hologram-top'] })
        console.log('[applyWideDesktopMix] --about-alien-top', { baseParsed: aboutAlien, preset: WIDE_1920_1080.aboutAlienTop, tWide, output: cssVars['--about-alien-top'] })
    }

    const handwriting = parsePercent(cssVars['--handwriting-svg-width'] ?? '100')
    const outHandwriting = String(Math.round(lerp(handwriting, WIDE_1920_1080.handwritingSvgWidth, tWide)))
    if (debug) console.log('[applyWideDesktopMix] --handwriting-svg-width', { baseParsed: handwriting, preset: WIDE_1920_1080.handwritingSvgWidth, tWide, output: outHandwriting })
    cssVars['--handwriting-svg-width'] = outHandwriting

    const presentationBase = PRESENTATION_MARGIN_TOP_VH_BASE
    const outPresentation = String(Math.round(lerp(presentationBase, WIDE_1920_1080.presentationMarginTopVh, tWide)))
    if (debug) console.log('[applyWideDesktopMix] --presentation-margin-top-vh', { baseParsed: presentationBase, preset: WIDE_1920_1080.presentationMarginTopVh, tWide, output: outPresentation })
    cssVars['--presentation-margin-top-vh'] = outPresentation

    const deltaMyname = parseVw(cssVars['--home-myname-font-size-delta-vw'] ?? '0vw')
    const deltaDesc = parseVw(cssVars['--home-description-font-size-delta-vw'] ?? '0vw')
    const outDeltaMyname = String(Math.round(lerp(deltaMyname, WIDE_1920_1080.homeMynameFontSizeDeltaVw, tWide)))
    const outDeltaDesc = String(Math.round(lerp(deltaDesc, WIDE_1920_1080.homeDescriptionFontSizeDeltaVw, tWide)))
    if (debug) {
        console.log('[applyWideDesktopMix] --home-myname-font-size-delta-vw', { baseParsed: deltaMyname, preset: WIDE_1920_1080.homeMynameFontSizeDeltaVw, tWide, output: outDeltaMyname })
        console.log('[applyWideDesktopMix] --home-description-font-size-delta-vw', { baseParsed: deltaDesc, preset: WIDE_1920_1080.homeDescriptionFontSizeDeltaVw, tWide, output: outDeltaDesc })
    }
    cssVars['--home-myname-font-size-delta-vw'] = outDeltaMyname
    cssVars['--home-description-font-size-delta-vw'] = outDeltaDesc

    const profileLeft = parsePercent(cssVars['--profile-text-left'] ?? '64%')
    const profileTop = parsePercent(cssVars['--profile-text-top'] ?? '41%')
    const profileWidth = parseVw(cssVars['--profile-text-width'] ?? '45vw')
    const outProfileLeft = String(Math.round(lerp(profileLeft, WIDE_1920_1080.profileTextLeft, tWide)))
    const outProfileTop = String(Math.round(lerp(profileTop, WIDE_1920_1080.profileTextTop, tWide)))
    const outProfileWidth = String(Math.round(lerp(profileWidth, WIDE_1920_1080.profileTextWidth, tWide)))
    cssVars['--profile-text-left'] = outProfileLeft
    cssVars['--profile-text-top'] = outProfileTop
    cssVars['--profile-text-width'] = outProfileWidth

    const expHabTop = parsePx(cssVars['--exp-hab-top-px'] ?? '', EXP_HAB_GOLDEN.topPx)
    const expHabW = parsePx(cssVars['--exp-hab-w-px'] ?? '', EXP_HAB_GOLDEN.wPx)
    cssVars['--exp-hab-top-px'] = String(Math.round(lerp(expHabTop, WIDE_1920_1080.expHabTopPx, tWide)))
    cssVars['--exp-hab-w-px'] = String(Math.round(lerp(expHabW, WIDE_1920_1080.expHabWPx, tWide)))

    const alien2Top = parsePercent(cssVars['--exp-alien2-top-percent'] ?? '59.5')
    cssVars['--exp-alien2-top-percent'] = String(lerp(alien2Top, WIDE_1920_1080.expAlien2TopPercent, tWide).toFixed(1))

    const alien2WidthPx = parsePx(cssVars['--exp-alien2-width-px'] ?? '', 98)
    cssVars['--exp-alien2-width-px'] = String(Math.round(lerp(alien2WidthPx, WIDE_1920_1080.expAlien2WidthPx, tWide)))

    const maskChemineBottom = parsePercent(cssVars['--mask-chemine-bottom'] ?? '18%')
    const maskChemineHeight = parsePercent(cssVars['--mask-chemine-height'] ?? '59%')
    cssVars['--mask-chemine-bottom'] = String(lerp(maskChemineBottom, WIDE_1920_1080.maskChemineBottom, tWide).toFixed(1))
    cssVars['--mask-chemine-height'] = String(lerp(maskChemineHeight, WIDE_1920_1080.maskChemineHeight, tWide).toFixed(1))
    if (tWide > 0.999) {
        cssVars['--mask-chemine-clip-raw'] = 'polygon(65% 28%, 179% 0, 100% 100%, 0% 100%, 0% 45.5%)'
    }

    const maskConvoyeurBottom = parsePercent(cssVars['--mask-convoyeur-bottom'] ?? '8.5%')
    const maskConvoyeurHeight = parsePercent(cssVars['--mask-convoyeur-height'] ?? '37%')
    cssVars['--mask-convoyeur-bottom'] = String(lerp(maskConvoyeurBottom, WIDE_1920_1080.maskConvoyeurBottom, tWide).toFixed(1))
    cssVars['--mask-convoyeur-height'] = String(Math.round(lerp(maskConvoyeurHeight, WIDE_1920_1080.maskConvoyeurHeight, tWide)))

    const convoyeurLeft = parsePx(cssVars['--convoyeur-left-px'] ?? '', CONVOYEUR_GOLDEN.leftPx)
    const convoyeurBottom = parsePx(cssVars['--convoyeur-bottom-px'] ?? '', CONVOYEUR_GOLDEN.bottomPx)
    const convoyeurW = parsePx(cssVars['--convoyeur-w-px'] ?? '', CONVOYEUR_GOLDEN.wPx)
    cssVars['--convoyeur-left-px'] = String(Math.round(lerp(convoyeurLeft, WIDE_1920_1080.convoyeurLeftPx, tWide)))
    cssVars['--convoyeur-bottom-px'] = String(Math.round(lerp(convoyeurBottom, WIDE_1920_1080.convoyeurBottomPx, tWide)))
    cssVars['--convoyeur-w-px'] = String(Math.round(lerp(convoyeurW, WIDE_1920_1080.convoyeurWPx, tWide)))

    const convoyeurHRaw = cssVars['--convoyeur-h'] ?? 'auto'
    if (tWide > 0) {
        const convoyeurHBase = convoyeurHRaw === 'auto' ? 0 : parsePercent(convoyeurHRaw)
        cssVars['--convoyeur-h'] = String(Math.round(lerp(convoyeurHBase, WIDE_1920_1080.convoyeurH, tWide)))
    }

    const convoyeurEndCorrection = parsePx(cssVars['--convoyeur-end-correction-x-px'] ?? '', CONVOYEUR_END_CORRECTION_GOLDEN)
    cssVars['--convoyeur-end-correction-x-px'] = String(Math.round(lerp(convoyeurEndCorrection, WIDE_1920_1080.convoyeurEndCorrectionXPx, tWide)))

    const robotAbove = parseFloat(cssVars['--robot-above-y-percent'] ?? '50') || 50
    const robotGround = parseFloat(cssVars['--robot-ground-y-percent'] ?? '61') || 61
    cssVars['--robot-above-y-percent'] = String(lerp(robotAbove, WIDE_1920_1080.robotAboveYPercent, tWide).toFixed(1))
    cssVars['--robot-ground-y-percent'] = String(lerp(robotGround, WIDE_1920_1080.robotGroundYPercent, tWide).toFixed(1))

    const contactLeft = parsePercent(cssVars['--contact-svg-left'] ?? '15')
    const contactTop = parsePercent(cssVars['--contact-svg-top'] ?? '36.5')
    const contactHeightVh = parseVh(cssVars['--contact-svg-height-vh'] ?? '63') || parseFloat(cssVars['--contact-svg-height-vh'] ?? '') || 63
    cssVars['--contact-svg-left'] = String(lerp(contactLeft, WIDE_1920_1080.contactSvgLeft, tWide).toFixed(1))
    cssVars['--contact-svg-top'] = String(lerp(contactTop, WIDE_1920_1080.contactSvgTop, tWide).toFixed(1))
    cssVars['--contact-svg-height-vh'] = String(Math.round(lerp(contactHeightVh, WIDE_1920_1080.contactSvgHeightVh, tWide)))

    const contactPrenomTop = parsePercent(cssVars['--contact-prenom-top'] ?? '6.8')
    const contactPrenomLeft = parsePercent(cssVars['--contact-prenom-left'] ?? '36')
    const contactPrenomWidth = parsePercent(cssVars['--contact-prenom-width'] ?? '13.5')
    const contactPrenomRotate = parseFloat(cssVars['--contact-prenom-rotate-deg'] ?? '11') || 11
    cssVars['--contact-prenom-top'] = String(lerp(contactPrenomTop, WIDE_1920_1080.contactPrenomTop, tWide).toFixed(1))
    cssVars['--contact-prenom-left'] = String(lerp(contactPrenomLeft, WIDE_1920_1080.contactPrenomLeft, tWide).toFixed(1))
    cssVars['--contact-prenom-width'] = String(lerp(contactPrenomWidth, WIDE_1920_1080.contactPrenomWidth, tWide).toFixed(1))
    cssVars['--contact-prenom-rotate-deg'] = String(lerp(contactPrenomRotate, WIDE_1920_1080.contactPrenomRotateDeg, tWide).toFixed(1))

    const contactSocieteTop = parsePercent(cssVars['--contact-societe-top'] ?? '22')
    const contactSocieteLeft = parsePercent(cssVars['--contact-societe-left'] ?? '24.5')
    const contactSocieteWidth = parsePercent(cssVars['--contact-societe-width'] ?? '16.5')
    const contactSocieteTxVw = parseVw(cssVars['--contact-societe-label-tx-vw'] ?? '-9.5')
    const contactSocieteTyVh = parseVh(cssVars['--contact-societe-label-ty-vh'] ?? '-1.5')
    cssVars['--contact-societe-top'] = String(lerp(contactSocieteTop, WIDE_1920_1080.contactSocieteTop, tWide).toFixed(1))
    cssVars['--contact-societe-left'] = String(lerp(contactSocieteLeft, WIDE_1920_1080.contactSocieteLeft, tWide).toFixed(1))
    cssVars['--contact-societe-width'] = String(lerp(contactSocieteWidth, WIDE_1920_1080.contactSocieteWidth, tWide).toFixed(1))
    cssVars['--contact-societe-label-tx-vw'] = String(lerp(contactSocieteTxVw, WIDE_1920_1080.contactSocieteLabelTxVw, tWide).toFixed(1))
    cssVars['--contact-societe-label-ty-vh'] = String(lerp(contactSocieteTyVh, WIDE_1920_1080.contactSocieteLabelTyVh, tWide).toFixed(1))
    cssVars['--contact-label-font-size-rem'] = String(lerp(parseFloat(cssVars['--contact-label-font-size-rem'] ?? '0.65') || 0.65, WIDE_1920_1080.contactLabelFontSizeRem, tWide).toFixed(2))

    const contactEmailTop = parsePercent(cssVars['--contact-email-top'] ?? '13.5')
    const contactEmailLeft = parsePercent(cssVars['--contact-email-left'] ?? '42')
    const contactEmailWidth = parsePercent(cssVars['--contact-email-width'] ?? '19')
    const contactEmailTxVh = parseVh(cssVars['--contact-email-label-tx-vh'] ?? '0')
    const contactEmailTyVh = parseVh(cssVars['--contact-email-label-ty-vh'] ?? '-5')
    cssVars['--contact-email-top'] = String(lerp(contactEmailTop, WIDE_1920_1080.contactEmailTop, tWide).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(contactEmailLeft, WIDE_1920_1080.contactEmailLeft, tWide).toFixed(1))
    cssVars['--contact-email-width'] = String(lerp(contactEmailWidth, WIDE_1920_1080.contactEmailWidth, tWide).toFixed(1))
    cssVars['--contact-email-label-tx-vh'] = String(lerp(contactEmailTxVh, WIDE_1920_1080.contactEmailLabelTxVh, tWide).toFixed(1))
    cssVars['--contact-email-label-ty-vh'] = String(lerp(contactEmailTyVh, WIDE_1920_1080.contactEmailLabelTyVh, tWide).toFixed(1))

    const contactMsgTop = parsePercent(cssVars['--contact-message-top'] ?? '37')
    const contactMsgMtVh = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '3.8')
    const contactMsgMlVw = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '2.5')
    const contactMsgWidth = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '80')
    const contactMsgTxVw = parseVw(cssVars['--contact-message-label-tx-vw'] ?? '-4')
    const contactMsgTyVh = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-18.5')
    cssVars['--contact-message-top'] = String(lerp(contactMsgTop, WIDE_1920_1080.contactMessageTop, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(contactMsgMtVh, WIDE_1920_1080.contactMessageTextareaFocusMtVh, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(contactMsgMlVw, WIDE_1920_1080.contactMessageTextareaFocusMlVw, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(contactMsgWidth, WIDE_1920_1080.contactMessageTextareaFocusWidth, tWide)))
    cssVars['--contact-message-label-tx-vw'] = String(lerp(contactMsgTxVw, WIDE_1920_1080.contactMessageLabelTxVw, tWide).toFixed(1))
    cssVars['--contact-message-label-ty-vh'] = String(lerp(contactMsgTyVh, WIDE_1920_1080.contactMessageLabelTyVh, tWide).toFixed(1))

    const contactSubmitTop = parsePercent(cssVars['--contact-submit-top'] ?? '41')
    const contactSubmitLeft = parsePercent(cssVars['--contact-submit-left'] ?? '50.5')
    const contactSubmitWidth = parsePercent(cssVars['--contact-submit-width'] ?? '13.5')
    const contactSubmitRotate = parseFloat(cssVars['--contact-submit-rotate-deg'] ?? '27') || 27
    const contactSubmitHeight = parsePercent(cssVars['--contact-submit-height'] ?? '4.5')
    cssVars['--contact-submit-top'] = String(lerp(contactSubmitTop, WIDE_1920_1080.contactSubmitTop, tWide).toFixed(1))
    cssVars['--contact-submit-left'] = String(lerp(contactSubmitLeft, WIDE_1920_1080.contactSubmitLeft, tWide).toFixed(1))
    cssVars['--contact-submit-width'] = String(lerp(contactSubmitWidth, WIDE_1920_1080.contactSubmitWidth, tWide).toFixed(1))
    cssVars['--contact-submit-rotate-deg'] = String(lerp(contactSubmitRotate, WIDE_1920_1080.contactSubmitRotateDeg, tWide).toFixed(1))
    cssVars['--contact-submit-height'] = String(lerp(contactSubmitHeight, WIDE_1920_1080.contactSubmitHeight, tWide).toFixed(1))

    if (debug) {
        console.log('[applyWideDesktopMix] tWide', tWide, 'wide tokens', {
            '--profile-text-left': cssVars['--profile-text-left'],
            '--profile-text-top': cssVars['--profile-text-top'],
            '--profile-text-width': cssVars['--profile-text-width'],
            '--exp-hab-top-px': cssVars['--exp-hab-top-px'],
            '--exp-hab-w-px': cssVars['--exp-hab-w-px'],
            '--exp-alien2-top-percent': cssVars['--exp-alien2-top-percent'],
            '--exp-alien2-width-px': cssVars['--exp-alien2-width-px'],
            '--contact-svg-left': cssVars['--contact-svg-left'],
            '--contact-svg-top': cssVars['--contact-svg-top'],
            '--contact-svg-height-vh': cssVars['--contact-svg-height-vh'],
            '--mask-chemine-bottom': cssVars['--mask-chemine-bottom'],
            '--mask-chemine-height': cssVars['--mask-chemine-height'],
            '--mask-convoyeur-bottom': cssVars['--mask-convoyeur-bottom'],
            '--mask-convoyeur-height': cssVars['--mask-convoyeur-height'],
            '--convoyeur-left-px': cssVars['--convoyeur-left-px'],
            '--convoyeur-bottom-px': cssVars['--convoyeur-bottom-px'],
            '--convoyeur-w-px': cssVars['--convoyeur-w-px'],
            '--convoyeur-h': cssVars['--convoyeur-h'],
            '--convoyeur-end-correction-x-px': cssVars['--convoyeur-end-correction-x-px'],
            '--robot-above-y-percent': cssVars['--robot-above-y-percent'],
            '--robot-ground-y-percent': cssVars['--robot-ground-y-percent'],
        })
    }
}

/** Valeurs golden 1348×768 (source de vérité) pour exp-hab. */
const EXP_HAB_GOLDEN = { topPx: 461, leftPx: 779, wPx: 1032, hPx: 500 }
/** Valeurs 1366×768 (nearGolden) pour exp-hab : width 1000px, top 423px. */
const EXP_HAB_NEAR_GOLDEN = { topPx: 423, leftPx: 779, wPx: 1000, hPx: 500 }

/** Hauteur (px) en dessous de laquelle on considère "short viewport" (ex: 1366×768). */
const SHORT_HEIGHT_MAX = 700
/** Aspect ratio au-dessus duquel on considère "ultra wide" (paysage mobile, laptop 1366×768). */
const ULTRA_WIDE_ASPECT_MIN = 1.8

/**
 * Scale clamp : évite scale trop faible (caméra/transforms illisibles) ou trop fort (débordement).
 * 0.3 = mobile très étroit ; 2 = grand écran sans zoom excessif.
 */
const SCALE_CLAMP_MIN = 0.3
const SCALE_CLAMP_MAX = 2

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/** Métriques viewport étendues (aspect calculé côté tokens pour éviter de modifier viewport.ts). */
export interface ViewportMetrics extends ViewportMetricsBase {
    aspect?: number
}

/** Entrée minimale pour computeResponsiveTokens (width/height requis, reste optionnel). */
export type ViewportMetricsInput = Pick<ViewportMetricsBase, 'width' | 'height'> & Partial<ViewportMetricsBase> & { aspect?: number }

export interface ResponsiveTokensFlags {
    is425: boolean
    is768: boolean
    is1050: boolean
    is1349: boolean
    is1500: boolean
    shortH: boolean
    ultraWide: boolean
}

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
    /** Hauteur de départ robot (head/hand) en % — pour usage direct en JS. */
    robotAboveYPercent: number
    /** Hauteur cible robot (sol) en % — pour usage direct en JS. */
    robotGroundYPercent: number
}

function getBreakpointName(w: number): BreakpointName {
    if (w <= BP_XS) return 'xs'
    if (w <= BP_SM) return 'sm'
    if (w <= BP_MD) return 'md'
    if (w <= BP_LG) return 'lg'
    if (w < BP_XL) return 'xl'
    return 'xxl'
}

/**
 * Calcule les variables CSS continues pour .experiences-habitation-container
 * à partir des valeurs actuelles en MQ (769–900, 901–1050, … 1500).
 */
function clamp01(n: number) {
    return Math.max(0, Math.min(1, n))
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
}
  
  function computeExpHabCssVars(w: number, h: number, aspect: number, shortH: boolean): Record<string, string> {
    // Ancres (reprennent ton design actuel)
    const small = { top: 46, left: 74, w: 97.5, h: 97.5, maxW: '97.5vw', maxH: '97.5vh' } // <=425
    const tablet = { top: 50, left: 70, w: 87, h: 65, maxW: '87vw', maxH: '65vh' }        // <=768
    const golden = { top: 60, left: 65, w: 87, h: 65, maxW: '87vw', maxH: '65vh' }       // 769–1348 (réf. 1348×768)
    const xl = { top: 46.8, left: 54.7, w: 59, h: 65, maxW: '59vw', maxH: '65vh' }       // >=1349
    const xxl = { top: 37.5, left: 54.7, w: 45, h: 65, maxW: '45vw', maxH: '65vh' }        // >=1500
  
    let topPct: number
    let leftPct: number
    let widthVw: number
    let heightVh: number
    let maxW: string
    let maxH: string
  
    if (w <= BP_SM) {
      ;({ top: topPct, left: leftPct, w: widthVw, h: heightVh, maxW, maxH } = small)
    } else if (w <= BP_MD) {
      const t = clamp01((w - BP_SM) / (BP_MD - BP_SM))
      topPct = lerp(small.top, tablet.top, t)
      leftPct = lerp(small.left, tablet.left, t)
      widthVw = lerp(small.w, tablet.w, t)
      heightVh = lerp(small.h, tablet.h, t)
      maxW = t < 0.5 ? small.maxW : tablet.maxW
      maxH = t < 0.5 ? small.maxH : tablet.maxH
    } else if (w <= GOLDEN_REF_WIDTH) {
      if (w <= 769) {
        ;({ top: topPct, left: leftPct, w: widthVw, h: heightVh, maxW, maxH } = tablet)
      } else {
        ;({ top: topPct, left: leftPct, w: widthVw, h: heightVh, maxW, maxH } = golden)
      }
    } else if (w < BP_XXL) {
      const tXl = clamp01((w - GOLDEN_REF_WIDTH) / (BP_XL - GOLDEN_REF_WIDTH))
      topPct = lerp(golden.top, xl.top, tXl)
      leftPct = lerp(golden.left, xl.left, tXl)
      widthVw = lerp(golden.w, xl.w, tXl)
      heightVh = golden.h
      maxW = tXl < 0.5 ? golden.maxW : xl.maxW
      maxH = golden.maxH
    } else {
      ;({ top: topPct, left: leftPct, w: widthVw, h: heightVh, maxW, maxH } = xxl)
    }
  
    // ✅ Ajustements hauteur (gros gain sur 1366x768)
    if (shortH) {
      topPct -= 6
      heightVh = Math.max(55, heightVh - 8)
      // optionnel: réduire un peu la largeur aussi pour éviter collisions
      widthVw = Math.max(40, widthVw - 3)
    }
  
    // ✅ Ajustement ultra-wide léger (évite que ça “parte” trop sur la gauche/droite)
    if (aspect >= ULTRA_WIDE_ASPECT_MIN) {
      leftPct -= 1.5
      widthVw = Math.max(40, widthVw - 2)
    }

    const topPx = (topPct / 100) * h
    const leftPx = (leftPct / 100) * w
    const widthPx = (widthVw / 100) * w
    const heightPx = (heightVh / 100) * h

    const isGolden = isGoldenViewport(w, h)
    const isNearGolden = isNearGoldenViewport(w, h)
    if (isGolden) {
        return {
            '--exp-hab-top-px': String(EXP_HAB_GOLDEN.topPx),
            '--exp-hab-left-px': String(EXP_HAB_GOLDEN.leftPx),
            '--exp-hab-w-px': String(EXP_HAB_GOLDEN.wPx),
            '--exp-hab-h-px': String(EXP_HAB_GOLDEN.hPx),
        }
    }
    if (isNearGolden) {
        return {
            '--exp-hab-top-px': String(EXP_HAB_NEAR_GOLDEN.topPx),
            '--exp-hab-left-px': String(EXP_HAB_NEAR_GOLDEN.leftPx),
            '--exp-hab-w-px': String(EXP_HAB_NEAR_GOLDEN.wPx),
            '--exp-hab-h-px': String(EXP_HAB_NEAR_GOLDEN.hPx),
        }
    }
    return {
        '--exp-hab-top-px': String(Math.round(topPx)),
        '--exp-hab-left-px': String(Math.round(leftPx)),
        '--exp-hab-w-px': String(Math.round(widthPx)),
        '--exp-hab-h-px': String(Math.round(heightPx)),
    }
  }

/** Golden 1348×768 : left=-700, bottom=188, width=1481 (px). */
const CONVOYEUR_GOLDEN = { leftPx: -700, bottomPx: 188, wPx: 1481 }
/** Correction X (px) en fin d’animation convoyeur : ajoutée au slideX final (négatif = tirer à gauche). */
/** Correction X (px) fin d'animation convoyeur : golden -36, 1366 -15, interpolation smoothstep entre 1348 et 1366. */
/** Valeur golden pour fallback JS (scrollAnimations) si token non lu. */
export const CONVOYEUR_END_CORRECTION_GOLDEN = -36
const CONVOYEUR_END_CORRECTION_NEAR_1366 = -15

/**
 * Convoyeur : px pour left/bottom/width (compensés par --camera-scale en CSS).
 * Golden 1348×768 = -700, 188, 1481. Hors golden : interpolation.
 */
/** Valeurs 1366×768 (nearGolden) pour convoyeur. */
const CONVOYEUR_NEAR_GOLDEN = { leftPx: -717, bottomPx: 248, wPx: 1443 }

/** --convoyeur-end-correction-x-px : -36 à 1348, -15 à 1366+, interpolation entre 1348 et 1366. */
function getConvoyeurEndCorrectionPx(w: number, h: number): number {
    if (w <= GOLDEN_REF_WIDTH) return CONVOYEUR_END_CORRECTION_GOLDEN
    if (w >= NEAR_GOLDEN_MAX_WIDTH) return CONVOYEUR_END_CORRECTION_NEAR_1366
    const t = getNearGoldenT(w)
    return Math.round(lerp(CONVOYEUR_END_CORRECTION_GOLDEN, CONVOYEUR_END_CORRECTION_NEAR_1366, t))
}

function computeConvoyeurCssVars(w: number, h: number): Record<string, string> {
    const isGolden = isGoldenViewport(w, h)
    const isNearGolden = isNearGoldenViewport(w, h)
    const endCorrectionPx = getConvoyeurEndCorrectionPx(w, h)
    if (isGolden) {
        return {
            '--convoyeur-left-px': String(CONVOYEUR_GOLDEN.leftPx),
            '--convoyeur-bottom-px': String(CONVOYEUR_GOLDEN.bottomPx),
            '--convoyeur-w-px': String(CONVOYEUR_GOLDEN.wPx),
            '--convoyeur-h': 'auto',
            '--convoyeur-end-correction-x-px': String(CONVOYEUR_END_CORRECTION_GOLDEN),
        }
    }
    if (isNearGolden) {
        return {
            '--convoyeur-left-px': String(CONVOYEUR_NEAR_GOLDEN.leftPx),
            '--convoyeur-bottom-px': String(CONVOYEUR_NEAR_GOLDEN.bottomPx),
            '--convoyeur-w-px': String(CONVOYEUR_NEAR_GOLDEN.wPx),
            '--convoyeur-h': 'auto',
            '--convoyeur-end-correction-x-px': String(endCorrectionPx),
        }
    }
    if (w >= BP_XXL) {
        const leftPx = (-66 / 100) * w
        const bottomPx = (46.5 / 100) * h
        const widthPx = 1.2 * w
        return {
            '--convoyeur-left-px': String(Math.round(leftPx)),
            '--convoyeur-bottom-px': String(Math.round(bottomPx)),
            '--convoyeur-w-px': String(Math.round(widthPx)),
            '--convoyeur-h': '19%',
            '--convoyeur-end-correction-x-px': String(CONVOYEUR_END_CORRECTION_NEAR_1366),
        }
    }
    const leftPct = -61
    const leftPx = (leftPct / 100) * w
    let bottomPct: number
    if (w <= GOLDEN_REF_WIDTH) {
        bottomPct = w <= BP_MD ? 22 : lerp(22, 18, clamp01((w - BP_MD) / (GOLDEN_REF_WIDTH - BP_MD)))
    } else {
        bottomPct = lerp(18, 46.5, clamp01((w - GOLDEN_REF_WIDTH) / (BP_XXL - GOLDEN_REF_WIDTH)))
    }
    const bottomPx = (bottomPct / 100) * h
    const widthPx = 1.2 * w
    return {
        '--convoyeur-left-px': String(Math.round(leftPx)),
        '--convoyeur-bottom-px': String(Math.round(bottomPx)),
        '--convoyeur-w-px': String(Math.round(widthPx)),
        '--convoyeur-h': 'auto',
        '--convoyeur-end-correction-x-px': String(endCorrectionPx),
    }
}

/** Masque cheminée (experiences-mask-chemine). Golden <=1349 : bottom 18%, height 59%, left 4%, clip polygon complet. 1366 : 20%, 57%, 5%. */
const MASK_CHEMINE_CLIP_GOLDEN = 'polygon(65% 24%, 179% 0, 100% 100%, 0% 100%, 0% 45.5%)'
function computeMaskChemineCssVars(w: number, h: number): Record<string, string> {
    const isNearGolden = isNearGoldenViewport(w, h)
    if (isNearGolden) {
        return {
            '--mask-chemine-left': '5%',
            '--mask-chemine-bottom': '20%',
            '--mask-chemine-height': '57%',
            '--mask-chemine-clip-raw': MASK_CHEMINE_CLIP_GOLDEN,
        }
    }
    if (w <= BP_XL) {
        return {
            '--mask-chemine-left': '4%',
            '--mask-chemine-bottom': '18%',
            '--mask-chemine-height': '59%',
            '--mask-chemine-clip-raw': MASK_CHEMINE_CLIP_GOLDEN,
        }
    }
    return {
        '--mask-chemine-left': '4%',
        '--mask-chemine-bottom': '35%',
        '--mask-chemine-height': '42%',
        '--mask-chemine-clip-raw': 'polygon(var(--cut) 25%, 100% 0, 100% 100%, 0 100%, 0 var(--cut))',
    }
}

/** Masque convoyeur (experiences-mask-convoyeur). Golden <=1349 : left 4.5%, width 93.5%, bottom 8.5%, height 37%. 1366 : 9.5%, 36%. */
function computeMaskConvoyeurCssVars(w: number, h: number): Record<string, string> {
    if (isNearGoldenViewport(w, h)) {
        return { '--mask-convoyeur-left': '4.5%', '--mask-convoyeur-width': '93.5%', '--mask-convoyeur-bottom': '9.5%', '--mask-convoyeur-height': '36%' }
    }
    if (w <= BP_XL) {
        return { '--mask-convoyeur-left': '4.5%', '--mask-convoyeur-width': '93.5%', '--mask-convoyeur-bottom': '8.5%', '--mask-convoyeur-height': '37%' }
    }
    if (w >= BP_XXL) {
        return { '--mask-convoyeur-left': '4.5%', '--mask-convoyeur-width': '93.5%', '--mask-convoyeur-bottom': '25.5%', '--mask-convoyeur-height': '22%' }
    }
    return { '--mask-convoyeur-left': '4.5%', '--mask-convoyeur-width': '93.5%', '--mask-convoyeur-bottom': '8.5%', '--mask-convoyeur-height': '37%' }
}

/** Ground line/overcoat : à 1348×768 = 67% / 68%. 1366×768 = 62% / 62.5%. */
function computeGroundCssVars(w: number, h: number): Record<string, string> {
    if (isNearGoldenViewport(w, h)) return { '--ground-line-top': '62%', '--ground-overcoat-top': '62.5%' }
    if (w < 425) return { '--ground-line-top': '70%', '--ground-overcoat-top': '60%' }
    if (w < 769) return { '--ground-line-top': '75%', '--ground-overcoat-top': '75%' }
    if (w <= GOLDEN_REF_WIDTH) return { '--ground-line-top': '67%', '--ground-overcoat-top': '68%' }
    return { '--ground-line-top': '53%', '--ground-overcoat-top': '53.5%' }
}

/** Fusée : à 1348 = left 10vw, top -60vh, 300px. 1366 = top -65vh. */
function computeRocketCssVars(w: number, h: number): Record<string, string> {
    const left = w <= BP_MD ? (w <= 480 ? '-15vw' : '-10vw') : '10vw'
    const top = isNearGoldenViewport(w, h) ? '-65vh' : '-60vh'
    return { '--rocket-left': left, '--rocket-top': top, '--rocket-width': '300px', '--rocket-height': '300px' }
}

/** About (alien + hologram + profile handwriting) : réf. 1348 ; paliers 425, 480, 768. */
function computeAboutCssVars(w: number): Record<string, string> {
    let alien: { left: string; top: string; width: string }
    if (w > BP_MD) {
        alien = { left: '10vw', top: w >= BP_XXL ? '55%' : '65%', width: '200px' }
    } else if (w > 480) {
        alien = { left: '5vw', top: '75%', width: '150px' }
    } else if (w > BP_SM) {
        alien = { left: '2vw', top: '75%', width: '120px' }
    } else {
        alien = { left: '5vw', top: '65%', width: '120px' }
    }
    let hologram: { left: string; top: string; width: string; transform: string }
    if (w <= BP_MD) {
        const top = w <= BP_SM ? '47%' : w <= 480 ? '57%' : '51%'
        const width = w <= 480 ? '132vw' : '108vw'
        hologram = { left: '50%', top, width, transform: 'translate(-50%, -50%)' }
    } else {
        hologram = { left: '11vw', top: w >= BP_XXL ? '36.5%' : '42%', width: 'auto', transform: 'translateY(-50%)' }
    }
    const profile = w <= BP_MD ? { left: '31%', top: '49%', width: '45vw', maxW: '38vw' } : { left: w >= BP_XXL ? '70.5%' : '64%', top: w >= BP_XXL ? '37%' : '41%', width: '45vw', maxW: 'none' }
    return {
        '--about-alien-left': alien.left,
        '--about-alien-top': alien.top,
        '--about-alien-width': alien.width,
        '--about-hologram-left': hologram.left,
        '--about-hologram-top': hologram.top,
        '--about-hologram-width': String(hologram.width),
        '--about-hologram-transform': hologram.transform,
        '--profile-text-left': profile.left,
        '--profile-text-top': profile.top,
        '--profile-text-width': profile.width,
        '--profile-text-max-width': profile.maxW === 'none' ? 'none' : profile.maxW,
    }
}

/** Quest titre + descrip : réf. 1348 = 5vh, 2vw, 50vw, 15vh / 16vh, 40vw, 25vh. */
function computeQuestTextCssVars(w: number): Record<string, string> {
    const titreTop = w <= BP_SM ? '1.5vh' : '5vh'
    const titreLeft = w <= BP_SM ? '1.5vw' : '2vw'
    const titreMaxW = w <= BP_XS ? '70vw' : w <= BP_SM ? '65vw' : w <= 480 ? '55vw' : w <= BP_MD ? '45vw' : '50vw'
    const descripTop = w <= BP_SM ? '10vh' : w >= BP_XXL ? '12vh' : '16vh'
    const descripMaxW = w <= BP_XS ? '70vw' : w <= BP_SM ? '65vw' : w <= 480 ? '65vw' : w <= BP_MD ? '55vw' : '40vw'
    return {
        '--quest-titre-top': titreTop,
        '--quest-titre-left': titreLeft,
        '--quest-titre-max-width': titreMaxW,
        '--quest-titre-max-height': '15vh',
        '--quest-descrip-top': descripTop,
        '--quest-descrip-max-width': descripMaxW,
        '--quest-descrip-max-height': '25vh',
    }
}

/** Alien2 : dans le stage (scalé) → tokens en px compensés + top en %. Golden 1348 : left -2vw ≈ -26.96px, top 59.5%. 1366 : left 1vw = 13.66px, top 54.5%. */
const EXP_ALIEN2_GOLDEN_LEFT_PX = -2 * (GOLDEN_REF_WIDTH / 100)
const EXP_ALIEN2_NEAR_1366_LEFT_PX = 1 * (NEAR_GOLDEN_MAX_WIDTH / 100)
const EXP_ALIEN2_GOLDEN_TOP_PERCENT = 59.5
const EXP_ALIEN2_NEAR_1366_TOP_PERCENT = 54.5

function computeExpAlien2CssVars(w: number, h: number): Record<string, string> {
    const inNearBand = w > GOLDEN_REF_WIDTH && w <= NEAR_GOLDEN_MAX_WIDTH && h >= 763 && h <= 773
    if (w <= GOLDEN_REF_WIDTH) {
        return {
            '--exp-alien2-left-px': String(Math.round(EXP_ALIEN2_GOLDEN_LEFT_PX * 100) / 100),
            '--exp-alien2-top-percent': String(EXP_ALIEN2_GOLDEN_TOP_PERCENT),
            '--exp-alien2-width-px': '98',
        }
    }
    if (inNearBand) {
        const t = getNearGoldenT(w)
        const leftPx = lerp(EXP_ALIEN2_GOLDEN_LEFT_PX, EXP_ALIEN2_NEAR_1366_LEFT_PX, t)
        const topPercent = lerp(EXP_ALIEN2_GOLDEN_TOP_PERCENT, EXP_ALIEN2_NEAR_1366_TOP_PERCENT, t)
        return {
            '--exp-alien2-left-px': String(Math.round(leftPx * 100) / 100),
            '--exp-alien2-top-percent': String(Math.round(topPercent * 10) / 10),
            '--exp-alien2-width-px': '98',
        }
    }
    if (w >= BP_XXL) {
        const leftPx = w / 100
        return { '--exp-alien2-left-px': String(Math.round(leftPx * 100) / 100), '--exp-alien2-top-percent': '46.8', '--exp-alien2-width-px': '96' }
    }
    const leftPx = -2 * (w / 100)
    return { '--exp-alien2-left-px': String(Math.round(leftPx * 100) / 100), '--exp-alien2-top-percent': String(EXP_ALIEN2_GOLDEN_TOP_PERCENT), '--exp-alien2-width-px': '98' }
}

/** Constantes alignées avec constants.ts pour robot Y (éviter import circulaire). */
const ROBOT_GROUND_DEFAULT = 61
const ROBOT_BP_PX = 1500
const ROBOT_Y_OFFSET_LARGE = -11.5
const ROBOT_REF_HEIGHT = 768

/** Hauteur de départ (start Y) du robot head/hand en % — réglage fixe. */
const ROBOT_ABOVE_Y_PERCENT = 50

/** Robot : ground golden 61, near 1366 = 56 (interpolation smoothstep entre 1348 et 1366). Above 1366 = 45. */
const ROBOT_GROUND_GOLDEN = 61
const ROBOT_GROUND_NEAR_1366 = 56
function computeRobotCssVars(w: number, h: number): Record<string, string> {
    const offset = w > ROBOT_BP_PX ? ROBOT_Y_OFFSET_LARGE : 0
    const heightFactor = Math.max(0.7, Math.min(1.4, h / ROBOT_REF_HEIGHT))
    const groundComputed = ROBOT_GROUND_DEFAULT + offset * heightFactor
    const t = getNearGoldenT(w)
    const inNearBand = w > GOLDEN_REF_WIDTH && w <= NEAR_GOLDEN_MAX_WIDTH && h >= 763 && h <= 773
    const ground = inNearBand ? Math.round(lerp(ROBOT_GROUND_GOLDEN, ROBOT_GROUND_NEAR_1366, t)) : (w <= GOLDEN_REF_WIDTH ? ROBOT_GROUND_GOLDEN : groundComputed)
    const above = isNearGoldenViewport(w, h) ? 45 : ROBOT_ABOVE_Y_PERCENT
    return {
        '--robot-max-width': '16vw',
        '--robot-max-height': '25vh',
        '--robot-above-y-percent': String(above),
        '--robot-ground-y-percent': String(ground),
        '--projets-text-top': '5vh',
        '--projets-text-right': '10vw',
        '--projets-text-max-width': '40vw',
    }
}

/** Typo home : base (vw numériques) + delta pour #myName et .descriptionContainer. Golden/nearGolden : base 7 / 3.5, delta -1 en nearGolden. */
const TYPO_MYNAME_BASE_VW = 7
const TYPO_DESCRIPTION_BASE_VW = 3.5

function computeTypographyCssVars(w: number, h: number): Record<string, string> {
    const deltaNum = isNearGoldenViewport(w, h) ? -1 : 0
    return {
        '--home-myname-font-size-base-vw': String(TYPO_MYNAME_BASE_VW),
        '--home-description-font-size-base-vw': String(TYPO_DESCRIPTION_BASE_VW),
        '--home-myname-font-size-delta-vw': String(deltaNum),
        '--home-description-font-size-delta-vw': String(deltaNum),
    }
}

/** Handwriting SVG (globals) : 100% base, 83% à 1500+. */
function computeHandwritingSvgCssVars(w: number): Record<string, string> {
    return { '--handwriting-svg-width': w >= BP_XXL ? '83%' : '100%' }
}

/** Contact form : réf. golden 1348×768 (valeurs numériques pour tokens). Pas de variation golden/nearGolden. */
function computeContactFormCssVars(): Record<string, string> {
    return {
        '--contact-prenom-top': '6.8',
        '--contact-prenom-left': '36',
        '--contact-prenom-width': '13.5',
        '--contact-prenom-rotate-deg': '11',
        '--contact-societe-top': '22',
        '--contact-societe-left': '24.5',
        '--contact-societe-width': '16.5',
        '--contact-societe-label-tx-vw': '-9.5',
        '--contact-societe-label-ty-vh': '-1.5',
        '--contact-label-font-size-rem': '0.65',
        '--contact-email-top': '13.5',
        '--contact-email-left': '42',
        '--contact-email-width': '19',
        '--contact-email-label-tx-vh': '0',
        '--contact-email-label-ty-vh': '-5',
        '--contact-message-top': '37',
        '--contact-message-textarea-focus-mt-vh': '3.8',
        '--contact-message-textarea-focus-ml-vw': '2.5',
        '--contact-message-textarea-focus-width': '80',
        '--contact-message-label-tx-vw': '-4',
        '--contact-message-label-ty-vh': '-18.5',
        '--contact-submit-top': '41',
        '--contact-submit-left': '50.5',
        '--contact-submit-width': '13.5',
        '--contact-submit-rotate-deg': '27',
        '--contact-submit-height': '4.5',
    }
}

/** Contact support-contact : réf. 1348 = 15%, 36.5%, 63vh ; xxl = 16%, 29%, 50vh. Numériques pour left/top/height-vh (CSS : *1%, *1vh). */
function computeContactCssVars(w: number): Record<string, string> {
    if (w >= BP_XXL) {
        return {
            '--contact-svg-left': '16',
            '--contact-svg-top': '29',
            '--contact-svg-height-vh': '50',
            '--contact-svg-height': '50vh',
            '--contact-svg-max-width': '85vw',
            '--contact-svg-min-width': '60vw',
        }
    }
    return {
        '--contact-svg-left': '15',
        '--contact-svg-top': '36.5',
        '--contact-svg-height-vh': '63',
        '--contact-svg-height': '63vh',
        '--contact-svg-max-width': '85vw',
        '--contact-svg-min-width': '60vw',
    }
}

/**
 * Calcule tous les tokens responsive à partir des métriques viewport.
 * Utilise getViewportMetrics(container) comme source de vérité.
 */
export function computeResponsiveTokens(metrics: ViewportMetricsInput): ResponsiveTokens {
    const w = metrics.width
    const h = metrics.height
    const aspect = metrics.aspect ?? (h > 0 ? w / h : 16 / 9)
    const shortH = h <= SHORT_HEIGHT_MAX
    const ultraWide = aspect >= ULTRA_WIDE_ASPECT_MIN

    const scale = w > 0 ? w / VIEWPORT_REFERENCE_WIDTH : 1
    const scaleClamped = Math.max(SCALE_CLAMP_MIN, Math.min(SCALE_CLAMP_MAX, scale))

    const bp = getBreakpointName(w)
    const flags: ResponsiveTokensFlags = {
        is425: w <= GROUND_LINE_425_MAX_WIDTH,
        is768: w <= TABLET_MAX_WIDTH,
        is1050: w <= VIEWPORT_REFERENCE_WIDTH,
        is1349: w >= BP_XL,
        is1500: w >= LARGE_DESKTOP_MIN_WIDTH,
        shortH,
        ultraWide,
    }

    const expHab = computeExpHabCssVars(w, h, aspect, shortH)
    const convoyeur = computeConvoyeurCssVars(w, h)
    const maskConvoyeur = computeMaskConvoyeurCssVars(w, h)
    const maskChemine = computeMaskChemineCssVars(w, h)
    const ground = computeGroundCssVars(w, h)
    const rocket = computeRocketCssVars(w, h)
    const typography = computeTypographyCssVars(w, h)
    const about = computeAboutCssVars(w)
    const quest = computeQuestTextCssVars(w)
    const robot = computeRobotCssVars(w, h)
    const expAlien2 = computeExpAlien2CssVars(w, h)
    const contact = computeContactCssVars(w)
    const contactForm = computeContactFormCssVars()
    const handwritingSvg = computeHandwritingSvgCssVars(w)

    const cssVars: Record<string, string> = {
        '--vw': `${w}px`,
        '--vh': `${h}px`,
        '--ar': String(aspect.toFixed(4)),
        '--scale': String(scale.toFixed(4)),
        '--scale-clamped': String(scaleClamped.toFixed(4)),
        ...expHab,
        ...convoyeur,
        ...maskConvoyeur,
        ...maskChemine,
        ...ground,
        ...rocket,
        ...typography,
        ...about,
        ...quest,
        ...robot,
        ...expAlien2,
        ...contact,
        ...contactForm,
        ...handwritingSvg,
    }
    applyWideDesktopMix(cssVars, w, h)

    const robotAboveYPercent = parseFloat(cssVars['--robot-above-y-percent']) || 50
    const robotGroundYPercent = parseFloat(cssVars['--robot-ground-y-percent']) || 61

    return {
        bp,
        w,
        h,
        aspect,
        shortH,
        scale,
        scaleClamped,
        flags,
        cssVars,
        robotAboveYPercent,
        robotGroundYPercent,
    }
}

/** Active l’overlay debug des tokens (désactivé en prod). */
const DEBUG_RESPONSIVE_TOKENS = false

/**
 * Applique les tokens sur le stage : CSS variables + data-attributes (dev).
 * Si DEBUG_RESPONSIVE_TOKENS, crée/met à jour un overlay optionnel (vw, vh, scale, t nearGolden, robot, alien2).
 */
const MASK_TOKEN_PREFIXES = ['--mask-chemine-', '--mask-convoyeur-']
const UI_TOKEN_PREFIXES = ['--mask-chemine-', '--mask-convoyeur-', '--contact-svg-', '--contact-prenom-', '--contact-societe-', '--contact-email-', '--contact-message-', '--contact-submit-', '--contact-label-']

export function applyResponsiveTokens(stage: HTMLElement, tokens: ResponsiveTokens): void {
    Object.entries(tokens.cssVars).forEach(([key, value]) => {
        stage.style.setProperty(key, value)
    })
    if (typeof document !== 'undefined' && document.body) {
        Object.entries(tokens.cssVars).forEach(([key, value]) => {
            if (UI_TOKEN_PREFIXES.some(prefix => key.startsWith(prefix))) {
                document.body.style.setProperty(key, value)
            }
        })
    }
    stage.dataset.bp = tokens.bp
    stage.dataset.short = tokens.shortH ? '1' : '0'
    stage.dataset.ar = tokens.aspect.toFixed(2)
    stage.dataset.scale = tokens.scaleClamped.toFixed(2)

    if (DEBUG_RESPONSIVE_TOKENS && typeof document !== 'undefined') {
        const t = getNearGoldenT(tokens.w)
        const alien2Left = tokens.cssVars['--exp-alien2-left-px'] ?? '—'
        const alien2Top = tokens.cssVars['--exp-alien2-top-percent'] ?? '—'
        const lines = [
            `vw: ${tokens.w}  vh: ${tokens.h}  scale: ${tokens.scaleClamped.toFixed(3)}`,
            `t nearGolden: ${t.toFixed(3)}`,
            `robotGroundYPercent: ${tokens.robotGroundYPercent}  robotAboveYPercent: ${tokens.robotAboveYPercent}`,
            `alien2LeftPx: ${alien2Left}  alien2TopPercent: ${alien2Top}`,
        ]
        let el = document.getElementById('responsive-tokens-debug')
        if (!el) {
            el = document.createElement('div')
            el.id = 'responsive-tokens-debug'
            Object.assign(el.style, {
                position: 'fixed',
                bottom: '8px',
                left: '8px',
                zIndex: 99999,
                fontSize: '11px',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.85)',
                color: '#0f0',
                padding: '6px 8px',
                borderRadius: '4px',
                pointerEvents: 'none',
                whiteSpace: 'pre',
            })
            document.body.appendChild(el)
        }
        el.textContent = lines.join('\n')
    }

    const debugClip = typeof window !== 'undefined' && (window as Window & { __TOKENS_DEBUG_CLIP__?: boolean }).__TOKENS_DEBUG_CLIP__
    if (debugClip && typeof document !== 'undefined') {
        requestAnimationFrame(() => {
            const targetSelector = '.experiences-mask-chemine'
            const maskEl = stage.querySelector?.(targetSelector) as HTMLElement | null
            const maskElGlobal = document.querySelector?.(targetSelector) as HTMLElement | null
            const onStage = maskEl ? stage.contains(maskEl) : false
            const clipRawMask = maskElGlobal ? getComputedStyle(maskElGlobal).getPropertyValue('--mask-chemine-clip-raw').trim() : '(no mask el)'
            const clipRawStage = getComputedStyle(stage).getPropertyValue('--mask-chemine-clip-raw').trim()
            const clipRawBody = document.body ? getComputedStyle(document.body).getPropertyValue('--mask-chemine-clip-raw').trim() : '(no body)'
            const clipRawRoot = getComputedStyle(document.documentElement).getPropertyValue('--mask-chemine-clip-raw').trim()
            const computedClipPath = maskElGlobal ? getComputedStyle(maskElGlobal).getPropertyValue('clip-path') : '(no mask el)'
            const whereVarsApplied = 'stage=' + (stage.className || stage.tagName) + (document.body?.style.getPropertyValue('--mask-chemine-clip-raw') ? ' +body' : '')
            const inheritanceBroken = !maskElGlobal ? 'mask not in DOM' : !onStage && maskElGlobal ? 'mask NOT inside stage (portal/wrong tree?)' : 'mask inside stage'
            console.log('[mask-chemine-clip-raw] PHASE1 scope report', {
                targetEl: targetSelector,
                whereVarsApplied,
                inheritanceWhy: inheritanceBroken,
                maskInsideStage: onStage,
                '--mask-chemine-clip-raw on target': clipRawMask || '(empty)',
                '--mask-chemine-clip-raw on stage': clipRawStage || '(empty)',
                '--mask-chemine-clip-raw on body': clipRawBody || '(empty)',
                '--mask-chemine-clip-raw on :root': clipRawRoot || '(empty)',
                'computed clip-path': computedClipPath || '(empty)',
                tokenInCssVars: '--mask-chemine-clip-raw' in tokens.cssVars,
                tokenValue: tokens.cssVars['--mask-chemine-clip-raw'] ?? '(absent)',
            })
        })
    }
}
