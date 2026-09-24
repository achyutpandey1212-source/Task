# Evaluation Rubric — LLD Practice & Feedback Platform

## 1. Purpose

The evaluation system exists to help a learner understand the quality of their LLD solution and identify concrete areas for improvement.

The evaluator should not attempt to determine whether a submission matches one "correct" design.

Multiple valid designs can solve the same problem.

The evaluation should therefore consider:

- the given requirements
- the learner's stated assumptions
- responsibilities
- relationships
- abstractions
- design reasoning
- extensibility
- edge cases

The output should prioritize **explainable feedback over a single score**.

---

# 2. Evaluation Structure

Every evaluation produces:

```text
Criterion
    ↓
Score
    ↓
Evidence
    ↓
Concern
    ↓
Suggestion
    ↓
Confidence
```

Example:

```json
{
  "criterion": "responsibilities",
  "score": 7,
  "evidence": "Order currently handles payment processing as well as order state.",
  "concern": "These responsibilities may become difficult to change independently.",
  "suggestion": "Consider separating payment behavior from order lifecycle management.",
  "confidence": 0.84
}
```

The evidence must refer to the learner's actual submission rather than making generic observations.

---

# 3. Scoring Scale

Each criterion is scored from **0 to 10**.

| Score | Meaning                               |
| ----: | ------------------------------------- |
|   0–2 | Missing or fundamentally problematic  |
|   3–4 | Major weaknesses                      |
|   5–6 | Partially satisfactory                |
|   7–8 | Solid with some improvements possible |
|  9–10 | Strong and well justified             |

Scores are signals, not the primary learning output.

A high score without evidence is not useful feedback.

---

# 4. Evaluation Criteria

## 4.1 Requirement Understanding

### Question

Does the proposed design address the actual requirements of the problem?

### Evaluate

- important requirements are recognized
- assumptions are explicit
- constraints are considered
- important behavior is not ignored
- design decisions connect back to requirements

### Weak evidence

```text
"The design looks incomplete."
```

### Useful evidence

```text
"The solution models creating and cancelling an order but does not describe
how an order moves between its required lifecycle states."
```

### Feedback should help the learner

Understand what requirement or assumption is missing and how it affects the design.

---

## 4.2 Class Responsibilities

### Question

Are responsibilities assigned to appropriate classes or objects?

### Evaluate

- classes have clear responsibilities
- responsibilities are related to the class's purpose
- classes do not become "god objects"
- behavior is located where it logically belongs
- responsibilities can change independently where appropriate

### Common concerns

- one class doing too many unrelated things
- data-only classes where meaningful behavior belongs
- business logic placed in inappropriate objects
- duplicated responsibilities

### Feedback should identify

The specific responsibility that appears misplaced or overloaded.

---

## 4.3 Coupling and Cohesion

### Question

Are relationships between components reasonable?

### Evaluate

- unnecessary dependencies
- tightly coupled components
- focused class responsibilities
- dependency direction
- excessive knowledge between classes

A design should not be penalized simply for having relationships.

The evaluator should distinguish between **necessary domain relationships** and **unnecessary coupling**.

### Useful feedback

Instead of:

```text
"Coupling is high."
```

Prefer:

```text
"Checkout directly depends on three concrete payment implementations,
making payment behavior harder to change independently."
```

---

## 4.4 Abstraction and Interfaces

### Question

Are abstractions and interfaces used appropriately?

### Evaluate

- interfaces have meaningful purpose
- abstractions represent actual variation
- concrete implementation details are isolated where useful
- unnecessary abstractions are avoided
- the abstraction improves flexibility or testability

The evaluator should **not** reward a learner simply for using more interfaces.

An abstraction without a clear reason can itself be a design concern.

### Important principle

**More abstraction ≠ better design.**

The evaluation should focus on whether the abstraction solves a real problem.

---

## 4.5 Extensibility

### Question

How well can the design accommodate reasonable future changes?

