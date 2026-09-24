# Technical Design — LLD Practice & Feedback Platform

## 1. Technical Goal

Build a small, reliable web application that supports the complete LLD practice loop:

```text
Problem Selection
      ↓
Attempt Creation
      ↓
Structured Submission
      ↓
Submission Persistence
      ↓
Asynchronous Evaluation
      ↓
Structured Feedback
      ↓
Attempt History
```

The implementation should prioritize clear domain boundaries and reliability over infrastructure complexity.

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- GSAP for selected UI interactions/animations

## Backend

- Node.js
- Express
- TypeScript
- Zod for request/response validation

## Database

- MongoDB
- Mongoose

## AI

- Gemini as the primary AI provider
- Groq as fallback

The AI layer is accessed through an application-level provider abstraction.

## Deployment

```text
Vercel
  ↓
React Frontend

Render
  ↓
Express Backend
  ↓
MongoDB Atlas

Backend
  ↓
Gemini / Groq
```

No separate microservices are required.

---

# 3. High-Level Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Problems                     │
│ Practice Workspace           │
│ Evaluation                   │
│ History                      │
└──────────────┬───────────────┘
               │ REST API
               ↓
┌──────────────────────────────┐
│     Express + TypeScript     │
│                              │
│ Routes                       │
│ Controllers                  │
│ Domain / Services            │
│ Evaluation                   │
│ Validation                   │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ↓                ↓
┌─────────────┐  ┌────────────────┐
│  MongoDB    │  │  AI Providers  │
│             │  │                │
│ Problems    │  │ Gemini         │
│ Attempts    │  │ Groq           │
│ Submissions │  │                │
│ Evaluations │  └────────────────┘
└─────────────┘
```

The frontend should never communicate directly with the AI provider.

---

# 4. Backend Module Structure

A practical backend structure:

```text
server/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│   │
│   ├── modules/
│   │   ├── problems/
│   │   ├── attempts/
│   │   ├── submissions/
│   │   └── evaluations/
│   │
│   ├── services/
│   │   ├── evaluator/
│   │   └── ai/
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   │
│   ├── shared/
│   │   ├── types/
│   │   ├── schemas/
│   │   └── errors/
│   │
│   ├── app.ts
│   └── server.ts
│
└── package.json
```

The exact folder organization can change during implementation as long as the domain boundaries remain clear.

---

# 5. Core Domain Models

## Problem

```ts
interface Problem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  constraints?: string[];
  difficulty: "easy" | "medium" | "hard";
}
```

A problem is immutable from the learner's perspective.

---

## Attempt

```ts
interface Attempt {
  id: string;
  problemId: string;
  userId: string;

  status: "DRAFT" | "SUBMITTED" | "EVALUATING" | "COMPLETED" | "FAILED";

  submissionId?: string;

  startedAt: Date;
  submittedAt?: Date;
  completedAt?: Date;
}
```

The Attempt owns the learner's practice lifecycle.

---

## Submission

```ts
interface Submission {
  id: string;
  attemptId: string;

  format: "structured-text";

  requirements: {
    assumptions: string;
    constraints: string;
  };

  design: {
    classes: string;
    relationships: string;
    interfaces: string;
  };

  reasoning: {
    decisions: string;
    patterns: string;
    tradeoffs: string;
  };

  edgeCases: string;

  version: number;
  createdAt: Date;
}
```

A submission is immutable after submission.

Draft editing happens before the submission is finalized.

---

## Evaluation

```ts
interface Evaluation {
  id: string;
  submissionId: string;

  status: "PENDING" | "COMPLETED" | "FAILED";

  overallScore?: number;

  criteria: EvaluationCriterion[];

  summary?: string;

  createdAt: Date;
  completedAt?: Date;
}
```

---

## Evaluation Criterion

```ts
interface EvaluationCriterion {
  criterion:
    | "requirement_understanding"
    | "responsibilities"
    | "coupling_cohesion"
    | "abstraction_interfaces"
    | "extensibility"
    | "edge_cases_testability"
    | "reasoning";

