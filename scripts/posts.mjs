import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = join(import.meta.dirname, '..', 'src', 'content', 'blog')

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Read every post in src/content/blog. Returns newest first, drafts excluded
 * unless `includeDrafts` is set. Each entry carries its raw markdown body so
 * the page builder does not have to read the file twice.
 */
export function loadPosts({ includeDrafts = false } = {}) {
  if (!existsSync(BLOG_DIR)) return []

  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(BLOG_DIR, file), 'utf8'))

      if (!data.title) throw new Error(`${file}: missing "title" in frontmatter`)
      if (!data.date) throw new Error(`${file}: missing "date" in frontmatter`)

      const date =
        data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)

      // ~200 wpm, rounded up, floor of 1.
      const words = content.trim().split(/\s+/).length
      const readingTime = Math.max(1, Math.round(words / 200))

      return {
        slug: data.slug ? slugify(data.slug) : slugify(file.replace(/^\d{4}-\d{2}-/, '').replace(/\.md$/, '')),
        title: data.title,
        date,
        summary: data.summary ?? '',
        tags: data.tags ?? [],
        draft: Boolean(data.draft),
        readingTime,
        body: content,
      }
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}
