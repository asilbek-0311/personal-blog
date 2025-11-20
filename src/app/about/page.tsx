// src/app/about/page.tsx
import styles from '../../styles/About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>About Me</h1>
      </header>
      
      <div className={styles.content}>
        <p>
          Hi, I am Asilbek! I am a [your role/profession - e.g., software developer, 
          designer, student] based in [your location]. I created this space to share 
          my thoughts, projects, and things I'm learning along the way.
        </p>
        
        <h3>What I Do</h3>
        <p>
          I&apos;m currently [what you&apos;re working on or studying]. I enjoy building things 
          for the web and exploring how technology can solve real problems. My interests 
          span across web development, design, and [other interests].
        </p>
        
        <h3>What You&apos;ll Find Here</h3>
        <p>
          On this blog, I write about:
        </p>
        <ul>
          <li>Technical tutorials and things I&apos;ve learned</li>
          <li>Projects I&apos;m working on</li>
          <li>Thoughts on technology and design</li>
          <li>Books, tools, and resources I find useful</li>
        </ul>
        
        <h3>Beyond Code</h3>
        <p>
          When I&apos;m not coding, you can find me [your hobbies/interests - e.g., reading, 
          playing chess, exploring new coffee shops, etc.]. I believe in continuous 
          learning and staying curious about the world.
        </p>
        
        <h3>Let&apos;s Connect</h3>
        <p>
          I&apos;m always open to interesting conversations and collaborations. Feel free 
          to reach out through GitHub or LinkedIn—I&apos;d love to hear from you!
        </p>
      </div>
    </div>
  );
}