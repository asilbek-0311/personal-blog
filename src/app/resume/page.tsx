import type { Metadata } from 'next';
import { CONTACT, RESUME, type TimelineEntry } from '@/content/profile';
import PrintButton from './PrintButton';
import styles from './resume.module.css';

export const metadata: Metadata = {
  title: 'Resume',
  description: `${RESUME.name}: ${RESUME.headline}.`,
};

function Timeline({ id, title, entries }: { id: string; title: string; entries: TimelineEntry[] }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id} className={styles.sectionTitle}>
        {title}
      </h2>
      <ol className={styles.timeline}>
        {entries.map((e) => (
          <li key={`${e.org}-${e.title}`} className={styles.entry}>
            <p className="meta">{e.period}</p>
            <div>
              <h3 className={styles.role}>{e.title}</h3>
              <p className={styles.org}>
                {e.org} · {e.place}
              </p>
              <ul className={styles.points}>
                {e.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ResumePage() {
  return (
    <article className={styles.resume}>
      <header className={`page-header ${styles.header}`}>
        <div>
          <p className="meta">{RESUME.location}</p>
          <h1 className="page-title">{RESUME.name}</h1>
          <p className={styles.headline}>{RESUME.headline}</p>
          <p className={styles.contact}>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
              {CONTACT.github.replace('https://', '')}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
              {CONTACT.linkedin.replace('https://', '')}
            </a>
          </p>
        </div>
        <PrintButton />
      </header>

      <p className={styles.summary}>{RESUME.summary}</p>

      <Timeline id="experience" title="Experience" entries={RESUME.experience} />
      <Timeline id="community" title="Community" entries={RESUME.community} />
      <Timeline id="education" title="Education" entries={RESUME.education} />

      <section className={styles.section} aria-labelledby="skills">
        <h2 id="skills" className={styles.sectionTitle}>
          Skills
        </h2>
        <dl className={styles.skills}>
          {RESUME.skills.map((group) => (
            <div key={group.label} className={styles.entry}>
              <dt className="meta">{group.label}</dt>
              <dd className={styles.pills}>
                {group.items.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
          <div className={styles.entry}>
            <dt className="meta">Spoken</dt>
            <dd>{RESUME.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(', ')}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
