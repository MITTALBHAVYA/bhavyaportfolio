import { html, raw } from './html.js'
import { renderHeader } from './nav.js'
import { renderHero } from './hero.js'
import { renderWork } from './work.js'
import { renderAbout } from './about.js'
import { renderJourney } from './journey.js'
import { renderAchievements } from './achievements.js'
import { renderWriting } from './writing.js'
import { renderQuote, renderContact } from './contact.js'
import { renderDivider } from './divider.js'
import { renderFooter } from './footer.js'
import { profile } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { journey } from '../content/journey.js'
import { SITE, SITE_URL, absolute, asset } from '../config.js'

/** The cosmos canvas plus the vignette that keeps text legible over it. */
export const renderCosmos = () => html`
  <div class="cosmos" aria-hidden="true">
    <canvas class="cosmos__canvas" data-cosmos></canvas>
    <div class="cosmos__label" data-cosmos-label data-visible="false"></div>
  </div>
  <div class="cosmos__vignette" aria-hidden="true"></div>
`

export function renderBody(posts = []) {
  return html`
    <a class="skip-link" href="#main">Skip to content</a>
    ${renderCosmos()}
    ${renderHeader()}
    <main id="main">
      ${renderHero()}
      ${renderWork()}
      ${renderDivider(0)}
      ${renderAbout()}
      ${renderDivider(1)}
      ${renderJourney()}
      ${renderDivider(2)}
      ${renderAchievements()}
      ${renderDivider(3)}
      ${renderWriting(posts)}
      ${renderQuote()}
      ${renderContact()}
    </main>
    ${renderFooter()}
  `
}

/** JSON-LD so search engines and AI crawlers get structured facts, not guesses. */
export function renderStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}#person`,
        name: profile.fullName,
        url: SITE_URL,
        image: absolute('images/bhavya.webp'),
        jobTitle: profile.role,
        email: `mailto:${profile.links.email}`,
        description: profile.bio[0],
        sameAs: [profile.links.github, profile.links.linkedin, profile.links.twitter],
        knowsAbout: [
          'Backend development',
          'Generative AI',
          'MERN stack',
          'Competitive programming',
          'Data structures and algorithms',
        ],
        worksFor: journey
          .filter((j) => j.type === 'role')
          .map((j) => ({ '@type': 'Organization', name: j.org })),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE.shortTitle,
        description: SITE.description,
        publisher: { '@id': `${SITE_URL}#person` },
        inLanguage: 'en',
      },
      ...projects.map((p) => ({
        '@type': 'CreativeWork',
        name: p.name,
        description: p.description,
        url: p.links.live || p.links.github,
        author: { '@id': `${SITE_URL}#person` },
        keywords: p.techStacks.join(', '),
      })),
    ],
  }

  // Must NOT be HTML-escaped (that would corrupt the JSON), but any `<` is
  // escaped so a `</script>` inside a string cannot close the tag early.
  return html`<script type="application/ld+json">
    ${raw(JSON.stringify(data).replace(/</g, '\\u003c'))}
  </script>`
}

export const headMeta = {
  title: SITE.title,
  description: SITE.description,
  canonical: SITE_URL,
  ogImage: absolute('og.png'),
  themeColor: SITE.themeColor,
  favicon: asset('favicon.svg'),
}
