import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedProblems } from '../modules/problems/problem.seed.js';
import { problemService } from '../modules/problems/problem.service.js';
import { authService } from '../modules/auth/auth.service.js';
import { attemptService } from '../modules/attempts/attempt.service.js';
import { AttemptModel } from '../modules/attempts/attempt.model.js';
import { SubmissionModel } from '../modules/submissions/submission.model.js';
import { EvaluationModel } from '../modules/evaluations/evaluation.model.js';
import { EvaluationService } from '../modules/evaluations/evaluation.service.js';
import { AIEvaluator } from '../services/evaluator/aiEvaluator.js';
import { AIProvider, EvaluationContext, AIResponse } from '../services/ai/aiProvider.js';
import { isTransientError, getExponentialBackoffDelay } from '../services/evaluator/retryHelper.js';
import { ConflictError, ServiceUnavailableError } from '../shared/errors/AppError.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`[PASS] ${msg}`);
    passed++;
  } else {
    console.error(`[FAIL] ${msg}`);
    failed++;
  }
}

const mockSuccessOutput = {
  summary: 'Architectural evaluation test summary',
  criteria: [
    { criterion: 'requirement_understanding', score: 8, evidence: 'E1', concern: 'C1', suggestion: 'S1', confidence: 0.9 },
    { criterion: 'responsibilities', score: 8, evidence: 'E2', concern: 'C2', suggestion: 'S2', confidence: 0.9 },
    { criterion: 'coupling_cohesion', score: 8, evidence: 'E3', concern: 'C3', suggestion: 'S3', confidence: 0.9 },
    { criterion: 'abstraction_interfaces', score: 8, evidence: 'E4', concern: 'C4', suggestion: 'S4', confidence: 0.9 },
    { criterion: 'extensibility', score: 8, evidence: 'E5', concern: 'C5', suggestion: 'S5', confidence: 0.9 },
    { criterion: 'edge_cases_testability', score: 8, evidence: 'E6', concern: 'C6', suggestion: 'S6', confidence: 0.9 },
    { criterion: 'reasoning', score: 8, evidence: 'E7', concern: 'C7', suggestion: 'S7', confidence: 0.9 },
  ] as any,
};

class SimulatedFailingProvider implements AIProvider {
  readonly name: string;
  public attemptCount = 0;
  private failCount: number;

  constructor(name: string, failCount = Infinity) {
    this.name = name;
    this.failCount = failCount;
  }

  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    this.attemptCount++;
    if (this.attemptCount <= this.failCount) {
      const err: any = new Error(`${this.name} simulated 503 capacity outage`);
      err.status = 503;
      throw err;
    }
    return {
      raw: JSON.stringify(mockSuccessOutput),
      parsed: mockSuccessOutput as any,
      provider: 'fake',
    };
  }
}

class SimulatedNonTransientProvider implements AIProvider {
  readonly name = 'non-transient-provider';
  public attemptCount = 0;

  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    this.attemptCount++;
    const err: any = new Error('HTTP 400 Bad Request');
    err.status = 400;
    throw err;
  }
}

