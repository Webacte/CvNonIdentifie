'use client'

import React, { forwardRef } from 'react'
import '../../styles/HomePage.css'

/**
 * Section réservée pour "Contact" (contenu à venir).
 * Placeholder pour garder l'emplacement dans le scroll horizontal.
 */
const ContactSection = forwardRef<HTMLElement>((props, ref) => {
    return (
        <section className="horizontal-section contact-section-placeholder" ref={ref}>
            <h2 className="placeholder-title">Contact</h2>
        </section>
    )
})

ContactSection.displayName = 'ContactSection'

export default ContactSection
