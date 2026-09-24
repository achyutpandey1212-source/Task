import mongoose from 'mongoose';
import { EvaluationModel, IEvaluation } from './evaluation.model.js';
import { AttemptModel } from '../attempts/attempt.model.js';
import { SubmissionModel } from '../submissions/submission.model.js';
import { ProblemModel } from '../problems/problem.model.js';
import { Evaluator } from '../../services/evaluator/evaluator.js';
import { aiEvaluator } from '../../services/evaluator/aiEvaluator.js';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../shared/errors/AppError.js';

export class EvaluationService {
  private evaluator: Evaluator;

  constructor(evaluator: Evaluator = aiEvaluator) {
    this.evaluator = evaluator;
  }

  async createEvaluation(submissionId: string, userId: string): Promise<IEvaluation> {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new BadRequestError('Invalid submission ID format');
    }

    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    if (submission.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to evaluate this submission');
    }

    const attempt = await AttemptModel.findById(submission.attemptId);
    if (!attempt) {
      throw new NotFoundError('Associated attempt not found');
    }

    // Duplicate check
    const existingEvaluation = await EvaluationModel.findOne({ submissionId: submission._id });
    if (existingEvaluation) {
      return existingEvaluation;
    }

    // 1. Create evaluation in PENDING status
    const evaluation = await EvaluationModel.create({
      submissionId: submission._id,
      attemptId: attempt._id,
      userId: new mongoose.Types.ObjectId(userId),
      status: 'PENDING',
    });

    // 2. Set attempt status to EVALUATING
    attempt.status = 'EVALUATING';
    await attempt.save();

    // 3. Trigger evaluation asynchronously
    this.processEvaluation(evaluation._id.toString(), submission._id.toString(), attempt._id.toString()).catch(
      (err) => {
        console.error(`[EvaluationService] Unhandled error during async evaluation ${evaluation._id}:`, err);
      }
    );

    return evaluation;
  }

  async processEvaluation(evaluationId: string, submissionId: string, attemptId: string): Promise<void> {
    console.log(`[EvaluationService] Starting evaluation processing: ${evaluationId}`);

    const evaluation = await EvaluationModel.findById(evaluationId);
    const submission = await SubmissionModel.findById(submissionId);
    const attempt = await AttemptModel.findById(attemptId);

    if (!evaluation || !submission || !attempt) {
      console.error('[EvaluationService] Missing entity during processing:', {
        evaluation: !!evaluation,
        submission: !!submission,
        attempt: !!attempt,
      });
      return;
    }

    try {
      const problem = await ProblemModel.findById(attempt.problemId);
      if (!problem) {
        throw new NotFoundError('Problem associated with attempt not found');
      }

      // Execute evaluation (Gemini -> Groq fallback)
      const result = await this.evaluator.evaluate(problem, submission);

      // Persist completed evaluation
      evaluation.status = 'COMPLETED';
      evaluation.summary = result.summary;
      evaluation.overallScore = result.overallScore;
      evaluation.criteria = result.criteria;
      evaluation.completedAt = new Date();
      await evaluation.save();

      // Transition attempt to COMPLETED
      attempt.status = 'COMPLETED';
      attempt.completedAt = new Date();
      await attempt.save();

      console.log(`[EvaluationService] Successfully completed evaluation: ${evaluationId}`);
    } catch (error: unknown) {
      console.error(`[EvaluationService] Evaluation failed for ${evaluationId}:`, error);

      // Record evaluation failure safely without deleting submission
      evaluation.status = 'FAILED';
      evaluation.errorMessage = (error as Error).message || 'Evaluation failed';
      evaluation.completedAt = new Date();
      await evaluation.save();

      // Transition attempt to FAILED
      attempt.status = 'FAILED';
      await attempt.save();
    }
  }

  async getEvaluationById(evaluationId: string, userId: string): Promise<IEvaluation> {
    if (!mongoose.Types.ObjectId.isValid(evaluationId)) {
      throw new BadRequestError('Invalid evaluation ID format');
    }

    const evaluation = await EvaluationModel.findById(evaluationId);
    if (!evaluation) {
      throw new NotFoundError('Evaluation not found');
    }

    if (evaluation.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to view this evaluation');
    }

    return evaluation;
  }
}

export const evaluationService = new EvaluationService();
