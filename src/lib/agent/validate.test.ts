import { describe, expect, it } from 'vitest';
import { CHAT_LIMITS, parseChatRequest } from './validate';

describe('parseChatRequest', () => {
  it('accepts a well-formed conversation ending with a user turn', () => {
    const result = parseChatRequest({
      messages: [
        { role: 'user', content: ' hi ' },
        { role: 'model', content: 'hello' },
        { role: 'user', content: 'who is Asilbek?' },
      ],
    });
    expect(result).toEqual({
      ok: true,
      messages: [
        { role: 'user', content: 'hi' },
        { role: 'model', content: 'hello' },
        { role: 'user', content: 'who is Asilbek?' },
      ],
    });
  });

  it.each([
    ['null body', null],
    ['missing messages', {}],
    ['empty messages', { messages: [] }],
    ['bad role', { messages: [{ role: 'system', content: 'x' }] }],
    ['non-string content', { messages: [{ role: 'user', content: 42 }] }],
    ['blank content', { messages: [{ role: 'user', content: '   ' }] }],
    ['last turn from model', { messages: [{ role: 'user', content: 'a' }, { role: 'model', content: 'b' }] }],
  ])('rejects %s', (_label, body) => {
    expect(parseChatRequest(body).ok).toBe(false);
  });

  it('rejects user messages over the character limit', () => {
    const content = 'a'.repeat(CHAT_LIMITS.maxUserChars + 1);
    expect(parseChatRequest({ messages: [{ role: 'user', content }] }).ok).toBe(false);
  });

  it('rejects conversations with too many turns', () => {
    const messages = Array.from({ length: CHAT_LIMITS.maxMessages + 1 }, () => ({ role: 'user', content: 'x' }));
    expect(parseChatRequest({ messages }).ok).toBe(false);
  });
});
