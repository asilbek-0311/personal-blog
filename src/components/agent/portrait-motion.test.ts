import { describe, expect, it } from 'vitest';
import { approach, pointerToLook, THINKING_LOOK } from './portrait-motion';

const rect = { left: 100, top: 100, width: 200, height: 200 };

describe('pointerToLook', () => {
  it('is centred when the pointer is on the portrait', () => {
    expect(pointerToLook(200, 200, rect)).toEqual({ x: 0, y: 0 });
  });

  it('points toward the pointer, scaled by distance', () => {
    const look = pointerToLook(300, 150, rect);
    expect(look.x).toBeGreaterThan(0);
    expect(look.y).toBeLessThan(0);
  });

  it('clamps far-away pointers to the -1..1 range', () => {
    expect(pointerToLook(-5000, 9000, rect)).toEqual({ x: -1, y: 1 });
  });

  it('handles a zero-size rect without NaN', () => {
    const look = pointerToLook(10, 10, { left: 0, top: 0, width: 0, height: 0 });
    expect(Number.isNaN(look.x) || Number.isNaN(look.y)).toBe(false);
  });
});

describe('approach', () => {
  it('moves part of the way toward the target', () => {
    expect(approach({ x: 0, y: 0 }, { x: 1, y: -1 }, 0.25)).toEqual({ x: 0.25, y: -0.25 });
  });

  it('snaps when already very close, so the loop can go idle', () => {
    expect(approach({ x: 0.9999, y: 0 }, { x: 1, y: 0 }, 0.1)).toEqual({ x: 1, y: 0 });
  });
});

describe('THINKING_LOOK', () => {
  it('looks up and to the side', () => {
    expect(THINKING_LOOK.y).toBeLessThan(0);
    expect(THINKING_LOOK.x).not.toBe(0);
  });
});
