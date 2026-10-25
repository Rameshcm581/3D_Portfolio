import React from 'react';
import { Award, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import './Stages.css';

interface EducationStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const EducationStage: React.FC<EducationStageProps> = ({ onNavigateSector }) => {
  const { education, certifications, leadership } = portfolioData;

  return (
    <div className="about-stage-wrapper">
      <section className="spatial-card" aria-labelledby="education-title">
        <div className="spatial-eyebrow">
          <GraduationCap size={14} />
          <span>Academic Foundation & Verified Credentials</span>
        </div>

        <h2 id="education-title" className="spatial-heading">
          Education, Certifications & <span className="spatial-heading-accent">Leadership.</span>
        </h2>

        {/* Formal Engineering Degree */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Academic Foundation
          </h3>
          {education.map((edu, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgb(var(--ink-rgb) / 0.04)',
                border: '1px solid rgb(var(--ink-rgb) / 0.08)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '0.65rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {edu.degree}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--accent-gold-light)', fontWeight: 500 }}>
                    {edu.institution}
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {edu.honors && <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{edu.honors}</span>}
                  <div style={{ color: 'var(--text-muted)' }}>{edu.startDate} – {edu.endDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Certifications */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Verified Technical Certifications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.6rem' }}>
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgb(var(--ink-rgb) / 0.03)',
                  border: '1px solid rgb(var(--ink-rgb) / 0.06)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  <ShieldCheck size={14} color="var(--accent-gold)" />
                  <span>{cert.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {cert.issuer} {cert.issueDate ? `· ${cert.issueDate}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Leadership */}
        {leadership && leadership.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Leadership & Community
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {leadership.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgb(var(--ink-rgb) / 0.02)',
                    border: '1px solid rgb(var(--ink-rgb) / 0.05)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={14} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                    {item.organization && <span style={{ color: 'var(--text-muted)' }}>({item.organization})</span>}
                  </div>
                  {item.dateLabel && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-gold)' }}>
                      {item.dateLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advance to Contact */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            className="hero-btn-primary"
            onClick={() => {
              onNavigateSector('contact');
            }}
          >
            <span>CONNECT WITH RAMESH</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* The open side leaves room for the 3D service map */}
      <div />
    </div>
  );
};
