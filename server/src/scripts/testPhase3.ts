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
import { GeminiProvider } from '../services/ai/geminiProvider.js';
import { parseAndValidateAIResponse } from '../services/ai/parseAIResponse.js';
import { AIEvaluationOutput } from '../modules/evaluations/evaluation.schema.js';
import { ConflictError, ForbiddenError, ValidationError, ServiceUnavailableError } from '../shared/errors/AppError.js';

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

const mockValidCriteria: AIEvaluationOutput['criteria'] = [
  {
    criterion: 'requirement_understanding',
    score: 8,
    evidence: 'Learner identified multi-floor spot allocation and vehicle sizing.',
    concern: 'Missing dynamic surge pricing requirement handling.',
    suggestion: 'Add strategy for peak occupancy fee adjustment.',
    confidence: 0.9,
  },
  {
    criterion: 'responsibilities',
    score: 7,
    evidence: 'ParkingLot manages floors and Spot handles occupation.',
    concern: 'ParkingLot directly handles cash and card payment.',
    suggestion: 'Extract PaymentProcessor boundary.',
    confidence: 0.85,
  },
  {
    criterion: 'coupling_cohesion',
    score: 7,
    evidence: 'Components interact via explicit references.',
    concern: 'Tight dependency between Spot and Vehicle concrete classes.',
    suggestion: 'Reference vehicle size classification interface.',
    confidence: 0.8,
  },
  {
    criterion: 'abstraction_interfaces',
    score: 8,
    evidence: 'Created IPricingStrategy and IParkingSpot interfaces.',
    concern: 'Ticket issuance could be abstracted behind a factory.',
    suggestion: 'Decouple ticket creation from gate controller.',
    confidence: 0.88,
  },
  {
    criterion: 'extensibility',
    score: 8,
    evidence: 'Adding a new vehicle type only requires a new sizing enum value.',
    concern: 'Modifying floor capacity requires static reconfiguration.',
    suggestion: 'Support dynamic floor addition via configuration object.',
    confidence: 0.82,
  },
  {
    criterion: 'edge_cases_testability',
    score: 6,
    evidence: 'Considered lot full and ticket loss scenarios.',
    concern: 'Concurrent entry race conditions at gate are not synchronized.',
    suggestion: 'Introduce thread-safe spot locking or reservation token.',
    confidence: 0.87,
  },
  {
    criterion: 'reasoning',
    score: 8,
    evidence: 'Explained choice of Strategy pattern over switch cases.',
    concern: 'Trade-off between memory and search speed not analyzed.',
    suggestion: 'Discuss index lookup vs array iteration in floor.',
    confidence: 0.85,
  },
];

const mockValidAIOutput: AIEvaluationOutput = {
  summary: 'Solid initial LLD design with well-separated floor management. Key improvement area is payment separation and concurrency.',
  criteria: mockValidCriteria,
};

class FakeSuccessAIProvider implements AIProvider {
  readonly name = 'fake-gemini';
  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    return {
      raw: JSON.stringify(mockValidAIOutput),
      parsed: mockValidAIOutput,
      provider: 'fake',
    };
  }
}

class FakeFailingAIProvider implements AIProvider {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    throw new Error(`${this.name} API rate limit or outage simulated`);
  }
}

