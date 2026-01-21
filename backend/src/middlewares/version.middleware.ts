import { Request, Response, NextFunction } from 'express';
import { API_VERSIONS } from '../config/versioning.config';
import logger from '../config/logger.config';

export const versionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestedVersion = req.url.split('/')[2]; // /api/v1/...
  
  if (API_VERSIONS.DEPRECATED.includes(requestedVersion)) {
    logger.warn({ version: requestedVersion, ip: req.ip }, 'Deprecated API version used');
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', 'Sat, 1 Jan 2025 00:00:00 GMT'); // Example sunset date
  }
  
  next();
};
