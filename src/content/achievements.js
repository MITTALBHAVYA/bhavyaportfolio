// Standing competitive-programming credentials — things that are true *now* and
// link to a live profile. Dated one-off events (KickStart, HackerCup, AISummit)
// belong to journey.js and are deliberately not repeated here.
//
// Links are structured fields. The old data embedded raw `<br>` and `<a>` tags
// inside description strings, which forced the renderer to use innerHTML and made
// the content impossible to escape safely.
export const achievements = [
  {
    id: 'icpc',
    title: 'ICPC Regionals Ranker',
    metric: 'AIR 37',
    description:
      'Qualified for ICPC Regionals at both Amritapuri and Kanpur in 2023-24, placing 37th in India at Kanpur.',
    link: null,
  },
  {
    id: 'codechef',
    title: '3-Star Coder on CodeChef',
    metric: '1687',
    description: 'Rated 1687 with over 1000 problems solved.',
    link: { label: 'CodeChef profile', url: 'https://www.codechef.com/users/bhavya_1729' },
  },
  {
    id: 'codeforces',
    title: 'Specialist on Codeforces',
    metric: 'Specialist',
    description: 'Currently Specialist, working toward Expert.',
    link: { label: 'Codeforces profile', url: 'https://codeforces.com/profile/bhav2915mittalji' },
  },
  {
    id: 'leetcode',
    title: 'LeetCode Knight',
    metric: '1847',
    description: 'Rated 1847 with over 800 problems solved.',
    link: { label: 'LeetCode profile', url: 'https://leetcode.com/u/bhav1729/' },
  },
  {
    id: 'hacktoberfest',
    title: 'Hacktoberfest 2023',
    metric: '4+ projects',
    description:
      'Contributed to four or more open-source projects, including FOSS-EVENT-2.0, a MERN stack project.',
    link: null,
  },
]
