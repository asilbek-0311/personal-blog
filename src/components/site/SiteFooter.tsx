import { CONTACT } from '@/content/profile';
import styles from './site.module.css';

export default function SiteFooter() {
  return (
    <footer className={`${styles.footer} no-print`}>
      <span>© {new Date().getFullYear()} Asilbek Abdullaev</span>
      <ul className={styles.footerLinks}>
        <li>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={`mailto:${CONTACT.email}`}>Email</a>
        </li>
        <li>
          <a href="/feed.xml">RSS</a>
        </li>
        <li>
          <a href="/llms.txt" title="A map of this site for language models">llms.txt</a>
        </li>
      </ul>
    </footer>
  );
}
