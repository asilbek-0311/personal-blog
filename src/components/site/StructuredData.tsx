import { RESUME } from '@/content/profile';
import { projects } from '@/content/projects';
import { SITE, absolute } from '@/lib/seo/site';

/** JSON-LD is data, not markup, so search engines and models can read it directly. */
function Ld({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const personId = absolute('/#person');

export function PersonAndSiteData() {
  return (
    <>
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': personId,
          name: SITE.author.name,
          url: SITE.url,
          email: `mailto:${SITE.author.email}`,
          jobTitle: RESUME.headline,
          description: RESUME.summary,
          address: { '@type': 'PostalAddress', addressLocality: 'Tashkent', addressCountry: 'UZ' },
          sameAs: [SITE.author.github, SITE.author.linkedin],
          knowsAbout: RESUME.skills.flatMap((group) => group.items).slice(0, 25),
          alumniOf: RESUME.education.map((entry) => ({ '@type': 'EducationalOrganization', name: entry.org })),
          worksFor: { '@type': 'Organization', name: RESUME.experience[0]?.org },
        }}
      />
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': absolute('/#website'),
          url: SITE.url,
          name: SITE.name,
          description: SITE.description,
          inLanguage: 'en',
          publisher: { '@id': personId },
        }}
      />
    </>
  );
}

export function ArticleData({
  title,
  description,
  slug,
  date,
  readingMinutes,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  readingMinutes: number;
}) {
  const url = absolute(`/blog/${encodeURIComponent(slug)}`);
  return (
    <>
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          datePublished: date,
          dateModified: date,
          url,
          mainEntityOfPage: url,
          timeRequired: `PT${readingMinutes}M`,
          author: { '@id': personId },
          publisher: { '@id': personId },
          image: absolute(`/og/blog/${encodeURIComponent(slug)}`),
          inLanguage: 'en',
        }}
      />
      <Ld
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: absolute('/blog') },
            { '@type': 'ListItem', position: 3, name: title, item: url },
          ],
        }}
      />
    </>
  );
}

export function ProjectsData() {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Projects',
        url: absolute('/projects'),
        about: { '@id': personId },
        hasPart: projects.map((project) => ({
          '@type': 'SoftwareSourceCode',
          name: project.title,
          description: project.description,
          url: project.link,
          programmingLanguage: project.technologies,
          author: { '@id': personId },
        })),
      }}
    />
  );
}
