# Architecture

## 1. Purpose

This document defines the system architecture for the LLD Practice Platform MVP.

The architecture is intentionally small and implementation-focused. The goal is to support the core learner journey:

```text
Choose Problem
      ↓
Start Attempt
      ↓
Design Solution
      ↓
Submit
      ↓
Evaluate
      ↓
Review Feedback
      ↓
Try Again
```

The system should remain a simple TypeScript-based monolith with clear module boundaries.

The architecture should make the following easy:

- adding new LLD problems
- adding new submission formats later
- changing or adding evaluation providers
- preserving learner submissions when evaluation fails
- testing domain logic independently from external services
- enforcing authentication and ownership
- preventing invalid attempt/evaluation state transitions

The architecture should **not** introduce unnecessary distributed-system infrastructure.

---

# 2. Architectural Style

The MVP uses a **modular monolith**.

```text
┌─────────────────────────────────────────────┐
│                React Frontend               │
│        TypeScript + Vite + GSAP             │
└──────────────────────┬──────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│            Express Backend                  │
│             TypeScript                      │
│                                             │
│  ┌────────────┐  ┌────────────┐             │
│  │ Problems   │  │ Attempts   │             │
│  └────────────┘  └────────────┘             │
│                                             │
│  ┌────────────┐  ┌────────────┐             │
│  │Submissions │  │Evaluations │             │
│  └────────────┘  └────────────┘             │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │        Evaluation Service              │ │
│  │  Evaluator → AIProvider                │ │
│  └────────────────────────────────────────┘ │
└───────────────┬─────────────────┬───────────┘
                │                 │
                ▼                 ▼
        ┌──────────────┐   ┌──────────────┐
        │   MongoDB    │   │ AI Providers │
        │              │   │ Gemini/Groq  │
        └──────────────┘   └──────────────┘
```

### Why a modular monolith?

The assignment focuses on LLD/domain design rather than infrastructure complexity.

A modular monolith gives us:

- clear domain boundaries
- simple local development
- simple deployment
- straightforward testing
- fewer failure points
- enough structure for future extension

The MVP does **not** require:

- microservices
- Kafka
- Redis
- Kubernetes
- message brokers
- separate worker services
- event buses
- distributed tracing infrastructure

These can be introduced later if actual scale requires them.

---

# 3. System Boundaries

The system has five primary application modules:

```text
Problems
Attempts
Submissions
Evaluations
Authentication
```

External infrastructure:

```text
MongoDB
Gemini
Groq
Authentication Provider
```

The core domain relationship is:

```text
Problem
   ↓
Attempt
   ↓
Submission
   ↓
Evaluation
   ↓
Feedback / Criteria
```

User ownership sits above the practice lifecycle:

```text
User
 └──< Attempt
        └── Submission
              └── Evaluation
```

---

# 4. Frontend Architecture

The frontend is a React + TypeScript application.

```text
client/
└── src/
    ├── pages/
    ├── components/
    ├── features/
    │   ├── problems/
    │   ├── attempts/
    │   ├── submissions/
    │   └── evaluations/
    ├── services/
    ├── hooks/
    ├── types/
    ├── utils/
    ├── routes/
    └── App.tsx
```

## Responsibilities

### Pages

Own page-level composition and navigation.

Potential pages:

```text
/problems
/problems/:problemId
/attempts/:attemptId
/evaluations/:evaluationId
/history
/login
```

### Features

Feature-specific UI and logic.

For example:

```text
features/
└── attempts/
    ├── AttemptPage.tsx
    ├── SubmissionForm.tsx
    └── attemptService.ts
```

### Services

Handle HTTP communication with the backend.

The frontend should not contain business rules that belong to the backend.

Example:

```text
problemService
attemptService
evaluationService
authService
```

### State

Local component state is sufficient for most MVP interactions.

A global state library should not be introduced unless implementation complexity actually requires it.

---

# 5. Backend Architecture

The backend uses Express + TypeScript.

