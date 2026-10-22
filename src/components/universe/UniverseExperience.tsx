import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { scrollStore } from './scrollStore';

// Which side of a section the content card sits on, leaving the other side open for the 3D scene
const SIDES: Partial<Record<SectorId, 'right'>> = { experience: 'right' };

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

  const activeRef = useRef<SectorId>('core');
  const reducedRef = useRef(reducedMotion);
  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  // Listen to system preference changes for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Smooth-scroll to a section (nav, buttons, hash links)
  const navigateToSector = useCallback((sectorId: SectorId) => {
    const el = document.getElementById(sectorId);
    if (!el) return;
    setSelectedProjectId(null);
    el.scrollIntoView({ behavior: reducedRef.current ? 'auto' : 'smooth', block: 'start' });
  }, []);

  // Track scroll: drive the 3D camera, the active nav item and the URL hash
  useEffect(() => {
    const els = SECTORS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const center = window.innerHeight * 0.5;
      let f = els.length - 1;
      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        if (center < r.bottom || i === els.length - 1) {
          const local = Math.min(1, Math.max(0, (center - r.top) / Math.max(r.height, 1)));
          f = i + local;
          break;
        }
      }
      // A section is "reached" when its middle crosses the viewport centre
      f = Math.min(els.length - 1, Math.max(0, f - 0.5));
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        f = els.length - 1;
      }
      scrollStore.progress = f;

      const idx = Math.round(f);
      const id = SECTORS[idx].id;
      if (id !== activeRef.current) {
        activeRef.current = id;
        setActiveSectorId(id);
        window.history.replaceState(null, '', `#${id}`);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resizeObserver = new ResizeObserver(schedule);
    els.forEach((el) => resizeObserver.observe(el));

    // Deep link: jump straight to the hash section, no travelling animation
    const initial = SECTORS.find((s) => s.id === window.location.hash.replace('#', ''));
    if (initial) {
      document.getElementById(initial.id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    update();

    const handleHashChange = () => {
      const match = SECTORS.find((s) => s.id === window.location.hash.replace('#', ''));
      if (match && match.id !== activeRef.current) navigateToSector(match.id);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', handleHashChange);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [navigateToSector]);

  // Pointer position for the camera's parallax (the canvas itself ignores pointer events)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollStore.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Reveal each section's content the first time it scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.page-section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keep the page still behind an open project dossier
  useEffect(() => {
    if (!selectedProjectId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selectedProjectId]);

  // Keep the 3D scene's highlighted project in step with the open dossier
  useEffect(() => {
    if (!selectedProjectId) scrollStore.highlightProject = -1;
  }, [selectedProjectId]);

  const section = (id: SectorId, content: React.ReactNode) => (
    <section
      id={id}
      className="page-section"
      data-side={SIDES[id]}
      aria-label={SECTORS.find((s) => s.id === id)?.label}
    >
      <div className="section-inner">{content}</div>
    </section>
  );

  return (
    <div
      className={`universe-experience-root${reducedMotion ? ' reduced-motion' : ''}`}
      style={{ width: '100%', position: 'relative', background: '#07080b' }}
    >
      {/* Accessible skip link */}
      <a href="#active-stage" className="skip-to-content">
        Skip to main content
      </a>

      {/* Fixed 3D background: the camera travels the service map as you scroll */}
      <UniverseCanvas reducedMotion={reducedMotion} />

      <UniverseNav
        activeSectorId={activeSectorId}
        onNavigateSector={navigateToSector}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* One section per destination, in normal page flow */}
      <main id="active-stage" className="page-flow" role="main">
        {section('core', <HeroStage onNavigateSector={navigateToSector} />)}
        {section('about', <AboutStage onNavigateSector={navigateToSector} />)}
        {section(
          'skills',
          <SkillsStage
            selectedDomain={selectedSkillDomain}
            onSelectDomain={setSelectedSkillDomain}
            onNavigateSector={navigateToSector}
          />
        )}
        {section(
          'projects',
          <ProjectsStage
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onNavigateSector={navigateToSector}
          />
        )}
        {section('experience', <ExperienceStage onNavigateSector={navigateToSector} />)}
        {section('education', <EducationStage onNavigateSector={navigateToSector} />)}
        {section('contact', <ContactStage onNavigateSector={navigateToSector} />)}
      </main>

      {/* Project detail dossier */}
      {selectedProjectId && (
        <ProjectDossierModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
