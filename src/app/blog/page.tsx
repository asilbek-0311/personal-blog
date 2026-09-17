import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, getPosts } from '@/lib/posts';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on CPUs, blockchains, AI tooling and whatever Asilbek is learning.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Blog</h1>
        <p className="page-lede">Notes from things I study, build and break.</p>
      </header>

      {posts.length === 0 ? (
        <p className="page-lede">Nothing published yet.</p>
      ) : (
        <ol className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.entry}>
                <span className={styles.entryText}>
                  <span className={styles.entryTitle}>{post.title}</span>
                  {post.excerpt && <span className={styles.entryExcerpt}>{post.excerpt}</span>}
                </span>
                <span className={styles.entryMeta}>
                  <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
                  <span className="pill">{post.readingMinutes} min</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