```text
server/
└── src/
    ├── config/
    │   ├── env.ts
    │   └── database.ts
    │
    ├── modules/
    │   ├── problems/
    │   ├── attempts/
    │   ├── submissions/
    │   └── evaluations/
    │
    ├── services/
    │   ├── evaluator/
    │   └── ai/
    │
    ├── middleware/
    │   ├── auth.ts
    │   ├── validate.ts
    │   └── errorHandler.ts
    │
    ├── shared/
    │   ├── types/
    │   ├── schemas/
    │   └── errors/
    │
    ├── app.ts
    └── server.ts
```

Each module should contain the logic directly related to its domain.

For example:

```text
attempts/
├── attempt.model.ts
├── attempt.schema.ts
├── attempt.controller.ts
├── attempt.service.ts
└── attempt.routes.ts
```

The exact file split can remain pragmatic; the important boundary is that domain responsibilities do not become mixed across unrelated modules.

---

# 6. Domain Layer

The central domain objects are:

```text
User
Problem
Attempt
Submission
Evaluation
EvaluationCriterion
```

Their responsibilities remain intentionally narrow.

## Problem

Provides the learner with the LLD challenge.

It owns:

- title
- description
- requirements
- constraints
- difficulty

It does not evaluate the learner.

---

## Attempt

Represents one learner's practice session for a problem.

It owns:

- learner ownership
- selected problem
- lifecycle status
- timestamps
- associated submission

Attempt status:

```text
DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ↓
COMPLETED

                 ↘ FAILED
```

The Attempt domain should prevent invalid transitions.

---

## Submission

Represents the learner's submitted design.

The MVP supports:

```text
structured-text
```

The submission contains:

```text
Requirements
├── assumptions
└── constraints

Design
├── classes
├── relationships
└── interfaces

Reasoning
├── decisions
├── patterns
└── trade-offs

Edge Cases
└── important scenarios + handling
```

A final submission should be treated as immutable evidence.

If the learner tries again, a new attempt/submission can be created.

---

## Evaluation

Represents the result of evaluating a submission.

It owns:

- evaluation status
- overall score
- criterion results
- summary
- timestamps

Evaluation status:

```text
PENDING
   ↓
COMPLETED

   or

FAILED
```

---

# 7. Evaluation Architecture

Evaluation is deliberately isolated behind an abstraction.

```ts
interface Evaluator {
  evaluate(problem: Problem, submission: Submission): Promise<Evaluation>;
}
```

The application interacts with `Evaluator`, not directly with Gemini or Groq.

Current implementation:

```text
Evaluator
    │
    ▼
AIEvaluator
    │
    ├── GeminiProvider
    │
    └── GroqProvider
```

This keeps provider-specific logic outside the core evaluation flow.

---

# 8. AI Provider Abstraction

AI providers implement:

```ts
interface AIProvider {
  generateEvaluation(context: EvaluationContext): Promise<AIResponse>;
}
```

Conceptually:

```text
AIProvider
    │
    ├── GeminiProvider
    │
    └── GroqProvider
```

Provider selection:

```text
AIEvaluator
    ↓
Primary Provider: Gemini
    ↓
Failure
    ↓
Fallback Provider: Groq
```

The provider abstraction prevents the evaluation domain from becoming coupled to a specific AI SDK.

The evaluator should receive structured domain data and request structured output.

AI output must be validated before becoming an `Evaluation`.

---

# 9. Evaluation Pipeline

The evaluation pipeline is:

```text
Submission
    ↓
Build EvaluationContext
    ↓
Evaluator
    ↓
AI Provider
    ↓
Raw AI Response
    ↓
Parse Structured Output
    ↓
Validate with Zod
    ↓
Create Evaluation
    ↓
Persist Evaluation
    ↓
Mark Attempt COMPLETED
```

The evaluator should assess the submission against the fixed rubric.

Criteria:

