import "server-only";

type Bucket = { attempts: number; expires: number };
const limiter = globalThis as typeof globalThis & { upavanLoginAttempts?: Map<string, Bucket> };
const buckets = (limiter.upavanLoginAttempts ??= new Map<string, Bucket>());
const WINDOW_MS = 15 * 60 * 1000;

// Process-local defense for this single-account, database-free application.
// The global cap also limits attempts if a client rotates forwarded IP headers.
export function allowLoginAttempt(ip: string) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.expires <= now) buckets.delete(key);
  }
  const keys = [
    { key: `ip:${ip.slice(0, 128)}`, limit: 10 },
    { key: "global", limit: 60 },
  ];
  if (keys.some(({ key, limit }) => (buckets.get(key)?.attempts ?? 0) >= limit)) return false;
  for (const { key } of keys) {
    const bucket = buckets.get(key) ?? { attempts: 0, expires: now + WINDOW_MS };
    bucket.attempts++;
    buckets.set(key, bucket);
  }
  return true;
}
