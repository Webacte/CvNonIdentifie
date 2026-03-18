/**
 * Couche Responsive Tokens : source unique = getResponsiveViewport(metrics) pour presets et --vw/--vh.
 * Exposée en CSS variables sur le stage et réutilisable en JS pour aligner breakpoints CSS/JS.
 * Référence : VIEWPORT_REFERENCE_WIDTH = 1050 ; breakpoints 320, 425, 768, 1050, 1349, 1500.
 */

import type { ViewportMetrics as ViewportMetricsBase } from '@/animations/viewport'
import {
    VIEWPORT_REFERENCE_WIDTH,
    GROUND_LINE_425_MAX_WIDTH,
    MOBILE_MAX_WIDTH,
    MOBILE_SMALL_MAX_WIDTH,
    TABLET_MAX_WIDTH,
    LARGE_DESKTOP_MIN_WIDTH,
    ROCKET_END_Y_PERCENTAGE,
    ROCKET_END_Y_PERCENTAGE_425,
    ROCKET_END_Y_PERCENTAGE_MOBILE_SMALL,
    ROCKET_END_Y_PERCENTAGE_MOBILE,
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
/** Hauteur minimale pour considérer "full wide" quand la largeur est déjà 1920 (évite que le preset WIDE soit ignoré quand le container a une hauteur < 768, ex. barre d’adresse). */
/** Facteur wideDesktop : 0 sous 1500×768, 1 à 1920×1080. fw*fh. Appels avec viewport officiel. */
export function getTWide(w: number, h: number): number {
    if (w < WIDE_WIDTH_MIN) return 0
    if (h < WIDE_HEIGHT_MIN) return 0
    const fw = smoothstep((w - WIDE_WIDTH_MIN) / (WIDE_WIDTH_MAX - WIDE_WIDTH_MIN))
    const fh = smoothstep((h - WIDE_HEIGHT_MIN) / (WIDE_HEIGHT_MAX - WIDE_HEIGHT_MIN))
    return fw * fh
}

/** Facteur shortWide : 1920×944 vs 1920×1080. tShortWide=0 quand h>=1080, 1 quand h<=944. Interpolation smooth entre. N'affecte que w>=1850. */
const SHORT_WIDE_WIDTH_MIN = 1850
const SHORT_WIDE_HEIGHT_MIN = 944
const SHORT_WIDE_HEIGHT_MAX = 1080
export function getTShortWide(w: number, h: number): number {
    if (w < SHORT_WIDE_WIDTH_MIN) return 0
    if (h >= SHORT_WIDE_HEIGHT_MAX) return 0
    if (h <= SHORT_WIDE_HEIGHT_MIN) return 1
    return 1 - smoothstep((h - SHORT_WIDE_HEIGHT_MIN) / (SHORT_WIDE_HEIGHT_MAX - SHORT_WIDE_HEIGHT_MIN))
}

/** Seuils midDesktop : 1536×864. tMid = 0 sur 1348/1366×768, → 1 à 1536×864. */
const MID_WIDTH_MIN = 1366
const MID_WIDTH_MAX = 1536
const MID_HEIGHT_MIN = 768
const MID_HEIGHT_MAX = 864

/** Facteur d'interpolation midDesktop : fwMid * fhMid pour 1366→1536 et 768→864. */
export function getTMid(w: number, h: number): number {
    if (w <= MID_WIDTH_MIN || h < MID_HEIGHT_MIN) return 0
    const fwMid = smoothstep((w - MID_WIDTH_MIN) / (MID_WIDTH_MAX - MID_WIDTH_MIN))
    const fhMid = smoothstep((h - MID_HEIGHT_MIN) / (MID_HEIGHT_MAX - MID_HEIGHT_MIN))
    return fwMid * fhMid
}

/** Facteur 1440×900 : bump centré sur (1440, 900), 0 ailleurs. Bande largeur 1380–1500, hauteur 860–940. N'affecte pas 1366×768, 1536×864, 1920×*. */
const CALIBRATION_1440_WIDTH_MIN = 1380
const CALIBRATION_1440_WIDTH_PEAK = 1440
const CALIBRATION_1440_WIDTH_MAX = 1500
const CALIBRATION_900_HEIGHT_MIN = 860
const CALIBRATION_900_HEIGHT_PEAK = 900
const CALIBRATION_900_HEIGHT_MAX = 940
export function getT1440x900(w: number, h: number): number {
    if (w < CALIBRATION_1440_WIDTH_MIN || w > CALIBRATION_1440_WIDTH_MAX) return 0
    if (h < CALIBRATION_900_HEIGHT_MIN || h > CALIBRATION_900_HEIGHT_MAX) return 0
    const fw = smoothstep((w - CALIBRATION_1440_WIDTH_MIN) / (CALIBRATION_1440_WIDTH_PEAK - CALIBRATION_1440_WIDTH_MIN)) *
        (1 - smoothstep((w - CALIBRATION_1440_WIDTH_PEAK) / (CALIBRATION_1440_WIDTH_MAX - CALIBRATION_1440_WIDTH_PEAK)))
    const fh = smoothstep((h - CALIBRATION_900_HEIGHT_MIN) / (CALIBRATION_900_HEIGHT_PEAK - CALIBRATION_900_HEIGHT_MIN)) *
        (1 - smoothstep((h - CALIBRATION_900_HEIGHT_PEAK) / (CALIBRATION_900_HEIGHT_MAX - CALIBRATION_900_HEIGHT_PEAK)))
    return fw * fh
}

/** Calibration 1440×900 : point intermédiaire (largeur entre 1366 et 1536, hauteur 900). */
const CALIBRATION_1440_900 = {
    homeMynameFontSizeBaseVw: 6,
    homeDescriptionFontSizeBaseVw: 2.5,
    presentationMarginTopVh: -24,
    aboutAlienTop: 55,
    aboutHologramTop: 36,
    profileTextLeft: 64.5,
    profileTextTop: 37,
    profileTextWidth: 42,
    questTitreTopVh: 1,
    questDescripTopVh: 8,
    /** Experience / habitation */
    expHabTopPx: 458,
    expHabWPx: 1032,
    /** Alien 2 (exp) */
    expAlien2LeftPx: 10,
    expAlien2TopPercent: 46.8,
    /** Masque cheminée */
    maskChemineClipRaw: 'polygon(100% 6%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
    maskChemineBottom: 30.8,
    /** Masque convoyeur */
    maskConvoyeurBottom: 14.5,
    maskConvoyeurHeight: 31,
    /** Convoyeur */
    convoyeurBottomPx: 576,
    convoyeurWPx: 1762,
    convoyeurH: 20.3,
    /** Robot */
    robotAboveYPercent: 27.6,
    robotGroundYPercent: 46.8,
    /** Contact / SVG */
    contactSvgTop: 29,
    contactSvgHeightVh: 50,
    /** Contact / nom */
    contactNomTop: 2.5,
    contactNomLabelTyVh: -5.4,
    contactNomWidth: 12.5,
    /** Contact / prénom */
    contactPrenomTop: 5.2,
    contactPrenomLeft: 34.3,
    contactPrenomInputMtEm: 0.2,
    contactPrenomLabelTyVh: -2.1,
    /** Contact / société */
    contactSocieteTop: 16.9,
    contactSocieteLeft: 24,
    contactSocieteWidth: 15,
    /** Contact / email */
    contactEmailTop: 10.1,
    contactEmailLeft: 40.4,
    /** Contact / message */
    contactMessageTop: 28.8,
    contactMessageTextareaFocusMtVh: 0.5,
    contactMessageTextareaFocusMlVw: -0.2,
    contactMessageTextareaFocusWidth: 92,
    contactMessageLabelTop: 56.8,
    contactMessageLabelLeft: 0,
    contactMessageLabelTxVw: -5,
    contactMessageLabelTyVh: -14.1,
    contactMessageTextareaHeightEm: 11.8,
} as const

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
    contactNomTop: 3.2,
    contactNomLabelTyVh: -4.2,
    contactPrenomTop: 5.5,
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
    contactEmailLabelXVh: 3,
    contactEmailLabelTyVh: -4,
    contactMessageTop: 25.1,
    contactMessageTextareaFocusMtVh: 0.4,
    contactMessageTextareaFocusMlVw: 0.3,
    contactMessageTextareaFocusWidth: 93,
    contactMessageLabelTop: 55,
    contactMessageLabelLeft: 0,
    contactMessageLabelTxVw: -4,
    contactMessageLabelTyVh: -11,
    contactSubmitTop: 28,
    contactSubmitLeft: 48.5,
    contactSubmitWidth: 12.5,
    contactSubmitRotateDeg: 27,
    contactSubmitHeight: 3,
    maskChemineBottom: 16.8,
    maskChemineHeight: 68,
    /** Clip-path cheminée cible à 1920×1080 (valeur DevTools pour cette résolution). */
    maskChemineClipRaw: 'polygon(65% 29%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
    maskConvoyeurBottom: 12.5,
    maskConvoyeurHeight: 33,
    convoyeurLeftPx: -1203,
    convoyeurBottomPx: 1075,
    convoyeurWPx: 2200,
    convoyeurH: 16,
    convoyeurEndCorrectionXPx: -4,
    robotAboveYPercent: 33.5,
    robotGroundYPercent: 40.5,
    /** Delta X (vw) en fin de course robot-hand sur wide 1920×1080 — 0 = fin à 14vw (aligné tête), pas de saut. */
    robotHandEndXDeltaVw: 1.1,
    rocketPhase1EndYRatio: 0.8,
} as const

/** Preset 1920×944 (shortWide) : adaptation liée à la hauteur, largeur 1920 inchangée. */
const WIDE_1920_944 = {
    presentationMarginTopVh: -26,
    homeMynameFontSizeBaseVw: 6,
    homeDescriptionFontSizeBaseVw: 3,
    profileTextLeft: 80,
    handwritingSvgWidth: 65,
    expAlien2TopPercent: 43,
    expHabTopPx: 597,
    maskChemineBottom: 22.8,
    maskChemineClipRaw: 'polygon(100% 13%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
    maskConvoyeurBottom: 11,
    maskConvoyeurHeight: 35,
    convoyeurLeftPx: -1430,
    convoyeurBottomPx: 886,
    convoyeurWPx: 2475,
    convoyeurH: 17,
    convoyeurEndCorrectionXPx: 46,
    robotAboveYPercent: 35.2,
    robotGroundYPercent: 43,
    projetsTextTopVh: 9,
    portraitImageTopVh: 8,
    questDescripTopVh: 16,
    questTitreTopVh: 8,
    robotHandEndXDeltaVw: 1.1,
    contactSvgTop: 28.6,
    contactSvgHeightVh: 40,
    contactPrenomMinWidthPx: 100,
    contactPrenomLabelTyVh: -1.5,
    contactPrenomInputMtEm: 0.3,
    contactNomTop: 6.5,
    contactNomLeft: 16.8,
    contactNomWidth: 10.8,
    contactPrenomWidth: 10.5,
    contactPrenomTop: 9,
    contactPrenomLeft: 32.5,
    contactSocieteTop: 18.3,
    contactSocieteLeft: 23.3,
    contactSocieteWidth: 13,
    contactSocieteLabelTxVw: -5.7,
    contactEmailTop: 13.1,
    contactEmailLeft: 37.1,
    contactEmailWidth: 15,
    contactSubmitTop: 31.1,
    contactSubmitLeft: 43.7,
    contactSubmitWidth: 11,
    contactMessageTop: 28,
    contactMessageTextareaFocusMtVh: 0.5,
    contactMessageTextareaFocusMlVw: 0,
    contactMessageTextareaFocusWidth: 80,
    contactMessageTextareaHeightEm: 10,
    contactMessageLabelTop: 50.9,
    contactMessageLabelLeft: -8,
    contactMessageLabelTxVw: -3,
    contactMessageLabelTyVh: -10,
    contactArcScrollLeftPx: -38.5,
    contactArcScrollTopPx: -5,
    contactArcScrollHeightPercent: 75,
    /** Position finale fusée atterrie à 1920×944 (translate3d). 1920×1080 = fallback dans scrollAnimations (4508, 927.24). */
    rocketLandedXPx: 4585,
    rocketLandedYPx: 816.24,
} as const

