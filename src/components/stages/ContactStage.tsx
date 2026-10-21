import React, { useState } from 'react';
import { Mail, Copy, Check, RotateCcw, Send, FileText } from 'lucide-react';
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
    <section className="stage-card" aria-labelledby="contact-heading">
      <div className="stage-eyebrow stage-eyebrow-cyan">
        <Mail size={14} />
        <span>SECTOR 07 // QUANTUM CONNECTION POINT</span>
      </div>

      <h2 id="contact-heading" className="stage-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
        Have an engineering problem <span className="stage-heading-accent">or project to solve?</span>
      </h2>

      <p className="stage-lead" style={{ marginBottom: '1.75rem' }}>
        I’m available for discussions regarding Python & FastAPI backend architectures, workflow and laboratory automation, database-backed microservices, and applied AI systems.
      </p>

      {/* Direct Connection Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* Direct Email Action */}
        <div style={{ background: 'rgba(18, 22, 32, 0.75)', border: '1px solid rgba(207, 168, 81, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-gold)' }}>DIRECT EMAIL</span>
            <button
              onClick={handleCopyEmail}
              style={{ background: 'transparent', border: 'none', color: copied ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
              title="Copy Email Address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
          <a
            href={`mailto:${personal.email}`}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.92rem', wordBreak: 'break-all' }}
            onClick={() => sound.playClick()}
          >
            {personal.email}
          </a>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/Rameshcm581"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'rgba(18, 22, 32, 0.75)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}
          onClick={() => sound.playClick()}
        >
          <GithubIcon size={24} className="icon-cyan" />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>CODE REPOSITORY</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>github.com/Rameshcm581</div>
          </div>
        </a>

        {/* LinkedIn Link */}
        <a
          href="https://linkedin.com/in/rameshc581mc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'rgba(18, 22, 32, 0.75)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}
          onClick={() => sound.playClick()}
        >
          <LinkedinIcon size={24} className="icon-cyan" />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>PROFESSIONAL NETWORK</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>linkedin.com/in/rameshc581mc</div>
          </div>
        </a>

        {/* Resume Download If Configured */}
        {personal.resumeUrl && (
          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'rgba(18, 22, 32, 0.75)', border: '1px solid rgba(207, 168, 81, 0.3)', borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}
            onClick={() => sound.playClick()}
          >
            <FileText size={24} color="var(--accent-gold)" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-gold)' }}>CURRICULUM VITAE</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Download Resume PDF</div>
            </div>
          </a>
        )}
      </div>

      {/* Verified Direct Transmission Console */}
      <form onSubmit={handleDirectSend} style={{ background: 'rgba(14, 18, 26, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          TRANSMIT MESSAGE CONSOLE
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input
            type="text"
            placeholder="Subject or project requirement..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', outline: 'none' }}
          />
          <textarea
            rows={3}
            placeholder="Outline your engineering scope, questions, or collaboration idea..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.78rem' }}>
              <Send size={14} />
              <span>LAUNCH EMAIL CLIENT</span>
            </button>
          </div>
        </div>
      </form>

      {/* Return to Core Action */}
      <button
        className="btn-secondary"
        onClick={() => {
          sound.playWarp();
          onNavigateSector('core');
        }}
      >
        <RotateCcw size={15} />
        <span>RETURN TO THE ENGINEERING CORE</span>
      </button>
    </section>
  );
};
