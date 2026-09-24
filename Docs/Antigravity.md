# Antigravity Implementation Guide

## 1. Purpose

This document defines how Antigravity should implement the LLD Practice Platform.

Antigravity is responsible for writing and modifying the codebase according to the architecture, domain model, API contracts, evaluation rubric, and implementation instructions defined in the project documentation.

The project should be built incrementally in phases.

Do not jump ahead or introduce unnecessary architecture.

The goal is to build a small, reliable, well-structured product rather than an over-engineered system.

---

# 2. Source of Truth

The following project documents define the intended system:

```text
Research_Note.pdf
Product__Design.md
Design__Note.md
Technical__Design.md
Authentication_And_User_Lifecycle.md
Evaluation__Rubric.md
Architecture.md
Antigravity.md
```

When implementing functionality:

1. Follow the domain model already defined.
2. Follow the API contracts already defined.
3. Follow the state transitions already defined.
4. Follow the evaluation rubric already defined.
5. Do not introduce new architecture unless necessary.
6. If an implementation detail is genuinely unspecified, choose the simplest reasonable solution and document the decision.

Do not silently redesign the product.

---

# 3. Implementation Philosophy

The project is being built with a simple workflow:

```text
Human + ChatGPT
       ↓
Architecture / decisions / implementation prompts
       ↓
Antigravity
       ↓
Code
       ↓
Human verification
```

Antigravity should prioritize:

- correctness
- maintainability
- simplicity
- clear domain boundaries
- working functionality
- testability
- meaningful error handling

Do not optimize for code volume.

Do not add abstractions merely to make the architecture look sophisticated.

---

# 4. Phase-Based Development

The project is divided into six phases:

```text
Phase 1 — Foundation & Project Setup
Phase 2 — Core Learner Journey
Phase 3 — Evaluation Engine + AI
Phase 4 — Final Frontend Experience
Phase 5 — Testing, Hardening & Production Readiness
Phase 6 — Deployment + Submission Package
```

Antigravity must work on **only the requested phase**.

Do not implement later-phase functionality unless explicitly requested.

---

# 5. CRITICAL FRONTEND RULE

## The frontend is NOT a priority during Phases 1–3.

Until the backend, domain logic, database, evaluation engine, and AI integration are working, the frontend should remain extremely minimal.

The temporary frontend exists only to:

- verify API connectivity
- verify authentication
- verify basic request/response flows
- manually test backend functionality
- expose simple integration problems

It should look intentionally basic.

### Temporary frontend style

Use only:

- simple HTML-like structure through React
- basic forms
- basic buttons
- simple headings
- plain lists
- simple borders/outlines
- minimal spacing
- minimal CSS

Example:

```text
┌──────────────────────────────┐
│ LLD Practice                 │
├──────────────────────────────┤
│ Problem                      │
│ [Select problem]             │
│                              │
│ [Start Attempt]              │
├──────────────────────────────┤
│ Attempt                      │
│ [basic fields]               │
│                              │
│ [Submit]                     │
└──────────────────────────────┘
```

This is deliberately temporary.

### Do NOT spend time on:

- polished visual design
- GSAP animations
- fancy transitions
- gradients
- glassmorphism
- complex components
- design systems
- elaborate responsive layouts
- custom illustrations
- decorative assets
- advanced navigation
- pixel-perfect styling

Do not attempt to make the temporary frontend look production-ready.

---

# 6. Frontend Is Designed Properly Only in Phase 4

Phase 4 is the dedicated frontend/product-experience phase.

Only then should Antigravity work seriously on:

- visual hierarchy
- typography
- spacing
- responsive layout
- component design
- navigation
- feedback presentation
- empty states
- loading states
- error states
- GSAP animation
- visual polish
- final interaction design

The final frontend should be built on top of the already-working backend.

This prevents UI work from slowing down core engineering.

---

# 7. Technology Stack

## Frontend

```text
React
TypeScript
Vite
React Router
Axios
GSAP
```

## Backend

```text
Node.js
Express
TypeScript
Zod
```

## Database

```text
MongoDB
Mongoose
```

## Authentication

Use the authentication approach defined in:

```text
Authentication_And_User_Lifecycle.md
```

Do not invent a different authentication architecture unless explicitly requested.

## AI

Primary:

```text
Gemini
```

Fallback:

```text
Groq
```

AI providers must be accessed through the `AIProvider` abstraction.

---

# 8. Architecture

The application is a modular monolith.

```text
React Client
     ↓
Express API
     ├── Problems
     ├── Attempts
     ├── Submissions
     ├── Evaluations
     ├── Authentication
     │
     └── Evaluation Service
            ├── Gemini
            └── Groq

     ↓
MongoDB
```

Do NOT introduce:

- microservices
- Kafka
- Redis
- Kubernetes
- message brokers
- event buses
- separate worker infrastructure
- unnecessary queues
- unnecessary orchestration frameworks

unless explicitly requested later.

---

# 9. Core Domain Model

The primary domain objects are:

```text
User
Problem
Attempt
Submission
Evaluation
EvaluationCriterion
```