  score: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
}
```

---

# 6. State Machine

Attempt state transitions must be explicit.

```text
DRAFT
  │
  │ submit
  ↓
SUBMITTED
  │
  │ evaluation starts
  ↓
EVALUATING
  │
  ├──────────────→ COMPLETED
  │
  └──────────────→ FAILED
```

A learner should not be able to:

- evaluate an unsaved submission
- submit an already completed attempt
- move a failed evaluation directly to completed without a new evaluation
- create duplicate evaluations for the same submission

The exact retry implementation can be simple, but state transitions must remain valid.

---

# 7. Submission Flow

When the learner submits:

```text
POST /api/attempts/:attemptId/submit
```

the backend should:

1. Validate the request.
2. Verify the attempt exists.
3. Verify the learner owns the attempt.
4. Verify the attempt is in a valid state.
5. Validate the submission structure.
6. Store the submission.
7. Update attempt status to `SUBMITTED`.
8. Create/initialize the evaluation state.
9. Begin evaluation.
10. Return the attempt/evaluation status to the frontend.

The important design decision is:

**Persist learner work before depending on AI.**

The main submission request should not require the AI provider to finish before returning success.

---

# 8. Evaluation Flow

```text
Submission Stored
       ↓
Attempt = SUBMITTED
       ↓
Evaluation Started
       ↓
Attempt = EVALUATING
       ↓
Evaluator
       ↓
AIProvider
       ↓
Structured Evaluation
       ↓
Persist Evaluation
       ↓
Attempt = COMPLETED
```

If the AI provider fails:

```text
AI Failure
    ↓
Evaluation = FAILED
    ↓
Attempt = FAILED
```

The original submission remains available.

---

# 9. Evaluator Interface

The practice system depends on an evaluator abstraction rather than directly depending on Gemini or Groq.

```ts
interface Evaluator {
  evaluate(problem: Problem, submission: Submission): Promise<Evaluation>;
}
```

The initial implementation:

```text
Evaluator
   ↓
AIEvaluator
```

`AIEvaluator` handles:

- constructing evaluation context
- calling the AI provider
- validating the AI response
- converting the response into the application's evaluation model

The learner-facing application does not need to know which model produced the evaluation.

---

# 10. AI Provider Interface

```ts
interface AIProvider {
  generateEvaluation(context: EvaluationContext): Promise<AIResponse>;
}
```

Implementations:

```text
AIProvider
   ├── GeminiProvider
   └── GroqProvider
```

The provider abstraction exists specifically to isolate external AI dependencies.

---

# 11. AI Provider Fallback

Normal path:

```text
AIEvaluator
     ↓
GeminiProvider
     ↓
Evaluation
```

Fallback path:

```text
AIEvaluator
     ↓
GeminiProvider
     ↓
failure
     ↓
GroqProvider
     ↓
Evaluation
```

Fallback should happen only for appropriate provider failures.

Application validation errors should not automatically trigger another AI request.

The fallback response must still conform to the same evaluation schema.

---

# 12. Evaluation Context

The AI should receive only the information necessary to evaluate the learner's design.

Conceptually:

```ts
interface EvaluationContext {
  problem: {
    title: string;
    description: string;
    requirements: string[];
    constraints?: string[];
  };

