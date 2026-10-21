/**
 * Central Portfolio Data Configuration for Ramesh C
 * 
 * Adapts and exposes the real portfolio data defined in portfolio.ts
 * for the UI components with full TypeScript type safety.
 */

import { portfolio, type SkillGroup, type PortfolioProject } from '../../portfolio';

export interface NavItem {
  label: string;
  href: string;
}

export interface PersonalInfo {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  location: string;
  timezone: string;
  availability: 'available' | 'busy' | 'open_to_offers';
  availabilityText: string;
  email: string;
  phone?: string;
  showPhone: boolean;
  resumeUrl: string | null;
  avatarUrl: string;
  logoUrl: string;
}

export interface HeroContent {
  eyebrow: string;
  headingPrefix: string;
  headingAccent: string;
  headingSuffix: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  techPills: string[];
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  focusAreas: string[];
  stats: StatItem[];
  principles: PrincipleItem[];
}

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced' | 'Proficient';
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  showOnPortfolio: boolean;
  tagline: string;
  problem: string;
  solution: string;
  highlights: string[];
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  architectureNotes?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Open Source';
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  honors?: string;
  relevantCourses?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  topics: string[];
}

export interface LeadershipItem {
  id: string;
  title: string;
  organization: string | null;
  dateLabel: string | null;
  description: string | null;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email';
  label: string;
  url: string;
  username: string;
}

export interface PortfolioData {
  navigation: NavItem[];
  personal: PersonalInfo;
  hero: HeroContent;
  about: AboutContent;
  skillCategories: SkillCategory[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  leadership: LeadershipItem[];
  socials: SocialLink[];
}

// Convert skill groups to UI categories
function mapSkills(groups: readonly SkillGroup[]): SkillCategory[] {
  return groups.map((g) => ({
    id: g.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: g.title,
    description: `Core tooling and competencies in ${g.title}`,
    skills: g.skills.map((name, idx) => ({
      name,
      level: idx < 2 ? 'Expert' : idx < 5 ? 'Advanced' : 'Proficient',
      highlight: idx < 3,
    })),
  }));
}

// Convert raw projects to UI projects (only where showOnPortfolio === true)
function mapProjects(projects: readonly PortfolioProject[]): Project[] {
  return projects
    .filter((p) => p.showOnPortfolio)
    .map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category === 'personal' ? 'Personal & Architecture Project' : 'Enterprise Microservice',
      featured: p.featured,
      showOnPortfolio: p.showOnPortfolio,
      tagline: p.summary,
      problem: p.problem || 'Operational complexity requiring automated monitoring, scheduled verification, and resilient services.',
      solution: p.solution || 'Engineered modular Python & FastAPI services with relational database models, Docker containerization, and automated test pipelines.',
      highlights: [...p.highlights],
      techStack: [...p.technologies],
      githubUrl: p.githubUrl && p.githubUrl.trim() !== '' ? p.githubUrl : null,
      liveUrl: p.liveDemoUrl && p.liveDemoUrl.trim() !== '' ? p.liveDemoUrl : null,
      architectureNotes: p.solution || p.highlights.join(' • '),
    }));
}

