export type ProjectStatus = 'Live' | 'Completed' | 'In development';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  status: ProjectStatus;
}

export const GITHUB_URL = 'https://github.com/asilbek-0311';

export const projects: Project[] = [
  {
    title: 'DevPev Community',
    description:
      'The first open, inclusive developer community in Uzbekistan. Meetups, workshops and peer learning for developers at every level.',
    technologies: ['Next.js', 'React', 'TypeScript'],
    link: 'https://www.devpev.uz/',
    status: 'In development',
  },
  {
    title: 'Decentralized Voting System',
    description:
      'Final year project. A blockchain-based voting system built for transparent, tamper-resistant elections.',
    technologies: ['Solidity', 'Hardhat', 'React', 'Web3'],
    link: 'https://fyp-voting-system.vercel.app/',
    status: 'Completed',
  },
  {
    title: 'Next.js Dashboard',
    description: 'Invoice management app with authentication, CRUD flows and a PostgreSQL backend.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    link: 'https://nextjs-dashboard-five-mu-64.vercel.app/dashboard',
    status: 'Live',
  },
  {
    title: 'NFT Speedrun Challenge',
    description: 'NFT minting and marketplace app, built while working through the SpeedRunEthereum challenges.',
    technologies: ['Solidity', 'Ethereum', 'React', 'Web3.js'],
    link: 'https://nft-speedrun-eth-ch0.vercel.app/',
    status: 'Completed',
  },
];
