// src/components/FeaturedArticle.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../lib/posts';
import styles from '../styles/FeaturedArticle.module.css';

export default function FeaturedArticle({ post }: { post: Post }) {
  return (
    <div className={styles.featuredArticle}>
      {post.coverImage && (
        <div className={styles.imageContainer}>
          <Image 
            src={post.coverImage} 
            alt={post.title}
            width={800}
            height={400}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
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
    </div>
  );
}

