import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/auth.service.js';
import { UnauthorizedError } from '../shared/errors/AppError.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token is missing or malformed');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Authentication token is missing');
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
