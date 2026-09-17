import type { Metadata } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import { PersonAndSiteData } from '@/components/site/StructuredData';
import { THEME_INIT_SCRIPT } from '@/components/site/theme';
import { SITE, absolute } from '@/lib/seo/site';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.url }],
  creator: SITE.author.name,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: `${SITE.name} — articles` }],
      'text/markdown': [{ url: '/index.md', title: 'This page as markdown' }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
    images: [{ url: absolute('/og'), width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [absolute('/og')] },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  category: 'technology',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        {/* Static string: applies the saved theme before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <PersonAndSiteData />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
