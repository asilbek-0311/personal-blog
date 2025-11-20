// src/app/articles/[slug]/page.tsx
import { getPostBySlug, getPosts } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from '../../../styles/ArticlePage.module.css';
import { Metadata } from 'next';
import { CustomMDX } from '@/components/mdx';

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const {slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>
      
      {post.coverImage && (
        <div className={styles.coverContainer}>
          <Image 
            src={post.coverImage} 
            alt={post.title}
            width={800}
            height={400}
            className={styles.coverImage}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <CustomMDX source={post.content} />
      </div>
      
    </article>
  );
}