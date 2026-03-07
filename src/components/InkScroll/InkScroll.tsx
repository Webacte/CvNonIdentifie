'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import styles from './InkScroll.module.css'
import { createTextareaScrollController, type TextareaScrollController } from '@/utils/textareaScrollController'
import ContactArcScrollbar from '@/components/ContactArcScrollbar/ContactArcScrollbar'

const MIN_THUMB_PX = 24

export interface InkScrollProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'textarea'
  onScrollControllerReady?: (controller: TextareaScrollController) => void
}

function useInkScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement | HTMLTextAreaElement | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartScrollRef = useRef(0)

  const update = useCallback(() => {
    const el = contentRef.current
    const rail = railRef.current
    const thumb = thumbRef.current
    if (!el || !rail || !thumb) return

    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    const maxScroll = scrollHeight - clientHeight

    if (maxScroll <= 1) {
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
  }, [])

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current != null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      update()
    })
  }, [update])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!matchMedia('(pointer: fine)').matches) return

    const el = contentRef.current
    const rail = railRef.current
    const thumb = thumbRef.current
    if (!el || !rail || !thumb) return

    el.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(el)

    const handleThumbMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      isDraggingRef.current = true
      document.documentElement.classList.add('is-dragging-scrollbar')
      dragStartYRef.current = e.clientY
      dragStartScrollRef.current = el.scrollTop
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const scrollHeight = el.scrollHeight
      const clientHeight = el.clientHeight
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) return

      const railHeight = rail.clientHeight
      const ratio = clientHeight / scrollHeight
      const thumbHeight = Math.max(MIN_THUMB_PX, Math.min(railHeight * ratio, railHeight))
      const trackHeight = railHeight - thumbHeight
      if (trackHeight <= 0) return

      const deltaY = e.clientY - dragStartYRef.current
      const scrollDelta = (deltaY / trackHeight) * maxScroll
      const newScroll = Math.max(0, Math.min(maxScroll, dragStartScrollRef.current + scrollDelta))
      el.scrollTop = newScroll
      dragStartYRef.current = e.clientY
      dragStartScrollRef.current = newScroll
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.documentElement.classList.remove('is-dragging-scrollbar')
    }

    thumb.addEventListener('mousedown', handleThumbMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    scheduleUpdate()

    return () => {
      el.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      thumb.removeEventListener('mousedown', handleThumbMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [scheduleUpdate])

  return { wrapperRef, contentRef, railRef, thumbRef }
}

export default function InkScroll({ children, className, variant = 'default', onScrollControllerReady }: InkScrollProps) {
  const { wrapperRef, contentRef, railRef, thumbRef } = useInkScroll()

  const isTextarea = variant === 'textarea'
  const child = isTextarea ? React.Children.only(children) : null
  const textareaChild = isTextarea && child && React.isValidElement(child) && child.type === 'textarea' ? child : null

  const wrapperClassName = [
    styles.inkScroll,
    isTextarea ? 'ink-scroll ink-scroll--textarea' : '',
    className ?? ''
  ].filter(Boolean).join(' ').trim()

  useEffect(() => {
    if (variant !== 'textarea' || !onScrollControllerReady) return
    const el = contentRef.current
    if (!el || !(el instanceof HTMLTextAreaElement)) return
    const controller = createTextareaScrollController(el)
    onScrollControllerReady(controller)
  }, [variant, onScrollControllerReady, contentRef])

  return (
    <div
      className={wrapperClassName}
      ref={wrapperRef}
      {...(isTextarea ? { 'data-ink-scroll': 'textarea-message' } : {})}
    >
      {textareaChild
        ? React.cloneElement(textareaChild as React.ReactElement<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }>, {
            ref: contentRef as React.Ref<HTMLTextAreaElement>,
            className: [
              (textareaChild as React.ReactElement<{ className?: string }>).props.className,
              styles.inkScroll__content,
              'ink-scroll__content'
            ].filter(Boolean).join(' ')
          })
        : (
          <div className={styles.inkScroll__content} ref={contentRef as React.RefObject<HTMLDivElement>}>
            {children}
          </div>
        )}
      {!isTextarea && (
        <div className={`${styles.inkScroll__rail} ink-scroll__rail`} ref={railRef} aria-hidden="true">
          <div className={`${styles.inkScroll__thumb} ink-scroll__thumb`} ref={thumbRef} aria-hidden="true" />
        </div>
      )}
      {isTextarea && <ContactArcScrollbar />}
    </div>
  )
}
