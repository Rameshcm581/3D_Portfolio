/**
 * Portfolio content draft for Ramesh C.
 *
 * Source: the two resumes provided for this task (Software Engineer and
 * Python Automation Engineer). Confirm all content before publishing.
 * Employer-related projects are hidden by default until public disclosure is approved.
 */

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type PortfolioProject = {
  id: string;
  title: string;
  category: "personal" | "professional";
  summary: string;
  problem?: string;
  solution?: string;
  highlights: string[];
  technologies: string[];
  featured: boolean;
  /** Keep false until you have confirmed this employer-related work can be shown publicly. */
  showOnPortfolio: boolean;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  image: string | null;
};

export const portfolio = {
  person: {
    name: "Ramesh C",
    shortName: "Ramesh",
    role: "Software Engineer",
    headline:
      "I build backend systems, automate workflows, and connect products through reliable APIs.",
    location: "Erode, Tamil Nadu, India",
    email: "rameshc182003@gmail.com",
    /** Included from the resume, but deliberately not intended for public display by default. */
    phone: "7548886455",
    showPhone: false,
    socialLinks: [
      {
        label: "GitHub",
        url: "https://github.com/Rameshcm581",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/rameshc581mc",
      },
    ],
    /** Add the exported PDF to public assets and update the href before showing a download button. */
    resume: {
      label: "Download Resume",
      href: null as string | null,
      variants: [
        { label: "Software Engineer Resume", href: null as string | null },
        { label: "Python Automation Engineer Resume", href: null as string | null },
      ],
    },
  },

  site: {
    title: "Ramesh C | Software Engineer",
    description:
      "Portfolio of Ramesh C, a software engineer focused on Python, FastAPI, backend systems, workflow automation, and applied AI.",
    /** Set this when your final domain is known. */
    canonicalUrl: null as string | null,
    /** Add a real image path before configuring Open Graph previews. */
    socialPreviewImage: null as string | null,
  },

  hero: {
    eyebrow: "SOFTWARE ENGINEER · BACKEND · AUTOMATION · AI",
    title: "Building systems that make complex work simpler.",
    description:
      "I develop Python-based backend services, API-driven products, and workflow automation across healthcare, mobility, hospitality, and AI-powered applications.",
    primaryCta: { label: "Explore My Work", href: "#projects" },
    secondaryCta: { label: "Get In Touch", href: "#contact" },
    availabilityText: null as string | null,
  },

  about: {
    heading: "Engineering reliable systems, from APIs to workflows.",
    paragraphs: [
      "I’m a software engineer with 1.5+ years of experience building Python and FastAPI services, integrating REST APIs, and automating workflows for healthcare, mobility, and hospitality products.",
      "My work has included microservice-based platforms, authentication and role-based access control, database-backed business workflows, scheduled monitoring and alerts, payment and notification integrations, and applications that use AI and computer vision.",
      "I enjoy solving practical engineering problems: making systems easier to operate, keeping workflows dependable, and turning complex requirements into maintainable software.",
    ],
    focusAreas: [
      "Backend engineering and API design",
      "Workflow and browser automation",
      "Database-backed applications",
      "Applied AI and computer vision",
    ],
  },

  highlights: [
    {
      value: "100+",
      label: "REST APIs delivered",
      note: "Reported in professional experience",
    },
    {
      value: "11+",
      label: "Independently deployable backend services",
      note: "Healthcare management platform",
    },
    {
      value: "5",
      label: "Independent microservices",
      note: "Hospitality management system",
    },
    {
      value: "40+",
      label: "Database models",
      note: "Hospitality management system",
    },
  ],

  skills: [
    {
      title: "Languages",
      skills: ["Python", "Java", "C", "JavaScript"],
    },
    {
      title: "Backend & APIs",
      skills: [
        "FastAPI",
        "REST API Integration",
        "Microservices",
        "SQLAlchemy",
        "JWT Authentication",
        "Role-Based Access Control (RBAC)",
        "Workflow Automation",
      ],
    },
    {
      title: "Databases",
      skills: ["MySQL", "PostgreSQL"],
    },
    {
      title: "Automation & Testing",
      skills: ["Playwright", "pytest", "Browser Automation", "Scheduled Monitoring"],
    },
    {
      title: "AI & Computer Vision",
      skills: ["YOLO", "YOLOv8", "OpenCV", "Rasa", "Ollama", "Retrieval-Augmented Generation (RAG)"],
    },
    {
      title: "DevOps & Observability",
      skills: ["Linux", "Bash", "Docker", "Git", "GitHub Actions", "Grafana"],
    },
    {
      title: "Frontend & Mobile",
      skills: ["React", "TypeScript", "Flutter", "HTML", "CSS", "Bootstrap", "Tailwind CSS"],
    },
    {
      title: "Integrations & Platforms",
      skills: ["Firebase", "Razorpay", "Paytm", "SendGrid", "mTalkz", "Google Maps", "Zoom", "Power BI"],
    },
  ] satisfies SkillGroup[],

  experience: [
    {
      id: "younder-bots",
      role: "Software Developer",
      organization: "Younder Bots (OPC) Private Limited",
      location: null as string | null,
      startDate: "2025-03",
      endDate: null as string | null,
      dateLabel: "Mar 2025 – Present",
      summary:
        "Developing backend services and product workflows across healthcare, AI customer support, hospitality, mobility, and entrepreneurship platforms.",
      highlights: [
        "Developed a Python/FastAPI microservices platform with 11+ independently deployable backend services behind a centralized API Gateway, containerized with Docker.",
        "Automated laboratory workflows through analyzer integration, including specimen tracking, quality control, delta checks, critical-value alerts, result verification, and automated reporting.",
        "Implemented healthcare workflows spanning patient registration, appointments, clinical documentation, pharmacy, inventory, billing, and insurance/NHIS claims.",
        "Implemented RBAC, JWT authentication, audit trails, API rate limiting, and correlation-ID request tracing across services.",
        "Built an AI-powered customer-support platform using Rasa, a knowledge base, and local LLMs through Ollama, with human-agent fallback and tenant-level isolation.",
        "Contributed to hospitality and ride-hailing platforms covering reservations, front-office operations, rides, pricing, payments, billing, and notifications.",
      ],
    },
  ],

  projects: [
    {
      id: "sitewatch",
      title: "SiteWatch: Website, TLS & Domain Monitoring",
      category: "personal",
      summary:
        "A monitoring platform that checks website availability and tracks TLS certificate and domain expiry, with automated alerts.",
      problem:
        "Website downtime and certificate or domain expiry can go unnoticed without recurring checks and timely notifications.",
      solution:
        "Built an API Gateway and six FastAPI microservices for scheduled monitoring, alert delivery, billing, and automated testing.",
      highlights: [
        "Checks website uptime every five minutes and TLS/domain expiry daily.",
        "Sends automated email alerts for downtime and approaching expiry.",
        "Includes Stripe billing and GitHub Actions CI with Playwright tests.",
      ],
      technologies: ["Python", "FastAPI", "APScheduler", "PostgreSQL", "Docker", "SendGrid", "Stripe", "React", "GitHub Actions", "Playwright"],
      featured: true,
      showOnPortfolio: true,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "retail-management",
      title: "Multi-Tenant Retail Management & Billing Platform",
      category: "personal",
      summary:
        "A retail operations platform covering product catalogues, inventory, point-of-sale billing, customers, employees, and access control.",
      problem:
        "Retail operations need a connected workflow for inventory, checkout, pricing, payments, and role-based access.",
      solution:
        "Developed a multi-tenant platform with configurable billing workflows and subscription-based feature access.",
      highlights: [
        "Supports barcode-based billing and wholesale/retail pricing.",
        "Supports multiple tax types and payment methods.",
        "Includes subscription-based feature access, multi-language support, and granular RBAC.",
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "PostgreSQL"],
      featured: true,
      showOnPortfolio: true,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "thirukural-rag",
      title: "Thirukural RAG: Scenario-Based Semantic Search",
      category: "personal",
      summary:
        "A retrieval-augmented search application that connects real-life situations with relevant Thirukural couplets.",
      problem:
        "Finding a relevant couplet for a specific life situation requires more than searching for exact keywords.",
      solution:
        "Built a RAG workflow using LLM-generated scenario tags and Qdrant embeddings to retrieve semantically related couplets.",
      highlights: [
        "Uses Qdrant embeddings for semantic retrieval.",
        "Combines scenario tags with an LLM-assisted retrieval workflow.",
        "Evaluates retrieval quality using recall@K against a hand-verified gold set.",
      ],
      technologies: ["Python", "FastAPI", "Qdrant", "sentence-transformers", "Gemini", "React"],
      featured: true,
      showOnPortfolio: true,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "brain-tumor-detection",
      title: "Brain Tumor Detection & Localization using YOLOv8",
      category: "personal",
      summary:
        "A computer-vision project that detects and localizes suspected tumor regions in MRI scan images.",
      problem:
        "Model output needs a clear visual representation so detected regions can be reviewed more easily.",
      solution:
        "Preprocessed and augmented MRI images, trained and fine-tuned a YOLOv8 object-detection model, and visualized predicted bounding boxes.",
      highlights: [
        "Preprocessed and augmented MRI scan images.",
        "Trained and fine-tuned a YOLOv8 object-detection model.",
        "Visualized detected regions using bounding boxes for interpretability.",
      ],
      technologies: ["Python", "YOLOv8", "OpenCV", "Deep Learning"],
      featured: true,
      showOnPortfolio: true,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "healthcare-management",
      title: "Healthcare Management Platform",
      category: "professional",
      summary:
        "A microservices-based healthcare platform spanning laboratory workflows, patient journeys, pharmacy, inventory, billing, and insurance claims.",
      highlights: [
        "Built around 11+ independently deployable backend services behind a centralized API Gateway.",
        "Integrated laboratory analyzer workflows, specimen tracking, QC, delta checks, critical-value alerts, verification, and reporting.",
        "Implemented JWT authentication, RBAC, audit trails, rate limiting, and correlation-ID tracing.",
      ],
      technologies: ["Python", "FastAPI", "MySQL", "SQLAlchemy", "REST APIs", "JWT", "Docker", "React", "Flutter", "Zoom"],
      featured: false,
      showOnPortfolio: false,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "customer-support-ai",
      title: "Multi-Tenant Customer Support AI Platform",
      category: "professional",
      summary:
        "An AI-powered support platform using intent recognition, a knowledge base, and local LLMs to automate customer conversations.",
      highlights: [
        "Used Rasa intent recognition and Ollama-based local LLMs.",
        "Implemented human-agent fallback and escalation.",
        "Isolated configurations, users, conversations, and AI settings by organization.",
      ],
      technologies: ["Python", "FastAPI", "Rasa", "Ollama", "MySQL", "REST APIs", "Microservices", "React"],
      featured: false,
      showOnPortfolio: false,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "hospitality-management",
      title: "Hospitality Management System",
      category: "professional",
      summary:
        "A microservices-based hotel operations system for reservations, front office, housekeeping, restaurant/kitchen operations, billing, and inventory.",
      highlights: [
        "Implemented reservation, rate-plan, payment, tax, and discount workflows, including group and multi-room bookings.",
        "Delivered 100+ APIs and 40+ database models across five independent microservices.",
        "Included multi-tenancy, RBAC, audit trails, and multi-country tax support.",
      ],
      technologies: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "MySQL", "JWT", "Microservices"],
      featured: false,
      showOnPortfolio: false,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "ride-hailing",
      title: "Ride-Hailing & Mobility Platform",
      category: "professional",
      summary:
        "A multi-tenant mobility platform with backend services for riders, drivers, trips, pricing, payments, and reporting.",
      highlights: [
        "Implemented ride booking, driver dispatch, scheduled rides, and multi-stop journeys.",
        "Covered fare calculation, wallets, and Razorpay/Paytm payment workflows.",
        "Integrated Google Maps, driver KYC verification, SOS alerts, and Firebase/mTalkz notifications.",
      ],
      technologies: ["Python", "FastAPI", "MySQL", "JWT", "Microservices", "Firebase", "Razorpay", "Paytm", "Google Maps", "Flutter", "React"],
      featured: false,
      showOnPortfolio: false,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
    {
      id: "entrepreneurship-ecosystem",
      title: "Entrepreneurship Ecosystem Management System",
      category: "professional",
      summary:
        "A centralized platform connecting startups, mentors, investors, service providers, and government departments for discovery, funding, mentorship, and collaboration.",
      highlights: [
        "Designed around multiple participant groups in an entrepreneurship ecosystem.",
        "Supported discovery, funding, mentorship, and collaboration workflows.",
      ],
      technologies: ["Python", "FastAPI", "Microservices", "React", "PostgreSQL"],
      featured: false,
      showOnPortfolio: false,
      githubUrl: null,
      liveDemoUrl: null,
      image: null,
    },
  ] satisfies PortfolioProject[],

  education: [
    {
      qualification: "Bachelor of Engineering",
      field: "Computer Science and Engineering",
      institution: "Velalar College of Engineering and Technology",
      location: "Erode",
      dateLabel: "2021–2025",
      result: "CGPA: 7.92",
    },
    {
      qualification: "Higher Secondary Education",
      field: null as string | null,
      institution: "Sri Venkateshwara Vidhyalayaa Higher Secondary School",
      location: null as string | null,
      dateLabel: "2020–2021",
      result: "93.1%",
    },
    {
      qualification: "Secondary Education",
      field: null as string | null,
      institution: "Sri Venkateshwara Vidhyalayaa Matriculation School",
      location: null as string | null,
      dateLabel: "2018–2019",
      result: "89.6%",
    },
  ],

  certifications: [
    { name: "Data Analytics with Python", issuer: "NPTEL", dateLabel: "Jan–Apr 2023" },
    { name: "Artificial Intelligence Foundation Certificate", issuer: "Infosys", dateLabel: null as string | null },
    { name: "Full Stack Development", issuer: "Infomin Solutions", dateLabel: null as string | null },
    { name: "Introduction to IoT", issuer: "NPTEL", dateLabel: "Jan–Apr 2023" },
    { name: "RDBMS PostgreSQL Training", issuer: "Spoken Tutorial, IIT Bombay", dateLabel: null as string | null },
    { name: "Introduction to MongoDB", issuer: "Course for Students", dateLabel: null as string | null },
    { name: "UX Design by Example", issuer: "Infosys", dateLabel: null as string | null },
  ],

  leadership: [
    {
      title: "Tech Lead & Core Member",
      organization: "Data Pirates Club",
      dateLabel: "2023–2024",
      description: "Served as Treasurer in 2024; managed club records and led project execution.",
    },
    {
      title: "Executive Member",
      organization: "Computer Society of India (CSI)",
      dateLabel: "2023–2024",
      description: null as string | null,
    },
    {
      title: "Class Representative",
      organization: null as string | null,
      dateLabel: "2021–2022",
      description: null as string | null,
    },
    {
      title: "3rd Prize — Paper Presentation",
      organization: "Velalar College of Engineering and Technology",
      dateLabel: null as string | null,
      description: "Paper presentation on Machine Learning Concepts and Its Application.",
    },
  ],

  contact: {
    heading: "Have a project or an engineering problem to solve?",
    description:
      "I’m open to connecting about software engineering, backend development, automation, and applied AI.",
    email: "rameshc182003@gmail.com",
    emailSubject: "Portfolio enquiry",
  },
} as const;

export default portfolio;
