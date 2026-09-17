import { describe, expect, it } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('prefers a saved choice over the OS setting', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to the OS setting when nothing valid is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('purple', false)).toBe('light');
  });
});