/** Preset 1536×864 (midDesktop). Valeurs cibles exactes à cette résolution ; interpolation douce 1366×768 → 1536×864 → 1920×1080. */
const MID_1536_864 = {
    homeMynameFontSizeDeltaVw: -1,
    homeDescriptionFontSizeDeltaVw: -1,
    presentationMarginTopVh: -24,
    expHabTopPx: 465,
    expHabWPx: 1050,
    expAlien2TopPercent: 47.2,
    expAlien2WidthPx: 87,
    convoyeurLeftPx: -1030,
    convoyeurBottomPx: 587,
    convoyeurWPx: 1900,
    convoyeurH: 20.5,
    convoyeurEndCorrectionXPx: 0,
    maskConvoyeurBottom: 12,
    maskConvoyeurHeight: 33,
    maskChemineBottom: 31,
    maskChemineHeight: 42.1,
    maskChemineClipRaw: 'polygon(100% 4%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
    robotAboveYPercent: 39.0,
    robotGroundYPercent: 48.0,
    rocketPhase1EndYRatio: 0.75,
    contactPrenomTop: 6.2,
    contactPrenomLeft: 34.5,
    contactPrenomWidth: 12.5,
    contactPrenomRotateDeg: 10,
    contactSocieteTop: 16.8,
    contactSocieteLeft: 24.5,
    contactSocieteWidth: 14.7,
    contactEmailTop: 10,
    contactEmailLeft: 40.5,
    contactEmailWidth: 17,
    contactSubmitTop: 32.2,
    contactSubmitLeft: 47.5,
    contactSubmitWidth: 12.5,
    contactNomTop: 2.4,
    contactNomLeft: 16.8,
    contactNomWidth: 12.5,
    contactNomMinWidthPx: 100,
    contactNomRotateDeg: -5,
    contactMessageTop: 29,
    contactMessageLabelTop: 72,
    contactMessageTextareaFocusMtVh: 0,
    contactMessageTextareaFocusMlVw: 0.2,
    contactMessageTextareaFocusWidth: 95,
    contactMessageLabelTyVh: -17.5,
    contactNomLabelTyVh: -4.8,
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

/** Applique le mix midDesktop (1536×864). w/h = viewport officiel (getResponsiveViewport). */
function applyMidDesktopMix(
    cssVars: Record<string, string>,
    w: number,
    h: number
): void {
    const tMid = getTMid(w, h)
    if (tMid === 0) return

    const deltaMyname = parseVw(cssVars['--home-myname-font-size-delta-vw'] ?? '0vw')
    const deltaDesc = parseVw(cssVars['--home-description-font-size-delta-vw'] ?? '0vw')
    cssVars['--home-myname-font-size-delta-vw'] = String(Math.round(lerp(deltaMyname, MID_1536_864.homeMynameFontSizeDeltaVw, tMid)))
    cssVars['--home-description-font-size-delta-vw'] = String(Math.round(lerp(deltaDesc, MID_1536_864.homeDescriptionFontSizeDeltaVw, tMid)))

    const presentation = parseFloat(cssVars['--presentation-margin-top-vh'] ?? String(PRESENTATION_MARGIN_TOP_VH_BASE)) || PRESENTATION_MARGIN_TOP_VH_BASE
    cssVars['--presentation-margin-top-vh'] = String(Math.round(lerp(presentation, MID_1536_864.presentationMarginTopVh, tMid)))

    const expHabTop = parsePx(cssVars['--exp-hab-top-px'] ?? '', EXP_HAB_GOLDEN.topPx)
    const expHabW = parsePx(cssVars['--exp-hab-w-px'] ?? '', EXP_HAB_GOLDEN.wPx)
    cssVars['--exp-hab-top-px'] = String(Math.round(lerp(expHabTop, MID_1536_864.expHabTopPx, tMid)))
    cssVars['--exp-hab-w-px'] = String(Math.round(lerp(expHabW, MID_1536_864.expHabWPx, tMid)))

    const convoyeurLeft = parsePx(cssVars['--convoyeur-left-px'] ?? '', CONVOYEUR_GOLDEN.leftPx)
    const convoyeurBottom = parsePx(cssVars['--convoyeur-bottom-px'] ?? '', CONVOYEUR_GOLDEN.bottomPx)
    const convoyeurW = parsePx(cssVars['--convoyeur-w-px'] ?? '', CONVOYEUR_GOLDEN.wPx)
    cssVars['--convoyeur-left-px'] = String(Math.round(lerp(convoyeurLeft, MID_1536_864.convoyeurLeftPx, tMid)))
    cssVars['--convoyeur-bottom-px'] = String(Math.round(lerp(convoyeurBottom, MID_1536_864.convoyeurBottomPx, tMid)))
    cssVars['--convoyeur-w-px'] = String(Math.round(lerp(convoyeurW, MID_1536_864.convoyeurWPx, tMid)))

    const convoyeurHRaw = cssVars['--convoyeur-h'] ?? 'auto'
    const convoyeurHBase = convoyeurHRaw === 'auto' ? 0 : parsePercent(convoyeurHRaw)
    cssVars['--convoyeur-h'] = String(lerp(convoyeurHBase, MID_1536_864.convoyeurH, tMid).toFixed(1))

    const convoyeurEndCorrection = parsePx(cssVars['--convoyeur-end-correction-x-px'] ?? '', CONVOYEUR_END_CORRECTION_GOLDEN)
    cssVars['--convoyeur-end-correction-x-px'] = String(Math.round(lerp(convoyeurEndCorrection, MID_1536_864.convoyeurEndCorrectionXPx, tMid)))

    const maskConvoyeurBottom = parsePercent(cssVars['--mask-convoyeur-bottom'] ?? '8.5%')
    const maskConvoyeurHeight = parsePercent(cssVars['--mask-convoyeur-height'] ?? '37%')
    cssVars['--mask-convoyeur-bottom'] = String(Math.round(lerp(maskConvoyeurBottom, MID_1536_864.maskConvoyeurBottom, tMid)))
    cssVars['--mask-convoyeur-height'] = String(Math.round(lerp(maskConvoyeurHeight, MID_1536_864.maskConvoyeurHeight, tMid)))

    const maskChemineBottom = parsePercent(cssVars['--mask-chemine-bottom'] ?? '18%')
    const maskChemineHeight = parsePercent(cssVars['--mask-chemine-height'] ?? '59%')
    cssVars['--mask-chemine-bottom'] = String(lerp(maskChemineBottom, MID_1536_864.maskChemineBottom, tMid).toFixed(1))
    cssVars['--mask-chemine-height'] = String(lerp(maskChemineHeight, MID_1536_864.maskChemineHeight, tMid).toFixed(1))
    if (tMid > 0.999) {
        cssVars['--mask-chemine-clip-raw'] = MID_1536_864.maskChemineClipRaw
    }

    const robotAbove = parseFloat(cssVars['--robot-above-y-percent'] ?? '50') || 50
    const robotGround = parseFloat(cssVars['--robot-ground-y-percent'] ?? '61') || 61
    cssVars['--robot-above-y-percent'] = String(lerp(robotAbove, MID_1536_864.robotAboveYPercent, tMid).toFixed(1))
    cssVars['--robot-ground-y-percent'] = String(lerp(robotGround, MID_1536_864.robotGroundYPercent, tMid).toFixed(1))

    const alien2Top = parsePercent(cssVars['--exp-alien2-top-percent'] ?? '59.5')
    const alien2WidthPx = parsePx(cssVars['--exp-alien2-width-px'] ?? '', 98)
    cssVars['--exp-alien2-top-percent'] = String(lerp(alien2Top, MID_1536_864.expAlien2TopPercent, tMid).toFixed(1))
    cssVars['--exp-alien2-width-px'] = String(Math.round(lerp(alien2WidthPx, MID_1536_864.expAlien2WidthPx, tMid)))

    const rocketPhase1EndYRatio = parseFloat(cssVars['--rocket-phase1-end-y-ratio'] ?? '0.95') || 0.95
    cssVars['--rocket-phase1-end-y-ratio'] = String(lerp(rocketPhase1EndYRatio, MID_1536_864.rocketPhase1EndYRatio, tMid).toFixed(2))

    const contactPrenomTop = parsePercent(cssVars['--contact-prenom-top'] ?? '6.8')
    const contactPrenomLeft = parsePercent(cssVars['--contact-prenom-left'] ?? '36')
    const contactPrenomWidth = parsePercent(cssVars['--contact-prenom-width'] ?? '13.5')
    const contactPrenomRotate = parseFloat(cssVars['--contact-prenom-rotate-deg'] ?? '11') || 11
    cssVars['--contact-prenom-top'] = String(lerp(contactPrenomTop, MID_1536_864.contactPrenomTop, tMid).toFixed(1))
    cssVars['--contact-prenom-left'] = String(lerp(contactPrenomLeft, MID_1536_864.contactPrenomLeft, tMid).toFixed(1))
    cssVars['--contact-prenom-width'] = String(lerp(contactPrenomWidth, MID_1536_864.contactPrenomWidth, tMid).toFixed(1))
    cssVars['--contact-prenom-rotate-deg'] = String(lerp(contactPrenomRotate, MID_1536_864.contactPrenomRotateDeg, tMid).toFixed(1))

    const contactSocieteTop = parsePercent(cssVars['--contact-societe-top'] ?? '22')
    const contactSocieteLeft = parsePercent(cssVars['--contact-societe-left'] ?? '24.5')
    const contactSocieteWidth = parsePercent(cssVars['--contact-societe-width'] ?? '16.5')
    cssVars['--contact-societe-top'] = String(lerp(contactSocieteTop, MID_1536_864.contactSocieteTop, tMid).toFixed(1))
    cssVars['--contact-societe-left'] = String(lerp(contactSocieteLeft, MID_1536_864.contactSocieteLeft, tMid).toFixed(1))
    cssVars['--contact-societe-width'] = String(lerp(contactSocieteWidth, MID_1536_864.contactSocieteWidth, tMid).toFixed(1))

    const contactEmailTop = parsePercent(cssVars['--contact-email-top'] ?? '13.5')
    const contactEmailLeft = parsePercent(cssVars['--contact-email-left'] ?? '42')
    const contactEmailWidth = parsePercent(cssVars['--contact-email-width'] ?? '19')
    cssVars['--contact-email-top'] = String(lerp(contactEmailTop, MID_1536_864.contactEmailTop, tMid).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(contactEmailLeft, MID_1536_864.contactEmailLeft, tMid).toFixed(1))
    cssVars['--contact-email-width'] = String(lerp(contactEmailWidth, MID_1536_864.contactEmailWidth, tMid).toFixed(1))

    const contactSubmitTop = parsePercent(cssVars['--contact-submit-top'] ?? '41')
    const contactSubmitLeft = parsePercent(cssVars['--contact-submit-left'] ?? '50.5')
    const contactSubmitWidth = parsePercent(cssVars['--contact-submit-width'] ?? '13.5')
    cssVars['--contact-submit-top'] = String(lerp(contactSubmitTop, MID_1536_864.contactSubmitTop, tMid).toFixed(1))
    cssVars['--contact-submit-left'] = String(lerp(contactSubmitLeft, MID_1536_864.contactSubmitLeft, tMid).toFixed(1))
    cssVars['--contact-submit-width'] = String(lerp(contactSubmitWidth, MID_1536_864.contactSubmitWidth, tMid).toFixed(1))

    const contactNomTop = parsePercent(cssVars['--contact-nom-top'] ?? '3.5')
    const contactNomLeft = parsePercent(cssVars['--contact-nom-left'] ?? '16')
    const contactNomWidth = parsePercent(cssVars['--contact-nom-width'] ?? '13.5')
    const contactNomMinWidthPx = parsePx(cssVars['--contact-nom-min-width-px'] ?? '100', 100)
    const contactNomRotate = parseFloat(cssVars['--contact-nom-rotate-deg'] ?? '-4') || -4
    const contactNomLabelTyVh = parseVh(cssVars['--contact-nom-label-ty-vh'] ?? '-9.2') || -9.2
    cssVars['--contact-nom-top'] = String(lerp(contactNomTop, MID_1536_864.contactNomTop, tMid).toFixed(1))
    cssVars['--contact-nom-label-ty-vh'] = String(lerp(contactNomLabelTyVh, MID_1536_864.contactNomLabelTyVh, tMid).toFixed(1))
    cssVars['--contact-nom-left'] = String(lerp(contactNomLeft, MID_1536_864.contactNomLeft, tMid).toFixed(1))
    cssVars['--contact-nom-width'] = String(lerp(contactNomWidth, MID_1536_864.contactNomWidth, tMid).toFixed(1))
    cssVars['--contact-nom-min-width-px'] = String(Math.round(lerp(contactNomMinWidthPx, MID_1536_864.contactNomMinWidthPx, tMid)))
    cssVars['--contact-nom-rotate-deg'] = String(lerp(contactNomRotate, MID_1536_864.contactNomRotateDeg, tMid).toFixed(1))

    const contactMsgTop = parsePercent(cssVars['--contact-message-top'] ?? '37')
    const contactMsgLabelTop = parsePercent(cssVars['--contact-message-label-top'] ?? '70')
    const contactMsgMtVh = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '3.8')
    const contactMsgMlVw = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '2.5')
    const contactMsgWidth = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '80')
    cssVars['--contact-message-top'] = String(lerp(contactMsgTop, MID_1536_864.contactMessageTop, tMid).toFixed(1))
    cssVars['--contact-message-label-top'] = String(lerp(contactMsgLabelTop, MID_1536_864.contactMessageLabelTop, tMid).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(contactMsgMtVh, MID_1536_864.contactMessageTextareaFocusMtVh, tMid).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(contactMsgMlVw, MID_1536_864.contactMessageTextareaFocusMlVw, tMid).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(contactMsgWidth, MID_1536_864.contactMessageTextareaFocusWidth, tMid)))

    const contactMsgTyVh = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-18.5') || -18.5
    cssVars['--contact-message-label-ty-vh'] = String(lerp(contactMsgTyVh, MID_1536_864.contactMessageLabelTyVh, tMid).toFixed(1))
}

