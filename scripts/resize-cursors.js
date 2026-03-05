/**
 * Génère les curseurs PNG à 3/4 (75 %) dans public/assets/svg/pointer/small/
 * Usage : node scripts/resize-cursors.js
 * Nécessite : npm install sharp (devDependency)
 */

const path = require('path')
const fs = require('fs')

const SCALE = 0.75 // 3/4 de la taille d'origine
const NAMES = ['default', 'pointer', 'text', 'grab', 'grabbing']
const ROOT = path.join(__dirname, '..', 'public', 'assets', 'svg', 'pointer')
const SRC_DIR = ROOT
const OUT_DIR = path.join(ROOT, 'small')

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Installez sharp : npm install sharp --save-dev')
    process.exit(1)
  }

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  for (const name of NAMES) {
    const src = path.join(SRC_DIR, `${name}.png`)
    const dest = path.join(OUT_DIR, `${name}.png`)
    if (!fs.existsSync(src)) {
      console.warn('Ignoré (fichier absent):', src)
      continue
    }
    const meta = await sharp(src).metadata()
    const w = Math.max(1, Math.round((meta.width || 32) * SCALE))
    const h = Math.max(1, Math.round((meta.height || 32) * SCALE))
    await sharp(src).resize(w, h).png().toFile(dest)
    console.log(`${name}.png → small/${name}.png (${w}x${h}, ${SCALE * 100}%)`)
  }
  console.log('Terminé.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
