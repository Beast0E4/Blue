import { Redis } from 'ioredis';
import type { Redis as RedisType } from 'ioredis';

class RedisClient {
  private static instance: RedisClient;

  public client: RedisType;
  public subscriber: RedisType;
  public publisher: RedisType;

  private constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3
    };

    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('✅ Redis Client connected');
    });

    this.client.on('error', err => {
      console.error('❌ Redis Client error:', err);
    });

    this.subscriber.on('connect', () => {
      console.log('✅ Redis Subscriber connected');
    });

    this.publisher.on('connect', () => {
      console.log('✅ Redis Publisher connected');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async disconnect(): Promise<void> {
    await Promise.all([
      this.client.quit(),
      this.subscriber.quit(),
      this.publisher.quit()
    ]);
    console.log('Redis connections closed');
  }
}

export const redisClient = RedisClient.getInstance();
