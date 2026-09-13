// The marquee is derived from this map rather than hand-listed, so the icons and
// the skills list cannot drift apart.
export const skillIcons = {
  JavaScript: 'icon_js.svg',
  Python: 'icon_python.svg',
  'C++': 'icon_cpp.svg',
  C: 'icon_c.svg',
  HTML: 'icon_html.svg',
  CSS: 'icon_css.svg',
  ReactJS: 'icon_react.svg',
  'Node.js': 'icon_nodejs.svg',
  MySQL: 'icon_mysql.svg',
  MongoDB: 'icon_mongo.svg',
  Git: 'icon_git.svg',
  Postman: 'icon_postman.svg',
}

export const skills = [
  {
    category: 'Languages',
    items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    category: 'Frameworks',
    items: [
      'ReactJS',
      'Next.js',
      'Node.js',
      'ExpressJS',
      'Django',
      'FastAPI',
      'REST API',
      'Tailwind CSS',
    ],
  },
  {
    category: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS S3', 'AWS SQS', 'ElastiCache', 'Microservices', 'Plivo', 'Twilio'],
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Bootstrap', 'GenAI'],
  },
]

export const marqueeIcons = skills
  .flatMap((group) => group.items)
  .filter((name) => name in skillIcons)
  .map((name) => ({ name, icon: skillIcons[name] }))
