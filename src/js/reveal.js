/*
 * Scroll reveal. `js-reveal` is added only once this runs, so if the script
 * fails or never loads, nothing is ever hidden.
 */
export function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]')
  if (!targets.length) return

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => (el.dataset.revealed = 'true'))
    return
  }

  document.documentElement.classList.add('js-reveal')

  // Stagger children by index.
  for (const el of document.querySelectorAll('[data-reveal-stagger]')) {
    ;[...el.children].forEach((child, i) => {
      child.style.setProperty('--stagger-index', String(Math.min(i, 12)))
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.revealed = 'true'
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )

  targets.forEach((el) => observer.observe(el))

  // Anything already on screen at load reveals immediately rather than waiting
  // for a scroll that may never come.
  requestAnimationFrame(() => {
    for (const el of targets) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.dataset.revealed = 'true'
        observer.unobserve(el)
      }
    }
  })
}
