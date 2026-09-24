import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { problemService } from '../modules/problems/problem.service.js';
import { GeminiProvider } from '../services/ai/geminiProvider.js';

async function testLiveGemini() {
  console.log('--- Testing Live Gemini API Evaluation ---');
  await connectDatabase();

  try {
    const problem = await problemService.getProblemById('parking-lot');
    const provider = new GeminiProvider();

    const sampleContext = {
      problem: {
        title: problem.title,
        description: problem.description,
        requirements: problem.requirements,
        constraints: problem.constraints,
      },
      submission: {
        format: 'structured-text' as const,
        requirements: {
          assumptions: 'Multi-level parking lot with 500 spots total.',
          constraints: 'Height barrier at entry is 2.8 meters.',
        },
        design: {
          classes: `
class ParkingLot {
  List<Floor> floors;
  Ticket issueTicket(Vehicle v);
  Receipt checkout(Ticket t, PaymentStrategy payment);
}
class Floor {
  int level;
  Map<SpotType, List<ParkingSpot>> spots;
}
class ParkingSpot {
  String id;
  SpotType type;
  boolean isOccupied;
}
`,
          relationships: 'ParkingLot has many Floors; Floor has many ParkingSpots.',
          interfaces: 'interface PaymentStrategy { boolean pay(double amount); }',
        },
        reasoning: {
          decisions: 'Isolated floor management so capacity modifications do not affect gate dispatch.',
          patterns: 'Strategy pattern for variable hourly rate calculation.',
          tradeoffs: 'In-memory map for constant time lookup vs potential sync overhead.',
        },
        edgeCases: 'Power cut: barrier auto-releases; Lot full: dynamic display shows 0 availability.',
      },
    };

    console.log('[LiveGemini] Calling Gemini API...');
    const result = await provider.generateEvaluation(sampleContext);
    console.log('[LiveGemini] Response received from provider:', result.provider);
    console.log('[LiveGemini] Summary:', result.parsed.summary);
    console.log('[LiveGemini] Criteria count:', result.parsed.criteria.length);
    console.log('[LiveGemini] Sample Criterion [0]:', result.parsed.criteria[0]);

    if (result.parsed.criteria.length === 7) {
      console.log('\n[PASS] Live Gemini evaluation produced all 7 rubric criteria successfully!');
    } else {
      console.error('\n[FAIL] Criteria count is not 7');
      process.exit(1);
    }
  } catch (error) {
    console.error('[LiveGemini] Failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

testLiveGemini();
