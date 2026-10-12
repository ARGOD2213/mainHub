/**
 * Single source of truth for the site.
 *
 * Honesty rules this file follows (keep them when you edit):
 *  - Blueprints are reference architectures / system-design case studies. They are labelled as designs
 *    on the site. No invented clients, users, revenue or performance numbers.
 *  - Figures inside a blueprint "brief" describe the hypothetical scenario being designed for.
 *  - ARGUS is real and public (github.com/ARGOD2213/ARGUS); its content comes from that repo.
 *  - Service timelines are typical ranges you can edit; prices are quoted per project.
 */

export const profile = {
  name: 'Chintala Mahindra',
  first: 'MAHINDRA',
  series: 'THE SCALE SERIES',
  studio: 'A CHINTALA ORIGINAL',
  role: 'Freelance Full-Stack & Cloud Engineer',
  headline: 'From MVP to millions of requests.',
  genres: ['System Design', 'Full Stack', 'AWS', 'Kubernetes', 'CI/CD'],
  logline:
    'I design, build and scale products end to end: React and Next.js up front, Java and Spring Boot behind it, and AWS, Docker, Kubernetes and CI/CD underneath, so your product stays fast when the traffic arrives.',
  location: 'Hyderabad, India',
  timezone: 'IST (UTC+5:30)',
  email: 'chintalamahindra163@gmail.com',
  phone: '+91 96181 12357',
  phoneTel: '+919618112357',
  whatsapp: 'https://wa.me/919618112357',
  github: 'https://github.com/ARGOD2213',
  linkedin: 'https://in.linkedin.com/in/chintala-mahindra-178306241',
  site: 'https://main-hub-mu.vercel.app',
  resumePdf: `${import.meta.env.BASE_URL}Chintala_Mahindra_Resume.pdf`,
  availability: 'Booking new projects',
}

export type SectionId = 'lab' | 'blueprints' | 'platform' | 'services' | 'process' | 'stack' | 'about' | 'faq' | 'resume'

export const viewers: { id: 'founder' | 'cto' | 'hiring'; name: string; blurb: string; color: string; order: SectionId[] }[] = [
  { id: 'founder', name: 'Founder', blurb: 'What I can build for you', color: '#ff7a1a', order: ['services', 'blueprints', 'lab', 'process', 'about', 'faq', 'platform', 'stack', 'resume'] },
  { id: 'cto', name: 'CTO / Tech lead', blurb: 'Architecture and platform depth', color: '#3ec7a5', order: ['lab', 'blueprints', 'platform', 'stack', 'process', 'services', 'about', 'faq', 'resume'] },
  { id: 'hiring', name: 'Agency / Hiring', blurb: 'Skills, proof and resume', color: '#8f7bff', order: ['about', 'blueprints', 'lab', 'stack', 'platform', 'resume', 'services', 'process', 'faq'] },
]

export const trailer = [
  { kicker: 'Previously on…', text: 'Your product found users. Now the pages are slow and the deploys are scary.' },
  { kicker: 'Episode 1', text: 'Load-test it, find the real bottleneck, fix that first.' },
  { kicker: 'Episode 2', text: 'Cache the hot path. Queue the bursts. Let Kubernetes scale the rest.' },
  { kicker: 'Episode 3', text: 'Every merge tested, scanned and shipped by canary, with automatic rollback.' },
  { kicker: 'Next season', text: 'Your product. Let’s write it together.' },
]

/* ───────────────────────── Blueprints (interactive system designs) ───────────────────────── */

export type BNode = { id: string; label: string; sub?: string; note: string; col: number; row: number; kind?: 'client' | 'edge' | 'app' | 'data' | 'async' | 'ext' }
export type Blueprint = {
  id: string
  title: string
  tagline: string
  genre: string
  status: 'blueprint' | 'built'
  brief: string
  nodes: BNode[]
  edges: [string, string][]
  trace: { name: string; steps: { node: string; text: string }[] }
  stages: { name: string; text: string }[]
  decisions: { title: string; why: string; tradeoff: string }[]
  failures: { what: string; fix: string }[]
  stack: string[]
  runsOn: string[]
  github?: string
  hue: [string, string, string]
}

