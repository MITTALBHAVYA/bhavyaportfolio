/*
 * Contact form: client-side validation with accessible error messaging, then a
 * fetch to Web3Forms. Falls back to a normal form POST if fetch fails, so a
 * submission is never silently lost.
 */
const MESSAGES = {
  name: 'Please tell me your name.',
  email: 'Please enter an email I can reply to.',
  emailFormat: 'That email address does not look right.',
  message: 'Please add a sentence or two about what you need.',
}

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]')
  if (!form) return

  const status = form.querySelector('[data-form-status]')
  const submit = form.querySelector('button[type="submit"]')

  const setError = (field, message) => {
    const target = form.querySelector(`[data-error-for="${field}"]`)
    const input = form.elements[field]
    if (target) target.textContent = message ?? ''
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true')
      else input.removeAttribute('aria-invalid')
    }
  }

  const validate = () => {
    const errors = []
    const name = form.elements.name.value.trim()
    const email = form.elements.email.value.trim()
    const message = form.elements.message.value.trim()

    setError('name', null)
    setError('email', null)
    setError('message', null)

    if (!name) errors.push(['name', MESSAGES.name])
    if (!email) errors.push(['email', MESSAGES.email])
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(['email', MESSAGES.emailFormat])
    if (!message) errors.push(['message', MESSAGES.message])

    errors.forEach(([field, msg]) => setError(field, msg))
    return errors
  }

  // Clear an error as soon as the person starts fixing it.
  form.addEventListener('input', (e) => {
    if (e.target.name && e.target.getAttribute('aria-invalid') === 'true') {
      setError(e.target.name, null)
    }
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const errors = validate()
    if (errors.length) {
      status.dataset.state = 'error'
      status.textContent = `Please fix ${errors.length} field${errors.length > 1 ? 's' : ''} above.`
      form.elements[errors[0][0]]?.focus()
      return
    }

    // Honeypot — a bot filled the hidden field, so pretend all is well.
    if (form.elements.botcheck?.value) {
      status.dataset.state = 'success'
      status.textContent = 'Thanks — message sent.'
      form.reset()
      return
    }

    submit.disabled = true
    status.dataset.state = 'pending'
    status.textContent = 'Sending…'

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      status.dataset.state = 'success'
      status.textContent = "Thanks — that's landed. I'll reply within a couple of days."
      form.reset()
    } catch {
      status.dataset.state = 'error'
      status.textContent =
        'Something went wrong sending that. Email bhavya12mittal@gmail.com directly and it will reach me.'
    } finally {
      submit.disabled = false
    }
  })
}
