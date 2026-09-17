import { buildFeed } from '@/lib/seo/markdown';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(buildFeed(await getPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
