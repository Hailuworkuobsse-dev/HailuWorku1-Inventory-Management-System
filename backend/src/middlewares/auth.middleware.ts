import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AppError } from '../utils/AppError';
import { AUTH_CONFIG } from '../config/auth.config';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    // 2. Verify token
    const decoded: any = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Check if user is active (Req 6.1 - User deactivation)
    if (!currentUser.isActive) {
      return next(new AppError('Your account has been deactivated. Contact Admin.', 403));
    }

    // Grant Access
    req.user = currentUser as any;

    // Log user activity
    await prisma.userLog.create({
      data: { userId: req.user.id, action: req.method + ' ' + req.path }
    });
    
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};
