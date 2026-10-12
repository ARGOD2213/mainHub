/**
 * Single source of truth. Every fact on the site comes from the resume
 * (public/Chintala_Mahindra_Resume.pdf) or a public GitHub repo.
 * Planned builds are clearly labelled as designs, not shipped work.
 */

export const profile = {
  name: 'Chintala Mahindra',
  first: 'MAHINDRA',
  series: 'THE BACKEND SERIES',
  studio: 'A CHINTALA ORIGINAL',
  role: 'Java Backend Engineer',
  genres: ['Spring Boot', 'Microservices', 'AI Application Integration'],
  logline:
    'A Java backend engineer building secure Spring Boot microservices, REST APIs and event-driven systems — and wiring practical AI (RAG, embeddings, LLM APIs) into them with access control that actually holds.',
  location: 'Hyderabad, India',
  email: 'chintalamahindra163@gmail.com',
  phone: '+91 96181 12357',
  phoneTel: '+919618112357',
  whatsapp: 'https://wa.me/919618112357?text=Hi%20Mahindra%2C%20I%20saw%20your%20portfolio',
  github: 'https://github.com/ARGOD2213',
  linkedin: 'https://in.linkedin.com/in/chintala-mahindra-178306241',
  resumePdf: `${import.meta.env.BASE_URL}Chintala_Mahindra_Resume.pdf`,
  lookingFor: 'Java Backend / Spring Boot roles · Hyderabad · Bengaluru · Chennai',
}

export type SectionId = 'pilot' | 'seasons' | 'originals' | 'coming' | 'top' | 'skills' | 'credits' | 'resume'

export const viewers: { id: 'recruiter' | 'engineer' | 'founder'; name: string; blurb: string; color: string; order: SectionId[] }[] = [
  { id: 'recruiter', name: 'Recruiter', blurb: 'Experience and resume first', color: '#ff7a1a', order: ['pilot', 'seasons', 'top', 'originals', 'credits', 'resume', 'skills', 'coming'] },
  { id: 'engineer', name: 'Engineer', blurb: 'Architecture and code first', color: '#3ec7a5', order: ['originals', 'top', 'skills', 'seasons', 'coming', 'pilot', 'credits', 'resume'] },
  { id: 'founder', name: 'Founder', blurb: 'What I can build for you first', color: '#8f7bff', order: ['originals', 'coming', 'pilot', 'top', 'seasons', 'skills', 'credits', 'resume'] },
]

export type Episode = { n: string; title: string; text: string }
export type Season = { n: number; title: string; org: string; when: string; status: 'complete' | 'airing' | 'next'; episodes: Episode[] }

export const seasons: Season[] = [
  {
    n: 1,
    title: 'Origins',
    org: 'VIT Vellore · B.Tech, Electronics & Communication',
    when: '2020 – 2024',
    status: 'complete',
    episodes: [
      { n: 'E1', title: 'Signals to software', text: 'Four years of Electronics & Communication Engineering at VIT Vellore — systems thinking, then a pivot into software.' },
      { n: 'E2', title: 'Cloud certified', text: 'AWS Certified Cloud Practitioner (CLF-C02), 2024 — before the first day at work.' },
    ],
  },
  {
    n: 2,
    title: 'The Enterprise',
    org: 'Tata Consultancy Services · Software Engineer – Java Backend',
    when: 'Aug 2024 – Present',
    status: 'airing',
    episodes: [
      { n: 'E1', title: 'Microservices', text: 'Developed and enhanced Spring Boot 3 microservices on Java 21 for payroll, workforce and finance workflows, with REST APIs and Spring Data JPA across PostgreSQL / SQL Server.' },
      { n: 'E2', title: 'Locks & keys', text: 'Implemented Spring Security with JWT authentication and role-based access control across employee, HR and admin endpoints.' },
      { n: 'E3', title: 'Async & cache', text: 'Asynchronous event processing, plus Redis caching for high-frequency payroll and attendance lookups.' },
      { n: 'E4', title: 'AI joins the cast', text: 'Integrated Spring AI into existing services for document- and policy-based Q&A using retrieval and embeddings, with access controls applied to retrieved context.' },
      { n: 'E5', title: 'Production', text: 'Production debugging, API and database issue resolution, and ongoing enhancements across backend services in Agile delivery.' },
    ],
  },
  {
    n: 3,
    title: 'AI Application Engineer',
    org: 'Java · Spring · AI engineering · Cloud',
    when: 'Next season',
    status: 'next',
    episodes: [
      { n: 'E1', title: 'RAG from scratch', text: 'Building embeddings, vector search and RAG by hand in my public ai-engineering-lab repo.' },
      { n: 'E2', title: 'Your team?', text: 'Open to Java backend / Spring Boot roles in Hyderabad, Bengaluru and Chennai.' },
    ],
  },
]