export const blueprints: Blueprint[] = [
  {
    id: 'tenantforge',
    title: 'TenantForge',
    tagline: 'Multi-tenant B2B SaaS platform',
    genre: 'SaaS · Multi-tenancy · Billing',
    status: 'blueprint',
    brief:
      'A B2B SaaS serving hundreds of customer organisations on one platform. Every tenant’s data must stay isolated, a big tenant must never slow down a small one, enterprise customers want SSO, and billing has to just work.',
    nodes: [
      { id: 'users', label: 'Tenant users', note: 'Each request carries a signed JWT with tenant_id and roles.', col: 0, row: 1, kind: 'client' },
      { id: 'stripe', label: 'Stripe', sub: 'webhooks', note: 'Subscription events arrive as signed webhooks.', col: 0, row: 2, kind: 'ext' },
      { id: 'cdn', label: 'CloudFront', note: 'Serves the Next.js app and static assets from the edge.', col: 1, row: 0, kind: 'edge' },
      { id: 'alb', label: 'ALB + WAF', note: 'TLS, OWASP rules, and a coarse rate limit before anything reaches the pods.', col: 1, row: 1, kind: 'edge' },
      { id: 'web', label: 'Next.js', sub: 'SSR pods', note: 'Server-rendered dashboard; calls the API with the user’s token.', col: 2, row: 0, kind: 'app' },
      { id: 'api', label: 'API pods', sub: 'Spring Boot 3', note: 'Stateless. Resolves the tenant from the JWT and sets it on the DB session before any query.', col: 2, row: 1, kind: 'app' },
      { id: 'idp', label: 'Keycloak', sub: 'SSO · OIDC/SAML', note: 'Per-tenant identity providers; issues the JWTs the API verifies.', col: 2, row: 2, kind: 'ext' },
      { id: 'redis', label: 'Redis', note: 'Per-tenant rate-limit buckets and hot config, keys prefixed by tenant.', col: 3, row: 0, kind: 'data' },
      { id: 'pg', label: 'Aurora Postgres', sub: 'pooled tenants', note: 'Shared tables protected by Row-Level Security policies on tenant_id.', col: 3, row: 1, kind: 'data' },
      { id: 'silo', label: 'Dedicated DB', sub: 'enterprise tier', note: 'Large tenants get their own database. Same code, routed by a tenant catalog.', col: 3, row: 2, kind: 'data' },
      { id: 'sqs', label: 'SQS', note: 'Exports, emails, outbound webhooks — anything slow leaves the request path.', col: 4, row: 1, kind: 'async' },
      { id: 'workers', label: 'Workers', sub: 'KEDA scaled', note: 'Scale on queue depth, down to zero overnight.', col: 5, row: 1, kind: 'async' },
      { id: 's3', label: 'S3', note: 'Tenant files under per-tenant prefixes, encrypted with KMS.', col: 5, row: 0, kind: 'data' },
    ],
    edges: [['users', 'cdn'], ['cdn', 'web'], ['web', 'api'], ['users', 'alb'], ['alb', 'api'], ['stripe', 'alb'], ['api', 'idp'], ['api', 'redis'], ['api', 'pg'], ['api', 'silo'], ['api', 'sqs'], ['sqs', 'workers'], ['workers', 's3']],
    trace: {
      name: 'A tenant user opens their invoices',
      steps: [
        { node: 'users', text: 'Browser requests /invoices with a JWT for tenant acme.' },
        { node: 'cdn', text: 'Static shell comes from the edge cache.' },
        { node: 'web', text: 'Next.js renders the page and calls the API server-side.' },
        { node: 'api', text: 'API verifies the token and runs SET app.tenant = \'acme\' on its DB session.' },
        { node: 'redis', text: 'Token bucket for acme has room: request continues.' },
        { node: 'pg', text: 'Row-Level Security returns only acme’s rows, even if the query forgot a WHERE clause.' },
      ],
    },
    stages: [
      { name: 'Launch', text: 'One region, two or three API pods, a single Aurora instance, all tenants pooled behind RLS.' },
      { name: 'Growth', text: 'Redis for rate limits and hot reads, an Aurora reader, KEDA-scaled workers, per-tenant dashboards.' },
      { name: 'Scale', text: 'Enterprise tenants moved to dedicated databases through the tenant catalog; multi-AZ everything.' },
    ],
    decisions: [
      { title: 'Isolation enforced by Postgres RLS', why: 'The database refuses cross-tenant rows, so one missed filter in code cannot leak data.', tradeoff: 'Every pooled connection must set and reset the tenant; tests check it on each repository.' },
      { title: 'Pool first, silo on demand', why: 'Small tenants share cheap infrastructure; big ones get their own DB without forking the code.', tradeoff: 'Needs a tenant catalog and migration tooling that runs per database.' },
      { title: 'Stripe is the billing source of truth', why: 'Plans and invoices live where payments live; the app caches entitlements.', tradeoff: 'A plan change takes effect after the webhook lands, usually seconds later.' },
    ],
    failures: [
      { what: 'One tenant floods the API', fix: 'Per-tenant token buckets in Redis return 429 with Retry-After; other tenants are unaffected.' },
      { what: 'Migration locks a big table', fix: 'Expand-and-contract migrations with Flyway and CREATE INDEX CONCURRENTLY.' },
      { what: 'Stripe sends the same webhook twice', fix: 'Processed event ids are stored; duplicates are acknowledged and skipped.' },
    ],
    stack: ['Next.js', 'Spring Boot 3', 'Aurora PostgreSQL', 'Redis', 'SQS', 'Keycloak', 'Stripe'],
    runsOn: ['EKS', 'KEDA', 'Terraform', 'Argo CD', 'OpenTelemetry'],
    hue: ['#1b0d02', '#a34a06', '#ff7a1a'],
  },
  {
    id: 'swiftcart',
    title: 'SwiftCart Flash',
    tagline: 'Flash-sale commerce that never oversells',
    genre: 'E-commerce · Spikes · Inventory',
    status: 'blueprint',
    brief:
      'A D2C brand runs limited drops: a huge crowd arrives in the same minute for a few thousand units. The site has to stay up, never sell a unit twice, and charge every buyer exactly once.',
    nodes: [
      { id: 'shoppers', label: 'Shoppers', note: 'Arrive in a burst the second the drop opens.', col: 0, row: 1, kind: 'client' },
      { id: 'cdn', label: 'CloudFront', sub: '+ S3', note: 'Product pages are pre-rendered and cached; the origin never sees catalogue traffic.', col: 1, row: 0, kind: 'edge' },
      { id: 'room', label: 'Waiting room', note: 'Admits shoppers at the rate checkout can handle and hands out signed entry tokens.', col: 1, row: 1, kind: 'edge' },
      { id: 'api', label: 'Checkout pods', sub: 'Spring Boot 3', note: 'Pre-scaled on a schedule before the drop; validates entry tokens.', col: 2, row: 1, kind: 'app' },
      { id: 'redis', label: 'Redis inventory', note: 'A Lua script decrements stock atomically and creates a 10-minute reservation.', col: 3, row: 0, kind: 'data' },
      { id: 'pay', label: 'Payment gateway', sub: 'Razorpay / Stripe', note: 'Called with an idempotency key per order.', col: 3, row: 1, kind: 'ext' },
      { id: 'pg', label: 'Aurora', sub: 'orders', note: 'Orders written once, keyed by idempotency key.', col: 4, row: 1, kind: 'data' },
      { id: 'sqs', label: 'SQS FIFO', note: 'Fulfilment events in order per order id.', col: 4, row: 2, kind: 'async' },
      { id: 'workers', label: 'Fulfilment', sub: 'workers', note: 'Emails, invoices, warehouse API.', col: 5, row: 2, kind: 'async' },
      { id: 'recon', label: 'Reconciler', sub: 'cron', note: 'Releases expired reservations; matches gateway payments to orders.', col: 5, row: 0, kind: 'async' },
    ],
    edges: [['shoppers', 'cdn'], ['shoppers', 'room'], ['room', 'api'], ['api', 'redis'], ['api', 'pay'], ['pay', 'pg'], ['api', 'pg'], ['pg', 'sqs'], ['sqs', 'workers'], ['recon', 'redis'], ['recon', 'pg']],
    trace: {
      name: 'A shopper checks out during the drop',
      steps: [
        { node: 'shoppers', text: 'Shopper hits “Buy” the moment the drop opens.' },
        { node: 'room', text: 'Waiting room queues them, then issues a signed entry token.' },
        { node: 'api', text: 'Checkout validates the token and the cart.' },
        { node: 'redis', text: 'Atomic decrement: stock 1 → 0, reservation created. Next buyer sees sold out.' },
        { node: 'pay', text: 'Payment charged once, with the order’s idempotency key.' },
        { node: 'pg', text: 'Order committed. A retry with the same key returns this same order.' },
        { node: 'sqs', text: 'Fulfilment event queued; the shopper sees confirmation immediately.' },
      ],
    },
    stages: [
      { name: 'Launch', text: 'Cached catalogue at the edge, a single checkout service, stock counter in Redis.' },
      { name: 'Growth', text: 'Waiting room, scheduled pre-scaling before each drop, a k6 rehearsal at expected peak.' },
      { name: 'Scale', text: 'Per-SKU sharded inventory keys, multi-AZ Redis, bot control at the WAF.' },
    ],
    decisions: [
      { title: 'Stock lives in Redis during the drop', why: 'Thousands of buyers fight over the same rows; an atomic in-memory decrement can’t oversell and doesn’t lock the database.', tradeoff: 'Redis is the source of truth for the window and is reconciled to the database afterwards.' },
      { title: 'A waiting room, not just autoscaling', why: 'Pods take a minute or two to scale; a waiting room shapes the spike instantly.', tradeoff: 'Some shoppers wait in line instead of seeing an error page.' },
      { title: 'Idempotency keys end to end', why: 'Mobile retries and double clicks can’t create two orders or two charges.', tradeoff: 'Keys must be stored and expired; every client sends one.' },
    ],
    failures: [
      { what: 'Payment succeeds but the order write fails', fix: 'The reconciler matches gateway payment ids to orders and completes or refunds.' },
      { what: 'Bots grab the stock', fix: 'WAF bot control, signed waiting-room tokens, per-account purchase limits.' },
      { what: 'Redis primary dies mid-drop', fix: 'Multi-AZ replica fails over automatically; reservations can be rebuilt from the order log.' },
    ],
    stack: ['Next.js', 'Spring Boot 3', 'Redis + Lua', 'Aurora PostgreSQL', 'SQS FIFO', 'Razorpay / Stripe'],
    runsOn: ['EKS', 'HPA + scheduled scaling', 'CloudFront', 'AWS WAF', 'k6'],
    hue: ['#200606', '#9e1f2d', '#ff5a6e'],
  },
  {
    id: 'ledgerline',
    title: 'LedgerLine',
    tagline: 'Payments and double-entry ledger',
    genre: 'Fintech · Consistency · Audit',
    status: 'blueprint',
    brief:
      'A wallet or lending product where every rupee must be traceable: money moves between accounts, nothing is created or lost, retries are safe, and an auditor can rebuild any balance from history.',
    nodes: [
      { id: 'client', label: 'Apps & partners', note: 'Mobile apps and partner APIs initiating transfers.', col: 0, row: 1, kind: 'client' },
      { id: 'gw', label: 'API Gateway', sub: 'mTLS · rate limits', note: 'Partners authenticate with client certificates; every call is rate-limited.', col: 1, row: 1, kind: 'edge' },
      { id: 'redis', label: 'Redis', sub: 'idempotency', note: 'Idempotency keys with a 24-hour TTL and the stored response.', col: 2, row: 0, kind: 'data' },
      { id: 'api', label: 'Payments API', sub: 'Spring Boot 3', note: 'Validates the request and records the transfer intent.', col: 2, row: 1, kind: 'app' },
      { id: 'ledger', label: 'Ledger service', note: 'Every transfer is two entries, debit and credit, that sum to zero.', col: 3, row: 1, kind: 'app' },
      { id: 'pg', label: 'PostgreSQL', sub: 'append-only journal', note: 'Entries are never updated. Balances are derived from the journal.', col: 4, row: 1, kind: 'data' },
      { id: 'outbox', label: 'Outbox table', note: 'Events written in the same transaction as the journal entries.', col: 3, row: 2, kind: 'async' },
      { id: 'relay', label: 'Outbox relay', sub: '→ SNS / SQS', note: 'Publishes outbox rows at least once; consumers are idempotent.', col: 4, row: 2, kind: 'async' },
      { id: 'notify', label: 'Webhooks & alerts', note: 'Partner webhooks and user notifications.', col: 5, row: 2, kind: 'async' },
      { id: 'recon', label: 'Reconciliation', sub: 'daily jobs', note: 'Matches the journal against bank and PSP statements.', col: 5, row: 1, kind: 'async' },
      { id: 's3', label: 'S3 Object Lock', note: 'Write-once statement archive for audits.', col: 5, row: 0, kind: 'data' },
    ],
    edges: [['client', 'gw'], ['gw', 'api'], ['api', 'redis'], ['api', 'ledger'], ['ledger', 'pg'], ['ledger', 'outbox'], ['outbox', 'relay'], ['relay', 'notify'], ['pg', 'recon'], ['recon', 's3']],
    trace: {
      name: 'A user sends ₹500 to a friend (and the app retries)',
      steps: [
        { node: 'client', text: 'App sends the transfer with Idempotency-Key k42. The network times out, so it retries.' },
        { node: 'gw', text: 'Gateway authenticates and rate-limits both calls.' },
        { node: 'api', text: 'First call claims k42. The retry finds k42 and waits for the first result.' },
        { node: 'ledger', text: 'Debit Asha ₹500, credit Ravi ₹500, in one serializable transaction.' },
        { node: 'pg', text: 'Journal rows appended; Asha’s balance can’t go below zero.' },
        { node: 'outbox', text: 'transfer.completed written in the same transaction.' },
        { node: 'relay', text: 'Relay publishes the event; both apps get notified once.' },
        { node: 'notify', text: 'The retry returns the original response, so one transfer and one charge.' },
      ],
    },
    stages: [
      { name: 'Launch', text: 'One Postgres primary, serializable transfers, idempotency keys and outbox from day one.' },
      { name: 'Growth', text: 'Read replica for statements and reporting; journal partitioned by month.' },
      { name: 'Scale', text: 'Accounts sharded by id range; hot accounts split into sub-accounts to avoid lock contention.' },
    ],
    decisions: [
      { title: 'Double-entry, append-only journal', why: 'Any balance can be recomputed and explained line by line.', tradeoff: 'Corrections are new reversing entries, never edits.' },
      { title: 'Transactional outbox', why: 'A crash can’t leave the ledger and the event stream disagreeing.', tradeoff: 'Events are at-least-once; every consumer de-duplicates.' },
      { title: 'Serializable isolation for transfers', why: 'Two transfers racing on one account can’t overdraw it.', tradeoff: 'Occasional serialization failures are retried automatically.' },
    ],
    failures: [
      { what: 'Client retries a timed-out transfer', fix: 'Same idempotency key returns the original result.' },
      { what: 'PSP says paid, we say pending', fix: 'Reconciliation flags the mismatch and resolves it through the PSP status API.' },
      { what: 'A bug posts a wrong amount', fix: 'A reversing entry plus the corrected one; the audit trail shows both.' },
    ],
    stack: ['Spring Boot 3', 'PostgreSQL', 'Redis', 'SNS / SQS', 'API Gateway (mTLS)', 'S3 Object Lock'],
    runsOn: ['EKS', 'Terraform', 'Secrets Manager', 'CloudWatch', 'OpenTelemetry'],
    hue: ['#03141a', '#0d6b62', '#3ec7a5'],
  },
  {
    id: 'routelive',
    title: 'RouteLive',
    tagline: 'Real-time delivery tracking and dispatch',
    genre: 'Real-time · Geo · WebSockets',
    status: 'blueprint',
    brief:
      'A delivery business where customers watch their rider move on a map, dispatch finds the nearest free rider instantly, and the system copes with riders dropping in and out of mobile coverage.',
    nodes: [
      { id: 'riders', label: 'Rider app', note: 'Sends GPS every few seconds and buffers points while offline.', col: 0, row: 0, kind: 'client' },
      { id: 'ingest', label: 'Location API', note: 'Thin, stateless ingest that only validates and forwards.', col: 1, row: 0, kind: 'edge' },
      { id: 'stream', label: 'Kinesis', sub: 'by rider id', note: 'Absorbs bursts and keeps each rider’s points in order. Consumers can replay.', col: 2, row: 0, kind: 'async' },
      { id: 'geo', label: 'Redis GEO', note: 'Live rider positions; GEOSEARCH finds riders within a radius.', col: 3, row: 0, kind: 'data' },
      { id: 'writer', label: 'Track writer', note: 'Downsamples points and stores finished trips.', col: 4, row: 0, kind: 'async' },
      { id: 'pg', label: 'PostGIS', note: 'Trips, zones and geofences for history and analytics.', col: 5, row: 0, kind: 'data' },
      { id: 'dispatch', label: 'Dispatch', note: 'Scores nearby riders by distance, current load and ETA.', col: 3, row: 1, kind: 'app' },
      { id: 'orders', label: 'Orders API', note: 'Creates orders and asks dispatch for a rider.', col: 4, row: 1, kind: 'app' },
      { id: 'pubsub', label: 'Redis pub/sub', note: 'Fans position updates out to whichever gateway pod holds the customer.', col: 2, row: 2, kind: 'async' },
      { id: 'ws', label: 'WebSocket gateway', note: 'Holds customer connections; scales on connection count.', col: 1, row: 2, kind: 'edge' },
      { id: 'customers', label: 'Customer app', note: 'Live map and ETA.', col: 0, row: 2, kind: 'client' },
    ],
    edges: [['riders', 'ingest'], ['ingest', 'stream'], ['stream', 'geo'], ['stream', 'writer'], ['writer', 'pg'], ['geo', 'dispatch'], ['orders', 'dispatch'], ['stream', 'pubsub'], ['pubsub', 'ws'], ['ws', 'customers']],
    trace: {
      name: 'A rider moves; the customer’s map updates',
      steps: [
        { node: 'riders', text: 'Rider app sends a GPS point.' },
        { node: 'ingest', text: 'Ingest validates it and forwards it in a few milliseconds.' },
        { node: 'stream', text: 'Point lands on the rider’s shard, in order.' },
        { node: 'geo', text: 'Live position updated; dispatch sees it on the next search.' },
        { node: 'pubsub', text: 'Update published on the order’s channel.' },
        { node: 'ws', text: 'The gateway pod holding this customer pushes it down the socket.' },
        { node: 'customers', text: 'The marker moves on the customer’s map.' },
      ],
    },
    stages: [
      { name: 'Launch', text: 'One WebSocket service, Redis GEO for live positions, Postgres for orders.' },
      { name: 'Growth', text: 'A stream between ingest and consumers; stateless gateways with Redis fan-out.' },
      { name: 'Scale', text: 'Partition by city; gateways scale on connections and consumers on stream lag.' },
    ],
    decisions: [
      { title: 'Hot positions in Redis, history in PostGIS', why: 'Live lookups need memory speed; history needs durable, queryable storage.', tradeoff: 'Two stores to keep in sync, which the stream makes simple.' },
      { title: 'A stream between ingest and consumers', why: 'Spikes don’t drop points, and a buggy consumer can be fixed and replayed.', tradeoff: 'One more managed service to run and monitor.' },
      { title: 'Pub/sub fan-out instead of sticky sessions', why: 'Any gateway pod can serve any customer, so scaling and restarts are painless.', tradeoff: 'Every update goes through Redis once more.' },
    ],
    failures: [
      { what: 'Rider loses network', fix: 'The app buffers and backfills; ETA is marked stale after a timeout.' },
      { what: 'Gateway pod restarts', fix: 'Clients reconnect with backoff and resume from the last position snapshot.' },
      { what: 'Rainstorm spike in one city', fix: 'Dispatch widens its radius; consumers scale on stream lag.' },
    ],
    stack: ['Spring Boot 3', 'WebSockets', 'Kinesis', 'Redis GEO + pub/sub', 'PostGIS', 'React Native / React'],
    runsOn: ['EKS', 'KEDA', 'Terraform', 'Grafana', 'OpenTelemetry'],
    hue: ['#0e0820', '#4b2fa8', '#8f7bff'],
  },
  {
    id: 'docmind',
    title: 'DocMind',
    tagline: 'AI document assistant with permission-aware RAG',
    genre: 'AI · RAG · Access control',
    status: 'blueprint',
    brief:
      'A company wants staff to ask questions across thousands of documents and get answers with sources, without anyone ever seeing text from a document they couldn’t open themselves, and without the AI bill running away.',
    nodes: [
      { id: 'users', label: 'Staff', note: 'Ask questions in a chat UI.', col: 0, row: 1, kind: 'client' },
      { id: 'web', label: 'Chat UI', sub: 'Next.js', note: 'Streams answers token by token, with clickable citations.', col: 1, row: 1, kind: 'edge' },
      { id: 'authz', label: 'Permission service', note: 'Turns the user’s groups into the set of documents they may read.', col: 2, row: 0, kind: 'app' },
      { id: 'api', label: 'Spring AI service', note: 'Retrieves, builds the prompt, streams the answer with citations.', col: 2, row: 1, kind: 'app' },
      { id: 'cache', label: 'Semantic cache', sub: 'Redis', note: 'Similar questions from the same permission set reuse an answer.', col: 3, row: 0, kind: 'data' },
      { id: 'vec', label: 'pgvector', sub: 'hybrid search', note: 'Vector + keyword search, with the permission filter inside the query.', col: 3, row: 1, kind: 'data' },
      { id: 'llm', label: 'LLM API', sub: 'Bedrock / OpenAI', note: 'Receives only the retrieved chunks the user may see.', col: 4, row: 1, kind: 'ext' },
      { id: 'evals', label: 'Evals & spend', note: 'Answer-quality checks and token spend per team.', col: 5, row: 1, kind: 'async' },
      { id: 'src', label: 'S3 + connectors', note: 'Drive, SharePoint and uploads land here.', col: 2, row: 2, kind: 'data' },
      { id: 'q', label: 'SQS', note: 'One message per changed document.', col: 3, row: 2, kind: 'async' },
      { id: 'embed', label: 'Embedding workers', note: 'Chunk, embed, write. Unchanged files are skipped by content hash.', col: 4, row: 2, kind: 'async' },
    ],
    edges: [['users', 'web'], ['web', 'api'], ['api', 'authz'], ['api', 'cache'], ['api', 'vec'], ['api', 'llm'], ['api', 'evals'], ['src', 'q'], ['q', 'embed'], ['embed', 'vec']],
    trace: {
      name: 'An employee asks about the leave policy',
      steps: [
        { node: 'users', text: '“How many days of parental leave do I get?”' },
        { node: 'web', text: 'Question sent; the UI starts listening for a stream.' },
        { node: 'api', text: 'Service receives the question with the user’s identity.' },
        { node: 'authz', text: 'User may read: HR handbook, India policies. Not: board minutes.' },
        { node: 'vec', text: 'Hybrid search runs only over permitted documents; top 6 chunks returned.' },
        { node: 'llm', text: 'Model answers from those chunks only, citing each source.' },
        { node: 'web', text: 'Answer streams back with links; nothing restricted ever entered the prompt.' },
      ],
    },
    stages: [
      { name: 'Launch', text: 'pgvector inside the main Postgres, synchronous ingestion for a small corpus.' },
      { name: 'Growth', text: 'Queue-based ingestion workers, semantic cache, streaming responses.' },
      { name: 'Scale', text: 'Per-team token budgets, eval suite gating prompt changes in CI, model routing by difficulty.' },
    ],
    decisions: [
      { title: 'Permission filter inside the vector query', why: 'Filtering after retrieval looks fine in tests while restricted text still reaches the prompt.', tradeoff: 'Permission sets must be indexed alongside the chunks and kept fresh.' },
      { title: 'Cite or say “I don’t know”', why: 'Below a similarity threshold the assistant declines instead of guessing.', tradeoff: 'Some answerable questions get a polite refusal until docs improve.' },
      { title: 'Embed by content hash', why: 'Re-ingesting a folder only pays for files that changed.', tradeoff: 'A hash index to maintain per source.' },
    ],
    failures: [
      { what: 'Prompt injection hidden in a document', fix: 'Retrieved text is treated as data, the system prompt is isolated, and outputs are checked.' },
      { what: 'LLM provider slow or down', fix: 'Timeouts, a fallback model, and cached answers for common questions.' },
      { what: 'Token bill spikes', fix: 'Per-team budgets, semantic cache, a smaller model for simple questions.' },
    ],
    stack: ['Spring AI', 'pgvector', 'Redis', 'SQS', 'Next.js', 'Bedrock / OpenAI'],
    runsOn: ['EKS', 'KEDA', 'Terraform', 'CloudWatch', 'Eval suite in CI'],
    hue: ['#13091c', '#7b2a8c', '#e07bff'],
  },
  {
    id: 'argus',
    title: 'ARGUS',
    tagline: 'Event-driven industrial IoT monitoring (open source)',
    genre: 'IoT · Event-driven · Serverless',
    status: 'built',
    brief:
      'My own open-source platform for continuous-process plants: event-driven alerting, safety workflows, predictive machine intelligence and nine operator dashboards, on a deliberately lean AWS footprint. Built over eight sprints, with architecture decisions written down before the code.',
    nodes: [
      { id: 'sensors', label: 'Sensors · edge agent', note: 'Read-only edge layer with a ring buffer and offline rules.', col: 0, row: 1, kind: 'client' },
      { id: 'sqs', label: 'SQS FIFO', note: 'Ordered sensor events.', col: 1, row: 1, kind: 'async' },
      { id: 'rules', label: 'Lambda rule engine', note: 'Always on, triggered from SQS (ADR-001).', col: 2, row: 1, kind: 'app' },
      { id: 'sns', label: 'SNS alerts', note: 'CRITICAL and WARNING notifications.', col: 2, row: 2, kind: 'async' },
      { id: 'phone', label: 'Phone · ops.html', note: 'Hosted on S3; starts and stops the app tier.', col: 0, row: 0, kind: 'client' },
      { id: 'apigw', label: 'API Gateway + Lambda', note: 'Starts and stops the EC2 instance on demand.', col: 1, row: 0, kind: 'edge' },
      { id: 'ec2', label: 'Spring Boot 3.2', sub: 'EC2 t3.micro', note: 'Dashboards, Permit-to-Work, handover, machine chat.', col: 2, row: 0, kind: 'app' },
      { id: 'ddb', label: 'DynamoDB', note: 'Alerts, PTW, acknowledgements, votes.', col: 3, row: 1, kind: 'data' },
      { id: 'ens', label: 'Predictive ensemble', note: 'Named local models; advisory only, never controls equipment.', col: 3, row: 0, kind: 'app' },
      { id: 's3', label: 'S3', note: 'Handover notes and audit artifacts.', col: 4, row: 0, kind: 'data' },
      { id: 'athena', label: 'Athena', note: 'Historical sensor data queried in place (ADR-004).', col: 4, row: 1, kind: 'data' },
    ],
    edges: [['sensors', 'sqs'], ['sqs', 'rules'], ['rules', 'sns'], ['rules', 'ddb'], ['phone', 'apigw'], ['apigw', 'ec2'], ['ec2', 'ddb'], ['ec2', 'ens'], ['ec2', 's3'], ['ec2', 'athena']],
    trace: {
      name: 'A compressor runs hot',
      steps: [
        { node: 'sensors', text: 'Edge agent reads a temperature trending toward its limit.' },
        { node: 'sqs', text: 'Event queued in order with the machine’s other readings.' },
        { node: 'rules', text: 'Rule engine evaluates thresholds and trajectory.' },
        { node: 'sns', text: 'WARNING published to the on-shift team.' },
        { node: 'ddb', text: 'Alert stored with its evidence, awaiting acknowledgement.' },
        { node: 'ec2', text: 'Operator opens the machine dashboard to acknowledge it.' },
        { node: 'ens', text: 'Ensemble explains the likely failure mode, as advice only.' },
      ],
    },
    stages: [
      { name: 'Sprints 1–3', text: 'Data foundation, Lambda rule engine, safety backends.' },
      { name: 'Sprints 4–5', text: 'Phone control, escalation, handover, Permit-to-Work, AI feedback loop.' },
      { name: 'Sprints 6–8', text: 'SIL register, CEMS, edge agent, OPC-UA readiness, load-test harness.' },
    ],
    decisions: [
      { title: 'Rule engine is Lambda only', why: 'Alerting stays on even when the app tier is switched off to save cost.', tradeoff: 'Rule logic is deployed separately from the Spring Boot app.' },
      { title: 'Zero write path to the OT layer', why: 'Software can advise operators but can never move plant equipment.', tradeoff: 'Every action is a human decision, by design.' },
      { title: 'Athena + S3 for history, DynamoDB for events', why: 'Cheap, serverless history without running a database 24/7.', tradeoff: 'History queries take seconds, not milliseconds.' },
    ],
    failures: [
      { what: 'Plant network drops', fix: 'Edge agent keeps a ring buffer and evaluates offline rules locally.' },
      { what: 'AI suggests something unsafe', fix: 'Advisory wrapper plus explicit human approval states; output is never control.' },
      { what: 'Cloud bill creeps up', fix: 'No ECS, no ALB, no NAT gateway; the app tier runs only when needed.' },
    ],
    stack: ['Java 17', 'Spring Boot 3.2', 'AWS Lambda', 'SQS FIFO', 'SNS', 'DynamoDB', 'S3', 'Athena', 'Python'],
    runsOn: ['API Gateway', 'EC2 on demand', 'Docker', 'ADRs'],
    github: 'https://github.com/ARGOD2213/ARGUS',
    hue: ['#171204', '#7a5d06', '#ffc94a'],
  },
]

