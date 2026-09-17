export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export const CHAT_LIMITS = {
  maxMessages: 20,
  maxUserChars: 1_000,
  maxModelChars: 6_000,
} as const;

export type ChatRequestResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

const fail = (error: string): ChatRequestResult => ({ ok: false, error });

function parseMessage(value: unknown): ChatMessage | string {
  if (typeof value !== 'object' || value === null) return 'Each message must be an object.';
  const { role, content } = value as Record<string, unknown>;
  if (role !== 'user' && role !== 'model') return 'Message role must be "user" or "model".';
  if (typeof content !== 'string') return 'Message content must be text.';

  const trimmed = content.trim();
  const max = role === 'user' ? CHAT_LIMITS.maxUserChars : CHAT_LIMITS.maxModelChars;
  if (!trimmed) return 'Messages cannot be empty.';
  if (trimmed.length > max) return `Messages must be under ${max} characters.`;
  return { role, content: trimmed };
}

export function parseChatRequest(body: unknown): ChatRequestResult {
  if (typeof body !== 'object' || body === null) return fail('Invalid request body.');
  const { messages } = body as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length === 0) return fail('Send at least one message.');
  if (messages.length > CHAT_LIMITS.maxMessages) return fail('Conversation is too long. Start a new one.');

  const parsed: ChatMessage[] = [];
  for (const raw of messages) {
    const message = parseMessage(raw);
    if (typeof message === 'string') return fail(message);
    parsed.push(message);
  }

  if (parsed[parsed.length - 1].role !== 'user') return fail('The last message must come from you.');
  return { ok: true, messages: parsed };
}
