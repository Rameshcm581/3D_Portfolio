import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { portfolioData, type Project } from '../../data/portfolio';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import './Stages.css';

interface ProjectDossierModalProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({ projectId, onClose }) => {
  // Find project in portfolioData or synthesize from professional data
  const project: Project | undefined = portfolioData.projects.find((p) => p.id === projectId) || {
    id: 'healthcare-management',
    title: 'Professional Engineering Systems (Younder Bots)',
    category: 'Enterprise Healthcare Microservices',
    featured: true,
    showOnPortfolio: true,
    tagline: '11+ Microservices platform with laboratory analyzer automation and RBAC.',
    problem: 'Healthcare laboratory and clinical workflows require dependable specimen tracking, delta checks, and unified microservice coordination without single points of failure.',
    solution: 'Architected and deployed Python/FastAPI microservices behind a central API Gateway with Docker containerization, analyzer hardware interfacing, and structured audit trails.',
    highlights: [
      'Engineered 11+ independently deployable backend microservices behind a central API Gateway.',
      'Automated laboratory analyzer workflows (specimen tracking, QC, delta checks, critical alerts).',
      'Implemented JWT authentication, RBAC, audit trails, and correlation-ID request tracing.',
      'Constructed AI-assisted customer support with Rasa and Ollama local LLMs.',
    ],
    techStack: ['Python', 'FastAPI', 'Docker', 'MySQL', 'SQLAlchemy', 'REST APIs', 'Rasa', 'Ollama'],
    githubUrl: null,
    liveUrl: null,
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="dossier-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      onClick={onClose}
    >
      <div className="dossier-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="dossier-close-btn"
          onClick={() => {
            onClose();
          }}
          aria-label="Back to projects"
          title="Back to projects [Esc]"
        >
          <X size={20} />
        </button>

        {/* Dossier Header */}
        <div style={{ marginBottom: '1.75rem', paddingRight: '2.5rem' }}>
          <div className="spatial-eyebrow cyan">
            <ShieldCheck size={14} />
            <span>EXHIBIT DOSSIER // {project.category.toUpperCase()}</span>
          </div>
          <h2 id="dossier-title" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
            {project.title}
          </h2>
          <p style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
            {project.tagline}
          </p>
        </div>

        {/* Problem Statement */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">01 // Problem & Operational Context</h3>
          <p className="dossier-body">{project.problem}</p>
        </div>

        {/* Architectural Solution */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">02 // Engineering Architecture & Solution</h3>
          <p className="dossier-body">{project.solution}</p>
        </div>

        {/* How the pieces fit together */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">03 // System Flow</h3>
          <ArchitectureDiagram projectId={project.id} />
        </div>

        {/* Documented Key Capabilities */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">04 // Documented Technical Highlights</h3>
          <ul className="dossier-highlights-list">
            {project.highlights.map((h, idx) => (
              <li key={idx} className="dossier-highlight-item">
                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verified Technology Stack */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">05 // Verified Technology Stack</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  background: 'rgb(var(--ink-rgb) / 0.05)',
                  border: '1px solid rgb(var(--gold-rgb) / 0.3)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-gold-light)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions & Links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgb(var(--ink-rgb) / 0.08)', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            className="hero-btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
            onClick={() => {
              onClose();
            }}
          >
            <ArrowLeft size={16} />
            <span>BACK TO PROJECTS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <GithubIcon size={16} />
                <span>Codebase</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-primary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <span>Live System</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
