import { html, raw } from './html.js'

/*
 * Constellation dividers. Each is a real star pattern, stretched into a wide
 * band and drawn as inline SVG — a few hundred bytes, no request, and it
 * carries the cosmic theme through the long middle of the page instead of
 * leaving it only in the hero and the Journey.
 *
 * Coordinates are in a 1200x80 box. `lines` index into `stars`.
 */
const CONSTELLATIONS = {
  orion: {
    label: 'Orion',
    stars: [
      [120, 18], [196, 54], [268, 14], [352, 40],
      [430, 38], [508, 36], [586, 34],
      [668, 62], [742, 22], [820, 58],
    ],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [6, 8], [7, 9]],
    bright: [0, 4, 5, 9],
  },
  cassiopeia: {
    label: 'Cassiopeia',
    stars: [[180, 56], [330, 20], [480, 52], [640, 16], [790, 50]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    bright: [1, 3],
  },
  lyra: {
    label: 'Lyra',
    stars: [[240, 16], [318, 44], [402, 30], [396, 64], [304, 70], [486, 52]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [2, 5]],
    bright: [0, 2],
  },
  corvus: {
    label: 'Corvus',
    stars: [[300, 24], [412, 12], [468, 58], [352, 68], [560, 40]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4]],
    bright: [1, 2],
  },
}

const NAMES = Object.keys(CONSTELLATIONS)

/**
 * @param {keyof CONSTELLATIONS | number} which  name, or an index to cycle through
 */
export function renderDivider(which = 0) {
  const key = typeof which === 'number' ? NAMES[which % NAMES.length] : which
  const c = CONSTELLATIONS[key]
  if (!c) return ''

  const lines = c.lines
    .map(([a, b]) => {
      const [x1, y1] = c.stars[a]
      const [x2, y2] = c.stars[b]
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`
    })
    .join('')

  const stars = c.stars
    .map(([x, y], i) => {
      const bright = c.bright.includes(i)
      return `<circle cx="${x}" cy="${y}" r="${bright ? 2.6 : 1.5}" class="${
        bright ? 'constellation__star constellation__star--bright' : 'constellation__star'
      }" />`
    })
    .join('')

  return html`
    <div class="constellation" role="presentation" data-reveal>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <g class="constellation__lines">${raw(lines)}</g>
        <g>${raw(stars)}</g>
      </svg>
    </div>
  `
}

export const dividerCount = NAMES.length
