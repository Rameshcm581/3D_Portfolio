import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { portfolioData, type Project } from '../../data/portfolio';
import { sound } from '../universe/SoundSystem';
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
        sound.playClick();
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
      <div className="dossier-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="dossier-close-btn"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close Project Dossier"
        >
          <X size={20} />
        </button>

        {/* Dossier Header */}
        <div style={{ marginBottom: '1.75rem', paddingRight: '2.5rem' }}>
          <div className="stage-eyebrow stage-eyebrow-cyan">
            <ShieldCheck size={14} />
            <span>EXHIBIT DOSSIER // {project.category.toUpperCase()}</span>
          </div>
          <h2 id="dossier-title" className="stage-heading" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', marginBottom: '0.5rem' }}>
            {project.title}
          </h2>
          <p style={{ color: 'var(--accent-gold-light)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
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

        {/* Documented Key Capabilities */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">03 // Documented Technical Highlights</h3>
          <ul className="dossier-highlights-list">
            {project.highlights.map((h, idx) => (
              <li key={idx} className="dossier-highlight-item">
                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Employed */}
        <div className="dossier-section">
          <h3 className="dossier-section-title">04 // Technology Stack</h3>
          <div className="tech-pills-list">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-pill gold">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Verified Links (Only displayed when configured) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <GithubIcon size={16} />
              <span>VIEW SOURCE REPOSITORY</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={16} />
              <span>LIVE DEMO</span>
            </a>
          )}

          <button
            className="btn-secondary btn-cyan"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
          >
            <span>RETURN TO EXHIBITION [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
