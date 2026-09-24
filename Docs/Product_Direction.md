# Product Direction

## 1. Product Overview

We are building a focused **Low-Level Design (LLD) practice workspace** for students and junior developers preparing for software engineering interviews.

The product is designed around one core problem:

> **Learners can practice an LLD problem, but often cannot reliably evaluate whether their own design is good, what specifically is weak, or what they should improve next.**

The product therefore focuses less on providing answers and more on creating a repeatable **practice → feedback → review → retry** learning loop.

The assignment explicitly asks for a small practice experience rather than a full LMS or large assessment platform. The intended journey is:

**Choose Problem → Think/Design → Submit → Get Feedback → Review → Try Again**

---

## 2. Target User

### Primary User

**Students and junior developers preparing for software engineering interviews.**

They typically:

- Understand basic OOP concepts.
- Know common classes, interfaces, inheritance, composition, etc.
- Can attempt LLD problems.
- Have difficulty judging the quality of their own design.
- May find multiple possible solutions and be unsure which trade-offs matter.
- Need feedback that explains _why_ something could be improved rather than simply receiving a score.

### Not the Primary Target

The MVP is not intended to be:

- A complete software engineering course.
- A general-purpose LMS.
- A professional UML/design collaboration tool.
- A large interview-question platform.
- An automated replacement for human interviewers.

The goal is to solve one learner problem well.

---

## 3. Problem Statement

LLD is relatively easy to start practicing but difficult to evaluate independently.

A learner can be given a problem such as Parking Lot or Vending Machine and produce a design, but several questions remain:

- Are the classes responsible for the right things?
- Are responsibilities unnecessarily coupled?
- Are abstractions actually useful?
- Is the design extensible?
- Does it handle important edge cases?
- Are interfaces being used for meaningful reasons?
- Could the design evolve when requirements change?
- What should the learner improve in their next attempt?

The difficulty is that LLD generally does not have one universally correct implementation.

Therefore, the product should not behave like a traditional answer checker that compares a submission against one expected solution.

Instead, it should evaluate the learner's reasoning against a **structured rubric** and provide evidence-based feedback.

---

## 4. Product Principle

The central product principle is:

> **Don't tell the learner only whether the design is good. Help them understand why, and what to practice next.**

This means feedback should be tied to evidence from the learner's own submission.

For example:

Instead of:

> "Your abstraction is weak. Score: 5/10."

The product should provide something closer to:

> **Abstraction — 5/10**
> Evidence: `PaymentProcessor` directly handles multiple payment types.
> Concern: Adding another payment method would require modifying the existing class.
> Suggestion: Consider separating the payment behaviour behind an interface if the requirement is expected to grow.

The exact feedback will depend on the learner's submission.

---

## 5. Core Practice Loop

The MVP will implement one clear learning loop:

```text
Choose Problem
      ↓
Understand Requirements
      ↓
Design Solution
      ↓
Submit Attempt
      ↓
AI Evaluation
      ↓
Evidence-Based Feedback
      ↓
Review Previous Attempt
      ↓
Try Again
```

The product should make the retry step important rather than treating evaluation as the final destination.

---

## 6. MVP Scope

The MVP will contain:

### 6.1 Curated Problem Set

Approximately **3–5 LLD problems**.

Possible examples:

- Parking Lot
- Vending Machine
- Library Management
- Ride Sharing

Each problem will contain clear requirements and enough context for the learner to produce a meaningful design.

The problem set remains intentionally small so that the product can focus on the quality of the practice and evaluation experience.

---

### 6.2 Structured Design Submission

The learner will submit their design primarily as structured text.

The submission can describe:

- Classes
- Interfaces
- Responsibilities
- Relationships
- Important methods/behaviours
- Design decisions
- Assumptions
- Edge cases
- Trade-offs

A full UML editor is intentionally outside the MVP.

The chosen submission format should provide enough evidence for evaluation without requiring the complexity of building a diagramming product.

---

### 6.3 Evaluation

After submission, the attempt will be evaluated against a fixed rubric.

Potential evaluation dimensions include:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling and Cohesion
4. Encapsulation and Interfaces
5. Abstraction / Design Patterns
6. Extensibility
7. Edge Cases and Testability
8. Explanation and Trade-offs

Each criterion should produce structured feedback rather than only a numerical score.

A feedback item should contain concepts such as:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
```

This gives the learner a clear connection between the evaluation and their own design.

---

### 6.4 Attempt History

The learner should be able to review previous attempts.

History should not merely display a list of submissions.

Where possible, it should help the learner identify recurring weaknesses across attempts.

For example:

```text
Attempt 1
Weakness: Class responsibilities

Attempt 2
Weakness: Coupling

