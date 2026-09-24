import mongoose from 'mongoose';
import { AttemptModel, IAttempt } from './attempt.model.js';
import { SubmissionModel, ISubmission } from '../submissions/submission.model.js';
import { EvaluationModel, IEvaluation } from '../evaluations/evaluation.model.js';
import { evaluationService } from '../evaluations/evaluation.service.js';
import { problemService } from '../problems/problem.service.js';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../shared/errors/AppError.js';
import { SubmitSolutionInput } from './attempt.schema.js';

export class AttemptService {
  async createAttempt(userId: string, problemIdOrSlug: string): Promise<IAttempt> {
    const problem = await problemService.getProblemById(problemIdOrSlug);

    const attempt = await AttemptModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      problemId: problem._id,
      status: 'DRAFT',
      startedAt: new Date(),
    });

    return attempt;
  }

  async getUserAttempts(userId: string): Promise<IAttempt[]> {
    return AttemptModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 });
  }

  async getAttemptById(
    attemptId: string,
    userId: string
  ): Promise<{ attempt: IAttempt; submission: ISubmission | null; evaluation: IEvaluation | null }> {
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new BadRequestError('Invalid attempt ID format');
    }

    const attempt = await AttemptModel.findById(attemptId).populate(
      'problemId',
      'title slug description requirements constraints difficulty'
    );

    if (!attempt) {
      throw new NotFoundError('Attempt not found');
    }

    if (attempt.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to access this attempt');
    }

    let submission: ISubmission | null = null;
    let evaluation: IEvaluation | null = null;

    if (attempt.submissionId) {
      submission = await SubmissionModel.findById(attempt.submissionId);
      evaluation = await EvaluationModel.findOne({ submissionId: attempt.submissionId });
    }

    return { attempt, submission, evaluation };
  }

  async submitAttempt(
    attemptId: string,
    userId: string,
    input: SubmitSolutionInput
  ): Promise<{ attemptId: string; submissionId: string; evaluationId: string; status: string }> {
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      throw new BadRequestError('Invalid attempt ID format');
    }

    const attempt = await AttemptModel.findById(attemptId);
    if (!attempt) {
      throw new NotFoundError('Attempt not found');
    }

    // Verify ownership
    if (attempt.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to submit to this attempt');
    }

    // State rule: Only DRAFT attempts can be submitted
    if (attempt.status !== 'DRAFT') {
      throw new ConflictError(
        `Cannot submit attempt with status '${attempt.status}'. Only DRAFT attempts can be submitted.`
      );
    }

    // Check if duplicate submission already exists
    const existingSubmission = await SubmissionModel.findOne({
      attemptId: new mongoose.Types.ObjectId(attemptId),
    });
    if (existingSubmission) {
      throw new ConflictError('A submission already exists for this attempt.');
    }

    // 1. Create and persist submission (GUARANTEED PERSISTENCE BEFORE AI)
    const submission = await SubmissionModel.create({
      attemptId: attempt._id,
      userId: new mongoose.Types.ObjectId(userId),
      format: 'structured-text',
      requirements: input.requirements,
      design: input.design,
      reasoning: input.reasoning,
      edgeCases: input.edgeCases,
      version: 1,
    });

    // 2. Transition attempt state: DRAFT -> SUBMITTED
    attempt.status = 'SUBMITTED';
    attempt.submissionId = submission._id as mongoose.Types.ObjectId;
    attempt.submittedAt = new Date();
    await attempt.save();

    // 3. Initiate Evaluation lifecycle (transitions attempt to EVALUATING)
    const evaluation = await evaluationService.createEvaluation(
      submission._id.toString(),
      userId
    );

    return {
      attemptId: attempt._id.toString(),
      submissionId: submission._id.toString(),
      evaluationId: evaluation._id.toString(),
      status: 'EVALUATING',
    };
  }
}

export const attemptService = new AttemptService();
