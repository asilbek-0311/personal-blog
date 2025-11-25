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
        Hi, I&apos;m Asilbek Abdullaev — a developer based in Uzbekistan. I work at the intersection of blockchain, zero-knowledge cryptography, and AI. My main focus is building reliable systems that balance performance, privacy, and actual usability — because technology is only meaningful when people can use it without reading a 40-page manual.
      </p>

      <h3>How I Started</h3>
      <p>
        I didn&apos;t start coding because of some dramatic movie moment — no glowing screens, no “hack the NASA mainframe." I was simply curious about how things work. That curiosity turned into late-night coding sessions, many broken projects, and eventually… working systems I'm proud of. I&apos;ve been building and learning ever since.
      </p>

      <h3>What I Work On</h3>
      <ul>
        <li>Smart contracts and decentralized applications</li>
        <li>Zero-knowledge proof systems and privacy-preserving tech</li>
        <li>AI-assisted developer tools and automation</li>
        <li>DeFi product architecture and protocol design</li>
      </ul>

      <p>
        I enjoy solving complex technical problems and turning abstract ideas into real, functioning products. My approach is simple: build, test, iterate, learn, repeat.
      </p>

      <h3>On This Site</h3>
      <p>
        This space is where I document things I&apos;m building, exploring, or trying to figure out — from technical breakdowns and research notes to occasional thoughts on the direction of technology.
      </p>

      <h3>Outside of Code</h3>
      <p>
        When I&apos;m not coding, I&apos;m usually reading, practicing communication and writing, or learning something completely unrelated (because curiosity doesn&apos;t turn off). Also — strong coffee is part of the workflow, not optional.
      </p>

      <h3>Let&apos;s Connect</h3>
      <p>
        If you&apos;re building something interesting — especially in blockchain, cryptography, or AI — I&apos;d love to connect. I&apos;m always open to collaboration, conversations, or exchanging ideas.
      </p>

      </div>
    </div>
  );
}