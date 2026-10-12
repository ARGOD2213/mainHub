/**
 * A deliberately simple capacity model for the Systems Lab.
 * It is illustrative: the point is to show how each design decision moves the bottleneck,
 * not to predict real latency or real AWS bills.
 */
export type LabInput = { rps: number; cdn: boolean; cache: boolean; replicas: boolean; queue: boolean; hpa: boolean }

export type Bottleneck = 'none' | 'pods' | 'primary' | 'replicas'

export type LabResult = {
  originRps: number
  pods: number
  maxPods: number
  replicas: number
  uApp: number
  uDb: number
  uRep: number
  hitRate: number
  p95: number
  errorPct: number
  cost: number
  status: 'Healthy' | 'Degraded' | 'Failing'
  bottleneck: Bottleneck
  advice: string
}

const READ_SHARE = 0.85
const EDGE_OFFLOAD = 0.6 // share of reads a CDN can answer (pages, assets, public GETs)
const POD_RPS = 300 // comfortable requests/s per API pod
const HPA_TARGET = 0.65
const MAX_PODS = 120
const FIXED_PODS = 3
const DB_QPS = 2000 // queries/s one database instance handles comfortably
const CACHE_HIT = 0.9
const QUEUE_SMOOTHING = 0.5 // batching + smoothing halves the peak write load
const PODS_PER_NODE = 4

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const wait = (u: number) => 1 / (1 - Math.min(u, 0.95)) // queueing: latency grows sharply near saturation

export function simulate(i: LabInput): LabResult {
  const reads = i.rps * READ_SHARE
  const writes = i.rps - reads
  const originReads = reads * (i.cdn ? 1 - EDGE_OFFLOAD : 1)
  const originRps = originReads + writes

  const pods = i.hpa ? clamp(Math.ceil(originRps / (POD_RPS * HPA_TARGET)), 2, MAX_PODS) : FIXED_PODS
  const uApp = originRps / (pods * POD_RPS)

  const hitRate = i.cache ? CACHE_HIT : 0
  const dbReads = originReads * (1 - hitRate)
  const dbWrites = writes * (i.queue ? QUEUE_SMOOTHING : 1)
  const replicas = i.replicas ? clamp(Math.ceil(dbReads / (DB_QPS * 0.6)), 1, 5) : 0
  const uDb = (dbWrites + (replicas ? 0 : dbReads)) / DB_QPS
  const uRep = replicas ? dbReads / (replicas * DB_QPS) : 0

  const appMs = 18 * wait(uApp)
  const readMs = hitRate * 2 + (1 - hitRate) * 14 * wait(replicas ? uRep : uDb)
  const writeMs = i.queue ? 6 : 11 * wait(uDb)
  const worst = Math.max(uApp, uDb, uRep)
  let p95 = Math.round(2.4 * (appMs + READ_SHARE * readMs + (1 - READ_SHARE) * writeMs) + 25)
  if (worst >= 1) p95 = Math.min(10000, Math.max(p95, 2000 + Math.round((worst - 1) * 3000))) // overloaded: requests time out
  const errorPct = worst > 1 ? (1 - 1 / worst) * 100 : 0

  const nodes = Math.ceil(pods / PODS_PER_NODE)
  const cost = Math.round(73 + nodes * 70 + 25 + 230 * (1 + replicas) + (i.cache ? 110 : 0) + (i.queue ? 10 : 0) + (i.cdn ? 40 : 0))

  let bottleneck: Bottleneck = 'none'
  if (worst > 0.85) bottleneck = worst === uApp ? 'pods' : worst === uDb ? 'primary' : 'replicas'

  const status: LabResult['status'] = errorPct > 2 ? 'Failing' : errorPct > 0 || p95 > 600 || worst > 0.85 ? 'Degraded' : 'Healthy'

  return { originRps, pods, maxPods: MAX_PODS, replicas, uApp, uDb, uRep, hitRate, p95, errorPct, cost, status, bottleneck, advice: advise(i, bottleneck, uApp, pods) }
}

function advise(i: LabInput, b: Bottleneck, uApp: number, pods: number): string {
  if (b === 'pods') {
    if (!i.hpa) return 'Three fixed pods can’t keep up. Turn on autoscaling.'
    if (!i.cdn) return 'Pods are at their maximum. Serve cacheable reads from the CDN edge.'
    if (pods >= MAX_PODS && uApp > 0.85) return 'Even 120 pods are busy. Time for regional sharding or a second region.'
    return 'Pods are running hot. Autoscaling is catching up.'
  }
  if (b === 'primary') {
    if (!i.cache) return 'The database is drowning in repeat reads. Add a Redis cache.'
    if (!i.queue) return 'Write bursts are hammering the primary. Queue writes and process them in batches.'
    if (!i.replicas) return 'Move the remaining reads to read replicas.'
    return 'One write primary is the ceiling now. Partition writes (by tenant or user) or move hot writes to DynamoDB.'
  }
  if (b === 'replicas') return 'Replicas are saturated. Cache more aggressively or add replicas.'
  if (!i.hpa) return 'Fine for now, but fixed capacity won’t survive a spike. Try the spike button.'
  return 'Holding up well. Push the traffic higher, or hit the spike button.'
}

/** log-scale slider helpers: 0..1000 ↔ 50..50,000 req/s */
export const MIN_RPS = 50
export const MAX_RPS = 50000
export const toRps = (v: number) => Math.round(MIN_RPS * Math.pow(MAX_RPS / MIN_RPS, v / 1000))
export const toSlider = (rps: number) => Math.round((1000 * Math.log(rps / MIN_RPS)) / Math.log(MAX_RPS / MIN_RPS))
