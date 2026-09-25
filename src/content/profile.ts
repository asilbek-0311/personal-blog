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
  headline: 'Cloud & DevOps Engineer with blockchain and cryptography knowledge',
  location: 'Tashkent, Uzbekistan (UTC+5) · open to remote and relocation',
  summary:
    'Cloud and DevOps engineer who builds and runs production infrastructure: Kubernetes, CI/CD pipelines, infrastructure as code and observability. Runs a multi-environment Kubernetes platform on Hetzner Cloud at Pixeel after a DevOps internship on Azure at EPAM. Background in blockchain systems and applied cryptography, including zero-knowledge proofs and smart contract security, from integration and automation work at Zerobase and 60+ security analyses at Salus. Focused on automation, reliability and secure delivery.',
  experience: [
    {
      title: 'DevOps Engineer',
      org: 'Pixeel',
      place: 'London, UK (Remote)',
      period: 'Jan 2026 – Present',
      points: [
        'Run the Kubernetes cluster for Office Freund, an e-invoicing platform for Germany: 46 deployments across separate dev, staging and production environments.',
        'Built the full CI/CD pipeline for Office Freund, from build and test to automated deployment on Hetzner Cloud with internal networking.',
        'Set up monitoring, logging and alerting with Prometheus, Loki and Grafana across all environments.',
        'Designed the infrastructure and service architecture for the e-invoice API and automated its release process.',
      ],
    },
    {
      title: 'DevOps Engineer Intern, Azure Cloud',
      org: 'EPAM Systems',
      place: 'Tashkent, Uzbekistan',
      period: 'Sep 2025 – Dec 2025',
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
        'Led technical integrations for 15+ partner protocols, connecting their systems to the Zerobase proving network.',
        'Built GitHub Actions CI/CD pipelines to test, build and deploy integration SDKs, demos and documentation sites.',
        'Automated partner and integration reporting with scheduled scripts, replacing manual weekly status reports.',
        'Built TypeScript tooling and internal scripts to automate partner onboarding, environment setup and integration testing.',
        'Implemented proof-of-concept zero-knowledge circuits and reviewed partner Solidity code during integration.',
      ],
    },
    {
      title: 'Security Researcher & Operations Assistant',
      org: 'Salus',
      place: 'Singapore',
      period: 'Dec 2022 – Sep 2024',
      points: [
        'Built Python and JavaScript tooling for automated vulnerability scanning and on-chain transaction analysis.',
        'Conducted 60+ security analyses of production smart contracts, covering access control, reentrancy, oracle manipulation and economic exploits.',
        'Cut report turnaround from 2 weeks to 4 days by automating research and reporting workflows.',
        'Authored security research reports, including yearly security reports for BNB Chain two years running.',
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
    { label: 'Blockchain & cryptography', items: ['Zero-knowledge proofs', 'Circom', 'SnarkJS', 'EVM internals', 'Foundry', 'Smart contract security'] },
    { label: 'Web & backend', items: ['React', 'Next.js', 'Node.js', 'REST APIs', 'PostgreSQL'] },
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

Education
${formatTimeline(RESUME.education)}

Community
${formatTimeline(RESUME.community)}

Skills
${RESUME.skills.map((s) => `- ${s.label}: ${s.items.join(', ')}`).join('\n')}

Languages: ${RESUME.languages.map((l) => `${l.name} (${l.level})`).join(', ')}.
Interests: ${RESUME.interests.join(', ')}.`;
