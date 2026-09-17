// Sliding-window limiter kept in function memory. Best effort only: each server
// instance has its own window, which is enough to stop casual abuse of a personal site.

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
  maxKeys?: number;
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterMs: number };

export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 5_000 }: RateLimitOptions) {
  let hits = new Map<string, readonly number[]>();

  return {
    check(key: string): RateLimitResult {
      const time = now();
      const recent = (hits.get(key) ?? []).filter((t) => time - t < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: windowMs - (time - recent[0]) };
      }

      if (hits.size >= maxKeys && !hits.has(key)) hits = new Map();
      hits.set(key, [...recent, time]);
      return { allowed: true };
    },
  };
}
