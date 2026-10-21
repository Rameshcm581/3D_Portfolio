import React from 'react';
import { ArrowRight, Cpu, Layers } from 'lucide-react';
import { SKILL_DOMAINS } from '../../data/universeData';
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
  const activeNode = SKILL_DOMAINS.find((d) => d.id === selectedDomain) || SKILL_DOMAINS[0];

  return (
    <section className="stage-card" aria-labelledby="skills-heading">
      <div className="stage-eyebrow stage-eyebrow-cyan">
        <Cpu size={14} />
        <span>SECTOR 03 // ENGINEERING SYSTEMS TOPOLOGY</span>
      </div>

      <h2 id="skills-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        Interconnected <span className="stage-heading-accent">Technical Infrastructure.</span>
      </h2>

      <p className="stage-lead" style={{ marginBottom: '1.5rem' }}>
        Select a technical subsystem below or in the 3D network to inspect verified tools, architecture conduits, and framework dependencies.
      </p>

      {/* Domain Selection Tabs (Connected to 3D Nodes) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.75rem',
        }}
        role="tablist"
        aria-label="Skill Domain Selector"
      >
        {SKILL_DOMAINS.map((domain) => {
          const isSelected = domain.id === activeNode.id;
          return (
            <button
              key={domain.id}
              role="tab"
              aria-selected={isSelected}
              className={`hud-control-btn ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? 'var(--accent-gold)' : undefined,
                background: isSelected ? 'rgba(207, 168, 81, 0.18)' : undefined,
                color: isSelected ? 'var(--accent-gold-light)' : undefined,
                padding: '0.5rem 0.9rem',
                fontSize: '0.78rem',
              }}
              onClick={() => {
                sound.playClick();
                onSelectDomain(domain.id);
              }}
            >
              <span>{domain.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Domain Deep Dive Card */}
      <div
        style={{
          background: 'rgba(18, 22, 32, 0.75)',
          border: '1px solid rgba(207, 168, 81, 0.3)',
          borderRadius: '14px',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
              ACTIVE NODE
            </span>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeNode.title}
            </h3>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            CONNECTED CONDUITS: {activeNode.connections.join(' · ').toUpperCase()}
          </span>
        </div>

        {/* Tech list */}
        <div className="tech-pills-list">
          {activeNode.techs.map((tech, idx) => (
            <span key={tech} className={`tech-pill ${idx === 0 ? 'gold' : 'cyan'}`}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Next CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn-primary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('projects');
          }}
        >
          <Layers size={16} />
          <span>ENTER THE PROJECT GALAXY</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
