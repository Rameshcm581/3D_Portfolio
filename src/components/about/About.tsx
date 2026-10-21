import React from 'react';
import { motion } from 'motion/react';
import { User, CheckCircle2, Shield, Layers, Cpu } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import './About.css';

export const About: React.FC = () => {
  const { about, personal } = portfolioData;

  const verifiedHighlights = [
    { value: '100+', label: 'REST APIs Delivered', detail: 'Healthcare, mobility & hospitality workflows' },
    { value: '11+', label: 'Microservices Architected', detail: 'Containerized behind centralized API Gateway' },
    { value: '40+', label: 'Database Models', detail: 'Relational PostgreSQL & MySQL schema designs' },
    { value: '1.5+', label: 'Years Experience', detail: 'Python, FastAPI, Docker & automated testing' },
  ];

  const engineeringPrinciples = [
    {
      num: '01',
      title: 'Spec-First API Contracts',
      desc: 'Explicit schemas, predictable payloads, and deterministic error responses across all service boundaries.',
      icon: <Layers size={18} className="principle-icon" />,
    },
    {
      num: '02',
      title: 'Measurable Automation',
      desc: 'Replacing repetitive manual verification with scheduled worker jobs, analyzer workflows, and automated checks.',
      icon: <Cpu size={18} className="principle-icon" />,
    },
    {
      num: '03',
      title: 'Operational Reliability',
      desc: 'Audit trails, structured correlation-ID tracing, and role-based access control to keep distributed systems dependable.',
      icon: <Shield size={18} className="principle-icon" />,
    },
  ];

  return (
    <section className="about-section" id="about" aria-label="About Section">
      <div className="container">
        <div className="about-editorial-grid">
          {/* Left Column: Portrait & Verified Career Highlights */}
          <div className="about-left-column">
            {/* Photograph Card */}
            <motion.div
              className="about-portrait-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="portrait-image-wrapper">
                <img
                  src={personal.avatarUrl}
                  alt={`Professional photograph of ${personal.name}, ${personal.role}`}
                  className="about-portrait-img"
                  width={560}
                  height={560}
                  loading="lazy"
                />
                <div className="portrait-badge-overlay">
                  <span className="portrait-status-dot" />
                  <span className="portrait-status-text">Software Engineer • Python & AI</span>
                </div>
              </div>

              <div className="portrait-caption-row">
                <div className="portrait-meta-left">
                  <span className="portrait-name">{personal.name}</span>
                  <span className="portrait-location">{personal.location}</span>
                </div>
                <div className="portrait-status-pill">
                  <span>Available for roles</span>
                </div>
              </div>
            </motion.div>

            {/* Verified Career Highlights Grid */}
            <div className="verified-highlights-block">
              <span className="highlights-block-label">Verified Production Highlights</span>
              <div className="highlights-metric-grid">
                {verifiedHighlights.map((stat, idx) => (
                  <div key={idx} className="highlight-metric-tile">
                    <span className="metric-value">{stat.value}</span>
                    <span className="metric-label">{stat.label}</span>
                    <p className="metric-detail">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Principles */}
          <div className="about-right-column">
            {/* Eyebrow & Title */}
            <div className="about-header-block">
              <div className="section-eyebrow">
                <User size={14} />
                <span>Background & Engineering Focus</span>
              </div>
              <h2 className="about-heading">{about.title}</h2>
            </div>

            {/* Narrative Paragraphs */}
            <div className="about-narrative-copy">
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="about-body-text">
                  {p}
                </p>
              ))}
            </div>

            {/* Specialized Focus Areas */}
            <div className="about-focus-section">
              <span className="focus-section-label">Core Technical Focus Areas</span>
              <div className="focus-pill-cluster">
                {about.focusAreas.map((area) => (
                  <span key={area} className="focus-tag-chip">
                    <CheckCircle2 size={13} className="chip-check-icon" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Engineering Principles */}
            <div className="about-principles-container">
              <span className="principles-section-label">Core Engineering Principles</span>
              <div className="principles-stack">
                {engineeringPrinciples.map((p) => (
                  <div key={p.num} className="editorial-principle-card">
                    <div className="principle-top-row">
                      <span className="principle-number">{p.num}</span>
                      <h3 className="principle-title">{p.title}</h3>
                    </div>
                    <p className="principle-body">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Philosophy Quote */}
            <div className="about-quote-container">
              <blockquote className="about-quote-text">
                "I enjoy solving practical engineering problems: making systems easier to operate, keeping workflows dependable, and turning complex requirements into maintainable software."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
