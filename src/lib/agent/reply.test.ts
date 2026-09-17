import { describe, expect, it } from 'vitest';
import { resolveReply, splitWords, type LinkCatalog } from './reply';

const catalog: LinkCatalog = {
  posts: [{ slug: 'MCP', title: 'Model Context Protocol - MCP', readingMinutes: 2 }],
  projects: [{ title: 'DevPev Community', link: 'https://www.devpev.uz/', status: 'In development' }],
};

describe('resolveReply', () => {
  it('labels known article paths with their title and adds a card', () => {
    const { tokens, cards } = resolveReply('Read /blog/MCP for more.', catalog);
    expect(tokens).toEqual([
      { type: 'text', value: 'Read ' },
      { type: 'link', href: '/blog/MCP', label: 'Model Context Protocol - MCP', external: false },
      { type: 'text', value: ' for more.' },
    ]);
    expect(cards).toEqual([
      { kind: 'article', href: '/blog/MCP', title: 'Model Context Protocol - MCP', meta: '2 min read', external: false },
    ]);
  });

  it('labels known project urls and adds a project card', () => {
    const { tokens, cards } = resolveReply('See https://www.devpev.uz/', catalog);
    expect(tokens[1]).toEqual({ type: 'link', href: 'https://www.devpev.uz/', label: 'DevPev Community', external: true });
    expect(cards).toEqual([
      { kind: 'project', href: 'https://www.devpev.uz/', title: 'DevPev Community', meta: 'In development', external: true },
    ]);
  });

  it('keeps unknown links as plain links without cards', () => {
    const { tokens, cards } = resolveReply('Go to /projects or https://example.com', catalog);
    expect(tokens.filter((t) => t.type === 'link')).toHaveLength(2);
    expect(cards).toEqual([]);
  });

  it('adds each card only once', () => {
    expect(resolveReply('/blog/MCP and again /blog/MCP', catalog).cards).toHaveLength(1);
  });

  it('matches encoded article slugs', () => {
    const withQuote: LinkCatalog = { ...catalog, posts: [{ slug: "Let's_talk", title: 'DATs', readingMinutes: 3 }] };
    expect(resolveReply('/blog/Let%27s_talk', withQuote).cards[0]?.title).toBe('DATs');
  });
});

describe('splitWords', () => {
  it('keeps whitespace so text can be rejoined exactly', () => {
    const parts = splitWords('Hi  there\nfriend');
    expect(parts.join('')).toBe('Hi  there\nfriend');
    expect(parts.filter((p) => p.trim())).toEqual(['Hi', 'there', 'friend']);
  });

  it('returns nothing for empty text', () => {
    expect(splitWords('')).toEqual([]);
  });
});
