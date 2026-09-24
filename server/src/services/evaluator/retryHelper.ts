/**
 * Helper to determine if an error is transient and eligible for retry.
 * Transient: 429, 500, 502, 503, 504, rate limits, capacity, timeout, network failure.
 * Non-transient: 400 (Bad Request), 401/403 (Invalid credentials/auth), validation error, schema error.
 */
export function isTransientError(err: unknown): boolean {
  if (!err) return false;
  const msg = ((err as any).message || String(err)).toLowerCase();
  const status = (err as any).status || (err as any).statusCode;

  if (typeof status === 'number') {
    if ([429, 500, 502, 503, 504].includes(status)) {
      return true;
    }
    if (status >= 400 && status < 500) {
      // 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 NotFound are non-transient
      return false;
    }
  }

  // Check common transient keywords
  const transientKeywords = [
    'rate limit',
    'quota',
    'high demand',
    'unavailable',
    'overloaded',
    'timeout',
    'timed out',
    'fetch failed',
    'network',
    'econnreset',
    'econnrefused',
    'etimedout',
    'socket hang up',
    'service_unavailable',
    '503',
    '429',
    '500',
    '502',
    '504',
  ];

  return transientKeywords.some((kw) => msg.includes(kw));
}

/**
 * Calculates exponential backoff with optional jitter.
 * delay = min(initialDelayMs * 2^retryNumber, maxDelayMs)
 */
export function getExponentialBackoffDelay(
  retryNumber: number,
  initialDelayMs = 1000,
  maxDelayMs = 4000,
  withJitter = true
): number {
  const baseDelay = Math.min(initialDelayMs * Math.pow(2, retryNumber), maxDelayMs);
  if (!withJitter) return baseDelay;
  // Add small random jitter: +/- 15%
  const jitter = (Math.random() * 0.3 - 0.15) * baseDelay;
  return Math.max(0, Math.round(baseDelay + jitter));
}
