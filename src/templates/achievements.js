import { html, each, icons } from './html.js'
import { achievements } from '../content/achievements.js'

export function renderAchievements() {
  return html`
    <section class="section" id="achievements" aria-labelledby="achievements-title">
      <div class="container">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">Achievements</p>
          <h2 class="section__title" id="achievements-title">Competitive programming</h2>
          <p class="section__lead">
            Years of contest practice — the habit behind everything else on this page.
          </p>
        </div>

        <ul class="achievements" data-reveal-stagger>
          ${each(
            achievements,
            (a) => html`
              <li class="achievement">
                <p class="achievement__metric">${a.metric}</p>
                <h3 class="achievement__title">${a.title}</h3>
                <p class="achievement__desc">${a.description}</p>
                ${a.link
                  ? html`
                      <a
                        class="achievement__link"
                        href="${a.link.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ${a.link.label} ${icons.external}
                      </a>
                    `
                  : ''}
              </li>
            `
          )}
        </ul>
      </div>
    </section>
  `
}
