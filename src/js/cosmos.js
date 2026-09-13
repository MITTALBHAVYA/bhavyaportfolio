import { sections, FURTHEST_ORBIT } from '../content/sections.js'

/*
 * Starfield and solar system on a single canvas.
 *
 * Composition rule: content always wins. The system is vivid in the hero, fades
 * out on scroll, and returns quietly behind the Journey timeline. The starfield
 * persists throughout at low contrast.
 */

const TAU = Math.PI * 2
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// Scroll progress at which the hero's system has fully dissolved.
const HERO_END = 0.08
// How present the system is behind the journey timeline.
const JOURNEY_ALPHA = 0.5
// How long the opening eclipse takes to reach totality, in ms.
const REVEAL_MS = 2600
// Radius, in px, within which the pointer brightens nearby stars.
const CURSOR_REACH = 170
const FRAME_MS = 1000 / 30

export function initCosmos({ onNavigate } = {}) {
  const root = document.querySelector('.cosmos')
  const canvas = document.querySelector('[data-cosmos]')
  const labelEl = document.querySelector('[data-cosmos-label]')
  if (!canvas) return null

  const ctx = canvas.getContext('2d', { alpha: true })
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  const cores = navigator.hardwareConcurrency ?? 4
  const lowPower = cores <= 4 || window.innerWidth < 640
  const maxDpr = lowPower ? 1 : 2

  let width = 0
  let height = 0
  let stars = []
  let scrollProgress = 0
  let activeSectionId = 'hero'
  let systemAlpha = 1
  let pointer = { x: -1, y: -1, active: false, onCanvas: false }
  let hovered = null
  let running = false
  let rafId = 0
  let startTime = 0
  let lastPaint = 0

  // Screen positions, recomputed each frame for hit-testing.
  const hitTargets = []

  // Planets are pre-rendered per integer radius and blitted; building a radial
  // gradient per planet per frame was the largest single canvas cost.
  const spriteCache = new Map()

  function planetSprite(body, r) {
    const key = `${body.name}:${Math.round(r)}`
    const cached = spriteCache.get(key)
    if (cached) return cached

    if (spriteCache.size > 240) spriteCache.clear()

    const rr = Math.max(1, Math.round(r))
    const size = rr * 2 + 2
    const sprite = document.createElement('canvas')
    sprite.width = size
    sprite.height = size

    const g = sprite.getContext('2d')
    const c = size / 2
    const grad = g.createRadialGradient(c - rr * 0.3, c - rr * 0.35, rr * 0.1, c, c, rr)
    grad.addColorStop(0, body.color)
    grad.addColorStop(1, body.glow)
    g.fillStyle = grad
    g.beginPath()
    g.arc(c, c, rr, 0, TAU)
    g.fill()

    spriteCache.set(key, sprite)
    return sprite
  }

  /* ------------------------------------------------------------------ */

  function resize() {
    const rect = root.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    spriteCache.clear()
    seedStars()
  }

  function seedStars() {
    const target = clamp(Math.round((width * height) / 5200), 60, lowPower ? 140 : 320)
    stars = Array.from({ length: target }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3,
      depth: Math.random() * 0.8 + 0.2,
      hue: 200 + Math.random() * 60,
      alpha: Math.random() * 0.45 + 0.2,
      twinkle: Math.random() * TAU,
      twinkleRate: Math.random() * 0.8 + 0.3,
    }))
  }

  /* ------------------------------------------------------------------ */

  /** How present the solar system should be right now, 0..1. */
  function systemTarget() {
    if (scrollProgress < HERO_END) return 1 - easeInOut(scrollProgress / HERO_END) * 0.15
    return activeSectionId === 'journey' ? JOURNEY_ALPHA : 0
  }

  function cameraFor(progress) {
    const minDim = Math.min(width, height)
    const narrow = width < 900

    // Upper-right in the hero, clear of the copy; centred behind the journey.
    const heroScale = (minDim * 0.2) / 26
    const wideScale = (minDim * 0.34) / FURTHEST_ORBIT
    const t = easeInOut(clamp(progress / 0.45, 0, 1))
    const scale = lerp(heroScale, wideScale, t)

    const cx = narrow ? lerp(width * 0.74, width * 0.5, t) : lerp(width * 0.82, width * 0.62, t)
    const cy = narrow ? lerp(height * 0.26, height * 0.5, t) : lerp(height * 0.3, height * 0.5, t)

    return { cx, cy, scale }
  }

  function drawStars(time) {
    const reactive = pointer.active && !reduceMotion.matches
    const reach2 = CURSOR_REACH * CURSOR_REACH

    for (const s of stars) {
      const drift = scrollProgress * s.depth * height * 0.22
      const x = s.x * width
      let y = s.y * height - drift
      y = ((y % height) + height) % height

      const flicker = reduceMotion.matches
        ? 1
        : 0.72 + 0.28 * Math.sin(time * 0.001 * s.twinkleRate + s.twinkle)

      let bloom = 0
      if (reactive) {
        const dx = pointer.x - x
        const dy = pointer.y - y
        const d2 = dx * dx + dy * dy
        if (d2 < reach2) bloom = (1 - Math.sqrt(d2) / CURSOR_REACH) ** 2 * s.depth
      }

      ctx.globalAlpha = Math.min(1, s.alpha * flicker + bloom * 0.75)
      ctx.fillStyle = `hsl(${s.hue} 80% ${88 + bloom * 12}%)`
      ctx.beginPath()
      ctx.arc(x, y, s.r * (0.6 + s.depth * 0.6) * (1 + bloom * 0.8), 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function drawSun(cam, time) {
    const r = 26 * cam.scale
    const { cx, cy } = cam

    // Corona
    const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 3.2)
    glow.addColorStop(0, 'rgba(255, 194, 77, 0.42)')
    glow.addColorStop(0.35, 'rgba(255, 140, 26, 0.12)')
    glow.addColorStop(1, 'rgba(255, 140, 26, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(cx, cy, r * 3.2, 0, TAU)
    ctx.fill()

    // Body
    const body = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r)
    body.addColorStop(0, '#fff3d0')
    body.addColorStop(0.5, '#ffc24d')
    body.addColorStop(1, '#ff8c1a')
    ctx.fillStyle = body
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, TAU)
    ctx.fill()

    const eclipse = clamp(1 - scrollProgress / HERO_END, 0, 1)
    if (eclipse <= 0.01) return

    // The moon sweeps in to totality on load, then drifts. The wrap happens
    // while it is clear of the disc, so it is never visible.
    let offset
    let flash = 0
    if (reduceMotion.matches) {
      offset = 0.34
    } else if (time < REVEAL_MS) {
      const p = 1 - (1 - time / REVEAL_MS) ** 3
      offset = lerp(-2.4, 0, p)
      flash = clamp(1 - Math.abs(offset) / 0.5, 0, 1) ** 3
    } else {
      const drift = ((time - REVEAL_MS) * 0.00003) % 4.8
      offset = drift <= 2.4 ? drift : drift - 4.8
    }

    const mx = cx + offset * r
    const my = cy - r * 0.18

    ctx.save()
    ctx.globalAlpha = eclipse
    ctx.beginPath()
    ctx.arc(cx, cy, r * 1.02, 0, TAU)
    ctx.clip()
    ctx.fillStyle = '#05070c'
    ctx.beginPath()
    ctx.arc(mx, my, r * 0.92, 0, TAU)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.globalAlpha = eclipse * 0.65
    ctx.strokeStyle = 'rgba(255, 214, 140, 0.7)'
    ctx.lineWidth = Math.max(1, r * 0.03)
    ctx.beginPath()
    ctx.arc(mx, my, r * 0.92, 0, TAU)
    ctx.stroke()
    ctx.restore()

    if (flash > 0.01) {
      const bx = mx - r * 0.88
      const by = my + r * 0.2

      ctx.save()
      ctx.globalAlpha = eclipse * flash
      const bloom = ctx.createRadialGradient(bx, by, 0, bx, by, r * 2.2)
      bloom.addColorStop(0, 'rgba(255, 248, 220, 0.95)')
      bloom.addColorStop(0.25, 'rgba(255, 208, 120, 0.35)')
      bloom.addColorStop(1, 'rgba(255, 190, 90, 0)')
      ctx.fillStyle = bloom
      ctx.beginPath()
      ctx.arc(bx, by, r * 2.2, 0, TAU)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 252, 238, 0.95)'
      ctx.beginPath()
      ctx.arc(bx, by, Math.max(1.5, r * 0.07 * flash), 0, TAU)
      ctx.fill()
      ctx.restore()
    }
  }

  function drawActiveRing(x, y, radius, time) {
    const pulse = reduceMotion.matches ? 0.5 : 0.4 + 0.15 * Math.sin(time * 0.002)
    ctx.save()
    ctx.strokeStyle = `rgba(86, 216, 255, ${pulse})`
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, TAU)
    ctx.stroke()
    ctx.restore()
  }

  function drawSystem(time) {
    const cam = cameraFor(scrollProgress)
    const activeIndex = sections.findIndex((s) => s.id === activeSectionId)
    hitTargets.length = 0

    ctx.save()
    ctx.globalAlpha = systemAlpha

    // Orbit rings first, so bodies sit on top.
    ctx.lineWidth = 1
    for (let i = 1; i < sections.length; i++) {
      const isActive = i === activeIndex
      ctx.strokeStyle = isActive ? 'rgba(86, 216, 255, 0.28)' : 'rgba(61, 74, 95, 0.22)'
      ctx.beginPath()
      ctx.arc(cam.cx, cam.cy, sections[i].body.orbit * cam.scale, 0, TAU)
      ctx.stroke()
    }

    drawSun(cam, time)

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i]
      const { body } = section
      const phase = i * 1.7
      const speed = reduceMotion.matches ? 0 : time * 0.00004
      const angle = phase + (speed * 365) / body.period
      const orbitR = body.orbit * cam.scale
      const x = cam.cx + Math.cos(angle) * orbitR
      const y = cam.cy + Math.sin(angle) * orbitR * 0.92 // slight tilt
      const r = Math.max(1.5, body.radius * cam.scale)

      hitTargets.push({ index: i, section, x, y, r })

      if (body.ring) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(body.ring.tilt)
        ctx.scale(1, 0.34)
        ctx.strokeStyle = 'rgba(227, 210, 160, 0.5)'
        ctx.lineWidth = Math.max(1, (body.ring.outer - body.ring.inner) * cam.scale * 0.5)
        ctx.beginPath()
        ctx.arc(0, 0, ((body.ring.inner + body.ring.outer) / 2) * cam.scale, 0, TAU)
        ctx.stroke()
        ctx.restore()
      }

      const isActive = i === activeIndex
      const isHovered = hovered?.index === i

      if (isActive || isHovered) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4)
        halo.addColorStop(0, 'rgba(86, 216, 255, 0.3)')
        halo.addColorStop(1, 'rgba(86, 216, 255, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(x, y, r * 4, 0, TAU)
        ctx.fill()
      }

      const sprite = planetSprite(body, r)
      ctx.drawImage(sprite, x - sprite.width / 2, y - sprite.height / 2)

      if (isActive) drawActiveRing(x, y, r + 8, time)
    }

    ctx.restore()
  }

  /* ------------------------------------------------------------------ */

  function frame(time) {
    if (!startTime) startTime = time

    if (!reduceMotion.matches && time - lastPaint < FRAME_MS) {
      rafId = requestAnimationFrame(frame)
      return
    }
    lastPaint = time

    const t = time - startTime

    const target = systemTarget()
    if (reduceMotion.matches) systemAlpha = target
    else systemAlpha += (target - systemAlpha) * 0.07

    ctx.clearRect(0, 0, width, height)
    drawStars(t)

    if (systemAlpha > 0.01) drawSystem(t)
    else hitTargets.length = 0

    updateHover()

    // Reduced motion paints one settled frame instead of holding the loop open.
    if (reduceMotion.matches) {
      running = false
      return
    }

    // Stop once there is nothing left to animate; a scroll, resize or pointer
    // move restarts it. Without this the canvas repaints behind static content.
    const settled = Math.abs(target - systemAlpha) < 0.005
    if (settled && systemAlpha <= 0.01 && !pointer.active) {
      running = false
      return
    }

    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    rafId = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  function requestDraw() {
    if (reduceMotion.matches) {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(frame)
      }
    } else {
      start()
    }
  }

  /* ---------------------------- interaction --------------------------- */

  function updateHover() {
    // A planet behind a paragraph is not hoverable.
    const interactive = pointer.active && pointer.onCanvas && systemAlpha > 0.25

    if (!interactive) {
      if (hovered) {
        hovered = null
        labelEl.dataset.visible = 'false'
        canvas.dataset.hovering = 'false'
      }
      return
    }

    let found = null
    for (const target of hitTargets) {
      const dx = pointer.x - target.x
      const dy = pointer.y - target.y
      if (dx * dx + dy * dy < Math.max(target.r + 12, 18) ** 2) {
        found = target
        break
      }
    }

    if (found?.index !== hovered?.index) {
      hovered = found
      canvas.dataset.hovering = found ? 'true' : 'false'
      if (found) {
        labelEl.textContent = `${found.section.body.name} · ${found.section.label}`
        labelEl.dataset.visible = 'true'
      } else {
        labelEl.dataset.visible = 'false'
      }
    }

    if (hovered) {
      labelEl.style.left = `${hovered.x}px`
      labelEl.style.top = `${hovered.y - hovered.r - 22}px`
    }
  }

  // On window, not the canvas: content sits above it, so a canvas-only listener
  // freezes the starfield whenever the cursor crosses text.
  function onPointerMove(e) {
    pointer = {
      x: e.clientX,
      y: e.clientY,
      active: true,
      onCanvas: e.target === canvas,
    }
    requestDraw()
  }

  function onPointerLeave() {
    pointer.active = false
    requestDraw()
  }

  function onClick() {
    if (hovered && onNavigate) onNavigate(hovered.section.id)
  }

  /* ------------------------------- wiring ------------------------------ */

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
    requestDraw()
  }

  const onVisibility = () => (document.hidden ? stop() : requestDraw())

  let resizeTimer = 0
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      resize()
      requestDraw()
    }, 150)
  }

  resize()
  onScroll()

  // Progressive enhancement; the real navigation is the header <nav>.
  if (window.matchMedia('(hover: hover)').matches) {
    root.classList.add('cosmos--interactive')
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })
    canvas.addEventListener('click', onClick)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  reduceMotion.addEventListener('change', () => {
    stop()
    startTime = 0
    requestDraw()
  })

  requestDraw()

  return {
    setActive(sectionId) {
      if (sectionId !== activeSectionId) {
        activeSectionId = sectionId
        requestDraw()
      }
    },
  }
}
