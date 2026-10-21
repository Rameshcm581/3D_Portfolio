import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { EXHIBITION_PROJECTS } from '../../data/universeData';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface ProjectsStageProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNavigateSector: (id: SectorId) => void;
}

export const ProjectsStage: React.FC<ProjectsStageProps> = ({
  selectedProjectId,
  onSelectProject,
  onNavigateSector,
}) => {
  return (
    <section className="stage-card" aria-labelledby="projects-heading">
      <div className="stage-eyebrow">
        <Sparkles size={14} />
        <span>SECTOR 04 // THE PROJECT GALAXY EXHIBITION</span>
      </div>

      <h2 id="projects-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)' }}>
        Architectural <span className="stage-heading-accent">Spatial Exhibits.</span>
      </h2>

      <p className="stage-lead" style={{ marginBottom: '1.25rem' }}>
        Each installation below corresponds to an interactive holographic 3D model in this sector. Select an exhibit to inspect its operational problem, microservice architecture, and verified technical capabilities.
      </p>

      {/* Exhibition Grid */}
      <div className="projects-gallery-grid">
        {EXHIBITION_PROJECTS.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              className={`project-exhibit-card ${isSelected ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectProject(proj.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sound.playClick();
                  onSelectProject(proj.id);
                }
              }}
            >
              <div>
                <span className="card-cat">{proj.category}</span>
                <h3 className="card-title">{proj.shortTitle}</h3>
                <p className="card-desc">
                  {proj.title}
                </p>
                <div className="tech-pills-list" style={{ marginBottom: '1rem' }}>
                  {proj.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="tech-pill gold" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                      {t}
                    </span>
                  ))}
                  {proj.techStack.length > 3 && (
                    <span className="tech-pill" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                      +{proj.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="card-link-prompt">
                <span>INSPECT DOSSIER</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance to next sector */}
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('experience');
          }}
        >
          <Layers size={16} />
          <span>TRAVEL TO ENGINEERING JOURNEY</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
