# asilbek.page

Personal site: a blog, a projects page, a resume, and **Koko**, a pixel koala on the home page who has read every article and can chat about them.

## Structure

```text
content/posts/*.md          articles (frontmatter: title, date, excerpt, coverImage?)
src/content/profile.ts      resume data (resume page + Koko)
src/content/projects.ts     projects list (page + Koko)
src/app/page.tsx            home: Koko chat
src/app/resume/             resume page (print to PDF)
src/app/blog/               blog index and article pages
src/app/projects/           projects page
src/app/api/chat/route.ts   streaming Gemini chat
src/components/agent/       Koko: pixel sprite, chat UI, chat hook
src/components/site/        header, footer, light/dark toggle
src/lib/agent/              system prompt, request validation, rate limit
src/styles/                 tokens, globals, article typography
```

## How Koko knows things

Every request sends Gemini a system prompt built from `profile.ts`, `projects.ts` and the full text of every post (see `src/lib/agent/prompt.ts`). No database or vector search. Publish a new `.md` post, redeploy, and Koko knows about it.

## Writing a post

Add `content/posts/my-post.md`:

```md
---
title: "My post"
date: "2026-09-17"
excerpt: "One-line summary"
---

Markdown / MDX content…
```

It appears at `/blog/my-post`.

## Development

```bash
npm install
cp .env.example .env   # then set GEMINI_API_KEY
npm run dev
npm test               # unit tests (vitest)
npm run build
```

Environment variables:

| Name | Required | Default |
|------|----------|---------|
| `GEMINI_API_KEY` | yes | none |
| `GEMINI_MODEL` | no | `gemini-3.5-flash-lite` |
