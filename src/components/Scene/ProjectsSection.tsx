'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import '../../styles/HomePage.css'
import '../../styles/ProjectsSection.css'

export interface ProjectsSectionProps {
    habitationBackRef?: React.RefObject<HTMLDivElement>
    habitationFrontRef?: React.RefObject<HTMLDivElement>
    alien2ContainerRef?: React.RefObject<HTMLDivElement>
    /** Ref conteneur titre-quest (section Expérience) */
    experienceQuestTitreRef?: React.RefObject<HTMLDivElement>
    /** Refs conteneurs descrip-quest 1 à 6 (section Expérience) */
    experienceQuestDescripRefs?: (React.RefObject<HTMLDivElement | null>)[]
}

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

/** Extrait le contenu d'un groupe (de <g id="..."> à </g> inclus). Accepte des attributs supplémentaires (ex. opacity). */
function extractGroup(svg: string, id: string): { content: string; start: number; end: number } | null {
    const start = svg.indexOf(`<g id="${id}"`)
    if (start === -1) return null
    const end = findMatchingClose(svg, start)
    if (end === -1) return null
    return { content: svg.substring(start, end + 4), start, end }
}

function prepareDescripSvg(svg: string): string {
    let s = svg
    if (/\bclass="/.test(s)) {
        s = s.replace(/\bclass="([^"]*)"/, (_, cls) => `class="${cls} handwriting-svg"`)
    } else {
        s = s.replace(/<svg\b/, '<svg class="handwriting-svg"')
    }
    s = s.replace(/\swidth="[^"]*"/g, '')
    s = s.replace(/\sheight="[^"]*"/g, '')
    return s
}

const ProjectsSection = forwardRef<HTMLElement, ProjectsSectionProps>((props, ref) => {
    const { habitationBackRef, habitationFrontRef, alien2ContainerRef, experienceQuestTitreRef, experienceQuestDescripRefs } = props
    const [habitationBackSvgContent, setHabitationBackSvgContent] = useState<string>('')
    const [habitationFrontSvgContent, setHabitationFrontSvgContent] = useState<string>('')
    const [extraterrestreSvgContent, setExtraterrestreSvgContent] = useState<string>('')
    const [titreQuestSvgContent, setTitreQuestSvgContent] = useState<string>('')
    const [descripQuestSvgContents, setDescripQuestSvgContents] = useState<string[]>([])

    useEffect(() => {
        fetch('/assets/svg/habitation.svg')
            .then(response => response.text())
            .then(svg => {
                let modified = svg
                    .replace('<g id="fenetre">', '<g id="fenetre" opacity="0">')
                    .replace('<g id="fumee">', '<g id="fumee" opacity="0">')

                const svgOpening = modified.substring(0, modified.indexOf('<g id="habitation">'))

                // Groupes à mettre devant les masques (ordre de rendu : base puis avant-fenetre, porte, fenetre)
                const base = extractGroup(modified, 'base')
                const avantFenetre = extractGroup(modified, 'avant-fenetre')
                const porte = extractGroup(modified, 'porte')
                const fenetre = extractGroup(modified, 'fenetre')

                if (!base) {
                    setHabitationBackSvgContent(modified)
                    setHabitationFrontSvgContent('')
                    return
                }

                // Front = un seul SVG #habitation : base, avant-fenetre, porte, fenetre (même niveau)
                // On retire opacity="0" du groupe fenetre pour que GSAP pilote l'opacité via style uniquement
                const fenetreContentClean = fenetre?.content?.replace(/<g id="fenetre"[^>]*>/, '<g id="fenetre">') ?? ''
                const frontContents = [
                    base.content,
                    avantFenetre?.content ?? '',
                    porte?.content ?? '',
                    fenetreContentClean,
                ].filter(Boolean)
                const frontPart = svgOpening + '<g id="habitation">' + frontContents.join('') + '</g></svg>'

                // Back = tout sauf base, avant-fenetre, porte, fenetre (ordre fichier : base, avant-fenetre, porte, fenetre)
                const segments: [number, number][] = [[0, base.start]]
                let pos = base.end + 4
                if (avantFenetre) {
                    segments.push([pos, avantFenetre.start])
                    pos = avantFenetre.end + 4
                }
                if (porte) {
                    segments.push([pos, porte.start])
                    pos = porte.end + 4
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

    useEffect(() => {
        Promise.all([
            fetch('/assets/svg/text/titre-quest.svg').then(r => r.text()),
            ...Array.from({ length: 6 }, (_, i) =>
                fetch(`/assets/svg/text/descrip-quest${i + 1}.svg`).then(r => r.text()).then(prepareDescripSvg)
            ),
        ]).then(([titre, ...descrips]) => {
            let t = titre.replace(/\swidth="[^"]*"/g, '').replace(/\sheight="[^"]*"/g, '')
            setTitreQuestSvgContent(t)
            setDescripQuestSvgContents(descrips)
        }).catch(() => {})
    }, [])
    return (
        <section className="horizontal-section experiences-section" ref={ref}>
            {/* En arrière-plan (ordre d'empilement croissant) */}
            {extraterrestreSvgContent && (
                <div
                    ref={alien2ContainerRef}
                    className="experiences-extraterrestre-container alien2"
                    dangerouslySetInnerHTML={{ __html: extraterrestreSvgContent }}
                />
            )}
            {(habitationBackSvgContent || habitationFrontSvgContent) && (
                <div className="experiences-habitation-container">
                    {habitationBackSvgContent && (
                        <div
                            ref={habitationBackRef}
                            className="experiences-habitation-layer experiences-habitation-back"
                            dangerouslySetInnerHTML={{ __html: habitationBackSvgContent }}
                        />
                    )}
                    <div className="experiences-mask experiences-mask-chemine" aria-hidden />
                    <div className="experiences-mask experiences-mask-convoyeur" aria-hidden />
                    {habitationFrontSvgContent && (
                        <div
                            ref={habitationFrontRef}
                            className="experiences-habitation-layer experiences-habitation-front"
                            dangerouslySetInnerHTML={{ __html: habitationFrontSvgContent }}
                        />
                    )}
                </div>
            )}
            {/* Au premier plan : titre puis descrips */}
            {titreQuestSvgContent && (
                <div
                    ref={experienceQuestTitreRef}
                    className="quest-titre-container"
                    dangerouslySetInnerHTML={{ __html: titreQuestSvgContent }}
                    aria-hidden
                />
            )}
            {descripQuestSvgContents.length === 6 && experienceQuestDescripRefs?.length === 6 && (
                <>
                    {descripQuestSvgContents.map((svgContent, i) => (
                        <div
                            key={i}
                            ref={experienceQuestDescripRefs[i] as React.RefObject<HTMLDivElement>}
                            className={`quest-descrip-container quest-descrip-${(i % 2) === 0 ? 'left' : 'right'} quest-descrip-cycle-${i}`}
                            data-descrip-index={i}
                            aria-hidden
                        >
                            <div className="quest-descrip-svg-wrapper" dangerouslySetInnerHTML={{ __html: svgContent }} />
                            <div className="quest-erase-overlay" aria-hidden>
                                <div className="quest-erase-mask quest-erase-mask-1" />
                                <div className="quest-erase-mask quest-erase-mask-2" />
                                <div className="quest-erase-mask quest-erase-mask-3" />
                                <div className="quest-erase-mask quest-erase-mask-4" />
                            </div>
                        </div>
                    ))}
                </>
            )}
        </section>
    )
})

ProjectsSection.displayName = 'ProjectsSection'

export default ProjectsSection
