'use client';

import { useRef, useState } from 'react';
import { AGENT_NAME } from '@/content/profile';
import { resolveReply, type LinkCatalog } from '@/lib/agent/reply';
import { CHAT_LIMITS, type ChatMessage } from '@/lib/agent/validate';
import Portrait from './Portrait';
import ReplyText from './ReplyText';
import { useAgentChat, type ChatStatus } from './useAgentChat';
import { useVoiceChat } from './useVoiceChat';
import styles from './agent.module.css';

const STATUS_LINES: Partial<Record<ChatStatus, string>> = {
  thinking: 'Thinking…',
  talking: 'Here you go',
};

const VOICE_LINES: Record<string, string> = {
  connecting: 'Connecting…',
  listening: 'Listening…',
  speaking: 'Talking…',
};

function MicIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {on ? (
        <path d="M6 6h12v12H6z" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const STARTERS = ['Who is Asilbek?', 'Latest article', 'Best project'];
const FOLLOW_UPS = ['Tell me more', 'Latest article', 'Best project', 'Who is Asilbek?', 'How to contact him?'];

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Reply text with raw paths swapped for readable titles. */
function plainReply(text: string, catalog: LinkCatalog): string {
  return resolveReply(text, catalog)
    .tokens.map((t) => (t.type === 'text' ? t.value : t.label))
    .join('');
}

/** Splits the transcript into the latest exchange and everything before it. */
function latestExchange(messages: ChatMessage[]) {
  const lastUser = messages.findLastIndex((m) => m.role === 'user');
  if (lastUser === -1) return { earlier: [], question: null, reply: null };
  const next = messages[lastUser + 1];
  return {
    earlier: messages.slice(0, lastUser),
    question: messages[lastUser].content,
    reply: next?.role === 'model' ? next.content : null,
  };
}

export default function AgentChat({ catalog }: { catalog: LinkCatalog }) {
  const { messages, status, error, send, reset } = useAgentChat();
  const voice = useVoiceChat();
  const [draft, setDraft] = useState('');
  const [showEarlier, setShowEarlier] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const busy = status !== 'idle';
  const voiceOn = voice.status !== 'off';
  // The drawing follows whichever conversation is active.
  const mood = voiceOn
    ? voice.status === 'speaking'
      ? 'talking'
      : voice.status === 'connecting'
        ? 'thinking'
        : 'idle'
    : status;
  const bubbleLine = voiceOn ? VOICE_LINES[voice.status] : STATUS_LINES[status];
  const { earlier, question, reply } = latestExchange(messages);
  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.content));
  const followUps = FOLLOW_UPS.filter((f) => !asked.has(f) || f === 'Tell me more').slice(0, 3);

  const submit = (text: string) => {
    if (busy || !text.trim()) return;
    void send(text);
    setDraft('');
    inputRef.current?.focus();
  };

  const startOver = () => {
    reset();
    setShowEarlier(false);
  };

  return (
    <section className={styles.agent} aria-labelledby="agent-heading">
      <h2 id="agent-heading" className="visually-hidden">
        Chat with {AGENT_NAME}
      </h2>

      <div className={styles.stage} data-voice={voiceOn}>
        {!voiceOn && (
          <p key={bubbleLine} className={styles.bubble} data-visible={Boolean(bubbleLine)} aria-hidden="true">
            {bubbleLine ?? ''}
          </p>
        )}
        <div className={styles.portraitWrap} data-listening={voice.status === 'listening'}>
          <Portrait mood={mood} />
        </div>
      </div>

      {voiceOn && (
        <div className={styles.voicePanel}>
          <p className={styles.voiceStatus} aria-live="polite">
            {voice.status === 'speaking' ? (
              <span className={styles.bars} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            ) : null}
            {VOICE_LINES[voice.status]}
          </p>
          <p className={styles.voiceHint}>{voice.status === 'listening' ? 'Just talk — I can hear you.' : ''}</p>
          <button type="button" className="btn btn-outline" onClick={voice.stop}>
            End conversation
          </button>
        </div>
      )}

      {!voiceOn && earlier.length > 0 && (
        <div className={styles.earlier}>
          <button
            type="button"
            className={styles.textBtn}
            aria-expanded={showEarlier}
            onClick={() => setShowEarlier((v) => !v)}
          >
            {showEarlier ? 'Hide earlier messages' : `Show earlier messages (${earlier.length})`}
          </button>
          <div className={styles.collapse} data-open={showEarlier}>
            <ol className={styles.history} inert={!showEarlier}>
              {earlier.map((m, i) => (
                <li key={i} className={m.role === 'user' ? styles.historyUser : styles.historyAgent}>
                  {m.role === 'user' ? m.content : plainReply(m.content, catalog)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {!voiceOn && question && (
        <div className={styles.exchange} aria-live="polite" aria-busy={busy}>
          <p key={question} className={styles.question}>
            {question}
          </p>

          <article className={`card ${styles.replyCard}`}>
            {reply ? (
              <ReplyText text={reply} catalog={catalog} streaming={status === 'talking'} />
            ) : (
              <p className={styles.thinking} aria-label="thinking">
                <span />
                <span />
                <span />
              </p>
            )}
          </article>
        </div>
      )}

      {(error || voice.error) && (
        <p className={styles.error} role="alert">
          {error ?? voice.error}
        </p>
      )}

      {!voiceOn && (
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
          placeholder="Ask me anything about Asilbek…"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit(draft);
            }
          }}
        />
        <button
          type="button"
          className={`${styles.send} ${styles.mic}`}
          data-on={voiceOn}
          onClick={voiceOn ? voice.stop : () => void voice.start()}
          aria-pressed={voiceOn}
          aria-label={voiceOn ? 'Stop talking' : 'Talk out loud'}
          title={voiceOn ? 'Stop talking' : 'Talk out loud'}
        >
          <MicIcon on={voiceOn} />
        </button>
        <button type="submit" className={styles.send} disabled={busy || !draft.trim()} aria-label="Send">
          <SendIcon />
        </button>
      </form>
      )}

      {!voiceOn && (
      <div className={styles.chips}>
        {(question ? (busy ? [] : followUps) : STARTERS).map((s) => (
          <button key={s} type="button" className={styles.chip} onClick={() => submit(s)} disabled={busy}>
            {s}
          </button>
        ))}
        {question && !busy && (
          <button type="button" className={`${styles.chip} ${styles.chipGhost}`} onClick={startOver}>
            Start over
          </button>
        )}
      </div>
      )}
    </section>
  );
}
