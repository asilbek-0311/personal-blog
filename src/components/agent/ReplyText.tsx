import Link from 'next/link';
import { resolveReply, splitWords, type LinkCatalog, type LinkCard } from '@/lib/agent/reply';
import styles from './agent.module.css';

interface ReplyTextProps {
  text: string;
  catalog: LinkCatalog;
  streaming: boolean;
}

function Card({ card }: { card: LinkCard }) {
  const body = (
    <>
      <span className={styles.cardKind}>{card.kind === 'article' ? 'Article' : 'Project'}</span>
      <span className={styles.cardTitle}>{card.title}</span>
      <span className={styles.cardMeta}>
        {card.meta}
        <span aria-hidden="true"> {card.external ? '↗' : '→'}</span>
      </span>
    </>
  );

  return card.external ? (
    <a href={card.href} target="_blank" rel="noopener noreferrer" className={`card ${styles.linkCard}`}>
      {body}
    </a>
  ) : (
    <Link href={card.href} className={`card ${styles.linkCard}`}>
      {body}
    </Link>
  );
}

/**
 * Streams a reply word by word: every word is its own span with a short fade,
 * and spans keep stable keys, so only newly arrived words animate.
 */
export default function ReplyText({ text, catalog, streaming }: ReplyTextProps) {
  const { tokens, cards } = resolveReply(text, catalog);
  let index = 0;

  return (
    <>
      <p className={styles.replyText}>
        {tokens.map((token) => {
          if (token.type === 'link') {
            const key = `l${index++}`;
            return token.external ? (
              <a key={key} className={styles.word} href={token.href} target="_blank" rel="noopener noreferrer">
                {token.label}
              </a>
            ) : (
              <Link key={key} className={styles.word} href={token.href}>
                {token.label}
              </Link>
            );
          }
          return splitWords(token.value).map((part) => {
            const key = `w${index++}`;
            return part.trim() ? (
              <span key={key} className={styles.word}>
                {part}
              </span>
            ) : (
              <span key={key}>{part}</span>
            );
          });
        })}
      </p>

      {!streaming && cards.length > 0 && (
        <div className={styles.cards}>
          {cards.map((card) => (
            <Card key={card.href} card={card} />
          ))}
        </div>
      )}
    </>
  );
}
