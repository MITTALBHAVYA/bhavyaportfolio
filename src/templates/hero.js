import { html, each, icons } from './html.js'
import { externalAttrs, resumeHref } from './nav.js'
import { profile } from '../content/profile.js'

export function renderHero() {
  const { availability, proof, typing } = profile

  return html`
    <section class="section hero" id="hero" aria-labelledby="hero-name">
      <div class="container hero__inner">
        <p class="hero__greeting" data-reveal>${profile.greeting}</p>

        <h1 class="hero__name" id="hero-name" data-reveal>${profile.displayName}</h1>

        <p class="hero__role" data-reveal>${profile.role}</p>
        <p class="hero__tagline" data-reveal>${profile.tagline}</p>

        <!-- First phrase ships in the HTML so the line is never empty. -->
        <p class="hero__console" data-reveal>
          <span class="hero__console-label">Hit me up if you need help with</span>
          <span
            class="hero__console-text"
            data-console
            data-phrases="${JSON.stringify(typing)}"
            >${typing[0]}</span
          ><span class="hero__console-cursor" aria-hidden="true">|</span>
        </p>

        <ul class="hero__proof" data-reveal-stagger>
          ${each(
            proof,
            (p) => html`
              <li class="proof-chip">
                <span class="proof-chip__label">${p.label}</span>
                <span class="proof-chip__value">${p.value}</span>
              </li>
            `
          )}
        </ul>

        ${availability.open
          ? html`
              <p class="hero__availability" data-reveal>
                <span class="status-dot" aria-hidden="true"></span>
                ${availability.note}
              </p>
            `
          : ''}

        <div class="hero__actions" data-reveal>
          <a class="btn btn--primary" href="#work">
            View work ${icons.arrowRight}
          </a>
          <a
            class="btn btn--secondary"
            href="${resumeHref(profile.resume)}"
            ${externalAttrs(profile.resume.external)}
          >
            ${icons.document} ${profile.resume.label}
          </a>
        </div>

        <a class="hero__scroll-cue" href="#work">
          Scroll to explore ${icons.arrowDown}
        </a>
      </div>
    </section>
  `
}
