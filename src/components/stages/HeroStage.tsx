import React from 'react';
import { ArrowRight, Compass, MessageSquare } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './Stages.css';

interface HeroStageProps {
  onNavigateSector: (id: SectorId) => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({ onNavigateSector }) => {
  const { hero } = portfolioData;

  return (
    <section className="hero-stage-container" aria-labelledby="hero-title">
      {/* Eyebrow Identity Pill */}
      <div className="hero-identity-tag">
        <Compass size={14} />
        <span>RAMESH C</span>
      </div>

      {/* Main Personal Name */}
      <h1 id="hero-title" className="hero-title-name">
        RAMESH C
      </h1>

      {/* Subrole & Specializations */}
      <div className="hero-subrole">
        SOFTWARE ENGINEER · BACKEND ENGINEERING · AUTOMATION · APPLIED AI
      </div>

      {/* Headline */}
      <h2 className="hero-headline">
        Building systems that <span className="hero-headline-accent">make complex work simpler.</span>
      </h2>

      {/* Supporting Text */}
      <p className="hero-description">
        I develop Python-based backend services, API-driven products, and workflow automation across healthcare, mobility, hospitality, and AI-powered applications.
      </p>

      {/* Primary Actions: Explore the Universe, Contact Me */}
      <div className="hero-actions">
        <button
          className="hero-btn-primary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('projects');
          }}
        >
          <span>EXPLORE THE UNIVERSE</span>
          <ArrowRight size={16} />
        </button>

        <button
          className="hero-btn-secondary"
          onClick={() => {
            sound.playWarp();
            onNavigateSector('contact');
          }}
        >
          <MessageSquare size={16} />
          <span>CONTACT ME</span>
        </button>
      </div>

      {/* Core Engineering Tech Badges */}
      <div className="hero-tech-pills" aria-label="Core Technical Stack">
        {hero.techPills.map((tech, idx) => (
          <span
            key={tech}
            className={`hero-tech-tag ${idx < 3 ? 'gold' : idx < 6 ? 'cyan' : ''}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};
