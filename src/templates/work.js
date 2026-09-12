import { html, each, icons } from './html.js'
import { asset } from '../config.js'
import { featuredProjects, otherProjects } from '../content/projects.js'

/** Project screenshots are served from public/images and pre-optimised. */
const shot = (image) => asset(`images/${image.replace(/\.(png|jpe?g)$/i, '.webp')}`)

function projectLinks(project, { iconOnly = false } = {}) {
  const entries = [
    project.links.live && { key: 'live', url: project.links.live, label: 'Live demo', icon: icons.external },
    project.links.github && { key: 'github', url: project.links.github, label: 'Source code', icon: icons.github },
  ].filter(Boolean)

  if (iconOnly) {
    return each(
      entries,
      (l) => html`
        <a
          class="icon-link"
          href="${l.url}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${l.label} — ${project.name}"
        >
          ${l.icon}
        </a>
      `
    )
  }

  return each(
    entries,
    (l) => html`
      <a
        class="btn ${l.key === 'live' ? 'btn--primary' : 'btn--secondary'} btn--sm"
        href="${l.url}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${l.icon} ${l.label}
        <span class="visually-hidden">for ${project.name}</span>
      </a>
    `
  )
}

const techList = (project) =>
  html`<ul class="tech-list">
    ${each(project.techStacks, (t) => html`<li class="tech-chip">${t}</li>`)}
  </ul>`

export function renderWork() {
  return html`
    <section class="section" id="work" aria-labelledby="work-title">
      <div class="container">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">Selected work</p>
          <h2 class="section__title" id="work-title">Things I've built</h2>
          <p class="section__lead">
            Backends, AI products and tools — each one shipped end to end.
          </p>
        </div>

        <div class="work__featured">
          ${each(
            featuredProjects,
            (p) => html`
              <article class="project-feature" data-reveal>
                <div class="project-feature__media">
                  <img
                    src="${shot(p.image)}"
                    alt="Screenshot of ${p.name}"
                    width="1200"
                    height="750"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div class="project-feature__body">
                  <h3 class="project-feature__name">${p.name}</h3>
                  ${p.metric ? html`<p class="project-feature__metric">${p.metric}</p>` : ''}
                  <p class="project-feature__title">${p.title}</p>
                  <p class="project-feature__desc">${p.description}</p>
                  ${techList(p)}
                  <div class="project-links">${projectLinks(p)}</div>
                </div>
              </article>
            `
          )}
        </div>

        <h3 class="section__eyebrow" id="more-work" data-reveal>More projects</h3>
        <ul class="grid" aria-labelledby="more-work" data-reveal-stagger>
          ${each(
            otherProjects,
            (p) => html`
              <li class="project-card">
                <h4 class="project-card__name">${p.name}</h4>
                <p class="project-card__desc">${p.description}</p>
                ${techList(p)}
                <div class="project-card__footer">
                  <div class="project-card__links">${projectLinks(p, { iconOnly: true })}</div>
                </div>
              </li>
            `
          )}
        </ul>
      </div>
    </section>
  `
}
