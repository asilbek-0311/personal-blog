import { describe, expect, it } from 'vitest';
import { buildFeed, buildLlmsTxt, escapeXml, pageMarkdown, postMarkdown } from './markdown';

const posts = [
  {
    slug: 'MCP',
    title: 'Model Context Protocol - MCP',
    date: '2025-05-06',
    excerpt: 'Brief explaination on MCP',
    content: 'MCP body text',
    readingMinutes: 2,
  },
  {
    slug: "Let's_talk",
    title: 'DATs & treasuries',
    date: '2025-11-10',
    excerpt: 'Research on DATs',
    content: 'DAT body',
    readingMinutes: 3,
  },
];

describe('postMarkdown', () => {
  it('puts a title, date and canonical link above the body', () => {
    const md = postMarkdown(posts[0]);
    expect(md).toContain('# Model Context Protocol - MCP');
    expect(md).toContain('2025-05-06');
    expect(md).toContain('https://www.asilbek.page/blog/MCP');
    expect(md.trimEnd().endsWith('MCP body text')).toBe(true);
  });

  it('keeps apostrophes readable in the canonical link, and encodes spaces', () => {
    expect(postMarkdown(posts[1])).toContain("/blog/Let's_talk");
    expect(postMarkdown({ ...posts[1], slug: 'two words' })).toContain('/blog/two%20words');
  });
});

describe('buildLlmsTxt', () => {
  const llms = buildLlmsTxt(posts);

  it('leads with the site name and a summary', () => {
    expect(llms.startsWith('# Asilbek Abdullaev')).toBe(true);
    expect(llms).toContain('> ');
  });

  it('lists every article with its markdown link, newest first', () => {
    const mcp = llms.indexOf('/blog/MCP.md');
    const dats = llms.indexOf("/blog/Let's_talk.md");
    expect(dats).toBeGreaterThan(-1);
    expect(mcp).toBeGreaterThan(dats);
  });

  it('points at the other pages too', () => {
    ['/projects.md', '/resume.md', '/index.md'].forEach((path) => expect(llms).toContain(path));
  });
});

describe('pageMarkdown', () => {
  it('renders the resume as headed sections', () => {
    const md = pageMarkdown('resume', posts);
    expect(md).toContain('# Asilbek Abdullaev');
    expect(md).toContain('## Experience');
    expect(md).toContain('Pixeel');
  });

  it('renders the blog index as a list of links', () => {
    expect(pageMarkdown('blog', posts)).toContain('- [Model Context Protocol - MCP](https://www.asilbek.page/blog/MCP)');
  });

  it('renders projects with their links', () => {
    expect(pageMarkdown('projects', posts)).toContain('https://www.devpev.uz/');
  });

  it('returns null for an unknown page', () => {
    expect(pageMarkdown('nope', posts)).toBeNull();
  });
});

describe('escapeXml', () => {
  it('escapes the five XML characters', () => {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe('a &amp; b &lt; c &gt; d &quot; e &apos; f');
  });
});

describe('buildFeed', () => {
  const xml = buildFeed(posts);

  it('is a valid-looking RSS document with one item per post', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).toContain('<title>DATs &amp; treasuries</title>');
  });

  it('uses RFC-822 dates', () => {
    expect(xml).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4}/);
  });
});
