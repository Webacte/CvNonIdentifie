'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

const DURATION = 2
const EASE = 'power2.out'
const SCALE_HOVER = 1.33
const SCALE_OTHERS = 0.9

export interface UseSplitLettersOptions {
    /** Sélecteur des éléments à splitter (ex. `.placeholder-title`). Si absent, le conteneur lui-même est splitté. */
    selector?: string
}

function setupElement(el: HTMLElement): { split: SplitType; cleanup: () => void } | null {
    const split = new SplitType(el, { types: ['chars'] })
    const chars = split.chars
    if (!chars || chars.length === 0) return null

    const onCharEnter = (e: Event) => {
        const target = e.currentTarget as HTMLElement
        gsap.to(target, { scale: SCALE_HOVER, duration: DURATION, ease: EASE })
        const others = chars.filter((c) => c !== target)
        gsap.to(others, { scale: SCALE_OTHERS, duration: DURATION, ease: EASE })
    }

    const onBlockLeave = () => {
        gsap.to(chars, { scale: 1, duration: DURATION, ease: EASE })
    }

    chars.forEach((char) => {
        char.addEventListener('mouseenter', onCharEnter)
    })
    el.addEventListener('mouseleave', onBlockLeave)

    const cleanup = () => {
        chars.forEach((char) => {
            char.removeEventListener('mouseenter', onCharEnter)
        })
        el.removeEventListener('mouseleave', onBlockLeave)
    }

    return { split, cleanup }
}

/**
 * Découpe le texte en lettres (SplitType) et attache l’effet au survol :
 * lettre survolée → scale 1.33, les autres → scale 0.9, en 2 s.
 * Respecte prefers-reduced-motion.
 */
export function useSplitLetters(
    containerRef: RefObject<HTMLElement | null>,
    options?: UseSplitLettersOptions
): void {
    const { selector } = options ?? {}

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const targets: HTMLElement[] = selector
            ? Array.from(container.querySelectorAll<HTMLElement>(selector))
            : [container]

        const results: { split: SplitType; cleanup: () => void }[] = []

        for (const el of targets) {
            const result = setupElement(el)
            if (result) results.push(result)
        }

        return () => {
            results.forEach(({ split, cleanup }) => {
                cleanup()
                split.revert()
            })
        }
    }, [containerRef, selector])
}
