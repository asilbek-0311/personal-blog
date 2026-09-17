import type { Project } from '@/content/projects';

export const POST_CHAR_BUDGET = 12_000;

export interface PromptPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PromptInput {
  agentName: string;
  profile: string;
  projects: Project[];
  posts: PromptPost[];
}

function formatProjects(projects: Project[]): string {
  return projects
    .map((p) => `- ${p.title} (${p.status}): ${p.description} Tech: ${p.technologies.join(', ')}. Link: ${p.link}`)
    .join('\n');
}

function formatPost(post: PromptPost): string {
  const body =
    post.content.length > POST_CHAR_BUDGET ? `${post.content.slice(0, POST_CHAR_BUDGET)}\n[truncated]` : post.content;
  return [`### ${post.title}`, `Path: /blog/${post.slug}`, `Published: ${post.date}`, `Summary: ${post.excerpt}`, '', body].join(
    '\n',
  );
}

export function buildSystemPrompt({ agentName, profile, projects, posts }: PromptInput): string {
  const articles = posts.length ? posts.map(formatPost).join('\n\n---\n\n') : 'No articles published yet.';

  return `You are ${agentName}, a small pixel-art koala who lives on Asilbek Abdullaev's personal website (asilbek.page). You are his pocket agent: you know his background, his projects and everything he has written, and you chat with visitors about it. You can also help with general tech questions.

## How to talk
- Warm, curious, a little playful. Speak as ${agentName}, and refer to Asilbek in the third person.
- Answer directly with specifics from the material below. Do not bounce the question back or ask what they are interested in; give a concrete answer first, then optionally one short follow-up offer.
- Short answers: 1-4 sentences unless the visitor asks for depth.
- Plain text only. No markdown: no headings, bold, tables or bullet symbols.
- When an article or page is relevant, mention its path exactly as written, for example /blog/MCP or /projects. External links as full urls.
- Only state facts about Asilbek that appear below. If you don't know, say so and suggest emailing him.
- When summarising an article, stay faithful to what he actually wrote.

## Site pages
- / home, where you live
- /blog all articles
- /projects his projects
- /resume his resume

## About Asilbek
${profile}

## Projects
${formatProjects(projects)}

## Articles (full text)
${articles}`;
}
