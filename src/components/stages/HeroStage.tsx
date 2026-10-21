import React from 'react';
import { ArrowRight, Layers, MessageSquare } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface HeroStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({ onNavigateSector }) => {
  const { hero, personal } = portfolioData;

  return (
    <section className="stage-card" aria-labelledby="hero-heading">
      <div className="stage-eyebrow">
        <span className="telemetry-dot" />
        <span>RAMESH C // {hero.eyebrow}</span>
      </div>

      <h1 id="hero-heading" className="stage-heading">
        {hero.headingPrefix} <span className="stage-heading-accent">{hero.headingAccent}</span> {hero.headingSuffix}
      </h1>

      <p className="stage-lead">
        {hero.description}
      </p>

      {/* Primary Actions */}
      <div className="stage-actions">
        <button
          className="btn-primary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('projects');
          }}
        >
          <span>EXPLORE MY WORK</span>
          <ArrowRight size={16} />
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('about');
          }}
        >
          <Layers size={15} />
          <span>ENTER UNIVERSE</span>
        </button>

        <button
          className="btn-secondary btn-cyan"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('contact');
          }}
        >
          <MessageSquare size={15} />
          <span>GET IN TOUCH</span>
        </button>
      </div>

      {/* Core Engineering Stack Tech Badges */}
      <div className="tech-pills-list" aria-label="Core Technical Competencies">
        {hero.techPills.map((tech, idx) => (
          <span
            key={tech}
            className={`tech-pill ${idx < 3 ? 'gold' : idx < 6 ? 'cyan' : ''}`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Availability Telemetry */}
      {personal.availabilityText && (
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>{personal.availabilityText}</span>
        </div>
      )}
    </section>
  );
};
