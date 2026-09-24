import { Request, Response, NextFunction } from 'express';
import { attemptService } from './attempt.service.js';
import { UnauthorizedError } from '../../shared/errors/AppError.js';

export class AttemptController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const attempt = await attemptService.createAttempt(req.user.id, req.body.problemId);
      res.status(201).json({ attempt });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const attempts = await attemptService.getUserAttempts(req.user.id);
      res.status(200).json({ attempts });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const result = await attemptService.getAttemptById(req.params.id as string, req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const result = await attemptService.submitAttempt(
        req.params.id as string,
        req.user.id,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const attemptController = new AttemptController();
