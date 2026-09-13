import { sections, FURTHEST_ORBIT } from '../content/sections.js'

/*
 * One canvas replaces four separate starfield systems from the old site:
 * a tiled 263KB PNG, three animated full-viewport layers, 100 JS-created divs
 * (plus 100 more hand-written in the HTML that were never visible), and 890
 * comma-separated box-shadows that made up 41KB of a 48KB stylesheet.
 *
 * Composition rule: content always wins. The solar system is vivid in the hero,
 * fades out as soon as you scroll into the work, and returns — quietly — behind
 * the Journey timeline, which is the one place where "a career as orbits"
 * actually means something. The starfield persists throughout at low contrast.
 */

const TAU = Math.PI * 2
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// Scroll progress at which the hero's system has fully dissolved.
const HERO_END = 0.08
// How present the system is behind the journey timeline.
const JOURNEY_ALPHA = 0.5

export function initCosmos({ onNavigate } = {}) {
  const root = document.querySelector('.cosmos')
  const canvas = document.querySelector('[data-cosmos]')
  const labelEl = document.querySelector('[data-cosmos-label]')
  if (!canvas) return null

  const ctx = canvas.getContext('2d', { alpha: true })
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  // Low-end guard: fewer stars, no DPR upscaling, on weak or narrow devices.
  const cores = navigator.hardwareConcurrency ?? 4
  const lowPower = cores <= 4 || window.innerWidth < 640
  const maxDpr = lowPower ? 1 : 2

  let width = 0
  let height = 0
  let stars = []
  let scrollProgress = 0
  let activeSectionId = 'hero'
  let systemAlpha = 1
  let pointer = { x: -1, y: -1, active: false }
  let hovered = null
  let running = false
  let rafId = 0
  let startTime = 0

  // Planet screen positions, recomputed each frame for hit-testing.
  const hitTargets = []

  /* ------------------------------------------------------------------ */

  function resize() {
    const rect = root.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    seedStars()
  }

  function seedStars() {
    const target = clamp(Math.round((width * height) / 5200), 60, lowPower ? 140 : 320)
    stars = Array.from({ length: target }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3,
      depth: Math.random() * 0.8 + 0.2,
      // Per-star hue and brightness, preserved from the original starwrapper.js
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

    // In the hero the sun crowns the name from the upper right, clear of the
    // paragraph beneath it. Behind the journey it settles toward the middle.
    const heroScale = (minDim * 0.2) / 26
    const wideScale = (minDim * 0.34) / FURTHEST_ORBIT
    const t = easeInOut(clamp(progress / 0.45, 0, 1))
    const scale = lerp(heroScale, wideScale, t)

    const cx = narrow ? lerp(width * 0.74, width * 0.5, t) : lerp(width * 0.82, width * 0.62, t)
    const cy = narrow ? lerp(height * 0.26, height * 0.5, t) : lerp(height * 0.3, height * 0.5, t)

    return { cx, cy, scale }
  }

  function drawStars(time) {
    for (const s of stars) {
      // Parallax: nearer stars drift further as the camera pulls back.
      const drift = scrollProgress * s.depth * height * 0.22
      let y = s.y * height - drift
      y = ((y % height) + height) % height

      const flicker = reduceMotion.matches
        ? 1
        : 0.72 + 0.28 * Math.sin(time * 0.001 * s.twinkleRate + s.twinkle)

      ctx.globalAlpha = s.alpha * flicker
      ctx.fillStyle = `hsl(${s.hue} 80% 88%)`
      ctx.beginPath()
      ctx.arc(s.x * width, y, s.r * (0.6 + s.depth * 0.6), 0, TAU)
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

    // The eclipse — a dark moon transiting the sun, carried over from the
    // original landing animation. Only while the hero is on screen.
    const eclipse = clamp(1 - scrollProgress / HERO_END, 0, 1)
    if (eclipse > 0.01) {
      const t = reduceMotion.matches ? 0.3 : (time * 0.00003) % 1
      const mx = cx + lerp(-2.2, 2.2, t) * r
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
      // Distinct starting angles keep planets from lining up in a row.
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

      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r)
      grad.addColorStop(0, body.color)
      grad.addColorStop(1, body.glow)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TAU)
      ctx.fill()

      if (isActive) drawActiveRing(x, y, r + 8, time)
    }

    ctx.restore()
  }

  /* ------------------------------------------------------------------ */

  function frame(time) {
    if (!startTime) startTime = time
    const t = time - startTime

    // Ease the system in and out rather than popping between sections.
    const target = systemTarget()
    if (reduceMotion.matches) systemAlpha = target
    else systemAlpha += (target - systemAlpha) * 0.07

    ctx.clearRect(0, 0, width, height)
    drawStars(t)

    if (systemAlpha > 0.01) drawSystem(t)
    else hitTargets.length = 0

    updateHover()

    // Reduced motion draws a single settled frame per scroll/resize rather than
    // holding a rAF loop open.
    if (reduceMotion.matches) {
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
    const interactive = pointer.active && systemAlpha > 0.25

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
      // Generous radius so small planets stay clickable.
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

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect()
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
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

  // Pointer interaction is a progressive enhancement; the real navigation is
  // the <nav> in the header, which works without any of this.
  if (window.matchMedia('(hover: hover)').matches) {
    root.classList.add('cosmos--interactive')
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
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