```text
1. Requirement Understanding
2. Class Responsibilities
3. Coupling and Cohesion
4. Abstraction and Interfaces
5. Extensibility
6. Edge Cases and Testability
7. Design Reasoning
```

Each criterion produces:

```text
criterion
score
evidence
concern
suggestion
confidence
```

The evaluator must not assume there is only one correct class design.

The evaluation should judge how well the submitted design addresses the problem and justify its feedback using evidence from the submission.

---

# 10. Submission and Evaluation Request Flow

When a learner submits:

```text
Client
  │
  │ POST /api/attempts/:id/submit
  ▼
Authentication
  │
  ▼
Ownership Check
  │
  ▼
Validate Submission
  │
  ▼
Validate Attempt State
  │
  ▼
Persist Submission
  │
  ▼
Attempt → SUBMITTED
  │
  ▼
Create Evaluation
  │
  ▼
Attempt → EVALUATING
  │
  ▼
Run Evaluator
  │
  ├───────────────┐
  ▼               ▼
Gemini          Groq fallback
  │               │
  └───────┬───────┘
          ▼
Validate AI Output
          │
          ▼
Persist Evaluation
          │
          ▼
Attempt → COMPLETED
```

The learner's submission must be persisted **before** AI evaluation is depended upon.

This guarantees that an AI/provider failure does not destroy learner work.

---

# 11. Failure Handling

AI evaluation is an external dependency and can fail.

The system should distinguish between:

### Validation failure

Examples:

- missing required fields
- invalid attempt ID
- invalid submission structure
- unauthorized access
- invalid state transition

These should return an appropriate API error without starting evaluation.

### Provider failure

Examples:

- timeout
- rate limit
- temporary provider error
- malformed provider response

The evaluator should attempt the configured fallback provider where appropriate.

```text
Gemini
  ↓ failure
Groq
  ↓ failure
Evaluation FAILED
```

The persisted submission remains available.

The system must never delete the submission because evaluation failed.

---

# 12. Duplicate Evaluation Protection

A submission should not be evaluated multiple times accidentally.

Before starting evaluation:

```text
Check submission
      ↓
Check associated evaluation
      ↓
If already evaluating/completed
      ↓
Do not start duplicate evaluation
```

This protects against:

- repeated submit requests
- frontend retries
- accidental double clicks
- network retries

The backend remains the source of truth.

---

# 13. Evaluation Polling

The MVP uses polling rather than introducing real-time infrastructure.

After submission:

```text
POST /api/attempts/:id/submit
        ↓
evaluationId
        ↓
GET /api/evaluations/:id
        ↓
PENDING / EVALUATING
        ↓
poll again
        ↓
COMPLETED / FAILED
```

The frontend stops polling once the evaluation reaches a terminal state.

Terminal states:

```text
COMPLETED
FAILED
```

WebSockets, Server-Sent Events, and job queues are unnecessary for the MVP.

---

# 14. Authentication Boundary

Authentication establishes the identity of the current learner.

The backend should derive the authenticated user from the authentication mechanism rather than trusting a client-provided `userId`.

Protected operations include:

```text
POST /api/attempts
GET  /api/attempts
GET  /api/attempts/:id
POST /api/attempts/:id/submit
GET  /api/evaluations/:id
```

Ownership must be checked before returning or modifying learner-specific resources.

For example:

```text
Authenticated User
       ↓
Attempt.userId === authenticatedUser.id
       ↓
Allow access
```

A user must not be able to access another user's attempts or evaluations simply by changing an ID in the request.

---

# 15. API Boundary

The frontend communicates with the backend through REST APIs.

## Problems

```http
GET /api/problems
GET /api/problems/:id
```

## Attempts

```http
POST /api/attempts
GET  /api/attempts
GET  /api/attempts/:id
```

## Submission

```http
POST /api/attempts/:id/submit
```

Example response:

```json
{
  "attemptId": "attempt_id",
  "status": "EVALUATING",
  "evaluationId": "evaluation_id"
}
```

## Evaluation

```http
GET /api/evaluations/:id
```

