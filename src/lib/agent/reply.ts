import { linkify, type LinkToken } from '@/lib/linkify';

export interface LinkCatalog {
  posts: { slug: string; title: string; readingMinutes: number }[];
  projects: { title: string; link: string; status: string }[];
}

export interface LinkCard {
  kind: 'article' | 'project';
  href: string;
  title: string;
  meta: string;
  external: boolean;
}

export interface ResolvedReply {
  tokens: LinkToken[];
  cards: LinkCard[];
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function findCard(href: string, catalog: LinkCatalog): LinkCard | null {
  if (href.startsWith('/blog/')) {
    const slug = safeDecode(href.slice('/blog/'.length));
    const post = catalog.posts.find((p) => p.slug === slug);
    return post
      ? { kind: 'article', href, title: post.title, meta: `${post.readingMinutes} min read`, external: false }
      : null;
  }
  const project = catalog.projects.find((p) => p.link.replace(/\/$/, '') === href.replace(/\/$/, ''));
  return project ? { kind: 'project', href, title: project.title, meta: project.status, external: true } : null;
}

/** Turns raw paths in a reply into titled links, plus one card per known article/project. */
export function resolveReply(text: string, catalog: LinkCatalog): ResolvedReply {
  const cards: LinkCard[] = [];
  const tokens = linkify(text).map((token): LinkToken => {
    if (token.type === 'text') return token;
    const card = findCard(token.href, catalog);
    if (!card) return token;
    if (!cards.some((c) => c.href === card.href)) cards.push(card);
    return { ...token, label: card.title };
  });
  return { tokens, cards };
}

/** Splits into words and whitespace runs; joining the parts restores the input. */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}
