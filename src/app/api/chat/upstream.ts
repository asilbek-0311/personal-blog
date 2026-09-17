/** The Gemini SDK reports HTTP failures as an ApiError whose message holds the JSON body. */
export function upstreamStatus(error: unknown): number | null {
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/"code"\s*:\s*(\d{3})/);
  return match ? Number(match[1]) : null;
}
