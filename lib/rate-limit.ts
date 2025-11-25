import { redis } from './redis';

interface RateLimitConfig {
  interval: number; // Time window in seconds
  maxRequests: number; // Maximum requests allowed in the interval
}

/**
 * Rate limiter using Redis with sliding window algorithm
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., user ID, IP address)
   * @returns Object with allowed status and remaining requests
   */
  async check(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.config.interval * 1000;

    try {
      // Remove old entries outside the current window
      await redis.zremrangebyscore(key, 0, windowStart);

      // Count requests in the current window
      const requestCount = await redis.zcard(key);

      if (requestCount >= this.config.maxRequests) {
        const resetAt = new Date(now + this.config.interval * 1000);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
        };
      }

      // Add current request
      await redis.zadd(key, now, `${now}`);
      
      // Set expiration on the key
      await redis.expire(key, this.config.interval);

      const resetAt = new Date(now + this.config.interval * 1000);
      return {
        allowed: true,
        remaining: this.config.maxRequests - requestCount - 1,
        resetAt,
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // On error, allow the request (fail open)
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt: new Date(now + this.config.interval * 1000),
      };
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`;
    await redis.del(key);
  }
}

// Predefined rate limiters
export const rateLimiters = {
  // API rate limit: 100 requests per minute
  api: new RateLimiter({ interval: 60, maxRequests: 100 }),
  
  // Auth rate limit: 5 requests per minute (stricter for login/signup)
  auth: new RateLimiter({ interval: 60, maxRequests: 5 }),
  
  // Message rate limit: 20 messages per minute
  message: new RateLimiter({ interval: 60, maxRequests: 20 }),
};
