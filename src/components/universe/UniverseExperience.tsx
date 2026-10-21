import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type SectorId, SECTORS } from '../../types/universe';
import { UniverseCanvas } from './UniverseCanvas';
import { UniverseNav } from '../navigation/UniverseNav';
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
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const wheelThrottleRef = useRef(false);

  // Listen to system preference changes for reduced motion
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
    // If navigating away from projects, clear selected project
    if (sectorId !== 'projects') {
      setSelectedProjectId(null);
    }
    setActiveSectorId(sectorId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${sectorId}`);
    }
  }, []);

  // Continuous Cinematic Wheel Travel through the 7 Destinations
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If project dossier is open, allow internal reading/scrolling
      if (selectedProjectId) return;

      // Allow scrolling inside an open spatial-card if not at the scroll boundaries
      const target = e.target as HTMLElement;
      const card = target.closest('.spatial-card, .dossier-drawer');
      if (card) {
        const el = card as HTMLElement;
        const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2 && e.deltaY > 0;
        if (!isAtTop && !isAtBottom) {
          return;
        }
      }

      if (wheelThrottleRef.current) return;
      if (Math.abs(e.deltaY) < 35) return; // Ignore micro jitter

      wheelThrottleRef.current = true;
      setTimeout(() => {
        wheelThrottleRef.current = false;
      }, 750);

      const currentIdx = SECTORS.findIndex((s) => s.id === activeSectorId);
      if (e.deltaY > 0) {
        // Scroll down -> Next destination
        const nextIdx = Math.min(currentIdx + 1, SECTORS.length - 1);
        if (nextIdx !== currentIdx) {
          sound.playWarp();
          navigateToSector(SECTORS[nextIdx].id);
        }
      } else {
        // Scroll up -> Previous destination
        const prevIdx = Math.max(currentIdx - 1, 0);
        if (prevIdx !== currentIdx) {
          sound.playWarp();
          navigateToSector(SECTORS[prevIdx].id);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSectorId, selectedProjectId, navigateToSector]);

  // Keyboard navigation (Arrow keys, PageUp/PageDown, Home/End)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (selectedProjectId) return;

      const currentIdx = SECTORS.findIndex((s) => s.id === activeSectorId);

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'j') {
        e.preventDefault();
        const nextIdx = Math.min(currentIdx + 1, SECTORS.length - 1);
        if (nextIdx !== currentIdx) {
          sound.playWarp();
          navigateToSector(SECTORS[nextIdx].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'k') {
        e.preventDefault();
        const prevIdx = Math.max(currentIdx - 1, 0);
        if (prevIdx !== currentIdx) {
          sound.playWarp();
          navigateToSector(SECTORS[prevIdx].id);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        sound.playWarp();
        navigateToSector('core');
      } else if (e.key === 'End') {
        e.preventDefault();
        sound.playWarp();
        navigateToSector('contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectorId, selectedProjectId, navigateToSector]);

  return (
    <div
      className="universe-experience-root"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#07080b',
      }}
    >
      {/* Accessible skip link */}
      <a href="#active-stage" className="skip-to-content">
        Skip to main content
      </a>

      {/* 3D WebGL Canvas Layer */}
      <UniverseCanvas
        activeSectorId={activeSectorId}
        reducedMotion={reducedMotion}
        selectedSkillDomain={selectedSkillDomain}
        onSelectSkillDomain={setSelectedSkillDomain}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          // Ensure we are in projects destination
          if (activeSectorId !== 'projects') {
            navigateToSector('projects');
          }
        }}
      />

      {/* Minimal Luxury Navigation Header */}
      <UniverseNav
        activeSectorId={activeSectorId}
        onNavigateSector={navigateToSector}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
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

      {/* Project Detail Dossier Drawer when inspecting a 3D Installation */}
      {selectedProjectId && (
        <ProjectDossierModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
