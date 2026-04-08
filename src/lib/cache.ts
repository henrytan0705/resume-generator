interface CacheEntry {
  data: any;
  expiresAt: number;
}
const scrapeCache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hour global memory cache limits
const MAX_CACHE_SIZE = 100; // Hard bounded map tracking preventing unbounded OOM memory faults organically!

export function getCachedProfile(url: string) {
  if (scrapeCache.has(url)) {
    const cached = scrapeCache.get(url)!;
    if (Date.now() < cached.expiresAt) {
      return cached.data;
    } else {
      scrapeCache.delete(url);
    }
  }
  return null;
}

export function setCachedProfile(url: string, data: any) {
  if (scrapeCache.size >= MAX_CACHE_SIZE) {
    const firstKey = scrapeCache.keys().next().value;
    if (firstKey) scrapeCache.delete(firstKey);
  }
  scrapeCache.set(url, {
    data,
    expiresAt: Date.now() + CACHE_DURATION_MS,
  });
}
