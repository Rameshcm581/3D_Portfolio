import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { portfolio } from '../../../portfolio';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import './Contact.css';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = portfolio.person.email;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-label="Contact Section">
      <div className="container">
        <div className="contact-editorial-layout">
          {/* Header Block */}
          <div className="contact-header-block">
            <div className="section-eyebrow">
              <Mail size={14} />
              <span>Direct Communication</span>
            </div>
            <h2 className="contact-headline">
              Have a project or engineering problem to solve?
            </h2>
            <p className="contact-lead-text">
              I’m open to discussing backend systems architecture, workflow automation, API integrations, and applied AI roles. Reach out directly via email or professional profiles.
            </p>
          </div>

          {/* Action Hub Grid */}
          <div className="contact-action-grid">
            {/* Direct Email Primary Card */}
            <div className="contact-primary-card">
              <div className="card-top-tag">
                <span className="direct-dot" />
                <span>Primary Channel</span>
              </div>

              <div className="card-content-wrap">
                <span className="email-address-display">{email}</span>
                <p className="email-subtext">
                  Direct communication for contract engineering, full-time opportunities, and technical discussions.
                </p>
              </div>

              <div className="email-actions-row">
                <a
                  href={`mailto:${email}?subject=Portfolio%20enquiry`}
                  className="btn btn-primary"
                >
                  <Mail size={16} />
                  <span>Send Direct Email</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn btn-secondary copy-action-btn"
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Channels & Availability */}
            <div className="contact-channels-column">
              {/* GitHub */}
              <a
                href="https://github.com/Rameshcm581"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-card"
                aria-label="Visit Ramesh C on GitHub"
              >
                <div className="channel-icon-wrap">
                  <GithubIcon size={20} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">GitHub</span>
                  <span className="channel-handle">github.com/Rameshcm581</span>
                </div>
                <ArrowUpRight size={16} className="channel-arrow" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/rameshc581mc"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-card"
                aria-label="Visit Ramesh C on LinkedIn"
              >
                <div className="channel-icon-wrap">
                  <LinkedinIcon size={20} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">LinkedIn</span>
                  <span className="channel-handle">linkedin.com/in/rameshc581mc</span>
                </div>
                <ArrowUpRight size={16} className="channel-arrow" />
              </a>

              {/* Location & Operating Context */}
              <div className="location-context-card">
                <div className="context-item">
                  <MapPin size={15} className="text-gold" />
                  <span>Erode, Tamil Nadu, India (IST / UTC+5:30)</span>
                </div>
                <div className="context-item">
                  <span className="status-dot" />
                  <span>Available for software engineering & backend roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
