import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows up to the limit inside a window, then blocks with retry time', () => {
    let now = 1_000;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000, now: () => now });

    expect(limiter.check('ip').allowed).toBe(true);
    now += 100;
    expect(limiter.check('ip').allowed).toBe(true);
    now += 100;
    expect(limiter.check('ip')).toEqual({ allowed: false, retryAfterMs: 800 });
  });

  it('frees capacity once old hits leave the window', () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 500, now: () => now });

    expect(limiter.check('ip').allowed).toBe(true);
    now = 501;
    expect(limiter.check('ip').allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000, now: () => 0 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('b').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
  });
});
