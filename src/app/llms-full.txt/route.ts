import { buildLlmsTxt, pageMarkdown, postMarkdown } from '@/lib/seo/markdown';
import { getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

/** llms-full.txt: the whole site as one document, for models that want it all. */
export async function GET() {
  const posts = await getPosts();
  const body = [
    buildLlmsTxt(posts),
    '---',
    '',
    pageMarkdown('resume', posts),
    '---',
    '',
    pageMarkdown('projects', posts),
    '---',
    '',
    ...posts.flatMap((post) => [postMarkdown(post), '---', '']),
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
