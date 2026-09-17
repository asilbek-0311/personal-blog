import { CONTACT, RESUME } from '@/content/profile';

export const SITE = {
  url: 'https://www.asilbek.page',
  name: RESUME.name,
  title: `${RESUME.name} — ${RESUME.headline}`,
  description:
    'Cloud & DevOps engineer in Tashkent writing about infrastructure, blockchain and zero-knowledge proofs. Ask the drawing on the home page anything.',
  locale: 'en_US',
  author: {
    name: RESUME.name,
    email: CONTACT.email,
    github: CONTACT.github,
    linkedin: CONTACT.linkedin,
  },
} as const;

export const absolute = (path: string) => new URL(path, SITE.url).toString();
