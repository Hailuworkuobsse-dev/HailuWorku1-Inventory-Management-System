import { Request, Response, NextFunction } from 'express';

// Wrapper to eliminate try-catch blocks in controllers
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
