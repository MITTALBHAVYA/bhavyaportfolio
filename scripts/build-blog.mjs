import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'
import { loadPosts } from './posts.mjs'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'blog')

const { BASE, SITE, SITE_URL, absolute, asset } = await import('../src/config.js')
const { profile } = await import('../src/content/profile.js')

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c])

const highlighter = await createHighlighter({
  themes: ['github-dark-default'],
  langs: ['javascript', 'typescript', 'python', 'bash', 'json', 'cpp', 'sql', 'html', 'css'],
})

const md = new MarkdownIt({
  html: false, // posts are trusted, but there is no reason to allow raw HTML
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text'
    try {
      return highlighter.codeToHtml(code, { lang: language, theme: 'github-dark-default' })
    } catch {
      return `<pre class="shiki"><code>${esc(code)}</code></pre>`
    }
  },
})

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

function shell({ title, description, canonical, body, jsonld = '' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="theme-color" content="${SITE.themeColor}" />
    <meta name="color-scheme" content="dark" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(absolute('og.png'))}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml" />
    <link rel="preload" href="/fonts/inter-f11d729b.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/space-grotesk-c0781ea2.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/src/css/main.css" />
    <link rel="stylesheet" href="/src/css/post.css" />
    ${jsonld}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header" data-scrolled="true">
      <div class="container site-header__inner">
        <a class="site-logo" href="${asset('')}">Bhavya Mittal<span class="site-logo__dot">.</span></a>
        <div class="site-header__actions">
          <a class="btn btn--ghost btn--sm" href="${asset('blog/')}">All posts</a>
          <a class="btn btn--secondary btn--sm" href="${asset('')}#contact">Contact</a>
        </div>
      </div>
    </header>
    <main id="main">
${body}
    </main>
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <p>${esc(profile.footer.copyright)}</p>
        <p class="site-footer__made">
          Made with <span class="site-footer__heart" aria-hidden="true">&hearts;</span>
          <span class="visually-hidden">love</span> by ${esc(profile.fullName)}
        </p>
      </div>
    </footer>
  </body>
</html>
`
}

function postPage(post) {
  const canonical = absolute(`blog/${post.slug}/`)
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    url: canonical,
    keywords: post.tags.join(', '),
    author: { '@type': 'Person', name: profile.fullName, url: SITE_URL },
  }).replace(/</g, '\\u003c')}</script>`

  const body = `      <article class="section post">
        <div class="container container--narrow">
          <nav class="post__back" aria-label="Breadcrumb">
            <a href="${asset('blog/')}">&larr; All posts</a>
          </nav>
          <header class="post__header">
            <p class="post__meta">
              <time datetime="${post.date}">${formatDate(post.date)}</time>
              <span>${post.readingTime} min read</span>
            </p>
            <h1 class="post__title">${esc(post.title)}</h1>
            ${post.summary ? `<p class="post__summary">${esc(post.summary)}</p>` : ''}
            ${
              post.tags.length
                ? `<ul class="post-card__tags">${post.tags
                    .map((t) => `<li class="tag">${esc(t)}</li>`)
                    .join('')}</ul>`
                : ''
            }
          </header>
          <div class="post__body">
${md.render(post.body)}
          </div>
        </div>
      </article>`

  return shell({
    title: `${post.title} — ${profile.fullName}`,
    description: post.summary || `${post.title} by ${profile.fullName}`,
    canonical,
    body,
    jsonld,
  })
}

function indexPage(posts) {
  const body = `      <section class="section">
        <div class="container container--narrow">
          <div class="section__header">
            <p class="section__eyebrow">Writing</p>
            <h1 class="section__title">Notes on what I build</h1>
            <p class="section__lead">Backends, GenAI systems, compilers and competitive programming.</p>
          </div>
          ${
            posts.length === 0
              ? `<p class="posts__empty">No posts published yet — first ones are in progress.</p>`
              : `<ul class="posts">${posts
                  .map(
                    (p) => `
            <li class="post-card">
              <p class="post-card__meta">
                <time datetime="${p.date}">${formatDate(p.date)}</time>
                <span>${p.readingTime} min read</span>
              </p>
              <h2 class="post-card__title"><a href="${asset(`blog/${p.slug}/`)}">${esc(p.title)}</a></h2>
              <p class="post-card__summary">${esc(p.summary)}</p>
              ${
                p.tags.length
                  ? `<ul class="post-card__tags">${p.tags
                      .map((t) => `<li class="tag">${esc(t)}</li>`)
                      .join('')}</ul>`
                  : ''
              }
            </li>`
                  )
                  .join('')}</ul>`
          }
        </div>
      </section>`

  return shell({
    title: `Writing — ${profile.fullName}`,
    description: 'Posts on backend engineering, GenAI systems and competitive programming.',
    canonical: absolute('blog/'),
    body,
  })
}

function writeSitemap(posts) {
  const urls = [
    { loc: SITE_URL, priority: '1.0' },
    { loc: absolute('blog/'), priority: '0.7' },
    ...posts.map((p) => ({ loc: absolute(`blog/${p.slug}/`), priority: '0.6', lastmod: p.date })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`
  writeFileSync(join(ROOT, 'public', 'sitemap.xml'), xml)
}

function writeFeed(posts) {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${absolute(`blog/${p.slug}/`)}</link>
      <guid>${absolute(`blog/${p.slug}/`)}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`
    )
    .join('\n')

  writeFileSync(
    join(ROOT, 'public', 'feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>${esc(profile.fullName)} — Writing</title>
    <link>${absolute('blog/')}</link>
    <description>Posts on backend engineering, GenAI systems and competitive programming.</description>
    <language>en</language>
${items}
  </channel></rss>
`
  )
}

function notFoundPage() {
  return shell({
    title: `Lost in space — ${profile.fullName}`,
    description: 'That page does not exist.',
    canonical: absolute('404.html'),
    body: `      <section class="section">
        <div class="container container--narrow" style="text-align:center">
          <p class="section__eyebrow" style="justify-content:center">404</p>
          <h1 class="section__title">Lost in space</h1>
          <p class="section__lead" style="margin-inline:auto">
            That page drifted out of orbit. Let's get you back.
          </p>
          <p style="margin-top:var(--space-6)">
            <a class="btn btn--primary" href="${asset('')}">Back to home</a>
          </p>
        </div>
      </section>`,
  })
}

// ---------------------------------------------------------------------------

const posts = loadPosts()

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
mkdirSync(join(ROOT, 'public'), { recursive: true })

writeFileSync(join(OUT, 'index.html'), indexPage(posts))
for (const post of posts) {
  mkdirSync(join(OUT, post.slug), { recursive: true })
  writeFileSync(join(OUT, post.slug, 'index.html'), postPage(post))
}

// Emitted at the project root (not public/) so Vite processes its stylesheet
// links; it is registered as a build input in vite.config.js.
writeFileSync(join(ROOT, '404.html'), notFoundPage())

writeSitemap(posts)
writeFeed(posts)

console.log(
  `build-blog: ${posts.length} post(s) -> blog/, plus 404.html, sitemap.xml and feed.xml`
)
