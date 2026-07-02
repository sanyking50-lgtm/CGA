import { Redis } from '@upstash/redis';

const hasRedisConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null as unknown as Redis;

// Rate limiting helper — skips if Redis not configured
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  if (!hasRedisConfig) return { success: true, remaining: limit };
  const result = await redis.incr(key);
  if (result === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    success: result <= limit,
    remaining: Math.max(0, limit - result),
  };
}

// Session store helper
export async function setSession(token: string, data: unknown, ttlSeconds = 604800) {
  if (!hasRedisConfig) return;
  await redis.set(`session:${token}`, JSON.stringify(data), { ex: ttlSeconds });
}

export async function getSession(token: string): Promise<unknown | null> {
  if (!hasRedisConfig) return null;
  const data = await redis.get<string>(`session:${token}`);
  return data ? JSON.parse(data) : null;
}

export async function deleteSession(token: string) {
  if (!hasRedisConfig) return;
  await redis.del(`session:${token}`);
}