async function runRetryRecoveryTests() {
  console.log('--- Starting Evaluation Reliability & Recovery Test Suite ---');
  await connectDatabase();

  try {
    await seedProblems();
    const problem = await problemService.getProblemById('parking-lot');

    const testUser = await authService.register({
      email: `reliability-${Date.now()}@test.com`,
      password: 'password123',
      name: 'Reliability Engineer',
    });

    // 1. Unit: transient error classification
    assert(isTransientError(new Error('503 Service Unavailable')), '503 error is recognized as transient');
    assert(isTransientError(new Error('rate limit reached')), 'Rate limit is recognized as transient');
    assert(isTransientError({ status: 429, message: 'Too Many Requests' }), 'HTTP 429 is recognized as transient');
    assert(!isTransientError({ status: 400, message: 'Invalid payload' }), 'HTTP 400 is recognized as non-transient');
    assert(!isTransientError({ status: 401, message: 'Unauthorized key' }), 'HTTP 401 is recognized as non-transient');

    // 2. Unit: Exponential backoff delay bounds
    const delay0 = getExponentialBackoffDelay(0, 50, 200, false);
    const delay1 = getExponentialBackoffDelay(1, 50, 200, false);
    const delay2 = getExponentialBackoffDelay(2, 50, 200, false);
    assert(delay0 === 50, `Delay 0 is 50ms, got ${delay0}`);
    assert(delay1 === 100, `Delay 1 is 100ms, got ${delay1}`);
    assert(delay2 === 200, `Delay 2 is bounded at max 200ms, got ${delay2}`);

    // 3. Fast evaluator test: Non-transient errors do not endlessly retry
    const nonTransientProvider = new SimulatedNonTransientProvider();
    const fastNonTransientEvaluator = new AIEvaluator([nonTransientProvider], {
      maxRetries: 3,
      initialRetryDelayMs: 20,
      maxRetryDelayMs: 50,
    });
    try {
      await fastNonTransientEvaluator.evaluate(problem, {
        requirements: { assumptions: 'A', constraints: 'C' },
        design: { classes: 'C', relationships: 'R', interfaces: 'I' },
        reasoning: { decisions: 'D', patterns: 'P', tradeoffs: 'T' },
        edgeCases: 'E',
      } as any);
      assert(false, 'Expected non-transient error to throw');
    } catch {
      assert(
        nonTransientProvider.attemptCount === 1,
        `Non-transient error failed immediately without pointless retry (attempts: ${nonTransientProvider.attemptCount})`
      );
    }

    // 4. Persistence & Submission Immutability Under Total Failure
    const attempt = await attemptService.createAttempt(testUser.user.id, problem.id);
    const submission = await SubmissionModel.create({
      attemptId: attempt._id,
      userId: new mongoose.Types.ObjectId(testUser.user.id),
      format: 'structured-text',
      requirements: { assumptions: 'Initial Assumptions', constraints: 'Initial Constraints' },
      design: { classes: 'ParkingLot, Slot', relationships: '1--*', interfaces: 'IParking' },
      reasoning: { decisions: 'Strategy pattern', patterns: 'Strategy', tradeoffs: 'Extensibility' },
      edgeCases: 'Full capacity',
      version: 1,
    });

    attempt.status = 'SUBMITTED';
    attempt.submissionId = submission._id as mongoose.Types.ObjectId;
    attempt.submittedAt = new Date();
    await attempt.save();

    // Wire evaluator that fails all 3 retries (total 4 attempts)
    const alwaysFailProvider = new SimulatedFailingProvider('simulated-gemini-fail', Infinity);
    const failingEvaluator = new AIEvaluator([alwaysFailProvider], {
      maxRetries: 3,
      initialRetryDelayMs: 20,
      maxRetryDelayMs: 50,
    });
    const evalService = new EvaluationService(failingEvaluator);

    const initialEval = await evalService.createEvaluation(submission._id.toString(), testUser.user.id);
    assert(initialEval.status === 'PENDING', 'Initial evaluation created in PENDING status');

    // Wait for failure
    let evalDoc: any = await EvaluationModel.findById(initialEval._id);
    for (let i = 0; i < 50 && evalDoc?.status === 'PENDING'; i++) {
      await new Promise((r) => setTimeout(r, 50));
      evalDoc = await EvaluationModel.findById(initialEval._id);
    }

    assert(evalDoc?.status === 'FAILED', 'Evaluation transitioned to FAILED status');
    assert(
      evalDoc?.publicError?.code === 'EVALUATION_TEMPORARILY_UNAVAILABLE',
      'Evaluation holds safe public error code'
    );
    assert(
      evalDoc?.publicError?.message.includes('submission is safe'),
      'Public error reassures learner that submission is safe'
    );

    const attemptAfterFail = await AttemptModel.findById(attempt._id);
    assert(attemptAfterFail?.status === 'FAILED', 'Attempt transitioned to FAILED status');

    // Verify submission immutability
    const subAfterFail = await SubmissionModel.findById(submission._id);
    assert(subAfterFail !== null, 'Submission document is preserved');
    assert(subAfterFail?.version === 1, 'Submission version was not bumped or modified');
    assert(subAfterFail?.requirements.assumptions === 'Initial Assumptions', 'Submission content remains identical');

    // 5. Concurrency protection & Idempotency during retry
    // Wire a recovering evaluator for the retry that succeeds
    const recoveringProvider = new SimulatedFailingProvider('simulated-gemini-recovery', 0);
    const recoveringEvaluator = new AIEvaluator([recoveringProvider], {
      maxRetries: 3,
      initialRetryDelayMs: 20,
      maxRetryDelayMs: 50,
    });
    const recoveryEvalService = new EvaluationService(recoveringEvaluator);

    // Call retryEvaluation
    const retriedEval = await recoveryEvalService.retryEvaluation(initialEval._id.toString(), testUser.user.id);
    assert(retriedEval.status === 'PENDING', 'retryEvaluation transitions evaluation back to PENDING');

    const attemptDuringRetry = await AttemptModel.findById(attempt._id);
    assert(attemptDuringRetry?.status === 'EVALUATING', 'Attempt transitioned back to EVALUATING on retry');

    // Test duplicate parallel retry call while in progress (Idempotency)
    const parallelRetry = await recoveryEvalService.retryEvaluation(initialEval._id.toString(), testUser.user.id);
    assert(
      parallelRetry._id.toString() === initialEval._id.toString(),
      'Duplicate retry returns existing evaluation in-progress without spawning new evaluation'
    );

    // Wait for recovery to complete
    for (let i = 0; i < 50 && evalDoc?.status !== 'COMPLETED'; i++) {
      await new Promise((r) => setTimeout(r, 50));
      evalDoc = await EvaluationModel.findById(initialEval._id);
    }

    assert(evalDoc?.status === 'COMPLETED', 'Retried evaluation successfully transitioned to COMPLETED');
    assert(evalDoc?.overallScore === 8, 'Calculated overallScore is persisted after retry');

    const completedAttempt = await AttemptModel.findById(attempt._id);
    assert(completedAttempt?.status === 'COMPLETED', 'Attempt transitioned from FAILED -> COMPLETED on retry');
    assert(
      completedAttempt?.submissionId?.toString() === submission._id.toString(),
      'Attempt remains linked to the exact same immutable submission'
    );

    // 6. Cannot retry an already COMPLETED evaluation
    let conflictCaught = false;
    try {
      await recoveryEvalService.retryEvaluation(initialEval._id.toString(), testUser.user.id);
    } catch (e) {
      if (e instanceof ConflictError) conflictCaught = true;
    }
    assert(conflictCaught, 'Attempting to retry an already COMPLETED evaluation throws ConflictError');

    // 7. Start New Attempt Flow (leaves old attempt preserved in history)
    const newAttempt = await attemptService.createAttempt(testUser.user.id, problem.id);
    assert(newAttempt.id !== attempt.id, 'Start new attempt creates distinct new attempt ID');
    assert(newAttempt.status === 'DRAFT', 'New attempt starts in DRAFT');
    assert(newAttempt.submissionId === null, 'New attempt has empty submission record');

    const userAttempts = await attemptService.getUserAttempts(testUser.user.id);
    assert(userAttempts.length === 2, 'User history retains both past completed attempt and new draft attempt');

    console.log(`\nReliability Test Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test suite encountered unexpected error:', err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

runRetryRecoveryTests();