  submission: {
    assumptions: string;
    constraints: string;
    classes: string;
    relationships: string;
    interfaces: string;
    decisions: string;
    patterns: string;
    tradeoffs: string;
    edgeCases: string;
  };
}
```

The evaluator should judge the submission against the provided problem rather than against a single "correct" implementation.

Multiple valid LLD designs should therefore be possible.

---

# 13. AI Output Contract

The model should return structured JSON rather than free-form feedback.

Conceptually:

```json
{
  "summary": "string",
  "overallScore": 78,
  "criteria": [
    {
      "criterion": "responsibilities",
      "score": 8,
      "evidence": "string",
      "concern": "string",
      "suggestion": "string",
      "confidence": 0.87
    }
  ]
}
```

The backend must validate this response before storing it.

If the AI returns malformed or incomplete data, the evaluation should be treated as failed rather than storing an invalid evaluation.

---

# 14. Evaluation Rubric

The evaluation criteria are:

| Criterion                 | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| Requirement Understanding | Does the design address the stated requirements?              |
| Responsibilities          | Are responsibilities assigned clearly to classes/objects?     |
| Coupling & Cohesion       | Are dependencies reasonable and responsibilities focused?     |
| Abstraction & Interfaces  | Are abstractions and interfaces justified?                    |
| Extensibility             | Can likely changes be accommodated without major redesign?    |
| Edge Cases & Testability  | Does the design account for important scenarios and behavior? |
| Reasoning                 | Are design decisions and trade-offs clearly explained?        |

The detailed scoring contract is maintained separately in `Evaluation__Rubric.md`.

---

# 15. API Contract

## Problems

### `GET /api/problems`

Returns available LLD problems.

### `GET /api/problems/:id`

Returns a specific problem and its requirements.

---

## Attempts

### `POST /api/attempts`

Creates a new attempt.

Request:

```json
{
  "problemId": "problem_id"
}
```

Response contains the created attempt.

### `GET /api/attempts/:id`

Returns the current attempt state.

### `GET /api/attempts`

Returns the learner's attempt history.

---

## Submission

### `POST /api/attempts/:id/submit`

Creates and submits the structured solution.

Response should immediately provide the submission/evaluation status.

Example:

```json
{
  "attemptId": "attempt_id",
  "status": "EVALUATING",
  "evaluationId": "evaluation_id"
}
```

---

## Evaluation

### `GET /api/evaluations/:id`

Returns evaluation status and, when complete, the full feedback.

Example during evaluation:

```json
{
  "status": "PENDING"
}
```

Example after completion:

```json
{
  "status": "COMPLETED",
  "evaluation": {}
}
```

---

# 16. Frontend Responsibilities

The frontend is responsible for:

- displaying available problems
- presenting problem requirements
- managing the practice workspace
- collecting structured submission data
- client-side validation for user experience
- submitting attempts
- displaying evaluation progress
- displaying structured feedback
- displaying attempt history

The frontend should **not**:

- contain evaluation logic
- call Gemini/Groq directly
- decide evaluation scores
- contain database logic

---

# 17. Evaluation Polling

Because the MVP does not require a separate job-processing infrastructure, the frontend can use lightweight polling.

Example:

```text
Submit
  ↓
Receive evaluationId
  ↓
GET /api/evaluations/:id
  ↓
PENDING?
  ├── yes → wait → poll again
  └── no  → display result
```

Polling should stop when the evaluation reaches:

```text
COMPLETED
FAILED
```

A reasonable maximum polling duration should be enforced so the frontend does not poll indefinitely.

---

# 18. Failure Handling

Important failure cases:

### AI provider unavailable

- preserve submission
- attempt fallback provider
- mark evaluation failed if fallback also fails

### Invalid AI output

- do not store malformed evaluation
- mark evaluation failed
- preserve learner submission

### Duplicate submission request

The backend should avoid creating multiple evaluations for the same finalized submission.

### Learner refreshes during evaluation

The evaluation state is persisted, so refreshing the page should recover the current status.

### AI takes too long

The learner should still be able to leave the page and return later through attempt history.

---

# 19. Validation

Zod schemas should validate:

- API request bodies
- attempt creation
- submission structure
- AI evaluation output
- important API responses where useful

Validation exists at the backend boundary even if equivalent frontend validation exists.

The backend remains the source of truth.

---

# 20. Database Collections

The MVP requires four primary collections:

```text
problems
attempts
submissions
evaluations
```

Relationships:

```text
problems
   │
   └── attempts.problemId
          │
          └── submissions.attemptId
                 │
                 └── evaluations.submissionId
