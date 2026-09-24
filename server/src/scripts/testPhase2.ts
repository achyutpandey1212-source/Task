import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedProblems } from '../modules/problems/problem.seed.js';
import { problemService } from '../modules/problems/problem.service.js';
import { authService } from '../modules/auth/auth.service.js';
import { attemptService } from '../modules/attempts/attempt.service.js';
import { AttemptModel } from '../modules/attempts/attempt.model.js';
import { SubmissionModel } from '../modules/submissions/submission.model.js';
import { UserModel } from '../modules/auth/user.model.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../shared/errors/AppError.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('--- Starting Phase 2 Backend Domain & Flow Tests ---');
  await connectDatabase();

  try {
    // 0. Clean test state
    await UserModel.deleteMany({ email: /@test-suite\.com$/ });
    await seedProblems();

    // 1. Problem verification
    const problems = await problemService.getAllProblems();
    assert(problems.length >= 4, 'Problem list returns seeded problems (>= 4)');

    const parkingLot = await problemService.getProblemById('parking-lot');
    assert(parkingLot.title === 'Parking Lot System', 'Can retrieve problem by slug');
    assert(Array.isArray(parkingLot.requirements) && parkingLot.requirements.length > 0, 'Problem contains requirements');

    let notFoundError = false;
    try {
      await problemService.getProblemById('non-existent-slug-xyz');
    } catch (e) {
      if (e instanceof NotFoundError) notFoundError = true;
    }
    assert(notFoundError, 'Non-existent problem throws NotFoundError');

    // 2. User & Attempt isolation
    const userA = await authService.register({
      email: `user-a-${Date.now()}@test-suite.com`,
      password: 'password123',
      name: 'User A',
    });
    const userB = await authService.register({
      email: `user-b-${Date.now()}@test-suite.com`,
      password: 'password123',
      name: 'User B',
    });

    const attemptA = await attemptService.createAttempt(userA.user.id, parkingLot.id);
    assert(attemptA.status === 'DRAFT', 'Created attempt starts in DRAFT status');
    assert(attemptA.userId.toString() === userA.user.id, 'Attempt is bound to creator user ID');

    // 3. User can fetch own attempt
    const fetchedAttempt = await attemptService.getAttemptById(attemptA.id, userA.user.id);
    assert(fetchedAttempt.attempt.id === attemptA.id, 'User A can fetch their own attempt');
    assert(fetchedAttempt.submission === null, 'DRAFT attempt has null submission');

    // 4. Ownership isolation: User B cannot access User A's attempt
    let userBAccessForbidden = false;
    try {
      await attemptService.getAttemptById(attemptA.id, userB.user.id);
    } catch (e) {
      if (e instanceof ForbiddenError) userBAccessForbidden = true;
    }
    assert(userBAccessForbidden, 'User B is forbidden from accessing User A attempt');

    // 5. User B cannot submit to User A's attempt
    const samplePayload = {
      requirements: { assumptions: '100 spots', constraints: 'No EVs' },
      design: {
        classes: 'class ParkingLot, class Spot, class Vehicle',
        relationships: 'ParkingLot has-a Spot',
        interfaces: 'interface PricingStrategy',
      },
      reasoning: {
        decisions: 'Composition over inheritance',
        patterns: 'Strategy pattern for pricing',
        tradeoffs: 'Memory vs speed',
      },
      edgeCases: 'Lot full, invalid ticket',
    };

    let userBSubmitForbidden = false;
    try {
      await attemptService.submitAttempt(attemptA.id, userB.user.id, samplePayload);
    } catch (e) {
      if (e instanceof ForbiddenError) userBSubmitForbidden = true;
    }
    assert(userBSubmitForbidden, 'User B is forbidden from submitting to User A attempt');

    // 6. User A submits solution: DRAFT -> SUBMITTED transition & submission persistence
    const submitResult = await attemptService.submitAttempt(attemptA.id, userA.user.id, samplePayload);
    assert(submitResult.status === 'SUBMITTED', 'Submit returns status SUBMITTED');
    assert(typeof submitResult.submissionId === 'string', 'Submit returns generated submissionId');

    const updatedAttempt = await AttemptModel.findById(attemptA.id);
    assert(updatedAttempt?.status === 'SUBMITTED', 'Attempt status updated to SUBMITTED in DB');
    assert(updatedAttempt?.submittedAt !== null, 'submittedAt timestamp is recorded in DB');
    assert(updatedAttempt?.submissionId?.toString() === submitResult.submissionId, 'submissionId is linked on attempt');

    const savedSubmission = await SubmissionModel.findById(submitResult.submissionId);
    assert(savedSubmission !== null, 'Submission document is persisted in MongoDB');
    assert(savedSubmission?.format === 'structured-text', 'Submission format is structured-text');
    assert(savedSubmission?.version === 1, 'Submission version is 1');
    assert(savedSubmission?.design.classes.includes('class ParkingLot'), 'Submission content matches input payload');

    // 7. Duplicate submission protection: cannot submit again
    let duplicateRejected = false;
    try {
      await attemptService.submitAttempt(attemptA.id, userA.user.id, samplePayload);
    } catch (e) {
      if (e instanceof ConflictError) duplicateRejected = true;
    }
    assert(duplicateRejected, 'Duplicate submission on SUBMITTED attempt rejected with ConflictError');

    // 8. User attempt history
    const userAAttempts = await attemptService.getUserAttempts(userA.user.id);
    assert(userAAttempts.length === 1, 'User A history shows exactly 1 attempt');
    assert(userAAttempts[0].status === 'SUBMITTED', 'Attempt history reflects SUBMITTED status');

    const userBAttempts = await attemptService.getUserAttempts(userB.user.id);
    assert(userBAttempts.length === 0, 'User B history remains empty (isolated)');

    console.log(`\nTest Summary: ${passedTests} passed, ${failedTests} failed.`);
    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

runTests();
