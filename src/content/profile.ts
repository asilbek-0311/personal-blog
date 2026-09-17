// Single source for the resume page and everything the character knows about Asilbek.

export const AGENT_NAME = 'Koko';

export const CONTACT = {
  email: 'azizjonogliasilbek@gmail.com',
  github: 'https://github.com/asilbek-0311',
  linkedin: 'https://linkedin.com/in/asilbek0311',
};

export interface TimelineEntry {
  title: string;
  org: string;
  place: string;
  period: string;
  points: string[];
}

export interface Resume {
  name: string;
  headline: string;
  location: string;
  summary: string;
  experience: TimelineEntry[];
  community: TimelineEntry[];
  education: TimelineEntry[];
  skills: { label: string; items: string[] }[];
  languages: { name: string; level: string }[];
  interests: string[];
}

// Source: ~/coding/Projects/ai-cv-maker/profile/*.yaml (Sep 2026).
// Bullets flagged VERIFY there are left out until confirmed.
export const RESUME: Resume = {
  name: 'Asilbek Abdullaev',
  headline: 'Cloud & DevOps Engineer with blockchain and ZK knowledge',
  location: 'Tashkent, Uzbekistan (UTC+5) · open to remote and relocation',
  summary:
    'Engineer with a blockchain, security-research and developer-relations background, now building and running cloud infrastructure. Runs Kubernetes, CI/CD and monitoring at Pixeel after a DevOps internship on Azure at EPAM; previously led developer relations at a ZK protocol and ran 60+ smart contract security analyses at an audit firm. Founded two developer communities totalling 500+ members. Working toward becoming a systems engineer.',
  experience: [
    {
      title: 'DevOps Engineer & Product Manager',
      org: 'Pixeel',
      place: 'London, UK (Remote)',
      period: 'Jan 2026 – Present',
      points: [
        'Run the Kubernetes cluster for Office Freund, an e-invoicing tool for Germany: 46 deployments across separate dev, staging and production environments.',
        'Built the full CI/CD pipeline for Office Freund, on Hetzner Cloud with internal networking.',
        'Set up monitoring and observability with Prometheus, Loki and Grafana.',
        'Built the e-invoice service from scratch and designed the system architecture for the API business selling it.',
        'Product Manager for Solarware, a CRM for solar panel companies in Germany: lead a team of 4 developers on roadmap, prioritisation and a UI redesign.',
        'Grew the Office Freund dev team from 0 to 3 and own product delivery end to end.',
      ],
    },
    {
      title: 'DevOps Engineer Intern, Azure Cloud',
      org: 'EPAM Systems',
      place: 'Tashkent, Uzbekistan',
      period: 'Jan 2026 – Jun 2026',
      points: [
        'Managed Azure infrastructure across dev and production, including VMs, AKS clusters and App Services.',
        'Built and maintained CI/CD pipelines in Azure DevOps with YAML pipeline definitions.',
        'Provisioned infrastructure with Terraform and set up monitoring and alerting with Azure Monitor.',
        'Managed access controls and secrets following cloud security best practices.',
      ],
    },
    {
      title: 'Developer Relations Lead',
      org: 'Zerobase',
      place: 'Singapore',
      period: 'Oct 2024 – Nov 2025',
      points: [
        'Onboarded 15+ strategic blockchain and Web3 partners into technical collaborations and protocol integrations.',
        'Reviewed and debugged partner Solidity implementations and proposed optimizations.',
        'Implemented proof-of-concept ZK circuits and taught engineering teams ZK application design.',
        'Ran weekly ZK workshops for the sales team over 2 months, raising measured domain knowledge by 40%.',
        'Built TypeScript developer tooling, React demos and Next.js prototypes for partner integrations, and wrote developer guides and API docs.',
      ],
    },
    {
      title: 'Security Researcher & Operations Assistant',
      org: 'Salus',
      place: 'Singapore',
      period: 'Dec 2022 – Sep 2024',
      points: [
        'Conducted 60+ security analyses of live mainnet smart contracts, covering reentrancy, access control, oracle manipulation and economic exploits.',
        'Authored security research reports presented at industry conferences, and yearly security reports for BNB Chain two years running.',
        'Built Python and JavaScript scripts for automated vulnerability scanning and transaction analysis.',
        'Cut report turnaround from 2 weeks to 4 days by streamlining research workflows.',
      ],
    },
  ],
  community: [
    {
      title: 'Founder',
      org: 'Dev Pev',
      place: 'Tashkent',
      period: 'May 2025 – Present',
      points: [
        'Founded the first open, inclusive developer community in the region.',
        'Host regular in-person meetups, technical talks and hands-on workshops across skill levels.',
      ],
    },
    {
      title: 'Co-Founder',
      org: 'Sunway Blockchain Club',
      place: 'Malaysia',
      period: 'Oct 2023 – Present',
      points: [
        'Scaled the fastest-growing university blockchain club in Malaysia to 500+ members and 100+ events.',
        'Partnerships with 80+ organisations including the Ethereum Foundation, Worldcoin, PSE, Pudgy, EthKL, Superteam Malaysia and Token2049.',
        '12 of 20 core members went on to roles at blockchain firms.',
      ],
    },
  ],
  education: [
    {
      title: 'B.Sc. (Hons) Computer Science, Double Degree',
      org: 'Sunway University & Lancaster University',
      place: 'Malaysia / UK',
      period: 'Aug 2021 – Jan 2025',
      points: [
        'Computer science foundations: algorithms, data structures, software engineering, systems programming, computer networks, distributed systems and cryptography.',
        'Jeffrey Cheah ACE Scholarship recipient (3x).',
      ],
    },
    {
      title: 'Software Engineering / DevOps Program',
      org: 'School 21',
      place: 'Tashkent',
      period: 'Aug 2025 – Mar 2026',
      points: [
        'DevOps track: Linux administration, networking, Docker, CI/CD and infrastructure automation.',
        'Project-based, peer-reviewed learning with a focus on algorithmic problem solving.',
      ],
    },
    {
      title: 'Core Program, C and Systems Programming',
      org: '42 Kuala Lumpur',
      place: 'Malaysia',
      period: 'Dec 2022 – Jan 2024',
      points: [
        'C programming from first principles: memory management, pointers, data structures and algorithms.',
        'Completed the Piscine selection bootcamp and progressed into the Core Program.',
      ],
    },
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'Go', 'TypeScript', 'JavaScript', 'Solidity', 'C', 'Bash', 'SQL'] },
    { label: 'Cloud & infra', items: ['Azure', 'AKS', 'Hetzner Cloud', 'AWS & GCP (fundamentals)', 'Linux', 'Nginx'] },
    { label: 'CI/CD & IaC', items: ['Azure DevOps', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Terraform', 'Ansible'] },
    { label: 'Containers', items: ['Docker', 'Docker Compose', 'Kubernetes'] },
    { label: 'Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Azure Monitor'] },
    { label: 'Blockchain & ZK', items: ['EVM internals', 'Hardhat', 'Foundry', 'OpenZeppelin', 'Circom', 'SnarkJS', 'Smart contract security'] },
    { label: 'Web & backend', items: ['React', 'Next.js', 'Node.js', 'REST APIs', 'PostgreSQL'] },
    { label: 'Product', items: ['Roadmap & prioritisation', 'Stakeholder management', 'Agile/Scrum', 'Technical documentation'] },
  ],
  languages: [
    { name: 'Uzbek', level: 'Native' },
    { name: 'English', level: 'Proficient' },
    { name: 'Russian', level: 'Intermediate' },
    { name: 'Turkish', level: 'Basic' },
  ],
  interests: ['Reading', 'Building side projects', 'Technical writing', 'Mentoring developers'],
};

function formatTimeline(entries: TimelineEntry[]): string {
  return entries
    .map((e) => `- ${e.title}, ${e.org} (${e.place}), ${e.period}. ${e.points.join(' ')}`)
    .join('\n');
}

export const PROFILE = `${RESUME.name}. ${RESUME.headline}. Based in ${RESUME.location}.
Email: ${CONTACT.email}. GitHub: ${CONTACT.github}. LinkedIn: ${CONTACT.linkedin}. Full resume at /resume.

Summary: ${RESUME.summary}

Experience
${formatTimeline(RESUME.experience)}

Community
${formatTimeline(RESUME.community)}

Education
${formatTimeline(RESUME.education)}

Skills
${RESUME.skills.map((s) => `- ${s.label}: ${s.items.join(', ')}`).join('\n')}

Languages: ${RESUME.languages.map((l) => `${l.name} (${l.level})`).join(', ')}.
Interests: ${RESUME.interests.join(', ')}.`;
