import { Router } from 'express';
import { API_VERSIONS } from '../config/versioning.config';

export const createVersionedRouter = (version: string = 'v1') => {
  if (!API_VERSIONS.isSupported(version)) {
    throw new Error(`API version ${version} is not supported`);
  }
  
  const router = Router();
  
  // Add version header to all responses
  router.use((req, res, next) => {
    res.setHeader('X-API-Version', version);
    res.setHeader('X-API-Deprecated', API_VERSIONS.DEPRECATED.includes(version) ? 'true' : 'false');
    next();
  });
  
  return router;
};
