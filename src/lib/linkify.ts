export type LinkToken =
  | { type: 'text'; value: string }
  | { type: 'link'; href: string; label: string; external: boolean };

// Absolute http(s) urls, or site paths (/blog, /projects) that start a word.
const LINK_PATTERN = /(?<=^|[\s(])(https?:\/\/[^\s<>()]+|\/(?:blog|projects)(?:\/[\w\-'%.]+)?)/g;
const TRAILING_PUNCTUATION = /[.,;:!?'"]+$/;

export function linkify(text: string): LinkToken[] {
  const tokens: LinkToken[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    const href = match[0].replace(TRAILING_PUNCTUATION, '');
    if (start > cursor) tokens.push({ type: 'text', value: text.slice(cursor, start) });
    tokens.push({ type: 'link', href, label: href, external: href.startsWith('http') });
    cursor = start + href.length;
  }

  if (cursor < text.length) tokens.push({ type: 'text', value: text.slice(cursor) });
  return tokens;
}