The evaluator should consider likely changes implied by the problem rather than hypothetical changes that have nothing to do with it.

Examples:

```text
New payment method
New notification channel
New pricing rule
New vehicle type
New user role
```

### Evaluate

- whether likely changes require modifying unrelated classes
- whether responsibilities are isolated appropriately
- whether abstractions are introduced where they actually help
- whether the design avoids unnecessary rigidity

The evaluator should not demand that every possible future change be anticipated.

---

## 4.6 Edge Cases and Testability

### Question

Does the learner consider important behavior outside the happy path?

### Evaluate

- invalid states
- failure scenarios
- boundary conditions
- important business rules
- behavior that should be testable

Examples:

```text
Payment failure
Duplicate request
Invalid state transition
Unavailable resource
Empty collection
Concurrent operation
```

Only relevant edge cases should influence the evaluation.

The learner should not be penalized for failing to list arbitrary edge cases unrelated to the problem.

---

## 4.7 Design Reasoning

### Question

Can the learner explain why they made important design decisions?

### Evaluate

- assumptions
- trade-offs
- pattern selection
- abstraction decisions
- rejected alternatives
- reasoning connected to requirements

The evaluator should distinguish between:

```text
"I used Factory Pattern."
```

and:

```text
"I used a factory because the system creates several payment
implementations and the creation logic would otherwise leak into
the checkout workflow."
```

The second demonstrates actual design reasoning.

---

# 5. Evidence-Based Evaluation

Every concern should be grounded in the submission.

The evaluator should prefer:

```text
Observation
    ↓
Evidence
    ↓
Impact
    ↓
Suggestion
```

Example:

```text
Observation:
Order handles payment processing.

Evidence:
The submission places processPayment() inside Order.

Impact:
Changing payment behavior would require modifying Order.

Suggestion:
Consider separating payment behavior behind an appropriate boundary.
```

Avoid generic statements such as:

- "Use SOLID principles."
- "Improve your architecture."
- "Use design patterns."
- "Follow best practices."

unless the evaluator explains **what specifically should change and why**.

---

# 6. Multiple Valid Designs

The evaluator must not compare a learner's submission against one predefined class diagram.

For the same problem:

```text
Design A
Design B
Design C
```

may all be valid.

The evaluator should instead ask:

```text
Does the design satisfy the requirements?
Are responsibilities coherent?
Are relationships reasonable?
Are abstractions justified?
Are trade-offs understood?
Can relevant changes be handled?
```

A different design should not automatically be treated as an incorrect design.

---

# 7. Deterministic Checks

Some checks do not require AI judgment.

These should be handled by the application where possible.

### Submission structure

- required sections exist
- required fields have valid types
- submission belongs to the attempt

### State management

- valid attempt transitions
- valid evaluation states
- duplicate processing protection

### Data integrity

- learner owns the attempt
- submission exists before evaluation
- evaluation references a valid submission

The AI should not be asked to make these decisions.

---

# 8. AI Evaluation Responsibilities

AI is used for judgment-heavy tasks.

The evaluator can assess:

```text
Requirement interpretation
        ↓
Responsibilities
        ↓
Coupling / cohesion
        ↓
Abstractions
        ↓
Extensibility
        ↓
Edge cases
        ↓
Design reasoning
```

The AI should receive the original problem alongside the learner's submission so that feedback is grounded in the actual requirements.

---

# 9. Confidence

Each criterion includes a confidence value between `0` and `1`.

```text
0.0 → very uncertain
0.5 → moderate confidence
1.0 → very confident
```

Confidence is useful because some design judgments are inherently ambiguous.

For example:

```text
High confidence:
"The submission contains no explanation of payment failure handling."

Lower confidence:
"The separation between Order and PaymentService may create unnecessary coupling."
```

The system should expose confidence as supporting information rather than pretending every AI judgment is objectively correct.

---

# 10. Overall Score

An overall score may be calculated from the criterion scores, but it is secondary to the detailed feedback.

Conceptually:

