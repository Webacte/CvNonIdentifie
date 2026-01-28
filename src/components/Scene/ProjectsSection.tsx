'use client'

import React, { forwardRef } from 'react'
import '../../styles/HomePage.css'

const ProjectsSection = forwardRef<HTMLElement>((props, ref) => {
    return (
        <section className="horizontal-section" ref={ref}>
            <div className="section-content">
                <h2>Projets</h2>
                <p>Contenu de la section 3</p>
            </div>
        </section>
    )
})

ProjectsSection.displayName = 'ProjectsSection'

export default ProjectsSection
