# Authentication & User Lifecycle

## 1. Authentication Strategy

The MVP requires a lightweight authenticated learner identity so that attempts, submissions, evaluations, and history are tied to the correct user.

The authentication layer should remain separate from the LLD domain itself.

```text
Frontend
   ↓
Authentication
   ↓
Authenticated User
   ↓
Practice Domain
```

The backend should never trust a `userId` supplied directly by the client for learner-owned operations.

Instead:

```text
Authentication Token
       ↓
Backend Verification
       ↓
Authenticated User
       ↓
request.user.id
```

The exact authentication provider can be selected during implementation, but the application should expose a provider-independent authenticated user identity to the domain layer.

---

## 2. User Model

The application requires a minimal user record.

```ts
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

The MVP does not require a large learner profile or learning-management system.

User data should contain only information necessary for:

- authentication
- ownership
- displaying the learner identity
- maintaining attempt history

---

## 3. User Lifecycle

The basic lifecycle is:

```text
Unauthenticated
      ↓
Sign Up / Sign In
      ↓
Authenticated
      ↓
Use Practice Platform
      ↓
Create Attempts
      ↓
Submit Solutions
      ↓
Review History
      ↓
Sign Out
      ↓
Unauthenticated
```

Returning users should be able to authenticate again and recover their previous attempts and feedback.

---

## 4. Authentication Boundaries

### Frontend

Responsible for:

- displaying sign-in/sign-up UI
- maintaining authentication state
- attaching authentication credentials to API requests
- redirecting unauthenticated users away from protected application pages
- handling session expiry

### Backend

Responsible for:

- verifying authentication credentials
- resolving the authenticated user
- attaching the user identity to the request context
- protecting learner-owned routes
- enforcing ownership checks

### Domain

The practice domain should receive an authenticated user identity rather than knowing how authentication itself works.

---

## 5. Protected Routes

Public routes may include:

```text
GET /api/problems
GET /api/problems/:id
```

Authenticated routes include:

```text
POST /api/attempts
GET  /api/attempts
GET  /api/attempts/:id
POST /api/attempts/:id/submit
GET  /api/evaluations/:id
```

The backend authentication middleware runs before protected route handlers.

---

## 6. Ownership Model

Learner-owned entities use the authenticated user's identity.

```text
Authenticated User
       ↓
Attempt.userId
       ↓
Submission.attemptId
       ↓
Evaluation.submissionId
```

For example, when requesting an attempt:

```text
GET /api/attempts/:id
        ↓
Find attempt
        ↓
Does attempt.userId === authenticatedUser.id?
        ↓
      yes → return
       no → reject
```

The client cannot access another learner's attempt simply by changing the attempt ID.

---

## 7. Authentication Failure Cases

The API should handle:

### Missing authentication

Return an unauthorized response.

### Invalid/expired credentials

Return an unauthorized response and require the frontend to recover the session.

### Valid authentication but wrong ownership

Return a forbidden/not-found style response without exposing another user's data.

### Signed-out user

Protected frontend pages should redirect to the authentication screen.

---

## 8. User Creation

On first successful registration:

```text
Sign Up
   ↓
Authentication Provider
   ↓
Authenticated Identity
   ↓
Create/Sync User Record
   ↓
Application Dashboard
```

If the authentication provider already contains the user's identity, the application database should create the corresponding user record only when necessary.

Repeated authentication should not create duplicate application users.

---

## 9. User Deletion / Data Lifecycle

Full account deletion is outside the MVP's primary scope.

However, user-owned data should be designed around the user's identity so that a future account deletion workflow can identify:

```text
User
 ├── Attempts
 ├── Submissions
 └── Evaluations
```

No learner data should be stored without an ownership relationship where ownership is relevant.

---

## 10. Updated Domain Model

Authentication introduces `User` at the top of the learner-owned domain:

```text
User
 │
 └──< Attempt
          │
          └── Submission
                  │
                  └── Evaluation
```

Problems remain independent:

```text
Problem
   ↓
Attempt
```

This means the same problem can be practiced by many users while each user's attempts remain isolated.

---

## 11. Updated API Principle

The following is intentionally avoided:

```json
{
  "userId": "some-user-id",
  "problemId": "problem-id"
}
```

for learner-owned creation requests.

Instead:

```json
{
  "problemId": "problem-id"
}
```

The backend obtains the user from the authenticated request context.

This prevents clients from impersonating another user by submitting a different `userId`.

---

## 12. Updated End-to-End Flow

```text
Sign In
   ↓
Authenticated User
   ↓
Problem Selection
   ↓
Create Attempt
   ↓
Attempt.userId = authenticated user
   ↓
Structured Submission
   ↓
Persist Submission
   ↓
Evaluation
   ↓
Feedback
   ↓
History filtered by authenticated user
```

Authentication therefore remains a thin infrastructure layer around the core LLD practice domain rather than becoming part of the evaluation logic.
