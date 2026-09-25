import { CONTACT, RESUME, type TimelineEntry } from '@/content/profile';
import { GITHUB_URL, projects } from '@/content/projects';
import { SITE, absolute } from './site';

/** Only the post fields the text formats need, so tests stay light. */
export interface FeedPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readingMinutes: number;
}

const postPath = (slug: string) => `/blog/${encodeURIComponent(slug)}`;
const byNewest = (a: FeedPost, b: FeedPost) => b.date.localeCompare(a.date);

/** One article as markdown, with a header an LLM can cite. */
export function postMarkdown(post: FeedPost): string {
  return [
    `# ${post.title}`,
    '',
    `- Author: ${SITE.author.name}`,
    `- Published: ${post.date}`,
    `- Reading time: ${post.readingMinutes} min`,
    `- Canonical: ${absolute(postPath(post.slug))}`,
    post.excerpt ? `\n> ${post.excerpt}` : '',
    '',
    '---',
    '',
    post.content.trim(),
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function timelineMarkdown(entries: TimelineEntry[]): string {
  return entries
    .map((e) => [`### ${e.title} — ${e.org}`, `${e.place} · ${e.period}`, '', ...e.points.map((p) => `- ${p}`), ''].join('\n'))
    .join('\n');
}

function resumeMarkdown(): string {
  return [
    `# ${RESUME.name}`,
    '',
    `${RESUME.headline}. ${RESUME.location}.`,
    `Email: ${CONTACT.email} · GitHub: ${CONTACT.github} · LinkedIn: ${CONTACT.linkedin}`,
    '',
    RESUME.summary,
    '',
    '## Experience',
    '',
    timelineMarkdown(RESUME.experience),
    '## Education',
    '',
    timelineMarkdown(RESUME.education),
    '## Community',
    '',
    timelineMarkdown(RESUME.community),
    '## Skills',
    '',
    ...RESUME.skills.map((group) => `- ${group.label}: ${group.items.join(', ')}`),
    `- Languages: ${RESUME.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(', ')}`,
    '',
  ].join('\n');
}

function projectsMarkdown(): string {
  return [
    '# Projects',
    '',
    `Selected work by ${SITE.author.name}. More on GitHub: ${GITHUB_URL}`,
    '',
    ...projects.flatMap((p) => [
      `## ${p.title}`,
      `Status: ${p.status} · Tech: ${p.technologies.join(', ')}`,
      '',
      p.description,
      `Link: ${p.link}`,
      '',
    ]),
  ].join('\n');
}

function blogIndexMarkdown(posts: FeedPost[]): string {
  return [
    '# Blog',
    '',
    `Articles by ${SITE.author.name}.`,
    '',
    ...[...posts]
      .sort(byNewest)
      .map((p) => `- [${p.title}](${absolute(postPath(p.slug))}) — ${p.date}${p.excerpt ? `. ${p.excerpt}` : ''}`),
    '',
  ].join('\n');
}

function homeMarkdown(posts: FeedPost[]): string {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${RESUME.headline}. ${RESUME.location}.`,
    '',
    RESUME.summary,
    '',
    '## Pages',
    '',
    `- [Blog](${absolute('/blog')}) — ${posts.length} articles`,
    `- [Projects](${absolute('/projects')})`,
    `- [Resume](${absolute('/resume')})`,
    '',
    '## Contact',
    '',
    `- Email: ${CONTACT.email}`,
    `- GitHub: ${CONTACT.github}`,
    `- LinkedIn: ${CONTACT.linkedin}`,
    '',
  ].join('\n');
}

/** Markdown twin of a non-article page, or null when the name is unknown. */
export function pageMarkdown(page: string, posts: FeedPost[]): string | null {
  switch (page) {
    case 'index':
      return homeMarkdown(posts);
    case 'blog':
      return blogIndexMarkdown(posts);
    case 'projects':
      return projectsMarkdown();
    case 'resume':
      return resumeMarkdown();
    default:
      return null;
  }
}

/** The llms.txt convention: a short map of the site for language models. */
export function buildLlmsTxt(posts: FeedPost[]): string {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${RESUME.headline}. Based in ${RESUME.location}.`,
    'Every page has a markdown twin: add `.md` to its path.',
    '',
    '## Pages',
    '',
    `- [Home](${absolute('/index.md')}): who he is, and a chat that answers questions about his work`,
    `- [Blog](${absolute('/blog.md')}): all articles`,
    `- [Projects](${absolute('/projects.md')}): what he has built`,
    `- [Resume](${absolute('/resume.md')}): experience, education and skills`,
    '',
    '## Articles',
    '',
    ...[...posts]
      .sort(byNewest)
      .map((p) => `- [${p.title}](${absolute(`${postPath(p.slug)}.md`)}): ${p.excerpt || `published ${p.date}`}`),
    '',
    '## Contact',
    '',
    `- Email: ${CONTACT.email}`,
    `- GitHub: ${CONTACT.github}`,
    `- LinkedIn: ${CONTACT.linkedin}`,
    '',
  ].join('\n');
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildFeed(posts: FeedPost[]): string {
  const items = [...posts]
    .sort(byNewest)
    .map((post) => {
      const url = absolute(postPath(post.slug));
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt || post.title)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE.name)}</title>`,
    `    <link>${SITE.url}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${absolute('/feed.xml')}" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
