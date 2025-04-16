// src/app/projects/page.tsx
import styles from '../../styles/Projects.module.css';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: 'Project One',
      description: 'A description of your first project.',
      technologies: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Project Two',
      description: 'A description of your second project.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'A description of your third project.',
      technologies: ['Vue.js', 'Express', 'Firebase'],
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.description}>
          A collection of my personal and professional projects.
        </p>
      </header>
      
      <div className={styles.projectsGrid}>
        {projects.map(project => (
          <div key={project.id} className={styles.projectCard}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.technologies}>
              {project.technologies.map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}