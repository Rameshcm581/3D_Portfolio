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
    label: 'SECTOR 01 // THE ENGINEERING CORE',
    navLabel: 'CORE',
    tagline: 'Distributed Systems & Automation Engine',
    hash: '#core',
    cameraPosition: [-1.7, 0.8, 6.8],
    cameraTarget: [-1.7, 0, 0],
    ambientColor: '#0c1017',
    accentColor: '#dfc070',
  },
  {
    id: 'about',
    index: 1,
    label: 'SECTOR 02 // IDENTITY & ARCHITECTURE',
    navLabel: 'ABOUT',
    tagline: 'Systems Architect & Software Engineer',
    hash: '#about',
    cameraPosition: [16.2, 1.8, 7.8],
    cameraTarget: [16.2, 1.4, 0],
    ambientColor: '#120f0a',
    accentColor: '#dfc070',
  },
  {
    id: 'skills',
    index: 2,
    label: 'SECTOR 03 // ENGINEERING TOPOLOGY',
    navLabel: 'SYSTEMS',
    tagline: 'Interconnected Technical Infrastructure',
    hash: '#skills',
    cameraPosition: [-2.4, 15.0, 10.5],
    cameraTarget: [-2.4, 14.0, 0],
    ambientColor: '#0a1017',
    accentColor: '#38bdf8',
  },
  {
    id: 'projects',
    index: 3,
    label: 'SECTOR 04 // THE PROJECT GALAXY',
    navLabel: 'PROJECTS',
    tagline: 'Spatial Interactive Project Exhibition',
    hash: '#projects',
    cameraPosition: [-26.2, 2.2, 9.8],
    cameraTarget: [-26.2, 1.5, 0],
    ambientColor: '#0e111a',
    accentColor: '#38bdf8',
  },
  {
    id: 'experience',
    index: 4,
    label: 'SECTOR 05 // ENGINEERING JOURNEY',
    navLabel: 'JOURNEY',
    tagline: 'Enterprise Systems & Lab Automation',
    hash: '#experience',
    cameraPosition: [14.2, -14.2, 9.5],
    cameraTarget: [14.2, -14.8, 0],
    ambientColor: '#0a1314',
    accentColor: '#38bdf8',
  },
  {
    id: 'education',
    index: 5,
    label: 'SECTOR 06 // KNOWLEDGE & CREDENTIALS',
    navLabel: 'CREDENTIALS',
    tagline: 'Academic Foundation & Verified Certifications',
    hash: '#education',
    cameraPosition: [-18.2, -15.5, 8.8],
    cameraTarget: [-18.2, -16, 0],
    ambientColor: '#120f0c',
    accentColor: '#dfc070',
  },
  {
    id: 'contact',
    index: 6,
    label: 'SECTOR 07 // CONNECTION POINT',
    navLabel: 'CONTACT',
    tagline: 'Open Quantum Transmission Channel',
    hash: '#contact',
    cameraPosition: [-1.8, -28.2, 8.2],
    cameraTarget: [-1.8, -29, 0],
    ambientColor: '#080d14',
    accentColor: '#38bdf8',
  },
];
