// src/components/Header.tsx
import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoText}>Asilbek&apos;s Blog</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink}>About</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/articles" className={styles.navLink}>Articles</Link>
          </li>
          {/* <li className={styles.navItem}>
            <Link href="/thoughts" className={styles.navLink}>Thoughts</Link>
          </li> */}
          <li className={styles.navItem}>
            <Link href="/projects" className={styles.navLink}>Projects</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}