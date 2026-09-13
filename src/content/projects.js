// `featured: true` projects lead the Work section at full size; the rest fall into
// a scannable grid below. Ordered most-impressive-first for a 30-second scan.
//
// TODO(owner): the `caseStudy` blocks below are DRAFTS written from the existing
// descriptions. The problem statements in particular are inference, not fact —
// please correct them. Problem/Approach/Outcome is the framing most likely to
// turn a skim into an interview, so it is worth getting exactly right.
// A project with no `caseStudy` simply renders its description instead.
export const projects = [
  {
    id: 'nexus',
    name: 'NEXUS',
    featured: true,
    title: 'AI data-analyst platform for natural-language queries on structured data',
    description:
      'NEXUS lets anyone run natural-language queries against SQL, CSV and Excel datasets. It layers Chain-of-Thought and Tree-of-Thought reasoning for stronger logical inference, and renders results as dashboards so non-technical users can analyse data without writing a line of SQL.',
    metric: '96% query accuracy',
    caseStudy: {
      problem:
        'Analysts who cannot write SQL still need the answers locked inside SQL databases, so every question turns into a ticket for someone who can.',
      approach:
        'Schema-aware prompting layered with Chain-of-Thought and Tree-of-Thought reasoning, so the model plans and validates a query against the real schema before it writes one.',
      outcome:
        'Reached 96% query accuracy, with results rendered as dashboards a non-technical user can read without touching SQL.',
    },
    techStacks: ['ReactJS', 'FastAPI', 'PostgreSQL', 'MongoDB', 'GenAI', 'TailwindCSS'],
    image: 'projects/nexus.png',
    links: { github: 'https://github.com/MITTALBHAVYA/NEXUS' },
  },
  {
    id: 'med-buddy',
    name: 'MED-BUDDY',
    featured: true,
    title: 'GenAI healthcare platform for symptom analysis and appointment booking',
    description:
      'MedBuddy streamlines healthcare access with a chatbot that analyses symptoms, suggests remedies and books doctor appointments. React on the front end, FastAPI behind it, with Brevo and Resend handling transactional email — cutting administrative load and improving patient follow-through.',
    caseStudy: {
      problem:
        'Getting seen means describing your symptoms to someone who is not a doctor, then waiting. Clinics lose hours to triage admin and patients drop out before they ever book.',
      approach:
        'A Gemini-backed chatbot that analyses symptoms and suggests next steps, wired directly into a FastAPI booking flow with Brevo and Resend handling confirmations.',
      outcome:
        'Cut the administrative back-and-forth around booking and improved how many patients actually follow through to an appointment.',
    },
    techStacks: ['React', 'FastAPI', 'MongoDB', 'TailwindCSS', 'Brevo', 'Resend API', 'Google Gemini AI'],
    image: 'projects/medbuddy.png',
    links: { github: 'https://github.com/MITTALBHAVYA/Medbuddy' },
  },
  {
    id: 'job-hack',
    name: 'JOB HACK',
    featured: true,
    title: 'MERN job application platform with JWT auth and role-based access',
    description:
      'A full job-board platform covering registration, listings and the application pipeline, with JWT authentication and role-based access control separating recruiters from applicants.',
    caseStudy: {
      problem:
        'Most job boards treat recruiters and applicants as one kind of user, so each group navigates an interface built for the other.',
      approach:
        'A MERN platform that separates the two at the route level, with JWT authentication and role-based access control deciding what each side can reach.',
      outcome:
        'A complete registration, listing and application pipeline, deployed and live.',
    },
    techStacks: ['ReactJS', 'MongoDB', 'NodeJS', 'AXIOS', 'JavaScript', 'HTML', 'CSS'],
    image: 'projects/jobhackwebapp.png',
    links: {
      github: 'https://github.com/MITTALBHAVYA/jobHack',
      live: 'https://jobhack108.netlify.app/',
    },
  },
  {
    id: 'slack-gdsc',
    name: 'SLACK GDSC',
    title: 'Slack-integrated web app for managing GDSC events and resources',
    description:
      'A React app that integrates with Slack through OAuth 2.0, giving members a single interface for authentication, sign-in and sign-up alongside core Slack functionality. Node and Express on the back end.',
    techStacks: ['React', 'Node.js', 'Express', 'JavaScript', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS'],
    image: 'projects/gdscslack.jpg',
    links: {
      github: 'https://github.com/MITTALBHAVYA/slack-GDSC-Mycut',
      live: 'https://slack-gdsc-mycut.vercel.app/',
    },
  },
  {
    id: 'invoice-extractor',
    name: 'INVOICE EXTRACTOR',
    title: 'Python tool that pulls structured data out of invoice PDFs and images',
    description:
      'A Streamlit tool combining PaddleOCR with Google Gemini to turn invoice PDFs and scans into structured records — customer details, line items and totals — instead of manual data entry.',
    techStacks: ['Python', 'Streamlit', 'PaddleOCR', 'PyMuPDF', 'Google Generative AI'],
    image: 'projects/IEA.png',
    links: { github: 'https://github.com/MITTALBHAVYA/InvoiceDetailsExtractor' },
  },
  {
    id: 'dhanvantri',
    name: 'DHANVANTRI',
    title: 'Android app that recognises medicinal plants from a photo',
    description:
      'A Kotlin Android app using a TensorFlow CNN to identify medicinal plants from the camera or gallery and surface detailed information about each one. Works offline, which matters for the rural users it was built for.',
    techStacks: ['Kotlin', 'Deep Learning', 'CNN', 'TensorFlow', 'OpenCV'],
    image: 'projects/dhanvantri.png',
    links: { github: 'https://github.com/MITTALBHAVYA/DhanVantriMyCut' },
  },
  {
    id: 'minsk-compiler',
    name: 'MINSK COMPILER',
    title: 'A compiler and interpreter built from scratch in C#',
    description:
      'An end-to-end compiler implementation covering lexical analysis, parsing, syntax trees, binding and code generation — built to understand how language tooling actually works rather than to use someone else’s.',
    techStacks: ['C#', '.NET', 'Visual Studio', 'Git'],
    image: 'projects/minskcompiler.png',
    links: { github: 'https://github.com/MITTALBHAVYA/MINSK' },
  },
  {
    id: 'sehat',
    name: 'SEHAT',
    title: 'ML app predicting diabetes and heart-disease risk',
    description:
      'An interactive tool that runs trained models over user-supplied health indicators to give real-time risk predictions for diabetes and heart disease.',
    techStacks: ['NumPy', 'Pandas', 'scikit-learn', 'Streamlit', 'Google Colab'],
    image: 'projects/sehatthepredictionapp.png',
    links: { github: 'https://github.com/MITTALBHAVYA/SEHAT-miniProject-sem5-' },
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)

/** Stable, URL-safe id for a tech name, used by the project filter. */
export const techId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/*
 * Filter options. Listing all ~35 technologies would be noise, so this keeps
 * only those shared by at least two projects — the ones where filtering
 * actually narrows anything — ordered by how often they appear.
 */
export const filterableTech = (() => {
  const counts = new Map()
  for (const p of projects) {
    for (const t of p.techStacks) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count, id: techId(name) }))
})()