export const portfolioData: PortfolioData = {
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ],

  personal: {
    name: portfolio.person.name,
    initials: 'RC',
    role: portfolio.person.role,
    tagline: portfolio.person.headline,
    location: portfolio.person.location,
    timezone: 'IST (UTC+5:30)',
    availability: 'available',
    availabilityText: portfolio.hero.availabilityText || '',
    email: portfolio.person.email,
    phone: portfolio.person.phone,
    showPhone: portfolio.person.showPhone,
    resumeUrl: portfolio.person.resume.href && portfolio.person.resume.href.trim() !== '' ? portfolio.person.resume.href : null,
    avatarUrl: '/images/ramesh-profile.png',
    logoUrl: '/images/ramesh-logo-cropped.png',
  },

  hero: {
    eyebrow: portfolio.hero.eyebrow,
    headingPrefix: 'Building systems that',
    headingAccent: 'make complex work',
    headingSuffix: 'simpler.',
    description: portfolio.hero.description,
    primaryCta: {
      label: portfolio.hero.primaryCta.label,
      href: portfolio.hero.primaryCta.href,
    },
    secondaryCta: {
      label: portfolio.hero.secondaryCta.label,
      href: portfolio.hero.secondaryCta.href,
    },
    techPills: [
      'Python',
      'FastAPI',
      'Microservices',
      'REST APIs',
      'PostgreSQL',
      'MySQL',
      'Docker',
      'Playwright',
      'Applied AI'
    ],
  },

  about: {
    eyebrow: 'Background & Approach',
    title: portfolio.about.heading,
    paragraphs: [...portfolio.about.paragraphs],
    focusAreas: [...portfolio.about.focusAreas],
    stats: portfolio.highlights.map((h) => ({
      value: h.value,
      label: h.label,
      description: h.note,
    })),
    principles: [
      {
        title: 'Microservices & API Gateway Architecture',
        description:
          'Structuring independent, containerized backend services behind a unified API gateway with centralized authentication, rate limiting, and request correlation.',
        codeSnippet: 'app.add_middleware(CorrelationIdMiddleware, header_name="X-Request-ID")',
      },
      {
        title: 'Deterministic Workflow Automation',
        description:
          'Designing fault-tolerant automation pipelines for specimen tracking, quality control, delta checks, and critical-value alerting.',
        codeSnippet: 'if abs(current_val - previous_val) > DELTA_THRESHOLD: trigger_alert()',
      },
      {
        title: 'Secure Access & Tenancy Isolation',
        description:
          'Enforcing role-based access control (RBAC), JWT authentication, multi-tenant database isolation, and immutable audit trails across microservices.',
        codeSnippet: 'user: CurrentUser = Depends(require_permissions(["lab:verify", "lab:approve"]))',
      },
    ],
  },

  skillCategories: mapSkills(portfolio.skills),

  projects: mapProjects(portfolio.projects),

  experience: portfolio.experience.map((exp) => ({
    id: exp.id,
    role: exp.role,
    company: exp.organization,
    location: exp.location || 'Tamil Nadu, India',
    type: 'Full-time',
    startDate: exp.dateLabel.split('–')[0].trim(),
    endDate: exp.dateLabel.split('–')[1]?.trim() || 'Present',
    current: exp.endDate === null,
    summary: exp.summary,
    responsibilities: [...exp.highlights],
    technologies: [
      'Python',
      'FastAPI',
      'Microservices',
      'Docker',
      'REST APIs',
      'JWT / RBAC',
      'MySQL',
      'PostgreSQL',
      'SQLAlchemy',
      'Rasa',
      'Ollama',
      'Razorpay',
      'Firebase'
    ],
  })),

  education: portfolio.education.map((edu, idx) => ({
    id: `edu-${idx}`,
    degree: edu.field ? `${edu.qualification} in ${edu.field}` : edu.qualification,
    institution: edu.institution,
    location: edu.location || 'Tamil Nadu, India',
    startDate: edu.dateLabel.split('–')[0]?.trim() || edu.dateLabel,
    endDate: edu.dateLabel.split('–')[1]?.trim() || edu.dateLabel,
    honors: edu.result || undefined,
    relevantCourses: edu.field
      ? [
          'Data Structures & Algorithms',
          'Database Management Systems',
          'Operating Systems',
          'Object Oriented Programming',
          'Computer Networks',
          'Machine Learning'
        ]
      : undefined,
  })),

  certifications: [
    {
      id: 'cert-0',
      name: 'Data Analytics with Python',
      issuer: 'NPTEL (IIT Madras & Roorkee)',
      issueDate: 'Jan–Apr 2023',
      credentialUrl: null,
      topics: ['Python', 'Data Analytics', 'NumPy & Pandas', 'Statistical Modeling'],
    },
    {
      id: 'cert-1',
      name: 'Artificial Intelligence Foundation Certificate',
      issuer: 'Infosys Springboard',
      issueDate: 'Certified',
      credentialUrl: null,
      topics: ['Artificial Intelligence', 'Machine Learning Foundations', 'Deep Learning Basics'],
    },
    {
      id: 'cert-2',
      name: 'Full Stack Development',
      issuer: 'Infomin Solutions',
      issueDate: 'Certified',
      credentialUrl: null,
      topics: ['Full Stack Web', 'Frontend Architecture', 'Backend Services', 'API Design'],
    },
    {
      id: 'cert-3',
      name: 'Introduction to IoT (Internet of Things)',
      issuer: 'NPTEL (IIT Kharagpur)',
      issueDate: 'Jan–Apr 2023',
      credentialUrl: null,
      topics: ['IoT Architecture', 'Sensors & Actuators', 'Embedded Connectivity', 'Cloud Integration'],
    },
    {
      id: 'cert-4',
      name: 'RDBMS PostgreSQL Training',
      issuer: 'Spoken Tutorial, IIT Bombay',
      issueDate: 'Certified',
      credentialUrl: null,
      topics: ['PostgreSQL', 'Relational DB Schema', 'Complex Queries', 'ACID & Integrity'],
    },
    {
      id: 'cert-5',
      name: 'Introduction to MongoDB',
      issuer: 'MongoDB Student Academy',
      issueDate: 'Certified',
      credentialUrl: null,
      topics: ['MongoDB', 'NoSQL Document Store', 'Aggregation Pipelines', 'Schema Modeling'],
    },
    {
      id: 'cert-6',
      name: 'UX Design by Example',
      issuer: 'Infosys Springboard',
      issueDate: 'Certified',
      credentialUrl: null,
      topics: ['UX / UI Design', 'Design Systems', 'User Flow Prototyping', 'Usability Principles'],
    },
  ],

  leadership: portfolio.leadership.map((l, idx) => ({
    id: `lead-${idx}`,
    title: l.title,
    organization: l.organization,
    dateLabel: l.dateLabel,
    description: l.description,
  })),

  socials: [
    ...portfolio.person.socialLinks.map((s) => ({
      platform: s.label.toLowerCase() as 'github' | 'linkedin',
      label: s.label,
      url: s.url,
      username: s.url.replace(/^https?:\/\/(www\.)?/, ''),
    })),
    {
      platform: 'email',
      label: 'Email',
      url: `mailto:${portfolio.person.email}`,
      username: portfolio.person.email,
    },
  ],
};

export default portfolioData;
