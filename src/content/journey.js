// Canonical chronological record. Dated events live here and ONLY here;
// achievements.js holds standing credentials instead.
//
// `start`/`end` are sortable; `period` is what renders. `end: null` means ongoing.
// `image: null` falls back to a monogram built from the org name.
export const journey = [
  {
    id: 'atlas-code-carbon',
    type: 'role',
    period: 'JUN 2025 — PRESENT',
    start: '2025-06',
    end: null,
    title: 'Software Development Engineer',
    org: 'Atlas by Code Carbon',
    location: 'Noida, India',
    employment: 'Full-time',
    description:
      'Building product across the stack in Python and React, from API and data-layer work through to the interfaces on top of it.',
    image: 'timeline/atlas_cc_logo.jpg',
  },
  {
    id: 'weya-ai',
    type: 'role',
    period: 'MAR 2025 — MAY 2025',
    start: '2025-03',
    end: '2025-05',
    title: 'Full Stack Engineer',
    org: 'weya AI',
    location: 'Noida, India',
    employment: 'Internship',
    description:
      'Backend-focused work on a distributed microservice architecture, building and optimising services in Node.js and TypeScript on AWS — S3, SQS and ElastiCache. Implemented call recording and real-time streaming for a scalable calling service.',
    image: 'timeline/weyaai_logo.jpg',
  },
  {
    id: 'fancraze',
    type: 'role',
    period: 'NOV 2024 — FEB 2025',
    start: '2024-11',
    end: '2025-02',
    title: 'Back-end Developer',
    org: 'FanCraze',
    location: 'Noida, India',
    employment: 'Internship',
    description:
      'Engineered and maintained scalable Node.js microservices behind a Backend-for-Frontend architecture, and optimised MongoDB integrations for secure, high-performance APIs with consistent data flow. Built the React and Next.js interfaces on top.',
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
    location: 'JSS Academy of Technical Education',
    description:
      'Leading the programming track for GDSC, running workshops and events including SORTED and CRACK THE SHELL that have reached over 500 students.',
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
