import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const WORDS_PER_MINUTE = 220;

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  readingMinutes: number;
}

function toPost(slug: string, raw: string): Post | null {
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || typeof data.date !== 'string') {
    console.warn(`[posts] Skipping "${slug}": frontmatter needs string "title" and "date".`);
    return null;
  }

  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt.trim() : '',
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    content,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

export async function getPosts(): Promise<Post[]> {
  let files: string[];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch (error) {
    console.error(`[posts] Cannot read ${POSTS_DIR}`, error);
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => toPost(file.replace(/\.md$/, ''), await fs.readFile(path.join(POSTS_DIR, file), 'utf8'))),
  );

  return posts.filter((post): post is Post => post !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Slugs come from the URL: only allow plain file names inside the posts folder.
  if (slug.includes('/') || slug.includes('\\') || slug.startsWith('.')) return null;

  try {
    return toPost(slug, await fs.readFile(path.join(POSTS_DIR, `${slug}.md`), 'utf8'));
  } catch {
    return null;
  }
}

export function formatDate(date: string, month: 'long' | 'short' = 'long'): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric', timeZone: 'UTC' });
}
