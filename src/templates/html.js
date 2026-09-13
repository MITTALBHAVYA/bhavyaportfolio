const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/** Escape a value for interpolation into HTML text or a quoted attribute. */
export const esc = (value) =>
  value == null ? '' : String(value).replace(/[&<>"']/g, (c) => ESCAPES[c])

/**
 * Pre-escaped HTML. `html` MUST return one of these: if it returns a plain
 * string, every nested template gets escaped again by its parent.
 */
class SafeString {
  constructor(value) {
    this.value = String(value ?? '')
  }
  toString() {
    return this.value
  }
}

/** Mark an already-safe HTML string so `html` does not escape it again. */
export const raw = (value) => new SafeString(value)

/**
 * Tagged template that escapes every interpolation by default.
 * Arrays are joined, `null`/`undefined`/`false` render as nothing, and anything
 * produced by `html`, `raw` or `each` is passed through untouched.
 */
export function html(strings, ...values) {
  let out = strings[0]
  for (let i = 0; i < values.length; i++) {
    out += render(values[i]) + strings[i + 1]
  }
  return new SafeString(out)
}

function render(v) {
  if (v == null || v === false || v === '') return ''
  if (v instanceof SafeString) return v.value
  if (Array.isArray(v)) return v.map(render).join('')
  return esc(v)
}

/** Render `items` with `fn` and concatenate the results as safe HTML. */
export const each = (items, fn) => new SafeString(items.map((item, i) => render(fn(item, i))).join(''))

/*
 * Inline icons, ~2KB with no extra request. Each is decorative — the accessible
 * name belongs on the link that wraps it.
 *
 * Sizing comes from `svg[aria-hidden]` in base.css, not from these attributes:
 * an <svg> with only a viewBox has no intrinsic size and collapses to 0x0
 * inside a flex container.
 */
const svg = (paths, viewBox = '0 0 24 24') =>
  raw(
    `<svg viewBox="${viewBox}" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" ` +
      `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`
  )

const brand = (path, viewBox = '0 0 24 24') =>
  raw(
    `<svg viewBox="${viewBox}" width="1em" height="1em" fill="currentColor" ` +
      `aria-hidden="true" focusable="false">${path}</svg>`
  )

export const icons = {
  github: brand(
    '<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>'
  ),
  linkedin: brand(
    '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/>'
  ),
  twitter: brand(
    '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z"/>'
  ),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
  external: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>'),
  arrowDown: svg('<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'),
  arrowRight: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
  document: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>'),
}
