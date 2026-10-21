import React from 'react';
import { ArrowUp } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const { personal, navigation } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img
                src={personal.logoUrl}
                alt={`${personal.name} Logo`}
                className="footer-logo-img"
                width={44}
                height={44}
                loading="lazy"
              />
              <span className="footer-name">{personal.name}</span>
            </div>
            <p className="footer-tagline">{personal.tagline}</p>
          </div>

          {/* Quick Nav Links */}
          <nav className="footer-nav" aria-label="Footer Navigation">
            <ul className="footer-nav-list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="footer-nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Back to Top */}
          <div className="footer-action">
            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Rule & Copyright */}
        <div className="footer-bottom">
          <div className="copyright-text">
            © {CURRENT_YEAR} {personal.name}. All technical specifications & rights reserved.
          </div>
          <div className="footer-tech-note">
            <span>Built with React 19, TypeScript, Three.js & WebGL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
