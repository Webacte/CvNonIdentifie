import {
    CONVOYEUR_PROJET_VIEWBOX_HEIGHT,
    CONVOYEUR_SCALE_X,
    CONVOYEUR_TOP_PERCENT,
    EXP_BATTANT_OFFSET_X,
    EXP_BATTANT_OFFSET_Y,
    EXP_BATTANT_PIVOT_X,
    EXP_BATTANT_PIVOT_Y,
    EXP_BATTANT_ROTATE_END,
    EXP_BATTANT_ROTATE_START,
    EXP_CONVEYOR_END_X,
    EXP_CONVEYOR_START_X,
} from './constants'

function roundSvgScalar(value: number, decimals: number): number {
    const p = 10 ** decimals
    return Math.round(value * p) / p
}

export type ProjetsConvoyeurBattantApplyParams = {
    conv: Element | null
    batt: Element | null
    conveyorRotateProgress: number
    conveyorSlideProgress: number
    /** `.horizontal-scroll-stage` : sert à lire `--projets-convoyeur-slide-end-x` */
    stageEl: HTMLElement | null
}

/**
 * Applique translate/scale sur #convoyeur-motion et rotate sur #battant-motion.
 * État interne : réinitialisé si le nœud DOM change (ré-injection innerHTML).
 */
export function createProjetsConvoyeurBattantApplier() {
    let attachedConv: Element | null = null
    let attachedBatt: Element | null = null
    let lastConvTransform = ''
    let lastBattTransform = ''

    return (params: ProjetsConvoyeurBattantApplyParams): void => {
        const { conv, batt, conveyorRotateProgress, conveyorSlideProgress, stageEl } = params

        if (conv !== attachedConv) {
            attachedConv = conv
            lastConvTransform = ''
        }
        if (batt !== attachedBatt) {
            attachedBatt = batt
            lastBattTransform = ''
        }

        const isSvgEl = (el: Element): el is SVGElement => el.namespaceURI === 'http://www.w3.org/2000/svg'
        const setSvgTransform = (el: Element, value: string) => {
            if (isSvgEl(el)) el.setAttribute('transform', value)
            else (el as HTMLElement).style.transform = value
        }

        const slideEndToken = stageEl
            ? getComputedStyle(stageEl).getPropertyValue('--projets-convoyeur-slide-end-x').trim()
            : ''
        const slideEndParsed = parseFloat(slideEndToken)
        const slideEndX = Number.isFinite(slideEndParsed) ? slideEndParsed : EXP_CONVEYOR_END_X

        const ty = roundSvgScalar(CONVOYEUR_PROJET_VIEWBOX_HEIGHT * (CONVOYEUR_TOP_PERCENT / 100), 3)
        const sx = roundSvgScalar(CONVOYEUR_SCALE_X, 4)
        const slideP = roundSvgScalar(conveyorSlideProgress, 4)
        const slideX = roundSvgScalar(EXP_CONVEYOR_START_X + (slideEndX - EXP_CONVEYOR_START_X) * slideP, 3)
        const convTransform = `translate(${slideX}, ${ty}) scale(${sx}, 1)`

        if (conv && convTransform !== lastConvTransform) {
            setSvgTransform(conv, convTransform)
            lastConvTransform = convTransform
        }

        const angle =
            EXP_BATTANT_ROTATE_START +
            conveyorRotateProgress * (EXP_BATTANT_ROTATE_END - EXP_BATTANT_ROTATE_START)
        const br = roundSvgScalar(angle, 2)
        const px = roundSvgScalar(EXP_BATTANT_PIVOT_X, 4)
        const py = roundSvgScalar(EXP_BATTANT_PIVOT_Y, 4)
        const battTransform = `translate(${EXP_BATTANT_OFFSET_X}, ${EXP_BATTANT_OFFSET_Y}) rotate(${br}, ${px}, ${py})`

        if (batt && battTransform !== lastBattTransform) {
            setSvgTransform(batt, battTransform)
            lastBattTransform = battTransform
        }
    }
}
