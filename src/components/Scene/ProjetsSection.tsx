'use client'

import React, { forwardRef, useEffect, useState } from 'react'
import '../../styles/HomePage.css'
import '../../styles/ProjectsSection.css'

function prepareProjetSvg(svg: string): string {
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

export interface ProjetsSectionProps {
    robotHeadRef?: React.RefObject<HTMLDivElement>
    robotHandRef?: React.RefObject<HTMLDivElement>
    /** Ref du conteneur du SVG convoyeur-projet (section Projets, bas gauche) */
    convoyeurProjetRef?: React.RefObject<HTMLDivElement>
    /** Refs pour les textes Scania / LikeThat (handwriting) */
    scaniaTitreRef?: React.RefObject<HTMLDivElement | null>
    scaniaDescRef?: React.RefObject<HTMLDivElement | null>
    likethatTitreRef?: React.RefObject<HTMLDivElement | null>
    likethatDescRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Section Projets : tete-robot, main-robot.
 * Placeholder enrichi avec les SVG pour les animations au scroll.
 */
const ProjetsSection = forwardRef<HTMLElement, ProjetsSectionProps>((props, ref) => {
    const { robotHeadRef, robotHandRef, convoyeurProjetRef, scaniaTitreRef, scaniaDescRef, likethatTitreRef, likethatDescRef } = props
    const [teteRobotSvgContent, setTeteRobotSvgContent] = useState<string>('')
    const [mainRobotSvgContent, setMainRobotSvgContent] = useState<string>('')
    const [convoyeurProjetSvgContent, setConvoyeurProjetSvgContent] = useState<string>('')
    const [scaniaTitreSvgContent, setScaniaTitreSvgContent] = useState<string>('')
    const [scaniaDescSvgContent, setScaniaDescSvgContent] = useState<string>('')
    const [likethatTitreSvgContent, setLikethatTitreSvgContent] = useState<string>('')
    const [likethatDescSvgContent, setLikethatDescSvgContent] = useState<string>('')

    useEffect(() => {
        fetch('/assets/svg/tete-robot.svg')
            .then((res) => res.text())
            .then(setTeteRobotSvgContent)
            .catch(() => {})
    }, [])
    useEffect(() => {
        fetch('/assets/svg/main-robot.svg')
            .then((res) => res.text())
            .then(setMainRobotSvgContent)
            .catch(() => {})
    }, [])
    useEffect(() => {
        fetch('/assets/svg/convoyeur-projet.svg')
            .then((res) => res.text())
            .then((svg) => {
                const withClass = svg.replace(/<svg\b/, '<svg class="projets-convoyeur-svg"')
                const enlarged = withClass
                    .replace(/height="([^"]*)"/, (_, h) => `height="${parseFloat(h) * 2}"`)
                    .replace(/<path id="battant"([^>]*)stroke-width="[^"]*"/, '<path id="battant"$1stroke-width="1" vector-effect="non-scaling-stroke"')
                setConvoyeurProjetSvgContent(enlarged)
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        Promise.all([
            fetch('/assets/svg/text/scania-titre.svg').then((r) => r.text()).then(prepareProjetSvg),
            fetch('/assets/svg/text/scania-desc.svg').then((r) => r.text()).then(prepareProjetSvg),
            fetch('/assets/svg/text/likethat-titre.svg').then((r) => r.text()).then(prepareProjetSvg),
            fetch('/assets/svg/text/likethat-desc.svg').then((r) => r.text()).then(prepareProjetSvg),
        ]).then(([scaniaTitre, scaniaDesc, likethatTitre, likethatDesc]) => {
            setScaniaTitreSvgContent(scaniaTitre)
            setScaniaDescSvgContent(scaniaDesc)
            setLikethatTitreSvgContent(likethatTitre)
            setLikethatDescSvgContent(likethatDesc)
        }).catch(() => {})
    }, [])

    return (
        <section className="horizontal-section projets-section-placeholder" ref={ref}>
            {convoyeurProjetSvgContent && (
                <div
                    ref={convoyeurProjetRef}
                    dangerouslySetInnerHTML={{ __html: convoyeurProjetSvgContent }}
                />
            )}
            <div className="projets-section-svgs">
                {teteRobotSvgContent && (
                    <div
                        ref={robotHeadRef}
                        className="projets-robot-head-container"
                        dangerouslySetInnerHTML={{ __html: teteRobotSvgContent }}
                    />
                )}
                {mainRobotSvgContent && (
                    <div
                        ref={robotHandRef}
                        className="projets-robot-hand-container"
                        dangerouslySetInnerHTML={{ __html: mainRobotSvgContent }}
                    />
                )}
            </div>
            {/* Textes Scania : structure identique à quest-descrip (Expérience) + quest-descrip-cycle-4 pour les masques */}
            {scaniaTitreSvgContent && scaniaDescSvgContent && (
                <div className="projets-scania-container">
                    <div
                        ref={scaniaTitreRef as React.RefObject<HTMLDivElement>}
                        className="projets-text-block quest-descrip-cycle-4"
                        aria-hidden
                    >
                        <div className="quest-descrip-svg-wrapper" dangerouslySetInnerHTML={{ __html: scaniaTitreSvgContent }} />
                        <div className="quest-erase-overlay" aria-hidden>
                            <div className="quest-erase-mask quest-erase-mask-1" />
                            <div className="quest-erase-mask quest-erase-mask-2" />
                            <div className="quest-erase-mask quest-erase-mask-3" />
                            <div className="quest-erase-mask quest-erase-mask-4" />
                        </div>
                    </div>
                    <div
                        ref={scaniaDescRef as React.RefObject<HTMLDivElement>}
                        className="projets-text-block projets-text-desc quest-descrip-cycle-4"
                        aria-hidden
                    >
                        <div className="quest-descrip-svg-wrapper" dangerouslySetInnerHTML={{ __html: scaniaDescSvgContent }} />
                        <div className="quest-erase-overlay" aria-hidden>
                            <div className="quest-erase-mask quest-erase-mask-1" />
                            <div className="quest-erase-mask quest-erase-mask-2" />
                            <div className="quest-erase-mask quest-erase-mask-3" />
                            <div className="quest-erase-mask quest-erase-mask-4" />
                        </div>
                    </div>
                </div>
            )}
            {/* Textes LikeThat : même structure */}
            {likethatTitreSvgContent && likethatDescSvgContent && (
                <div className="projets-likethat-container">
                    <div
                        ref={likethatTitreRef as React.RefObject<HTMLDivElement>}
                        className="projets-text-block quest-descrip-cycle-4"
                        aria-hidden
                    >
                        <div className="quest-descrip-svg-wrapper" dangerouslySetInnerHTML={{ __html: likethatTitreSvgContent }} />
                        <div className="quest-erase-overlay" aria-hidden>
                            <div className="quest-erase-mask quest-erase-mask-1" />
                            <div className="quest-erase-mask quest-erase-mask-2" />
                            <div className="quest-erase-mask quest-erase-mask-3" />
                            <div className="quest-erase-mask quest-erase-mask-4" />
                        </div>
                    </div>
                    <div
                        ref={likethatDescRef as React.RefObject<HTMLDivElement>}
                        className="projets-text-block projets-text-desc quest-descrip-cycle-4"
                        aria-hidden
                    >
                        <div className="quest-descrip-svg-wrapper" dangerouslySetInnerHTML={{ __html: likethatDescSvgContent }} />
                        <div className="quest-erase-overlay" aria-hidden>
                            <div className="quest-erase-mask quest-erase-mask-1" />
                            <div className="quest-erase-mask quest-erase-mask-2" />
                            <div className="quest-erase-mask quest-erase-mask-3" />
                            <div className="quest-erase-mask quest-erase-mask-4" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
})

ProjetsSection.displayName = 'ProjetsSection'

export default ProjetsSection
