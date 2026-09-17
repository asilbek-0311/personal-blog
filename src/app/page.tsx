import AgentChat from '@/components/agent/AgentChat';
import { projects } from '@/content/projects';
import type { LinkCatalog } from '@/lib/agent/reply';
import { getPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getPosts();
  const catalog: LinkCatalog = {
    posts: posts.map(({ slug, title, readingMinutes }) => ({ slug, title, readingMinutes })),
    projects: projects.map(({ title, link, status }) => ({ title, link, status })),
  };

  return (
    <>
      <h1 className="visually-hidden">Asilbek Abdullaev</h1>
      <AgentChat catalog={catalog} />
    </>
  );
}
