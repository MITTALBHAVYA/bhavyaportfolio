# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Overview

Personal portfolio for Bhavya Mittal. Static site built with **Vite**, no framework. Space/cosmos theme. Deployed to GitHub Pages at https://mittalbhavya.github.io/bhavyaportfolio/ via `.github/workflows/deploy.yml` on push to `main`.

## Commands

```bash
npm install
npm run dev       # dev server at http://localhost:5173/bhavyaportfolio/
npm run build     # build-blog.mjs, then vite build -> dist/
npm run preview   # serve dist/ at http://localhost:4173/bhavyaportfolio/
npm run images    # regenerate public/images/ from images/ (only after changing source images)
```

## Architecture

**Content is rendered into the HTML at build time.** `scripts/vite-plugin-content.mjs` hooks `transformIndexHtml`, imports `src/templates/index.js`, and substitutes two placeholders in `index.html`: `<!--@body-->` and `<!--@jsonld-->`. The shipped HTML is therefore complete — client JS only adds behaviour, never content. Do not move content rendering to the client.

### Content — `src/content/`

The single source of truth. Editing these files is how you change what the site says.

| File | Holds |
| --- | --- |
| `profile.js` | name, bio, tagline, availability, resume link, typing phrases, proof chips, social links, quote, footer |
| `projects.js` | the 8 projects; `featured: true` promotes one into the large alternating layout |
| `journey.js` | the timeline — **canonical for anything with a date** |
| `achievements.js` | standing CP credentials with live profile links |
| `skills.js` | skill categories; `marqueeIcons` is *derived* from them |
| `sections.js` | the section list, nav labels, and each section's planet in the solar system |

Two rules that matter:

- **Dated events live in `journey.js` only.** The old site listed KickStart, HackerCup and AISummit in both the timeline and the achievements, so each appeared twice on one page. `achievements.js` is for standing credentials (ratings, profiles), not dated events.
- **The marquee is derived from `skills.js`,** via `skillIcons`. Never hand-list marquee icons — the old site's marquee advertised Redux and Firebase, which were not in the skills list.

### Templates — `src/templates/`

Pure functions returning HTML. `html.js` provides an escaping tagged template:

- `` html`...` `` escapes every `${}` interpolation and returns a `SafeString`
- `raw(str)` marks pre-escaped HTML
- `each(items, fn)` maps and concatenates
- `icons` are inline SVGs (replacing Font Awesome, which cost ~350 KB for 4 glyphs)

**Nested `html` templates compose correctly because `html` returns a `SafeString`, not a string.** If you make it return a plain string, every nested template gets double-escaped.

### Client JS — `src/js/`

ES modules, loaded with `type="module"`. `main.js` initialises each feature inside a `safely()` wrapper so one failure cannot take the page down.

| Module | Responsibility |
| --- | --- |
| `cosmos.js` | the canvas: starfield, solar system, scroll camera, planet hit-testing |
| `nav.js` | mobile menu, active-section tracking (IntersectionObserver), `goTo()` |
| `reveal.js` | scroll reveal — adds `js-reveal` only once it can also un-hide |
| `console-text.js` | hero typing effect, paused when off-screen or tab hidden |
| `form.js` | contact form validation and Web3Forms submission |

`nav.js` owns scroll/active state; `cosmos.js` only receives `setActive(id)`. Don't add a second scroll listener — the old site had two non-passive ones doing forced layout every 100 ms.

### CSS — `src/css/`

`main.css` declares the layer order (`tokens, base, layout, components, utilities`) and imports everything. Every rule sits in a layer, so source order and specificity cannot cause cascade races.

- **All design values come from `tokens.css`.** No raw hex, no magic numbers elsewhere.
- `base.css` owns the global `:focus-visible` ring and the `prefers-reduced-motion` policy.
- One component per file under `components/`.

### Blog — `src/content/blog/*.md`

`scripts/build-blog.mjs` runs before `vite build`: parses frontmatter with gray-matter, renders markdown with markdown-it + Shiki highlighting, and writes `blog/<slug>/index.html`, `blog/index.html`, `404.html`, `public/sitemap.xml` and `public/feed.xml`. `vite.config.js` globs those pages in as extra MPA entries.

Frontmatter: `title` and `date` are required; `summary`, `tags`, `slug`, `draft` are optional. `draft: true` excludes a post from the build.

### Generated output — never edit, never commit

`blog/`, `404.html`, `public/images/`, `public/og.png`, `public/favicon.svg`, `public/apple-touch-icon.png`, `public/sitemap.xml`, `public/feed.xml`, `dist/`. All gitignored. Source images stay in `images/`.

## Deployment config

`src/config.js` holds everything deployment-specific — `BASE`, `SITE_URL`, SEO defaults, and `WEB3FORMS_KEY`. Moving to a custom domain means changing `BASE` to `'/'` and `SITE_URL` to the new origin; nothing else hard-codes either.

`WEB3FORMS_KEY` is `null` until a key is added, and the contact form renders disabled with a note rather than failing silently.

## Constraints worth keeping

- Total page weight stays under ~500 KB. It is currently ~677 KB of `dist/` including all images; the initial page load is far smaller.
- Every image needs `width`, `height` and `alt`. Decorative images take `alt=""`.
- Every icon-only link needs an `aria-label`.
- Nothing animates without a `prefers-reduced-motion` answer.
- `legacy/` is the pre-rewrite site, kept as a migration reference. Delete it once nothing else is needed from it.
