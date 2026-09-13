import { defineConfig } from 'vite'
import { readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { BASE } from './src/config.js'
import { contentPlugin } from './scripts/vite-plugin-content.mjs'

const root = import.meta.dirname

// Blog pages are emitted by scripts/build-blog.mjs into blog/<slug>/index.html
// before vite runs, so they need to be picked up as additional MPA entries.
function blogEntries() {
  const dir = resolve(root, 'blog')
  if (!existsSync(dir)) return {}
  return Object.fromEntries(
    readdirSync(dir, { recursive: true })
      .map(String)
      .filter((p) => p.endsWith('index.html'))
      .map((p) => [`blog/${p.replace(/[\\/]index\.html$/, '')}`.replace(/\/$/, 'blog'), resolve(dir, p)])
  )
}

export default defineConfig({
  base: BASE,
  appType: 'mpa',
  plugins: [contentPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...(existsSync(resolve(root, '404.html')) ? { 404: resolve(root, '404.html') } : {}),
        ...blogEntries(),
      },
    },
  },
  server: { open: BASE, port: 5173 },
  preview: { port: 4173 },
})
