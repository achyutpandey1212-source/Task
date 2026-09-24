import { Request, Response, NextFunction } from 'express';
import { evaluationService } from './evaluation.service.js';
import { UnauthorizedError } from '../../shared/errors/AppError.js';

export class EvaluationController {
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const evaluation = await evaluationService.getEvaluationById(
        req.params.id as string,
        req.user.id
      );

      res.status(200).json({
        status: evaluation.status,
        evaluation: {
          id: evaluation._id.toString(),
          submissionId: evaluation.submissionId.toString(),
          attemptId: evaluation.attemptId.toString(),
          status: evaluation.status,
          overallScore: evaluation.overallScore,
          summary: evaluation.summary,
          criteria: evaluation.criteria,
          errorMessage: evaluation.errorMessage,
          createdAt: evaluation.createdAt,
          completedAt: evaluation.completedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const evaluationController = new EvaluationController();
