import { describe, expect, it } from 'vitest';
import { BASE_GRID, faceLayer, gridToRuns, SPRITE_SIZE } from './sprite';

describe('gridToRuns', () => {
  it('merges horizontal runs of the same colour and skips transparent pixels', () => {
    expect(gridToRuns(['.oo.b', 'bb...'])).toEqual([
      { x: 1, y: 0, w: 2, key: 'o' },
      { x: 4, y: 0, w: 1, key: 'b' },
      { x: 0, y: 1, w: 2, key: 'b' },
    ]);
  });

  it('returns nothing for an empty grid', () => {
    expect(gridToRuns([])).toEqual([]);
  });
});

describe('BASE_GRID', () => {
  it('draws a koala nose in the middle of the face', () => {
    const nose = gridToRuns(BASE_GRID).filter((p) => p.key === 'n');
    expect(nose.reduce((sum, p) => sum + p.w, 0)).toBe(10);
  });

  it('is a square of SPRITE_SIZE', () => {
    expect(BASE_GRID).toHaveLength(SPRITE_SIZE);
    BASE_GRID.forEach((row) => expect(row).toHaveLength(SPRITE_SIZE));
  });
});

describe('faceLayer', () => {
  const eyes = (pixels: ReturnType<typeof faceLayer>) => pixels.filter((p) => p.key === 'e');
  const mouth = (pixels: ReturnType<typeof faceLayer>) => pixels.filter((p) => p.key === 'm');

  it('draws two 2x2 eyes when open', () => {
    const face = faceLayer({ mood: 'idle', blink: false, look: { x: 0, y: 0 }, mouthOpen: false });
    const eyeArea = eyes(face).reduce((sum, p) => sum + p.w, 0);
    const shine = face.filter((p) => p.key === 'w').length;
    expect(eyeArea + shine).toBe(8);
  });

  it('flattens eyes to one row when blinking', () => {
    const face = faceLayer({ mood: 'idle', blink: true, look: { x: 0, y: 0 }, mouthOpen: false });
    const rows = new Set(eyes(face).map((p) => p.y));
    expect(rows.size).toBe(1);
    expect(face.some((p) => p.key === 'w')).toBe(false);
  });

  it('shifts eyes horizontally with look direction', () => {
    const left = faceLayer({ mood: 'idle', blink: true, look: { x: -1, y: 0 }, mouthOpen: false });
    const right = faceLayer({ mood: 'idle', blink: true, look: { x: 1, y: 0 }, mouthOpen: false });
    expect(Math.min(...eyes(right).map((p) => p.x)) - Math.min(...eyes(left).map((p) => p.x))).toBe(2);
  });

  it('opens the mouth only while talking', () => {
    const open = faceLayer({ mood: 'talking', blink: false, look: { x: 0, y: 0 }, mouthOpen: true });
    const idle = faceLayer({ mood: 'idle', blink: false, look: { x: 0, y: 0 }, mouthOpen: true });
    expect(mouth(open)).toHaveLength(2);
    expect(mouth(idle)).toHaveLength(1);
  });

  it('keeps every pixel inside the sprite bounds for extreme looks', () => {
    const face = faceLayer({ mood: 'thinking', blink: false, look: { x: 1, y: -1 }, mouthOpen: false });
    face.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x + p.w).toBeLessThanOrEqual(SPRITE_SIZE);
      expect(p.y).toBeGreaterThanOrEqual(0);
    });
  });

  it('never draws face pixels over the nose', () => {
    const nose = gridToRuns(BASE_GRID).filter((p) => p.key === 'n');
    const covers = (a: { x: number; y: number; w: number }, b: { x: number; y: number; w: number }) =>
      a.y === b.y && a.x < b.x + b.w && b.x < a.x + a.w;
    for (const mood of ['idle', 'thinking', 'talking'] as const) {
      for (const x of [-1, 0, 1] as const) {
        const face = faceLayer({ mood, blink: false, look: { x, y: mood === 'thinking' ? -1 : 0 }, mouthOpen: true });
        face.forEach((f) => nose.forEach((n) => expect(covers(f, n)).toBe(false)));
      }
    }
  });
});
