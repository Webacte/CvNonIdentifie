'use client'

import React, { useEffect, useRef } from 'react'
import styles from './InkScroll.module.css'

const MIN_THUMB_PX = 24

export interface InkScrollProps {
  children: React.ReactNode
  className?: string
}

function useInkScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)

  const update = () => {
    const el = contentRef.current
    const rail = railRef.current
    const thumb = thumbRef.current
    if (!el || !rail || !thumb) return

    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const maxScroll = scrollHeight - clientHeight

    if (maxScroll <= 0) {
      rail.style.display = 'none'
      return
    }

    const railHeight = rail.clientHeight
    const ratio = clientHeight / scrollHeight
    const thumbHeight = Math.max(MIN_THUMB_PX, Math.min(railHeight * ratio, railHeight))
    const scrollRatio = el.scrollTop / maxScroll
    const thumbTop = scrollRatio * (railHeight - thumbHeight)

    thumb.style.height = `${thumbHeight}px`
    thumb.style.top = `${thumbTop}px`
    rail.style.display = ''
  }

  const scheduleUpdate = () => {
    if (rafIdRef.current != null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      update()
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!matchMedia('(pointer: fine)').matches) return

    const el = contentRef.current
    if (!el) return

    el.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(el)

    scheduleUpdate()

    return () => {
      el.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { wrapperRef, contentRef, railRef, thumbRef }
}

export default function InkScroll({ children, className }: InkScrollProps) {
  const { wrapperRef, contentRef, railRef, thumbRef } = useInkScroll()

  return (
    <div className={`${styles.inkScroll} ${className ?? ''}`.trim()} ref={wrapperRef}>
      <div className={styles.inkScroll__content} ref={contentRef}>
        {children}
      </div>
      <div className={styles.inkScroll__rail} ref={railRef} aria-hidden="true">
        <div className={styles.inkScroll__thumb} ref={thumbRef} />
      </div>
    </div>
  )
}
