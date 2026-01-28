'use client' // GSAP coté client

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@/animations/gsap' // Enregistre les plugins GSAP
import { setupHorizontalScroll } from '@/animations/horizontalScroll'
import { configureAllScrollAnimations } from '@/animations/scrollAnimations'
import PresentationSection from './PresentationSection'
import AboutSection from './AboutSection'
import ProjectsSection from './ProjectsSection'
import '../../styles/HomePage.css'

// Force TypeScript à traiter ce fichier comme un module
export {}

export default function HomePage() {
    // Références pour les éléments à animer
    const rocketRef = useRef<HTMLDivElement>(null)
    const portraitRef = useRef<HTMLImageElement>(null)
    const descriptionContainerRef = useRef<HTMLDivElement>(null)
    const horizontalContainerRef = useRef<HTMLDivElement>(null)
    const horizontalWrapperRef = useRef<HTMLDivElement>(null)
    const section1Ref = useRef<HTMLElement>(null)
    const section2Ref = useRef<HTMLElement>(null)
    const section3Ref = useRef<HTMLElement>(null)
    const aboutSvgRef = useRef<HTMLDivElement>(null)
    const hologramSvgRef = useRef<HTMLDivElement>(null)
    const profileDescriptionSvgRef = useRef<HTMLDivElement>(null)
    const [profileDescriptionSvgContent, setProfileDescriptionSvgContent] = useState<string>('')
    const [rocketContent, setRocketContent] = useState<string>('')
    const [aboutSvgContent, setAboutSvgContent] = useState<string>('')
    const [hologramSvgContent, setHologramSvgContent] = useState<string>('')

    // Charger la fusee en inline
    useEffect(() => {
        fetch('/assets/svg/fusee.svg')
            .then(response => response.text())
            .then(svg => {
                setRocketContent(svg)
            })
            .catch(error => {
                // Erreur silencieuse
            })
    }, [])

    // Charger le SVG pour la section à propos
    useEffect(() => {
        fetch('/assets/svg/extraterrestre.svg')
            .then(response => response.text())
            .then(svg => {
                // Agrandir le viewBox pour éviter que les bras et jambes soient coupés lors de l'animation
                // Le viewBox original est "0 0 64 188", on ajoute de l'espace de manière symétrique
                // Centre original : x=32, y=94. On ajoute 40px de chaque côté horizontalement et 30px verticalement
                let expandedSvg = svg.replace(
                    /viewBox="([^"]*)"/,
                    'viewBox="-40 -30 144 248"'
                )
                // Ajuster aussi les attributs width et height pour garder la même taille d'affichage
                // Largeur : 64 -> 144 (facteur 2.25), Hauteur : 188 -> 248 (facteur ~1.32)
                // On utilise le facteur de largeur pour maintenir les proportions
                expandedSvg = expandedSvg.replace(
                    /width="([^"]*)"/,
                    'width="144"'
                )
                expandedSvg = expandedSvg.replace(
                    /height="([^"]*)"/,
                    'height="248"'
                )
                setAboutSvgContent(expandedSvg)
            })
            .catch(error => {
                // Erreur silencieuse
            })
    }, [])

    // Charger le SVG hologramme pour la section à propos
    useEffect(() => {
        fetch('/assets/svg/hologramme.svg')
            .then(response => response.text())
            .then(svg => {
                // Doubler la taille du SVG en multipliant width et height par 2
                let enlargedSvg = svg.replace(
                    /width="([^"]*)"/,
                    (match, width) => {
                        const numWidth = parseFloat(width)
                        return `width="${numWidth * 2}"`
                    }
                )
                enlargedSvg = enlargedSvg.replace(
                    /height="([^"]*)"/,
                    (match, height) => {
                        const numHeight = parseFloat(height)
                        return `height="${numHeight * 2}"`
                    }
                )
                setHologramSvgContent(enlargedSvg)
            })
            .catch(error => {
                // Erreur silencieuse
            })
    }, [])

    // Charger le SVG pour la description de profil
    useEffect(() => {
        fetch("/assets/svg/text/profile-desktop.svg")
          .then((r) => r.text())
          .then((svg) => {
            let s = svg;
      
            // 1) Ajouter/concaténer la classe sur <svg>
            if (/\bclass="/.test(s)) {
              s = s.replace(/\bclass="([^"]*)"/, (m, cls) => `class="${cls} handwriting-svg"`);
            } else {
              s = s.replace(/<svg\b/, `<svg class="handwriting-svg"`);
            }
      
            // 2) Sizing responsive (évite de casser le viewBox)
            // - on retire width/height fixes si présents
            s = s.replace(/\swidth="[^"]*"/, "");
            s = s.replace(/\sheight="[^"]*"/, "");
            // - on met width/height en 100% directement sur le SVG
            s = s.replace(/<svg\b/, `<svg width="200%" height="200%" preserveAspectRatio="xMidYMid meet"`);
      
            setProfileDescriptionSvgContent(s);
          })
          .catch(() => {});
      }, []);


    // Configuration du scroll horizontal contrôlé avec GSAP ScrollTrigger
    useEffect(() => {
        if (!horizontalContainerRef.current || !horizontalWrapperRef.current || !rocketContent) return

        const container = horizontalContainerRef.current
        const wrapper = horizontalWrapperRef.current
        const sections = [section1Ref.current, section2Ref.current, section3Ref.current].filter(Boolean) as HTMLElement[]

        if (sections.length === 0) return

        // Attendre que le DOM soit complètement rendu avant de calculer les dimensions
        const timeout = setTimeout(async () => {
            // S'assurer que la page est en haut pour que le pin fonctionne correctement
            window.scrollTo(0, 0)

            // Vérifier que toutes les sections ont leur taille finale
            const allSectionsReady = sections.every(section => section.offsetWidth > 0 && section.offsetHeight > 0)
            
            if (!allSectionsReady) {
                // Si les sections ne sont pas prêtes, réessayer
                ScrollTrigger.refresh()
                return
            }


            // Configurer le scroll horizontal (calcule et définit automatiquement la largeur du wrapper)
            const { scrollTween, scrollValues } = setupHorizontalScroll(container, wrapper, sections)

            // Configurer toutes les animations qui suivent le scroll
            configureAllScrollAnimations(container, wrapper, sections, rocketRef.current, scrollTween, scrollValues, portraitRef.current, descriptionContainerRef.current, aboutSvgRef.current, hologramSvgRef.current, profileDescriptionSvgRef.current)

            // Rafraîchir ScrollTrigger pour s'assurer que tout est bien calculé
            ScrollTrigger.refresh()
            
            // S'assurer que la page est toujours en haut après le refresh
            window.scrollTo(0, 0)
        }, 200) // Augmenter le délai pour s'assurer que tout est rendu

        // Nettoyage
        return () => {
            clearTimeout(timeout)
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [rocketContent])

    return (
        <div 
            className="horizontal-scroll-container" 
            ref={horizontalContainerRef}
        >
            <div 
                className="horizontal-scroll-wrapper" 
                ref={horizontalWrapperRef}
            >
                <div className="ground-overcoat" aria-hidden="true" />
                <div className="ground-line" aria-hidden="true" />
                <PresentationSection 
                    ref={section1Ref}
                    rocketContent={rocketContent}
                    rocketRef={rocketRef}
                    portraitRef={portraitRef}
                    descriptionContainerRef={descriptionContainerRef}
                />
                <AboutSection 
                    ref={section2Ref} 
                    svgContent={aboutSvgContent}
                    svgRef={aboutSvgRef}
                    hologramSvgContent={hologramSvgContent}
                    hologramSvgRef={hologramSvgRef}
                    profileDescriptionSvgRef={profileDescriptionSvgRef}
                    profileDescriptionSvgContent={profileDescriptionSvgContent}
                />
                <ProjectsSection ref={section3Ref} />
            </div>
        </div>
    )
}
