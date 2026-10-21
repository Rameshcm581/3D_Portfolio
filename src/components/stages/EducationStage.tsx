import React from 'react';
import { GraduationCap, Award, Users, ArrowRight } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface EducationStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const EducationStage: React.FC<EducationStageProps> = ({ onNavigateSector }) => {
  const { education, certifications, leadership } = portfolioData;

  return (
    <section className="stage-card" aria-labelledby="education-heading">
      <div className="stage-eyebrow">
        <GraduationCap size={14} />
        <span>SECTOR 06 // KNOWLEDGE FOUNDATION & CREDENTIALS</span>
      </div>

      <h2 id="education-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        Academic Foundation & <span className="stage-heading-accent">Verified Certifications.</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Education Item */}
        <div style={{ background: 'rgba(18, 22, 32, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
            <GraduationCap size={18} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>FORMAL EDUCATION</span>
          </div>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {edu.degree}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--accent-gold-light)', marginBottom: '0.2rem' }}>
                {edu.institution}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{edu.startDate} – {edu.endDate}</span>
                {edu.honors && <span style={{ color: '#10b981' }}>{edu.honors}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Item */}
        <div style={{ background: 'rgba(18, 22, 32, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
            <Award size={18} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>TECHNICAL CERTIFICATIONS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {certifications.slice(0, 4).map((cert) => (
              <div key={cert.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {cert.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                  <span>{cert.issuer}</span>
                  {cert.issueDate && <span>{cert.issueDate}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Activities */}
        <div style={{ background: 'rgba(18, 22, 32, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-light)', marginBottom: '0.75rem' }}>
            <Users size={18} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>LEADERSHIP & RECOGNITION</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {leadership.slice(0, 3).map((lead) => (
              <div key={lead.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {lead.title}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                  {lead.organization && <span>{lead.organization}</span>}
                  {lead.dateLabel && <span> · {lead.dateLabel}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advance Button */}
      <button
        className="btn-primary"
        onClick={() => {
          sound.playWarp();
          onNavigateSector('contact');
        }}
      >
        <span>CONNECT AT CONNECTION POINT</span>
        <ArrowRight size={16} />
      </button>
    </section>
  );
};