Relationship:

```text
Problem
  ↓
Attempt
  ↓
Submission
  ↓
Evaluation
  ↓
EvaluationCriterion[]
```

User ownership:

```text
User
 └──< Attempt
        └── Submission
              └── Evaluation
```

Do not change these relationships casually.

---

# 10. Problem

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

Responsibilities:

- provide the LLD problem
- provide requirements
- provide context
- provide constraints
- provide difficulty

Problem does not evaluate submissions.

---

# 11. Attempt

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

Attempt represents one learner's practice lifecycle.

State machine:

```text
DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ├── COMPLETED
  └── FAILED
```

Invalid transitions must be rejected.

---

# 12. Submission

MVP format:

```text
structured-text
```

Structure:

```text
Requirements
├── assumptions
└── constraints

Domain Design
├── classes
├── relationships
└── interfaces

Design Reasoning
├── decisions
├── patterns
└── trade-offs

Edge Cases
└── scenarios + handling
```

Submission represents learner evidence.

Once finally submitted, it should be treated as immutable.

If the learner wants to try again, create another attempt/submission rather than mutating the old submitted evidence.

---

# 13. Evaluation

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

Evaluation represents the feedback generated for a submission.

---

# 14. Evaluation Criterion

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

The evaluator must provide actionable, evidence-based feedback.

Do not reduce evaluation to a single overall score.

The overall score is secondary to useful feedback.

---

# 15. Important Interfaces

Only introduce meaningful abstractions.

Current core abstractions:

```ts
interface Evaluator {
  evaluate(problem: Problem, submission: Submission): Promise<Evaluation>;
}
```

And:

```ts
interface AIProvider {
  generateEvaluation(context: EvaluationContext): Promise<AIResponse>;
}
```

Expected structure:

```text
Evaluator
   └── AIEvaluator
          ├── Gemini
          └── Groq
```

and:

```text
AIProvider
   ├── GeminiProvider
   └── GroqProvider
```

Do not create unnecessary interfaces for every class.

---

# 16. Evaluation Philosophy

The evaluator must NOT assume there is one canonical solution.

Multiple valid designs should be accepted.

Evaluation should consider:

```text
Requirement Understanding
Class Responsibilities
Coupling and Cohesion
Abstraction and Interfaces
Extensibility
Edge Cases and Testability
Design Reasoning
```

AI should provide:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
```

The evaluation should explain _why_ something is good or weak.

Avoid vague feedback such as:

```text
"Good design."
"Needs improvement."
"Use better abstraction."
```

Feedback must reference the submitted design.

---

# 17. Deterministic vs AI Responsibilities

Use deterministic code wherever possible.

### Deterministic responsibilities

The backend should control:

- authentication
- authorization
- ownership
- required fields
- schema validation
- state transitions
- persistence
- duplicate submission/evaluation protection
- API contracts
- evaluation lifecycle

### AI responsibilities

AI should primarily handle judgment-heavy work:

- requirement interpretation
- responsibility analysis
- coupling/cohesion analysis
- abstraction analysis
- extensibility analysis
- edge-case analysis
- design reasoning feedback

AI should never control application state.

---

# 18. Submission Persistence Rule

This is a critical rule.

Always persist the learner's submission **before relying on AI evaluation**.

Correct:

```text
Validate
 ↓
Persist Submission
 ↓
Mark Attempt SUBMITTED
 ↓
Create Evaluation
 ↓
Evaluate
```

Incorrect:

```text
Send to AI
 ↓
AI succeeds
 ↓
Save submission
```

If AI fails, the learner's work must still exist.

---

# 19. AI Failure Handling

Gemini is the primary provider.

Groq is the fallback.

```text
Gemini
  ↓ failure
Groq
  ↓ failure
Evaluation FAILED
```

If both fail:

- preserve submission
- preserve attempt
- persist evaluation failure where appropriate
- expose a recoverable failure state
- never delete learner work

Do not fake an evaluation when AI fails.

---

# 20. AI Output Validation

AI output is external/untrusted data.

Never directly save raw model output as an `Evaluation`.

Required flow:

```text
AI response
    ↓
Parse
    ↓
Zod validation
    ↓
Validated Evaluation structure
    ↓
Persist
```

Malformed output must be treated as an evaluation failure.

---

# 21. Duplicate Processing Protection

The backend must prevent duplicate evaluation.

Before starting evaluation:

```text
Check existing evaluation
       ↓
PENDING/EVALUATING?
       ↓
Do not start another evaluation
```

This protects against:

- double clicks
- repeated HTTP requests
- frontend retries
- network retries

---

# 22. API Contracts

## Problems

```http
GET /api/problems
GET /api/problems/:id
```

## Attempts

```http
POST /api/attempts
GET /api/attempts
GET /api/attempts/:id
```

## Submission

```http
POST /api/attempts/:id/submit
```

Expected response:

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

The exact response structures should remain consistent once implemented.

---

# 23. Authentication and Ownership

Authenticated identity must come from the authentication mechanism.

Never trust:

```text
userId
```

sent by the client as proof of identity.

Protected resources must verify ownership.

For example:

```text
authenticatedUser.id
        ↓
