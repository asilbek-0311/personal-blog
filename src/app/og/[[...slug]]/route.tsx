import { ImageResponse } from 'next/og';
import { RESUME } from '@/content/profile';
import { getPostBySlug } from '@/lib/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#f7f2e8';
const INK = '#221f1b';
const ACCENT = '#1f4733';

/** Share image: /og for the site, /og/blog/<slug> for an article. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const segments = (await params).slug ?? [];
  const post =
    segments.length === 2 && segments[0] === 'blog' ? await getPostBySlug(decodeURIComponent(segments[1])) : null;

  const heading = post ? post.title : RESUME.name;
  const sub = post ? post.excerpt : RESUME.headline;
  const tag = post ? `${post.date} · ${post.readingMinutes} min read` : 'asilbek.page';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          color: INK,
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: ACCENT }}>{RESUME.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: post ? 68 : 84, lineHeight: 1.1, letterSpacing: -1 }}>{heading}</div>
          {sub ? (
            <div style={{ display: 'flex', fontSize: 32, color: '#5b5750', maxWidth: 900 }}>{sub}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#5b5750' }}>
          <div style={{ display: 'flex' }}>{tag}</div>
          <div style={{ display: 'flex' }}>www.asilbek.page</div>
        </div>
      </div>
    ),
    size,
  );
}
