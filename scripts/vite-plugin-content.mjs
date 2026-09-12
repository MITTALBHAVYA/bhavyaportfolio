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
  let isDev = false

  return {
    name: 'portfolio-content',

    configResolved(config) {
      isDev = config.command === 'serve'
    },

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

      // Built as a runtime string and marked @vite-ignore so the bundler does
      // not try to resolve it — this import runs in Node, not in the browser.
      // The cache-buster only applies in dev, where templates change often.
      const url = isDev ? `${TEMPLATES}?v=${Date.now()}` : TEMPLATES
      const { renderBody, renderStructuredData } = await import(/* @vite-ignore */ url)

      const posts = loadPosts().slice(0, 3)

      return htmlSource
        .replace('<!--@body-->', () => renderBody(posts))
        .replace('<!--@jsonld-->', () => renderStructuredData())
    },
  }
}
