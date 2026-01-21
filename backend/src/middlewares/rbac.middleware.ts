import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is set by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
