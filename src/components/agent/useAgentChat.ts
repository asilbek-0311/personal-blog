'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_LIMITS, type ChatMessage } from '@/lib/agent/validate';

export type ChatStatus = 'idle' | 'thinking' | 'talking';

// Keep the request under the server limit, always starting on a user turn.
function historyForRequest(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-CHAT_LIMITS.maxMessages);
  const firstUser = recent.findIndex((m) => m.role === 'user');
  return firstUser <= 0 ? recent : recent.slice(firstUser);
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? 'Something went wrong.';
  } catch {
    return 'Something went wrong.';
  }
}

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || status !== 'idle') return;
      if (content.length > CHAT_LIMITS.maxUserChars) {
        setError(`Keep it under ${CHAT_LIMITS.maxUserChars} characters, please.`);
        return;
      }

      const history = [...messages, { role: 'user' as const, content }];
      setMessages(history);
      setError(null);
      setStatus('thinking');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForRequest(history) }),
          signal: controller.signal,
        });
        if (!response.ok || !response.body) throw new Error(await readError(response));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let reply = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          const snapshot = reply;
          setStatus('talking');
          setMessages([...history, { role: 'model', content: snapshot }]);
        }

        if (!reply.trim()) throw new Error('I blanked out. Try asking another way?');
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('[chat]', err);
        setMessages((current) => (current.at(-1)?.role === 'model' ? current : history.slice(0, -1)));
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        if (!controller.signal.aborted) setStatus('idle');
      }
    },
    [messages, status],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStatus('idle');
  }, []);

  return { messages, status, error, send, reset };
}
