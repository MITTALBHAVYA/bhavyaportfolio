import { html, each } from './html.js'
import { asset } from '../config.js'
import { profile } from '../content/profile.js'
import { skills, marqueeIcons } from '../content/skills.js'

export function renderAbout() {
  return html`
    <section class="section" id="about" aria-labelledby="about-title">
      <div class="container">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">About</p>
          <h2 class="section__title" id="about-title">Who's behind this</h2>
        </div>

        <div class="about__grid">
          <div class="about__bio" data-reveal>
            ${each(profile.bio, (para) => html`<p>${para}</p>`)}
          </div>

          <figure class="about__portrait" data-reveal>
            <img
              src="${asset('images/bhavya.webp')}"
              alt="Portrait of ${profile.fullName}"
              width="640"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>

        <h3 class="visually-hidden" id="skills-title">Skills</h3>
        <div class="skills" aria-labelledby="skills-title" data-reveal-stagger>
          ${each(
            skills,
            (group) => html`
              <div class="skill-group">
                <h4 class="skill-group__name">${group.category}</h4>
                <ul class="skill-group__items">
                  ${each(group.items, (item) => html`<li class="tech-chip">${item}</li>`)}
                </ul>
              </div>
            `
          )}
        </div>

        <!-- Icons duplicated once so the marquee loops seamlessly; the second
             copy is hidden from assistive tech. Derived from the skills data,
             so it can no longer advertise tools that are not in the list. -->
        <div class="marquee" aria-hidden="true">
          <div class="marquee__track">
            ${each(
              [...marqueeIcons, ...marqueeIcons],
              (s, i) => html`
                <div
                  class="marquee__item${i >= marqueeIcons.length ? ' marquee__item--loop' : ''}"
                >
                  <img
                    src="${asset(`images/icons/${s.icon}`)}"
                    alt=""
                    width="32"
                    height="32"
                    loading="lazy"
                  />
                </div>
              `
            )}
          </div>
        </div>
      </div>
    </section>
  `
}
