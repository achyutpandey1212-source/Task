import { AIProvider, EvaluationContext, AIResponse } from '../services/ai/aiProvider.js';
import { GeminiProvider } from '../services/ai/geminiProvider.js';
import { AIEvaluator } from '../services/evaluator/aiEvaluator.js';

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

const mockSuccessCriteria = [
  { criterion: 'requirement_understanding', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'responsibilities', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'coupling_cohesion', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'abstraction_interfaces', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'extensibility', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'edge_cases_testability', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
  { criterion: 'reasoning', score: 8, evidence: 'E', concern: 'C', suggestion: 'S', confidence: 0.9 },
];

const mockOutput = {
  summary: 'Mock summary',
  criteria: mockSuccessCriteria as any,
};

// Mock GeminiProvider that lets us simulate per-model success/failure
class MockSequentialGeminiProvider implements AIProvider {
  readonly name = 'gemini';
  readonly models = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ];
  public calledModels: string[] = [];
  public modelBehaviors: Record<string, 'success' | '503' | '400'> = {};

  constructor(behaviors: Record<string, 'success' | '503' | '400'>) {
    this.modelBehaviors = behaviors;
  }

  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    for (const model of this.models) {
      this.calledModels.push(model);
      const behavior = this.modelBehaviors[model] || '503';
      if (behavior === 'success') {
        return {
          raw: JSON.stringify(mockOutput),
          parsed: mockOutput,
          provider: 'gemini',
        };
      }
      if (behavior === '400') {
        throw new Error(`Gemini API error [400] on model ${model}: Bad Request`);
      }
      // Simulate 503 high demand
      console.log(`[MockGemini] Model ${model} failed with 503 HIGH DEMAND`);
    }
    throw new Error(`All Gemini models (${this.models.join(', ')}) failed.`);
  }
}

class MockGroqProvider implements AIProvider {
  readonly name = 'groq';
  public called = false;

  async generateEvaluation(_context: EvaluationContext): Promise<AIResponse> {
    this.called = true;
    return {
      raw: JSON.stringify(mockOutput),
      parsed: mockOutput,
      provider: 'groq',
    };
  }
}

async function runGeminiFlashLiteTests() {
  console.log('--- Starting Gemini Flash-Lite Fallback Test Suite ---');

  const mockProblem: any = {
    title: 'Parking Lot',
    description: 'Design a parking lot',
    requirements: ['Support cars', 'Payment processing'],
  };
  const mockSubmission: any = {
    requirements: { assumptions: '', constraints: '' },
    design: { classes: '', relationships: '', interfaces: '' },
    reasoning: { decisions: '', patterns: '', tradeoffs: '' },
    edgeCases: '',
  };

  // Test 0: Verify default models configured on GeminiProvider
  const defaultGemini = new GeminiProvider('fake-key');
  assert(
    defaultGemini.models.length === 5,
    `GeminiProvider has 5 models configured (got ${defaultGemini.models.length})`
  );
  assert(defaultGemini.models[0] === 'gemini-3.8-flash', 'Model 0: gemini-3.8-flash (Primary)');
  assert(defaultGemini.models[1] === 'gemini-3.7-flash', 'Model 1: gemini-3.7-flash (Fallback 1)');
  assert(defaultGemini.models[2] === 'gemini-3.6-flash', 'Model 2: gemini-3.6-flash (Fallback 2)');
  assert(defaultGemini.models[3] === 'gemini-3.5-flash-lite', 'Model 3: gemini-3.5-flash-lite (Fallback 3)');
  assert(defaultGemini.models[4] === 'gemini-3.1-flash-lite', 'Model 4: gemini-3.1-flash-lite (Fallback 4)');

  // Test 1: Primary succeeds (3.8 succeeds -> 3.7, 3.6, 3.5-lite, 3.1-lite not called)
  const p1 = new MockSequentialGeminiProvider({
    'gemini-3.8-flash': 'success',
  });
  const g1 = new MockGroqProvider();
  const eval1 = new AIEvaluator([p1, g1]);
  const res1 = await eval1.evaluate(mockProblem, mockSubmission);
  assert(res1.overallScore === 8, 'Test 1: Primary evaluation succeeds');
  assert(p1.calledModels.length === 1 && p1.calledModels[0] === 'gemini-3.8-flash', 'Test 1: Only 3.8 was called');
  assert(!g1.called, 'Test 1: Groq was NOT called');

  // Test 2: Existing Flash models fail (3.8, 3.7, 3.6 -> 503), 3.5 Flash-Lite succeeds
  const p2 = new MockSequentialGeminiProvider({
    'gemini-3.8-flash': '503',
    'gemini-3.7-flash': '503',
    'gemini-3.6-flash': '503',
    'gemini-3.5-flash-lite': 'success',
  });
  const g2 = new MockGroqProvider();
  const eval2 = new AIEvaluator([p2, g2]);
  const res2 = await eval2.evaluate(mockProblem, mockSubmission);
  assert(res2.overallScore === 8, 'Test 2: Flash-Lite 3.5 evaluation succeeds');
  assert(
    p2.calledModels.length === 4 && p2.calledModels[3] === 'gemini-3.5-flash-lite',
    'Test 2: Called 3.8 -> 3.7 -> 3.6 -> 3.5-flash-lite and stopped'
  );
  assert(!p2.calledModels.includes('gemini-3.1-flash-lite'), 'Test 2: 3.1-flash-lite was NOT called');
  assert(!g2.called, 'Test 2: Groq was NOT called');

  // Test 3: 3.5 Flash-Lite fails with 503, 3.1 Flash-Lite succeeds
  const p3 = new MockSequentialGeminiProvider({
    'gemini-3.8-flash': '503',
    'gemini-3.7-flash': '503',
    'gemini-3.6-flash': '503',
    'gemini-3.5-flash-lite': '503',
    'gemini-3.1-flash-lite': 'success',
  });
  const g3 = new MockGroqProvider();
  const eval3 = new AIEvaluator([p3, g3]);
  const res3 = await eval3.evaluate(mockProblem, mockSubmission);
  assert(res3.overallScore === 8, 'Test 3: Flash-Lite 3.1 evaluation succeeds');
  assert(
    p3.calledModels.length === 5 && p3.calledModels[4] === 'gemini-3.1-flash-lite',
    'Test 3: Called all 5 Gemini models ending with 3.1-flash-lite success'
  );
  assert(!g3.called, 'Test 3: Groq was NOT called');

  // Test 4: All 5 Gemini models fail with 503 -> Falls through to Groq
  const p4 = new MockSequentialGeminiProvider({
    'gemini-3.8-flash': '503',
    'gemini-3.7-flash': '503',
    'gemini-3.6-flash': '503',
    'gemini-3.5-flash-lite': '503',
    'gemini-3.1-flash-lite': '503',
  });
  const g4 = new MockGroqProvider();
  const eval4 = new AIEvaluator([p4, g4]);
  const res4 = await eval4.evaluate(mockProblem, mockSubmission);
  assert(res4.provider === 'groq', 'Test 4: Evaluator fell through to Groq provider');
  assert(p4.calledModels.length === 5, 'Test 4: All 5 Gemini models were attempted');
  assert(g4.called, 'Test 4: Groq provider was called');

  console.log(`\nGemini Flash-Lite Fallback Test Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runGeminiFlashLiteTests();
