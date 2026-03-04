import type { Metadata } from 'next'
import React from 'react'
import dynamic from 'next/dynamic'
import './globals.css'
import '@/animations/gsap'

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
      </body>
    </html>
  )
}
