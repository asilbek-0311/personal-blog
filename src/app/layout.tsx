import type { Metadata } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import { THEME_INIT_SCRIPT } from '@/components/site/theme';
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
  metadataBase: new URL('https://asilbek.page'),
  title: { default: 'Asilbek Abdullaev', template: '%s · Asilbek' },
  description: 'Writing, projects, resume, and a drawing of Asilbek that answers questions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        {/* Static string: applies the saved theme before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
