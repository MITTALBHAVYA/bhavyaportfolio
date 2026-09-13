/*
 * Hero typing effect. Pauses when off-screen or the tab is hidden, and rotates
 * read-only. The first phrase ships in the HTML so the line is never empty.
 */
const TYPE_MS = 70
const DELETE_MS = 35
const HOLD_MS = 1600

export function initConsole() {
  const el = document.querySelector('[data-console]')
  if (!el) return

  let phrases
  try {
    phrases = JSON.parse(el.dataset.phrases)
  } catch {
    return
  }
  if (!Array.isArray(phrases) || phrases.length < 2) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let index = 0
  let chars = phrases[0].length
  let deleting = false
  let timer = 0
  let active = false

  const tick = () => {
    const phrase = phrases[index]

    if (!deleting && chars < phrase.length) {
      chars += 1
      el.textContent = phrase.slice(0, chars)
      timer = setTimeout(tick, TYPE_MS)
    } else if (!deleting) {
      deleting = true
      timer = setTimeout(tick, HOLD_MS)
    } else if (chars > 0) {
      chars -= 1
      el.textContent = phrase.slice(0, chars)
      timer = setTimeout(tick, DELETE_MS)
    } else {
      deleting = false
      index = (index + 1) % phrases.length // read-only rotation
      timer = setTimeout(tick, TYPE_MS)
    }
  }

  const play = () => {
    if (active) return
    active = true
    timer = setTimeout(tick, HOLD_MS)
  }

  const pause = () => {
    active = false
    clearTimeout(timer)
  }

  // Only animate while the hero is actually on screen and the tab is visible.
  const observer = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting && !document.hidden ? play() : pause()),
    { threshold: 0 }
  )
  observer.observe(el)

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause()
    else if (el.getBoundingClientRect().bottom > 0) play()
  })
}
