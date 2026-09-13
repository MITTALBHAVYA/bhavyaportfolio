import '../css/main.css'
import { initNav } from './nav.js'
import { initReveal } from './reveal.js'
import { initConsole } from './console-text.js'
import { initContactForm } from './form.js'
import { initProjectFilter } from './project-filter.js'
import { initCosmos } from './cosmos.js'

/*
 * Each feature is initialised independently and failure is contained, so one
 * broken module cannot take the page down with it. In the old codebase every
 * script shared one global scope in a load-bearing order: a single error in
 * portfolio_func.js meant its window.load handler never registered and the
 * loading screen never lifted, leaving a permanently blank site.
 */
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

// Declared before either is built: nav and cosmos each call into the other, and
// both callbacks only fire after initialisation has finished.
let nav = null
let cosmos = null

nav = safely('nav', () => initNav({ onSectionChange: (id) => cosmos?.setActive(id) }))
cosmos = safely('cosmos', () => initCosmos({ onNavigate: (id) => nav?.goTo(id) }))
