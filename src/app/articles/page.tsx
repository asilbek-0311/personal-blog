// src/app/articles/page.tsx
import { getPosts } from '../../lib/posts';
import ArticleCard from '../../components/ArticleCard';
import styles from '../../styles/Articles.module.css';

export default async function ArticlesPage() {
  const posts = await getPosts();
  // console.log(posts);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Articles</h1>
        <p className={styles.description}>
          All my writings on technology, design, and more.
        </p>
      </header>
      
      <div className={styles.articlesGrid}>
        {posts.map(post => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}