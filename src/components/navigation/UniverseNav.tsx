import React, { useState, useEffect } from 'react';
import { Eye, Menu, X, ArrowRight } from 'lucide-react';
import { SECTORS, type SectorId } from '../../types/universe';
import './UniverseNav.css';

interface UniverseNavProps {
  activeSectorId: SectorId;
  onNavigateSector: (id: SectorId) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const UniverseNav: React.FC<UniverseNavProps> = ({
  activeSectorId,
  onNavigateSector,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= SECTORS.length) {
        e.preventDefault();
        onNavigateSector(SECTORS[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateSector]);

  return (
    <header className="universe-nav-root" role="banner">
      <nav className="universe-nav-container" aria-label="Main Navigation">
        {/* Brand identity */}
        <a
          href="#core"
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSector('core');
          }}
          aria-label="Ramesh C - Return to Engineering Core"
        >
          <img
            src="/images/ramesh-logo-96.webp"
            alt="Ramesh C Logo"
            width={32}
            height={32}
            className="nav-brand-logo"
          />
          <div className="nav-brand-text">
            <span className="nav-brand-name">RAMESH C</span>
            <span className="nav-brand-title">Software Engineer</span>
          </div>
        </a>

        {/* Desktop Destination Links */}
        <ul className="nav-links-track" role="menubar">
          {SECTORS.map((sector) => {
            const isActive = sector.id === activeSectorId;
            return (
              <li key={sector.id} role="none">
                <button
                  role="menuitem"
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavigateSector(sector.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {sector.navLabel}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Utility Actions */}
        <div className="nav-actions">
          {/* Reduced Motion Toggle */}
          <button
            className={`nav-icon-btn ${reducedMotion ? 'active' : ''}`}
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Standard Motion Enabled' : 'Reduced Motion Enabled'}
            aria-label={reducedMotion ? 'Disable Reduced Motion' : 'Enable Reduced Motion'}
          >
            <Eye size={16} />
          </button>

          {/* Contact Direct CTA */}
          <button
            className="nav-cta-btn"
            onClick={() => {
              onNavigateSector('contact');
            }}
          >
            Get In Touch
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu" role="menu">
          {SECTORS.map((sector) => {
            const isActive = sector.id === activeSectorId;
            return (
              <button
                key={sector.id}
                role="menuitem"
                className={`nav-mobile-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigateSector(sector.id);
                  setMobileMenuOpen(false);
                }}
              >
                <span>{sector.label}</span>
                <ArrowRight size={14} />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
