import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { UnauthorizedError } from '../../shared/errors/AppError.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }
      const user = await authService.getUserById(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
