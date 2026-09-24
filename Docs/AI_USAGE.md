# AI Usage

## Overview

AI was used throughout the development of this project as a planning, research, design, implementation, and iteration aid.

The development process was intentionally split into two parts:

- **Human-led product and engineering decisions** — problem understanding, scope, research direction, design decisions, visual direction, validation, and final decisions.
- **AI-assisted execution** — research assistance, architecture discussion, documentation, code implementation, debugging, and repetitive tasks.

I did not treat AI output as automatically correct. Suggestions were discussed, reviewed, modified, tested, or rejected based on the assignment requirements and the actual behavior of the application.

---

## 1. ChatGPT — Problem Understanding, Research & Product Direction

ChatGPT was used first as a thinking and research partner.

Before writing code, I used it to:

- understand the assignment and identify what was actually being asked
- break down the learner problem
- identify the target user
- research the existing problem space and comparable products
- understand common approaches to LLD practice and evaluation
- explore what could make the product meaningfully different
- challenge unnecessary ideas and reduce scope
- discuss what should explicitly **not** be built

A major goal was to avoid turning a small engineering assignment into a large LMS or assessment platform.

The resulting product direction was intentionally narrowed to:

```text
Choose Problem
      ↓
Think / Design
      ↓
Submit
      ↓
Receive Feedback
      ↓
Review
      ↓
Try Again
```

This discussion helped establish the core learner loop before implementation started.

### Why AI was useful here

Instead of immediately coding the first idea, I used ChatGPT to challenge assumptions and explore alternatives before committing to a direction.

The final scope was still a human decision. AI suggestions were treated as input rather than requirements.

---

## 2. ChatGPT — Architecture, LLD & Engineering Planning

After the research phase, ChatGPT was used extensively to discuss the system design and implementation plan.

We worked through:

- domain entities
- class responsibilities
- relationships
- interfaces
- submission formats
- evaluation architecture
- evaluator abstraction
- AI provider abstraction
- evaluation lifecycle
- failure states
- retry behavior
- authentication and user ownership
- database boundaries
- API contracts
- extensibility requirements

The core domain was deliberately kept small:

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

We also explicitly discussed where deterministic application logic should be used instead of AI.

For example:

- authentication → deterministic
- authorization → deterministic
- ownership checks → deterministic
- schema validation → deterministic
- state transitions → deterministic
- submission persistence → deterministic
- LLD quality judgment → AI-assisted

This resulted in a simple modular-monolith architecture rather than introducing unnecessary microservices, queues, event buses, or other infrastructure.

### Documentation as an AI-control mechanism

Before implementation, I created a set of design documents covering the product direction, technical design, architecture, authentication, evaluation rubric, and implementation guidance.

I also created `Antigravity.md`.

The purpose was not only documentation for humans. These documents acted as constraints for the coding agent.

They helped keep implementation aligned with:

- the agreed scope
- the domain model
- the API contracts
- the evaluation rubric
- the intended learner journey

This reduced the chance of the implementation drifting into features that were not required by the assignment.

---

## 3. Antigravity — Phase-by-Phase Implementation

Antigravity was used as the primary coding/implementation agent.

Rather than asking it to build the entire application in one step, implementation was divided into phases.

### Phase 1 — Foundation

Antigravity implemented the initial project foundation:

- React + TypeScript frontend
- Express + TypeScript backend
- MongoDB integration
- authentication
- validation
- error handling
- API foundation
- development configuration

The implementation was then tested before moving forward.

### Phase 2 — Core Learner Journey

Antigravity implemented the core domain and learner flow:

- problems
- attempts
- structured submissions
- ownership checks
- submission validation
- attempt history
- problem browsing
- problem detail
- attempt workspace

The implementation was verified before proceeding to the evaluation layer.

### Phase 3 — Evaluation Engine

Antigravity implemented the evaluation system around the previously defined interfaces and rubric.

The important design decision was to keep the evaluation lifecycle deterministic while using AI only for the judgment-heavy part.

The evaluation flow became:

```text
Submission persisted
       ↓
Evaluation created
       ↓
EVALUATING
       ↓
AI evaluation
       ↓
Structured output validation
       ↓
Evaluation persisted
       ↓
COMPLETED
```

If evaluation fails, the learner's submission is preserved rather than discarded.

The evaluation system also supports:

- provider fallback
- bounded retries
- exponential backoff
- failed evaluation recovery
- retrying the same evaluation/submission
- structured rubric feedback

AI output is validated before being persisted rather than being trusted blindly.

---

## 4. ChatGPT + Human Design Direction — Frontend

For the frontend, I relied heavily on my own visual/design intuition and used visual references to decide what could suit the product.

The goal was not to make it look like a generic AI SaaS dashboard.

I explored a visual direction combining:

- engineering notebook
- editorial layout
- classroom/workbook elements
- graph paper
- physical paper surfaces
- handwritten annotations
- structured technical diagrams

I discussed these references and design decisions with ChatGPT, then turned the direction into reusable design concepts and implementation guidance.

The frontend was then divided into smaller pieces instead of attempting to generate the entire interface at once.

Pages and experiences were built iteratively, including:

- landing page
- how-it-works
- problem catalogue
- problem detail
- attempt workspace
- evaluation report
- attempt history
- authentication pages
- settings
- error/empty/loading states

This page-by-page approach made it easier to review each part of the experience and keep the visual language consistent.

The final visual decisions remained human-directed. AI was used to help explore, structure, and implement the ideas rather than deciding the product's visual identity independently.

---

## 5. AI-Assisted Reliability & Iteration

AI was also used during debugging and refinement.

One important example was the evaluation failure path.

During testing, an AI provider failure initially exposed a raw provider error to the learner and the retry action created a fresh attempt. That was identified as a poor learner experience.

The design was then changed so that:

```text
Evaluation fails
      ↓
Submission remains preserved
      ↓
Learner sees a safe failure state
      ↓
Try Evaluation Again
      ↓
Same submission / same attempt
```

while:

```text
Start a New Attempt
```

remains a separate action for intentionally starting over.

The evaluation service was also hardened with bounded retries and exponential backoff for transient provider failures.

This was an example where AI-assisted debugging was combined with human product judgment: the technical failure was one issue, but the more important decision was determining what the learner should experience when it happened.

---

## 6. AI Model & Provider Decisions

The application uses AI specifically for LLD evaluation rather than for deterministic application logic.

The evaluation layer was designed around an `AIProvider` abstraction so that the application is not tightly coupled to a single model provider.

The intended provider flow uses Gemini as the primary provider with fallback models/providers when capacity or transient failures occur.

The evaluation output is required to be structured and is validated before it reaches the database.

The evaluator produces rubric-oriented feedback including:

- score
- evidence from the submission
- architectural concern
- actionable suggestion
- confidence

The goal was to make the AI feedback explainable and grounded in the learner's actual submission rather than producing generic encouragement.

---

## 7. Kilo Code — Commit Messages

Kilo Code was used for generating Git commit message suggestions.

This was a small productivity use rather than a core architectural or implementation dependency.

The final commit history and changes were still reviewed as part of the development process.

---

## 8. Deployment

Deployment itself was kept intentionally simple.

The backend was deployed to **Render** and the frontend to **Vercel**.

AI assistance was used mainly for configuration/checking during the development process; the deployment architecture itself remained straightforward and did not require additional infrastructure.

The deployed application was then tested end-to-end.

---

## 9. What AI Did Not Decide

AI was not given unrestricted authority over the project.

The following decisions remained human-controlled:

- what problem the product should solve
- target learner
- final product scope
- what features to exclude
- domain boundaries
- acceptance of architectural suggestions
- visual/design direction
- whether an implementation actually satisfied the assignment
- testing and verification
- whether feedback or suggestions made sense for the learner

The role of AI was primarily to increase the speed and breadth of exploration and implementation while keeping the final product decisions under human control.

---

## Summary

The overall workflow was:

```text
                    HUMAN DIRECTION
                          │
                          ▼
             Problem Understanding
                          │
                          ▼
             ChatGPT Research & Discussion
                          │
                          ▼
              Product / Scope Decisions
                          │
                          ▼
            Architecture & Design Documents
                          │
                          ▼
                   Antigravity
              Phase-by-Phase Implementation
                          │
                          ▼
             Human Review + Testing
                          │
                          ▼
              ChatGPT Design Iteration
                          │
                          ▼
             Frontend Implementation
                          │
                          ▼
                Deployment + E2E Test
```

AI was therefore used as a **research partner, design/architecture discussion partner, coding agent, debugging assistant, and productivity tool**, while the product direction, scope, design judgment, validation, and final engineering decisions remained human-led.
