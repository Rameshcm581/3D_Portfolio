import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface AboutStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const AboutStage: React.FC<AboutStageProps> = ({ onNavigateSector }) => {
  const { about } = portfolioData;

  return (
    <section className="stage-card" aria-labelledby="about-heading">
      <div className="stage-eyebrow">
        <span>SECTOR 02 // IDENTITY & SYSTEMS ARCHITECTURE</span>
      </div>

      <h2 id="about-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        Engineering reliable systems, <span className="stage-heading-accent">from APIs to workflows.</span>
      </h2>

      {/* Concise Biographical Narrative */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.75rem' }}>
        {about.paragraphs.map((p, idx) => (
          <p key={idx} style={{ fontSize: '0.95rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
            {p}
          </p>
        ))}
      </div>

      {/* Engineering Focus Pillars */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
          PRIMARY ENGINEERING FOCUS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {about.focusAreas.map((area, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.7rem 0.9rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                fontSize: '0.86rem',
                color: 'var(--text-primary)',
              }}
            >
              <CheckCircle2 size={16} color="var(--accent-cyan)" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Engineering Metrics */}
      <div className="stats-grid">
        {about.stats.map((st, idx) => (
          <div key={idx} className="stat-box">
            <div className="stat-value">{st.value}</div>
            <div className="stat-label">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Next Destination Action */}
      <div style={{ marginTop: '2rem' }}>
        <button
          className="btn-primary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('skills');
          }}
        >
          <span>INSPECT ENGINEERING TOPOLOGY</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
