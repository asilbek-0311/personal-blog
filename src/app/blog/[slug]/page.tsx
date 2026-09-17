import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { ArticleData } from '@/components/site/StructuredData';
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
  const path = `/blog/${encodeURIComponent(post.slug)}`;
  const description = post.excerpt || `${post.title} — an article by Asilbek Abdullaev.`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: path,
      types: { 'text/markdown': [{ url: `${path}.md`, title: 'This article as markdown' }] },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: path,
      publishedTime: post.date,
      authors: ['Asilbek Abdullaev'],
      images: [{ url: `/og${path}`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [`/og${path}`] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const post = await getPostBySlug(decodeURIComponent((await params).slug));
  if (!post) notFound();

  return (
    <article className={styles.article}>
      <ArticleData
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        readingMinutes={post.readingMinutes}
      />
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

      <aside className={`${styles.askAgent} no-print`}>
        <p>Questions about this article? Ask on the home page.</p>
        <Link href="/" className="btn">
          Ask a question
        </Link>
      </aside>
    </article>
  );
}
