import { html, each } from './html.js'
import { asset } from '../config.js'
import { profile } from '../content/profile.js'
import { navSections } from '../content/sections.js'

export function renderFooter() {
  return html`
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <p>${profile.footer.copyright}</p>

        <nav aria-label="Footer">
          <ul class="site-footer__nav">
            ${each(navSections, (s) => html`<li><a href="#${s.id}">${s.navLabel}</a></li>`)}
            <li><a href="${asset('blog/')}">Blog</a></li>
          </ul>
        </nav>

        <p class="site-footer__made">
          Made with <span class="site-footer__heart" aria-hidden="true">&hearts;</span>
          <span class="visually-hidden">love</span> by ${profile.fullName}
        </p>
      </div>
    </footer>
  `
}
