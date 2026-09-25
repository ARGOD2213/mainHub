// Architecture data is the source of truth for the deterministic SVG topology.
// Planned builds describe a DESIGN. Built projects list only what the resume states.
// Nothing here is a measured result.

export type Node = {
  id: string
  name: string
  note: string
  parentIds?: string[]
}

export type Layer = {
  label: string
  row: number
  nodes: Node[]
}

export type Arch = {
  kind: 'design' | 'built'
  layers: Layer[]
  releasePipeline: Layer[]
  optimizations: string[]
  unattended: string[]
  needsSomeone?: string
  hardware?: { intro: string; steps: Node[] }
}

export const banner = (k: Arch['kind']) =>
  k === 'design'
    ? 'Design for a planned build. Nothing here is deployed, and none of the optimisations are measured.'
    : 'Built project. Components listed are the ones on my resume.'

const deploy: Layer = {
  label: 'Release pipeline',
  row: 0,
  nodes: [
    { id: 'docker-image', name: 'Docker image', note: 'One image per service, same one in test and production.' },
    { id: 'github-actions', name: 'GitHub Actions', note: 'Builds, tests and deploys on every merge to main.' },
    { id: 'aws-ec2', name: 'AWS EC2', note: 'Runs the containers with a restart policy.' },
  ],
}

const cdn: Layer = {
  label: 'CDN and hosting',
  row: 0,
  nodes: [
    {
      id: 'static-cdn',
      name: 'Static hosting with CDN',
      note: 'Serves the built React files from edge locations. Files carry content hashes, so a new release never serves stale code.',
    },
  ],
}

