'use client' // GSAP coté client

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@/animations/gsap'
import { setupHorizontalScroll } from '@/animations/horizontalScroll'
import { configureAllScrollAnimations } from '@/animations/scrollAnimations'
import { computeResponsiveTokens, applyResponsiveTokens } from '@/scene/responsiveTokens'
import { runTokensDebugSnapshot } from '@/scene/tokensDebug'
import PresentationSection from './PresentationSection'
import AboutSection from './AboutSection'
import ProjectsSection from './ProjectsSection'
import ProjetsSection from './ProjetsSection'
import ContactSection from './ContactSection'
import '../../styles/HomePage.css'

// Force TypeScript à traiter ce fichier comme un module
export {}

export default function HomePage() {
    // Références pour les éléments à animer
    const rocketRef = useRef<HTMLDivElement>(null)
    const portraitRef = useRef<HTMLImageElement>(null)
    const descriptionContainerRef = useRef<HTMLDivElement>(null)
    const horizontalContainerRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const horizontalWrapperRef = useRef<HTMLDivElement>(null)
    const section1Ref = useRef<HTMLElement>(null)
    const section2Ref = useRef<HTMLElement>(null)
    const section3Ref = useRef<HTMLElement>(null)
    const section4Ref = useRef<HTMLElement>(null)
    const section5Ref = useRef<HTMLElement>(null)
    const aboutSvgRef = useRef<HTMLDivElement>(null)
    const hologramSvgRef = useRef<HTMLDivElement>(null)
    const profileDescriptionSvgRef = useRef<HTMLDivElement>(null)
    const experiencesHabitationBackRef = useRef<HTMLDivElement>(null)
    const experiencesHabitationFrontRef = useRef<HTMLDivElement>(null)
    const alien2ContainerRef = useRef<HTMLDivElement>(null)
    const experienceQuestTitreRef = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip1Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip2Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip3Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip4Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip5Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescrip6Ref = useRef<HTMLDivElement>(null)
    const experienceQuestDescripRefs = [
        experienceQuestDescrip1Ref,
        experienceQuestDescrip2Ref,
        experienceQuestDescrip3Ref,
        experienceQuestDescrip4Ref,
        experienceQuestDescrip5Ref,
        experienceQuestDescrip6Ref,
    ]
    const robotHeadRef = useRef<HTMLDivElement>(null)
    const robotHandRef = useRef<HTMLDivElement>(null)
    const convoyeurProjetRef = useRef<HTMLDivElement>(null)
    const scaniaTitreRef = useRef<HTMLDivElement | null>(null)
    const scaniaDescRef = useRef<HTMLDivElement | null>(null)
    const likethatTitreRef = useRef<HTMLDivElement | null>(null)
    const likethatDescRef = useRef<HTMLDivElement | null>(null)
    const scrollAnimationsCleanupRef = useRef<(() => void) | void>(undefined)
    const horizontalScrollKillRef = useRef<(() => void) | null>(null)
    const [profileDescriptionSvgContent, setProfileDescriptionSvgContent] = useState<string>('')
    const [rocketContent, setRocketContent] = useState<string>('')
    const [aboutSvgContent, setAboutSvgContent] = useState<string>('')
    const [hologramSvgContent, setHologramSvgContent] = useState<string>('')

    const getAboutBigSvgScaleFactor = (): 2 | 3 => {
        if (typeof window === 'undefined') return 2
        const w = window.innerWidth || 0
        const h = window.innerHeight || 0
        const isVeryTallDesktop = h > 1000
        const isPortrait = h > w
        return (isVeryTallDesktop || isPortrait) ? 3 : 2
    }

    // Charger la fusee en inline
    useEffect(() => {
        fetch('/assets/svg/fusee.svg')
            .then(response => response.text())
            .then(svg => {
                // Ajouter un ancrage "sol" pour aligner la fusée sur la ground line en JS.
                // On utilise des % pour être indépendant du viewBox : (50%, 100%) = bas-centre du SVG.
                const hasAnchor = /id="rocket-ground-anchor"/.test(svg)
                const anchoredSvg = hasAnchor
                    ? svg
                    : svg.replace(
                          /<\/svg>/,
                          '<circle id="rocket-ground-anchor" cx="50%" cy="100%" r="1" fill="transparent" opacity="0" pointer-events="none" /></svg>'
                      )
                setRocketContent(anchoredSvg)
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
                const scaleFactor = getAboutBigSvgScaleFactor()
                const aboutScale = scaleFactor / 2 // base actuelle = 2 ; mode grand = 3 (=> x1.5)
                const targetWidth = Math.round(144 * aboutScale)
                const targetHeight = Math.round(248 * aboutScale)

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
                    `width="${targetWidth}"`
                )
                expandedSvg = expandedSvg.replace(
                    /height="([^"]*)"/,
                    `height="${targetHeight}"`
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
                const scaleFactor = getAboutBigSvgScaleFactor()
                // Desktop très haut (>1000px) ou écran portrait : on multiplie par 3, sinon par 2.
                let enlargedSvg = svg.replace(
                    /width="([^"]*)"/,
                    (match, width) => {
                        const numWidth = parseFloat(width)
                        return `width="${numWidth * scaleFactor}"`
                    }
                )
                enlargedSvg = enlargedSvg.replace(
                    /height="([^"]*)"/,
                    (match, height) => {
                        const numHeight = parseFloat(height)
                        return `height="${numHeight * scaleFactor}"`
                    }
                )
                setHologramSvgContent(enlargedSvg)
            })
            .catch(error => {
                // Erreur silencieuse
            })
    }, [])

    // Expose la demi-hauteur de l'hologramme (mesure unique à l'init).
    useEffect(() => {
        const stage = stageRef.current
        const hologram = hologramSvgRef.current
        if (!stage || !hologram || typeof window === 'undefined') return

        const updateHologramHalfHeight = () => {
            const rect = hologram.getBoundingClientRect()
            const halfHeight = Math.max(0, rect.height / 2)
            stage.style.setProperty('--about-hologram-half-height-px', `${halfHeight}px`)
        }

        const raf = requestAnimationFrame(() => requestAnimationFrame(updateHologramHalfHeight))

        return () => {
            cancelAnimationFrame(raf)
        }
    }, [hologramSvgContent])

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
      
            // 2) Sizing responsive : on retire width/height fixes si présents (CSS gère width:100% height:auto)
            s = s.replace(/\swidth="[^"]*"/, "");
            s = s.replace(/\sheight="[^"]*"/, "");

            setProfileDescriptionSvgContent(s);
          })
          .catch(() => {});
      }, []);

    // Init GSAP + caméra avant paint (useLayoutEffect) ; init unique, sans listener resize.
    useLayoutEffect(() => {
        if (!horizontalContainerRef.current || !stageRef.current || !horizontalWrapperRef.current || !rocketContent) return

        const container = horizontalContainerRef.current
        const stage = stageRef.current
        const wrapper = horizontalWrapperRef.current

        stage.classList.remove('is-ready')

        const runInit = (): boolean => {
            const metrics = {
                width: Math.max(1, Math.round(container.clientWidth || window.innerWidth || 1)),
                height: Math.max(1, Math.round(container.clientHeight || window.innerHeight || 1)),
            }
            const sections = [section1Ref.current, section2Ref.current, section3Ref.current, section4Ref.current, section5Ref.current].filter(Boolean) as HTMLElement[]
            if (sections.length === 0) return false
            const allSectionsReady = sections.every(section => section.offsetWidth > 0 && section.offsetHeight > 0)
            if (!allSectionsReady) return false

            const tokens = computeResponsiveTokens(metrics)
            applyResponsiveTokens(stage, tokens)

            if (typeof window !== 'undefined' && ((window as Window & { __TOKENS_DEBUG__?: boolean }).__TOKENS_DEBUG__ || (window as Window & { __TOKENS_DEBUG_OVERLAY__?: boolean }).__TOKENS_DEBUG_OVERLAY__)) {
                requestAnimationFrame(() => requestAnimationFrame(() => runTokensDebugSnapshot(metrics, stage)))
            }

            scrollAnimationsCleanupRef.current?.()
            scrollAnimationsCleanupRef.current = undefined
            horizontalScrollKillRef.current?.()
            horizontalScrollKillRef.current = null
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())

            const { scrollTween, scrollValues, kill } = setupHorizontalScroll(container, stage, wrapper, sections)
            horizontalScrollKillRef.current = kill
            scrollAnimationsCleanupRef.current = configureAllScrollAnimations(
                container,
                sections,
                wrapper,
                rocketRef.current,
                scrollTween,
                scrollValues,
                portraitRef.current,
                descriptionContainerRef.current,
                aboutSvgRef.current,
                hologramSvgRef.current,
                profileDescriptionSvgRef.current,
                experiencesHabitationBackRef.current,
                experiencesHabitationFrontRef.current,
                alien2ContainerRef.current,
                () => convoyeurProjetRef.current,
                robotHeadRef.current,
                robotHandRef.current,
                experienceQuestTitreRef,
                experienceQuestDescripRefs,
                scaniaTitreRef,
                scaniaDescRef,
                likethatTitreRef,
                likethatDescRef,
                tokens
            )
            ScrollTrigger.refresh()
            stage.classList.add('is-ready')
            return true
        }

        let rafId = 0
        let retryTimeout: ReturnType<typeof setTimeout> | null = null
        let tries = 0
        const maxTries = 30

        const initWithRetry = () => {
            if (runInit()) {
                window.scrollTo(0, 0)
                return
            }
            tries += 1
            if (tries >= maxTries) {
                runInit()
                return
            }
            retryTimeout = setTimeout(initWithRetry, 100)
        }

        const scheduleInit = () => {
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    window.scrollTo(0, 0)
                    initWithRetry()
                })
            })
        }
        scheduleInit()

        return () => {
            cancelAnimationFrame(rafId)
            if (retryTimeout) clearTimeout(retryTimeout)
            scrollAnimationsCleanupRef.current?.()
            scrollAnimationsCleanupRef.current = undefined
            horizontalScrollKillRef.current?.()
            horizontalScrollKillRef.current = null
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
            stage.classList.remove('is-ready')
        }
    }, [rocketContent])

    return (
        <div 
            className="horizontal-scroll-container" 
            ref={horizontalContainerRef}
        >
            <div 
                className="horizontal-scroll-stage" 
                ref={stageRef}
                data-debug-id="responsive-stage"
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
                <ProjectsSection
                    ref={section3Ref}
                    habitationBackRef={experiencesHabitationBackRef}
                    habitationFrontRef={experiencesHabitationFrontRef}
                    alien2ContainerRef={alien2ContainerRef}
                    experienceQuestTitreRef={experienceQuestTitreRef}
                    experienceQuestDescripRefs={experienceQuestDescripRefs}
                />
                <ProjetsSection
                    ref={section4Ref}
                    robotHeadRef={robotHeadRef}
                    robotHandRef={robotHandRef}
                    convoyeurProjetRef={convoyeurProjetRef}
                    scaniaTitreRef={scaniaTitreRef}
                    scaniaDescRef={scaniaDescRef}
                    likethatTitreRef={likethatTitreRef}
                    likethatDescRef={likethatDescRef}
                />
                <ContactSection ref={section5Ref} />
                </div>
            </div>
        </div>
    )
}
