# Design Note — LLD Practice & Feedback Platform

## 1. Product Goal

The product is a focused practice experience for learners who want to improve at Low-Level Design (LLD).

The core problem is not simply providing LLD questions. A learner can usually find design problems to solve, but it is harder to understand whether their design has appropriate responsibilities, abstractions, relationships, trade-offs, and extensibility.

The product therefore focuses on a short learning loop:

**Choose a problem → Design → Submit → Receive feedback → Review → Try again**

The MVP is intentionally limited to this practice and feedback loop rather than becoming a full LMS or large assessment platform.

---

## 2. Target Learner

The primary user is a learner practicing object-oriented and domain-level design, such as a student or developer preparing for LLD interviews or improving their software design skills.

The learner should be able to:

- understand the problem and its requirements
- record assumptions and constraints
- design classes and their responsibilities
- describe relationships and interfaces
- explain important design decisions and trade-offs
- submit the solution
- receive structured, explainable feedback
- review previous attempts and improve through iteration

---

## 3. MVP Scope

The MVP contains:

1. A small set of LLD problems
2. A problem detail page containing requirements and context
3. An attempt-based practice flow
4. A structured text submission workspace
5. Submission and evaluation status
6. Structured feedback across important LLD criteria
7. Attempt history
8. The ability to review feedback and try the problem again

The MVP does **not** attempt to provide:

- a complete LMS
- complex HLD/system-design exercises
- microservices or distributed evaluation infrastructure
- collaborative editing
- sophisticated diagram editing
- production-grade automated code execution
- a large question bank

The assignment specifically emphasizes LLD concepts such as classes, objects, responsibilities, interfaces, behavior, relationships, patterns, extensibility, and code-level decisions. The product therefore keeps its center of gravity on domain design rather than infrastructure architecture.

---

## 4. User Flow

```text
Browse Problems
      ↓
Select Problem
      ↓
Read Requirements & Context
      ↓
Start Attempt
      ↓
Design Solution
      ↓
Save Draft
      ↓
Submit
      ↓
Evaluation
      ↓
Review Feedback
      ↓
View Attempt History
      ↓
Try Again
```

The learner's submission is stored before evaluation begins. This means a slow or failed evaluation does not destroy the learner's work.

---

## 5. Submission Model

The MVP uses a **structured text submission** rather than a single large text box.

A submission contains four main sections:

### Requirements

- assumptions
- constraints

### Domain Design

- classes
- responsibilities
- relationships
- interfaces

### Design Reasoning

- important design decisions
- patterns used
- trade-offs

### Edge Cases

- important scenarios
- how the design handles them

This format was selected because it provides explicit evidence for the major LLD dimensions while remaining fast for a learner to complete.

It also avoids making the evaluation dependent on interpreting an unstructured wall of text.

The domain model keeps the submission separate from the attempt itself so that additional submission formats can be introduced later without changing the core practice flow.

Possible future formats include:

```text
Structured Text
Diagram
Code
Combined
```

These are intentionally not part of the MVP.

---

## 6. Domain Model

The core domain is:

```text
Problem
   ↓
Attempt
   ↓
Submission
   ↓
Evaluation
   ↓
Feedback
```

### Problem

Represents an LLD exercise.

Responsibilities:

- provide the problem description
- define requirements
- define constraints/context
- provide difficulty information

A `Problem` does not evaluate learner submissions.

### Attempt

Represents one learner's practice lifecycle for a problem.

Responsibilities:

- associate the learner with a problem
- track attempt state
- reference the submitted solution
- record submission/evaluation lifecycle timestamps

Attempt states are:

```text
DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ↓
COMPLETED
```

A failed evaluation can move the attempt to:

```text
FAILED
```

The distinction between `Attempt` and `Submission` is intentional. An attempt represents the practice lifecycle, while a submission represents the learner's actual design evidence.

### Submission

Represents the learner's solution.

Responsibilities:

- store the structured design
- preserve the learner's reasoning
- preserve edge cases and assumptions
- identify the submission version

### Evaluation

Represents the result produced by an evaluator.

Responsibilities:

- track evaluation status
- contain criterion-level results
- preserve evidence and concerns
- provide actionable suggestions
- record overall evaluation information

---

## 7. Evaluation Approach

The evaluation should not be a single unconstrained LLM question such as:

> "Is this LLD design good?"

Instead, evaluation is based on a fixed rubric.

Each criterion produces structured feedback:

```text
Criterion
→ Score
→ Evidence
→ Concern
→ Suggestion
→ Confidence
```

The initial evaluation dimensions are:

1. Requirement understanding
2. Class responsibilities
3. Coupling and cohesion
4. Abstraction and interfaces
5. Extensibility
6. Edge cases and testability
7. Design reasoning

The goal is not merely to produce a number. The important output is **evidence-based feedback that helps the learner understand what to improve**.

---

## 8. Deterministic vs AI Evaluation

The system separates checks that can be handled deterministically from checks that require design judgment.

### Deterministic checks

Examples include:

- required submission sections are present
- required fields contain valid data
- submission state transitions are valid
- duplicate submission/evaluation processing is avoided
- submitted work is stored before evaluation

