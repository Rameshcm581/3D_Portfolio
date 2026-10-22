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
import { MeshOverlay } from './MeshOverlay';
import { describeNode } from './meshInteraction';
import { EXHIBITION_PROJECTS } from '../../data/universeData';
import { applyTheme, currentTheme, savedTheme, systemTheme, type Theme } from '../../theme';

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

  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    setTheme(next);
  }, []);

  // Until the visitor picks a theme, follow the system setting live
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (savedTheme()) return;
      const next = systemTheme();
      applyTheme(next, false);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

  // Pointer: drives camera parallax and lets the mesh react. The canvas ignores pointer
  // events, so we only treat the pointer as "on the mesh" over empty page, not over cards.
  useEffect(() => {
    let touchTimer = 0;
    const isEmptySpace = (t: EventTarget | null) =>
      t === document.documentElement ||
      t === document.body ||
      t instanceof HTMLCanvasElement ||
      (t instanceof HTMLElement && t.classList.contains('universe-experience-root'));

    const track = (e: PointerEvent) => {
      scrollStore.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      scrollStore.pointerActive = isEmptySpace(e.target);
    };
    const onMove = (e: PointerEvent) => {
      window.clearTimeout(touchTimer);
      track(e);
    };
    const onUp = (e: PointerEvent) => {
      // A finger has no hover: let the tap register, then release the mesh
      if (e.pointerType === 'touch') {
        window.clearTimeout(touchTimer);
        touchTimer = window.setTimeout(() => {
          scrollStore.pointerActive = false;
        }, 1500);
      }
    };
    const onLeave = () => {
      scrollStore.pointerActive = false;
    };

    // Clicking a node: open a project's case study, or travel to that node's section
    const onClick = (e: MouseEvent) => {
      if (!isEmptySpace(e.target) || scrollStore.hoverNode < 0) return;
      const activeIdx = SECTORS.findIndex((s) => s.id === activeRef.current);
      const action = describeNode(scrollStore.nodeInfo[scrollStore.hoverNode], activeIdx)?.action;
      if (action?.kind === 'project') setSelectedProjectId(EXHIBITION_PROJECTS[action.projectIndex].id);
      else if (action?.kind === 'travel') navigateToSector(SECTORS[action.cluster].id);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('click', onClick);
    return () => {
      window.clearTimeout(touchTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
      scrollStore.pointerActive = false;
    };
  }, [navigateToSector]);

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

  // Tell the 3D scene which project dossier is open and which Skills tab is selected
  useEffect(() => {
    scrollStore.openProject = EXHIBITION_PROJECTS.findIndex((p) => p.id === selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    scrollStore.skillDomain = selectedSkillDomain;
  }, [selectedSkillDomain]);

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
      style={{ width: '100%', position: 'relative', background: 'var(--bg-primary)' }}
    >
      {/* Accessible skip link */}
      <a href="#active-stage" className="skip-to-content">
        Skip to main content
      </a>

      {/* Fixed 3D background: the camera travels the service map as you scroll */}
      <UniverseCanvas reducedMotion={reducedMotion} theme={theme} />
      <MeshOverlay activeIndex={SECTORS.findIndex((s) => s.id === activeSectorId)} />

      <UniverseNav
        activeSectorId={activeSectorId}
        onNavigateSector={navigateToSector}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        theme={theme}
        onToggleTheme={toggleTheme}
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
