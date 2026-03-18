'use client'

import React, { forwardRef, useRef, useState } from 'react'
import { useSplitLetters } from '@/hooks/useSplitLetters'
import InkScroll from '@/components/InkScroll/InkScroll'
import type { TextareaScrollController } from '@/utils/textareaScrollController'
import { sanitizeContactTextareaValue } from '@/utils/sanitizeContactTextareaValue'
import '../../styles/HomePage.css'
import '../../styles/ContactSection.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIRED_FIELDS = [
    { key: 'nom' as const, label: 'Nom' },
    { key: 'prenom' as const, label: 'Prénom' },
    { key: 'email' as const, label: 'Email' },
    { key: 'message' as const, label: 'Message' },
] as const

/**
 * Section Contact avec illustration support-contact et formulaire en superposition.
 */
const ContactSection = forwardRef<HTMLElement>((props, ref) => {
    const titleWrapperRef = useRef<HTMLDivElement>(null)
    const scrollControllerRef = useRef<TextareaScrollController | null>(null)
    useSplitLetters(titleWrapperRef, { selector: '.placeholder-title' })

    const [formState, setFormState] = useState({
        nom: '',
        prenom: '',
        societe: '',
        email: '',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const updateField = (field: keyof typeof formState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((prev) => ({ ...prev, [field]: e.target.value }))
        if (status === 'error' || fieldErrors[field]) {
            setStatus('idle')
            setFieldErrors((prev) => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target
        const { value, selectionStart, selectionEnd } = el
        const sanitized = sanitizeContactTextareaValue(value)
        const newStart = sanitizeContactTextareaValue(value.slice(0, selectionStart)).length
        const newEnd = newStart + sanitizeContactTextareaValue(value.slice(selectionStart, selectionEnd)).length

        setFormState((prev) => ({ ...prev, message: sanitized }))
        if (status === 'error' || fieldErrors.message) {
            setStatus('idle')
            setFieldErrors((prev) => {
                const next = { ...prev }
                delete next.message
                return next
            })
        }

        queueMicrotask(() => {
            el.setSelectionRange(newStart, newEnd)
        })
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}
        if (!formState.nom.trim()) errors.nom = 'obligatoire'
        if (!formState.prenom.trim()) errors.prenom = 'obligatoire'
        if (!formState.message.trim()) errors.message = 'obligatoire'
        if (!formState.email.trim()) {
            errors.email = 'obligatoire'
        } else if (!EMAIL_REGEX.test(formState.email.trim())) {
            errors.email = 'invalide'
        }
        setFieldErrors(errors)
        if (Object.keys(errors).length === 0) return true
        const labels = REQUIRED_FIELDS.filter((f) => errors[f.key]).map((f) =>
            f.key === 'email' && errors.email === 'invalide' ? 'Email (format incorrect)' : f.label
        )
        setErrorMessage(`Champs manquants ou invalides : ${labels.join(', ')}.`)
        return false
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (status === 'sending') return
        if (!validateForm()) {
            setStatus('error')
            return
        }
        setStatus('sending')
        setErrorMessage('')
        setFieldErrors({})
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setStatus('error')
                setErrorMessage(data.error || 'Erreur lors de l\'envoi.')
                if (data.fieldErrors && typeof data.fieldErrors === 'object') {
                    setFieldErrors(data.fieldErrors)
                }
                return
            }
            setStatus('success')
            setFormState({ nom: '', prenom: '', societe: '', email: '', message: '' })
        } catch {
            setStatus('error')
            setErrorMessage('Erreur réseau.')
        }
    }

    return (
        <section className="horizontal-section contact-section-placeholder" ref={ref}>
            <div className="contact-section-title-wrapper" ref={titleWrapperRef}>
                <h2 className="placeholder-title">Dernier</h2>
                <h2 className="placeholder-title">croquis,</h2>
                <h2 className="placeholder-title">premiers</h2>
                <h2 className="placeholder-title">échanges.</h2>
            </div>
            <div className="contact-section-svg-wrapper" aria-hidden="true">
                <img
                    src="/assets/svg/support-contact.svg"
                    alt=""
                    className="contact-section-svg"
                    draggable={false}
                />
            </div>
            <form
                className="contact-form-overlay"
                aria-label="Formulaire de contact"
                onSubmit={handleSubmit}
                noValidate
            >
                <div
                    className={`contact-field contact-field-nom ${formState.nom.trim() ? 'is-filled' : ''} ${fieldErrors.nom ? 'has-error' : ''}`}
                >
                    <label htmlFor="contact-nom" className="contact-label">
                        Nom
                    </label>
                    <input
                        id="contact-nom"
                        type="text"
                        name="nom"
                        value={formState.nom}
                        onChange={updateField('nom')}
                        className="contact-input"
                        autoComplete="family-name"
                        required
                        aria-required="true"
                        aria-invalid={!!fieldErrors.nom}
                    />
                </div>
                <div
                    className={`contact-field contact-field-prenom ${formState.prenom.trim() ? 'is-filled' : ''} ${fieldErrors.prenom ? 'has-error' : ''}`}
                >
                    <label htmlFor="contact-prenom" className="contact-label">
                        Prénom
                    </label>
                    <input
                        id="contact-prenom"
                        type="text"
                        name="prenom"
                        value={formState.prenom}
                        onChange={updateField('prenom')}
                        className="contact-input"
                        autoComplete="given-name"
                        required
                        aria-required="true"
                        aria-invalid={!!fieldErrors.prenom}
                    />
                </div>
                <div
                    className={`contact-field contact-field-societe ${formState.societe.trim() ? 'is-filled' : ''}`}
                >
                    <label htmlFor="contact-societe" className="contact-label">
                        Société
                    </label>
                    <input
                        id="contact-societe"
                        type="text"
                        name="societe"
                        value={formState.societe}
                        onChange={updateField('societe')}
                        className="contact-input"
                        autoComplete="organization"
                    />
                </div>
                <div
                    className={`contact-field contact-field-email ${formState.email.trim() ? 'is-filled' : ''} ${fieldErrors.email ? 'has-error' : ''}`}
                >
                    <label htmlFor="contact-email" className="contact-label">
                        Email
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={updateField('email')}
                        className="contact-input"
                        autoComplete="email"
                        required
                        aria-required="true"
                        aria-invalid={!!fieldErrors.email}
                    />
                </div>
                <div
                    className={`contact-field contact-field-message ${formState.message.trim() ? 'is-filled' : ''} ${fieldErrors.message ? 'has-error' : ''}`}
                >
                    <label htmlFor="contact-message" className="contact-label">
                        Message
                    </label>
                    <InkScroll
                        variant="textarea"
                        onScrollControllerReady={(c) => { scrollControllerRef.current = c }}
                    >
                        <textarea
                            id="contact-message"
                            name="message"
                            value={formState.message}
                            onChange={handleMessageChange}
                            className="contact-input contact-textarea"
                            rows={4}
                            autoComplete="off"
                            required
                            aria-required="true"
                            aria-invalid={!!fieldErrors.message}
                        />
                    </InkScroll>
                </div>
                <div className="contact-submit-wrapper">
                    <button
                        type="submit"
                        className="contact-submit-btn"
                        disabled={status === 'sending'}
                    >
                        {status === 'sending' ? 'Envoi…' : 'Valider'}
                    </button>
                </div>
                {status === 'error' && errorMessage && (
                    <p className="contact-form-error" role="alert">
                        {errorMessage}
                    </p>
                )}
                {status === 'success' && (
                    <p className="contact-form-success" role="status">
                        Message envoyé.
                    </p>
                )}
            </form>
        </section>
    )
})

ContactSection.displayName = 'ContactSection'

export default ContactSection
