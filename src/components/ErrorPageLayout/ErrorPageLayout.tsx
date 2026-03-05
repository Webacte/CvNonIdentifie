import React from 'react'
import Link from 'next/link'
import '@/styles/ErrorFallback.css'

const ERROR_ROBOT_ALT = 'Illustration d’un robot pour indiquer une erreur'

export interface ErrorPageLayoutProps {
  title: string
  description: React.ReactNode
  showBackToHome?: boolean
  showContactLink?: boolean
}

export default function ErrorPageLayout({
  title,
  description,
  showBackToHome = false,
  showContactLink = false,
}: ErrorPageLayoutProps) {
  return (
    <div className="error-fallback" role="main">
      <div className="error-fallback__inner">
        <img
          src="/assets/svg/error-robot.svg"
          alt={ERROR_ROBOT_ALT}
          className="error-fallback__image"
          width={93}
          height={124}
        />
        <h1 className="error-fallback__title">{title}</h1>
        <p className="error-fallback__text">{description}</p>
        {(showBackToHome || showContactLink) && (
          <div className="error-fallback__actions">
            {showBackToHome && (
              <Link href="/" className="error-fallback__link">
                Retour sur le portfolio
              </Link>
            )}
            {showContactLink && (
              <Link href="/" className="error-fallback__link">
                Me contacter
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
