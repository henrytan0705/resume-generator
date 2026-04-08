
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10; // 10 requests per window per IP

// A simple in-memory sliding window rate limiter
export function isRateLimited(ip: string): { limited: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window or expired window
    const newEntry = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    rateLimitMap.set(ip, newEntry);
    return { limited: false, remaining: MAX_REQUESTS - 1, reset: newEntry.resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { limited: true, remaining: 0, reset: entry.resetAt };
  }

  entry.count += 1;
  return { limited: false, remaining: MAX_REQUESTS - entry.count, reset: entry.resetAt };
}

// Periodically clean up expired entries to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }, WINDOW_MS);
}
