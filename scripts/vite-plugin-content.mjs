import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadPosts } from './posts.mjs'

const TEMPLATES = pathToFileURL(
  join(import.meta.dirname, '..', 'src', 'templates', 'index.js')
).href

/**
 * Renders every section into index.html at build time from src/content/*, so
 * the shipped HTML is complete and JS only adds behaviour.
 *
 * Placeholders in index.html: `<!--@body-->` and `<!--@jsonld-->`.
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

      // Dev must go through Vite's module graph: a plain import() only
      // invalidates the entry module, so edits under src/content/ never appear.
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