```text
Overall Score
      ↓
Summary signal

Criterion Scores
      ↓
Actual learning feedback
```

The product should never rely solely on the overall score to communicate performance.

The learner should be able to answer:

> "What did I do well, what is weak, and what should I change?"

after reading the evaluation.

---

# 11. Feedback Format

The final evaluation should contain:

```text
Summary
    ↓
Criterion Results
    ↓
Strengths
    ↓
Priority Improvements
```

A criterion result follows:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
```

Example:

```text
Responsibilities — 6/10

Evidence:
Checkout is responsible for validating orders, calculating prices,
processing payment, and sending notifications.

Concern:
Several responsibilities may change independently, making Checkout
difficult to maintain.

Suggestion:
Consider separating payment and notification behavior from the
checkout workflow while keeping orchestration in Checkout.
```

---

# 12. Priority of Feedback

Not every observation deserves equal attention.

Feedback should prioritize:

1. Requirement-level problems
2. Incorrect or overloaded responsibilities
3. Significant coupling/cohesion issues
4. Missing or inappropriate abstractions
5. Important extensibility concerns
6. Edge cases
7. Smaller improvements

The learner should leave the evaluation knowing the **few changes that would most improve the design**, rather than receiving a long list of minor comments.

---

# 13. Evaluation Output Contract

The backend expects structured output matching the application's schema.

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

The complete evaluation conceptually contains:

```ts
interface Evaluation {
  summary: string;
  overallScore: number;
  criteria: EvaluationCriterion[];
}
```

The backend validates the AI response before storing it.

---

# 14. Evaluation Guardrails

The evaluator should follow these rules:

### Do

- evaluate against the given requirements
- cite evidence from the submission
- acknowledge reasonable alternative designs
- explain concerns
- provide actionable suggestions
- distinguish uncertainty using confidence
- focus on meaningful design decisions

### Do not

- demand one specific architecture
- reward unnecessary design patterns
- penalize different but valid designs
- invent requirements
- give unexplained scores
- provide generic SOLID advice without evidence
- use AI confidence as proof that a judgment is correct

---

# 15. Example Evaluation

For a hypothetical parking-lot design:

```text
Overall: 7.4/10

Summary:
The design covers the primary parking and vehicle allocation flow
and has clear domain objects. The main weakness is that pricing
logic is tightly coupled to the parking workflow.

Responsibilities — 8/10
Evidence:
ParkingLot coordinates spot allocation while Spot manages occupancy.

Concern:
The responsibilities are mostly well separated.

Suggestion:
Keep allocation behavior within the parking domain and avoid moving
pricing rules into ParkingLot.

Confidence: 0.91


Abstraction & Interfaces — 6/10
Evidence:
Pricing logic is implemented directly inside ParkingLot.

Concern:
Introducing another pricing strategy would require modifying the
existing workflow.

Suggestion:
Consider isolating pricing behavior if multiple pricing strategies
are actually required by the problem.

Confidence: 0.78
```

Notice that the evaluator does **not** automatically recommend an abstraction simply because one could exist.

---

# 16. Rubric Design Principle

The evaluation system should answer three questions for every learner:

### What is working?

Identify concrete strengths.

### What is weak?

Identify evidence-backed design concerns.

### What should I do next?

Provide specific, practical improvements.

The purpose of the rubric is therefore not to simulate an interviewer giving a score.

It is to create a useful **feedback loop for deliberate LLD practice**.

---

# 17. Final Evaluation Flow

```text
Problem Requirements
        ↓
Learner Submission
        ↓
Deterministic Validation
        ↓
AI Evaluation
        ↓
Fixed Rubric
        ↓
Criterion-Level Analysis
        ↓
Evidence + Concern + Suggestion
        ↓
Confidence
        ↓
Structured Evaluation
        ↓
Learner Feedback
        ↓
Next Attempt
```

The evaluation system is successful when the learner can use the feedback to make a meaningfully better design on their next attempt.