Attempt 3
Weakness: Extensibility
```

This creates a progression-oriented learning experience instead of a collection of isolated AI evaluations.

---

## 7. Evaluation Philosophy

The evaluator should recognize that **multiple LLD solutions can be valid**.

Therefore, the system should not compare a learner's submission against a single "correct architecture."

Evaluation should instead ask:

- Does the design satisfy the stated requirements?
- Are responsibilities reasonably separated?
- Are dependencies sensible?
- Are abstractions justified?
- Can likely requirement changes be accommodated?
- Are important edge cases considered?
- Can the learner explain their decisions?

### Deterministic Checks

Deterministic checks should be used wherever practical.

Examples include:

- Required submission fields.
- Submission structure.
- Attempt state transitions.
- Basic validation.
- Duplicate submission/evaluation protection.
- Future code compilation/tests if code submissions are added.

### AI-Assisted Evaluation

AI should be used primarily for judgment-heavy areas such as:

- Responsibility quality.
- Coupling/cohesion.
- Abstraction choices.
- Trade-offs.
- Extensibility.
- Explanation quality.
- Suggestions for improvement.

The AI should receive a structured problem definition, learner submission, and fixed rubric rather than being asked an unconstrained question such as:

> "Is this a good LLD?"

---

## 8. Evaluation Flow

The submission should be persisted before evaluation begins.

Conceptually:

```text
Draft
  ↓
Submitted
  ↓
Evaluating
  ↓
Completed
```

If evaluation fails:

```text
Evaluating
  ↓
Failed
```

This allows the product to distinguish between:

- A learner successfully submitting an attempt.
- The evaluation process currently running.
- A completed evaluation.
- A temporary evaluation failure.

The learner should not lose their submission simply because AI evaluation is slow or unavailable.

---

## 9. Product Boundaries

The following features are intentionally outside the MVP:

### Not Building

- Full LMS/course system
- Hundreds of LLD questions
- Social/community features
- Leaderboards
- Real-time collaboration
- Full UML/diagram editor
- Generic AI chatbot
- AI-generated "perfect solution" as the primary experience
- Arbitrary 100-point AI scoring
- Human evaluator workflow
- Complex distributed evaluation infrastructure
- Microservices
- Kafka
- Redis
- Kubernetes
- Multi-region infrastructure
- Sharding
- CDN architecture

These may become relevant only if future product requirements justify them.

---

## 10. Product Differentiation

The product is not differentiated simply by "using AI."

The important product decision is **how AI is used**.

The experience should combine:

**Structured practice + fixed evaluation criteria + evidence-based AI feedback + attempt history**

rather than:

**Problem → ChatGPT → generic answer**

The learner should be able to understand:

1. What they designed.
2. What the evaluator observed.
3. Why a specific decision may be problematic.
4. What they could change.
5. Whether the same weakness appears in later attempts.

This makes the product a practice system rather than an AI answer generator.

---

## 11. Product Success Criteria

For the MVP, success means a learner can complete the entire loop without external intervention:

```text
Select an LLD problem
        ↓
Read requirements
        ↓
Create a design
        ↓
Submit it
        ↓
Receive structured feedback
        ↓
Understand specific weaknesses
        ↓
Review the attempt
        ↓
Attempt another solution
```

The most important question is not:

> "How many features does the application have?"

It is:

> **"Does the product help a learner practice LLD and understand how to improve their design?"**

---

## 12. Initial Technical Direction

The MVP will use a simple architecture so engineering effort remains focused on the learner experience and domain design.

### Frontend

- React
- TypeScript
- Vite
- GSAP for restrained interaction/transition animations

### Backend

- Node.js
- Express
- TypeScript

### Database

- MongoDB

### AI

- Gemini as the primary evaluator.
- Groq as a fallback where required.

### Architecture

A simple monolithic application is sufficient for the MVP.

The system should prioritize:

- Clear domain boundaries
- Simple request flow
- Reliable persistence
- Structured evaluation
- Easy local development
- Straightforward deployment

Frameworks or infrastructure should only be introduced when they solve an actual product problem.

---

## 13. Guiding Trade-off

The central engineering trade-off is:

> **Spend complexity on the quality of the learner feedback, not on infrastructure that the MVP does not need.**

A simple monolith with a well-designed evaluation model is preferable to a distributed architecture that adds operational complexity without improving the learner's experience.

The MVP should demonstrate thoughtful domain design, evaluation strategy, extensibility, and engineering judgement through a small working product.

---

## 14. Future Evolution

The initial product should leave room for future submission and evaluation formats without requiring the core practice flow to be rewritten.

Potential future submission types:

```text
Text
  ↓
Code
  ↓
Class Diagram
  ↓
Text + Diagram
  ↓
Full Interview-Style Submission
```

Similarly, the evaluation layer should be capable of evolving from:

```text
AI Evaluator
```

towards:

```text
Rule-Based Checks
+
AI Evaluator
+
Human Review
```

without changing the learner's fundamental practice journey.

The MVP therefore aims to establish a strong core model:

**Problem → Attempt → Submission → Evaluation → Feedback → Retry**

rather than optimizing prematurely for future scale.
