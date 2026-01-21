import { Request, Response, NextFunction } from 'express';
import { metrics } from '../config/metrics.config';

export const instrumentRequests = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode.toString()
      },
      duration
    );
  });

  next();
};
