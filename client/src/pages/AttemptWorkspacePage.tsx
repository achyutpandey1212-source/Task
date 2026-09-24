import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { evaluationService } from '../services/evaluationService';
import { Attempt, Submission, Evaluation, Problem, SubmitSolutionPayload } from '../types';

export const AttemptWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<SubmitSolutionPayload>({
    requirements: { assumptions: '', constraints: '' },
    design: { classes: '', relationships: '', interfaces: '' },
    reasoning: { decisions: '', patterns: '', tradeoffs: '' },
    edgeCases: '',
  });

  const stopPolling = () => {
    if (pollingRef.current !== null) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (evalId: string) => {
    stopPolling();
    pollingRef.current = window.setInterval(async () => {
      try {
        const ev = await evaluationService.getById(evalId);
        setEvaluation(ev);
        if (ev.status === 'COMPLETED' || ev.status === 'FAILED') {
          stopPolling();
          // Update attempt state to reflect terminal status
          if (id) {
            const data = await attemptService.getById(id);
            setAttempt(data.attempt);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2500);
  };

  const fetchAttemptData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await attemptService.getById(id);
      setAttempt(data.attempt);
      setSubmission(data.submission);
      setEvaluation(data.evaluation);

      if (typeof data.attempt.problemId === 'object' && data.attempt.problemId !== null) {
        setProblem(data.attempt.problemId as Problem);
      }

      // If attempt is EVALUATING or evaluation is PENDING, initiate polling
      if (
        data.evaluation &&
        (data.evaluation.status === 'PENDING' || data.attempt.status === 'EVALUATING')
      ) {
        startPolling(data.evaluation.id);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load attempt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttemptData();
    return () => {
      stopPolling();
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.design.classes.trim()) {
      alert('Please fill out the Classes design section before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const result = await attemptService.submit(id, formData);
      setSuccessMessage('Submission saved successfully. Evaluation initiated.');

      // Start polling with returned evaluationId
      if (result.evaluationId) {
        startPolling(result.evaluationId);
      }

      // Refresh attempt data to reflect submitted / evaluating state
      await fetchAttemptData();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <p>Loading attempt workspace...</p>
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <Link to="/attempts">← Back to My Attempts</Link>
      </div>
    );
  }

  const isDraft = attempt?.status === 'DRAFT';
  const isEvaluating = attempt?.status === 'EVALUATING' || evaluation?.status === 'PENDING';
  const isCompleted = attempt?.status === 'COMPLETED' || evaluation?.status === 'COMPLETED';
  const isFailed = attempt?.status === 'FAILED' || evaluation?.status === 'FAILED';

  const formatCriterionName = (key: string) => {
    return key
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return { border: 'green', color: 'green' };
      case 'EVALUATING':
      case 'PENDING':
        return { border: 'blue', color: 'blue' };
      case 'FAILED':
        return { border: 'red', color: 'red' };
      default:
        return { border: 'orange', color: '#b25900' };
    }
  };

  const statusColors = getStatusBadgeColor(attempt?.status);

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <p>
        <Link to="/attempts">← Back to My Attempts</Link> | <Link to="/problems">All Problems</Link>
      </p>
      <hr />

      {/* Header and status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Attempt: {problem?.title || 'LLD Practice'}</h2>
          <div style={{ fontSize: '13px', color: '#555' }}>
            Started at: {attempt ? new Date(attempt.startedAt).toLocaleString() : ''}
          </div>
        </div>
        <div>
          <span
            style={{
              padding: '6px 12px',
              fontWeight: 'bold',
              border: '2px solid',
              borderColor: statusColors.border,
              color: statusColors.color,
            }}
          >
            STATUS: {attempt?.status}
          </span>
        </div>
      </div>

      {successMessage && (
        <div style={{ margin: '16px 0', padding: '12px', border: '1px solid green', color: 'green' }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{ margin: '16px 0', padding: '12px', border: '1px solid red', color: 'red' }}>
          {error}
        </div>
      )}

      {/* Problem context collapsible banner */}
      {problem && (
        <details style={{ margin: '16px 0', padding: '12px', border: '1px solid #aaa', background: '#f9f9f9' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            [Click to View / Hide Problem Requirements & Context]
          </summary>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Description:</strong> {problem.description}</p>
            <strong>Requirements:</strong>
            <ol>
              {problem.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
            {problem.constraints && problem.constraints.length > 0 && (
              <>
                <strong>Constraints:</strong>
                <ul>
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </details>
      )}

      {/* EVALUATION PROGRESS BANNER */}
      {isEvaluating && (
        <div
          style={{
            margin: '20px 0',
            padding: '16px',
            border: '2px solid blue',
            background: '#f0f4ff',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: 'blue' }}>
            Evaluation in Progress...
          </h3>
          <p style={{ margin: '4px 0' }}>
            Your solution is safely saved in MongoDB. The AI evaluator is assessing your low-level design against the rubric.
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#555' }}>
            Polling updates every 2.5 seconds. Please wait...
          </p>
        </div>
      )}

      {/* EVALUATION FAILED BANNER */}
      {isFailed && (
        <div
          style={{
            margin: '20px 0',
            padding: '16px',
            border: '2px solid red',
            background: '#fff0f0',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: 'red' }}>
            Evaluation Failed
          </h3>
          <p style={{ margin: '4px 0' }}>
            Evaluation could not be completed at this time ({evaluation?.errorMessage || 'AI provider unavailable'}).
          </p>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
            Your submitted solution is completely preserved below.
          </p>
        </div>
      )}

      {/* COMPLETED EVALUATION RESULTS */}
      {isCompleted && evaluation && (
        <div
          style={{
            margin: '20px 0',
            padding: '20px',
            border: '2px solid green',
            background: '#f8fff8',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'green' }}>Structured Feedback</h2>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>
              Overall Score: {evaluation.overallScore ?? 'N/A'} / 10
            </div>
          </div>

          {evaluation.summary && (
            <div style={{ margin: '16px 0', padding: '12px', background: '#fff', border: '1px solid #ddd' }}>
              <strong>Executive Summary:</strong>
              <p style={{ margin: '6px 0 0 0' }}>{evaluation.summary}</p>
            </div>
          )}

          <h3 style={{ marginTop: '24px' }}>Rubric Criteria Analysis (7 Dimensions)</h3>

          {evaluation.criteria.map((c, idx) => (
            <div
              key={idx}
              style={{
                margin: '16px 0',
                padding: '16px',
                border: '1px solid #ccc',
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>
                  {idx + 1}. {formatCriterionName(c.criterion)}
                </h4>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Score: {c.score} / 10
                  <span
                    style={{
                      marginLeft: '12px',
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 'normal',
                    }}
                  >
                    (Confidence: {Math.round(c.confidence * 100)}%)
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <p style={{ margin: '6px 0' }}>
                  <strong>Evidence (from your design):</strong>
                </p>
                <div style={{ background: '#f5f5f5', padding: '8px', borderLeft: '3px solid #666' }}>
                  {c.evidence}
                </div>

                <p style={{ margin: '10px 0 4px 0' }}>
                  <strong>Concern / Gap:</strong>
                </p>
                <div style={{ background: '#fff9e6', padding: '8px', borderLeft: '3px solid #f0ad4e' }}>
                  {c.concern}
                </div>

                <p style={{ margin: '10px 0 4px 0' }}>
                  <strong>Actionable Suggestion:</strong>
                </p>
                <div style={{ background: '#eef9ff', padding: '8px', borderLeft: '3px solid #5bc0de' }}>
                  {c.suggestion}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submitted immutable solution display */}
      {!isDraft && submission && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '16px' }}>
          <h3>Preserved Submitted Solution (Version {submission.version})</h3>
          <p style={{ color: '#666', fontSize: '12px' }}>
            Submitted at: {new Date(submission.createdAt).toLocaleString()}
          </p>

          <section style={{ margin: '16px 0' }}>
            <h4>1. Requirements</h4>
            <p><strong>Assumptions:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.requirements.assumptions || '(none)'}
            </pre>
            <p><strong>Constraints:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.requirements.constraints || '(none)'}
            </pre>
          </section>

          <section style={{ margin: '16px 0' }}>
            <h4>2. Domain Design</h4>
            <p><strong>Classes & Responsibilities:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.design.classes}
            </pre>
            <p><strong>Relationships:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.design.relationships || '(none)'}
            </pre>
            <p><strong>Interfaces / Abstractions:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.design.interfaces || '(none)'}
            </pre>
          </section>

          <section style={{ margin: '16px 0' }}>
            <h4>3. Design Reasoning</h4>
            <p><strong>Decisions:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.reasoning.decisions || '(none)'}
            </pre>
            <p><strong>Patterns:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.reasoning.patterns || '(none)'}
            </pre>
            <p><strong>Trade-offs:</strong></p>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.reasoning.tradeoffs || '(none)'}
            </pre>
          </section>

          <section style={{ margin: '16px 0' }}>
            <h4>4. Edge Cases</h4>
            <pre style={{ background: '#eee', padding: '8px', whiteSpace: 'pre-wrap' }}>
              {submission.edgeCases || '(none)'}
            </pre>
          </section>
        </div>
      )}

      {/* DRAFT attempt: Interactive solution submission form */}
      {isDraft && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <h3>Structured LLD Solution Workspace (Draft)</h3>
          <p style={{ color: '#555', fontSize: '13px' }}>
            Fill in your structured design below and click Submit to start AI evaluation.
          </p>

          <fieldset style={{ margin: '16px 0', padding: '12px' }}>
            <legend><strong>1. Requirements</strong></legend>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Assumptions:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Key assumptions about scale, concurrency, or domain rules..."
                value={formData.requirements.assumptions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, assumptions: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Constraints:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Hardware, latency, memory, or business constraints..."
                value={formData.requirements.constraints}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, constraints: e.target.value },
                  })
                }
              />
            </div>
          </fieldset>

          <fieldset style={{ margin: '16px 0', padding: '12px' }}>
            <legend><strong>2. Domain Design</strong></legend>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Classes & Responsibilities (Required):</label>
              <textarea
                rows={7}
                required
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="List classes, fields, and method signatures..."
                value={formData.design.classes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    design: { ...formData.design, classes: e.target.value },
                  })
                }
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Relationships:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Composition, aggregation, association, inheritance relationships..."
                value={formData.design.relationships}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    design: { ...formData.design, relationships: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Interfaces & Abstractions:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Interfaces and polymorphism used..."
                value={formData.design.interfaces}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    design: { ...formData.design, interfaces: e.target.value },
                  })
                }
              />
            </div>
          </fieldset>

          <fieldset style={{ margin: '16px 0', padding: '12px' }}>
            <legend><strong>3. Design Reasoning</strong></legend>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Key Design Decisions:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Why did you choose this layout or structure?"
                value={formData.reasoning.decisions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reasoning: { ...formData.reasoning, decisions: e.target.value },
                  })
                }
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Design Patterns Used:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="Patterns applied (e.g. Strategy, Factory, Observer) and why..."
                value={formData.reasoning.patterns}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reasoning: { ...formData.reasoning, patterns: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Trade-offs & Alternatives Considered:</label>
              <textarea
                rows={3}
                style={{ width: '100%', fontFamily: 'monospace' }}
                placeholder="What compromises were made and what alternatives were rejected?"
                value={formData.reasoning.tradeoffs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reasoning: { ...formData.reasoning, tradeoffs: e.target.value },
                  })
                }
              />
            </div>
          </fieldset>

          <fieldset style={{ margin: '16px 0', padding: '12px' }}>
            <legend><strong>4. Edge Cases & Concurrency</strong></legend>
            <textarea
              rows={4}
              style={{ width: '100%', fontFamily: 'monospace' }}
              placeholder="Edge cases identified and how the design safely handles them..."
              value={formData.edgeCases}
              onChange={(e) => setFormData({ ...formData, edgeCases: e.target.value })}
            />
          </fieldset>

          <div style={{ marginTop: '20px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Submitting Solution...' : 'Submit Solution'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
