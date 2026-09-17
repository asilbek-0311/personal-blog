import { buildLlmsTxt } from '@/lib/seo/markdown';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

/** llms.txt: a short map of the site for language models. */
export async function GET() {
  const body = buildLlmsTxt(await getPosts());
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
