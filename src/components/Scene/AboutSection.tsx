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
                    <div 
                        ref={svgRef}
                        className="about-svg-container"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                )}
                {hologramSvgContent && (
                    <div 
                        ref={hologramSvgRef}
                        className="hologram-svg-container"
                        dangerouslySetInnerHTML={{ __html: hologramSvgContent }}
                    />
                )}
                {profileDescriptionSvgContent && (
                    <div 
                        ref={profileDescriptionSvgRef}
                        className="handwriting-wrapper"
                        dangerouslySetInnerHTML={{ __html: profileDescriptionSvgContent }}
                     />
                )}
            </section>
        )
    }
)

AboutSection.displayName = 'AboutSection'

export default AboutSection