/* ───────────────────────── Services ───────────────────────── */

export const services = [
  {
    id: 'mvp',
    name: 'Full-stack MVP',
    pitch: 'Idea to production on AWS, built to grow instead of being rewritten at the first customer.',
    gets: ['Next.js / React front end', 'Spring Boot 3 API with auth & roles', 'PostgreSQL schema + migrations', 'Payments, email, file storage', 'CI/CD and infra as code'],
    typical: '4–8 weeks',
  },
  {
    id: 'scale',
    name: 'Scale & performance rescue',
    pitch: 'Slow pages, timeouts at peak, a database at 90% CPU. Find the real bottleneck and fix it.',
    gets: ['Load test that reproduces the pain (k6)', 'Profiling, query plans, indexing', 'Caching and async offload', 'Capacity plan for the next 10×', 'Written report of what changed'],
    typical: '1–3 weeks',
  },
  {
    id: 'k8s',
    name: 'Kubernetes & cloud migration',
    pitch: 'From one hand-managed server to containers on EKS, with zero-downtime cutover.',
    gets: ['Dockerised services', 'EKS cluster via Terraform', 'Helm charts + autoscaling', 'Secrets, IAM roles, network policies', 'Runbook and handover session'],
    typical: '3–6 weeks',
  },
  {
    id: 'cicd',
    name: 'CI/CD & DevOps setup',
    pitch: 'Deploys that are boring: every merge tested, scanned and shipped, with a one-click rollback.',
    gets: ['GitHub Actions pipelines', 'Preview environments per PR', 'Image scanning + SAST', 'Canary / blue-green releases', 'Dashboards and alerts'],
    typical: '1–2 weeks',
  },
  {
    id: 'ai',
    name: 'AI feature integration',
    pitch: 'Document Q&A, assistants and summaries inside your existing product, safely.',
    gets: ['RAG over your data with citations', 'Permission-aware retrieval', 'Streaming chat API + UI', 'Cost controls and caching', 'Evals so quality doesn’t drift'],
    typical: '2–4 weeks',
  },
  {
    id: 'retainer',
    name: 'Fractional backend engineer',
    pitch: 'A senior pair of hands on your backend and infrastructure every month, without a full-time hire.',
    gets: ['Fixed monthly hours', 'Feature work + reviews', 'Infra and cost hygiene', 'Incident help in your hours', 'Monthly written summary'],
    typical: 'Monthly',
  },
]