export type ArchLayer = { label: string; nodes: { name: string; note: string }[] }
export type Project = {
  id: string
  title: string
  year: string
  genre: string
  badge: string
  logline: string
  stack: string[]
  episodes: string[]
  highlights: string[]
  arch: ArchLayer[]
  github?: string
  hue: [string, string, string]
}

export const originals: Project[] = [
  {
    id: 'argus',
    title: 'ARGUS',
    year: '2026',
    genre: 'Industrial IoT · Event-driven · AWS',
    badge: '8 sprints',
    logline: 'An event-driven industrial IoT monitoring platform — alerting, safety workflows, predictive intelligence and nine operator dashboards, on a deliberately lean AWS footprint.',
    stack: ['Java 17', 'Spring Boot 3.2', 'AWS Lambda', 'SQS FIFO', 'SNS', 'DynamoDB', 'S3', 'Athena', 'Python'],
    episodes: [
      'Always-on Lambda rule engine triggered from SQS, publishing CRITICAL / WARNING alerts through SNS.',
      'Spring Boot 3.2 on a single EC2 t3.micro, started and stopped from a phone through API Gateway + Lambda.',
      'Permit-to-Work digital workflow with a full state machine, compliance evidence export and shift handover history.',
      'A named local predictive ensemble (similarity, trajectory breach, maintenance debt…) powering machine chat — no paid inference API needed.',
      'Architecture locked by ADRs: Lambda-only rule engine, zero write path to the OT layer, Athena + S3 for history.',
    ],
    highlights: ['9 live dashboards', 'No ECS · no ALB · no NAT', 'Read-only OT boundary', 'Edge agent with offline rules'],
    arch: [
      { label: 'Control', nodes: [{ name: 'Phone · ops.html on S3', note: 'Start / stop the stack' }, { name: 'API Gateway + Lambda', note: 'Starts / stops EC2' }] },
      { label: 'Ingest & rules', nodes: [{ name: 'SQS FIFO', note: 'Ordered sensor events' }, { name: 'Lambda rule engine', note: 'Always on (ADR-001)' }, { name: 'SNS', note: 'CRITICAL / WARNING alerts' }] },
      { label: 'Application', nodes: [{ name: 'Spring Boot 3.2 on EC2', note: 'Dashboards, PTW, chat' }, { name: 'Predictive ensemble', note: 'Local, advisory only' }] },
      { label: 'Data', nodes: [{ name: 'DynamoDB', note: 'Alerts, PTW, ACKs' }, { name: 'S3', note: 'Handover & audit' }, { name: 'Athena', note: 'Sensor history' }] },
    ],
    github: 'https://github.com/ARGOD2213/ARGUS',
    hue: ['#1b0d02', '#a34a06', '#ff7a1a'],
  },
  {
    id: 'policydocs',
    title: 'PolicyDocs RAG',
    year: '2025',
    genre: 'Spring AI · RAG · Security',
    badge: 'AI',
    logline: 'A Spring Boot + Spring AI service that answers questions over policy documents — grounded in retrieved text, and only the text the asking user is allowed to see.',
    stack: ['Java 21', 'Spring Boot 3', 'Spring AI', 'PostgreSQL + pgvector', 'Redis', 'Docker', 'AWS'],
    episodes: [
      'Document ingestion, chunking, embeddings and RAG-based Q&A over policy documents.',
      'pgvector semantic retrieval, conversation context and structured outputs.',
      'JWT + RBAC so retrieval itself is constrained by application-level access control.',
      'Containerised with Docker and deployed on AWS EC2 — grounded answers, no open LLM access.',
    ],
    highlights: ['Permission-aware retrieval', 'Structured outputs', 'Grounded answers only'],
    arch: [
      { label: 'API', nodes: [{ name: 'Spring Boot 3 + Spring AI', note: 'Ingest, chunk, embed, answer' }] },
      { label: 'Security', nodes: [{ name: 'JWT + RBAC', note: 'Limits what retrieval returns' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL + pgvector', note: 'Vector retrieval' }, { name: 'Redis', note: 'Conversation context' }] },
      { label: 'Model', nodes: [{ name: 'LLM API', note: 'Sees only retrieved chunks' }] },
    ],
    hue: ['#03141a', '#0d6b62', '#3ec7a5'],
  },
  {
    id: 'library',
    title: 'Digital Library',
    year: '2025',
    genre: 'Full-stack · Cloud · CI/CD',
    badge: 'Full-stack',
    logline: 'A digital library platform with role-based workflows for readers, vendors and admins — from REST API to S3-stored books and SES/SNS notifications, shipped by CI/CD.',
    stack: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    episodes: [
      'REST APIs with Spring Data JPA and Flyway-versioned schema.',
      'Role-based workflows for readers, vendors and admins, secured with JWT.',
      'Redis caching, S3 storage for book files, SES / SNS notifications.',
      'Docker Compose on AWS EC2, deployed by GitHub Actions.',
    ],
    highlights: ['3 roles', 'Flyway migrations', 'GitHub Actions → EC2'],
    arch: [
      { label: 'Frontend', nodes: [{ name: 'React', note: 'Reader, vendor, admin screens' }] },
      { label: 'Backend', nodes: [{ name: 'Spring Boot 3 · Java 21', note: 'REST, JPA, JWT' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL', note: 'Flyway migrations' }, { name: 'Redis', note: 'Cache' }, { name: 'S3', note: 'Book files' }] },
      { label: 'Ops', nodes: [{ name: 'SES / SNS', note: 'Email & SMS' }, { name: 'GitHub Actions → EC2', note: 'Docker Compose' }] },
    ],
    hue: ['#0e0820', '#4b2fa8', '#8f7bff'],
  },
]

export const comingSoon = [
  { title: 'ClinicQueue', genre: 'Bookings · Reminders', line: 'Clinic bookings that cannot double-book — a unique constraint on doctor + slot, Redis-cached open slots, SES/SNS reminders.', tech: ['Spring Boot', 'PostgreSQL', 'Redis', 'SES/SNS'] },
  { title: 'ColdChain Pulse', genre: 'IoT · Alerts · AI', line: 'Cold-box temperature readings over MQTT, alerts only after consecutive breaches, and an AI-written summary of each alert window.', tech: ['MQTT', 'Spring Boot', 'PostgreSQL', 'Spring AI'] },
  { title: 'FounderDocs', genre: 'RAG · Access control', line: 'Answers from internal docs where the role filter lives inside the vector query — restricted text never reaches the prompt.', tech: ['Spring AI', 'pgvector', 'JWT/RBAC'] },
]

export const topTen = [
  'Spring Boot 3', 'Java 21', 'REST APIs', 'Spring Security · JWT', 'Microservices',
  'PostgreSQL', 'Spring AI · RAG', 'Redis', 'AWS', 'Docker · CI/CD',
]

export const skills: { genre: string; items: string[]; seenIn: string }[] = [
  { genre: 'Languages', items: ['Java 21', 'SQL'], seenIn: 'Every service at TCS and every Original' },
  { genre: 'Backend', items: ['Spring Boot 3', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'REST APIs', 'Microservices', 'JWT', 'RBAC'], seenIn: 'TCS HRMS & Finance · Digital Library · PolicyDocs' },
  { genre: 'Data', items: ['PostgreSQL', 'SQL Server', 'Redis', 'pgvector', 'DynamoDB'], seenIn: 'TCS payroll lookups · PolicyDocs · ARGUS' },
  { genre: 'AI integration', items: ['Spring AI', 'RAG', 'Embeddings', 'Vector Search', 'LLM APIs', 'Prompt Engineering', 'Structured Outputs'], seenIn: 'TCS policy Q&A · PolicyDocs RAG · ARGUS machine chat' },
  { genre: 'Cloud & DevOps', items: ['AWS EC2', 'RDS', 'S3', 'IAM', 'CloudWatch', 'Lambda', 'SQS', 'SNS', 'Docker', 'CI/CD', 'Git', 'Maven', 'OpenAPI'], seenIn: 'ARGUS · Digital Library · AWS certification' },
]

export const credits = [
  { title: 'AWS Certified Cloud Practitioner', code: 'CLF-C02', org: 'Amazon Web Services', year: '2024' },
  { title: 'Spring Boot 3 & Spring Framework 6', code: 'Course', org: 'Udemy · Chad Darby', year: '2025' },
  { title: 'REST API Design, Development & Management', code: 'Course', org: 'Udemy', year: '2024' },
]

export const introSlides = [
  { kicker: 'Previously on…', text: 'An ECE graduate from VIT Vellore walks into enterprise Java.' },
  { kicker: 'Season 2', text: 'Spring Boot 3 microservices on Java 21 for payroll, workforce and finance at TCS.' },
  { kicker: 'The twist', text: 'Spring AI inside existing services — RAG answers that respect who is asking.' },
  { kicker: 'The Original', text: 'ARGUS: an event-driven industrial IoT platform on AWS, eight sprints deep.' },
  { kicker: 'Next season', text: 'Looking for the team to build it with.' },
]
