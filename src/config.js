/* Deployment-specific values. Moving to a custom domain means changing BASE to
   '/' and SITE_URL to the new origin; nothing else hard-codes either. */

export const BASE = '/bhavyaportfolio/'
export const SITE_URL = 'https://mittalbhavya.github.io/bhavyaportfolio/'

export const SITE = {
  title: 'Bhavya Mittal — Full-stack Engineer & Competitive Programmer',
  shortTitle: 'Bhavya Mittal',
  description:
    'Bhavya Mittal builds scalable backends, GenAI products and data platforms with the MERN stack, Python and FastAPI. ICPC Regionals AIR 37, Codeforces Specialist.',
  locale: 'en_IN',
  themeColor: '#05070c',
}

/** Prefix a site-root-relative path with the deployment base. */
export const asset = (path) => BASE + String(path).replace(/^\/+/, '')

/** Absolute URL, for canonical and og: tags. */
export const absolute = (path) => new URL(String(path).replace(/^\/+/, ''), SITE_URL).href

/* Free key from https://web3forms.com. While null, the contact form renders
   disabled with a note rather than silently failing. */
export const WEB3FORMS_KEY = null
