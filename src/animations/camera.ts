/**
 * Caméra simplifiée: offset éventuel sans scale global.
 */

import { gsap } from 'gsap'

export type Camera = {
    offsetX: number
    offsetY: number
    viewportW: number
    viewportH: number
}

export type ComputeCameraOptions = {
    viewportW: number
    viewportH: number
    worldW: number
    worldH: number
}

/**
 * Calcule une caméra neutre (pas de zoom global).
 */
export function computeCamera(options: ComputeCameraOptions): Camera {
    const { viewportW, viewportH } = options
    return {
        offsetX: 0,
        offsetY: 0,
        viewportW,
        viewportH,
    }
}

/**
 * Applique uniquement un offset éventuel sur le stage.
 */
export function applyCamera(stageEl: HTMLElement, camera: Camera): void {
    gsap.set(stageEl, {
        x: camera.offsetX,
        y: camera.offsetY,
        force3D: true,
    })
}
