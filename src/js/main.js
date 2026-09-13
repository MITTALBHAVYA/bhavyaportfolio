import '../css/main.css'
import { initNav } from './nav.js'
import { initReveal } from './reveal.js'
import { initConsole } from './console-text.js'
import { initContactForm } from './form.js'
import { initProjectFilter } from './project-filter.js'
import { initCosmos } from './cosmos.js'

/** Contain failures so one broken feature cannot take the page down. */
const safely = (name, fn) => {
  try {
    return fn()
  } catch (error) {
    console.error(`[portfolio] ${name} failed to initialise:`, error)
    return null
  }
}

safely('reveal', initReveal)
safely('console', initConsole)
safely('form', initContactForm)
safely('project-filter', initProjectFilter)

// Declared up front: nav and cosmos call into each other, and both callbacks
// only fire after initialisation has finished.
let nav = null
let cosmos = null

nav = safely('nav', () => initNav({ onSectionChange: (id) => cosmos?.setActive(id) }))

// Deferred: seeding the starfield and painting a full-viewport canvas on the
// critical path costs ~700ms of blocking time.
const startCosmos = () => {
  cosmos = safely('cosmos', () => initCosmos({ onNavigate: (id) => nav?.goTo(id) }))
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(startCosmos, { timeout: 1200 })
} else {
  setTimeout(startCosmos, 200)
}
