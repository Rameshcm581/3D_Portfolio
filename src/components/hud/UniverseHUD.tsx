import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Compass, Menu, X, ArrowRight } from 'lucide-react';
import { SECTORS, type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './UniverseHUD.css';

interface UniverseHUDProps {
  activeSectorId: SectorId;
  onNavigateSector: (id: SectorId) => void;
  coordinates: [number, number, number];
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isOverviewMode: boolean;
  onToggleOverviewMode: () => void;
}

export const UniverseHUD: React.FC<UniverseHUDProps> = ({
  activeSectorId,
  onNavigateSector,
  coordinates,
  reducedMotion,
  onToggleReducedMotion,
  isOverviewMode,
  onToggleOverviewMode,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];
  const sectorIndex = activeSector.index;

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a form input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Keys 1 through 7 for quick sector jump
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= SECTORS.length) {
        e.preventDefault();
        sound.playWarp();
        onNavigateSector(SECTORS[num - 1].id);
        return;
      }

      // Arrow keys or J/K to step through sectors
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIdx = (sectorIndex + 1) % SECTORS.length;
        sound.playWarp();
        onNavigateSector(SECTORS[nextIdx].id);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIdx = (sectorIndex - 1 + SECTORS.length) % SECTORS.length;
        sound.playWarp();
        onNavigateSector(SECTORS[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sectorIndex, onNavigateSector]);

  return (
    <header className="universe-hud" role="banner">
      {/* Top Left: Logo & Active Sector Readout */}
      <div className="hud-brand">
        <a
          href="#core"
          className="hud-logo-link"
          onClick={(e) => {
            e.preventDefault();
            sound.playWarp();
            onNavigateSector('core');
          }}
          aria-label="Return to Engineering Core"
        >
          <img
            src="/images/ramesh-logo.jpeg"
            alt="Ramesh C Logo"
            className="hud-logo-img"
          />
          <div className="hud-brand-text">
            <span className="hud-brand-name">RAMESH C</span>
            <span className="hud-brand-role">DIGITAL ENGINEERING UNIVERSE</span>
          </div>
        </a>

        {/* Telemetry pill */}
        <div className="hud-telemetry" aria-label="3D Coordinate Telemetry">
          <span className="telemetry-badge">
            <span className="telemetry-pulse" />
            SEC-0{sectorIndex + 1}
          </span>
          <span className="telemetry-coords">
            X:{coordinates[0].toFixed(1)} Y:{coordinates[1].toFixed(1)} Z:{coordinates[2].toFixed(1)}
          </span>
        </div>
      </div>

      {/* Top Center: Desktop Sector Quick Nav Links */}
      <nav className="hud-nav-desktop" aria-label="Spatial Sector Navigation">
        {SECTORS.map((sector) => {
          const isActive = sector.id === activeSectorId;
          return (
            <button
              key={sector.id}
              className={`hud-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                sound.playWarp();
                onNavigateSector(sector.id);
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-btn-index">0{sector.index + 1}</span>
              <span className="nav-btn-label">{sector.navLabel}</span>
              {isActive && <span className="nav-btn-indicator" />}
            </button>
          );
        })}
      </nav>

      {/* Top Right: System Controls & Utilities */}
      <div className="hud-controls">
        {/* Overview Mode Toggle */}
        <button
          className={`hud-control-btn ${isOverviewMode ? 'active' : ''}`}
          onClick={onToggleOverviewMode}
          title={isOverviewMode ? 'Return to 3D Stage View' : 'Overview All Sectors'}
          aria-label="Toggle Overview Mode"
        >
          <Compass className="control-icon" />
          <span className="control-label">{isOverviewMode ? 'STAGE VIEW' : 'OVERVIEW'}</span>
        </button>

        {/* Reduced Motion Toggle */}
        <button
          className={`hud-control-btn ${reducedMotion ? 'active' : ''}`}
          onClick={onToggleReducedMotion}
          title={reducedMotion ? 'Motion Reduced (Click to enable 3D camera drift)' : 'Click to reduce motion'}
          aria-label="Toggle Reduced Motion"
        >
          <Eye className="control-icon" />
          <span className="control-label">{reducedMotion ? 'STILL' : 'MOTION'}</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          className={`hud-control-btn ${!isMuted ? 'active' : ''}`}
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          aria-label={isMuted ? 'Unmute UI Sound' : 'Mute UI Sound'}
        >
          {isMuted ? <VolumeX className="control-icon" /> : <Volume2 className="control-icon" />}
        </button>

        {/* Mobile Menu Trigger */}
        <button
          className="hud-control-btn mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="control-icon" /> : <Menu className="control-icon" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="hud-mobile-drawer" role="dialog" aria-modal="true">
          <div className="mobile-drawer-header">
            <span className="drawer-title">SECTOR DIRECTORY</span>
            <button
              className="drawer-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mobile-drawer-sectors">
            {SECTORS.map((sector) => (
              <button
                key={sector.id}
                className={`drawer-sector-btn ${sector.id === activeSectorId ? 'active' : ''}`}
                onClick={() => {
                  sound.playWarp();
                  onNavigateSector(sector.id);
                  setMobileMenuOpen(false);
                }}
              >
                <div className="drawer-sector-info">
                  <span className="drawer-sector-idx">0{sector.index + 1}</span>
                  <span className="drawer-sector-name">{sector.navLabel}</span>
                </div>
                <ArrowRight size={16} className="drawer-sector-arrow" />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
