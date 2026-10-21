import React from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface ExperienceStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const ExperienceStage: React.FC<ExperienceStageProps> = ({ onNavigateSector }) => {
  const { experience } = portfolioData;
  const currentRole = experience[0];

  return (
    <section className="stage-card" aria-labelledby="experience-heading">
      <div className="stage-eyebrow stage-eyebrow-cyan">
        <Briefcase size={14} />
        <span>SECTOR 05 // PROFESSIONAL ENGINEERING JOURNEY</span>
      </div>

      <h2 id="experience-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        Architectural Pathway & <span className="stage-heading-accent">Milestones.</span>
      </h2>

      {/* Main Professional Milestone Card */}
      <div
        style={{
          background: 'rgba(18, 22, 32, 0.75)',
          border: '1px solid rgba(207, 168, 81, 0.35)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.72rem', color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                CURRENT ROLE
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                FULL-TIME
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentRole.role}
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
              {currentRole.company}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color="var(--accent-gold)" />
              <span>{currentRole.startDate} – {currentRole.endDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="var(--accent-cyan)" />
              <span>{currentRole.location}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {currentRole.summary}
        </p>

        {/* Responsibilities list */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
            DOCUMENTED ARCHITECTURAL RESPONSIBILITIES
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {currentRole.responsibilities.map((resp, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Used */}
        <div className="tech-pills-list">
          {currentRole.technologies.map((t) => (
            <span key={t} className="tech-pill gold">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Advance Button */}
      <button
        className="btn-primary"
        onClick={() => {
          sound.playWarp();
          onNavigateSector('education');
        }}
      >
        <span>PROCEED TO CREDENTIALS & EDUCATION</span>
        <ArrowRight size={16} />
      </button>
    </section>
  );
};
