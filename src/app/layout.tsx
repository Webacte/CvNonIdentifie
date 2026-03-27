import type { Metadata } from 'next'
import React from 'react'
import dynamic from 'next/dynamic'
import './globals.css'
import '@/styles/cursors.css'
import '@/styles/ErrorFallback.css'

const InkScrollWindowOverlay = dynamic(
  () => import('@/components/InkScroll/InkScrollWindowOverlay'),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Portfolio Animé',
  description: 'Portfolio animé avec GSAP',
  icons: {
    icon: [
      { url: '/assets/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/assets/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/assets/favicon/site.webmanifest' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        {children}
        <InkScrollWindowOverlay />
        <noscript>
          <div className="error-fallback" role="main">
            <div className="error-fallback__inner">
              <img
                src="/assets/svg/error-robot.svg"
                alt="Illustration d'un robot pour indiquer une erreur"
                className="error-fallback__image"
                width="93"
                height="124"
              />
              <h1 className="error-fallback__title">JavaScript requis</h1>
              <p className="error-fallback__text">
                Vous etes bien sur le portfolio de Benjamin Pochon, mais celui-ci nécessite JavaScript pour fonctionner correctement. Merci de le réactiver dans votre navigateur.
              </p>
              <div className="error-fallback__actions">
                <a href="/" className="error-fallback__link">Retour sur le portfolio</a>
              </div>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  )
}
