/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evite les verrouillages/permissions sur le dossier `.next` (Windows).
  distDir: '.next-dev',
}

module.exports = nextConfig
