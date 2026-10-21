import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { portfolio } from '../../../portfolio';
import './Experience.css';

export const Experience: React.FC = () => {
  // Direct data mapping from portfolio.ts
  const experiences = portfolio.experience.map((item) => ({
    id: item.id,
    role: item.role,
    company: item.organization,
    location: item.location || 'Tamil Nadu, India',
    dateLabel: item.dateLabel,
    current: !item.endDate,
    summary: item.summary,
    responsibilities: [...item.highlights],
    technologies: [
      'Python',
      'FastAPI',
      'Microservices',
      'Docker',
      'REST APIs',
      'JWT / RBAC',
      'MySQL',
      'PostgreSQL',
      'SQLAlchemy',
      'Rasa',
      'Ollama',
      'Razorpay',
      'Firebase'
    ],
  }));

  return (
    <section className="experience-section" id="experience" aria-label="Professional Experience Section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Briefcase size={14} />
            <span>Professional Experience</span>
          </div>
          <h2 className="section-title">Career Progression & Technical Impact</h2>
          <p className="section-subtitle">
            Hands-on software development building microservices platforms, automated laboratory workflows, healthcare systems, and AI-assisted platforms.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.article
              key={exp.id}
              className={`timeline-card ${exp.current ? 'timeline-card-active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              {/* Header: Role, Company, and Non-Duplicated Date Badge */}
              <div className="timeline-header-row">
                <div className="role-company-block">
                  <h3 className="experience-role">{exp.role}</h3>
                  <div className="company-location-row">
                    <span className="experience-company">{exp.company}</span>
                    <span className="dot-divider">•</span>
                    <span className="experience-location">
                      <MapPin size={13} />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                <div className="experience-date-tag">
                  <Calendar size={13} />
                  <span>{exp.dateLabel}</span>
                  {exp.current && <span className="active-indicator-dot" title="Current Role" />}
                </div>
              </div>

              {/* Role Summary */}
              <p className="experience-summary">{exp.summary}</p>

              {/* Verified Technical Contributions */}
              <div className="experience-deliverables-block">
                <span className="deliverables-heading">Key Technical Contributions & Deliverables</span>
                <ul className="deliverables-list">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="deliverable-item">
                      <CheckCircle2 size={14} className="deliverable-check" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Applied */}
              <div className="experience-tech-footer">
                <span className="tech-footer-label">Technologies Applied:</span>
                <div className="experience-tech-pills">
                  {exp.technologies.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Experience;
