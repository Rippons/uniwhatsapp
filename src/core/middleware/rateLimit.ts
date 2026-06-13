import { errorResponse } from '@shared/responses';
import { HTTP_STATUS } from '@shared/constants';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, CLEANUP_INTERVAL);

export function rateLimit(
  request: Request,
  maxRequests = 100,
  windowMs = 60_000,
): Response | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return errorResponse('Too many requests', HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  return null;
}
