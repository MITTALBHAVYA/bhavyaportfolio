import { html, each } from './html.js'
import { asset } from '../config.js'
import { journey } from '../content/journey.js'

/* Duration is resolved at build time, so an ongoing role's length is accurate
   as of the last deploy rather than frozen in the content file. */
const monthsBetween = (start, end) => {
  const [sy, sm] = start.split('-').map(Number)
  const now = new Date()
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  return Math.max(1, (ey - sy) * 12 + (em - sm) + 1)
}

const durationLabel = (months) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (!years) return `${months} mo${months === 1 ? '' : 's'}`
  if (!rest) return `${years} yr${years === 1 ? '' : 's'}`
  return `${years} yr${years === 1 ? '' : 's'} ${rest} mo${rest === 1 ? '' : 's'}`
}

/** Initials for an org with no logo file, skipping lowercase joining words. */
const monogram = (org) =>
  org
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !['by', 'and', 'the'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

// Only roles get a bar — awards are single dates with no span to show.
const roles = journey.filter((item) => item.type === 'role')
const longestRole = Math.max(...roles.map((r) => monthsBetween(r.start, r.end)), 1)

export function renderJourney() {
  return html`
    <section class="section" id="journey" aria-labelledby="journey-title">
      <div class="container container--narrow">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">Journey</p>
          <h2 class="section__title" id="journey-title">The path so far</h2>
        </div>

        <ol class="timeline" data-reveal-stagger>
          ${each(
            journey,
            (item) => {
              const months = item.type === 'role' ? monthsBetween(item.start, item.end) : 0
              return html`
              <li class="timeline__item" data-ongoing="${item.end === null}">
                <span class="timeline__marker" aria-hidden="true"></span>

                <p class="timeline__period">
                  ${item.period}
                  ${item.type === 'award' ? html`<span class="timeline__badge">Award</span>` : ''}
                  ${months
                    ? html`<span class="timeline__duration">${durationLabel(months)}</span>`
                    : ''}
                  ${item.employment === 'Internship'
                    ? html`<span class="timeline__employment">Internship</span>`
                    : ''}
                </p>

                ${months
                  ? html`
                      <div
                        class="timeline__bar"
                        style="--bar-scale: ${(months / longestRole).toFixed(3)}"
                        aria-hidden="true"
                      >
                        <span class="timeline__bar-fill"></span>
                      </div>
                    `
                  : ''}

                <div class="timeline__heading">
                  ${item.image
                    ? html`<img
                        class="timeline__logo"
                        src="${asset(`images/${item.image.replace(/\.(png|jpe?g)$/i, '.webp')}`)}"
                        alt=""
                        width="28"
                        height="28"
                        loading="lazy"
                      />`
                    : html`<span class="timeline__logo timeline__logo--monogram" aria-hidden="true"
                        >${monogram(item.org)}</span
                      >`}
                  <h3 class="timeline__title">
                    ${item.title} <span class="timeline__org">· ${item.org}</span>
                  </h3>
                </div>

                <p class="timeline__desc">${item.description}</p>
              </li>
            `
            }
          )}
        </ol>
      </div>
    </section>
  `
}
