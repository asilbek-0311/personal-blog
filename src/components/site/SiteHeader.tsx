'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import styles from './site.module.css';

const NAV = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/resume', label: 'Resume' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={`${styles.header} no-print`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-current={pathname === '/' ? 'page' : undefined}>
          Asilbek
        </Link>
        <nav aria-label="Main navigation" className={styles.navWrap}>
          <ul className={styles.nav}>
            {NAV.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link href={href} className={styles.navLink} aria-current={active ? 'page' : undefined}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
