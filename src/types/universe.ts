export type SectorId = 
  | 'core'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact';

export interface SectorConfig {
  id: SectorId;
  index: number;
  label: string;
  navLabel: string;
  tagline: string;
  hash: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  ambientColor: string;
  accentColor: string;
}

export const SECTORS: SectorConfig[] = [
  {
    id: 'core',
    index: 0,
    label: 'The Engineering Core',
    navLabel: 'Core',
    tagline: 'Distributed Systems & Automation Engine',
    hash: '#core',
    cameraPosition: [0, 0, 7.2],
    cameraTarget: [0, 0, 0],
    ambientColor: '#0c1017',
    accentColor: '#dfc070',
  },
  {
    id: 'about',
    index: 1,
    label: 'Identity & Architecture',
    navLabel: 'About',
    tagline: 'Systems Architect & Software Engineer',
    hash: '#about',
    cameraPosition: [20.5, 0.4, 5.5],
    cameraTarget: [22.2, 0.2, -3.5],
    ambientColor: '#120f0a',
    accentColor: '#dfc070',
  },
  {
    id: 'skills',
    index: 2,
    label: 'Technology Networks',
    navLabel: 'Skills',
    tagline: 'Interconnected Technical Infrastructure',
    hash: '#skills',
    cameraPosition: [0, 21.5, 3.5],
    cameraTarget: [0, 22, -6],
    ambientColor: '#0a1017',
    accentColor: '#38bdf8',
  },
  {
    id: 'projects',
    index: 3,
    label: 'Project Galaxy Exhibition',
    navLabel: 'Projects',
    tagline: 'Spatial Interactive Project Exhibition',
    hash: '#projects',
    cameraPosition: [-26, 2.2, 9.5],
    cameraTarget: [-26, 1.0, -3],
    ambientColor: '#0e111a',
    accentColor: '#38bdf8',
  },
  {
    id: 'experience',
    index: 4,
    label: 'Engineering Journey',
    navLabel: 'Journey',
    tagline: 'Enterprise Systems & Lab Automation',
    hash: '#experience',
    cameraPosition: [18, -17.2, 5.0],
    cameraTarget: [18, -17.8, -4],
    ambientColor: '#0a1314',
    accentColor: '#38bdf8',
  },
  {
    id: 'education',
    index: 5,
    label: 'Knowledge & Credentials',
    navLabel: 'Credentials',
    tagline: 'Academic Foundation & Verified Certifications',
    hash: '#education',
    cameraPosition: [-18, -19.4, 4.8],
    cameraTarget: [-18, -19.8, -4],
    ambientColor: '#120f0c',
    accentColor: '#dfc070',
  },
  {
    id: 'contact',
    index: 6,
    label: 'Quantum Connection Point',
    navLabel: 'Contact',
    tagline: 'Open Communication & Engineering Inquiries',
    hash: '#contact',
    cameraPosition: [0, -33.2, 5.0],
    cameraTarget: [0, -33.8, -4],
    ambientColor: '#080d14',
    accentColor: '#38bdf8',
  },
];

export interface ProjectInstallationConfig {
  id: string;
  name: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export const PROJECT_CAMERA_TARGETS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  'sitewatch': {
    position: [-33.5, 1.4, 0.8],
    target: [-33.5, 1.0, -4],
  },
  'retail-management': {
    position: [-29.8, 1.4, 1.8],
    target: [-29.8, 1.0, -2.8],
  },
  'thirukural-rag': {
    position: [-26, 1.4, 2.4],
    target: [-26, 1.0, -2.2],
  },
  'brain-tumor-detection': {
    position: [-22.2, 1.4, 1.8],
    target: [-22.2, 1.0, -2.8],
  },
  'healthcare-management': {
    position: [-18.5, 1.4, 0.8],
    target: [-18.5, 1.0, -4],
  },
};