/** Applique le mix 1440×900 (calibration intermédiaire). Bande 1380–1500 × 860–940, pic à (1440, 900). */
function apply1440x900Mix(cssVars: Record<string, string>, w: number, h: number): void {
    const t = getT1440x900(w, h)
    if (t === 0) return

    const baseMyname = parseFloat(cssVars['--home-myname-font-size-base-vw'] ?? String(TYPO_MYNAME_BASE_VW)) || TYPO_MYNAME_BASE_VW
    const baseDesc = parseFloat(cssVars['--home-description-font-size-base-vw'] ?? String(TYPO_DESCRIPTION_BASE_VW)) || TYPO_DESCRIPTION_BASE_VW
    cssVars['--home-myname-font-size-base-vw'] = String(lerp(baseMyname, CALIBRATION_1440_900.homeMynameFontSizeBaseVw, t).toFixed(1))
    cssVars['--home-description-font-size-base-vw'] = String(lerp(baseDesc, CALIBRATION_1440_900.homeDescriptionFontSizeBaseVw, t).toFixed(1))

    const presentation = parseFloat(cssVars['--presentation-margin-top-vh'] ?? String(PRESENTATION_MARGIN_TOP_VH_BASE)) || PRESENTATION_MARGIN_TOP_VH_BASE
    cssVars['--presentation-margin-top-vh'] = String(Math.round(lerp(presentation, CALIBRATION_1440_900.presentationMarginTopVh, t)))

    const aboutAlien = parsePercent(cssVars['--about-alien-top'] ?? '65')
    const aboutHologram = parsePercent(cssVars['--about-hologram-top'] ?? '42')
    cssVars['--about-alien-top'] = String(lerp(aboutAlien, CALIBRATION_1440_900.aboutAlienTop, t).toFixed(1))
    cssVars['--about-hologram-top'] = String(lerp(aboutHologram, CALIBRATION_1440_900.aboutHologramTop, t).toFixed(1))

    const profileLeft = parsePercent(cssVars['--profile-text-left'] ?? '64')
    const profileTop = parsePercent(cssVars['--profile-text-top'] ?? '41')
    const profileWidth = parsePercent(cssVars['--profile-text-width'] ?? '45')
    cssVars['--profile-text-left'] = String(lerp(profileLeft, CALIBRATION_1440_900.profileTextLeft, t).toFixed(1))
    cssVars['--profile-text-top'] = String(lerp(profileTop, CALIBRATION_1440_900.profileTextTop, t).toFixed(1))
    cssVars['--profile-text-width'] = String(lerp(profileWidth, CALIBRATION_1440_900.profileTextWidth, t).toFixed(1))

    const questTitreTopVh = parseVh(cssVars['--quest-titre-top'] ?? '5vh') || 5
    const questDescripTopVh = parseVh(cssVars['--quest-descrip-top'] ?? '16vh') || 16
    cssVars['--quest-titre-top'] = String(lerp(questTitreTopVh, CALIBRATION_1440_900.questTitreTopVh, t).toFixed(1)) + 'vh'
    cssVars['--quest-descrip-top'] = String(lerp(questDescripTopVh, CALIBRATION_1440_900.questDescripTopVh, t).toFixed(1)) + 'vh'

    // Experience / habitation : top lié à la hauteur, largeur liée à la largeur
    const expHabTop = parsePx(cssVars['--exp-hab-top-px'] ?? '', EXP_HAB_GOLDEN.topPx)
    const expHabW = parsePx(cssVars['--exp-hab-w-px'] ?? '', EXP_HAB_GOLDEN.wPx)
    cssVars['--exp-hab-top-px'] = String(Math.round(lerp(expHabTop, CALIBRATION_1440_900.expHabTopPx, t)))
    cssVars['--exp-hab-w-px'] = String(Math.round(lerp(expHabW, CALIBRATION_1440_900.expHabWPx, t)))

    // Alien 2 : left principalement dépendant de la largeur, top en %
    const alien2Left = parsePx(cssVars['--exp-alien2-left-px'] ?? '', 0)
    const alien2Top = parsePercent(cssVars['--exp-alien2-top-percent'] ?? String(EXP_ALIEN2_GOLDEN_TOP_PERCENT))
    cssVars['--exp-alien2-left-px'] = String(Math.round(lerp(alien2Left, CALIBRATION_1440_900.expAlien2LeftPx, t)))
    cssVars['--exp-alien2-top-percent'] = String(lerp(alien2Top, CALIBRATION_1440_900.expAlien2TopPercent, t).toFixed(1))

    // Masque cheminée : bottom + clip ajustés autour de 1440×900
    const maskChemineBottom = parsePercent(cssVars['--mask-chemine-bottom'] ?? '18%')
    cssVars['--mask-chemine-bottom'] = String(lerp(maskChemineBottom, CALIBRATION_1440_900.maskChemineBottom, t).toFixed(1))
    if (t > 0.9) {
        cssVars['--mask-chemine-clip-raw'] = CALIBRATION_1440_900.maskChemineClipRaw
    }

    // Masque convoyeur : bottom/height en %
    const maskConvoyeurBottom = parsePercent(cssVars['--mask-convoyeur-bottom'] ?? '8.5%')
    const maskConvoyeurHeight = parsePercent(cssVars['--mask-convoyeur-height'] ?? '37%')
    cssVars['--mask-convoyeur-bottom'] = String(lerp(maskConvoyeurBottom, CALIBRATION_1440_900.maskConvoyeurBottom, t).toFixed(1))
    cssVars['--mask-convoyeur-height'] = String(Math.round(lerp(maskConvoyeurHeight, CALIBRATION_1440_900.maskConvoyeurHeight, t)))

    // Convoyeur : bottom en px (lié à la hauteur), largeur en px (liée à la largeur), hauteur en %
    const convoyeurBottom = parsePx(cssVars['--convoyeur-bottom-px'] ?? '', CONVOYEUR_GOLDEN.bottomPx)
    const convoyeurW = parsePx(cssVars['--convoyeur-w-px'] ?? '', CONVOYEUR_GOLDEN.wPx)
    const convoyeurHRaw = cssVars['--convoyeur-h'] ?? 'auto'
    const convoyeurHBase = convoyeurHRaw === 'auto' ? 0 : parsePercent(convoyeurHRaw)
    cssVars['--convoyeur-bottom-px'] = String(Math.round(lerp(convoyeurBottom, CALIBRATION_1440_900.convoyeurBottomPx, t)))
    cssVars['--convoyeur-w-px'] = String(Math.round(lerp(convoyeurW, CALIBRATION_1440_900.convoyeurWPx, t)))
    cssVars['--convoyeur-h'] = String(lerp(convoyeurHBase, CALIBRATION_1440_900.convoyeurH, t).toFixed(1))

    // Robot : positions Y en % (pilotées par la hauteur)
    const robotAbove = parseFloat(cssVars['--robot-above-y-percent'] ?? '50') || 50
    const robotGround = parseFloat(cssVars['--robot-ground-y-percent'] ?? '61') || 61
    cssVars['--robot-above-y-percent'] = String(lerp(robotAbove, CALIBRATION_1440_900.robotAboveYPercent, t).toFixed(1))
    cssVars['--robot-ground-y-percent'] = String(lerp(robotGround, CALIBRATION_1440_900.robotGroundYPercent, t).toFixed(1))

    // Contact / SVG : top en %, height en vh (principalement lié à la hauteur)
    const contactSvgTop = parsePercent(cssVars['--contact-svg-top'] ?? '36.5')
    const contactSvgHeightVh = parseVh(cssVars['--contact-svg-height-vh'] ?? '63') || 63
    const outContactSvgTop = lerp(contactSvgTop, CALIBRATION_1440_900.contactSvgTop, t)
    const outContactSvgHeightVh = lerp(contactSvgHeightVh, CALIBRATION_1440_900.contactSvgHeightVh, t)
    cssVars['--contact-svg-top'] = (outContactSvgTop % 1 === 0) ? String(Math.round(outContactSvgTop)) : String(outContactSvgTop.toFixed(1))
    cssVars['--contact-svg-height-vh'] = (outContactSvgHeightVh % 1 === 0) ? String(Math.round(outContactSvgHeightVh)) : String(outContactSvgHeightVh.toFixed(1))
    cssVars['--contact-svg-height'] =
        (outContactSvgHeightVh % 1 === 0) ? `${Math.round(outContactSvgHeightVh)}vh` : `${outContactSvgHeightVh.toFixed(1)}vh`

    // Contact / nom : top + ty liés à la hauteur, width lié à la largeur
    const contactNomTop = parsePercent(cssVars['--contact-nom-top'] ?? '3.5')
    const contactNomLabelTyVh = parseVh(cssVars['--contact-nom-label-ty-vh'] ?? '-9.2') || -9.2
    const contactNomWidth = parsePercent(cssVars['--contact-nom-width'] ?? '13.5')
    cssVars['--contact-nom-top'] = String(lerp(contactNomTop, CALIBRATION_1440_900.contactNomTop, t).toFixed(1))
    cssVars['--contact-nom-label-ty-vh'] = String(lerp(contactNomLabelTyVh, CALIBRATION_1440_900.contactNomLabelTyVh, t).toFixed(1))
    cssVars['--contact-nom-width'] = String(lerp(contactNomWidth, CALIBRATION_1440_900.contactNomWidth, t).toFixed(1))

    // Contact / prénom : top + label ty + input mt (hauteur), left (largeur)
    const contactPrenomTop = parsePercent(cssVars['--contact-prenom-top'] ?? '6.8')
    const contactPrenomLeft = parsePercent(cssVars['--contact-prenom-left'] ?? '36')
    const contactPrenomInputMtEm = parseFloat(cssVars['--contact-prenom-input-mt-em'] ?? '-0.5') || -0.5
    const contactPrenomLabelTyVh = parseVh(cssVars['--contact-prenom-label-ty-vh'] ?? '-3.1') || -3.1
    cssVars['--contact-prenom-top'] = String(lerp(contactPrenomTop, CALIBRATION_1440_900.contactPrenomTop, t).toFixed(1))
    cssVars['--contact-prenom-left'] = String(lerp(contactPrenomLeft, CALIBRATION_1440_900.contactPrenomLeft, t).toFixed(1))
    cssVars['--contact-prenom-input-mt-em'] = String(lerp(contactPrenomInputMtEm, CALIBRATION_1440_900.contactPrenomInputMtEm, t).toFixed(1))
    cssVars['--contact-prenom-label-ty-vh'] = String(lerp(contactPrenomLabelTyVh, CALIBRATION_1440_900.contactPrenomLabelTyVh, t).toFixed(1))

    // Contact / société : top (hauteur) + left/width (largeur)
    const contactSocieteTop = parsePercent(cssVars['--contact-societe-top'] ?? '22')
    const contactSocieteLeft = parsePercent(cssVars['--contact-societe-left'] ?? '24.5')
    const contactSocieteWidth = parsePercent(cssVars['--contact-societe-width'] ?? '16.5')
    cssVars['--contact-societe-top'] = String(lerp(contactSocieteTop, CALIBRATION_1440_900.contactSocieteTop, t).toFixed(1))
    cssVars['--contact-societe-left'] = String(lerp(contactSocieteLeft, CALIBRATION_1440_900.contactSocieteLeft, t).toFixed(1))
    cssVars['--contact-societe-width'] = String(lerp(contactSocieteWidth, CALIBRATION_1440_900.contactSocieteWidth, t).toFixed(1))

    // Contact / email : top (hauteur) + left (largeur)
    const contactEmailTop = parsePercent(cssVars['--contact-email-top'] ?? '13.5')
    const contactEmailLeft = parsePercent(cssVars['--contact-email-left'] ?? '42')
    cssVars['--contact-email-top'] = String(lerp(contactEmailTop, CALIBRATION_1440_900.contactEmailTop, t).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(contactEmailLeft, CALIBRATION_1440_900.contactEmailLeft, t).toFixed(1))

    // Contact / message : positions verticales (hauteur), ml/tx (largeur), width (largeur), height (mix mais piloté par ce bump)
    const contactMessageTop = parsePercent(cssVars['--contact-message-top'] ?? '37')
    const contactMessageTextareaFocusMtVh = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '3.8') || 3.8
    const contactMessageTextareaFocusMlVw = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '2.5') || 2.5
    const contactMessageTextareaFocusWidth = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '80')
    const contactMessageLabelTop = parsePercent(cssVars['--contact-message-label-top'] ?? '70')
    const contactMessageLabelLeft = parsePercent(cssVars['--contact-message-label-left'] ?? '0') || 0
    const contactMessageLabelTxVw = parseVw(cssVars['--contact-message-label-tx-vw'] ?? '-4') || -4
    const contactMessageLabelTyVh = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-18.5') || -18.5
    const contactMessageTextareaHeight = parseFloat(cssVars['--contact-message-textarea-height'] ?? '11.5') || 11.5
    cssVars['--contact-message-top'] = String(lerp(contactMessageTop, CALIBRATION_1440_900.contactMessageTop, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(contactMessageTextareaFocusMtVh, CALIBRATION_1440_900.contactMessageTextareaFocusMtVh, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(contactMessageTextareaFocusMlVw, CALIBRATION_1440_900.contactMessageTextareaFocusMlVw, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(contactMessageTextareaFocusWidth, CALIBRATION_1440_900.contactMessageTextareaFocusWidth, t)))
    cssVars['--contact-message-label-top'] = String(lerp(contactMessageLabelTop, CALIBRATION_1440_900.contactMessageLabelTop, t).toFixed(1))
    const outContactMessageLabelLeft = lerp(contactMessageLabelLeft, CALIBRATION_1440_900.contactMessageLabelLeft, t)
    cssVars['--contact-message-label-left'] = (Math.abs(outContactMessageLabelLeft) < 0.0001) ? '0' : String(outContactMessageLabelLeft.toFixed(1))
    cssVars['--contact-message-label-tx-vw'] = String(lerp(contactMessageLabelTxVw, CALIBRATION_1440_900.contactMessageLabelTxVw, t).toFixed(1))
    cssVars['--contact-message-label-ty-vh'] = String(lerp(contactMessageLabelTyVh, CALIBRATION_1440_900.contactMessageLabelTyVh, t).toFixed(1))
    cssVars['--contact-message-textarea-height'] = String(lerp(contactMessageTextareaHeight, CALIBRATION_1440_900.contactMessageTextareaHeightEm, t).toFixed(1))
}

/** Applique le mix wideDesktop. w/h = viewport officiel (getResponsiveViewport). */
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

    const presentation = parseFloat(cssVars['--presentation-margin-top-vh'] ?? String(PRESENTATION_MARGIN_TOP_VH_BASE)) || PRESENTATION_MARGIN_TOP_VH_BASE
    const outPresentation = String(Math.round(lerp(presentation, WIDE_1920_1080.presentationMarginTopVh, tWide)))
    if (debug) console.log('[applyWideDesktopMix] --presentation-margin-top-vh', { baseParsed: presentation, preset: WIDE_1920_1080.presentationMarginTopVh, tWide, output: outPresentation })
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
        cssVars['--mask-chemine-clip-raw'] = WIDE_1920_1080.maskChemineClipRaw
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

    if (tWide > 0) {
        const convoyeurEndCorrection = parsePx(cssVars['--convoyeur-end-correction-x-px'] ?? '', CONVOYEUR_END_CORRECTION_GOLDEN)
        cssVars['--convoyeur-end-correction-x-px'] = String(Math.round(lerp(convoyeurEndCorrection, WIDE_1920_1080.convoyeurEndCorrectionXPx, tWide)))
    }

    const robotAbove = parseFloat(cssVars['--robot-above-y-percent'] ?? '50') || 50
    const robotGround = parseFloat(cssVars['--robot-ground-y-percent'] ?? '61') || 61
    cssVars['--robot-above-y-percent'] = String(lerp(robotAbove, WIDE_1920_1080.robotAboveYPercent, tWide).toFixed(1))
    cssVars['--robot-ground-y-percent'] = String(lerp(robotGround, WIDE_1920_1080.robotGroundYPercent, tWide).toFixed(1))

    const robotHandEndXDeltaBase = parseFloat(cssVars['--robot-hand-end-x-delta'] ?? '0') || 0
    cssVars['--robot-hand-end-x-delta'] = String(lerp(robotHandEndXDeltaBase, WIDE_1920_1080.robotHandEndXDeltaVw, tWide).toFixed(1))

    const rocketPhase1EndYRatio = parseFloat(cssVars['--rocket-phase1-end-y-ratio'] ?? '0.95') || 0.95
    cssVars['--rocket-phase1-end-y-ratio'] = String(lerp(rocketPhase1EndYRatio, WIDE_1920_1080.rocketPhase1EndYRatio, tWide).toFixed(2))

    const contactLeft = parsePercent(cssVars['--contact-svg-left'] ?? '15')
    const contactTop = parsePercent(cssVars['--contact-svg-top'] ?? '36.5')
    const contactHeightVh = parseVh(cssVars['--contact-svg-height-vh'] ?? '63') || parseFloat(cssVars['--contact-svg-height-vh'] ?? '') || 63
    cssVars['--contact-svg-left'] = String(lerp(contactLeft, WIDE_1920_1080.contactSvgLeft, tWide).toFixed(1))
    cssVars['--contact-svg-top'] = String(lerp(contactTop, WIDE_1920_1080.contactSvgTop, tWide).toFixed(1))
    cssVars['--contact-svg-height-vh'] = String(Math.round(lerp(contactHeightVh, WIDE_1920_1080.contactSvgHeightVh, tWide)))

    const contactNomTop = parsePercent(cssVars['--contact-nom-top'] ?? '3.5')
    const contactNomLabelTyVh = parseVh(cssVars['--contact-nom-label-ty-vh'] ?? '-9.2') || -9.2
    cssVars['--contact-nom-top'] = String(lerp(contactNomTop, WIDE_1920_1080.contactNomTop, tWide).toFixed(1))
    cssVars['--contact-nom-label-ty-vh'] = String(lerp(contactNomLabelTyVh, WIDE_1920_1080.contactNomLabelTyVh, tWide).toFixed(1))

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
    const contactEmailXVh = parseVh(cssVars['--contact-email-label-x-vh'] ?? '0')
    const contactEmailTyVh = parseVh(cssVars['--contact-email-label-ty-vh'] ?? '-5')
    cssVars['--contact-email-top'] = String(lerp(contactEmailTop, WIDE_1920_1080.contactEmailTop, tWide).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(contactEmailLeft, WIDE_1920_1080.contactEmailLeft, tWide).toFixed(1))
    cssVars['--contact-email-width'] = String(lerp(contactEmailWidth, WIDE_1920_1080.contactEmailWidth, tWide).toFixed(1))
    cssVars['--contact-email-label-x-vh'] = String(lerp(contactEmailXVh, WIDE_1920_1080.contactEmailLabelXVh, tWide).toFixed(1))
    cssVars['--contact-email-label-ty-vh'] = String(lerp(contactEmailTyVh, WIDE_1920_1080.contactEmailLabelTyVh, tWide).toFixed(1))

    const contactMsgTop = parsePercent(cssVars['--contact-message-top'] ?? '37')
    const contactMsgMtVh = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '3.8')
    const contactMsgMlVw = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '2.5')
    const contactMsgWidth = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '80')
    const contactMsgLabelTop = parsePercent(cssVars['--contact-message-label-top'] ?? '70')
    const contactMsgLabelLeft = parsePercent(cssVars['--contact-message-label-left'] ?? '0') || 0
    const contactMsgTxVw = parseVw(cssVars['--contact-message-label-tx-vw'] ?? '-4')
    const contactMsgTyVh = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-18.5')
    if (tWide > 0) {
        cssVars['--contact-message-top'] = String(lerp(contactMsgTop, WIDE_1920_1080.contactMessageTop, tWide).toFixed(1))
        cssVars['--contact-message-label-ty-vh'] = String(lerp(contactMsgTyVh, WIDE_1920_1080.contactMessageLabelTyVh, tWide).toFixed(1))
    }
    cssVars['--contact-message-label-top'] = String(lerp(contactMsgLabelTop, WIDE_1920_1080.contactMessageLabelTop, tWide).toFixed(1))
    cssVars['--contact-message-label-left'] = String(lerp(contactMsgLabelLeft, WIDE_1920_1080.contactMessageLabelLeft, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(contactMsgMtVh, WIDE_1920_1080.contactMessageTextareaFocusMtVh, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(contactMsgMlVw, WIDE_1920_1080.contactMessageTextareaFocusMlVw, tWide).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(contactMsgWidth, WIDE_1920_1080.contactMessageTextareaFocusWidth, tWide)))
    cssVars['--contact-message-label-tx-vw'] = String(lerp(contactMsgTxVw, WIDE_1920_1080.contactMessageLabelTxVw, tWide).toFixed(1))

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

/** Applique le mix shortWide (1920×944 vs 1920×1080). Adaptation pilotée par la hauteur. w >= 1850, 944 <= h <= 1080. */
function applyShortWideMix(cssVars: Record<string, string>, w: number, h: number): void {
    const t = getTShortWide(w, h)
    if (t === 0) return

    const presentation = parseFloat(cssVars['--presentation-margin-top-vh'] ?? String(PRESENTATION_MARGIN_TOP_VH_BASE)) || PRESENTATION_MARGIN_TOP_VH_BASE
    cssVars['--presentation-margin-top-vh'] = String(Math.round(lerp(presentation, WIDE_1920_944.presentationMarginTopVh, t)))

    const baseMyname = parseFloat(cssVars['--home-myname-font-size-base-vw'] ?? String(TYPO_MYNAME_BASE_VW)) || TYPO_MYNAME_BASE_VW
    const baseDesc = parseFloat(cssVars['--home-description-font-size-base-vw'] ?? String(TYPO_DESCRIPTION_BASE_VW)) || TYPO_DESCRIPTION_BASE_VW
    cssVars['--home-myname-font-size-base-vw'] = String(lerp(baseMyname, WIDE_1920_944.homeMynameFontSizeBaseVw, t).toFixed(1))
    cssVars['--home-description-font-size-base-vw'] = String(lerp(baseDesc, WIDE_1920_944.homeDescriptionFontSizeBaseVw, t).toFixed(1))

    const profileLeft = parsePercent(cssVars['--profile-text-left'] ?? '79')
    cssVars['--profile-text-left'] = String(Math.round(lerp(profileLeft, WIDE_1920_944.profileTextLeft, t)))

    const handwriting = parsePercent(cssVars['--handwriting-svg-width'] ?? '67')
    cssVars['--handwriting-svg-width'] = String(Math.round(lerp(handwriting, WIDE_1920_944.handwritingSvgWidth, t)))

    const alien2Top = parsePercent(cssVars['--exp-alien2-top-percent'] ?? '40.7')
    cssVars['--exp-alien2-top-percent'] = String(lerp(alien2Top, WIDE_1920_944.expAlien2TopPercent, t).toFixed(1))

    const expHabTop = parsePx(cssVars['--exp-hab-top-px'] ?? '', 634)
    cssVars['--exp-hab-top-px'] = String(Math.round(lerp(expHabTop, WIDE_1920_944.expHabTopPx, t)))

    const maskChemineBottom = parsePercent(cssVars['--mask-chemine-bottom'] ?? '16.8')
    cssVars['--mask-chemine-bottom'] = String(lerp(maskChemineBottom, WIDE_1920_944.maskChemineBottom, t).toFixed(1))
    if (t > 0.999) {
        cssVars['--mask-chemine-clip-raw'] = WIDE_1920_944.maskChemineClipRaw
    } else if (t > 0) {
        cssVars['--mask-chemine-clip-raw'] = WIDE_1920_1080.maskChemineClipRaw
    }

    const maskConvoyeurBottom = parsePercent(cssVars['--mask-convoyeur-bottom'] ?? '12.5')
    const maskConvoyeurHeight = parsePercent(cssVars['--mask-convoyeur-height'] ?? '33')
    cssVars['--mask-convoyeur-bottom'] = String(lerp(maskConvoyeurBottom, WIDE_1920_944.maskConvoyeurBottom, t).toFixed(1))
    cssVars['--mask-convoyeur-height'] = String(Math.round(lerp(maskConvoyeurHeight, WIDE_1920_944.maskConvoyeurHeight, t)))

    const convoyeurLeft = parsePx(cssVars['--convoyeur-left-px'] ?? '', -1203)
    const convoyeurBottom = parsePx(cssVars['--convoyeur-bottom-px'] ?? '', 1075)
    const convoyeurW = parsePx(cssVars['--convoyeur-w-px'] ?? '', 2200)
    const convoyeurHRaw = cssVars['--convoyeur-h'] ?? '16'
    const convoyeurH = convoyeurHRaw === 'auto' ? 0 : parsePercent(convoyeurHRaw) || 16
    const convoyeurEndCorrection = parsePx(cssVars['--convoyeur-end-correction-x-px'] ?? '', -4)
    cssVars['--convoyeur-left-px'] = String(Math.round(lerp(convoyeurLeft, WIDE_1920_944.convoyeurLeftPx, t)))
    cssVars['--convoyeur-bottom-px'] = String(Math.round(lerp(convoyeurBottom, WIDE_1920_944.convoyeurBottomPx, t)))
    cssVars['--convoyeur-w-px'] = String(Math.round(lerp(convoyeurW, WIDE_1920_944.convoyeurWPx, t)))
    cssVars['--convoyeur-h'] = String(Math.round(lerp(convoyeurH, WIDE_1920_944.convoyeurH, t)))
    cssVars['--convoyeur-end-correction-x-px'] = String(Math.round(lerp(convoyeurEndCorrection, WIDE_1920_944.convoyeurEndCorrectionXPx, t)))

    const robotAbove = parseFloat(cssVars['--robot-above-y-percent'] ?? '33.5') || 33.5
    const robotGround = parseFloat(cssVars['--robot-ground-y-percent'] ?? '40.5') || 40.5
    cssVars['--robot-above-y-percent'] = String(lerp(robotAbove, WIDE_1920_944.robotAboveYPercent, t).toFixed(1))
    cssVars['--robot-ground-y-percent'] = String(lerp(robotGround, WIDE_1920_944.robotGroundYPercent, t).toFixed(1))

    const projetsTopVh = parseVh(cssVars['--projets-text-top'] ?? '5vh') || 5
    cssVars['--projets-text-top'] = String(lerp(projetsTopVh, WIDE_1920_944.projetsTextTopVh, t).toFixed(1)) + 'vh'

    const portraitTopVh = parseFloat(cssVars['--portrait-image-top-vh'] ?? '5') || 5
    cssVars['--portrait-image-top-vh'] = String(lerp(portraitTopVh, WIDE_1920_944.portraitImageTopVh, t).toFixed(1))

    const questDescripTopVh = parseVh(cssVars['--quest-descrip-top'] ?? '12vh') || 12
    const questTitreTopVh = parseVh(cssVars['--quest-titre-top'] ?? '5vh') || 5
    cssVars['--quest-descrip-top'] = String(lerp(questDescripTopVh, WIDE_1920_944.questDescripTopVh, t).toFixed(1)) + 'vh'
    cssVars['--quest-titre-top'] = String(lerp(questTitreTopVh, WIDE_1920_944.questTitreTopVh, t).toFixed(1)) + 'vh'

    const robotHandEndXDelta = parseFloat(cssVars['--robot-hand-end-x-delta'] ?? '0') || 0
    cssVars['--robot-hand-end-x-delta'] = String(lerp(robotHandEndXDelta, WIDE_1920_944.robotHandEndXDeltaVw, t).toFixed(1))

    const contactSvgTop = parsePercent(cssVars['--contact-svg-top'] ?? '25')
    const contactSvgHeightVh = parseVh(cssVars['--contact-svg-height-vh'] ?? '41') || 41
    cssVars['--contact-svg-top'] = String(lerp(contactSvgTop, WIDE_1920_944.contactSvgTop, t).toFixed(1))
    cssVars['--contact-svg-height-vh'] = String(Math.round(lerp(contactSvgHeightVh, WIDE_1920_944.contactSvgHeightVh, t)))

    const contactPrenomMinWidth = parsePx(cssVars['--contact-prenom-min-width-px'] ?? '100', 100)
    cssVars['--contact-prenom-min-width-px'] = String(Math.round(lerp(contactPrenomMinWidth, WIDE_1920_944.contactPrenomMinWidthPx, t)))

    const contactPrenomLabelTyVh = parseVh(cssVars['--contact-prenom-label-ty-vh'] ?? '-3.1') || -3.1
    cssVars['--contact-prenom-label-ty-vh'] = String(lerp(contactPrenomLabelTyVh, WIDE_1920_944.contactPrenomLabelTyVh, t).toFixed(1))

    const contactPrenomInputMtEm = parseFloat(cssVars['--contact-prenom-input-mt-em'] ?? '-0.5') || -0.5
    cssVars['--contact-prenom-input-mt-em'] = String(lerp(contactPrenomInputMtEm, WIDE_1920_944.contactPrenomInputMtEm, t).toFixed(1))

    const contactSocieteTop = parsePercent(cssVars['--contact-societe-top'] ?? '15.1')
    const contactSocieteLeft = parsePercent(cssVars['--contact-societe-left'] ?? '24.8')
    const contactSocieteWidth = parsePercent(cssVars['--contact-societe-width'] ?? '14.5')
    const contactSocieteLabelTxVw = parseVw(cssVars['--contact-societe-label-tx-vw'] ?? '-6.5') || -6.5
    cssVars['--contact-societe-top'] = String(lerp(contactSocieteTop, WIDE_1920_944.contactSocieteTop, t).toFixed(1))
    cssVars['--contact-societe-left'] = String(lerp(contactSocieteLeft, WIDE_1920_944.contactSocieteLeft, t).toFixed(1))
    cssVars['--contact-societe-width'] = String(lerp(contactSocieteWidth, WIDE_1920_944.contactSocieteWidth, t).toFixed(1))
    cssVars['--contact-societe-label-tx-vw'] = String(lerp(contactSocieteLabelTxVw, WIDE_1920_944.contactSocieteLabelTxVw, t).toFixed(1))

    const contactEmailTop = parsePercent(cssVars['--contact-email-top'] ?? '9.7')
    const contactEmailLeft = parsePercent(cssVars['--contact-email-left'] ?? '41')
    const contactEmailWidth = parsePercent(cssVars['--contact-email-width'] ?? '17')
    cssVars['--contact-email-top'] = String(lerp(contactEmailTop, WIDE_1920_944.contactEmailTop, t).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(contactEmailLeft, WIDE_1920_944.contactEmailLeft, t).toFixed(1))
    cssVars['--contact-email-width'] = String(lerp(contactEmailWidth, WIDE_1920_944.contactEmailWidth, t).toFixed(1))

    const contactSubmitTop = parsePercent(cssVars['--contact-submit-top'] ?? '28')
    const contactSubmitLeft = parsePercent(cssVars['--contact-submit-left'] ?? '48.5')
    const contactSubmitWidth = parsePercent(cssVars['--contact-submit-width'] ?? '12.5')
    cssVars['--contact-submit-top'] = String(lerp(contactSubmitTop, WIDE_1920_944.contactSubmitTop, t).toFixed(1))
    cssVars['--contact-submit-left'] = String(lerp(contactSubmitLeft, WIDE_1920_944.contactSubmitLeft, t).toFixed(1))
    cssVars['--contact-submit-width'] = String(lerp(contactSubmitWidth, WIDE_1920_944.contactSubmitWidth, t).toFixed(1))

    const contactMsgTop = parsePercent(cssVars['--contact-message-top'] ?? '25.1')
    const contactMsgMtVh = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '0.4') || 0.4
    const contactMsgMlVw = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '0.3') || 0.3
    const contactMsgWidth = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '93')
    const contactMsgLabelTop = parsePercent(cssVars['--contact-message-label-top'] ?? '55')
    const contactMsgLabelLeft = parsePercent(cssVars['--contact-message-label-left'] ?? '0') || 0
    const contactMsgTxVw = parseVw(cssVars['--contact-message-label-tx-vw'] ?? '-4') || -4
    const contactMsgTyVh = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-11') || -11
    cssVars['--contact-message-top'] = String(lerp(contactMsgTop, WIDE_1920_944.contactMessageTop, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(contactMsgMtVh, WIDE_1920_944.contactMessageTextareaFocusMtVh, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(contactMsgMlVw, WIDE_1920_944.contactMessageTextareaFocusMlVw, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(contactMsgWidth, WIDE_1920_944.contactMessageTextareaFocusWidth, t)))
    const contactMsgTextareaHeight = parseFloat(cssVars['--contact-message-textarea-height'] ?? '11.5') || 11.5
    cssVars['--contact-message-textarea-height'] = String(lerp(contactMsgTextareaHeight, WIDE_1920_944.contactMessageTextareaHeightEm, t).toFixed(1))
    cssVars['--contact-message-label-top'] = String(lerp(contactMsgLabelTop, WIDE_1920_944.contactMessageLabelTop, t).toFixed(1))
    cssVars['--contact-message-label-left'] = String(lerp(contactMsgLabelLeft, WIDE_1920_944.contactMessageLabelLeft, t).toFixed(1))
    cssVars['--contact-message-label-tx-vw'] = String(lerp(contactMsgTxVw, WIDE_1920_944.contactMessageLabelTxVw, t).toFixed(1))
    cssVars['--contact-message-label-ty-vh'] = String(lerp(contactMsgTyVh, WIDE_1920_944.contactMessageLabelTyVh, t).toFixed(1))

    const arcScrollLeft = parsePx(cssVars['--contact-arc-scroll-left'] ?? '', -36.5)
    const arcScrollTop = parseFloat(cssVars['--contact-arc-scroll-top'] ?? '0') || 0
    const arcScrollHeight = parsePercent(cssVars['--contact-arc-scroll-height'] ?? '70') || 70
    cssVars['--contact-arc-scroll-left'] = (arcScrollLeft % 1 !== 0) ? `${lerp(arcScrollLeft, WIDE_1920_944.contactArcScrollLeftPx, t).toFixed(1)}px` : `${Math.round(lerp(arcScrollLeft, WIDE_1920_944.contactArcScrollLeftPx, t))}px`;
    cssVars['--contact-arc-scroll-top'] = String(Math.round(lerp(arcScrollTop, WIDE_1920_944.contactArcScrollTopPx, t)))
    cssVars['--contact-arc-scroll-height'] = String(Math.round(lerp(arcScrollHeight, WIDE_1920_944.contactArcScrollHeightPercent, t))) + '%'

    const contactNomTop = parsePercent(cssVars['--contact-nom-top'] ?? '3.2')
    const contactNomLeft = parsePercent(cssVars['--contact-nom-left'] ?? '16')
    const contactNomWidth = parsePercent(cssVars['--contact-nom-width'] ?? '13.5')
    cssVars['--contact-nom-top'] = String(lerp(contactNomTop, WIDE_1920_944.contactNomTop, t).toFixed(1))
    cssVars['--contact-nom-left'] = String(lerp(contactNomLeft, WIDE_1920_944.contactNomLeft, t).toFixed(1))
    cssVars['--contact-nom-width'] = String(lerp(contactNomWidth, WIDE_1920_944.contactNomWidth, t).toFixed(1))

    const contactPrenomWidth = parsePercent(cssVars['--contact-prenom-width'] ?? '12.5')
    const contactPrenomTop = parsePercent(cssVars['--contact-prenom-top'] ?? '5.5')
    const contactPrenomLeft = parsePercent(cssVars['--contact-prenom-left'] ?? '35.2')
    cssVars['--contact-prenom-width'] = String(lerp(contactPrenomWidth, WIDE_1920_944.contactPrenomWidth, t).toFixed(1))
    cssVars['--contact-prenom-top'] = String(lerp(contactPrenomTop, WIDE_1920_944.contactPrenomTop, t).toFixed(1))
    cssVars['--contact-prenom-left'] = String(lerp(contactPrenomLeft, WIDE_1920_944.contactPrenomLeft, t).toFixed(1))

    /** Position finale fusée : à 1920×1080 les tokens ne sont pas définis (fallback 4508, 927.24 dans scrollAnimations). On les définit pour la bande shortWide avec interpolation. */
    const rocketLandedX1080 = 4508
    const rocketLandedY1080 = 927.24
    cssVars['--rocket-landed-x-px'] = String(Math.round(lerp(rocketLandedX1080, WIDE_1920_944.rocketLandedXPx, t)))
    cssVars['--rocket-landed-y-px'] = String(lerp(rocketLandedY1080, WIDE_1920_944.rocketLandedYPx, t).toFixed(2))
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

/**
 * Retourne le viewport officiel utilisé pour la sélection des presets et les CSS vars --vw/--vh.
 * En priorité : override dev (__RESPONSIVE_VIEWPORT_OVERRIDE__), puis visualViewport, documentElement.client*, window.inner, metrics, défaut.
 */
export function getResponsiveViewport(metrics?: ViewportMetricsInput): { width: number; height: number } {
    let result: { width: number; height: number }
    const devOverride = typeof window !== 'undefined' && (window as Window & { __RESPONSIVE_VIEWPORT_OVERRIDE__?: { width: number; height: number } }).__RESPONSIVE_VIEWPORT_OVERRIDE__
    if (devOverride && typeof devOverride.width === 'number' && typeof devOverride.height === 'number' && devOverride.width > 0 && devOverride.height > 0) {
        result = { width: devOverride.width, height: devOverride.height }
    } else if (typeof window !== 'undefined') {
        const vv = window.visualViewport
        const innerW = window.innerWidth
        const innerH = window.innerHeight
        const root = document.documentElement
        const clientW = root?.clientWidth
        const clientH = root?.clientHeight
        if (vv && typeof vv.width === 'number' && typeof vv.height === 'number' && vv.width > 0 && vv.height > 0) {
            result = { width: Math.round(vv.width), height: Math.round(vv.height) }
        } else if (typeof clientW === 'number' && typeof clientH === 'number' && clientW > 0 && clientH > 0) {
            result = { width: clientW, height: clientH }
        } else {
            result = { width: innerW, height: innerH }
        }
    } else if (metrics && typeof metrics.width === 'number' && typeof metrics.height === 'number') {
        result = { width: metrics.width, height: metrics.height }
    } else {
        result = { width: 1920, height: 1080 }
    }
    const responsiveDebug = typeof window !== 'undefined' && (window as Window & { __RESPONSIVE_DEBUG__?: boolean }).__RESPONSIVE_DEBUG__
    if (responsiveDebug) {
        const vv = typeof window !== 'undefined' ? window.visualViewport : null
        const root = typeof document !== 'undefined' ? document.documentElement : null
        console.log('[responsive] getResponsiveViewport', {
            ...(devOverride ? { override: devOverride, usedOverride: true } : {}),
            visualViewportWidth: vv?.width,
            visualViewportHeight: vv?.height,
            documentElementClientWidth: root?.clientWidth,
            documentElementClientHeight: root?.clientHeight,
            windowInnerWidth: typeof window !== 'undefined' ? window.innerWidth : undefined,
            windowInnerHeight: typeof window !== 'undefined' ? window.innerHeight : undefined,
            returned: result,
            source: 'getResponsiveViewport',
        })
    }
    return result
}

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
            '--mask-chemine-left': '5',
            '--mask-chemine-bottom': '20',
            '--mask-chemine-height': '57',
            '--mask-chemine-clip-raw': MASK_CHEMINE_CLIP_GOLDEN,
        }
    }
    if (w <= BP_XL) {
        return {
            '--mask-chemine-left': '4',
            '--mask-chemine-bottom': '18',
            '--mask-chemine-height': '59',
            '--mask-chemine-clip-raw': MASK_CHEMINE_CLIP_GOLDEN,
        }
    }
    
    return {
        '--mask-chemine-left': '7.2',
        '--mask-chemine-bottom': '16.8',
        '--mask-chemine-height': '42',
        '--mask-chemine-clip-raw': 'polygon(100% 29%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)',
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

/** Ratio (0–1) hauteur atteinte par la fusée à la fin de la phase 1 (point bas avant départ sur X), base desktop/nearGolden (sans mix wide). */
function getRocketPhase1EndYRatioBase(w: number): number {
    if (w <= GROUND_LINE_425_MAX_WIDTH) return ROCKET_END_Y_PERCENTAGE_425
    if (w <= MOBILE_SMALL_MAX_WIDTH) return ROCKET_END_Y_PERCENTAGE_MOBILE_SMALL
    if (w <= MOBILE_MAX_WIDTH) return ROCKET_END_Y_PERCENTAGE_MOBILE
    if (w <= TABLET_MAX_WIDTH) return ROCKET_END_Y_PERCENTAGE
    return ROCKET_END_Y_PERCENTAGE
}

/** Fusée : à 1348 = left 10vw, top -60vh, 300px. 1366 = top -65vh. + --rocket-phase1-end-y-ratio pour mix mid/wide. */
function computeRocketCssVars(w: number, h: number): Record<string, string> {
    const left = w <= BP_MD ? (w <= 480 ? '-15vw' : '-10vw') : '10vw'
    const top = isNearGoldenViewport(w, h) ? '-65vh' : '-60vh'
    const phase1EndYRatio = getRocketPhase1EndYRatioBase(w)
    return {
        '--rocket-left': left,
        '--rocket-top': top,
        '--rocket-width': '300px',
        '--rocket-height': '300px',
        '--rocket-phase1-end-y-ratio': String(phase1EndYRatio),
    }
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
        '--robot-hand-end-x-delta': '0',
        '--projets-text-top': '5vh',
        '--projets-text-right': '10vw',
        '--projets-text-max-width': '40vw',
    }
}

