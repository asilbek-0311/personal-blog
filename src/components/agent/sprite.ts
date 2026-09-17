// Pixel data for the home-page character. Pure data + geometry, no React.

export const SPRITE_SIZE = 16;

export type SpriteMood = 'idle' | 'thinking' | 'talking';

/** Palette keys. Colours live in tokens.css so both themes can tune them. */
export type PixelKey = 'o' | 'b' | 'l' | 'n' | 'e' | 'w' | 'c' | 'm';

export interface PixelRun {
  x: number;
  y: number;
  w: number;
  key: PixelKey;
}

export interface Look {
  x: -1 | 0 | 1;
  y: -1 | 0;
}

export interface FaceState {
  mood: SpriteMood;
  blink: boolean;
  look: Look;
  mouthOpen: boolean;
}

// Koala. o outline · b fur · l inner ear / belly · n nose
export const BASE_GRID: readonly string[] = [
  '..ooo......ooo..',
  '.obbbo....obbbo.',
  'oblllbooooblllbo',
  'oblllbbbbbblllbo',
  'obllbbbbbbbbllbo',
  '.obbbbbbbbbbbbo.',
  '.obbbbbbbbbbbbo.',
  '.obbbbbbbbbbbbo.',
  '.obbbbnnnnbbbbo.',
  '.obbbbnnnnbbbbo.',
  '.obbbbbnnbbbbbo.',
  '..obbbbbbbbbbo..',
  '...obbllllbbo...',
  '...obllllllbo...',
  '....obbbbbbo....',
  '....oo....oo....',
];

const EYE_ROW = 6;
const LEFT_EYE_COL = 4;
const RIGHT_EYE_COL = 10;
const CHEEK_ROW = 8;
const MOUTH_ROW = 11;

export function gridToRuns(grid: readonly string[]): PixelRun[] {
  return grid.flatMap((row, y) => {
    const runs: PixelRun[] = [];
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === key) end += 1;
      if (key !== '.') runs.push({ x, y, w: end - x, key: key as PixelKey });
      x = end;
    }
    return runs;
  });
}

function eye(col: number, row: number, blink: boolean): PixelRun[] {
  if (blink) return [{ x: col, y: row + 1, w: 2, key: 'e' }];
  return [
    { x: col, y: row, w: 1, key: 'e' },
    { x: col + 1, y: row, w: 1, key: 'w' },
    { x: col, y: row + 1, w: 2, key: 'e' },
  ];
}

function mouth(mood: SpriteMood, mouthOpen: boolean): PixelRun[] {
  if (mood === 'thinking') return [{ x: 8, y: MOUTH_ROW, w: 1, key: 'm' }];
  if (mood === 'talking' && mouthOpen) {
    return [
      { x: 7, y: MOUTH_ROW, w: 2, key: 'm' },
      { x: 7, y: MOUTH_ROW + 1, w: 2, key: 'm' },
    ];
  }
  return [{ x: 7, y: MOUTH_ROW, w: 2, key: 'm' }];
}

export function faceLayer({ mood, blink, look, mouthOpen }: FaceState): PixelRun[] {
  const row = EYE_ROW + look.y;
  return [
    ...eye(LEFT_EYE_COL + look.x, row, blink),
    ...eye(RIGHT_EYE_COL + look.x, row, blink),
    { x: 3, y: CHEEK_ROW, w: 1, key: 'c' },
    { x: 12, y: CHEEK_ROW, w: 1, key: 'c' },
    ...mouth(mood, mouthOpen),
  ];
}
