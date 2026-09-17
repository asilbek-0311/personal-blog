import type { Metadata } from 'next';
import { GITHUB_URL, projects } from '@/content/projects';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things Asilbek has built: communities, smart contracts and web apps.',
};

const initials = (title: string) =>
  title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export default function ProjectsPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">
          A small selection. The rest lives on{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </header>

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.title}>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.project}>
              <span className={styles.top}>
                <span className={styles.mark} aria-hidden="true">
                  {initials(project.title)}
                </span>
                <span className={styles.status} data-status={project.status}>
                  {project.status}
                </span>
              </span>

              <span className={styles.title}>{project.title}</span>
              <span className={styles.description}>{project.description}</span>

              <span className={styles.tech}>
                {project.technologies.map((tech) => (
                  <span key={tech} className="pill">
                    {tech}
                  </span>
                ))}
              </span>

              <span className={styles.visit} aria-hidden="true">
                Visit ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
