import React from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import './Stages.css';

interface ExperienceStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const ExperienceStage: React.FC<ExperienceStageProps> = ({ onNavigateSector }) => {
  const { experience } = portfolioData;
  const currentRole = experience[0];

  return (
    <div className="about-stage-wrapper">
      <section className="spatial-card" aria-labelledby="experience-title">
        <div className="spatial-eyebrow cyan">
          <Briefcase size={14} />
          <span>Professional Engineering Journey</span>
        </div>

        <h2 id="experience-title" className="spatial-heading">
          Production Systems & <span className="spatial-heading-accent">Platform Architecture.</span>
        </h2>

        {/* Current Role Header */}
        <div
          style={{
            background: 'rgb(var(--ink-rgb) / 0.04)',
            border: '1px solid rgb(var(--gold-rgb) / 0.35)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', background: 'rgb(var(--emerald-rgb) / 0.15)', border: '1px solid rgb(var(--emerald-rgb) / 0.3)', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              CURRENT ROLE · FULL-TIME
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} color="var(--accent-gold)" />
              <span>{currentRole.startDate} – {currentRole.endDate}</span>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {currentRole.role}
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.98rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
            {currentRole.company}
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
            {currentRole.summary}
          </p>
        </div>

        {/* Key Architectural Contributions */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '0.85rem', textTransform: 'uppercase' }}>
            Documented Contributions & Systems Delivered
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {currentRole.responsibilities.map((item: string, idx: number) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', lineHeight: '1.55', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Advance to Education & Credentials */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            className="hero-btn-primary"
            onClick={() => {
              onNavigateSector('education');
            }}
          >
            <span>KNOWLEDGE & CREDENTIALS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* The open side leaves room for the 3D service map */}
      <div />
    </div>
  );
};
