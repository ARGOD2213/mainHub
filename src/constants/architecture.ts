// Layers with no nodes are simply omitted, so a backend-only build shows no frontend/CDN row.
// Planned builds describe a DESIGN. Built projects list only what the resume states. Nothing here is a measured result.
export type Node = { name: string; note: string }
export type Layer = { label: string; nodes: Node[] }
export type Arch = { kind: 'design' | 'built'; layers: Layer[]; optimizations: string[]; unattended: string[]; needsSomeone?: string; hardware?: { intro: string; steps: Node[] } }

export const banner = (k: Arch['kind']) =>
  k === 'design' ? 'Design for a planned build. Nothing here is deployed, and none of the optimisations are measured.'
                 : 'Built project. Components listed are the ones on my resume.'

const deploy: Layer = { label: 'Deployment', nodes: [
  { name: 'Docker image', note: 'One image per service, same one in test and production.' },
  { name: 'GitHub Actions', note: 'Builds, tests and deploys on every merge to main.' },
  { name: 'AWS EC2', note: 'Runs the containers with a restart policy.' }] }
const cdn: Layer = { label: 'CDN and hosting', nodes: [{ name: 'Static hosting with CDN', note: 'Serves the built React files from edge locations. Files carry content hashes, so a new release never serves stale code.' }] }

