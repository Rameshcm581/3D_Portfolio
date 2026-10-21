import React from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { SECTORS, type SectorId } from '../../types/universe';
import { sound } from '../universe/SoundSystem';
import './NavigationDock.css';

interface NavigationDockProps {
  activeSectorId: SectorId;
  onNavigateSector: (id: SectorId) => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeSectorId,
  onNavigateSector,
}) => {
  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];
  const currentIndex = activeSector.index;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + SECTORS.length) % SECTORS.length;
    sound.playWarp();
    onNavigateSector(SECTORS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % SECTORS.length;
    sound.playWarp();
    onNavigateSector(SECTORS[nextIdx].id);
  };

  return (
    <aside className="nav-dock" aria-label="Sector Waypoint Controller">
      {/* Sector Subtitle & Status */}
      <div className="dock-status">
        <div className="status-badge">
          <span className="status-dot" />
          <span className="status-label">{activeSector.label}</span>
        </div>
        <p className="status-tagline">{activeSector.tagline}</p>
      </div>

      {/* Center Waypoint Controls */}
      <div className="dock-controls">
        <button
          className="dock-arrow-btn"
          onClick={handlePrev}
          title="Previous Sector [Left Arrow / K]"
          aria-label="Previous Sector"
        >
          <ChevronLeft size={18} />
          <span className="arrow-text">PREV</span>
        </button>

        {/* Sector Waypoint Bars */}
        <div className="dock-waypoints" role="tablist" aria-label="Waypoint Track">
          {SECTORS.map((sector) => {
            const isActive = sector.id === activeSectorId;
            return (
              <button
                key={sector.id}
                role="tab"
                aria-selected={isActive}
                className={`waypoint-bar ${isActive ? 'active' : ''}`}
                onClick={() => {
                  sound.playWarp();
                  onNavigateSector(sector.id);
                }}
                title={`Sector 0${sector.index + 1}: ${sector.navLabel}`}
              >
                <span className="waypoint-fill" />
                <span className="waypoint-tooltip">0{sector.index + 1} {sector.navLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          className="dock-arrow-btn"
          onClick={handleNext}
          title="Next Sector [Right Arrow / J]"
          aria-label="Next Sector"
        >
          <span className="arrow-text">NEXT</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Quick Jump Action */}
      <div className="dock-quick-jump">
        {activeSectorId === 'core' ? (
          <button
            className="dock-jump-btn"
            onClick={() => {
              sound.playWarp();
              onNavigateSector('projects');
            }}
          >
            <Layers size={14} />
            <span>JUMP TO EXHIBITION</span>
          </button>
        ) : (
          <button
            className="dock-jump-btn"
            onClick={() => {
              sound.playWarp();
              onNavigateSector('core');
            }}
          >
            <span>RETURN TO CORE</span>
          </button>
        )}
      </div>
    </aside>
  );
};
