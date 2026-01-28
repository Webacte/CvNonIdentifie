'use client'

import React, { forwardRef } from 'react'
import '../../styles/HomePage.css'

interface PresentationSectionProps {
    rocketContent: string
    rocketRef: React.RefObject<HTMLDivElement>
    portraitRef?: React.RefObject<HTMLImageElement>
    descriptionContainerRef?: React.RefObject<HTMLDivElement>
}

const PresentationSection = forwardRef<HTMLElement, PresentationSectionProps>(
    ({ rocketContent, rocketRef, portraitRef, descriptionContainerRef }, ref) => {
        return (
            <section className="horizontal-section" ref={ref}>
                <div className="presentationContainer">
                    <h1 id="myName">Benjamin Pochon</h1>
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
                <div 
                    ref={rocketRef}
                    className="rocket-container"
                    dangerouslySetInnerHTML={{ __html: rocketContent }}
                />
            </section>
        )
    }
)

PresentationSection.displayName = 'PresentationSection'

export default PresentationSection
