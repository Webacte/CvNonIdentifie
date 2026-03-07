'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './ContactArcScrollbar.module.css'
import {
  contactArcScrollbarConfig,
  getContactArcScrollbarPathD,
} from './contactArcScrollbarConfig'

const config = contactArcScrollbarConfig

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Angle en degrés entre deux points (pour tangente du path). */
function angleBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
}

export default function ContactArcScrollbar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const isDraggingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartProgressRef = useRef(0)
  const pathLengthRef = useRef<number>(0)

  const updateThumbPosition = useCallback(() => {
    const pathEl = pathRef.current
    const thumbEl = thumbRef.current
    const containerEl = containerRef.current
    if (!pathEl || !thumbEl || !containerEl) return

    const totalLength = pathEl.getTotalLength()
    pathLengthRef.current = totalLength
    const len = clamp(progress, config.thumbMinProgress, config.thumbMaxProgress) * totalLength
    const point = pathEl.getPointAtLength(len)

    const viewBoxW = config.viewBoxWidth
    const viewBoxH = config.viewBoxHeight
    const xPct = (point.x / viewBoxW) * 100
    const yPct = (point.y / viewBoxH) * 100

    let angle = 0
    if (config.thumbRotationFromPath && totalLength > 0) {
      const delta = Math.min(config.thumbTangentDelta, totalLength - len, len)
      const otherLen = len + delta
      const other = pathEl.getPointAtLength(otherLen)
      angle = angleBetweenPoints(point.x, point.y, other.x, other.y)
    }
    angle += config.thumbRotationManualOffset

    const offsetX = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-offset-x').trim() || '0'
    const offsetY = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-offset-y').trim() || '0'
    const rotateOffset = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-rotate-offset').trim()
    const angleDeg = rotateOffset ? `${angle + parseFloat(rotateOffset)}deg` : `${angle}deg`

    thumbEl.style.left = `${xPct}%`
    thumbEl.style.top = `${yPct}%`
    thumbEl.style.transform = `translate(calc(-50% + ${offsetX}), calc(-50% + ${offsetY})) rotate(${angleDeg})`
  }, [progress])

  useEffect(() => {
    updateThumbPosition()
  }, [updateThumbPosition])

  useEffect(() => {
    const pathEl = pathRef.current
    if (!pathEl) return
    pathLengthRef.current = pathEl.getTotalLength()
    updateThumbPosition()
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      isDraggingRef.current = true
      dragStartYRef.current = e.clientY
      dragStartProgressRef.current = progress
      e.currentTarget.setPointerCapture(e.pointerId)
      if (thumbRef.current) {
        thumbRef.current.style.cursor = 'grabbing'
      }
    },
    [progress]
  )

  useEffect(() => {
    const thumb = thumbRef.current
    const container = containerRef.current
    if (!thumb || !container) return

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const rect = container.getBoundingClientRect()
      const height = rect.height
      if (height <= 0) return
      const deltaY = e.clientY - dragStartYRef.current
      // Comportement naturel : monter = thumb monte (progress diminue), descendre = thumb descend (progress augmente)
      const deltaProgress = deltaY / height
      const newProgress = clamp(
        dragStartProgressRef.current + deltaProgress,
        config.thumbMinProgress,
        config.thumbMaxProgress
      )
      setProgress(newProgress)
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        try {
          thumb.releasePointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
        thumb.style.cursor = 'grab'
      }
    }

    thumb.addEventListener('pointermove', handlePointerMove)
    thumb.addEventListener('pointerup', handlePointerUp)
    thumb.addEventListener('pointercancel', handlePointerUp)
    return () => {
      thumb.removeEventListener('pointermove', handlePointerMove)
      thumb.removeEventListener('pointerup', handlePointerUp)
      thumb.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [])

  const pathD = getContactArcScrollbarPathD(config)

  return (
    <div
      ref={containerRef}
      className={`${styles.contactArcScrollbar} contact-arc-scrollbar`}
      aria-hidden="true"
    >
      <svg
        className={styles.contactArcScrollbar__svg}
        viewBox={`0 0 ${config.viewBoxWidth} ${config.viewBoxHeight}`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className={styles.contactArcScrollbar__track}
          d={pathD}
        />
      </svg>
      <div
        ref={thumbRef}
        className={styles.contactArcScrollbar__thumb}
        onPointerDown={onPointerDown}
      >
        <img
          src="/assets/svg/levier-contact.svg"
          alt=""
          draggable={false}
        />
      </div>
    </div>
  )
}
