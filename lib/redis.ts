import Redis from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  
  // Default to local Redis
  return 'redis://localhost:6379';
};

class RedisClient {
  private static instance: Redis | null = null;
  private static isConnecting = false;

  static getInstance(): Redis {
    if (!RedisClient.instance && !RedisClient.isConnecting) {
      RedisClient.isConnecting = true;
      
      const redisUrl = getRedisUrl();
      
      RedisClient.instance = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError(err) {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      RedisClient.instance.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      RedisClient.instance.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
      });

      RedisClient.instance.on('close', () => {
        console.log('⚠️  Redis connection closed');
      });

      RedisClient.isConnecting = false;
    }

    return RedisClient.instance!;
  }

  static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      RedisClient.instance = null;
    }
  }
}

export const redis = RedisClient.getInstance();
