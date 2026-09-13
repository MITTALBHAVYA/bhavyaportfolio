// Canonical chronological record. Dated events live here and ONLY here;
// achievements.js holds standing credentials instead.
//
// `start`/`end` are sortable; `period` is what renders. `end: null` means ongoing.
// `image: null` falls back to a monogram built from the org name.
export const journey = [
  {
    id: 'code-carbon',
    type: 'role',
    period: 'JUN 2025 — PRESENT',
    start: '2025-06',
    end: null,
    title: 'Software Engineer',
    org: 'Code Carbon',
    location: 'Noida, India',
    employment: 'Full-time',
    description:
      'Building end-to-end features for an enterprise compliance management platform in React, Next.js, TypeScript and Django. I design the modular REST APIs that orchestrate multi-organisation compliance workflows across regulatory domains, plus the authentication, file-handling and dynamic form engines that make the platform configurable per client.',
    image: 'timeline/atlas_cc_logo.jpg',
  },
  {
    id: 'weya-ai',
    type: 'role',
    period: 'MAR 2025 — MAY 2025',
    start: '2025-03',
    end: '2025-05',
    title: 'Backend Engineer',
    org: 'weya AI',
    location: 'Noida, India',
    employment: 'Internship',
    description:
      'Built production communication services in Node.js and TypeScript, with frontend work in Next.js. Implemented VoIP on Plivo and Twilio — real-time web calling, call streaming and bidirectional sockets for event-driven updates — and designed a concurrency-aware call processing pipeline on AWS SQS, Redis and S3, using statistical monitoring of call-success metrics to tune it.',
    image: 'timeline/weyaai_logo.jpg',
  },
  {
    id: 'fancraze',
    type: 'role',
    period: 'NOV 2024 — FEB 2025',
    start: '2024-11',
    end: '2025-02',
    title: 'Full-stack Engineer',
    org: 'FanCraze',
    location: 'Mumbai, India',
    employment: 'Internship',
    description:
      'Maintained scalable Node.js microservices behind a Backend-for-Frontend architecture, and optimised MongoDB integrations for secure APIs with consistent, reliable data flow. Built the React and Next.js interfaces on top.',
    image: 'timeline/fancraze_logo.jpg',
  },
  {
    id: 'kare-ai',
    type: 'role',
    period: 'SEP 2024 — NOV 2024',
    start: '2024-09',
    end: '2024-11',
    title: 'SDE Intern',
    org: 'Kare AI',
    location: 'Bangalore, India',
    employment: 'Internship',
    description:
      'Optimised AI chat interfaces with React, TailwindCSS and Recharts, improving how conversations and their underlying data were visualised. I had won KareAI’s AI Summit hackathon earlier that year.',
    image: 'timeline/kareai.png',
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
