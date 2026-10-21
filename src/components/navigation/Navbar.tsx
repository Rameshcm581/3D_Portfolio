import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlight
  useEffect(() => {
    const sections = portfolioData.navigation
      .map((item) => document.querySelector(item.href))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Identity / Monogram */}
        <a href="#" className="navbar-brand" aria-label={`${portfolioData.personal.name} Portfolio Home`}>
          <img
            src={portfolioData.personal.logoUrl}
            alt={`${portfolioData.personal.name} Logo`}
            className="brand-logo-img"
            width={40}
            height={40}
            loading="eager"
          />
          <div className="brand-text">
            <span className="brand-name">{portfolioData.personal.name}</span>
            <span className="brand-tagline">{portfolioData.personal.role}</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <ul className="nav-list">
            {portfolioData.navigation.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="active-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions & Status */}
        <div className="nav-actions">
          {portfolioData.personal.availabilityText && (
            <div className="nav-status-pill" title={portfolioData.personal.availabilityText}>
              <span className="status-dot" />
              <span className="status-label">Available for roles</span>
            </div>
          )}

          {portfolioData.personal.resumeUrl && (
            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary nav-cta"
            >
              <span>Resume</span>
              <ArrowUpRight size={14} />
            </a>
          )}

          <a href="#contact" className="btn btn-sm btn-primary nav-cta">
            <span>Get in Touch</span>
            <ArrowUpRight size={14} />
          </a>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-nav" aria-label="Mobile Navigation">
              <ul className="mobile-nav-list">
                {portfolioData.navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="mobile-nav-link"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mobile-drawer-footer">
                <a
                  href="#contact"
                  className="btn btn-primary"
                  onClick={closeMenu}
                  style={{ width: '100%' }}
                >
                  <span>Start a Conversation</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