attempt.userId
        ↓
must match
```

A user must not be able to access another user's attempts/evaluations by changing an ID in the request.

---

# 24. Database

MongoDB collections:

```text
users
problems
attempts
submissions
evaluations
```

Important indexes:

```text
attempts.userId
attempts.problemId
submissions.attemptId
evaluations.submissionId
```

Use Mongoose for persistence.

Keep MongoDB-specific details inside the persistence/application layer rather than spreading them through unrelated business logic.

---

# 25. Environment Variables

Secrets must remain server-side.

Expected categories include:

```text
DATABASE_URL
AUTH configuration
GEMINI API key(s)
GROQ API key(s)
CLIENT_URL
PORT
```

Use:

```text
.env
.env.example
```

Never commit real credentials.

The exact environment variable names should be centralized in the environment configuration module.

---

# 26. Error Handling

The backend should use a centralized error-handling strategy.

Errors should be categorized where practical:

```text
400 — invalid request
401 — unauthenticated
403 — unauthorized
404 — resource not found
409 — invalid state/conflict
422 — validation failure
500 — unexpected server error
503 — external dependency/evaluation failure
```

Do not expose secrets or internal stack traces to clients in production.

Development logs may contain useful debugging information.

---

# 27. Testing Expectations

Important backend tests:

```text
Authentication
Ownership
Problem retrieval
Attempt creation
Attempt state transitions
Submission validation
Submission persistence
Duplicate evaluation protection
AI output validation
Gemini fallback
Evaluation failure
Evaluation retrieval
```

Important integration flow:

```text
Create Attempt
      ↓
Submit Solution
      ↓
Persist Submission
      ↓
Run Evaluation
      ↓
Persist Evaluation
      ↓
Retrieve Feedback
```

---

# 28. Code Quality Rules

Prefer:

```text
clear names
small functions
explicit types
simple control flow
centralized validation
clear error handling
```

Avoid:

```text
clever abstractions
deep inheritance
generic utility layers with no purpose
giant controllers
giant React components
duplicated business logic
hardcoded secrets
silent error swallowing
```

Do not optimize prematurely.

---

# 29. Development Order

Unless a phase-specific instruction says otherwise, follow this order:

```text
1. Project setup
2. Configuration
3. Database
4. Authentication
5. Domain models
6. Validation
7. Services
8. Controllers
9. Routes
10. Tests
11. Minimal frontend integration
12. AI integration
13. Final frontend
14. Deployment
```

The exact order can be adjusted when required by dependencies, but functionality should be built from the foundation upward.

---

# 30. Frontend During Backend Development

Until Phase 4, the frontend is a **testing shell**.

Its job is to make manual verification easy.

It can contain:

```text
Login
Problem list
Problem details
Start attempt
Submission form
Submit button
Evaluation status
Basic evaluation output
Attempt history
```

But all of these should remain visually simple.

Example:

```text
<h1>LLD Practice</h1>

<button>Login</button>

<hr />

<h2>Problems</h2>

<button>Start Attempt</button>

<hr />

<h2>Submission</h2>

<textarea />
<button>Submit</button>

<hr />

<h2>Evaluation</h2>

<p>Status: Evaluating...</p>
```

This is enough.

Do not spend engineering time polishing it before Phase 4.

---

# 31. Phase Completion Rule

A phase is complete only when its functionality works end-to-end.

Do not mark a phase complete merely because:

- files exist
- types compile
- routes exist
- UI exists

The functionality must be manually testable.

For every phase, Antigravity should provide:

```text
1. What was implemented
2. Files created/modified
3. Commands to run
4. Environment variables required
5. Tests performed
6. Any remaining issue
```

---

# 32. Antigravity Response Style

After completing an implementation task, keep the response concise.

Use this format:

````text
## Implemented

- ...
- ...
- ...

## Files

- ...
- ...

## Run

```bash
...
````

## Verify

1. ...
2. ...
3. ...

## Notes

- ...

````

Do not write a long essay about implementation unless specifically requested.

---

# 33. Do Not Make Product Decisions Silently

If implementation encounters an architectural decision that materially changes:

- domain model
- API contract
- authentication behavior
- evaluation strategy
- submission format
- state machine
- database relationships

stop and report the decision instead of silently redesigning the system.

Small implementation details can be decided autonomously.

Large product/architecture changes require explicit approval.

---

# 34. Current Priority

The immediate implementation target is:

```text
PHASE 1
Foundation & Project Setup
````

Do not implement the polished frontend.

Do not implement advanced AI evaluation yet.

Do not add unnecessary product features.

Build a clean foundation that the later phases can extend.

---

# 35. Definition of Success

The completed application should eventually allow a learner to:

```text
Sign in
   ↓
Choose an LLD problem
   ↓
Start an attempt
   ↓
Write a structured design
   ↓
Submit it
   ↓
Receive explainable evaluation
   ↓
Review feedback
   ↓
See attempt history
   ↓
Try again
```

The implementation should remain small, understandable, testable, and extensible throughout the process.
