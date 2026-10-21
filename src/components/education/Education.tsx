import React from 'react';
import { motion } from 'motion/react';
import { Award, Calendar, ShieldCheck } from 'lucide-react';
import { portfolio } from '../../../portfolio';
import './Education.css';

export const Education: React.FC = () => {
  // Direct mapping from portfolio.ts without invented dates or assumptions
  const certifications = portfolio.certifications.map((cert, idx) => ({
    id: `cert-${idx}`,
    name: cert.name,
    issuer: cert.issuer,
    dateLabel: cert.dateLabel,
  }));

  return (
    <section className="certifications-section" id="certifications" aria-label="Professional Certifications Section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Award size={14} />
            <span>Accredited Credentials</span>
          </div>
          <h2 className="section-title">Professional Certifications</h2>
          <p className="section-subtitle">
            Formal technical certifications across data analytics, relational databases, AI fundamentals, full-stack development, and IoT.
          </p>
        </div>

        {/* Certifications Grid with Equal Card Heights */}
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="cert-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="cert-top-row">
                <div className="cert-icon-frame">
                  <Award size={18} className="cert-gold-icon" />
                </div>
                {cert.dateLabel ? (
                  <div className="cert-date-badge">
                    <Calendar size={12} />
                    <span>{cert.dateLabel}</span>
                  </div>
                ) : (
                  <div className="cert-verified-badge">
                    <ShieldCheck size={12} />
                    <span>Accredited</span>
                  </div>
                )}
              </div>

              <div className="cert-content-block">
                <h3 className="cert-card-title">{cert.name}</h3>
                <div className="cert-issuer-label">{cert.issuer}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Education;
