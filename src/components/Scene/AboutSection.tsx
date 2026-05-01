'use client'

import React, { forwardRef } from 'react'
import '../../styles/HomePage.css'
import '../../styles/AboutSection.css'

interface AboutSectionProps {
    svgContent: string
    svgRef: React.RefObject<HTMLDivElement>
    hologramSvgContent: string
    hologramSvgRef: React.RefObject<HTMLDivElement>
    profileDescriptionSvgRef: React.RefObject<HTMLDivElement>
    profileDescriptionSvgContent: string
}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(
    ({ svgContent, svgRef, hologramSvgContent, hologramSvgRef, profileDescriptionSvgRef, profileDescriptionSvgContent }, ref) => {
        return (
            <section className="horizontal-section" ref={ref}>
                {svgContent && (
                    <div ref={svgRef} className="about-svg-container">
                        <span className="about-hologram-bases-anchor-mark" aria-hidden />
                        <div
                            className="about-svg-graphic-inner"
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                    </div>
                )}
                {hologramSvgContent && (
                    <div
                        ref={hologramSvgRef}
                        className="hologram-svg-container"
                    >
                        <div
                            className="hologram-svg-inner"
                            dangerouslySetInnerHTML={{ __html: hologramSvgContent }}
                        />
                        {profileDescriptionSvgContent && (
                            <div
                                ref={profileDescriptionSvgRef}
                                className="handwriting-wrapper"
                                dangerouslySetInnerHTML={{ __html: profileDescriptionSvgContent }}
                            />
                        )}
                    </div>
                )}
            </section>
        )
    }
)

AboutSection.displayName = 'AboutSection'

export default AboutSection
