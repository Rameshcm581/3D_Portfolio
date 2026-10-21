import React from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { portfolio } from '../../../portfolio';
import { GithubIcon } from '../common/BrandIcons';
import {
  SiteWatchVisual,
  RetailManagementVisual,
  ThirukuralRagVisual,
  BrainTumorVisual
} from './visuals/ProjectVisuals';
import './Projects.css';

interface ProjectDisplay {
  id: string;
  title: string;
  categoryLabel: string;
  summary: string;
  problem: string;
  contribution: string;
  features: string[];
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
}

export const Projects: React.FC = () => {
  // Map real projects from portfolio.ts where showOnPortfolio === true
  const displayedProjects: ProjectDisplay[] = portfolio.projects
    .filter((p) => p.showOnPortfolio)
    .map((p) => ({
      id: p.id,
      title: p.title,
      categoryLabel: p.category === 'personal' ? 'Personal Architecture Project' : 'Enterprise Platform',
      summary: p.summary,
      problem: p.problem || 'Operational complexity requiring automated verification and reliable backend workflows.',
      contribution: p.solution || 'Engineered modular backend services with Python, relational databases, and automated testing.',
      features: [...p.highlights],
      technologies: [...p.technologies],
      githubUrl: typeof (p as any).githubUrl === 'string' && (p as any).githubUrl.trim() !== '' ? (p as any).githubUrl : null,
      liveUrl: typeof (p as any).liveDemoUrl === 'string' && (p as any).liveDemoUrl.trim() !== '' ? (p as any).liveDemoUrl : null,
    }));

  const renderProjectVisual = (id: string) => {
    switch (id) {
      case 'sitewatch':
        return <SiteWatchVisual />;
      case 'retail-management':
        return <RetailManagementVisual />;
      case 'thirukural-rag':
        return <ThirukuralRagVisual />;
      case 'brain-tumor-detection':
        return <BrainTumorVisual />;
      default:
        return <SiteWatchVisual />;
    }
  };

  return (
    <section className="projects-section" id="projects" aria-label="Featured Projects Section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <FolderGit2 size={14} />
            <span>Project Showcases</span>
          </div>
          <h2 className="section-title">Engineered Systems & Applied Projects</h2>
          <p className="section-subtitle">
            Demonstrations of backend service architecture, automated monitoring daemons, multi-tenant billing workflows, semantic retrieval pipelines, and computer vision.
          </p>
        </div>

        {/* Individual Project Showcases Stream */}
        <div className="projects-showcase-stream">
          {displayedProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-showcase-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              {/* Project Meta Bar */}
              <div className="showcase-meta-bar">
                <div className="meta-bar-left">
                  <span className="project-sequence-num">0{index + 1}</span>
                  <span className="project-category-badge">{project.categoryLabel}</span>
                </div>

                {/* Direct Action Links (Only rendered when URLs actually exist) */}
                <div className="showcase-links">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link"
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <GithubIcon size={15} />
                      <span>Source Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-link project-demo-link"
                      aria-label={`Open live demo of ${project.title}`}
                    >
                      <ExternalLink size={15} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Showcase Grid: Narrative Spec on Left, Custom Visual on Right */}
              <div className="showcase-body-grid">
                {/* Left: Engineering Specification */}
                <div className="showcase-spec-col">
                  <h3 className="showcase-title">{project.title}</h3>
                  <p className="showcase-summary">{project.summary}</p>

                  {/* Problem & Contribution Matrix */}
                  <div className="spec-comparison-box">
                    <div className="spec-item">
                      <div className="spec-item-header">
                        <AlertCircle size={14} className="text-amber" />
                        <span className="spec-item-title">Problem Solved:</span>
                      </div>
                      <p className="spec-item-text">{project.problem}</p>
                    </div>

                    <div className="spec-item">
                      <div className="spec-item-header">
                        <Wrench size={14} className="text-gold" />
                        <span className="spec-item-title">My Contribution:</span>
                      </div>
                      <p className="spec-item-text">{project.contribution}</p>
                    </div>
                  </div>

                  {/* Key Features List */}
                  <div className="showcase-features-box">
                    <span className="features-header-label">Key Capabilities & Features</span>
                    <ul className="features-list">
                      {project.features.map((feat, fIdx) => (
                        <li key={fIdx} className="feature-list-item">
                          <CheckCircle2 size={13} className="feature-check-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="showcase-tech-row">
                    {project.technologies.map((t) => (
                      <span key={t} className="tech-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Bespoke Custom Visual for each project */}
                <div className="showcase-visual-col">
                  {renderProjectVisual(project.id)}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Projects;
