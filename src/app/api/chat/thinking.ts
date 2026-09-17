/**
 * Keep replies fast by asking for as little internal "thinking" as the model allows.
 * Gemini 3.x takes `thinkingLevel` and rejects `thinkingBudget`; 2.x is the other way round.
 */
export function thinkingConfigFor(model: string): Record<string, unknown> {
  if (/^gemini-3/.test(model)) return { thinkingLevel: 'low' };
  if (/^gemini-2/.test(model)) return { thinkingConfig: { thinkingBudget: 0 } };
  return {};
}
