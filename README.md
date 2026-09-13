# Bhavya Mittal — Portfolio

Personal portfolio and blog. Static site built with Vite, no framework, space theme.

**Live:** https://bhavyaportfolio-three.vercel.app/

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173/

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Builds blog pages, then the site, into `dist/` |
| `npm run preview` | Serves the built site locally |
| `npm run images` | Regenerates optimised images from `images/` |

`npm run images` only needs re-running when you add or change a source image.

## Updating content

Everything the site says lives in `src/content/`. No HTML editing required.

| To change | Edit |
| --- | --- |
| Name, bio, tagline, links, availability, resume | `profile.js` |
| Projects | `projects.js` |
| Work history and timeline | `journey.js` |
| Competitive programming credentials | `achievements.js` |
| Skills | `skills.js` |

**Adding a project:** add an entry to `projects.js`, drop the screenshot into `images/projects/`, and run `npm run images`. Set `featured: true` for the large layout.

**Anything with a date** goes in `journey.js`, not `achievements.js` — that keeps events from appearing twice on the page.

## Writing a blog post

Create a markdown file in `src/content/blog/`:

```markdown
---
title: How I got NEXUS to 96% accuracy
date: 2026-09-13
summary: One sentence for the card and the meta description.
tags: [genai, fastapi]
draft: false
---

## The problem

Your post here. Code blocks get syntax highlighting.
```

`title` and `date` are required. `draft: true` keeps it out of the build. On `npm run build` it becomes a real page at `/blog/<slug>/`, with its own meta tags, and is added to the sitemap and RSS feed.

## Setup still needed

1. **Contact form** — get a free key at [web3forms.com](https://web3forms.com) (no account; it's emailed to you) and set `WEB3FORMS_KEY` in `src/config.js`. Until then the form renders disabled with a note.
2. **Booking link** — set `profile.booking` to a Cal.com URL to show the "book a call" button.
3. **Resume** — served from `public/resume.pdf`. To update it, replace that file.

## Deployment

Vercel builds and deploys on every push to `main`.

The build command lives in `vercel.json` and is `npm run images && npm run build`. The image step matters: `public/images/` is generated from `images/`, not committed, so without it the deploy would ship with no pictures.

To move to a custom domain: add it in the Vercel dashboard, then set `SITE_URL` in `src/config.js` to the new origin. `BASE` stays `'/'`.

## Project layout

```
index.html              shell with <!--@body--> / <!--@jsonld--> placeholders
src/
  config.js             base path, site URL, SEO defaults, Web3Forms key
  content/              ← all site content
  templates/            build-time HTML rendering
  css/                  tokens, base, layout, components
  js/                   cosmos canvas, nav, reveal, console, form
scripts/
  build-blog.mjs        markdown → static pages, sitemap, RSS, 404
  optimize-images.mjs   images/ → public/images/
  vite-plugin-content.mjs
images/                 source images (optimised output is generated)
legacy/                 pre-rewrite site, kept for reference
```

Content is rendered into the HTML at build time, so the page works fully without JavaScript — JS only adds the animated cosmos, the mobile menu, scroll reveals and form handling.