Pending:

```json
{
  "status": "PENDING"
}
```

Completed:

```json
{
  "status": "COMPLETED",
  "evaluation": {}
}
```

The API layer should validate request payloads with Zod before domain operations execute.

---

# 16. Persistence Architecture

MongoDB is used for persistence.

Collections:

```text
users
problems
attempts
submissions
evaluations
```

Relationships are represented using IDs.

```text
Attempt
 ├── userId
 └── problemId

Submission
 └── attemptId

Evaluation
 └── submissionId
```

Important indexes:

```text
attempts:
  userId
  problemId

submissions:
  attemptId

evaluations:
  submissionId
```

The database is an infrastructure concern.

Domain logic should not depend directly on MongoDB-specific behavior wherever practical.

---

# 17. Data Flow

### Reading a problem

```text
React
  ↓
GET /api/problems/:id
  ↓
Problem Module
  ↓
MongoDB
  ↓
Problem
  ↓
React
```

### Starting an attempt

```text
React
  ↓
POST /api/attempts
  ↓
Authentication
  ↓
Problem lookup
  ↓
Create Attempt
  ↓
MongoDB
  ↓
Attempt response
```

### Submitting a solution

```text
React
  ↓
POST /api/attempts/:id/submit
  ↓
Authentication
  ↓
Ownership
  ↓
Validation
  ↓
Persist Submission
  ↓
Create Evaluation
  ↓
Evaluation Service
  ↓
AI Provider
  ↓
Persist Evaluation
```

### Reviewing feedback

```text
React
  ↓
GET /api/evaluations/:id
  ↓
Ownership validation
  ↓
MongoDB
  ↓
Evaluation
  ↓
React
```

---

# 18. Separation of Responsibilities

The architecture follows a simple responsibility split:

```text
Controller
    ↓
Request/response handling

Service
    ↓
Application/domain orchestration

Domain
    ↓
Business rules and state

Repository/Model
    ↓
Persistence

Evaluator
    ↓
Evaluation behavior

AIProvider
    ↓
External AI communication
```

The MVP does not require a large formal Clean Architecture implementation.

The purpose of separation is to prevent responsibilities from becoming mixed, not to maximize abstraction.

---

# 19. Extensibility

The architecture should support future changes without requiring a rewrite.

## New submission format

Current:

```text
Submission
 └── structured-text
```

Future:

```text
Submission
 ├── structured-text
 ├── diagram
 ├── code
 └── combined
```

The evaluation layer should consume a normalized `Submission` representation rather than being tightly coupled to the UI form.

---

## New evaluator

Current:

```text
Evaluator
 └── AIEvaluator
```

Future:

```text
Evaluator
 ├── AIEvaluator
 ├── RuleBasedEvaluator
 └── HumanEvaluator
```

The rest of the application should continue to depend on:

```ts
Evaluator;
```

rather than a specific implementation.

---

## New AI provider

Current:

```text
Gemini
Groq
```

Future providers can implement:

```ts
AIProvider;
```

without changing the core evaluation contract.

---

# 20. Testing Architecture

Tests should focus on behavior and boundaries rather than implementation details.

Important test categories:

### Domain tests

- valid state transitions
- invalid state transitions
- submission immutability
- evaluation status transitions

### API tests

- authentication
- ownership
- validation
- attempt creation
- submission
- evaluation retrieval

### Evaluation tests

- valid AI response parsing
- invalid AI response rejection
- rubric completeness
- provider fallback
- evaluation failure handling

### Integration tests

At minimum, verify:

```text
Create Attempt
      ↓
Submit Solution
      ↓
Persist Submission
      ↓
Evaluate
      ↓
Persist Evaluation
      ↓
Retrieve Feedback
```

---

# 21. Security and Data Integrity

The MVP should enforce basic security boundaries.

### Authentication

Protected routes require authentication.

### Authorization

Resources must belong to the authenticated learner.

### Validation

All external input is validated.

