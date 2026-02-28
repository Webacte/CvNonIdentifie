'use client'

import React, { forwardRef, useRef } from 'react'
import { useSplitLetters } from '@/hooks/useSplitLetters'
import '../../styles/HomePage.css'

interface PresentationSectionProps {
    rocketContent: string
    rocketRef: React.RefObject<HTMLDivElement>
    portraitRef?: React.RefObject<HTMLImageElement>
    descriptionContainerRef?: React.RefObject<HTMLDivElement>
}

const PresentationSection = forwardRef<HTMLElement, PresentationSectionProps>(
    ({ rocketContent, rocketRef, portraitRef, descriptionContainerRef }, ref) => {
        const titleRef = useRef<HTMLHeadingElement>(null)
        useSplitLetters(titleRef)

        return (
            <section className="horizontal-section" ref={ref}>
                <div className="presentationContainer">
                    <div className="presentation-title-wrap">
                        <h1 id="myName" ref={titleRef}>Benjamin Pochon</h1>
                    </div>
                    <div className="descriptionContainer" ref={descriptionContainerRef}>
                        <p>Développeur Full Stack</p>
                        <p>React, Node.js, PostgreSQL</p>
                    </div>
                </div>
                <img 
                    ref={portraitRef}
                    src="/assets/img/portrait.jpeg" 
                    alt="Portrait de Benjamin Pochon"
                    className="portrait-image"
                />
                <div ref={rocketRef} className="rocket-container">
                    <div className="rocket-scaled" dangerouslySetInnerHTML={{ __html: rocketContent }} />
                </div>
            </section>
        )
    }
)

PresentationSection.displayName = 'PresentationSection'

export default PresentationSection
