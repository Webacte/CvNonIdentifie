'use client'

import React, { forwardRef } from 'react'
import '../../styles/HomePage.css'

/**
 * Section réservée pour "Projets" (contenu à venir).
 * Placeholder pour garder l'emplacement dans le scroll horizontal.
 */
const ProjetsSection = forwardRef<HTMLElement>((props, ref) => {
    return (
        <section className="horizontal-section projets-section-placeholder" ref={ref}>
            <h2 className="placeholder-title">Projets</h2>
        </section>
    )
})

ProjetsSection.displayName = 'ProjetsSection'

export default ProjetsSection