### AI output validation

AI responses are treated as untrusted external data and validated with Zod before persistence.

### Submission preservation

Learner submissions are persisted before external evaluation.

### Secrets

AI API keys and authentication secrets must remain server-side and must not be exposed to the frontend.

---

# 22. Deployment Architecture

The intended deployment is:

```text
                 ┌─────────────────┐
                 │     Vercel      │
                 │ React Frontend  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Render      │
                 │ Express Backend │
                 └──────┬─────┬────┘
                        │     │
             ┌──────────┘     └──────────┐
             ▼                           ▼
      ┌──────────────┐           ┌──────────────┐
      │ MongoDB Atlas│           │ Gemini/Groq  │
      └──────────────┘           └──────────────┘
```

Environment-specific configuration should be handled through environment variables.

No secrets should be committed to the repository.

---

# 23. Explicitly Out of Scope

The following are intentionally excluded from the MVP:

- microservices
- Kubernetes
- Redis
- Kafka
- background job infrastructure
- real-time evaluation updates
- complex event-driven architecture
- large-scale analytics
- collaborative editing
- social features
- advanced LMS functionality
- complex diagram editors
- code execution/sandboxing
- automated interview scheduling
- multiple AI agents

These features may become relevant in a larger product but do not improve the core assignment outcome enough to justify their complexity at this stage.

---

# 24. Architecture Principles

The implementation should follow these principles:

### 1. Domain first

Core learner behavior should remain understandable without knowing the infrastructure.

### 2. Persist before external work

Never make learner work dependent on successful AI execution.

### 3. Validate boundaries

Validate both incoming API data and external AI responses.

### 4. Small abstractions

Introduce interfaces when they represent a meaningful change point.

Current meaningful abstractions:

```text
Evaluator
AIProvider
```

Avoid creating abstractions solely for architectural appearance.

### 5. Backend owns business rules

The frontend should provide the experience.

The backend should enforce correctness.

### 6. AI provides judgment, not system control

AI evaluates the learner's design.

AI does not determine:

- authentication
- ownership
- attempt state
- persistence
- API permissions
- evaluation lifecycle

### 7. Multiple valid designs

The evaluation system should provide evidence-based feedback rather than treating a single reference architecture as the only correct solution.

### 8. Optimize for the learner loop

Every implementation decision should ultimately support:

```text
Practice
  ↓
Submit
  ↓
Understand mistakes
  ↓
Improve
  ↓
Try again
```

---

# 25. Final Architecture

The complete MVP architecture can be summarized as:

```text
                         ┌───────────────────┐
                         │   React Client    │
                         │ TypeScript + GSAP │
                         └─────────┬─────────┘
                                   │
                              REST API
                                   │
                                   ▼
                 ┌─────────────────────────────────┐
                 │       Express TypeScript        │
                 │                                 │
                 │  ┌─────────┐   ┌────────────┐ │
                 │  │Problems │   │  Attempts  │ │
                 │  └─────────┘   └─────┬──────┘ │
                 │                      │         │
                 │                ┌─────▼──────┐  │
                 │                │ Submissions│  │
                 │                └─────┬──────┘  │
                 │                      │         │
                 │                ┌─────▼──────┐  │
                 │                │ Evaluations│  │
                 │                └─────┬──────┘  │
                 │                      │         │
                 │                ┌─────▼──────┐  │
                 │                │ Evaluator  │  │
                 │                └─────┬──────┘  │
                 │                      │         │
                 │                ┌─────▼──────┐  │
                 │                │ AIProvider │  │
                 │                └─────┬──────┘  │
                 └──────────────────────┼─────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
                  ┌─────────────┐              ┌─────────────┐
                  │   MongoDB   │              │ Gemini/Groq │
                  └─────────────┘              └─────────────┘
```

The architecture is intentionally simple enough to implement within the assignment timeframe while preserving the important LLD boundaries around **attempts, submissions, evaluation, feedback, state, ownership, and extensibility**.
