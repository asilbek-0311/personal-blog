// src/components/ArticleCard.tsx
import Link from 'next/link';
import { Post } from '../lib/posts';
import styles from '../styles/ArticleCard.module.css';

export default function ArticleCard({ post }: { post: Post }) {
  return (
    <div className={styles.card}>
      <time className={styles.date}>
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <h3 className={styles.title}>
        <Link href={`/articles/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <Link href={`/articles/${post.slug}`} className={styles.readMore}>
        Read more →
      </Link>
    </div>
  );
}