export const engagement = [
  { name: 'Fixed scope', text: 'Clear deliverables, fixed quote, paid by milestone.' },
  { name: 'Sprint based', text: 'Two-week sprints with a demo at the end of each.' },
  { name: 'Retainer', text: 'Reserved hours every month for ongoing work.' },
]

/* ───────────────────────── Process & standards ───────────────────────── */

export const process = [
  { name: 'Discovery call', text: '30 minutes on the product, the users, the pain and the deadline.', out: 'Shared notes' },
  { name: 'Architecture & quote', text: 'A short design doc with diagrams, decisions and trade-offs, plus a fixed quote.', out: 'Design doc + quote' },
  { name: 'Build in sprints', text: 'Working software every week on a staging URL, with a written update.', out: 'Weekly demo' },
  { name: 'Launch', text: 'Load-tested, monitored, with alerts and a rollback plan rehearsed.', out: 'Go-live checklist' },
  { name: 'Handover', text: 'Runbooks, recorded walkthrough, and everything in your own accounts.', out: 'You own it all' },
]

export const standards = [
  { area: 'Infrastructure as code', items: ['Terraform for every AWS resource', 'Separate staging and production', 'No click-ops'] },
  { area: 'Delivery', items: ['CI on every PR', 'Image and dependency scanning', 'Canary or blue-green releases', 'Rollback in one step'] },
  { area: 'Observability', items: ['OpenTelemetry traces', 'Prometheus / Grafana or CloudWatch dashboards', 'Alerts on SLOs, not on CPU'] },
  { area: 'Security', items: ['Least-privilege IAM roles', 'Secrets in AWS Secrets Manager', 'OWASP checks on the API', 'Encrypted at rest and in transit'] },
  { area: 'Quality', items: ['Unit + Testcontainers integration tests', 'k6 load test before launch', 'OpenAPI docs generated from code'] },
  { area: 'Ownership', items: ['Your GitHub, your AWS account', 'Architecture decision records', 'Runbooks for every alert'] },
]

