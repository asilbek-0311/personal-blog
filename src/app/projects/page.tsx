// src/app/projects/page.tsx
// src/app/projects/page.tsx
import styles from '../../styles/Projects.module.css';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: 'Decentralized Voting System',
      description: 'My final year project - a blockchain-based voting system ensuring transparency and security in electoral processes.',
      technologies: ['Blockchain', 'Smart Contracts', 'Web3', 'React'],
      link: 'https://fyp-voting-system.vercel.app/',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Next.js Dashboard',
      description: 'Full-featured invoice management application with authentication, CRUD operations, and modern UI.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
      link: 'https://nextjs-dashboard-five-mu-64.vercel.app/dashboard',
      status: 'Live'
    },
    {
      id: 3,
      title: 'DevPev Community',
      description: 'A developer community platform built for connecting and collaborating with fellow developers.',
      technologies: ['Next.js', 'React', 'TypeScript'],
      link: 'https://www.devpev.uz/',
      status: 'In Development'
    },
    {
      id: 4,
      title: 'NFT Speedrun Challenge',
      description: 'Built as part of SpeedRunEthereum challenges - an NFT minting and marketplace application.',
      technologies: ['Solidity', 'Ethereum', 'React', 'Web3.js'],
      link: 'https://nft-speedrun-eth-ch0.vercel.app/',
      status: 'Completed'
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.description}>
          A collection of my work in blockchain, web development, and beyond.
        </p>
        <p className={styles.lazyNote}>
          <em>I'm a lazy programmer - this is just a taste. For the full collection of projects, repos, and code, check out my{' '}
          <a href="https://github.com/asilbek-0311" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            GitHub
          </a>
          .</em>
        </p>
      </header>
      
      <div className={styles.projectsGrid}>
        {projects.map(project => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <span className={`${styles.status} ${styles[project.status.toLowerCase().replace(' ', '')]}`}>
                {project.status}
              </span>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.technologies}>
              {project.technologies.map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              View Project →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}