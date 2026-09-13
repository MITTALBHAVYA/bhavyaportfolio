/*
 * Filters the project grid by technology. The UI ships `hidden` and is revealed
 * here, so without JS every project stays visible.
 */
export function initProjectFilter() {
  const filter = document.querySelector('[data-tech-filter]')
  const grid = document.querySelector('[data-project-grid]')
  if (!filter || !grid) return

  const buttons = [...filter.querySelectorAll('[data-filter]')]
  const cards = [...grid.querySelectorAll('[data-tech]')]
  const status = filter.querySelector('[data-filter-status]')
  const empty = document.querySelector('[data-filter-empty]')
  if (!buttons.length || !cards.length) return

  filter.hidden = false

  const apply = (value) => {
    let shown = 0

    for (const card of cards) {
      const match = value === 'all' || card.dataset.tech.split(' ').includes(value)
      card.hidden = !match
      if (match) shown += 1
    }

    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === value))
    }

    if (empty) empty.hidden = shown > 0

    // Announced politely so screen-reader users learn the result of a filter
    // they cannot see change.
    const label = buttons.find((b) => b.dataset.filter === value)?.textContent.trim() ?? value
    status.textContent =
      value === 'all'
        ? ''
        : `${shown} ${shown === 1 ? 'project' : 'projects'} using ${label.replace(/\s*\d+$/, '')}.`
  }

  filter.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]')
    if (!btn) return
    // Clicking the active filter clears it, which is what people expect.
    const next = btn.getAttribute('aria-pressed') === 'true' ? 'all' : btn.dataset.filter
    apply(next)
  })

  apply('all')
}
