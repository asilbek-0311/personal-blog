// src/app/about/page.tsx
import styles from '../../styles/About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>About</h1>
      </header>
      
      <div className={styles.content}>
        <p>
          Welcome to my blog! I am passionate about technology, design, and creating 
          valuable content to share with the world.
        </p>
        
        <p>
          This blog is built with Next.js and TypeScript, with a design inspired by
          the clean and minimal aesthetic of ithaca.xyz.
        </p>
        
        <h2>What I Write About</h2>
        <p>
          I cover a range of topics including:
        </p>
        <ul>
          <li>Web Development</li>
          <li>User Experience Design</li>
          <li>Technology Trends</li>
          <li>Personal Projects</li>
        </ul>
        
        <h2>Get in Touch</h2>
        <p>
          Have questions or want to connect? Feel free to reach out via email
          or find me on social media.
        </p>
      </div>
    </div>
  );
}