export const architectures: Record<string, Arch> = {
  ClinicQueue: {
    kind: 'design',
    layers: [
      {
        label: 'Frontend / hosting',
        row: 0,
        nodes: [
          { id: 'react-web-app', name: 'React web app', note: 'Patient booking, doctor day view, admin screens.', parentIds: ['static-cdn'] },
          ...cdn.nodes,
        ],
      },
      {
        label: 'Backend',
        row: 1,
        nodes: [
          { id: 'spring-api', name: 'Spring Boot 3 API', note: 'REST with JWT. Roles: admin, doctor, patient.' },
          { id: 'reminder-scheduler', name: 'Reminder scheduler', note: 'Finds due reminders and hands them to the notifier.', parentIds: ['spring-api'] },
        ],
      },
      {
        label: 'Data',
        row: 2,
        nodes: [
          { id: 'postgresql', name: 'PostgreSQL', note: 'Appointments, users, clinics.', parentIds: ['spring-api'] },
          { id: 'redis', name: 'Redis', note: 'Open slots per doctor per day.', parentIds: ['spring-api'] },
        ],
      },
      {
        label: 'Notifications',
        row: 3,
        nodes: [{ id: 'ses-sns', name: 'SES and SNS', note: 'Email and SMS reminders.', parentIds: ['reminder-scheduler'] }],
      },
    ],
    releasePipeline: [deploy],
    optimizations: [
      'Double booking is blocked by a unique constraint on doctor and slot start in PostgreSQL. A check in application code alone would pass while two requests race, and nothing would go red.',
      'Redis caches open slots and is cleared for that doctor on every booking or cancellation.',
      'Reminders are found with one query on an indexed remind-at column, not by scanning appointments.',
    ],
    unattended: [
      'Containers restart themselves if the process dies.',
      'An uptime monitor checks the health endpoint and emails the owner.',
      'Flyway applies schema changes during deploy.',
      'Clinic staff manage doctors and slots from the admin screen, with no code change.',
    ],
    needsSomeone: 'Dependency upgrades and secret rotation still need a developer now and then.',
  },

  'ColdChain Pulse': {
    kind: 'design',
    layers: [
      {
        label: 'Devices',
        row: 0,
        nodes: [{ id: 'simulator', name: 'Simulator (this build)', note: 'Publishes temperature and humidity readings on a fixed interval.' }],
      },
      {
        label: 'Message broker',
        row: 1,
        nodes: [{ id: 'mqtt-broker', name: 'MQTT broker', note: 'One topic per device.', parentIds: ['simulator'] }],
      },
      {
        label: 'Backend',
        row: 2,
        nodes: [
          { id: 'spring-subscriber', name: 'Spring Boot subscriber', note: 'Validates, deduplicates and stores each reading.', parentIds: ['mqtt-broker'] },
          { id: 'alert-rules', name: 'Alert rules', note: 'Fires when a threshold is breached for several readings in a row.', parentIds: ['spring-subscriber'] },
          { id: 'spring-ai-summary', name: 'Spring AI summary', note: 'Writes a plain-language summary of each alert window.', parentIds: ['alert-rules'] },
        ],
      },
      {
        label: 'Data',
        row: 3,
        nodes: [{ id: 'postgresql', name: 'PostgreSQL', note: 'Readings and alerts, indexed on device and timestamp.', parentIds: ['spring-subscriber'] }],
      },
      {
        label: 'Frontend / hosting',
        row: 4,
        nodes: [
          { id: 'react-dashboard', name: 'React dashboard', note: 'Live readings and alert list, read through the backend API.', parentIds: ['spring-subscriber', 'static-cdn'] },
          ...cdn.nodes,
        ],
      },
    ],
    releasePipeline: [deploy],
    hardware: {
      intro: 'This build uses simulated devices. The topic names and payload format are the contract a real device would follow.',
      steps: [
        { id: 'sensor', name: 'Sensor', note: 'Reads temperature and humidity.' },
        { id: 'microcontroller', name: 'Microcontroller', note: 'Batches readings and keeps them in memory if the network drops.', parentIds: ['sensor'] },
        { id: 'mqtt-tls', name: 'MQTT over TLS', note: 'Publishes with its own credentials, so one stolen device can be revoked alone.', parentIds: ['microcontroller'] },
        { id: 'ingest', name: 'Ingest', note: 'Deduplicates on device and timestamp, so resent readings after an outage are not double counted.', parentIds: ['mqtt-tls'] },
      ],
    },
    optimizations: [
      'Alerts need several consecutive breaches, so one noisy reading does not page anyone.',
      'The dashboard reads per-minute aggregates, not raw rows.',
      'The AI summary runs only on alert windows, so its cost follows incidents, not reading volume.',
    ],
    unattended: [
      'A device that stops sending triggers an offline alert.',
      'A retention job deletes raw readings after a configurable period.',
      'Containers restart themselves and deploys run from GitHub Actions.',
    ],
    needsSomeone: 'Real hardware would need someone to install, calibrate and replace devices.',
  },

  FounderDocs: {
    kind: 'design',
    layers: [
      {
        label: 'Frontend / hosting',
        row: 0,
        nodes: [
          { id: 'react-chat', name: 'React chat', note: 'Ask a question, see the answer and its source documents.', parentIds: ['spring-ai-api'] },
          ...cdn.nodes,
        ],
      },
      {
        label: 'Backend',
        row: 1,
        nodes: [{ id: 'spring-ai-api', name: 'Spring Boot 3 with Spring AI', note: 'JWT login, ingestion and chat endpoints.' }],
      },
      {
        label: 'Data',
        row: 2,
        nodes: [{ id: 'postgres-pgvector', name: 'PostgreSQL with pgvector', note: 'Document chunks, embeddings and the roles allowed to read each chunk.', parentIds: ['spring-ai-api'] }],
      },
      {
        label: 'External',
        row: 3,
        nodes: [{ id: 'llm-api', name: 'LLM API', note: 'Receives only the chunks the asking user may see.', parentIds: ['spring-ai-api'] }],
      },
    ],
    releasePipeline: [deploy],
    optimizations: [
      'The role filter is part of the vector query itself. Filtering after retrieval would look correct in tests while restricted text still reached the prompt.',
      'Embeddings are keyed by content hash, so re-ingesting a folder only embeds files that changed.',
      'If no chunk clears the similarity threshold, the assistant says it does not know instead of guessing.',
    ],
    unattended: ['A scheduled job re-ingests changed documents.', 'Containers restart themselves and deploys run from GitHub Actions.'],
    needsSomeone: 'The LLM API key, its spend limit and model upgrades need an owner.',
  },

  'Feature drop kit': {
    kind: 'design',
    layers: [
      {
        label: 'Backend',
        row: 0,
        nodes: [
          { id: 'coupon-engine', name: 'Coupon engine', note: 'Rules and redemption limits.', parentIds: ['redis'] },
          { id: 'stock-alert-consumer', name: 'Stock alert consumer', note: 'Reads stock events and flags low inventory.', parentIds: ['kafka'] },
          { id: 'webhook-receiver', name: 'Webhook receiver', note: 'Accepts events and processes them asynchronously.', parentIds: ['kafka'] },
        ],
      },
      {
        label: 'Messaging and cache',
        row: 1,
        nodes: [
          { id: 'kafka', name: 'Kafka', note: 'Stock and webhook events.' },
          { id: 'redis', name: 'Redis', note: 'Atomic redemption counters.' },
        ],
      },
    ],
    releasePipeline: [deploy],
    optimizations: [
      'Coupon redemptions use an atomic Redis increment, so two simultaneous checkouts cannot both take the last use.',
      'Failed webhooks retry with growing delays, then land in a dead-letter table instead of disappearing.',
    ],
    unattended: ['Dead-letter entries can be replayed from an admin endpoint.', 'Containers restart themselves and deploys run from GitHub Actions.'],
    needsSomeone: 'Someone must watch the dead-letter table, or connect it to an alert.',
  },

  'Digital Library Platform': {
    kind: 'built',
    layers: [
      {
        label: 'Frontend',
        row: 0,
        nodes: [{ id: 'react', name: 'React.js', note: 'Screens for readers, vendors and admins.', parentIds: ['spring-boot'] }],
      },
      {
        label: 'Backend',
        row: 1,
        nodes: [{ id: 'spring-boot', name: 'Spring Boot 3, Java 21', note: 'REST APIs, Spring Data JPA, JWT, role-based workflows.' }],
      },
      {
        label: 'Data and storage',
        row: 2,
        nodes: [
          { id: 'postgresql', name: 'PostgreSQL', note: 'Schema versioned with Flyway.', parentIds: ['spring-boot'] },
          { id: 'redis', name: 'Redis', note: 'Caching.', parentIds: ['spring-boot'] },
          { id: 's3', name: 'S3', note: 'Book files.', parentIds: ['spring-boot'] },
        ],
      },
      {
        label: 'Notifications',
        row: 3,
        nodes: [{ id: 'ses-sns', name: 'SES and SNS', note: 'Email and SMS.', parentIds: ['spring-boot'] }],
      },
    ],
    releasePipeline: [
      {
        label: 'Release pipeline',
        row: 0,
        nodes: [
          { id: 'docker-compose', name: 'Docker Compose', note: 'Runs the stack.' },
          { id: 'github-actions', name: 'GitHub Actions', note: 'CI/CD.' },
          { id: 'aws-ec2', name: 'AWS EC2', note: 'Host.' },
        ],
      },
    ],
    optimizations: ['Redis caching.', 'Book files kept in S3, not in the database.'],
    unattended: [],
  },

  'PolicyDocs RAG Service': {
    kind: 'built',
    layers: [
      {
        label: 'Backend',
        row: 0,
        nodes: [
          { id: 'spring-ai-backend', name: 'Spring Boot 3 with Spring AI', note: 'Ingestion, chunking, embeddings, RAG Q&A, structured outputs.' },
        ],
      },
      {
        label: 'Data',
        row: 1,
        nodes: [
          { id: 'postgres-pgvector', name: 'PostgreSQL with pgvector', note: 'Vector retrieval.', parentIds: ['spring-ai-backend'] },
          { id: 'redis', name: 'Redis', note: 'Conversation context and caching.', parentIds: ['spring-ai-backend'] },
        ],
      },
      {
        label: 'Security and model',
        row: 2,
        nodes: [
          { id: 'jwt-rbac', name: 'JWT and RBAC', note: 'Constrain what retrieval can return.', parentIds: ['spring-ai-backend'] },
          { id: 'llm-api', name: 'LLM API', note: 'Called by the RAG pipeline to generate grounded answers from retrieved chunks; no open-ended chat access.', parentIds: ['spring-ai-backend'] },
        ],
      },
    ],
    releasePipeline: [
      {
        label: 'Release pipeline',
        row: 0,
        nodes: [
          { id: 'docker', name: 'Docker', note: 'Containerised service.' },
          { id: 'aws-ec2', name: 'AWS EC2', note: 'Host.' },
        ],
      },
    ],
    optimizations: ['pgvector retrieval.', 'Structured outputs.', 'Responses grounded in retrieved documents, with no open LLM access.'],
    unattended: [],
  },
}
