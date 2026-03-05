import ErrorPageLayout from '@/components/ErrorPageLayout/ErrorPageLayout'

export default function NotFound() {
  return (
    <ErrorPageLayout
      title="Page introuvable"
      description="Vous etes bien sur le portfolio de Benjamin Pochon, mais la page que vous cherchez est introuvable."
      showBackToHome
    />
  )
}
