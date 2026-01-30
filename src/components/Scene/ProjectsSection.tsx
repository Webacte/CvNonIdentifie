'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import '../../styles/HomePage.css'
import '../../styles/ProjectsSection.css'

/** Trouve la position du </g> qui ferme le <g> commençant à openTagStart (compte les groupes imbriqués). */
function findMatchingClose(svg: string, openTagStart: number): number {
    let depth = 1
    let pos = svg.indexOf('>', openTagStart) + 1
    while (depth > 0) {
        const nextClose = svg.indexOf('</g>', pos)
        const nextOpen = svg.indexOf('<g ', pos)
        if (nextClose === -1) return -1
        if (nextOpen === -1 || nextClose < nextOpen) {
            depth--
            if (depth === 0) return nextClose
            pos = nextClose + 4
        } else {
            depth++
            pos = nextOpen + 3
        }
    }
    return -1
}

/** Extrait le contenu d'un groupe (de <g id="..."> à </g> inclus). */
function extractGroup(svg: string, id: string): { content: string; start: number; end: number } | null {
    const start = svg.indexOf(`<g id="${id}">`)
    if (start === -1) return null
    const end = findMatchingClose(svg, start)
    if (end === -1) return null
    return { content: svg.substring(start, end + 4), start, end }
}

const ProjectsSection = forwardRef<HTMLElement>((props, ref) => {
    const [habitationBackSvgContent, setHabitationBackSvgContent] = useState<string>('')
    const [habitationFrontSvgContent, setHabitationFrontSvgContent] = useState<string>('')
    const [extraterrestreSvgContent, setExtraterrestreSvgContent] = useState<string>('')

    useEffect(() => {
        fetch('/assets/svg/habitation.svg')
            .then(response => response.text())
            .then(svg => {
                let modified = svg
                    .replace('<g id="fenetre">', '<g id="fenetre" opacity="0">')
                    .replace('<g id="fumee">', '<g id="fumee" opacity="0">')
                    .replace('<g id="chemine-fumee">', '<g id="chemine-fumee" transform="translate(0, 200)">')
                    .replace('<g id="ensemble-convoyeur">', '<g id="ensemble-convoyeur" transform="translate(-700, 0)">')

                const svgOpening = modified.substring(0, modified.indexOf('<g id="habitation">'))

                // Groupes à mettre devant les masques (ordre de rendu : base puis avant-fenetre, tenant-porte, fenetre)
                const base = extractGroup(modified, 'base')
                const avantFenetre = extractGroup(modified, 'avant-fenetre')
                const tenantPorte = extractGroup(modified, 'tenant-porte')
                const fenetre = extractGroup(modified, 'fenetre')

                if (!base) {
                    setHabitationBackSvgContent(modified)
                    setHabitationFrontSvgContent('')
                    return
                }

                // Front = base + avant-fenetre + tenant-porte + fenetre (tous au-dessus des masques)
                const frontContents = [
                    base.content,
                    avantFenetre?.content ?? '',
                    tenantPorte?.content ?? '',
                    fenetre?.content ?? ''
                ].filter(Boolean)
                const frontPart = svgOpening + '<g id="habitation">' + frontContents.join('') + '</g></svg>'

                // Back = tout sauf base, avant-fenetre, tenant-porte, fenetre (ordre fichier : base, avant-fenetre, tenant-porte, fenetre)
                const segments: [number, number][] = [[0, base.start]]
                let pos = base.end + 4
                if (avantFenetre) {
                    segments.push([pos, avantFenetre.start])
                    pos = avantFenetre.end + 4
                }
                if (tenantPorte) {
                    segments.push([pos, tenantPorte.start])
                    pos = tenantPorte.end + 4
                }
                if (fenetre) {
                    segments.push([pos, fenetre.start])
                    segments.push([fenetre.end + 4, modified.length])
                } else {
                    segments.push([pos, modified.length])
                }
                const backPart = segments
                    .filter(([a, b]) => b > a)
                    .map(([a, b]) => modified.substring(a, b))
                    .join('')

                setHabitationBackSvgContent(backPart)
                setHabitationFrontSvgContent(frontPart)
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        fetch('/assets/svg/extraterrestre.svg')
            .then(response => response.text())
            .then(svg => {
                const expandedSvg = svg
                    .replace(/viewBox="([^"]*)"/, 'viewBox="-40 -30 144 248"')
                    .replace(/width="([^"]*)"/, 'width="144"')
                    .replace(/height="([^"]*)"/, 'height="248"')
                setExtraterrestreSvgContent(expandedSvg)
            })
            .catch(() => {})
    }, [])

    return (
        <section className="horizontal-section experiences-section" ref={ref}>
            {extraterrestreSvgContent && (
                <div
                    className="experiences-extraterrestre-container alien2"
                    dangerouslySetInnerHTML={{ __html: extraterrestreSvgContent }}
                />
            )}
            {(habitationBackSvgContent || habitationFrontSvgContent) && (
                <div className="experiences-habitation-container">
                    {habitationBackSvgContent && (
                        <div
                            className="experiences-habitation-layer experiences-habitation-back"
                            dangerouslySetInnerHTML={{ __html: habitationBackSvgContent }}
                        />
                    )}
                    <div className="experiences-mask experiences-mask-chemine" aria-hidden />
                    <div className="experiences-mask experiences-mask-convoyeur" aria-hidden />
                    {habitationFrontSvgContent && (
                        <div
                            className="experiences-habitation-layer experiences-habitation-front"
                            dangerouslySetInnerHTML={{ __html: habitationFrontSvgContent }}
                        />
                    )}
                </div>
            )}
        </section>
    )
})

ProjectsSection.displayName = 'ProjectsSection'

export default ProjectsSection
