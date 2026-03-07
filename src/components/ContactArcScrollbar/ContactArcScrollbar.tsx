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

/** Interpole l'angle du thumb selon progress (0..1) : top = thumbRotationTop, bottom = thumbRotationBottom. */
function getThumbAngleFromProgress(
  progress: number,
  top: number,
  bottom: number
): number {
  return top + progress * (bottom - top)
}

export interface ContactArcScrollbarProps {
  /** Ref du textarea pour détecter si le contenu est scrollable (thumb visible uniquement quand scrollHeight > clientHeight + 1) */
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

export default function ContactArcScrollbar({ textareaRef }: ContactArcScrollbarProps = {} as ContactArcScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
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

    const clampedProgress = clamp(progress, config.thumbMinProgress, config.thumbMaxProgress)
    const angle = getThumbAngleFromProgress(
      clampedProgress,
      config.thumbRotationTop,
      config.thumbRotationBottom
    )

    const offsetX = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-offset-x').trim() || '0'
    const offsetY = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-offset-y').trim() || '0'
    const rotateOffset = getComputedStyle(thumbEl).getPropertyValue('--contact-arc-scroll-thumb-rotate-offset').trim()
    const angleDeg = rotateOffset ? `${angle + parseFloat(rotateOffset)}deg` : `${angle}deg`

    thumbEl.style.left = `${xPct}%`
    thumbEl.style.top = `${yPct}%`
    thumbEl.style.transform = `translate(calc(-50% + ${offsetX}), calc(-50% + ${offsetY}))`
    thumbEl.style.setProperty('--contact-arc-scroll-thumb-angle', angleDeg)
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

  const updateScrollable = useCallback(() => {
    const el = textareaRef?.current
    if (!el) {
      setIsScrollable(false)
      return
    }
    setIsScrollable(el.scrollHeight > el.clientHeight + 1)
  }, [textareaRef])

  /** Dérive progress depuis le scroll du textarea (sync scroll → thumb). */
  const syncProgressFromScroll = useCallback(() => {
    const el = textareaRef?.current
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    if (maxScroll <= 0) return
    const p = clamp(el.scrollTop / maxScroll, 0, 1)
    setProgress(p)
  }, [textareaRef])

  useEffect(() => {
    if (!textareaRef?.current) return
    const el = textareaRef.current
    updateScrollable()
    syncProgressFromScroll()
    el.addEventListener('scroll', syncProgressFromScroll, { passive: true })
    el.addEventListener('input', updateScrollable)
    window.addEventListener('resize', updateScrollable)
    const ro = new ResizeObserver(() => {
      updateScrollable()
      syncProgressFromScroll()
    })
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', syncProgressFromScroll)
      el.removeEventListener('input', updateScrollable)
      window.removeEventListener('resize', updateScrollable)
      ro.disconnect()
    }
  }, [textareaRef, updateScrollable, syncProgressFromScroll])

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
    const textarea = textareaRef?.current
    if (!thumb || !container || !textarea) return

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
      // Sync thumb → textarea : mettre à jour le scroll
      const maxScroll = textarea.scrollHeight - textarea.clientHeight
      if (maxScroll > 0) {
        textarea.scrollTop = newProgress * maxScroll
      }
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
  }, [textareaRef])

  const pathD = getContactArcScrollbarPathD(config)

  return (
    <div
      ref={containerRef}
      className={`${styles.contactArcScrollbar} contact-arc-scrollbar ${isScrollable ? styles.isScrollable : ''}`}
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
        <div className={styles.contactArcScrollbar__thumbRotate}>
          <div className={styles.contactArcScrollbar__thumbInner}>
          <img
            src="/assets/svg/levier-contact.svg"
            alt=""
            draggable={false}
          />
        </div>
        </div>
      </div>
    </div>
  )
}
