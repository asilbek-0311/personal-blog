import { describe, expect, it } from 'vitest';
import { linkify } from './linkify';

describe('linkify', () => {
  it('returns plain text untouched', () => {
    expect(linkify('hello there')).toEqual([{ type: 'text', value: 'hello there' }]);
  });

  it('links site paths and strips trailing punctuation', () => {
    expect(linkify("Read /blog/Let's_talk_about_DATs.")).toEqual([
      { type: 'text', value: 'Read ' },
      { type: 'link', href: "/blog/Let's_talk_about_DATs", label: "/blog/Let's_talk_about_DATs", external: false },
      { type: 'text', value: '.' },
    ]);
  });

  it('links external urls as external', () => {
    expect(linkify('See https://www.devpev.uz/, cool')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', href: 'https://www.devpev.uz/', label: 'https://www.devpev.uz/', external: true },
      { type: 'text', value: ', cool' },
    ]);
  });

  it('does not link paths glued to other words', () => {
    expect(linkify('input/projects file')).toEqual([{ type: 'text', value: 'input/projects file' }]);
  });

  it('ignores non-http schemes', () => {
    expect(linkify('javascript:alert(1)')).toEqual([{ type: 'text', value: 'javascript:alert(1)' }]);
  });
});
