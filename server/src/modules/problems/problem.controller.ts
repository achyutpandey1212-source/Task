import { Request, Response, NextFunction } from 'express';
import { problemService } from './problem.service.js';

export class ProblemController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problems = await problemService.getAllProblems();
      res.status(200).json({ problems });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const problem = await problemService.getProblemById(req.params.id as string);
      res.status(200).json({ problem });
    } catch (error) {
      next(error);
    }
  }
}

export const problemController = new ProblemController();
