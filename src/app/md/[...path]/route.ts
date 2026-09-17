import { pageMarkdown, postMarkdown } from '@/lib/seo/markdown';
import { getPostBySlug, getPosts } from '@/lib/posts';

export const dynamic = 'force-static';

/**
 * Serves the markdown twin of a page. Visitors reach it as `<page>.md`;
 * middleware rewrites that here, so the public URLs stay pretty.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path.map((segment) => decodeURIComponent(segment));

  const markdown =
    segments.length === 2 && segments[0] === 'blog'
      ? await getPostBySlug(segments[1]).then((post) => (post ? postMarkdown(post) : null))
      : segments.length === 1
        ? pageMarkdown(segments[0], await getPosts())
        : null;

  if (!markdown) return new Response('Not found', { status: 404 });

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

/** Pre-renders every markdown twin at build time. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return [
    { path: ['index'] },
    { path: ['blog'] },
    { path: ['projects'] },
    { path: ['resume'] },
    ...posts.map((post) => ({ path: ['blog', post.slug] })),
  ];
}
