import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { AGENT_NAME } from '@/content/profile';
import { formatDate, getPostBySlug, getPosts } from '@/lib/posts';
import styles from '../blog.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(decodeURIComponent((await params).slug));
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  };
}

export default async function ArticlePage({ params }: Params) {
  const post = await getPostBySlug(decodeURIComponent((await params).slug));
  if (!post) notFound();

  return (
    <article className={styles.article}>
      <Link href="/blog" className={styles.back}>
        ← All articles
      </Link>

      <header className={styles.articleHeader}>
        <p className="meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
        <h1 className={styles.articleTitle}>{post.title}</h1>
        {post.excerpt && <p className={styles.articleExcerpt}>{post.excerpt}</p>}
      </header>

      {post.coverImage && (
        <Image src={post.coverImage} alt="" width={1200} height={630} className={styles.cover} priority />
      )}

      <div className="prose">
        <CustomMDX source={post.content} />
      </div>

      <p className={`${styles.askKoala} no-print`}>
        Questions about this one? <Link href="/">Ask {AGENT_NAME}</Link>, the koala has read it.
      </p>
    </article>
  );
}
