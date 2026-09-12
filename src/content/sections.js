// The spine of the site: every section, its nav label, and the body it docks at in
// the solar system. Scrolling travels outward from the Sun, so array order is also
// orbital order. The cosmos canvas, the nav, and the scroll camera all read from
// this one list, which keeps them from drifting out of sync.
//
// `orbit` is in abstract units (Sun at 0); `period` is relative orbital speed —
// larger is slower. `radius` is the drawn body size in the same abstract units.
export const sections = [
  {
    id: 'hero',
    label: 'Start',
    navLabel: null, // the logo links here instead
    body: { name: 'Sun', orbit: 0, radius: 26, period: 0, color: '#ffc24d', glow: '#ff8c1a' },
  },
  {
    id: 'work',
    label: 'Work',
    navLabel: 'Work',
    body: { name: 'Mercury', orbit: 70, radius: 4, period: 88, color: '#b8b2a6', glow: '#8d8478' },
  },
  {
    id: 'about',
    label: 'About',
    navLabel: 'About',
    body: { name: 'Venus', orbit: 104, radius: 7.5, period: 225, color: '#e6bd7a', glow: '#c08f3e' },
  },
  {
    id: 'journey',
    label: 'Journey',
    navLabel: 'Journey',
    body: { name: 'Earth', orbit: 144, radius: 8, period: 365, color: '#4b9fe1', glow: '#2d6fa8' },
  },
  {
    id: 'achievements',
    label: 'Achievements',
    navLabel: 'Achievements',
    body: { name: 'Mars', orbit: 190, radius: 5.5, period: 687, color: '#d1603d', glow: '#9c402a' },
  },
  {
    id: 'writing',
    label: 'Writing',
    navLabel: 'Writing',
    body: { name: 'Jupiter', orbit: 262, radius: 17, period: 1200, color: '#d8b48c', glow: '#a5794f' },
  },
  {
    id: 'contact',
    label: 'Contact',
    navLabel: 'Contact',
    body: {
      name: 'Saturn',
      orbit: 340,
      radius: 14,
      period: 1800,
      color: '#e3d2a0',
      glow: '#b09a63',
      ring: { inner: 20, outer: 30, tilt: 0.42 },
    },
  },
]

export const navSections = sections.filter((s) => s.navLabel)
export const sectionIds = sections.map((s) => s.id)
export const FURTHEST_ORBIT = Math.max(...sections.map((s) => s.body.orbit))
