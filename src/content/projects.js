// `featured: true` projects lead the Work section at full size; the rest fall into
// a scannable grid below. Ordered most-impressive-first for a 30-second scan.
export const projects = [
  {
    id: 'nexus',
    name: 'NEXUS',
    featured: true,
    title: 'AI data-analyst platform for natural-language queries on structured data',
    description:
      'NEXUS lets anyone run natural-language queries against SQL, CSV and Excel datasets. It layers Chain-of-Thought and Tree-of-Thought reasoning for stronger logical inference, and renders results as dashboards so non-technical users can analyse data without writing a line of SQL.',
    metric: '96% query accuracy',
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
