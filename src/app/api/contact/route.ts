import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_EMAIL = 'pochon.benjamin@webacte.com'

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey?.trim()) {
        return NextResponse.json(
            { error: 'Configuration email manquante : ajoutez RESEND_API_KEY dans .env.local' },
            { status: 503 }
        )
    }

    try {
        const body = await request.json()
        const { nom, prenom, societe, email, message } = body as {
            nom?: string
            prenom?: string
            societe?: string
            email?: string
            message?: string
        }

        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const fieldErrors: Record<string, string> = {}
        if (!nom?.trim()) fieldErrors.nom = 'obligatoire'
        if (!prenom?.trim()) fieldErrors.prenom = 'obligatoire'
        if (!email?.trim()) fieldErrors.email = 'obligatoire'
        else if (!EMAIL_REGEX.test(email.trim())) fieldErrors.email = 'invalide'
        if (!message?.trim()) fieldErrors.message = 'obligatoire'

        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json(
                { error: 'Champs manquants ou invalides.', fieldErrors },
                { status: 400 }
            )
        }

        const html = `
            <p><strong>Nom :</strong> ${escapeHtml(nom ?? '')}</p>
            <p><strong>Prénom :</strong> ${escapeHtml(prenom ?? '')}</p>
            <p><strong>Société :</strong> ${escapeHtml(societe || '—')}</p>
            <p><strong>Email :</strong> ${escapeHtml(email ?? '')}</p>
            <p><strong>Message :</strong></p>
            <p>${escapeHtml(message ?? '').replace(/\n/g, '<br>')}</p>
        `

        const resend = new Resend(apiKey)
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM as string,
            to: [TO_EMAIL as string],
            replyTo: email,
            subject: `Contact site CV — ${prenom} ${nom}`,
            html,
        })

        if (error) {
            console.error('Resend API error:', error)
            return NextResponse.json(
                { error: error.message || 'Erreur Resend.' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, id: data?.id })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue'
        console.error('Contact API error:', err)
        return NextResponse.json(
            { error: process.env.NODE_ENV === 'development' ? message : 'Erreur lors de l\'envoi du message.' },
            { status: 500 }
        )
    }
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (c) => map[c] ?? c)
}
