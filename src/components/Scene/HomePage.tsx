'use client' // GSAP coté client

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@/animations/gsap'
import { setupHorizontalScroll } from '@/animations/horizontalScroll'
import { configureAllScrollAnimations } from '@/animations/scrollAnimations'
import { observeViewport, getViewportMetrics } from '@/animations/viewport'
import { computeCamera, applyCamera } from '@/animations/camera'
import { sceneConfig } from '@/animations/sceneConfig'
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
    const observeUnsubscribeRef = useRef<(() => void) | null>(null)
    const lastViewportWRef = useRef<number>(0)
    const lastViewportHRef = useRef<number>(0)
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
      
            // 2) Sizing responsive : on retire width/height fixes si présents (CSS gère width:100% height:auto)
            s = s.replace(/\swidth="[^"]*"/, "");
            s = s.replace(/\sheight="[^"]*"/, "");

            setProfileDescriptionSvgContent(s);
          })
          .catch(() => {});
      }, []);

    // Init GSAP + caméra avant paint (useLayoutEffect) ; double rAF pour attendre le layout.
    // Tests manuels : refresh page -> pas de saut après 0.5–1s, juste fade-in 160ms ;
    // zoom -> rebuild ok, stage centré ; resize -> pas de boucle ResizeObserver, scrub inchangé.
    useLayoutEffect(() => {
        if (!horizontalContainerRef.current || !stageRef.current || !horizontalWrapperRef.current || !rocketContent) return

        const container = horizontalContainerRef.current
        const stage = stageRef.current
        const wrapper = horizontalWrapperRef.current

        stage.classList.remove('is-ready')

        const runInit = (metrics: { width: number; height: number }) => {
            const sections = [section1Ref.current, section2Ref.current, section3Ref.current, section4Ref.current, section5Ref.current].filter(Boolean) as HTMLElement[]
            if (sections.length === 0) return false
            const allSectionsReady = sections.every(section => section.offsetWidth > 0 && section.offsetHeight > 0)
            if (!allSectionsReady) return false

            const camera = computeCamera({
                viewportW: metrics.width,
                viewportH: metrics.height,
                worldW: sceneConfig.world.width,
                worldH: sceneConfig.world.height,
                ...sceneConfig.cameraOptions,
            })
            applyCamera(stage, camera)

            scrollAnimationsCleanupRef.current?.()
            scrollAnimationsCleanupRef.current = undefined
            horizontalScrollKillRef.current?.()
            horizontalScrollKillRef.current = null
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())

            const { scrollTween, scrollValues, kill } = setupHorizontalScroll(container, stage, wrapper, sections, camera)
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
                likethatDescRef
            )
            ScrollTrigger.refresh()
            stage.classList.add('is-ready')
            return true
        }

        const onResize = (metrics: { width: number; height: number }) => {
            const w = Math.round(metrics.width)
            const h = Math.round(metrics.height)
            if (w === lastViewportWRef.current && h === lastViewportHRef.current) return
            lastViewportWRef.current = w
            lastViewportHRef.current = h

            requestAnimationFrame(() => {
                scrollAnimationsCleanupRef.current?.()
                scrollAnimationsCleanupRef.current = undefined
                horizontalScrollKillRef.current?.()
                horizontalScrollKillRef.current = null
                ScrollTrigger.getAll().forEach(trigger => trigger.kill())

                const sections = [section1Ref.current, section2Ref.current, section3Ref.current, section4Ref.current, section5Ref.current].filter(Boolean) as HTMLElement[]
                if (sections.length === 0) return
                const camera = computeCamera({
                    viewportW: metrics.width,
                    viewportH: metrics.height,
                    worldW: sceneConfig.world.width,
                    worldH: sceneConfig.world.height,
                    ...sceneConfig.cameraOptions,
                })
                applyCamera(stage, camera)
                const { scrollTween, scrollValues, kill } = setupHorizontalScroll(container, stage, wrapper, sections, camera)
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
                    likethatDescRef
            )
                ScrollTrigger.refresh()
            })
        }

        let rafId = 0
        const scheduleInit = () => {
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    window.scrollTo(0, 0)
                    const metrics = getViewportMetrics(container)
                    lastViewportWRef.current = Math.round(metrics.width)
                    lastViewportHRef.current = Math.round(metrics.height)
                    if (!runInit(metrics)) {
                        ScrollTrigger.refresh()
                        observeUnsubscribeRef.current = observeViewport(container, onResize)
                        return
                    }
                    window.scrollTo(0, 0)
                    observeUnsubscribeRef.current = observeViewport(container, onResize)
                })
            })
        }
        scheduleInit()

        return () => {
            cancelAnimationFrame(rafId)
            observeUnsubscribeRef.current?.()
            observeUnsubscribeRef.current = null
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