/** Portrait image : top en vh, valeur par défaut 5. applyShortWideMix adapte pour 1920×945. */
function computePortraitCssVars(): Record<string, string> {
    return { '--portrait-image-top-vh': '5' }
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

/** Valeurs cibles contact pour 1366×768 (nearGolden). Interpolation 1348→1366 sans toucher au golden. */
const NEAR_GOLDEN_CONTACT = {
    contactMessageLabelTop: 55,
    contactSvgTop: 34.5,
    contactSvgHeightVh: 57,
    contactMessageTop: 35,
    contactMessageTextareaFocusMtVh: 0,
    contactMessageTextareaFocusMlVw: -0.5,
    contactMessageTextareaFocusWidth: 94,
    contactArcScrollLeftPx: -45.5,
    contactArcScrollTopPx: -4,
    contactArcScrollHeightPercent: 70,
    contactArcScrollWidthPx: 80,
    contactPrenomTop: 9,
    contactPrenomLeft: 34,
    contactPrenomWidth: 12.5,
    contactPrenomLabelTyVh: -3.5,
    contactNomTop: 4,
    contactNomWidth: 12.5,
    contactNomLabelTyVh: -5.5,
    contactSocieteTop: 21,
    contactSocieteLeft: 23.5,
    contactSocieteWidth: 15,
    contactSocieteLabelTxVw: -9,
    contactEmailTop: 13,
    contactEmailLeft: 39,
    contactEmailWidth: 18,
    contactSubmitTop: 38.5,
    contactSubmitLeft: 47,
    contactMessageLabelTyVh: -15.5,
    contactMessageLabelLeft: -3,
} as const

/** Bases pour arc-scroll (golden / CSS) utilisées si les tokens ne sont pas encore définis. */
const CONTACT_ARC_SCROLL_BASE = { leftPx: -36.5, topPx: 0, heightPercent: 70, widthPx: 84 } as const

/** Applique le mix contact pour 1348 < w <= 1366 (nearGolden). Ne modifie pas 1348 ni w > 1366. */
function applyNearGoldenContactMix(cssVars: Record<string, string>, w: number): void {
    if (w <= GOLDEN_REF_WIDTH || w > NEAR_GOLDEN_MAX_WIDTH) return
    const t = getNearGoldenT(w)
    const labelTopBase = parsePercent(cssVars['--contact-message-label-top'] ?? '70')
    const svgTopBase = parsePercent(cssVars['--contact-svg-top'] ?? '36.5')
    const svgHeightVhBase = parseVh(cssVars['--contact-svg-height-vh'] ?? '63') || 63
    cssVars['--contact-message-label-top'] = String(lerp(labelTopBase, NEAR_GOLDEN_CONTACT.contactMessageLabelTop, t).toFixed(1))
    cssVars['--contact-svg-top'] = String(lerp(svgTopBase, NEAR_GOLDEN_CONTACT.contactSvgTop, t).toFixed(1))
    cssVars['--contact-svg-height-vh'] = String(Math.round(lerp(svgHeightVhBase, NEAR_GOLDEN_CONTACT.contactSvgHeightVh, t)))

    const msgTopBase = parsePercent(cssVars['--contact-message-top'] ?? '37')
    const msgMtVhBase = parseVh(cssVars['--contact-message-textarea-focus-mt-vh'] ?? '3.8') || 3.8
    const msgMlVwBase = parseVw(cssVars['--contact-message-textarea-focus-ml-vw'] ?? '2.5') || 2.5
    const msgWidthBase = parsePercent(cssVars['--contact-message-textarea-focus-width'] ?? '80')
    cssVars['--contact-message-top'] = String(lerp(msgTopBase, NEAR_GOLDEN_CONTACT.contactMessageTop, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-mt-vh'] = String(lerp(msgMtVhBase, NEAR_GOLDEN_CONTACT.contactMessageTextareaFocusMtVh, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-ml-vw'] = String(lerp(msgMlVwBase, NEAR_GOLDEN_CONTACT.contactMessageTextareaFocusMlVw, t).toFixed(1))
    cssVars['--contact-message-textarea-focus-width'] = String(Math.round(lerp(msgWidthBase, NEAR_GOLDEN_CONTACT.contactMessageTextareaFocusWidth, t)))

    const arcLeftBase = parsePx(cssVars['--contact-arc-scroll-left'] ?? '', CONTACT_ARC_SCROLL_BASE.leftPx)
    const arcTopBase = parseFloat(cssVars['--contact-arc-scroll-top'] ?? String(CONTACT_ARC_SCROLL_BASE.topPx)) || CONTACT_ARC_SCROLL_BASE.topPx
    const arcHeightBase = parsePercent(cssVars['--contact-arc-scroll-height'] ?? String(CONTACT_ARC_SCROLL_BASE.heightPercent)) || CONTACT_ARC_SCROLL_BASE.heightPercent
    const arcWidthBase = parsePx(cssVars['--contact-arc-scroll-width'] ?? '', CONTACT_ARC_SCROLL_BASE.widthPx)
    const arcLeftVal = lerp(arcLeftBase, NEAR_GOLDEN_CONTACT.contactArcScrollLeftPx, t)
    cssVars['--contact-arc-scroll-left'] = (arcLeftVal % 1 !== 0) ? `${parseFloat(arcLeftVal.toFixed(1))}px` : `${Math.round(arcLeftVal)}px`
    cssVars['--contact-arc-scroll-top'] = String(Math.round(lerp(arcTopBase, NEAR_GOLDEN_CONTACT.contactArcScrollTopPx, t)))
    cssVars['--contact-arc-scroll-height'] = String(Math.round(lerp(arcHeightBase, NEAR_GOLDEN_CONTACT.contactArcScrollHeightPercent, t))) + '%'
    cssVars['--contact-arc-scroll-width'] = String(Math.round(lerp(arcWidthBase, NEAR_GOLDEN_CONTACT.contactArcScrollWidthPx, t))) + 'px'

    const prenomTopBase = parsePercent(cssVars['--contact-prenom-top'] ?? '6.8')
    const prenomLeftBase = parsePercent(cssVars['--contact-prenom-left'] ?? '36')
    const prenomWidthBase = parsePercent(cssVars['--contact-prenom-width'] ?? '13.5')
    const prenomLabelTyVhBase = parseVh(cssVars['--contact-prenom-label-ty-vh'] ?? '-3.1') || -3.1
    cssVars['--contact-prenom-top'] = String(lerp(prenomTopBase, NEAR_GOLDEN_CONTACT.contactPrenomTop, t).toFixed(1))
    cssVars['--contact-prenom-left'] = String(lerp(prenomLeftBase, NEAR_GOLDEN_CONTACT.contactPrenomLeft, t).toFixed(1))
    cssVars['--contact-prenom-width'] = String(lerp(prenomWidthBase, NEAR_GOLDEN_CONTACT.contactPrenomWidth, t).toFixed(1))
    cssVars['--contact-prenom-label-ty-vh'] = String(lerp(prenomLabelTyVhBase, NEAR_GOLDEN_CONTACT.contactPrenomLabelTyVh, t).toFixed(1))

    const nomTopBase = parsePercent(cssVars['--contact-nom-top'] ?? '3.5')
    const nomWidthBase = parsePercent(cssVars['--contact-nom-width'] ?? '13.5')
    const nomLabelTyVhBase = parseVh(cssVars['--contact-nom-label-ty-vh'] ?? '-9.2') || -9.2
    cssVars['--contact-nom-top'] = String(lerp(nomTopBase, NEAR_GOLDEN_CONTACT.contactNomTop, t).toFixed(1))
    cssVars['--contact-nom-width'] = String(lerp(nomWidthBase, NEAR_GOLDEN_CONTACT.contactNomWidth, t).toFixed(1))
    cssVars['--contact-nom-label-ty-vh'] = String(lerp(nomLabelTyVhBase, NEAR_GOLDEN_CONTACT.contactNomLabelTyVh, t).toFixed(1))

    const societeTopBase = parsePercent(cssVars['--contact-societe-top'] ?? '22')
    const societeLeftBase = parsePercent(cssVars['--contact-societe-left'] ?? '24.5')
    const societeWidthBase = parsePercent(cssVars['--contact-societe-width'] ?? '16.5')
    const societeTxVwBase = parseVw(cssVars['--contact-societe-label-tx-vw'] ?? '-9.5')
    cssVars['--contact-societe-top'] = String(lerp(societeTopBase, NEAR_GOLDEN_CONTACT.contactSocieteTop, t).toFixed(1))
    cssVars['--contact-societe-left'] = String(lerp(societeLeftBase, NEAR_GOLDEN_CONTACT.contactSocieteLeft, t).toFixed(1))
    cssVars['--contact-societe-width'] = String(lerp(societeWidthBase, NEAR_GOLDEN_CONTACT.contactSocieteWidth, t).toFixed(1))
    cssVars['--contact-societe-label-tx-vw'] = String(lerp(societeTxVwBase, NEAR_GOLDEN_CONTACT.contactSocieteLabelTxVw, t).toFixed(1))

    const emailTopBase = parsePercent(cssVars['--contact-email-top'] ?? '13.5')
    const emailLeftBase = parsePercent(cssVars['--contact-email-left'] ?? '42')
    const emailWidthBase = parsePercent(cssVars['--contact-email-width'] ?? '19')
    cssVars['--contact-email-top'] = String(lerp(emailTopBase, NEAR_GOLDEN_CONTACT.contactEmailTop, t).toFixed(1))
    cssVars['--contact-email-left'] = String(lerp(emailLeftBase, NEAR_GOLDEN_CONTACT.contactEmailLeft, t).toFixed(1))
    cssVars['--contact-email-width'] = String(lerp(emailWidthBase, NEAR_GOLDEN_CONTACT.contactEmailWidth, t).toFixed(1))

    const submitTopBase = parsePercent(cssVars['--contact-submit-top'] ?? '41')
    const submitLeftBase = parsePercent(cssVars['--contact-submit-left'] ?? '50.5')
    cssVars['--contact-submit-top'] = String(lerp(submitTopBase, NEAR_GOLDEN_CONTACT.contactSubmitTop, t).toFixed(1))
    cssVars['--contact-submit-left'] = String(lerp(submitLeftBase, NEAR_GOLDEN_CONTACT.contactSubmitLeft, t).toFixed(1))

    const labelTyVhBase = parseVh(cssVars['--contact-message-label-ty-vh'] ?? '-18.5') || -18.5
    const labelLeftBase = parsePercent(cssVars['--contact-message-label-left'] ?? '0') || 0
    cssVars['--contact-message-label-ty-vh'] = String(lerp(labelTyVhBase, NEAR_GOLDEN_CONTACT.contactMessageLabelTyVh, t).toFixed(1))
    cssVars['--contact-message-label-left'] = String(lerp(labelLeftBase, NEAR_GOLDEN_CONTACT.contactMessageLabelLeft, t).toFixed(1))
}

/** Contact form : réf. golden 1348×768 (valeurs numériques pour tokens). Pas de variation golden/nearGolden. */
function computeContactFormCssVars(): Record<string, string> {
    return {
        '--contact-nom-top': '3.5',
        '--contact-nom-left': '16',
        '--contact-nom-width': '13.5',
        '--contact-nom-min-width-px': '100',
        '--contact-nom-rotate-deg': '-4',
        '--contact-nom-label-ty-vh': '-9.2',
        '--contact-prenom-top': '6.8',
        '--contact-prenom-left': '36',
        '--contact-prenom-width': '13.5',
        '--contact-prenom-min-width-px': '100',
        '--contact-prenom-rotate-deg': '11',
        '--contact-prenom-label-ty-vh': '-3.1',
        '--contact-prenom-input-mt-em': '-0.5',
        '--contact-societe-top': '22',
        '--contact-societe-left': '24.5',
        '--contact-societe-width': '16.5',
        '--contact-societe-label-tx-vw': '-9.5',
        '--contact-societe-label-ty-vh': '-1.5',
        '--contact-label-font-size-rem': '0.65',
        '--contact-email-top': '13.5',
        '--contact-email-left': '42',
        '--contact-email-width': '19',
        '--contact-email-label-x-vh': '0',
        '--contact-email-label-ty-vh': '-5',
        '--contact-message-top': '37',
        '--contact-message-textarea-focus-mt-vh': '3.8',
        '--contact-message-textarea-focus-ml-vw': '2.5',
        '--contact-message-textarea-focus-width': '80',
        '--contact-message-label-top': '70',
        '--contact-message-label-left': '0',
        '--contact-message-label-tx-vw': '-4',
        '--contact-message-label-ty-vh': '-18.5',
        '--contact-message-textarea-height': '11.5',
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
 * Calcule tous les tokens responsive à partir du viewport officiel.
 * Source unique : getResponsiveViewport(metrics) pour presets, --vw/--vh et retour.
 */
export function computeResponsiveTokens(metrics: ViewportMetricsInput): ResponsiveTokens {
    const viewport = getResponsiveViewport(metrics)
    const w = viewport.width
    const h = viewport.height
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
    const portrait = computePortraitCssVars()

    const cssVars: Record<string, string> = {
        '--vw': `${w}px`,
        '--vh': `${h}px`,
        '--ar': String(aspect.toFixed(4)),
        '--scale': String(scale.toFixed(4)),
        '--scale-clamped': String(scaleClamped.toFixed(4)),
        '--contact-arc-scroll-left': `${CONTACT_ARC_SCROLL_BASE.leftPx}px`,
        '--contact-arc-scroll-top': String(CONTACT_ARC_SCROLL_BASE.topPx),
        '--contact-arc-scroll-height': `${CONTACT_ARC_SCROLL_BASE.heightPercent}%`,
        '--contact-arc-scroll-width': `${CONTACT_ARC_SCROLL_BASE.widthPx}px`,
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
        ...portrait,
    }
    if (cssVars['--presentation-margin-top-vh'] === undefined) {
        cssVars['--presentation-margin-top-vh'] = String(PRESENTATION_MARGIN_TOP_VH_BASE)
    }
    applyNearGoldenContactMix(cssVars, w)
    applyMidDesktopMix(cssVars, w, h)
    apply1440x900Mix(cssVars, w, h)
    applyWideDesktopMix(cssVars, w, h)
    applyShortWideMix(cssVars, w, h)

    if (isNearGoldenViewport(w, h)) {
        cssVars['--rocket-landed-x-px'] = '4650'
        cssVars['--rocket-landed-y-px'] = '770.304'
    }
    if (w === 1536 && h === 864) {
        cssVars['--exp-alien2-top-percent'] = '48.2'
        cssVars['--exp-alien2-width-px'] = '87'
        cssVars['--mask-chemine-bottom'] = '31'
        cssVars['--mask-chemine-height'] = '42.1'
        cssVars['--mask-chemine-clip-raw'] = 'polygon(100% 4%, 178% 0, 100% 100%, 0% 100%, 0% 45.5%)'
        cssVars['--robot-above-y-percent'] = '38.5'
        cssVars['--robot-ground-y-percent'] = '47.5'
        cssVars['--contact-message-top'] = '29'
        cssVars['--contact-message-label-top'] = '72'
        cssVars['--contact-message-label-ty-vh'] = '-17.5'
        cssVars['--contact-nom-label-ty-vh'] = '-4.8'
        cssVars['--contact-prenom-top'] = '6.2'
        cssVars['--contact-societe-label-tx-vw'] = '-7.5'
        cssVars['--contact-email-label-ty-vh'] = '-4'
        cssVars['--contact-message-textarea-focus-mt-vh'] = '0.25'
        cssVars['--contact-message-textarea-focus-ml-vw'] = '0.2'
        cssVars['--contact-message-textarea-focus-width'] = '94'
        cssVars['--rocket-landed-x-px'] = '4605.84'
        cssVars['--rocket-landed-y-px'] = '773.852'
    }

    const phase1EndYRatio = parseFloat(cssVars['--rocket-phase1-end-y-ratio'] ?? '0.95') || 0.95
    cssVars['--rocket-phase1-end-y-px'] = String(Math.round(phase1EndYRatio * h))

    const robotAboveYPercent = parseFloat(cssVars['--robot-above-y-percent']) || 50
    const robotGroundYPercent = parseFloat(cssVars['--robot-ground-y-percent']) || 61

    const responsiveDebug = typeof window !== 'undefined' && (window as Window & { __RESPONSIVE_DEBUG__?: boolean }).__RESPONSIVE_DEBUG__
    if (responsiveDebug) {
        const tMid = getTMid(w, h)
        const tWide = getTWide(w, h)
        console.log('[responsive] pipeline', {
            viewportOfficialW: w,
            viewportOfficialH: h,
            metricsW: metrics.width,
            metricsH: metrics.height,
            presetSelectionSource: 'viewportOfficial',
            tMid,
            tWide,
            cssVarVw: cssVars['--vw'],
            cssVarVh: cssVars['--vh'],
            robotAbove: robotAboveYPercent,
            robotGround: robotGroundYPercent,
        })
    }

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
const UI_TOKEN_PREFIXES = ['--mask-chemine-', '--mask-convoyeur-', '--contact-svg-', '--contact-arc-scroll-', '--contact-nom-', '--contact-prenom-', '--contact-societe-', '--contact-email-', '--contact-message-', '--contact-submit-', '--contact-label-']

export function applyResponsiveTokens(stage: HTMLElement, tokens: ResponsiveTokens): void {
    const responsiveDebug = typeof window !== 'undefined' && (window as Window & { __RESPONSIVE_DEBUG__?: boolean }).__RESPONSIVE_DEBUG__
    let vwVhLogged = false
    let viewportAtApply: { width: number; height: number } | null = null
    const getViewportAtApply = () => {
        if (!viewportAtApply) viewportAtApply = getResponsiveViewport()
        return viewportAtApply
    }
    Object.entries(tokens.cssVars).forEach(([key, value]) => {
        let valueToSet = value
        if (key === '--vw' || key === '--vh') {
            const v = getViewportAtApply()
            valueToSet = key === '--vw' ? `${v.width}px` : `${v.height}px`
        }
        if (responsiveDebug && (key === '--vw' || key === '--vh') && !vwVhLogged) {
            vwVhLogged = true
            const prevVw = stage.style.getPropertyValue('--vw')?.trim() || null
            const prevVh = stage.style.getPropertyValue('--vh')?.trim() || null
            const targetId = stage.getAttribute?.('data-debug-id') ?? stage.className ?? stage.tagName
            const vwVal = tokens.cssVars['--vw']
            const vhVal = tokens.cssVars['--vh']
            const v = getViewportAtApply()
            const vwWritten = `${v.width}px`
            const vhWritten = `${v.height}px`
            const isOverwrite = (prevVw && prevVw !== vwWritten) || (prevVh && prevVh !== vhWritten)
            const logPayload = {
                target: targetId,
                targetClassName: stage.className,
                targetTagName: stage.tagName,
                vwFromTokens: tokens.cssVars['--vw'],
                vhFromTokens: tokens.cssVars['--vh'],
                vwWritten,
                vhWritten,
                source: 'applyResponsiveTokens',
                inspectHint: 'Pour --vw/--vh : élément data-debug-id="responsive-stage" ou .horizontal-scroll-stage',
                ...((prevVw || prevVh) ? { previousVw: prevVw, previousVh: prevVh } : {}),
            }
            if (isOverwrite) {
                console.log('[responsive] overwrite css vars', logPayload)
            } else {
                console.log('[responsive] set css vars', logPayload)
            }
        }
        stage.style.setProperty(key, valueToSet)
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

    // Instrumentation temporaire : activable avec window.__RESPONSIVE_DEBUG__ = true (comparer tokens aux presets 1348/1366/1536/1920).
    if (typeof window !== 'undefined' && (window as Window & { __RESPONSIVE_DEBUG__?: boolean }).__RESPONSIVE_DEBUG__) {
        const tNearGolden = getNearGoldenT(tokens.w)
        const tMid = getTMid(tokens.w, tokens.h)
        const tWide = getTWide(tokens.w, tokens.h)
        const v = tokens.cssVars
        const log: Record<string, unknown> = {
            viewport: { w: tokens.w, h: tokens.h },
            tNearGolden,
            tMid,
            tWide,
            habitation: {
                '--exp-hab-top-px': v['--exp-hab-top-px'],
                '--exp-hab-left-px': v['--exp-hab-left-px'],
                '--exp-hab-w-px': v['--exp-hab-w-px'],
                '--exp-hab-h-px': v['--exp-hab-h-px'],
            },
            convoyeur: {
                '--convoyeur-left-px': v['--convoyeur-left-px'],
                '--convoyeur-bottom-px': v['--convoyeur-bottom-px'],
                '--convoyeur-w-px': v['--convoyeur-w-px'],
                '--convoyeur-h': v['--convoyeur-h'],
                '--convoyeur-end-correction-x-px': v['--convoyeur-end-correction-x-px'],
            },
            maskChemine: {
                '--mask-chemine-bottom': v['--mask-chemine-bottom'],
                '--mask-chemine-height': v['--mask-chemine-height'],
            },
            robot: {
                '--robot-above-y-percent': v['--robot-above-y-percent'],
                '--robot-ground-y-percent': v['--robot-ground-y-percent'],
            },
            rocket: {
                '--rocket-phase1-end-y-ratio': v['--rocket-phase1-end-y-ratio'],
                '--rocket-phase1-end-y-px': v['--rocket-phase1-end-y-px'],
            },
            contact: {
                '--contact-svg-left': v['--contact-svg-left'],
                '--contact-svg-top': v['--contact-svg-top'],
                '--contact-prenom-top': v['--contact-prenom-top'],
                '--contact-societe-top': v['--contact-societe-top'],
            },
        }
        const PRESETS_1348 = { hab: { top: 461, left: 779, w: 1032, h: 500 }, convoyeur: { left: -700, bottom: 188, w: 1481 } }
        const PRESETS_1366 = { hab: { top: 423, left: 779, w: 1000, h: 500 }, convoyeur: { left: -717, bottom: 248, w: 1443 } }
        const PRESETS_1536 = { hab: { top: MID_1536_864.expHabTopPx, w: MID_1536_864.expHabWPx } }
        const PRESETS_1920 = { hab: { top: WIDE_1920_1080.expHabTopPx, w: WIDE_1920_1080.expHabWPx }, maskChemine: { bottom: WIDE_1920_1080.maskChemineBottom, height: WIDE_1920_1080.maskChemineHeight } }
        const ref = (tokens.w === 1348 && tokens.h === 768) ? PRESETS_1348 : (tokens.w === 1366 && tokens.h === 768) ? PRESETS_1366 : (tokens.w === 1536 && tokens.h === 864) ? PRESETS_1536 : (tokens.w === 1920 && tokens.h === 1080) ? PRESETS_1920 : null
        if (ref) (log as Record<string, unknown>).expectedPreset = ref
        console.log('[RESPONSIVE_DEBUG]', log)
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
