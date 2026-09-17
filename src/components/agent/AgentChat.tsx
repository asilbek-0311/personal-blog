'use client';

import { useEffect, useRef, useState } from 'react';
import { AGENT_NAME } from '@/content/profile';
import { CHAT_LIMITS } from '@/lib/agent/validate';
import LinkedText from './LinkedText';
import PixelSprite from './PixelSprite';
import { useAgentChat, type ChatStatus } from './useAgentChat';
import styles from './agent.module.css';

const GREETING = `Hi, I'm ${AGENT_NAME}. I've read everything Asilbek wrote. Ask me anything.`;

const STATUS_LINES: Record<ChatStatus, string> = {
  idle: 'Anything else?',
  thinking: 'Thinking…',
  talking: 'Here you go.',
};

const SUGGESTIONS = ['Who is Asilbek?', 'Latest article', 'Best project'];

export default function AgentChat() {
  const { messages, status, error, send, reset } = useAgentChat();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLOListElement>(null);

  const busy = status !== 'idle';
  const hasConversation = messages.length > 0;

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const submit = (text: string) => {
    if (busy || !text.trim()) return;
    void send(text);
    setDraft('');
    inputRef.current?.focus();
  };

  return (
    <section className={styles.agent} aria-labelledby="agent-heading">
      <h2 id="agent-heading" className="visually-hidden">
        Chat with {AGENT_NAME}
      </h2>

      <div className={styles.stage}>
        <p className={styles.bubble} aria-hidden={hasConversation}>
          {hasConversation ? STATUS_LINES[status] : GREETING}
        </p>
        <PixelSprite mood={status} />
      </div>

      {hasConversation && (
        <ol ref={logRef} className={styles.log} aria-live="polite" aria-busy={busy}>
          {messages.map((m, i) => (
            <li key={i} className={m.role === 'user' ? styles.fromVisitor : styles.fromAgent}>
              <span className="meta">{m.role === 'user' ? 'You' : AGENT_NAME}</span>
              <p>
                <LinkedText text={m.content} />
              </p>
            </li>
          ))}
          {status === 'thinking' && (
            <li className={styles.fromAgent}>
              <span className="meta">{AGENT_NAME}</span>
              <p className={styles.thinking} aria-label="thinking">
                <span />
                <span />
                <span />
              </p>
            </li>
          )}
        </ol>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <label htmlFor="agent-input" className="visually-hidden">
          Message {AGENT_NAME}
        </label>
        <textarea
          id="agent-input"
          ref={inputRef}
          className={styles.input}
          value={draft}
          rows={1}
          maxLength={CHAT_LIMITS.maxUserChars}
          placeholder={`Ask ${AGENT_NAME} anything…`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit(draft);
            }
          }}
        />
        <button type="submit" className="btn" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>

      {hasConversation ? (
        <button type="button" className={styles.textBtn} onClick={reset}>
          Start over
        </button>
      ) : (
        <ul className={styles.suggestions} aria-label="Suggested questions">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button type="button" className={styles.textBtn} onClick={() => submit(s)} disabled={busy}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
