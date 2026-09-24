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
  private activeProcessingJobs = new Set<string>();

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

  async retryEvaluation(evaluationId: string, userId: string): Promise<IEvaluation> {
    if (!mongoose.Types.ObjectId.isValid(evaluationId)) {
      throw new BadRequestError('Invalid evaluation ID format');
    }

    const evaluation = await EvaluationModel.findById(evaluationId);
    if (!evaluation) {
      throw new NotFoundError('Evaluation not found');
    }

    if (evaluation.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to retry this evaluation');
    }

    // Idempotency: If already evaluating or pending, return current state without creating parallel jobs
    if (evaluation.status === 'PENDING' || this.activeProcessingJobs.has(evaluationId)) {
      console.log(`[EvaluationService] Evaluation ${evaluationId} is already in progress. Returning current state.`);
      return evaluation;
    }

    if (evaluation.status === 'COMPLETED') {
      throw new ConflictError('Cannot retry an already completed evaluation');
    }

    // Load associated submission and attempt
    const submission = await SubmissionModel.findById(evaluation.submissionId);
    if (!submission) {
      throw new NotFoundError('Submission associated with evaluation not found');
    }

    const attempt = await AttemptModel.findById(evaluation.attemptId);
    if (!attempt) {
      throw new NotFoundError('Attempt associated with evaluation not found');
    }

    // Transition evaluation and attempt back to evaluating state (PENDING / EVALUATING)
    evaluation.status = 'PENDING';
    evaluation.errorMessage = undefined;
    evaluation.publicError = undefined;
    evaluation.completedAt = undefined;
    await evaluation.save();

    attempt.status = 'EVALUATING';
    await attempt.save();

    console.log(`[EvaluationService] Restarting evaluation processing for ${evaluationId}`);

    // Trigger evaluation asynchronously
    this.processEvaluation(
      evaluation._id.toString(),
      submission._id.toString(),
      attempt._id.toString()
    ).catch((err) => {
      console.error(`[EvaluationService] Unhandled error during async retry evaluation ${evaluation._id}:`, err);
    });

    return evaluation;
  }

  async processEvaluation(evaluationId: string, submissionId: string, attemptId: string): Promise<void> {
    // Concurrency protection: prevent parallel runs for the same evaluation
    if (this.activeProcessingJobs.has(evaluationId)) {
      console.warn(`[EvaluationService] Job already active for evaluationId: ${evaluationId}`);
      return;
    }

    this.activeProcessingJobs.add(evaluationId);
    console.log(`[EvaluationService] Starting evaluation processing: ${evaluationId}`);

    try {
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

      const problem = await ProblemModel.findById(attempt.problemId);
      if (!problem) {
        throw new NotFoundError('Problem associated with attempt not found');
      }

      // Execute evaluation (Gemini models -> Groq fallback, with automatic retries & backoff)
      const result = await this.evaluator.evaluate(problem, submission);

      // Persist completed evaluation
      evaluation.status = 'COMPLETED';
      evaluation.summary = result.summary;
      evaluation.overallScore = result.overallScore;
      evaluation.criteria = result.criteria;
      evaluation.errorMessage = undefined;
      evaluation.publicError = undefined;
      evaluation.completedAt = new Date();
      await evaluation.save();

      // Transition attempt to COMPLETED
      attempt.status = 'COMPLETED';
      attempt.completedAt = new Date();
      await attempt.save();

      console.log(`[EvaluationService] Successfully completed evaluation: ${evaluationId}`);
    } catch (error: unknown) {
      console.error(
        `[EvaluationService] evaluationId=${evaluationId} attemptId=${attemptId} submissionId=${submissionId} permanently failed:`,
        error
      );

      try {
        const evaluation = await EvaluationModel.findById(evaluationId);
        const attempt = await AttemptModel.findById(attemptId);

        if (evaluation) {
          evaluation.status = 'FAILED';
          evaluation.errorMessage = (error as Error).message || 'Evaluation failed';
          evaluation.publicError = {
            code: 'EVALUATION_TEMPORARILY_UNAVAILABLE',
            message:
              'The evaluation service could not complete the review. Your submission is safe. Please try again.',
          };
          evaluation.completedAt = new Date();
          await evaluation.save();
        }

        if (attempt) {
          attempt.status = 'FAILED';
          await attempt.save();
        }
      } catch (saveErr) {
        console.error('[EvaluationService] Failed to record failure state:', saveErr);
      }
    } finally {
      this.activeProcessingJobs.delete(evaluationId);
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
