import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, POST_CHAR_BUDGET } from './prompt';

const base = {
  agentName: 'Bit',
  profile: 'Asilbek is a software engineer.',
  projects: [
    {
      title: 'DevPev',
      description: 'Developer community.',
      technologies: ['Next.js'],
      link: 'https://www.devpev.uz/',
      status: 'Live' as const,
    },
  ],
  posts: [
    { slug: 'MCP', title: 'Model Context Protocol', date: '2025-05-06', excerpt: 'MCP intro', content: 'MCP body text' },
  ],
};

describe('buildSystemPrompt', () => {
  it('includes the profile, projects and every post with its site path', () => {
    const prompt = buildSystemPrompt(base);
    expect(prompt).toContain('You are Bit');
    expect(prompt).toContain('Asilbek is a software engineer.');
    expect(prompt).toContain('DevPev');
    expect(prompt).toContain('https://www.devpev.uz/');
    expect(prompt).toContain('/blog/MCP');
    expect(prompt).toContain('MCP body text');
  });

  it('truncates very long posts to the per-post budget', () => {
    const long = { ...base.posts[0], content: 'x'.repeat(POST_CHAR_BUDGET + 500) };
    const prompt = buildSystemPrompt({ ...base, posts: [long] });
    expect(prompt).toContain('[truncated]');
    expect(prompt).not.toContain('x'.repeat(POST_CHAR_BUDGET + 1));
  });

  it('still produces a usable prompt with no posts', () => {
    expect(buildSystemPrompt({ ...base, posts: [] })).toContain('No articles published yet');
  });
});
