// Canonical chronological record. Dated events live here and ONLY here;
// achievements.js holds standing credentials instead.
//
// `start`/`end` are sortable; `period` is what renders. `end: null` means ongoing.
export const journey = [
  {
    id: 'fancraze',
    type: 'role',
    period: 'NOV 2024 — FEB 2025',
    start: '2024-11',
    end: '2025-02',
    title: 'Fullstack Intern',
    org: 'Faze Technologies (FanCraze)',
    location: 'Mumbai, India',
    description:
      'Maintained scalable Node.js microservices supporting a Backend-for-Frontend architecture, and optimised MongoDB integrations behind secure APIs for performance and data consistency. Built responsive React and Next.js interfaces for a smoother cross-platform experience.',
    image: 'timeline/fancraze_logo.jpg',
  },
  {
    id: 'aisummit-2024',
    type: 'award',
    period: 'MAY 2024',
    start: '2024-05',
    end: '2024-05',
    title: 'Winner — AISummit 2024',
    org: 'KareAI',
    description:
      'Took 1st place in the AI hackathon hosted by KareAI, building an LLM chatbot for booking doctor appointments.',
    image: 'timeline/kareai.png',
  },
  {
    id: 'hackercup-2023',
    type: 'award',
    period: 'DEC 2023',
    start: '2023-12',
    end: '2023-12',
    title: 'Meta HackerCup 2023',
    org: 'Meta',
    description:
      'Finished at World Rank 3532 in Meta HackerCup, competing on complex algorithmic problems under contest conditions.',
    image: 'timeline/meta.jpg',
  },
  {
    id: 'gdsc',
    type: 'role',
    period: 'SEP 2023 — PRESENT',
    start: '2023-09',
    end: null,
    title: 'Programming Lead',
    org: 'Google Developer Student Club',
    description:
      'Leading the programming track for GDSC at my college, running workshops and sessions that have reached over 500 students.',
    image: 'timeline/gdsc_icon.jpg',
  },
  {
    id: 'kickstart-2023',
    type: 'award',
    period: 'APR 2023',
    start: '2023-04',
    end: '2023-04',
    title: 'Google KickStart 2023',
    org: 'Google',
    description:
      'Finished at World Rank 3518 in the KickStart Farewell round, sharpening the algorithmic problem-solving that underpins everything else here.',
    image: 'timeline/googleicon.png',
  },
]
