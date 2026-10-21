import React from 'react';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { SKILL_DOMAINS } from '../../data/universeData';
import { portfolioData, type SkillCategory } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface SkillsStageProps {
  selectedDomain: string | null;
  onSelectDomain: (id: string) => void;
  onNavigateSector: (id: SectorId) => void;
}

export const SkillsStage: React.FC<SkillsStageProps> = ({
  selectedDomain,
  onSelectDomain,
  onNavigateSector,
}) => {
  const activeDomain = SKILL_DOMAINS.find((d) => d.id === selectedDomain) || SKILL_DOMAINS[0];

  // Look up matching skill category in portfolioData if present
  const matchingCategory = portfolioData.skillCategories.find(
    (c: SkillCategory) => c.id === activeDomain.id || c.title.toLowerCase().includes(activeDomain.id)
  );

  return (
    <div className="skills-stage-container">
      {/* Top Category Filter Selector */}
      <div className="skills-top-bar" role="tablist" aria-label="Technology Clusters">
        {SKILL_DOMAINS.map((domain) => {
          const isSelected = domain.id === activeDomain.id;
          return (
            <button
              key={domain.id}
              role="tab"
              aria-selected={isSelected}
              className={`skill-domain-tab ${isSelected ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectDomain(domain.id);
              }}
            >
              {domain.title}
            </button>
          );
        })}
      </div>

      {/* Floating Cluster Inspector Detail Panel */}
      <section className="skills-detail-floating" aria-labelledby="skills-domain-title">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="spatial-eyebrow">
            <Cpu size={14} />
            <span>TECHNOLOGY NETWORK CLUSTER</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            INTERACTIVE 3D NODES
          </span>
        </div>

        <h3 id="skills-domain-title" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
          {activeDomain.title}
        </h3>

        {matchingCategory && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            {matchingCategory.description}
          </p>
        )}

        {/* Verified Technologies Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {activeDomain.techs.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 192, 112, 0.25)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <CheckCircle2 size={14} color="var(--accent-cyan)" />
              <span>{tech}</span>
            </div>
          ))}
        </div>

        {/* Advance to Project Exhibition */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="hero-btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
            onClick={() => {
              sound.playWarp();
              onNavigateSector('projects');
            }}
          >
            <span>ENTER PROJECT GALAXY</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};
