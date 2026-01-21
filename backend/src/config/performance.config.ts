import logger from './logger.config';

export const PERFORMANCE_BUDGETS = {
  // Max response times (ms)
  API_ENDPOINTS: {
    GET: 200,
    POST: 500,
    PATCH: 400,
    DELETE: 300
  },
  
  // DB query times (ms)
  DB_QUERIES: {
    SELECT: 50,
    INSERT: 100,
    UPDATE: 100,
    DELETE: 100
  },
  
  // Socket latency (ms)
  SOCKET_EVENTS: 50
};

export const checkBudget = (operation: string, duration: number, budget: number) => {
  if (duration > budget) {
    logger.warn({ operation, duration, budget }, 'Performance budget exceeded');
  }
};
