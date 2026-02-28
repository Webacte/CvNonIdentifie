/**
 * Caméra World + Camera : scale + translate pour adapter le monde au viewport.
 * Le stage applique cette caméra (transform-origin: 0 0).
 */

import { gsap } from 'gsap'

export type Camera = {
    scale: number
    offsetX: number
    offsetY: number
    worldW: number
    worldH: number
    viewportW: number
    viewportH: number
}

export type ComputeCameraOptions = {
    viewportW: number
    viewportH: number
    worldW: number
    worldH: number
    /** contain = tout le monde visible (bandes vides sur les côtés si viewport large). cover = remplit tout l'écran (recadrage possible). */
    mode?: 'contain' | 'cover'
    center?: boolean
}

/**
 * Calcule la caméra pour adapter le monde au viewport.
 * contain : tout le monde visible, bandes vides possibles (ex. desktop).
 * cover : remplit tout le viewport, recadrage si ratio différent.
 */
export function computeCamera(options: ComputeCameraOptions): Camera {
    const { viewportW, viewportH, worldW, worldH, mode = 'contain', center = true } = options
    const scaleX = worldW > 0 ? viewportW / worldW : 1
    const scaleY = worldH > 0 ? viewportH / worldH : 1
    const scale = mode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)
    const offsetX = center ? (viewportW - worldW * scale) / 2 : 0
    const offsetY = center ? (viewportH - worldH * scale) / 2 : 0
    return {
        scale,
        offsetX,
        offsetY,
        worldW,
        worldH,
        viewportW,
        viewportH,
    }
}

/**
 * Applique la caméra sur l’élément stage (transform: translate + scale).
 * Le CSS du stage doit avoir transform-origin: 0 0.
 */
export function applyCamera(stageEl: HTMLElement, camera: Camera): void {
    gsap.set(stageEl, {
        x: camera.offsetX,
        y: camera.offsetY,
        scale: camera.scale,
        force3D: true,
    })
}
