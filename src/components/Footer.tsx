// src/components/Footer.tsx
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} Asilbek&apos;s Blog.</p>
        <div className={styles.socialLinks}>
          <a 
            href="https://github.com/asilbek-0311" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <span className={styles.separator}>•</span>
          <a 
            href="https://linkedin.com/in/asilbek0311" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}