/**
 * Wipe Cloth : effacement réaliste "chiffon" pour les textes SVG handwriting.
 * Utilise un <mask> SVG + tamponnage déterministe le long d'une trajectoire.
 * Blanc dans le mask = visible, noir = effacé.
 */

const SVG_NS = 'http://www.w3.org/2000/svg'

const MAX_STAMPS = 250

/** Activer les logs de débogage pour le wipe cloth (à désactiver en prod). */
const DEBUG_WIPE_CLOTH = true
function debugWipe(...args: unknown[]) {
    if (DEBUG_WIPE_CLOTH) console.log('[wipeCloth]', ...args)
}
const STAMP_BLUR = 0.8
const PAD_X_RATIO = 0.08
const PAD_Y_RATIO = 0.2
const PAD_MIN = 10
/** Marge fixe en bas (unités SVG) pour que la trajectoire descende bien sous la dernière ligne. */
const EXTRA_BOTTOM = 80

/** Debug visuel : rectangles contentBBox (vert), region (orange), cercle dernier stamp (rouge). */
const DEBUG_WIPE_GEOM = false

/** Debug bbox/région pour effacement clone : logs détaillés + alerte si bbox/region trop petite. */
const DEBUG_ERASE_BBOX = true

export interface ClothWipeController {
    setProgress: (p: number) => void
}

interface RegionRect {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Retourne le groupe racine d'effacement : soit l'unique <g> contenu (ex. layer1),
 * soit un nouveau <g data-wipe-root="true"> contenant tous les enfants graphiques (hors defs).
 */
function ensureWipeRoot(svg: SVGSVGElement): SVGGElement {
    const defs = svg.querySelector('defs')
    const contentChildren = Array.from(svg.children).filter(
        (n) => n.nodeName.toLowerCase() !== 'defs' && n !== defs
    )
    if (contentChildren.length === 1 && contentChildren[0].nodeName.toLowerCase() === 'g') {
        return contentChildren[0] as SVGGElement
    }
    const wipeRoot = document.createElementNS(SVG_NS, 'g')
    wipeRoot.setAttribute('data-wipe-root', 'true')
    contentChildren.forEach((child) => wipeRoot.appendChild(child))
    svg.appendChild(wipeRoot)
    return wipeRoot
}

/** Pseudo-random déterministe à partir de blockIndex et stampIndex. */
function seed(blockIndex: number, stampIndex: number): number {
    return Math.sin(blockIndex * 7 + stampIndex * 13) * 0.5 + 0.5
}

function seedRange(blockIndex: number, stampIndex: number, min: number, max: number): number {
    return min + seed(blockIndex, stampIndex) * (max - min)
}

/**
 * Génère les points de la trajectoire dans la région (contentBBox + padding).
 * Zigzag horizontal, direction alternée, pour couvrir toute la hauteur (y0..y1) jusqu'en bas.
 */
function buildTrajectory(
    region: RegionRect,
    stepPx: number
): { points: { x: number; y: number }[]; cumDist: number[]; totalLength: number } {
    const x0 = region.x
    const x1 = region.x + region.width
    const y0 = region.y
    const y1 = region.y + region.height

    const numLines = Math.max(6, Math.min(16, Math.round(region.height / (stepPx * 1.2))))
    const stepY = (y1 - y0) / (numLines - 1)
    const points: { x: number; y: number }[] = []

    for (let row = 0; row < numLines; row++) {
        const y = y0 + row * stepY
        if (row % 2 === 0) {
            for (let x = x0; x <= x1; x += stepPx) {
                points.push({ x, y })
            }
        } else {
            for (let x = x1; x >= x0; x -= stepPx) {
                points.push({ x, y })
            }
        }
    }

    const cumDist: number[] = [0]
    let totalLength = 0
    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        totalLength += Math.hypot(b.x - a.x, b.y - a.y)
        cumDist[i] = totalLength
    }
    return { points, cumDist, totalLength }
}

