import { describe, expect, it } from 'vitest';
import { thinkingConfigFor } from './thinking';

describe('thinkingConfigFor', () => {
  it('uses thinkingLevel on Gemini 3.x, which rejects thinkingBudget', () => {
    expect(thinkingConfigFor('gemini-3.5-flash-lite')).toEqual({ thinkingLevel: 'low' });
    expect(thinkingConfigFor('gemini-3.8-flash')).toEqual({ thinkingLevel: 'low' });
  });

  it('uses a zero thinking budget on Gemini 2.x', () => {
    expect(thinkingConfigFor('gemini-2.5-flash')).toEqual({ thinkingConfig: { thinkingBudget: 0 } });
  });

  it('sends nothing for unknown model names', () => {
    expect(thinkingConfigFor('some-other-model')).toEqual({});
  });
});
