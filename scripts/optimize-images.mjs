import { mkdirSync, copyFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import sharp from 'sharp'

/*
 * Optimises images/ into public/images/. Only writes to public/; re-runnable.
 * Anything not listed below is intentionally skipped — the old backgrounds and
 * loader GIF are drawn by the cosmos canvas instead.
 */

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'images')
const OUT = join(ROOT, 'public', 'images')

const TIMELINE_LOGOS = [
  'atlas_cc_logo.jpg',
  'weyaai_logo.jpg',
  'fancraze_logo.jpg',
  'kareai.png',
  'meta.jpg',
  'gdsc_icon.jpg',
  'googleicon.png',
]

const ensure = (dir) => mkdirSync(dir, { recursive: true })
const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`

let inputBytes = 0
let outputBytes = 0

async function encode(srcPath, outPath, { width, height, fit = 'inside', quality = 72 }) {
  const before = statSync(srcPath).size
  await sharp(srcPath)
    .resize({ width, height, fit, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(outPath)
  const after = statSync(outPath).size

  inputBytes += before
  outputBytes += after
  console.log(
    `  ${basename(outPath).padEnd(34)} ${kb(before).padStart(9)} -> ${kb(after).padStart(8)}` +
      `  (-${Math.round((1 - after / before) * 100)}%)`
  )
}

/* ---------------------------------------------------------------- */

/* 768w covers phones at ~2x; 1200w covers the featured slot at 2x. */
console.log('\nproject screenshots -> public/images/projects/  (768w + 1200w)')
ensure(join(OUT, 'projects'))
for (const file of readdirSync(join(SRC, 'projects'))) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const stem = basename(file, extname(file))
  await encode(join(SRC, 'projects', file), join(OUT, 'projects', `${stem}-768.webp`), {
    width: 768,
    quality: 70,
  })
  await encode(join(SRC, 'projects', file), join(OUT, 'projects', `${stem}-1200.webp`), {
    width: 1200,
    quality: 68,
  })
}

console.log('\ntimeline logos -> public/images/timeline/')
ensure(join(OUT, 'timeline'))
for (const file of TIMELINE_LOGOS) {
  const src = join(SRC, file)
  if (!existsSync(src)) {
    console.log(`  ! missing ${file}`)
    continue
  }
  await encode(src, join(OUT, 'timeline', `${basename(file, extname(file))}.webp`), {
    width: 96,
    height: 96,
    fit: 'cover',
    quality: 80,
  })
}

console.log('\nportrait -> public/images/bhavya.webp')
// First match wins, so dropping a newer file in as bhavya-portrait.png is all
// that is needed to replace the photo.
const portrait = ['bhavya-portrait.png', 'myself-removebg.png']
  .map((f) => join(SRC, f))
  .find(existsSync)
if (portrait) {
  await encode(portrait, join(OUT, 'bhavya.webp'), { width: 720, quality: 78 })
} else {
  console.log('  ! no portrait source found in images/')
}

console.log('\ntech icons -> public/images/icons/ (SVG, copied as-is)')
ensure(join(OUT, 'icons'))
let iconBytes = 0
for (const file of readdirSync(SRC)) {
  if (!file.startsWith('icon_') || !file.endsWith('.svg')) continue
  copyFileSync(join(SRC, file), join(OUT, 'icons', file))
  const size = statSync(join(OUT, 'icons', file)).size
  iconBytes += size
  outputBytes += size
  inputBytes += size
}
console.log(`  ${readdirSync(join(OUT, 'icons')).length} icons, ${kb(iconBytes)}`)

/* Favicon, apple-touch-icon and social card */

const PUBLIC = join(ROOT, 'public')
ensure(PUBLIC)

/* A gold "B" on the deep-space ground. Drawn as a path rather than <text> so it
   renders identically everywhere and does not depend on a font being installed
   when this is rasterised for the apple-touch icon. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#05070c"/>
  <path fill="#ffc24d" fill-rule="evenodd" d="M9 6h8.5c3 0 5 2 5 5 0 2.2-1.2 3.7-2.7 4.4 2 .6 3.4 2.3 3.4 4.8 0 3.3-2.4 5.8-6 5.8H9V6Zm4 3.4v4.2h3.8c1.4 0 2.2-.8 2.2-2.1 0-1.3-.8-2.1-2.2-2.1H13Zm0 7.8v5.4h4c1.6 0 2.6-1 2.6-2.6 0-1.7-1-2.8-2.6-2.8h-4Z"/>
</svg>
`
writeFileSync(join(PUBLIC, 'favicon.svg'), favicon)
console.log(`\nfavicon.svg  ${kb(Buffer.byteLength(favicon))}`)

await sharp(Buffer.from(favicon)).resize(180, 180).png({ compressionLevel: 9 }).toFile(join(PUBLIC, 'apple-touch-icon.png'))
console.log(`apple-touch-icon.png  ${kb(statSync(join(PUBLIC, 'apple-touch-icon.png')).size)}`)

// 1200x630 social card, composed as SVG then rasterised.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="28%" r="52%">
      <stop offset="0%" stop-color="#ffc24d" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#ffc24d" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#05070c"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="950" cy="190" r="92" fill="#ffc24d"/>
  <circle cx="1000" cy="163" r="82" fill="#05070c"/>
  ${Array.from({ length: 60 }, (_, i) => {
    // Deterministic scatter so the card is byte-identical between runs.
    const x = (i * 197) % 1200
    const y = (i * 383) % 630
    const r = ((i * 7) % 3) * 0.6 + 0.7
    const o = 0.2 + ((i * 13) % 10) / 20
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#e8edf5" opacity="${o.toFixed(2)}"/>`
  }).join('')}
  <text x="90" y="290" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="82" font-weight="700" fill="#e8edf5">Bhavya Mittal</text>
  <text x="90" y="352" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="#a8b4c6">Full-stack engineer &#183; Competitive programmer</text>
  <text x="90" y="440" font-family="Consolas, monospace" font-size="27" fill="#ffc24d">ICPC AIR 37   &#183;   Codeforces Specialist   &#183;   LeetCode Knight</text>
  <rect x="90" y="486" width="128" height="4" rx="2" fill="#56d8ff"/>
</svg>
`
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(join(PUBLIC, 'og.png'))
console.log(`og.png  ${kb(statSync(join(PUBLIC, 'og.png')).size)}`)

/* ---------------------------------------------------------------- */

const totalOut = readdirSync(OUT, { recursive: true })
  .map((f) => join(OUT, String(f)))
  .filter((f) => statSync(f).isFile())
  .reduce((sum, f) => sum + statSync(f).size, 0)

console.log(`\n${'-'.repeat(62)}`)
console.log(`converted   ${kb(inputBytes)}  ->  ${kb(outputBytes)}`)
console.log(`public/images total: ${kb(totalOut)}`)
console.log(`${'-'.repeat(62)}\n`)
