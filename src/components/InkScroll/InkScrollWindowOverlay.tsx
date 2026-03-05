'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import '@/animations/gsap'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './InkScrollWindowOverlay.module.css'

const MIN_THUMB_PX = 24

function useInkScrollWindowOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartScrollRef = useRef(0)

  const update = useCallback(() => {
    if (typeof window === 'undefined') return

    const wrapper = wrapperRef.current
    const rail = railRef.current
    const thumb = thumbRef.current
    if (!wrapper || !rail || !thumb) return

    const doc = document.documentElement
    const body = document.body
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight)
    const clientHeight = doc.clientHeight || window.innerHeight
    const maxScroll = Math.max(0, scrollHeight - clientHeight)

    if (maxScroll <= 0) {
      wrapper.style.display = 'none'
      return
    }

    const railHeight = rail.clientHeight
    const ratio = clientHeight / scrollHeight
    const thumbHeight = Math.max(MIN_THUMB_PX, Math.min(railHeight * ratio, railHeight))
    const scrollTop = window.scrollY ?? doc.scrollTop ?? body.scrollTop ?? 0
    const scrollRatio = maxScroll > 0 ? scrollTop / maxScroll : 0
    const thumbTop = scrollRatio * (railHeight - thumbHeight)

    thumb.style.height = `${thumbHeight}px`
    thumb.style.top = `${thumbTop}px`
    wrapper.style.display = ''
  }, [])

  const scheduleUpdate = () => {
    if (rafIdRef.current != null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      update()
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.ticker.add(update)

    const handleResize = () => scheduleUpdate()
    window.addEventListener('resize', handleResize)
    ScrollTrigger.addEventListener('refresh', scheduleUpdate)

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.documentElement)
    resizeObserver.observe(document.body)

    update()
    const t1 = window.setTimeout(update, 100)
    const t2 = window.setTimeout(update, 500)

    const thumb = thumbRef.current
    const rail = railRef.current

    const handleThumbMouseDown = (e: MouseEvent) => {
      if (!rail || !thumb) return
      e.preventDefault()
      isDraggingRef.current = true
      document.documentElement.classList.add('is-dragging-scrollbar')
      dragStartYRef.current = e.clientY
      dragStartScrollRef.current = window.scrollY
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !rail || !thumb) return
      didDragRef.current = true
      const doc = document.documentElement
      const body = document.body
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight)
      const clientHeight = doc.clientHeight || window.innerHeight
      const maxScroll = Math.max(0, scrollHeight - clientHeight)
      if (maxScroll <= 0) return

      const railHeight = rail.clientHeight
      const ratio = clientHeight / scrollHeight
      const thumbHeight = Math.max(MIN_THUMB_PX, Math.min(railHeight * ratio, railHeight))
      const trackHeight = railHeight - thumbHeight
      if (trackHeight <= 0) return

      const deltaY = e.clientY - dragStartYRef.current
      const scrollDelta = (deltaY / trackHeight) * maxScroll
      const newScroll = Math.max(0, Math.min(maxScroll, dragStartScrollRef.current + scrollDelta))
      window.scrollTo(0, newScroll)
      dragStartYRef.current = e.clientY
      dragStartScrollRef.current = newScroll
    }

    const handleMouseUp = () => {
      const wasDragging = isDraggingRef.current
      isDraggingRef.current = false
      document.documentElement.classList.remove('is-dragging-scrollbar')
      if (wasDragging) {
        setTimeout(() => { didDragRef.current = false }, 0)
      } else {
        didDragRef.current = false
      }
    }

    const handleRailClick = (e: MouseEvent) => {
      if (!rail || !thumb || didDragRef.current) return
      if (e.target !== rail) return
      const rect = rail.getBoundingClientRect()
      const clickY = e.clientY - rect.top
      const doc = document.documentElement
      const body = document.body
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight)
      const clientHeight = doc.clientHeight || window.innerHeight
      const maxScroll = Math.max(0, scrollHeight - clientHeight)
      if (maxScroll <= 0) return

      const railHeight = rail.clientHeight
      const ratio = clientHeight / scrollHeight
      const thumbHeight = Math.max(MIN_THUMB_PX, Math.min(railHeight * ratio, railHeight))
      const trackHeight = railHeight - thumbHeight
      if (trackHeight <= 0) return

      const scrollRatio = Math.max(0, Math.min(1, (clickY - thumbHeight / 2) / trackHeight))
      window.scrollTo(0, scrollRatio * maxScroll)
    }

    thumb?.addEventListener('mousedown', handleThumbMouseDown)
    rail?.addEventListener('click', handleRailClick)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      gsap.ticker.remove(update)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.removeEventListener('refresh', scheduleUpdate)
      resizeObserver.disconnect()
      thumb?.removeEventListener('mousedown', handleThumbMouseDown)
      rail?.removeEventListener('click', handleRailClick)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [update])

  return { wrapperRef, railRef, thumbRef }
}

export default function InkScrollWindowOverlay() {
  const { wrapperRef, railRef, thumbRef } = useInkScrollWindowOverlay()

  return (
    <div className={styles.inkScrollWindow} ref={wrapperRef} aria-hidden="true">
      <div className={`${styles.inkScrollWindow__rail} ink-scroll__rail`} ref={railRef}>
        <div className={`${styles.inkScrollWindow__thumb} ink-scroll__thumb`} ref={thumbRef} />
      </div>
    </div>
  )
}
