export const profile = {
  greeting: 'Namaste 🙏, My name is',
  displayName: 'BHAVYA',
  fullName: 'Bhavya Mittal',
  role: 'Full-stack engineer & competitive programmer',
  tagline: 'I build backends that scale, AI products that ship, and solve problems that fight back.',

  bio: [
    'I am a full-stack developer specializing in the MERN stack, Python, and C++. With strong competitive programming experience across ICPC, Google KickStart and Meta HackerCup, I build scalable backend systems, AI-driven applications, and efficient databases.',
    'As Programming Lead of GDSC, I have run workshops and hackathons that reached over 500 students. I care most about problem-solving, and about building things people can actually rely on.',
  ],

  location: 'India',

  // Shown as a quiet line in the hero — employment-forward, freelance available.
  availability: {
    open: true,
    note: 'Open to full-time roles · available for select freelance work',
  },

  // TODO(owner): replace with a locally hosted /resume.pdf so the link cannot rot.
  resume: {
    url: 'https://drive.google.com/file/d/1RHieQCUDl2lfZCOQiNf3qeAl5OC6onW0/view',
    label: 'Resume',
    external: true,
  },

  // Rotating phrases in the hero console. Preserved verbatim from the original site.
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
    { label: 'Codeforces', value: 'Specialist' },
    { label: 'LeetCode', value: 'Knight · 1847' },
    { label: 'Problems solved', value: '1800+' },
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
    copyright: 'Copyright © 2024-25 Bhavya Mittal',
    madeWith: 'Made with ❤️ by Bhavya Mittal',
  },
}
