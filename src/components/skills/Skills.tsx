import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Server,
  Database,
  CheckSquare,
  Cloud,
  Layers,
  Sparkles,
  Plug
} from 'lucide-react';
import './Skills.css';

interface SkillCategoryDisplay {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export const Skills: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Exact categories derived directly from portfolio.ts without invented proficiency levels
  const categories: SkillCategoryDisplay[] = [
    {
      id: 'languages',
      title: 'Languages',
      description: 'Core programming languages used across backend systems, algorithms, and application logic.',
      skills: ['Python', 'Java', 'C', 'JavaScript'],
    },
    {
      id: 'backend',
      title: 'Backend & APIs',
      description: 'Microservice platforms, REST API contracts, authentication schemas, and business workflows.',
      skills: [
        'FastAPI',
        'REST API Integration',
        'Microservices',
        'SQLAlchemy',
        'JWT Authentication',
        'Role-Based Access Control (RBAC)',
        'Workflow Automation',
      ],
    },
    {
      id: 'databases',
      title: 'Databases',
      description: 'Relational data models, indexing, transaction integrity, and schema architecture.',
      skills: ['PostgreSQL', 'MySQL'],
    },
    {
      id: 'automation-testing',
      title: 'Automation & Testing',
      description: 'End-to-end browser automation, test runners, scheduled health verification, and reporting.',
      skills: ['Playwright', 'pytest', 'Browser Automation', 'Scheduled Monitoring'],
    },
    {
      id: 'devops-infra',
      title: 'DevOps & Infrastructure',
      description: 'Containerization, Linux server management, continuous integration, and observability.',
      skills: ['Linux', 'Bash', 'Docker', 'Git', 'GitHub Actions', 'Grafana'],
    },
    {
      id: 'ai-vision',
      title: 'AI & Computer Vision',
      description: 'Object detection models, conversational AI intents, local LLM inference, and semantic RAG.',
      skills: ['YOLO', 'YOLOv8', 'OpenCV', 'Rasa', 'Ollama', 'Retrieval-Augmented Generation (RAG)'],
    },
    {
      id: 'frontend-mobile',
      title: 'Frontend & Mobile',
      description: 'User interfaces and mobile frontends consuming backend API services.',
      skills: ['React', 'TypeScript', 'Flutter', 'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS'],
    },
    {
      id: 'integrations',
      title: 'Integrations & Platforms',
      description: 'Third-party APIs spanning payment gateways, SMS/email notifications, and cloud services.',
      skills: ['Firebase', 'Razorpay', 'Paytm', 'SendGrid', 'mTalkz', 'Google Maps', 'Zoom', 'Power BI'],
    },
  ];

  const totalSkillCount = categories.reduce((acc, cat) => acc + cat.skills.length, 0);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'languages':
        return <Code2 size={18} className="cat-icon" />;
      case 'backend':
        return <Server size={18} className="cat-icon" />;
      case 'databases':
        return <Database size={18} className="cat-icon" />;
      case 'automation-testing':
        return <CheckSquare size={18} className="cat-icon" />;
      case 'devops-infra':
        return <Cloud size={18} className="cat-icon" />;
      case 'ai-vision':
        return <Sparkles size={18} className="cat-icon" />;
      case 'frontend-mobile':
        return <Layers size={18} className="cat-icon" />;
      case 'integrations':
        return <Plug size={18} className="cat-icon" />;
      default:
        return <Code2 size={18} className="cat-icon" />;
    }
  };

  const filteredCategories =
    selectedFilter === 'all'
      ? categories
      : categories.filter((c) => c.id === selectedFilter);

  return (
    <section className="skills-section" id="skills" aria-label="Technical Expertise Section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Code2 size={14} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="section-title">Technical Expertise & Tooling</h2>
          <p className="section-subtitle">
            Core technologies and tools applied in developing microservices, automating operational workflows, designing database schemas, and integrating third-party APIs.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="skills-filter-nav" role="tablist" aria-label="Skills Category Filter">
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'all'}
            className={`skills-tab-btn ${selectedFilter === 'all' ? 'skills-tab-active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            <span>All Domains</span>
            <span className="skills-tab-counter">{totalSkillCount}</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedFilter === cat.id}
              className={`skills-tab-btn ${selectedFilter === cat.id ? 'skills-tab-active' : ''}`}
              onClick={() => setSelectedFilter(cat.id)}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.title}</span>
              <span className="skills-tab-counter">{cat.skills.length}</span>
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="skills-matrix-grid">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="skill-category-card"
              >
                <div className="cat-header">
                  <div className="cat-icon-frame">{getCategoryIcon(cat.id)}</div>
                  <div className="cat-header-text">
                    <h3 className="cat-title">{cat.title}</h3>
                    <p className="cat-description">{cat.description}</p>
                  </div>
                </div>

                <div className="cat-skills-cluster">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      <span className="chip-bullet" />
                      <span className="chip-text">{skill}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
export default Skills;
