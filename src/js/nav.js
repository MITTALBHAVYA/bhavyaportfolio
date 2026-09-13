/* Active-section tracking via IntersectionObserver; no scroll listener reads layout. */
export function initNav({ onSectionChange } = {}) {
  const header = document.querySelector('.site-header')
  const nav = document.querySelector('.site-nav')
  const toggle = document.querySelector('.nav-toggle')
  const links = [...document.querySelectorAll('[data-nav-link]')]
  const sections = links
    .map((l) => document.getElementById(l.dataset.navLink))
    .filter(Boolean)

  /* ------------------------- mobile menu ------------------------- */

  const mobileQuery = window.matchMedia('(width < 48rem)')

  const setMenu = (open) => {
    nav.dataset.open = String(open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }

  setMenu(false)

  toggle?.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true')
  })

  // Close on selection, on Escape, and on click outside.
  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false)
      toggle.focus()
    }
  })

  document.addEventListener('click', (e) => {
    if (
      toggle?.getAttribute('aria-expanded') === 'true' &&
      !e.target.closest('.site-nav') &&
      !e.target.closest('.nav-toggle')
    ) {
      setMenu(false)
    }
  })

  // Leaving mobile width with the menu open would strand it.
  mobileQuery.addEventListener('change', (e) => {
    if (!e.matches) setMenu(false)
  })

  /* ---------------------- header scrolled state ---------------------- */

  // A zero-height sentinel at the top of the page: when it scrolls out of view
  // the header gets its border. No scroll handler needed.
  const sentinel = document.createElement('div')
  sentinel.setAttribute('aria-hidden', 'true')
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;'
  document.body.prepend(sentinel)

  new IntersectionObserver(
    ([entry]) => {
      header.dataset.scrolled = String(!entry.isIntersecting)
    },
    { threshold: 0 }
  ).observe(sentinel)

  /* ---------------------- active section ---------------------- */

  const visible = new Map()

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
        else visible.delete(entry.target.id)
      }

      // The most-visible section wins; ties resolve to document order.
      let bestId = null
      let bestRatio = 0
      for (const section of sections) {
        const ratio = visible.get(section.id) ?? 0
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = section.id
        }
      }

      if (!bestId) return

      for (const link of links) {
        const isCurrent = link.dataset.navLink === bestId
        if (isCurrent) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      }

      onSectionChange?.(bestId)
    },
    // Several thresholds so the "most visible" comparison has real resolution.
    { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: '-15% 0px -35% 0px' }
  )

  sections.forEach((s) => observer.observe(s))

  /* ---------------------- programmatic scrolling ---------------------- */

  return {
    goTo(sectionId) {
      const target = document.getElementById(sectionId)
      if (!target) return
      // Native smooth scrolling honours scroll-padding-top from base.css.
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Keep the URL and focus in step, so the back button and keyboard work.
      history.replaceState(null, '', `#${sectionId}`)
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    },
  }
}
