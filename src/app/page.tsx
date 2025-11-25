// src/app/page.tsx
import { getPosts } from '../lib/posts';
import FeaturedArticle from '../components/FeaturedArticle';
import ArticleCard from '../components/ArticleCard';
import styles from '../styles/Home.module.css';
import Terminal from '@/components/Terminal';
import ThoughtInput from '@/components/ThoughtInput';
import Link from 'next/link';


export default async function HomePage() {
  const posts = await getPosts();
  const featuredPost = posts[0]; // Most recent post as featured
  const recentPosts = posts.slice(1, 4); // Next 3 most recent posts
  
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to My Blog</h1>
        <p className={styles.description}>
          Thoughts, ideas, and projects about technology and more.
        </p>
      </section>

      <Terminal />

      
      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>Featured Article</h2>
        {featuredPost && <FeaturedArticle post={featuredPost} />}
      </section>
      
      <section className={styles.recent}>
        <h2 className={styles.sectionTitle}>Recent Articles</h2>
        <div className={styles.articlesGrid}>
          {recentPosts.map(post => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}