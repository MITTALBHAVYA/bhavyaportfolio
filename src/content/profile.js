export const profile = {
  greeting: 'Namaste 🙏, My name is',
  displayName: 'BHAVYA',
  fullName: 'Bhavya Mittal',
  role: 'Full-stack engineer & competitive programmer',
  tagline: 'I build backends that scale, AI products that ship, and solve problems that fight back.',

  bio: [
    'I am a software engineer at Atlas by Code Carbon, working across Python and React. Before that I built distributed microservices on AWS at weya AI, and Node.js services behind a Backend-for-Frontend architecture at FanCraze.',
    'My foundation is competitive programming — ICPC Regionals, Google KickStart and Meta HackerCup — and it is what I lean on when a problem turns out to be harder than it looked. As Programming Lead of GDSC I ran workshops and events that reached over 500 students.',
    'I care most about problem-solving, and about building things people can actually rely on.',
  ],

  location: 'Noida, India',
  phone: '+91 9389711682',

  education: {
    institution: 'JSS Academy of Technical Education',
    degree: 'B.Tech, Computer Science Engineering',
    grade: 'CGPA 8.57',
    period: 'Graduated 2025',
    coursework: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Machine Learning',
      'Computer Networks',
      'Web Development',
    ],
  },

  // Shown as a quiet line in the hero — employment-forward, freelance available.
  availability: {
    open: true,
    note: 'Available for select freelance work',
  },

  // Served from public/resume.pdf so it is indexable and cannot rot.
  resume: {
    url: 'resume.pdf',
    label: 'Resume',
    external: false,
  },

  // Rotating phrases in the hero console.
  typing: [
    'Backend',
    'FrontEnd',
    'Generative AI',
    'Data Structures & Algorithms',
    'Competitive Programming',
  ],

  // Inline credibility chips in the hero — what a recruiter should see in 3 seconds.
  proof: [
    { label: 'ICPC Regionals', value: 'AIR 37' },
    { label: 'Codeforces', value: 'Specialist · 1427' },
    { label: 'LeetCode', value: 'Knight · 1880' },
    { label: 'Problems solved', value: '2000+' },
  ],

  links: {
    email: 'bhavya12mittal@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mittalbhavya1729/',
    github: 'https://github.com/MITTALBHAVYA',
    twitter: 'https://twitter.com/bhavyamit1729',
  },

  // TODO(owner): supply a Cal.com link to enable the "book a call" path.
  booking: null,

  quote: {
    text: 'An equation for me has no meaning unless it expresses a thought of God.',
    author: 'Srinivasa Ramanujan',
    role: 'mathematician',
  },

  footer: {
    copyright: 'Copyright © 2026-27 Bhavya Mittal',
    madeWith: 'Made with ❤️ by Bhavya Mittal',
  },
}