export const architectures: Record<string, Arch> = {
  ClinicQueue: { kind: 'design',
    layers: [
      { label: 'Frontend', nodes: [{ name: 'React web app', note: 'Patient booking, doctor day view, admin screens.' }] }, cdn,
      { label: 'Backend', nodes: [{ name: 'Spring Boot 3 API', note: 'REST with JWT. Roles: admin, doctor, patient.' }, { name: 'Reminder scheduler', note: 'Finds due reminders and hands them to the notifier.' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL', note: 'Appointments, users, clinics.' }, { name: 'Redis', note: 'Open slots per doctor per day.' }] },
      { label: 'Notifications', nodes: [{ name: 'SES and SNS', note: 'Email and SMS reminders.' }] }, deploy],
    optimizations: [
      'Double booking is blocked by a unique constraint on doctor and slot start in PostgreSQL. A check in application code alone would pass while two requests race, and nothing would go red.',
      'Redis caches open slots and is cleared for that doctor on every booking or cancellation.',
      'Reminders are found with one query on an indexed remind-at column, not by scanning appointments.'],
    unattended: ['Containers restart themselves if the process dies.', 'An uptime monitor checks the health endpoint and emails the owner.', 'Flyway applies schema changes during deploy.', 'Clinic staff manage doctors and slots from the admin screen, with no code change.'],
    needsSomeone: 'Dependency upgrades and secret rotation still need a developer now and then.' },
  'ColdChain Pulse': { kind: 'design',
    layers: [
      { label: 'Devices', nodes: [{ name: 'Simulator (this build)', note: 'Publishes temperature and humidity readings on a fixed interval.' }] },
      { label: 'Message broker', nodes: [{ name: 'MQTT broker', note: 'One topic per device.' }] },
      { label: 'Backend', nodes: [{ name: 'Spring Boot subscriber', note: 'Validates, deduplicates and stores each reading.' }, { name: 'Alert rules', note: 'Fires when a threshold is breached for several readings in a row.' }, { name: 'Spring AI summary', note: 'Writes a plain-language summary of each alert window.' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL', note: 'Readings and alerts, indexed on device and timestamp.' }] },
      { label: 'Frontend', nodes: [{ name: 'React dashboard', note: 'Live readings and alert list.' }] }, cdn, deploy],
    hardware: { intro: 'This build uses simulated devices. The topic names and payload format are the contract a real device would follow.', steps: [
      { name: 'Sensor', note: 'Reads temperature and humidity.' },
      { name: 'Microcontroller', note: 'Batches readings and keeps them in memory if the network drops.' },
      { name: 'MQTT over TLS', note: 'Publishes with its own credentials, so one stolen device can be revoked alone.' },
      { name: 'Ingest', note: 'Deduplicates on device and timestamp, so resent readings after an outage are not double counted.' }] },
    optimizations: [
      'Alerts need several consecutive breaches, so one noisy reading does not page anyone.',
      'The dashboard reads per-minute aggregates, not raw rows.',
      'The AI summary runs only on alert windows, so its cost follows incidents, not reading volume.'],
    unattended: ['A device that stops sending triggers an offline alert.', 'A retention job deletes raw readings after a configurable period.', 'Containers restart themselves and deploys run from GitHub Actions.'],
    needsSomeone: 'Real hardware would need someone to install, calibrate and replace devices.' },
  FounderDocs: { kind: 'design',
    layers: [
      { label: 'Frontend', nodes: [{ name: 'React chat', note: 'Ask a question, see the answer and its source documents.' }] }, cdn,
      { label: 'Backend', nodes: [{ name: 'Spring Boot 3 with Spring AI', note: 'JWT login, ingestion and chat endpoints.' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL with pgvector', note: 'Document chunks, embeddings and the roles allowed to read each chunk.' }] },
      { label: 'External', nodes: [{ name: 'LLM API', note: 'Receives only the chunks the asking user may see.' }] }, deploy],
    optimizations: [
      'The role filter is part of the vector query itself. Filtering after retrieval would look correct in tests while restricted text still reached the prompt.',
      'Embeddings are keyed by content hash, so re-ingesting a folder only embeds files that changed.',
      'If no chunk clears the similarity threshold, the assistant says it does not know instead of guessing.'],
    unattended: ['A scheduled job re-ingests changed documents.', 'Containers restart themselves and deploys run from GitHub Actions.'],
    needsSomeone: 'The LLM API key, its spend limit and model upgrades need an owner.' },
  'Feature drop kit': { kind: 'design',
    layers: [
      { label: 'Backend', nodes: [{ name: 'Coupon engine', note: 'Rules and redemption limits.' }, { name: 'Stock alert consumer', note: 'Reads stock events and flags low inventory.' }, { name: 'Webhook receiver', note: 'Accepts events and processes them asynchronously.' }] },
      { label: 'Messaging and cache', nodes: [{ name: 'Kafka', note: 'Stock and webhook events.' }, { name: 'Redis', note: 'Atomic redemption counters.' }] }, deploy],
    optimizations: [
      'Coupon redemptions use an atomic Redis increment, so two simultaneous checkouts cannot both take the last use.',
      'Failed webhooks retry with growing delays, then land in a dead-letter table instead of disappearing.'],
    unattended: ['Dead-letter entries can be replayed from an admin endpoint.', 'Containers restart themselves and deploys run from GitHub Actions.'],
    needsSomeone: 'Someone must watch the dead-letter table, or connect it to an alert.' },
  'Digital Library Platform': { kind: 'built',
    layers: [
      { label: 'Frontend', nodes: [{ name: 'React.js', note: 'Screens for readers, vendors and admins.' }] },
      { label: 'Backend', nodes: [{ name: 'Spring Boot 3, Java 21', note: 'REST APIs, Spring Data JPA, JWT, role-based workflows.' }] },
      { label: 'Data and storage', nodes: [{ name: 'PostgreSQL', note: 'Schema versioned with Flyway.' }, { name: 'Redis', note: 'Caching.' }, { name: 'S3', note: 'Book files.' }] },
      { label: 'Notifications', nodes: [{ name: 'SES and SNS', note: 'Email and SMS.' }] },
      { label: 'Deployment', nodes: [{ name: 'Docker Compose', note: 'Runs the stack.' }, { name: 'GitHub Actions', note: 'CI/CD.' }, { name: 'AWS EC2', note: 'Host.' }] }],
    optimizations: ['Redis caching.', 'Book files kept in S3, not in the database.'], unattended: [] },
  'PolicyDocs RAG Service': { kind: 'built',
    layers: [
      { label: 'Backend', nodes: [{ name: 'Spring Boot 3 with Spring AI', note: 'Ingestion, chunking, embeddings, RAG Q&A, structured outputs.' }] },
      { label: 'Data', nodes: [{ name: 'PostgreSQL with pgvector', note: 'Vector retrieval.' }, { name: 'Redis', note: 'Conversation context and caching.' }] },
      { label: 'Security', nodes: [{ name: 'JWT and RBAC', note: 'Constrain what retrieval can return.' }] },
      { label: 'Deployment', nodes: [{ name: 'Docker', note: 'Containerised service.' }, { name: 'AWS EC2', note: 'Host.' }] }],
    optimizations: ['pgvector retrieval.', 'Structured outputs.', 'Responses grounded in retrieved documents, with no open LLM access.'], unattended: [] },
}