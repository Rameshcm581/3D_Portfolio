export interface SkillDomainNode {
  id: string;
  title: string;
  position: [number, number, number];
  color: string;
  connections: string[];
  techs: string[];
}

export const SKILL_DOMAINS: SkillDomainNode[] = [
  {
    id: 'backend',
    title: 'Backend & APIs',
    position: [0, 14.5, 0],
    color: '#dfc070',
    connections: ['languages', 'databases', 'automation', 'devops'],
    techs: ['FastAPI', 'REST APIs', 'Microservices', 'SQLAlchemy', 'JWT & RBAC'],
  },
  {
    id: 'languages',
    title: 'Languages',
    position: [-3.2, 16.2, 1.2],
    color: '#dfc070',
    connections: ['backend', 'ai', 'automation'],
    techs: ['Python', 'Java', 'C', 'JavaScript'],
  },
  {
    id: 'databases',
    title: 'Databases',
    position: [3.4, 15.8, -0.8],
    color: '#38bdf8',
    connections: ['backend'],
    techs: ['PostgreSQL', 'MySQL', 'Relational Schemas', 'Indexing'],
  },
  {
    id: 'automation',
    title: 'Automation & Testing',
    position: [-2.6, 12.8, -1.5],
    color: '#38bdf8',
    connections: ['backend', 'languages', 'devops'],
    techs: ['Playwright', 'pytest', 'Browser Automation', 'Scheduled Monitoring'],
  },
  {
    id: 'ai',
    title: 'AI & Computer Vision',
    position: [-4.2, 14.2, -1.2],
    color: '#dfc070',
    connections: ['languages', 'backend'],
    techs: ['YOLOv8', 'OpenCV', 'Rasa', 'Ollama', 'RAG (Qdrant)'],
  },
  {
    id: 'devops',
    title: 'DevOps & Observability',
    position: [2.8, 13.2, 1.4],
    color: '#38bdf8',
    connections: ['backend', 'automation'],
    techs: ['Docker', 'Linux/Bash', 'GitHub Actions', 'Grafana', 'Git'],
  },
  {
    id: 'frontend',
    title: 'Frontend & Mobile',
    position: [4.2, 14.5, 1.6],
    color: '#848e9c',
    connections: ['backend', 'integrations'],
    techs: ['React', 'TypeScript', 'Flutter', 'Tailwind CSS', 'HTML5/CSS3'],
  },
  {
    id: 'integrations',
    title: 'Integrations & Services',
    position: [1.2, 12.2, -2.2],
    color: '#dfc070',
    connections: ['backend'],
    techs: ['Stripe', 'Razorpay', 'SendGrid', 'Firebase', 'Google Maps'],
  },
];

export interface ExhibitionProject {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  techStack: string[];
}

export const EXHIBITION_PROJECTS: ExhibitionProject[] = [
  {
    id: 'sitewatch',
    title: 'SiteWatch: Website, TLS & Domain Monitoring',
    shortTitle: 'SiteWatch Monitoring',
    category: 'Microservices & Scheduled Automation',
    techStack: ['Python', 'FastAPI', 'APScheduler', 'PostgreSQL', 'Docker', 'Stripe'],
  },
  {
    id: 'retail-management',
    title: 'Multi-Tenant Retail Management & Billing Platform',
    shortTitle: 'Retail Operations & POS',
    category: 'Enterprise Multi-Tenancy & Billing',
    techStack: ['FastAPI', 'PostgreSQL', 'RBAC', 'React', 'TypeScript'],
  },
  {
    id: 'thirukural-rag',
    title: 'Thirukural RAG: Scenario-Based Semantic Search',
    shortTitle: 'Thirukural RAG Search',
    category: 'Applied AI & Vector Embeddings',
    techStack: ['Python', 'Qdrant', 'FastAPI', 'Gemini', 'Sentence-Transformers'],
  },
  {
    id: 'brain-tumor-detection',
    title: 'Brain Tumor Detection & Localization using YOLOv8',
    shortTitle: 'YOLOv8 Computer Vision',
    category: 'Deep Learning & Image Processing',
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch'],
  },
  {
    id: 'healthcare-management',
    title: 'Professional Engineering Systems (Younder Bots)',
    shortTitle: 'Enterprise Microservice Platform',
    category: 'Healthcare & Laboratory Automation',
    techStack: ['FastAPI', '11+ Microservices', 'Docker', 'API Gateway', 'Rasa AI'],
  },
];
