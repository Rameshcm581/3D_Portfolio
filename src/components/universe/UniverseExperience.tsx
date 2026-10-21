import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type SectorId, SECTORS } from '../../types/universe';
import { UniverseCanvas } from './UniverseCanvas';
import { UniverseHUD } from '../hud/UniverseHUD';
import { NavigationDock } from '../hud/NavigationDock';
import { HeroStage } from '../stages/HeroStage';
import { AboutStage } from '../stages/AboutStage';
import { SkillsStage } from '../stages/SkillsStage';
import { ProjectsStage } from '../stages/ProjectsStage';
import { ProjectDossierModal } from '../stages/ProjectDossierModal';
import { ExperienceStage } from '../stages/ExperienceStage';
import { EducationStage } from '../stages/EducationStage';
import { ContactStage } from '../stages/ContactStage';
import { sound } from './SoundSystem';

export const UniverseExperience: React.FC = () => {
  const [activeSectorId, setActiveSectorId] = useState<SectorId>('core');
  const [selectedSkillDomain, setSelectedSkillDomain] = useState<string | null>('backend');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number, number]>([0, 1.2, 7.5]);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isOverviewMode, setIsOverviewMode] = useState(false);

  const wheelThrottleRef = useRef(false);

  // Listen to external preference changes for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const matched = SECTORS.find((s) => s.id === hash);
      if (matched) {
        setActiveSectorId(matched.id);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate to a sector and update URL hash
  const navigateToSector = useCallback((sectorId: SectorId) => {
    setActiveSectorId(sectorId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${sectorId}`);
    }
  }, []);

  // Scroll / Wheel navigation through the 3D spatial journey
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If project modal is open or target is scrollable and not at boundary, don't hijack
      if (selectedProjectId) return;

      const target = e.target as HTMLElement;
      const isInsideScrollable = target.closest('.stage-viewport');
      if (isInsideScrollable) {
        const viewport = isInsideScrollable as HTMLElement;
        const isAtTop = viewport.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom =
          viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2 && e.deltaY > 0;
        if (!isAtTop && !isAtBottom) {
          return; // Let user scroll inside the content panel
        }
      }

      if (wheelThrottleRef.current) return;
      if (Math.abs(e.deltaY) < 30) return; // Ignore micro jitter

      wheelThrottleRef.current = true;
      setTimeout(() => {
        wheelThrottleRef.current = false;
      }, 950);

      const currentIdx = SECTORS.findIndex((s) => s.id === activeSectorId);
      if (e.deltaY > 0) {
        // Scroll down -> Next sector
        const nextIdx = (currentIdx + 1) % SECTORS.length;
        sound.playWarp();
        navigateToSector(SECTORS[nextIdx].id);
      } else {
        // Scroll up -> Previous sector
        const prevIdx = (currentIdx - 1 + SECTORS.length) % SECTORS.length;
        sound.playWarp();
        navigateToSector(SECTORS[prevIdx].id);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSectorId, selectedProjectId, navigateToSector]);

  return (
    <div className="universe-experience-root" style={{ width: '100%', height: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Accessible skip link */}
      <a href="#active-stage" className="skip-to-content">
        Skip to sector content
      </a>

      {/* 3D WebGL Canvas Layer */}
      <UniverseCanvas
        activeSectorId={activeSectorId}
        reducedMotion={reducedMotion}
        selectedSkillDomain={selectedSkillDomain}
        onSelectSkillDomain={setSelectedSkillDomain}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onCoordinatesUpdate={setCoordinates}
      />

      {/* Futuristic Persistent Top HUD */}
      <UniverseHUD
        activeSectorId={activeSectorId}
        onNavigateSector={navigateToSector}
        coordinates={coordinates}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        isOverviewMode={isOverviewMode}
        onToggleOverviewMode={() => setIsOverviewMode(!isOverviewMode)}
      />

      {/* Spatially Composed Semantic Stage Overlays */}
      <main id="active-stage" className="stage-container" role="main">
        <div className="stage-viewport">
          {activeSectorId === 'core' && (
            <HeroStage onNavigateSector={navigateToSector} />
          )}

          {activeSectorId === 'about' && (
            <AboutStage onNavigateSector={navigateToSector} />
          )}

          {activeSectorId === 'skills' && (
            <SkillsStage
              selectedDomain={selectedSkillDomain}
              onSelectDomain={setSelectedSkillDomain}
              onNavigateSector={navigateToSector}
            />
          )}

          {activeSectorId === 'projects' && (
            <ProjectsStage
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => setSelectedProjectId(id)}
              onNavigateSector={navigateToSector}
            />
          )}

          {activeSectorId === 'experience' && (
            <ExperienceStage onNavigateSector={navigateToSector} />
          )}

          {activeSectorId === 'education' && (
            <EducationStage onNavigateSector={navigateToSector} />
          )}

          {activeSectorId === 'contact' && (
            <ContactStage onNavigateSector={navigateToSector} />
          )}
        </div>
      </main>

      {/* Detailed Project Dossier Modal when exhibit is inspected */}
      {selectedProjectId && (
        <ProjectDossierModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* Bottom Waypoint Dock & Controller */}
      <NavigationDock
        activeSectorId={activeSectorId}
        onNavigateSector={navigateToSector}
      />
    </div>
  );
};
