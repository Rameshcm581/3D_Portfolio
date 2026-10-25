import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import './Stages.css';

interface AboutStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const AboutStage: React.FC<AboutStageProps> = ({ onNavigateSector }) => {
  const { about } = portfolioData;

  return (
    <div className="about-stage-wrapper">
      <section className="spatial-card" aria-labelledby="about-title">
        <div className="spatial-eyebrow">
          <span>Identity & Systems Architecture</span>
        </div>

        <h2 id="about-title" className="spatial-heading">
          Engineering reliable systems, <span className="spatial-heading-accent">from APIs to workflows.</span>
        </h2>

        {/* Concise Biographical Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {about.paragraphs.map((p, idx) => (
            <p key={idx} style={{ fontSize: '0.94rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Primary Engineering Focus */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Primary Engineering Focus
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {about.focusAreas.map((area, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem 0.85rem',
                  background: 'rgb(var(--ink-rgb) / 0.04)',
                  border: '1px solid rgb(var(--ink-rgb) / 0.08)',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  color: 'var(--text-primary)',
                }}
              >
                <CheckCircle2 size={15} color="var(--accent-cyan)" />
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
        <div style={{ marginTop: '1.5rem' }}>
          <button
            className="hero-btn-primary"
            onClick={() => {
              onNavigateSector('skills');
            }}
          >
            <span>EXPLORE TECHNOLOGY NETWORKS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* The open side leaves room for the 3D service map */}
      <div />
    </div>
  );
};
