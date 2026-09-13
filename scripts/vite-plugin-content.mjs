import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadPosts } from './posts.mjs'

const TEMPLATES = pathToFileURL(
  join(import.meta.dirname, '..', 'src', 'templates', 'index.js')
).href

/**
 * Renders every section into index.html at BUILD time from src/content/*.
 *
 * This is the fix for the old site's worst failure: all content lived in
 * `.content-not-ready { display:none }` and was only revealed by a JS handler,
 * so crawlers and anyone without JS saw an empty page. Now the HTML ships
 * complete and JS only adds behaviour.
 *
 * Placeholders in index.html:
 *   <!--@body-->      the whole document body
 *   <!--@jsonld-->    structured data
 */
export function contentPlugin() {
  return {
    name: 'portfolio-content',

    // Re-render when content, templates or config change during dev.
    configureServer(server) {
      const watched = /[\\/]src[\\/](content|templates)[\\/]|[\\/]src[\\/]config\.js$/
      server.watcher.on('change', (file) => {
        if (watched.test(file)) server.ws.send({ type: 'full-reload' })
      })
    },

    async transformIndexHtml(htmlSource, ctx) {
      // Blog pages are generated already-complete; only the homepage needs this.
      if (!/index\.html$/.test(ctx.path) || ctx.path.includes('/blog/')) return htmlSource

      // In dev, load through Vite's own module graph. A plain import() with a
      // cache-busting query only invalidates the entry module — its static
      // imports still resolve to cached URLs, so edits to src/content/ never
      // showed up. ssrLoadModule tracks and invalidates the whole graph.
      // At build time there is no server and nothing to invalidate.
      const mod = ctx.server
        ? await ctx.server.ssrLoadModule('/src/templates/index.js')
        : await import(/* @vite-ignore */ TEMPLATES)

      const posts = loadPosts().slice(0, 3)

      return htmlSource
        .replace('<!--@body-->', () => mod.renderBody(posts))
        .replace('<!--@jsonld-->', () => mod.renderStructuredData())
    },
  }
}
