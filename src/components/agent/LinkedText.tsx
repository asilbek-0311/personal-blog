import Link from 'next/link';
import { linkify } from '@/lib/linkify';

export default function LinkedText({ text }: { text: string }) {
  return (
    <>
      {linkify(text).map((token, i) => {
        if (token.type === 'text') return <span key={i}>{token.value}</span>;
        if (token.external) {
          return (
            <a key={i} href={token.href} target="_blank" rel="noopener noreferrer">
              {token.label}
            </a>
          );
        }
        return (
          <Link key={i} href={token.href}>
            {token.label}
          </Link>
        );
      })}
    </>
  );
}
