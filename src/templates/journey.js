import { html, each } from './html.js'
import { asset } from '../config.js'
import { journey } from '../content/journey.js'

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
            (item) => html`
              <li class="timeline__item" data-ongoing="${item.end === null}">
                <span class="timeline__marker" aria-hidden="true"></span>

                <p class="timeline__period">
                  ${item.period}
                  ${item.type === 'award' ? html`<span class="timeline__badge">Award</span>` : ''}
                </p>

                <div class="timeline__heading">
                  <img
                    class="timeline__logo"
                    src="${asset(`images/${item.image.replace(/\.(png|jpe?g)$/i, '.webp')}`)}"
                    alt=""
                    width="28"
                    height="28"
                    loading="lazy"
                  />
                  <h3 class="timeline__title">
                    ${item.title} <span class="timeline__org">· ${item.org}</span>
                  </h3>
                </div>

                <p class="timeline__desc">${item.description}</p>
              </li>
            `
          )}
        </ol>
      </div>
    </section>
  `
}
