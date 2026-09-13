import { html, each, icons, raw } from './html.js'
import { asset } from '../config.js'

/** Attributes that make an outbound link safe; empty for internal links. */
export const externalAttrs = (isExternal) =>
  isExternal ? raw('target="_blank" rel="noopener noreferrer"') : ''

/** A locally hosted resume needs the deployment base; an off-site one does not. */
export const resumeHref = (resume) => (resume.external ? resume.url : asset(resume.url))
import { navSections } from '../content/sections.js'
import { profile } from '../content/profile.js'

export function renderHeader() {
  return html`
    <header class="site-header" data-scrolled="false">
      <div class="container site-header__inner">
        <a class="site-logo" href="#hero">
          Bhavya Mittal<span class="site-logo__dot">.</span>
        </a>

        <nav class="site-nav" id="site-nav" aria-label="Sections">
          <ul class="site-nav__list">
            ${each(
              navSections,
              (s) => html`
                <li>
                  <a class="site-nav__link" href="#${s.id}" data-nav-link="${s.id}">${s.navLabel}</a>
                </li>
              `
            )}
          </ul>
        </nav>

        <div class="site-header__actions">
          <a
            class="btn btn--secondary btn--sm"
            href="${resumeHref(profile.resume)}"
            ${externalAttrs(profile.resume.external)}
          >
            ${profile.resume.label}
            ${profile.resume.external ? icons.external : ''}
          </a>
          <button
            class="nav-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="site-nav"
            aria-label="Open menu"
          >
            <span class="nav-toggle__bars"></span>
          </button>
        </div>
      </div>
    </header>
  `
}