### AI-assisted evaluation

AI is used where interpretation and design judgment are required:

- assessing class responsibilities
- identifying excessive coupling or weak cohesion
- evaluating abstraction and interface choices
- examining extensibility
- interpreting design trade-offs
- identifying important omissions
- suggesting concrete improvements

This keeps AI focused on the part of the problem where it provides the most value rather than using an LLM for basic application rules.

---

## 9. Evaluation Architecture

The evaluation layer is designed around an `Evaluator` interface.

```text
Evaluator
   ├── AIEvaluator
   │      ├── GeminiEvaluator
   │      └── GroqEvaluator
   │
   └── FutureRuleBasedEvaluator
```

The MVP primarily uses an AI evaluator.

The evaluator itself depends on an AI provider abstraction:

```text
AIProvider
   ├── GeminiProvider
   └── GroqProvider
```

Gemini is the primary provider and Groq can act as a fallback when the primary provider is unavailable.

This separation means the practice flow does not need to know which AI provider performs the evaluation.

---

## 10. Evaluation Lifecycle

Evaluation is asynchronous from the learner's perspective.

```text
Submit
  ↓
Store Submission
  ↓
SUBMITTED
  ↓
Start Evaluation
  ↓
EVALUATING
  ↓
COMPLETED
  ↓
Display Feedback
```

If evaluation fails:

```text
EVALUATING
     ↓
   FAILED
```

The submitted solution remains stored.

The learner should therefore never lose their work simply because an external AI service is slow or unavailable.

This also avoids blocking the main submission request on an unpredictable AI response.

---

## 11. Attempt History

Each completed attempt remains available to the learner.

History allows the learner to compare iterations and see whether repeated practice is addressing earlier weaknesses.

The history model is intentionally simple:

```text
Problem
 ├── Attempt 1
 │     └── Evaluation
 │
 ├── Attempt 2
 │     └── Evaluation
 │
 └── Attempt 3
       └── Evaluation
```

The product does not attempt to build a complex learning analytics system in the MVP.

---

## 12. Important Interfaces

Only a small number of abstractions are introduced deliberately.

### Evaluator

```ts
interface Evaluator {
  evaluate(problem: Problem, submission: Submission): Promise<Evaluation>;
}
```

This creates a variation point for future evaluation strategies.

### AIProvider

```ts
interface AIProvider {
  generateEvaluation(context: EvaluationContext): Promise<AIResponse>;
}
```

This keeps the application independent from a specific AI provider.

The design avoids introducing abstractions merely for the sake of demonstrating design patterns.

---

## 13. Extensibility

Two future changes were considered during the design.

### Change A — New submission format

The MVP starts with structured text.

If a diagram submission is introduced later, the core relationship remains:

```text
Problem → Attempt → Submission → Evaluation
```

Only the submission representation and relevant evaluation handling need to expand.

The practice lifecycle does not need to be rewritten.

### Change B — New evaluator

The MVP uses AI-based evaluation.

A future rule-based evaluator or human-review workflow can be introduced behind the `Evaluator` boundary without changing the learner's practice flow.

These variation points are designed now, but the future features themselves are intentionally not implemented in the MVP.

---

## 14. Key Trade-offs

### Structured text instead of code

**Chosen:** structured text.

**Reason:** it gives enough evidence to evaluate LLD reasoning and domain design while keeping the MVP implementable within the assignment timeframe.

### AI evaluation instead of fully deterministic evaluation

**Chosen:** AI-assisted evaluation with a fixed rubric.

**Reason:** many important LLD qualities involve judgment rather than simple rule checking.

The trade-off is that AI feedback can be imperfect, so the product uses structured evaluation criteria, evidence, and confidence rather than treating the model's output as absolute truth.

### Simple application instead of distributed architecture

**Chosen:** a straightforward web application with a clear backend domain model.

**Reason:** the assignment is primarily about LLD and learner feedback. Adding microservices, queues, Kubernetes, or other infrastructure would increase complexity without improving the core learning experience.

### Asynchronous evaluation instead of blocking submission

**Chosen:** store first, evaluate afterwards.

**Reason:** AI latency or provider failure should not prevent the learner from successfully submitting their work.

---

## 15. MVP Success Criteria

The prototype is successful if a learner can complete the following journey end-to-end:

```text
Choose an LLD problem
        ↓
Understand its requirements
        ↓
Create a structured design
        ↓
Submit it
        ↓
See evaluation progress
        ↓
Receive criterion-level feedback
        ↓
Understand what needs improvement
        ↓
Review the attempt later
        ↓
Try again
```

The primary product value is therefore not the number of features or the complexity of the AI system.

It is the quality of the **practice → feedback → improvement loop**.

---

## 16. Out of Scope

For the MVP, the following remain intentionally out of scope:

- large-scale question management
- HLD/system-design problems
- collaborative editing
- real-time multiplayer practice
- full code execution/sandboxing
- advanced diagram editors
- sophisticated learner analytics
- complex distributed infrastructure
- multiple independent AI agents
- elaborate evaluation pipelines

The prototype should demonstrate a focused, reliable learner journey rather than a production-scale platform.
