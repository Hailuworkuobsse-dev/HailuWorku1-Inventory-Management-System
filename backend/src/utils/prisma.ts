import { PrismaClient } from '@prisma/client';
import { metrics } from '../config/metrics.config';

// Singleton Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Instrument queries
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  metrics.dbQueryDuration.observe(
    { operation: params.action, model: params.model || 'Unknown' },
    duration
  );

  return result;
});

export default prisma;