async function runPhase3Tests() {
  console.log('--- Starting Phase 3 Evaluation Engine & AI Test Suite ---');
  await connectDatabase();

  try {
    await seedProblems();
    const problem = await problemService.getProblemById('parking-lot');

    // 1. Test AI output parsing & Zod validation
    const validJsonStr = JSON.stringify(mockValidAIOutput);
    const parsedValid = parseAndValidateAIResponse(validJsonStr);
    assert(parsedValid.criteria.length === 7, 'parseAndValidateAIResponse parses 7 criteria correctly');

    // Test markdown code fence extraction
    const fencedJson = '```json\n' + validJsonStr + '\n```';
    const parsedFenced = parseAndValidateAIResponse(fencedJson);
    assert(parsedFenced.summary === mockValidAIOutput.summary, 'parseAndValidateAIResponse strips markdown fences');

    // Test validation failure on missing criterion
    let schemaErrorCaught = false;
    try {
      const invalidOutput = {
        summary: 'Incomplete',
        criteria: mockValidCriteria.slice(0, 6), // only 6 criteria
      };
      parseAndValidateAIResponse(JSON.stringify(invalidOutput));
    } catch (e) {
      if (e instanceof ValidationError) schemaErrorCaught = true;
    }
    assert(schemaErrorCaught, 'Missing criterion fails Zod validation with ValidationError');

    // Test validation failure on out-of-range score
    let scoreRangeErrorCaught = false;
    try {
      const invalidScore = {
        summary: 'Bad score',
        criteria: mockValidCriteria.map((c, i) => (i === 0 ? { ...c, score: 15 } : c)),
      };
      parseAndValidateAIResponse(JSON.stringify(invalidScore));
    } catch (e) {
      if (e instanceof ValidationError) scoreRangeErrorCaught = true;
    }
    assert(scoreRangeErrorCaught, 'Score > 10 fails Zod validation');

    // 2. Score aggregation formula test
    // Sum of mock scores: 8 + 7 + 7 + 8 + 8 + 6 + 8 = 52. 52 / 7 = 7.4285... -> 7.4
    const fakeEvaluator = new AIEvaluator([new FakeSuccessAIProvider()]);
    const mockSubmission = {
      requirements: { assumptions: 'A', constraints: 'C' },
      design: { classes: 'class ParkingLot', relationships: 'R', interfaces: 'I' },
      reasoning: { decisions: 'D', patterns: 'P', tradeoffs: 'T' },
      edgeCases: 'E',
    } as any;

    const evalResult = await fakeEvaluator.evaluate(problem, mockSubmission);
    assert(evalResult.overallScore === 7.4, `Deterministic overallScore calculation is exact (7.4), got ${evalResult.overallScore}`);

    // 3. GeminiProvider Multi-Model Fallback Test (3.8 -> 3.7 -> 3.6)
    const geminiMultiModel = new GeminiProvider('fake-key', ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash']);
    assert(geminiMultiModel.models[0] === 'gemini-3.8-flash', 'GeminiProvider primary model is gemini-3.8-flash');
    assert(geminiMultiModel.models[1] === 'gemini-3.7-flash', 'GeminiProvider first fallback is gemini-3.7-flash');
    assert(geminiMultiModel.models[2] === 'gemini-3.6-flash', 'GeminiProvider second fallback is gemini-3.6-flash');

    // 4. Provider Fallback Test: Primary Gemini fails -> Fallback Groq succeeds
    const fallbackEvaluator = new AIEvaluator([
      new FakeFailingAIProvider('gemini (gemini-3.8-flash -> gemini-3.7-flash -> gemini-3.6-flash)'),
      new FakeSuccessAIProvider(),
    ]);
    const fallbackResult = await fallbackEvaluator.evaluate(problem, mockSubmission);
    assert(fallbackResult.overallScore === 7.4, 'Provider fallback succeeds when all Gemini models fail and cascades to Groq');

    // 5. Provider Total Failure Test: All Gemini models and Groq fail -> throws ServiceUnavailableError
    const allFailingEvaluator = new AIEvaluator([
      new FakeFailingAIProvider('gemini (gemini-3.8-flash -> gemini-3.7-flash -> gemini-3.6-flash)'),
      new FakeFailingAIProvider('groq (llama-3.3-70b-versatile)'),
    ]);
    let allFailedCaught = false;
    try {
      await allFailingEvaluator.evaluate(problem, mockSubmission);
    } catch (e) {
      if (e instanceof ServiceUnavailableError) allFailedCaught = true;
    }
    assert(allFailedCaught, 'When both Gemini models and Groq fail, ServiceUnavailableError is thrown');

    // 6. End-to-End Evaluation Lifecycle & Async Processing
    const userA = await authService.register({
      email: `eval-user-a-${Date.now()}@test-suite.com`,
      password: 'password123',
      name: 'Eval User A',
    });
    const userB = await authService.register({
      email: `eval-user-b-${Date.now()}@test-suite.com`,
      password: 'password123',
      name: 'Eval User B',
    });

    const attempt = await attemptService.createAttempt(userA.user.id, problem.id);
    assert(attempt.status === 'DRAFT', 'New attempt starts in DRAFT');

    // Use custom test EvaluationService wired with FakeSuccessAIProvider
    const testEvaluationService = new EvaluationService(fakeEvaluator);

    // Persist submission
    const submission = await SubmissionModel.create({
      attemptId: attempt._id,
      userId: new mongoose.Types.ObjectId(userA.user.id),
      format: 'structured-text',
      requirements: { assumptions: '100 spots', constraints: 'Max height 3m' },
      design: { classes: 'class ParkingLot, class Floor', relationships: '1--*', interfaces: 'IPricing' },
      reasoning: { decisions: 'Decoupled pricing', patterns: 'Strategy', tradeoffs: 'Speed vs memory' },
      edgeCases: 'Lot full, power outage',
      version: 1,
    });

    attempt.status = 'SUBMITTED';
    attempt.submissionId = submission._id as mongoose.Types.ObjectId;
    attempt.submittedAt = new Date();
    await attempt.save();

    // Start evaluation
    const createdEvaluation = await testEvaluationService.createEvaluation(
      submission._id.toString(),
      userA.user.id
    );
    assert(createdEvaluation.status === 'PENDING', 'Created evaluation starts in PENDING status');

    const evaluatingAttempt = await AttemptModel.findById(attempt.id);
    assert(evaluatingAttempt?.status === 'EVALUATING', 'Attempt moves to EVALUATING state');

    // Wait for the async processEvaluation triggered by createEvaluation to finish
    let completedEvaluation: any = await EvaluationModel.findById(createdEvaluation._id);
    for (let i = 0; i < 20 && completedEvaluation?.status === 'PENDING'; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      completedEvaluation = await EvaluationModel.findById(createdEvaluation._id);
    }

    assert(completedEvaluation?.status === 'COMPLETED', 'Evaluation state transitions to COMPLETED');
    assert(completedEvaluation?.overallScore === 7.4, 'Evaluation has calculated overallScore (7.4)');
    assert(completedEvaluation?.criteria.length === 7, 'Evaluation holds all 7 rubric criteria');

    const completedAttempt = await AttemptModel.findById(attempt.id);
    assert(completedAttempt?.status === 'COMPLETED', 'Attempt state transitions to COMPLETED');
    assert(completedAttempt?.completedAt !== null, 'completedAt timestamp is recorded');

    // 6. Ownership enforcement for evaluation
    const fetchedByA = await testEvaluationService.getEvaluationById(
      createdEvaluation._id.toString(),
      userA.user.id
    );
    assert(fetchedByA._id.toString() === createdEvaluation._id.toString(), 'User A can view their own evaluation');

    let userBForbidden = false;
    try {
      await testEvaluationService.getEvaluationById(
        createdEvaluation._id.toString(),
        userB.user.id
      );
    } catch (e) {
      if (e instanceof ForbiddenError) userBForbidden = true;
    }
    assert(userBForbidden, 'User B is forbidden from accessing User A evaluation');

    // 7. Duplicate evaluation protection
    const duplicateEvaluation = await testEvaluationService.createEvaluation(
      submission._id.toString(),
      userA.user.id
    );
    assert(duplicateEvaluation._id.toString() === createdEvaluation._id.toString(), 'Calling createEvaluation again returns existing evaluation without duplicating');

    // 8. Failure handling test: Simulation of AI failure leaves submission intact
    const attemptFail = await attemptService.createAttempt(userA.user.id, problem.id);
    const subFail = await SubmissionModel.create({
      attemptId: attemptFail._id,
      userId: new mongoose.Types.ObjectId(userA.user.id),
      format: 'structured-text',
      requirements: { assumptions: 'A', constraints: 'C' },
      design: { classes: 'class F', relationships: 'R', interfaces: 'I' },
      reasoning: { decisions: 'D', patterns: 'P', tradeoffs: 'T' },
      edgeCases: 'E',
      version: 1,
    });

    attemptFail.status = 'SUBMITTED';
    attemptFail.submissionId = subFail._id as mongoose.Types.ObjectId;
    await attemptFail.save();

    const failingEvalService = new EvaluationService(allFailingEvaluator);
    const failEvaluation = await failingEvalService.createEvaluation(
      subFail._id.toString(),
      userA.user.id
    );

    let evaluatedFailDoc: any = await EvaluationModel.findById(failEvaluation._id);
    for (let i = 0; i < 20 && evaluatedFailDoc?.status === 'PENDING'; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      evaluatedFailDoc = await EvaluationModel.findById(failEvaluation._id);
    }
    assert(evaluatedFailDoc?.status === 'FAILED', 'Evaluation status transitions to FAILED on total AI error');

    const failedAttemptDoc = await AttemptModel.findById(attemptFail._id);
    assert(failedAttemptDoc?.status === 'FAILED', 'Attempt status transitions to FAILED on total AI error');

    const preservedSubmission = await SubmissionModel.findById(subFail._id);
    assert(preservedSubmission !== null, 'Learner submission remains preserved in MongoDB despite AI failure');

    console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Phase 3 test suite failed with error:', err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

runPhase3Tests();
