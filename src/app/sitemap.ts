import type { MetadataRoute } from 'next';
import { absolute } from '@/lib/seo/site';
import { getPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const newest = posts[0]?.date ? new Date(posts[0].date) : new Date();

  return [
    { url: absolute('/'), lastModified: newest, changeFrequency: 'weekly', priority: 1 },
    { url: absolute('/blog'), lastModified: newest, changeFrequency: 'weekly', priority: 0.9 },
    { url: absolute('/projects'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absolute('/resume'), changeFrequency: 'monthly', priority: 0.8 },
    ...posts.map((post) => ({
      url: absolute(`/blog/${encodeURIComponent(post.slug)}`),
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
