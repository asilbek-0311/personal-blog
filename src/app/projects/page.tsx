import type { Metadata } from 'next';
import { GITHUB_URL, projects } from '@/content/projects';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things Asilbek has built: communities, smart contracts and web apps.',
};

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

      <ol className={styles.list}>
        {projects.map((project) => (
          <li key={project.title} className={styles.item}>
            <div className={styles.heading}>
              <h2 className={styles.title}>{project.title}</h2>
              <span className={styles.status} data-status={project.status}>
                {project.status}
              </span>
            </div>
            <p className={styles.description}>{project.description}</p>
            <p className="meta">{project.technologies.join(' · ')}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={`btn btn-outline ${styles.visit}`}>
              Visit<span className="visually-hidden"> {project.title}</span> <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}
