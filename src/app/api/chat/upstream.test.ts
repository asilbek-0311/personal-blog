import { describe, expect, it } from 'vitest';
import { upstreamStatus } from './upstream';

describe('upstreamStatus', () => {
  it('reads the code out of a Gemini quota error', () => {
    const error = new Error(
      '{"error":{"code":429,"message":"You exceeded your current quota","status":"RESOURCE_EXHAUSTED"}}',
    );
    expect(upstreamStatus(error)).toBe(429);
  });

  it('reads the code out of an auth error', () => {
    expect(upstreamStatus(new Error('{"error":{"code":403,"message":"forbidden"}}'))).toBe(403);
  });

  it('returns null when there is no status to find', () => {
    expect(upstreamStatus(new Error('socket hang up'))).toBeNull();
    expect(upstreamStatus('boom')).toBeNull();
  });
});
