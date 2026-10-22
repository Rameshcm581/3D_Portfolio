import React, { useState } from 'react';
import { Mail, Copy, Check, Send, RotateCcw } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface ContactStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const ContactStage: React.FC<ContactStageProps> = ({ onNavigateSector }) => {
  const { personal } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectSend = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const mailtoUrl = `mailto:${personal.email}?subject=${encodeURIComponent(
      subject.trim() || 'Software Engineering Project Enquiry'
    )}&body=${encodeURIComponent(message.trim())}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="about-stage-wrapper">
      <section className="spatial-card" aria-labelledby="contact-title">
        <div className="spatial-eyebrow cyan">
          <Mail size={14} />
          <span>Quantum Transmission Channel</span>
        </div>

        <h2 id="contact-title" className="spatial-heading">
          Have an engineering problem <span className="spatial-heading-accent">or project to solve?</span>
        </h2>

        <p style={{ fontSize: '0.94rem', lineHeight: '1.65', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          I’m open to discussions regarding Python & FastAPI backend architectures, workflow and laboratory automation, database-backed microservices, and applied AI systems.
        </p>

        {/* Direct Email Card with One-Click Copy */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(223, 192, 112, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-gold)' }}>DIRECT EMAIL</span>
            <button
              onClick={handleCopyEmail}
              style={{
                background: 'transparent',
                border: 'none',
                color: copied ? '#10b981' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
              title="Copy Email Address"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY'}</span>
            </button>
          </div>
          <a
            href={`mailto:${personal.email}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {personal.email}
          </a>
        </div>

        {/* Interactive Quick Transmission Form */}
        <form onSubmit={handleDirectSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div>
            <label htmlFor="contact-subject" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              SUBJECT / INQUIRY TOPIC
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Backend architecture / Automation"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.7rem 0.9rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div>
            <label htmlFor="contact-message" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              MESSAGE DETAILS
            </label>
            <textarea
              id="contact-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your technical requirements or collaboration opportunity..."
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.7rem 0.9rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="hero-btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Send size={15} />
            <span className="contact-submit-label">TRANSMIT MESSAGE (EMAIL)</span>
          </button>
        </form>

        {/* Verified Social Connect & Return to Core */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="https://github.com/Rameshcm581"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-secondary"
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <GithubIcon size={15} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/rameshc581mc"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-secondary"
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <LinkedinIcon size={15} />
              <span>LinkedIn</span>
            </a>
          </div>

          <button
            className="hero-btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.8rem' }}
            onClick={() => {
              sound.playWarp();
              onNavigateSector('core');
            }}
          >
            <RotateCcw size={14} />
            <span>RETURN TO CORE</span>
          </button>
        </div>
      </section>

      {/* The open side leaves room for the 3D service map */}
      <div />
    </div>
  );
};
