import { html, each, icons } from './html.js'
import { asset } from '../config.js'
import { featuredProjects, otherProjects, projects, filterableTech, techId } from '../content/projects.js'

/** Project screenshots are served from public/images and pre-optimised. */
const shot = (image) => asset(`images/${image.replace(/\.(png|jpe?g)$/i, '.webp')}`)

/** Space-separated tech ids, so the filter can match without parsing text. */
const techAttr = (project) => project.techStacks.map(techId).join(' ')

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

/** Problem → Approach → Outcome, which is what turns a skim into an interview. */
const caseStudy = (project) =>
  project.caseStudy
    ? html`
        <dl class="case-study">
          ${each(
            [
              ['Problem', project.caseStudy.problem],
              ['Approach', project.caseStudy.approach],
              ['Outcome', project.caseStudy.outcome],
            ],
            ([label, body]) => html`
              <div class="case-study__row">
                <dt class="case-study__label">${label}</dt>
                <dd class="case-study__body">${body}</dd>
              </div>
            `
          )}
        </dl>
      `
    : html`<p class="project-feature__desc">${project.description}</p>`

/** Screenshots read as deliberate product shots inside a browser chrome. */
const browserFrame = (project) => html`
  <div class="browser-frame">
    <div class="browser-frame__bar" aria-hidden="true">
      <span></span><span></span><span></span>
      <p class="browser-frame__url">${project.links.live ?? project.name.toLowerCase()}</p>
    </div>
    <img
      src="${shot(project.image)}"
      alt="Screenshot of ${project.name}"
      width="1200"
      height="750"
      loading="lazy"
      decoding="async"
    />
  </div>
`

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
                <div class="project-feature__media">${browserFrame(p)}</div>
                <div class="project-feature__body">
                  <h3 class="project-feature__name">${p.name}</h3>
                  ${p.metric ? html`<p class="project-feature__metric">${p.metric}</p>` : ''}
                  <p class="project-feature__title">${p.title}</p>
                  ${caseStudy(p)}
                  ${techList(p)}
                  <div class="project-links">${projectLinks(p)}</div>
                </div>
              </article>
            `
          )}
        </div>

        <div class="work__more-header" data-reveal>
          <h3 class="section__eyebrow" id="more-work">More projects</h3>

          <!-- Enhanced by js/project-filter.js. Without JS every project simply
               stays visible, so nothing is lost. -->
          <div class="tech-filter" data-tech-filter hidden>
            <span class="visually-hidden" id="filter-label">Filter projects by technology</span>
            <div class="tech-filter__options" role="group" aria-labelledby="filter-label">
              <button class="tech-filter__btn" type="button" data-filter="all" aria-pressed="true">
                All <span class="tech-filter__count">${projects.length}</span>
              </button>
              ${each(
                filterableTech,
                (t) => html`
                  <button
                    class="tech-filter__btn"
                    type="button"
                    data-filter="${t.id}"
                    aria-pressed="false"
                  >
                    ${t.name} <span class="tech-filter__count">${t.count}</span>
                  </button>
                `
              )}
            </div>
            <p class="tech-filter__status" data-filter-status role="status" aria-live="polite"></p>
          </div>
        </div>

        <ul class="grid" aria-labelledby="more-work" data-reveal-stagger data-project-grid>
          ${each(
            otherProjects,
            (p) => html`
              <li class="project-card" data-tech="${techAttr(p)}">
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

        <p class="tech-filter__empty" data-filter-empty hidden>
          No projects in the grid use that — check the featured work above.
        </p>
      </div>
    </section>
  `
}
