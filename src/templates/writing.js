import { html, each, icons } from './html.js'
import { asset } from '../config.js'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** @param {Array<{slug,title,date,summary,tags,readingTime}>} posts */
export function renderWriting(posts = []) {
  return html`
    <section class="section" id="writing" aria-labelledby="writing-title">
      <div class="container container--narrow">
        <div class="section__header" data-reveal>
          <p class="section__eyebrow">Writing</p>
          <h2 class="section__title" id="writing-title">Notes on what I build</h2>
        </div>

        ${posts.length === 0
          ? html`
              <p class="posts__empty" data-reveal>
                First posts are in progress — on GenAI systems, compilers and
                competitive programming.
              </p>
            `
          : html`
              <ul class="posts" data-reveal-stagger>
                ${each(
                  posts,
                  (post) => html`
                    <li class="post-card">
                      <p class="post-card__meta">
                        <time datetime="${post.date}">${formatDate(post.date)}</time>
                        ${post.readingTime ? html`<span>${post.readingTime} min read</span>` : ''}
                      </p>
                      <h3 class="post-card__title">
                        <a href="${asset(`blog/${post.slug}/`)}">${post.title}</a>
                      </h3>
                      <p class="post-card__summary">${post.summary}</p>
                      ${post.tags?.length
                        ? html`
                            <ul class="post-card__tags">
                              ${each(post.tags, (t) => html`<li class="tag">${t}</li>`)}
                            </ul>
                          `
                        : ''}
                    </li>
                  `
                )}
              </ul>

              <p style="margin-top: var(--space-5)">
                <a class="btn btn--ghost" href="${asset('blog/')}">
                  All posts ${icons.arrowRight}
                </a>
              </p>
            `}
      </div>
    </section>
  `
}