/**
 * Échantillonne la trajectoire uniformément par distance pour avoir au plus maxPoints points
 * répartis du début à la fin du chemin (pour que l'effacement couvre toute la hauteur).
 */
function samplePointsByDistance(
    points: { x: number; y: number }[],
    cumDist: number[],
    totalLength: number,
    maxPoints: number
): { points: { x: number; y: number }[]; cumDist: number[]; totalLength: number } {
    if (points.length <= maxPoints || totalLength <= 0) {
        return { points, cumDist, totalLength }
    }
    const n = maxPoints
    const sampled: { x: number; y: number }[] = []
    const sampledCumDist: number[] = []
    for (let k = 0; k < n; k++) {
        const targetDist = (k / (n - 1)) * totalLength
        let i = 0
        while (i < cumDist.length - 1 && cumDist[i + 1] < targetDist) i++
        const a = points[i]
        const b = points[Math.min(i + 1, points.length - 1)]
        const d0 = cumDist[i]
        const d1 = cumDist[Math.min(i + 1, cumDist.length - 1)]
        const t = d1 > d0 ? (targetDist - d0) / (d1 - d0) : 0
        sampled.push({
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
        })
        sampledCumDist.push((k / (n - 1)) * totalLength)
    }
    return { points: sampled, cumDist: sampledCumDist, totalLength }
}

/** Crée un path blob allongé (forme chiffon) centré en 0,0. Taille x4 pour traces d'effacement bien visibles. */
function createStampPathShape(): SVGPathElement {
    const path = document.createElementNS(SVG_NS, 'path')
    // Ellipse-like blob, flattened (chiffon), 4x pour grosses traces d'effacement
    const w = 128
    const h = 56
    const d = `M${-w / 2},0 Q${w / 2},${-h / 2} ${w / 2},0 Q${w / 2},${h / 2} ${-w / 2},0 Q${-w / 2},${-h / 2} ${-w / 2},0 Z`
    path.setAttribute('d', d)
    path.setAttribute('fill', '#000')
    return path
}

/**
 * Initialise le wipe cloth pour un SVG (clone ou live) et retourne son contrôleur.
 * Mask appliqué sur wipeRoot (groupe du contenu), région et trajectoire basées sur contentBBox.
 * Exporté pour setup sur clones overlay (jamais sur SVG Vivus vivant).
 */
