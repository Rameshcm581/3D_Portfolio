import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { EXHIBITION_PROJECTS } from '../../data/universeData';
import { type SectorId } from '../../types/universe';
import { scrollStore } from '../universe/scrollStore';
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
    <div className="projects-stage-container">
      {/* Refined Exhibition Selector Dock */}
      <section className="projects-gallery-dock" aria-label="Project selector">
        <div className="projects-dock-header">
          <div className="projects-dock-title">
            <Sparkles size={16} color="var(--accent-gold)" />
            <span>Selected Projects<span className="dock-title-sub"> // 5 services in the mesh</span></span>
          </div>
          <button
            className="hero-btn-secondary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            onClick={() => {
              onNavigateSector('experience');
            }}
          >
            <span>Engineering Journey</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 5 Project Installation Cards in the Dock */}
        <div className="projects-cards-track">
          {EXHIBITION_PROJECTS.map((proj, index) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                role="button"
                tabIndex={0}
                className={`project-dock-card ${isSelected ? 'active' : ''}`}
                onMouseEnter={() => {
                  scrollStore.highlightProject = index;
                }}
                onMouseLeave={() => {
                  scrollStore.highlightProject = -1;
                }}
                onFocus={() => {
                  scrollStore.highlightProject = index;
                }}
                onBlur={() => {
                  scrollStore.highlightProject = -1;
                }}
                onClick={() => {
                  onSelectProject(proj.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectProject(proj.id);
                  }
                }}
              >
                <div>
                  <div className="dock-card-category">{proj.category}</div>
                  <h3 className="dock-card-title">{proj.shortTitle}</h3>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {proj.techStack.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.66rem',
                          padding: '0.15rem 0.45rem',
                          background: 'rgb(var(--ink-rgb) / 0.05)',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dock-card-prompt">
                  <Layers size={13} />
                  <span>OPEN CASE STUDY</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
