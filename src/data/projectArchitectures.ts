// Simplified architecture of each project, drawn from the documented solution and
// technology notes in portfolio.ts. Used by the 3D mesh (nodes that unfold when a
// project is highlighted) and by the project dossier's flow diagram.

export interface ArchNode {
  label: string;
  /** Technology shown under the label, when it adds information */
  tech?: string;
}

export interface ProjectArchitecture {
  /** Components in rough request/data-flow order */
  nodes: ArchNode[];
  /** Directed links as [from, to] indices into `nodes` */
  links: [number, number][];
  /** One line summarising the flow */
  summary: string;
}

// Keyed by the project ids in EXHIBITION_PROJECTS
export const PROJECT_ARCHITECTURES: Record<string, ProjectArchitecture> = {
  sitewatch: {
    nodes: [
      { label: 'Web app', tech: 'React' },
      { label: 'API Gateway', tech: 'FastAPI' },
      { label: 'Scheduler', tech: 'APScheduler' },
      { label: 'Alerts', tech: 'SendGrid' },
      { label: 'Billing', tech: 'Stripe' },
      { label: 'Database', tech: 'PostgreSQL' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [2, 5],
      [4, 5],
    ],
    summary: 'A gateway fronts six FastAPI services for scheduled checks, alerts and billing.',
  },
  'retail-management': {
    nodes: [
      { label: 'Web app', tech: 'React + TypeScript' },
      { label: 'API', tech: 'FastAPI' },
      { label: 'Access control', tech: 'RBAC' },
      { label: 'Billing & inventory' },
      { label: 'Database', tech: 'PostgreSQL' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    summary: 'Multi-tenant billing workflows behind role-based access, backed by PostgreSQL.',
  },
  'thirukural-rag': {
    nodes: [
      { label: 'Web app', tech: 'React' },
      { label: 'API', tech: 'FastAPI' },
      { label: 'Scenario tags', tech: 'Gemini' },
      { label: 'Embeddings', tech: 'sentence-transformers' },
      { label: 'Vector search', tech: 'Qdrant' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    summary: 'A situation is tagged by an LLM, embedded, and matched to couplets in Qdrant.',
  },
  'brain-tumor-detection': {
    nodes: [
      { label: 'MRI scans' },
      { label: 'Preprocess & augment', tech: 'OpenCV' },
      { label: 'Train & fine-tune', tech: 'YOLOv8' },
      { label: 'Detection' },
      { label: 'Bounding boxes' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    summary: 'Images are prepared, a YOLOv8 detector is trained, and predictions are drawn as boxes.',
  },
  'healthcare-management': {
    nodes: [
      { label: 'Clients' },
      { label: 'API Gateway', tech: 'FastAPI' },
      { label: 'Auth', tech: 'JWT + RBAC' },
      { label: 'Lab automation' },
      { label: 'Support AI', tech: 'Rasa + Ollama' },
      { label: 'Database', tech: 'MySQL' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 5],
    ],
    summary: 'A central gateway routes to 11+ independently deployable services.',
  },
};