export function setupClothWipeForClone(svg: SVGSVGElement, blockIndex: number): ClothWipeController {
    let defs = svg.querySelector('defs')
    if (!defs) {
        defs = document.createElementNS(SVG_NS, 'defs')
        svg.insertBefore(defs, svg.firstChild)
    }

    const wipeRoot = ensureWipeRoot(svg)
    const contentBBox = wipeRoot.getBBox()
    const padX = Math.max(PAD_MIN, contentBBox.width * PAD_X_RATIO)
    const padY = Math.max(PAD_MIN, contentBBox.height * PAD_Y_RATIO)
    const region: RegionRect = {
        x: contentBBox.x - padX,
        y: contentBBox.y - padY,
        width: contentBBox.width + 2 * padX,
        height: contentBBox.height + 2 * padY + EXTRA_BOTTOM,
    }
    const step = Math.max(10, Math.min(18, region.width / 60))
    const trajectory = buildTrajectory(region, step)
    const { points, cumDist, totalLength } = samplePointsByDistance(
        trajectory.points,
        trajectory.cumDist,
        trajectory.totalLength,
        MAX_STAMPS
    )
    const numPoints = points.length
    debugWipe(`setup block ${blockIndex}`, { contentBBox, region, numPoints, totalLength: Math.round(totalLength) })

    if (DEBUG_ERASE_BBOX) {
        const rect = svg.getBoundingClientRect()
        const overlay = svg.closest('.quest-erase-overlay')
        const overlayRect = overlay ? (overlay as HTMLElement).getBoundingClientRect() : null
        const vb = svg.viewBox?.baseVal
        const debugInfo = {
            blockIndex,
            contentBBox: { x: contentBBox.x, y: contentBBox.y, width: contentBBox.width, height: contentBBox.height },
            region: { x: region.x, y: region.y, width: region.width, height: region.height },
            cloneRect: { width: rect.width, height: rect.height },
            overlayRect: overlayRect ? { width: overlayRect.width, height: overlayRect.height } : null,
            viewBox: vb ? { x: vb.x, y: vb.y, width: vb.width, height: vb.height } : null,
            numStamps: numPoints,
            totalLength: Math.round(totalLength),
        }
        console.warn('[wipeCloth DEBUG_ERASE_BBOX]', debugInfo)
        const bboxTooSmall = contentBBox.width < 5 || contentBBox.height < 5
        const regionTooSmall = region.width < 10 || region.height < 10
        if (bboxTooSmall || regionTooSmall) {
            console.error(
                '[wipeCloth] ALERT: bbox ou région trop petite pour le wipe - clone peut disparaître !',
                { bboxTooSmall, regionTooSmall, contentBBox, region }
            )
        }
    }

    const maskId = `wipe-mask-${blockIndex}`
    const filterId = `wipe-blur-${blockIndex}`

    const filter = document.createElementNS(SVG_NS, 'filter')
    filter.setAttribute('id', filterId)
    filter.setAttribute('x', '-20%')
    filter.setAttribute('y', '-20%')
    filter.setAttribute('width', '140%')
    filter.setAttribute('height', '140%')
    const feGaussianBlur = document.createElementNS(SVG_NS, 'feGaussianBlur')
    feGaussianBlur.setAttribute('in', 'SourceGraphic')
    feGaussianBlur.setAttribute('stdDeviation', String(STAMP_BLUR))
    filter.appendChild(feGaussianBlur)
    defs.appendChild(filter)

    const mask = document.createElementNS(SVG_NS, 'mask')
    mask.setAttribute('id', maskId)
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse')
    mask.setAttribute('x', String(region.x))
    mask.setAttribute('y', String(region.y))
    mask.setAttribute('width', String(region.width))
    mask.setAttribute('height', String(region.height))

    const whiteRect = document.createElementNS(SVG_NS, 'rect')
    whiteRect.setAttribute('x', String(region.x))
    whiteRect.setAttribute('y', String(region.y))
    whiteRect.setAttribute('width', String(region.width))
    whiteRect.setAttribute('height', String(region.height))
    whiteRect.setAttribute('fill', '#fff')
    mask.appendChild(whiteRect)

    const stampsGroup = document.createElementNS(SVG_NS, 'g')
    stampsGroup.setAttribute('class', 'wipe-stamps')
    mask.appendChild(stampsGroup)
    defs.appendChild(mask)

    const stampPool: SVGPathElement[] = []
    for (let i = 0; i < numPoints; i++) {
        const shape = createStampPathShape()
        shape.setAttribute('filter', `url(#${filterId})`)
        shape.setAttribute('visibility', 'hidden')
        stampsGroup.appendChild(shape)
        stampPool.push(shape)
    }

    let debugGroup: SVGGElement | null = null
    let debugCircle: SVGCircleElement | null = null
    if (DEBUG_WIPE_GEOM) {
        debugGroup = document.createElementNS(SVG_NS, 'g')
        debugGroup.setAttribute('class', 'wipe-debug-geom')
        const rectContent = document.createElementNS(SVG_NS, 'rect')
        rectContent.setAttribute('x', String(contentBBox.x))
        rectContent.setAttribute('y', String(contentBBox.y))
        rectContent.setAttribute('width', String(contentBBox.width))
        rectContent.setAttribute('height', String(contentBBox.height))
        rectContent.setAttribute('fill', 'none')
        rectContent.setAttribute('stroke', 'green')
        rectContent.setAttribute('stroke-width', '1')
        debugGroup.appendChild(rectContent)
        const rectRegion = document.createElementNS(SVG_NS, 'rect')
        rectRegion.setAttribute('x', String(region.x))
        rectRegion.setAttribute('y', String(region.y))
        rectRegion.setAttribute('width', String(region.width))
        rectRegion.setAttribute('height', String(region.height))
        rectRegion.setAttribute('fill', 'none')
        rectRegion.setAttribute('stroke', 'orange')
        rectRegion.setAttribute('stroke-width', '1')
        debugGroup.appendChild(rectRegion)
        debugCircle = document.createElementNS(SVG_NS, 'circle')
        debugCircle.setAttribute('r', '4')
        debugCircle.setAttribute('fill', 'red')
        debugCircle.setAttribute('visibility', 'hidden')
        debugGroup.appendChild(debugCircle)
        svg.appendChild(debugGroup)
    }

    let lastProgress = -1
    let eraseCallCount = 0

    const setProgress = (p: number) => {
        const clamped = Math.max(0, Math.min(1, p))
        if (clamped === lastProgress) return
        lastProgress = clamped

        if (clamped <= 0) {
            wipeRoot.removeAttribute('mask')
            for (let i = 0; i < stampPool.length; i++) {
                stampPool[i].setAttribute('visibility', 'hidden')
            }
            if (debugCircle) debugCircle.setAttribute('visibility', 'hidden')
            if (eraseCallCount > 0) debugWipe(`block ${blockIndex} setProgress(0) → mask removed`)
            return
        }
        wipeRoot.setAttribute('mask', `url(#${maskId})`)
        eraseCallCount++

        const distance = clamped * totalLength
        let N = 0
        for (let i = 0; i < cumDist.length; i++) {
            if (cumDist[i] <= distance) N = i + 1
        }
        N = Math.min(N, numPoints)
        if (eraseCallCount <= 2 || Math.abs(clamped - 0.5) < 0.05) {
            debugWipe(`block ${blockIndex} setProgress(${clamped.toFixed(3)}) → mask on wipeRoot, ${N} stamps visible`)
        }

        for (let i = 0; i < stampPool.length; i++) {
            const stamp = stampPool[i]
            if (i < N) {
                const pt = points[i]
                const jx = seedRange(blockIndex, i, -3, 3)
                const jy = seedRange(blockIndex, i + 100, -2, 2)
                const rot = seedRange(blockIndex, i + 200, -15, 15)
                const sx = seedRange(blockIndex, i + 300, 0.85, 1.15)
                const sy = seedRange(blockIndex, i + 400, 0.9, 1.1)
                stamp.setAttribute(
                    'transform',
                    `translate(${pt.x + jx},${pt.y + jy}) rotate(${rot}) scale(${sx},${sy})`
                )
                stamp.setAttribute('visibility', 'visible')
            } else {
                stamp.setAttribute('visibility', 'hidden')
            }
        }

        if (debugCircle && N > 0) {
            const lastPt = points[N - 1]
            const jx = seedRange(blockIndex, N - 1, -3, 3)
            const jy = seedRange(blockIndex, N - 1 + 100, -2, 2)
            debugCircle.setAttribute('cx', String(lastPt.x + jx))
            debugCircle.setAttribute('cy', String(lastPt.y + jy))
            debugCircle.setAttribute('visibility', 'visible')
        }
    }

    setProgress(0)
    return { setProgress }
}

/**
 * Retourne un tableau vide : les contrôleurs sont créés à la demande lors de l'entrée en erase
 * sur les clones dans l'overlay (via setupClothWipeForClone).
 */
export function setupClothWipeForAllBlocks(_root: ParentNode): ClothWipeController[] {
    return []
}

/**
 * Retourne un tableau vide : on ne setup plus le wipe sur les SVG Vivus vivants.
 * Les contrôleurs sont créés à la demande lors de l'entrée en erase, sur les clones dans l'overlay.
 */
export function ensureClothWipeControllers(_root: ParentNode): ClothWipeController[] {
    return []
}