```

The exact MongoDB indexes should prioritize common access patterns such as:

- problems by ID
- attempts by user
- attempts by problem
- submissions by attempt
- evaluations by submission

---

# 21. Ownership and Access

Every learner-owned attempt must be associated with a `userId`.

For learner-facing operations:

```text
request user
     ↓
attempt.userId
     ↓
must match
```

A learner must not be able to read or submit another learner's attempt by changing an ID in the request.

---

# 22. Idempotency and Duplicate Processing

Evaluation processing should avoid accidentally creating multiple evaluations for the same submission.

Before starting evaluation:

```text
Does an active/completed evaluation already exist?
        ↓
      yes → reuse existing evaluation
      no  → create evaluation
```

The implementation can remain simple; the important requirement is that retrying a request does not unexpectedly duplicate evaluation work.

---

# 23. Testing Strategy

Testing should focus on important domain behavior rather than achieving arbitrary coverage numbers.

### Core tests

- create an attempt for a valid problem
- reject an invalid problem ID
- reject unauthorized attempt access
- validate structured submission
- submit a valid attempt
- prevent invalid state transitions
- create evaluation
- handle successful AI evaluation
- handle AI failure
- handle malformed AI output
- verify fallback provider behavior
- verify duplicate evaluation protection
- preserve submission after evaluation failure

### Frontend tests

At minimum, verify important user-facing states such as:

- loading
- empty/error state
- submission
- evaluating
- completed feedback
- failed evaluation

---

# 24. Deployment Simplicity

The application intentionally avoids infrastructure that does not directly improve the MVP.

Not used:

- Kubernetes
- microservices
- Kafka
- Redis
- n8n
- LangGraph
- separate evaluation workers
- message brokers

The assignment evaluates LLD/domain design and the learner feedback loop, so the simplest architecture that reliably demonstrates those qualities is preferred.

If evaluation processing needs to become more robust later, it can be separated behind the existing evaluation boundary without changing the learner-facing domain model.

---

# 25. Key Engineering Principles

### Store before evaluating

Never make learner data dependent on AI availability.

### Validate AI output

An LLM response is external/untrusted input and must conform to the application schema before persistence.

### Separate domain from providers

The practice flow should not depend directly on Gemini or Groq.

### Prefer evidence over arbitrary scores

Evaluation should explain why a criterion received its score.

### Keep valid designs open-ended

The evaluator should assess the submitted design against requirements and principles rather than expecting one predefined class diagram.

### Keep abstractions purposeful

Introduce an interface when it represents a real variation point, not merely to demonstrate a design pattern.

### Keep the MVP small

The goal is a complete practice → evaluation → feedback → retry experience, not a production-scale learning platform.

---

# 26. Final Technical Flow

```text
┌───────────────┐
│    Problem    │
└───────┬───────┘
        ↓
┌───────────────┐
│    Attempt    │
│     DRAFT     │
└───────┬───────┘
        ↓
┌───────────────┐
│  Submission   │
└───────┬───────┘
        ↓
┌───────────────┐
│    SUBMITTED  │
└───────┬───────┘
        ↓
┌───────────────┐
│  EVALUATING   │
└───────┬───────┘
        ↓
┌─────────────────────────┐
│       Evaluator         │
│                         │
│   Gemini → Groq         │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ Structured Evaluation   │
│                         │
│ Score                   │
│ Evidence                │
│ Concern                 │
│ Suggestion              │
│ Confidence              │
└───────────┬─────────────┘
            ↓
      ┌─────┴─────┐
      ↓           ↓
 COMPLETED      FAILED
      ↓
 Feedback
      ↓
 Attempt History
      ↓
    Try Again
```

This architecture is intentionally small enough to implement within the assignment timeframe while leaving clear boundaries for future submission formats and evaluation strategies.