/* ───────────────────────── Stack ───────────────────────── */

export const stack: { group: string; items: string[] }[] = [
  { group: 'Front end', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { group: 'Back end', items: ['Java 21', 'Spring Boot 3', 'Spring Security · JWT · OAuth2', 'REST · WebSockets', 'Microservices'] },
  { group: 'Data', items: ['PostgreSQL / Aurora', 'Redis', 'DynamoDB', 'pgvector', 'SQL Server'] },
  { group: 'AWS', items: ['EKS · EC2 · Lambda', 'RDS · S3 · CloudFront', 'SQS · SNS', 'IAM · Secrets Manager', 'CloudWatch'] },
  { group: 'Platform', items: ['Docker', 'Kubernetes · Helm', 'Argo CD', 'Terraform', 'GitHub Actions'] },
  { group: 'AI', items: ['Spring AI', 'RAG · embeddings', 'Vector search', 'LLM APIs', 'Structured outputs'] },
]

export const credentials = [
  'AWS Certified Cloud Practitioner (CLF-C02)',
  'B.Tech, Electronics & Communication — VIT Vellore',
  'Open source: ARGUS on GitHub',
]

export const faq = [
  { q: 'How do you price a project?', a: 'After a short call I send a written scope with a fixed quote for fixed-scope work, or a sprint or monthly rate for ongoing work. Payments are tied to milestones you can see working.' },
  { q: 'Who owns the code and the cloud account?', a: 'You do, from day one. Code lives in your GitHub organisation and infrastructure runs in your AWS account. I work with access you grant and can revoke.' },
  { q: 'Can you work with my existing team or codebase?', a: 'Yes. Most work is adding to a product that already exists. I follow your conventions, open PRs for review and leave documentation behind.' },
  { q: 'What time zone do you work in?', a: 'IST (UTC+5:30), from Hyderabad. You get a written update every day, a live demo every week, and calls scheduled in your working hours.' },
  { q: 'Will you sign an NDA?', a: 'Yes, before we discuss anything confidential.' },
  { q: 'What happens after launch?', a: 'A handover session, runbooks for every alert, and an optional retainer for fixes, upgrades and new features.' },
]
