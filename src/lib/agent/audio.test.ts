import { describe, expect, it } from 'vitest';
import { base64ToPcm16, bytesToBase64, downsample, floatToPcm16, pcm16ToFloat32 } from './audio';

describe('downsample', () => {
  it('returns the input untouched when the rate already matches', () => {
    const input = Float32Array.from([0.1, 0.2, 0.3]);
    expect(downsample(input, 16_000, 16_000)).toBe(input);
  });

  it('takes roughly every third frame going from 48k to 16k', () => {
    const input = Float32Array.from({ length: 9 }, (_, i) => i / 10);
    const out = downsample(input, 48_000, 16_000);
    expect(out).toHaveLength(3);
    expect(Array.from(out)).toEqual([0, 0.30000001192092896, 0.6000000238418579]);
  });

  it('never upsamples', () => {
    const input = Float32Array.from([0.5, 0.5]);
    expect(downsample(input, 8_000, 16_000)).toBe(input);
  });
});

describe('floatToPcm16', () => {
  it('maps the float range onto 16-bit ints', () => {
    const out = floatToPcm16(Float32Array.from([0, 1, -1]));
    expect(Array.from(out)).toEqual([0, 32767, -32768]);
  });

  it('clamps values beyond the range', () => {
    const out = floatToPcm16(Float32Array.from([2, -2]));
    expect(Array.from(out)).toEqual([32767, -32768]);
  });
});

describe('pcm16ToFloat32', () => {
  it('round-trips within 16-bit precision', () => {
    const original = Float32Array.from([0, 0.5, -0.5]);
    const back = pcm16ToFloat32(floatToPcm16(original));
    back.forEach((value, i) => expect(value).toBeCloseTo(original[i], 4));
  });
});

describe('bytesToBase64 / base64ToPcm16', () => {
  it('round-trips audio samples', () => {
    const samples = Int16Array.from([0, 1234, -4321, 32767]);
    const base64 = bytesToBase64(new Uint8Array(samples.buffer));
    expect(Array.from(base64ToPcm16(base64))).toEqual(Array.from(samples));
  });

  it('encodes empty input to an empty string', () => {
    expect(bytesToBase64(new Uint8Array())).toBe('');
  });
});
