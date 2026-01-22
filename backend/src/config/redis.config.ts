import { createClient } from 'redis';
import Redlock from 'redlock';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 500)
  }
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  await redisClient.connect();
};

export const disconnectRedis = async () => {
  await redisClient.disconnect();
};

export const redlock = new Redlock([redisClient as any], {
  driftFactor: 0.01,
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 200
});

export default redisClient;
