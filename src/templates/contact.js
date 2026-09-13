import { html, each, icons } from './html.js'
import { profile } from '../content/profile.js'
import { WEB3FORMS_KEY } from '../config.js'

/*
 * Decorative starfield around the quote. Positions are fixed rather than random
 * so the constellation is the same every visit, and kept clear of the centre
 * where the text sits. [left%, top%, size px, gold?]
 */
const QUOTE_STARS = [
  [6, 18, 2, false], [13, 62, 1.5, false], [19, 34, 3, true], [26, 82, 1.5, false],
  [31, 11, 2, false], [38, 90, 2.5, true], [44, 6, 1.5, false], [52, 94, 2, false],
  [59, 9, 3, true], [66, 86, 1.5, false], [72, 28, 2, false], [79, 70, 2.5, true],
  [85, 40, 1.5, false], [91, 76, 2, false], [95, 22, 3, true], [3, 46, 1.5, false],
]

export function renderQuote() {
  const { quote } = profile
  return html`
    <section class="section quote-section" aria-label="Quote">
      <figure class="quote" data-reveal>
        <div class="quote__stars" aria-hidden="true">
          ${each(
            QUOTE_STARS,
            ([x, y, size, gold], i) => html`
              <span
                class="quote__star${gold ? ' quote__star--gold' : ''}"
                style="left:${x}%;top:${y}%;--star-size:${size}px;--star-delay:${(i * 0.37).toFixed(
                  2
                )}s"
              ></span>
            `
          )}
        </div>

        <p class="quote__mark" aria-hidden="true">&ldquo;</p>
        <blockquote class="quote__text">${quote.text}</blockquote>
        <figcaption class="quote__attribution">
          <span class="quote__author">${quote.author}</span>, ${quote.role}
        </figcaption>
      </figure>
    </section>
  `
}

export function renderContact() {
  const { links, booking } = profile

  return html`
    <section class="section" id="contact" aria-labelledby="contact-title">
      <div class="container">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">Contact</p>
          <h2 class="section__title" id="contact-title">Let's build something</h2>
        </div>

        <div class="contact__grid">
          <div class="contact__intro" data-reveal>
            <p>
              Open to full-time engineering roles, and available for select
              freelance work. Tell me what you're building.
            </p>

            <div class="contact__direct">
              <a class="contact__email" href="mailto:${links.email}">${links.email}</a>

              ${booking
                ? html`
                    <a class="btn btn--secondary" href="${booking}" target="_blank" rel="noopener noreferrer">
                      ${icons.calendar} Book a 20-min call
                    </a>
                  `
                : ''}

              <ul class="social-links">
                <li>
                  <a class="icon-link" href="${links.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                    ${icons.github}
                  </a>
                </li>
                <li>
                  <a class="icon-link" href="${links.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                    ${icons.linkedin}
                  </a>
                </li>
                <li>
                  <a class="icon-link" href="${links.twitter}" target="_blank" rel="noopener noreferrer" aria-label="Twitter profile">
                    ${icons.twitter}
                  </a>
                </li>
                <li>
                  <a class="icon-link" href="mailto:${links.email}" aria-label="Send an email">
                    ${icons.mail}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <form
            class="contact-form"
            data-contact-form
            action="https://api.web3forms.com/submit"
            method="POST"
            novalidate
            data-reveal
          >
            ${WEB3FORMS_KEY
              ? html`<input type="hidden" name="access_key" value="${WEB3FORMS_KEY}" />`
              : html`
                  <p class="contact-form__notice">
                    This form isn't connected yet. Email works in the meantime —
                    or add a free Web3Forms key to switch it on.
                  </p>
                `}
            <input type="hidden" name="subject" value="New enquiry from your portfolio" />

            <div class="field field--row">
              <div class="field">
                <label class="field__label" for="cf-name">
                  Name <span class="field__required" aria-hidden="true">*</span>
                </label>
                <input class="field__control" id="cf-name" name="name" type="text" required
                  autocomplete="name" aria-describedby="cf-name-error" />
                <p class="field__error" id="cf-name-error" data-error-for="name"></p>
              </div>

              <div class="field">
                <label class="field__label" for="cf-email">
                  Email <span class="field__required" aria-hidden="true">*</span>
                </label>
                <input class="field__control" id="cf-email" name="email" type="email" required
                  autocomplete="email" aria-describedby="cf-email-error" />
                <p class="field__error" id="cf-email-error" data-error-for="email"></p>
              </div>
            </div>

            <div class="field">
              <label class="field__label" for="cf-type">What do you need?</label>
              <select class="field__control" id="cf-type" name="project_type">
                <option>Full-time role</option>
                <option>Backend / API project</option>
                <option>GenAI / LLM product</option>
                <option>Full-stack web app</option>
                <option>Something else</option>
              </select>
            </div>

            <div class="field">
              <label class="field__label" for="cf-message">
                Details <span class="field__required" aria-hidden="true">*</span>
              </label>
              <textarea class="field__control" id="cf-message" name="message" required
                aria-describedby="cf-message-error"
                placeholder="A sentence or two about the work, timeline and budget."></textarea>
              <p class="field__error" id="cf-message-error" data-error-for="message"></p>
            </div>

            <!-- Honeypot: hidden from people, tempting to bots. -->
            <div class="field--honeypot" aria-hidden="true">
              <label for="cf-company">Company (leave blank)</label>
              <input id="cf-company" name="botcheck" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div class="contact-form__footer">
              <p class="form-status" data-form-status role="status" aria-live="polite"></p>
              <button class="btn btn--primary" type="submit" ${WEB3FORMS_KEY ? '' : 'disabled'}>
                Send enquiry ${icons.arrowRight}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `
}
