// src/components/Footer.tsx
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
        <p className={styles.poweredBy}>
          Built with Next.js
        </p>
      </div>
    </footer>
  );
}