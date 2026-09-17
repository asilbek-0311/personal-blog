import type { MetadataRoute } from 'next';
import { absolute } from '@/lib/seo/site';

/**
 * Search engines and AI crawlers are both welcome: the point of the site is to
 * be read and quoted. Only the API routes are off limits.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: absolute('/sitemap.xml'),
    host: absolute('/'),
  };
}
