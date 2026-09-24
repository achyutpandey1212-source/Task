import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { evaluationService } from '../services/evaluationService';
import { Attempt, Submission, Evaluation, Problem, SubmitSolutionPayload } from '../types';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { PushPin } from '../components/landing/TactileAccents';
import { DesignCanvasWIP } from '../components/attempts/DesignCanvasWIP';
import { EvaluationReport } from '../components/evaluations/EvaluationReport';
import { SketchUnderline } from '../components/landing/HandDrawnDoodles';

export const AttemptWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  // Form state for structured-text submission
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

      // If evaluating or pending, continue polling
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
      alert('Please define your classes and roles in the Design section before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const result = await attemptService.submit(id, formData);
      setSuccessMessage('Design submitted successfully. Evaluation engine engaged.');

      if (result.evaluationId) {
        startPolling(result.evaluationId);
      }

      await fetchAttemptData();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewAttempt = async () => {
    if (!problem) return;
    try {
      const newAtt = await attemptService.create(problem.id);
      navigate(`/attempts/${newAtt.id}`);
    } catch (err: any) {
      alert('Failed to initialize new attempt: ' + (err.message || 'Error'));
    }
  };

  const isDraft = attempt?.status === 'DRAFT';
  const isEvaluating = attempt?.status === 'EVALUATING' || evaluation?.status === 'PENDING';
  const isCompleted = attempt?.status === 'COMPLETED' || evaluation?.status === 'COMPLETED';
  const isFailed = attempt?.status === 'FAILED' || evaluation?.status === 'FAILED';

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#bbf7d0', text: '#14532d', label: 'EVALUATION COMPLETED' };
      case 'EVALUATING':
      case 'PENDING':
        return { bg: '#FEDE8C', text: '#000000', label: 'EVALUATION IN PROGRESS' };
      case 'FAILED':
        return { bg: '#fecaca', text: '#7f1d1d', label: 'EVALUATION FAILED' };
      case 'SUBMITTED':
        return { bg: '#D5BDFF', text: '#000000', label: 'SUBMISSION PERSISTED' };
      default:
        return { bg: '#FFFFFF', text: '#000000', label: 'WORKSPACE DRAFT' };
    }
  };

  const badge = statusBadge(attempt?.status);

  return (
    <div
      className="bg-graph-paper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#000000',
        overflowX: 'hidden',
      }}
    >
      <LandingNavbar activePage="attempts" />

      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '36px 24px 80px',
          }}
        >
          {/* Top Breadcrumbs & Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700 }}>
              <Link to="/attempts">← MY ATTEMPTS</Link>
              {problem && <Link to={`/problems/${problem.id}`}>VIEW CASE SPECIFICATION</Link>}
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 900,
                backgroundColor: badge.bg,
                color: badge.text,
                padding: '4px 12px',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000',
              }}
            >
              STATUS: {badge.label}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ maxWidth: '640px', margin: '48px auto', textAlign: 'center' }}>
              <TornPaper
                color="lavender"
                rotation={-0.4}
                tornEdges="both"
                style={{ padding: '40px 28px', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000' }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '17px', fontWeight: 800 }}>
                  SETTING UP YOUR WORKSPACE...
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#333333' }}>
                  Loading attempt state and submission record.
                </p>
              </TornPaper>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '2px solid #dc2626',
                color: '#991b1b',
                padding: '12px 18px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                marginBottom: '24px',
                boxShadow: '3px 3px 0px #dc2626',
              }}
            >
              <strong>ERROR:</strong> {error}
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '2px solid #16a34a',
                color: '#166534',
                padding: '12px 18px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                marginBottom: '24px',
                boxShadow: '3px 3px 0px #16a34a',
              }}
            >
              <strong>SUCCESS:</strong> {successMessage}
            </div>
          )}

          {!loading && attempt && (
            <div>
              {/* Workspace Header */}
              <div
                style={{
                  borderBottom: '2px solid #000000',
                  paddingBottom: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  ENGINEERING WORKSPACE
                </div>
                <h1
                  style={{
                    fontSize: 'clamp(28px, 4vw, 42px)',
                    fontWeight: 900,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {problem?.title || 'LLD System Attempt'}
                </h1>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555555', marginTop: '6px' }}>
                  Started: {new Date(attempt.startedAt).toLocaleString()}
                  {attempt.submittedAt && ` | Submitted: ${new Date(attempt.submittedAt).toLocaleString()}`}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* EVALUATING PROGRESS BANNER                                                */}
              {/* ========================================================================= */}
              {isEvaluating && (
                <div
                  style={{
                    backgroundColor: '#FEDE8C',
                    border: '2px solid #000000',
                    padding: '28px',
                    boxShadow: '4px 4px 0px #000000',
                    marginBottom: '36px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '18px',
                      fontWeight: 900,
                      color: '#000000',
                      marginBottom: '8px',
                    }}
                  >
                    REVIEWING YOUR DESIGN...
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#222222', maxWidth: '600px', marginInline: 'auto' }}>
                    The evaluation engine is examining your assumptions, class responsibilities, interfaces, and trade-offs against the rubric. This page will update automatically.
                  </p>
                  <div style={{ marginTop: '16px' }}>
                    <SketchUnderline width={140} style={{ margin: '0 auto' }} />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* COMPLETED EVALUATION REPORT                                               */}
              {/* ========================================================================= */}
              {isCompleted && evaluation && (
                <div style={{ marginBottom: '48px' }}>
                  <EvaluationReport
                    evaluation={evaluation}
                    problemTitle={problem?.title}
                    attemptStartedAt={attempt.startedAt}
                    attemptCompletedAt={attempt.completedAt || undefined}
                    onRetry={handleStartNewAttempt}
                  />
                </div>
              )}

              {/* ========================================================================= */}
              {/* FAILED EVALUATION NOTICE                                                  */}
              {/* ========================================================================= */}
              {isFailed && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '2px solid #b91c1c',
                    padding: '28px',
                    boxShadow: '4px 4px 0px #b91c1c',
                    marginBottom: '36px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '16px',
                      fontWeight: 900,
                      color: '#991b1b',
                      marginBottom: '8px',
                    }}
                  >
                    THE REVIEW COULD NOT BE COMPLETED
                  </div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#333333' }}>
                    {evaluation?.errorMessage ||
                      'The AI evaluation providers were temporarily unavailable. Your submitted design is preserved in the database.'}
                  </p>
                  <button
                    onClick={handleStartNewAttempt}
                    style={{
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      border: '2px solid #000000',
                      padding: '8px 18px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    START A NEW ATTEMPT →
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* PRESERVED SUBMISSION (When not in Draft)                                  */}
              {/* ========================================================================= */}
              {!isDraft && submission && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000000',
                    padding: '32px 28px',
                    boxShadow: '4px 4px 0px #000000',
                    borderRadius: '2px',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 800,
                      backgroundColor: '#FEDE8C',
                      padding: '2px 8px',
                      display: 'inline-block',
                      marginBottom: '8px',
                      border: '1px solid #000000',
                    }}
                  >
                    PRESERVED SUBMISSION RECORD (VERSION {submission.version})
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px 0' }}>
                    Your Submitted Architecture
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Assumptions & Constraints */}
                    <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #000000', padding: '16px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                        1. REQUIREMENTS SCOPE
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Assumptions:</strong> {submission.requirements.assumptions || '(none)'}
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <strong>Constraints:</strong> {submission.requirements.constraints || '(none)'}
                      </div>
                    </div>

                    {/* Classes, Relations, Interfaces */}
                    <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #000000', padding: '16px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                        2. DOMAIN CONTRACTS
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Classes:</strong> {submission.design.classes}
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Relationships:</strong> {submission.design.relationships || '(none)'}
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <strong>Interfaces:</strong> {submission.design.interfaces || '(none)'}
                      </div>
                    </div>

                    {/* Reasoning & Trade-offs */}
                    <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #000000', padding: '16px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                        3. REASONING & TRADE-OFFS
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Decisions:</strong> {submission.reasoning.decisions || '(none)'}
                      </div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <strong>Patterns:</strong> {submission.reasoning.patterns || '(none)'}
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        <strong>Trade-offs:</strong> {submission.reasoning.tradeoffs || '(none)'}
                      </div>
                    </div>

                    {/* Edge Cases */}
                    <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #000000', padding: '16px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
                        4. EDGE CASES & TESTABILITY
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        {submission.edgeCases || '(none)'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* DRAFT WORKSPACE (Interactive Design Canvas + Structured Specification)     */}
              {/* ========================================================================= */}
              {isDraft && (
                <div>
                  {/* Visual Design Canvas — Work in Progress */}
                  <DesignCanvasWIP />

                  {/* Submission Form */}
                  <form onSubmit={handleSubmit}>
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000000',
                        padding: '32px 28px',
                        boxShadow: '6px 6px 0px #000000',
                        borderRadius: '2px',
                        position: 'relative',
                      }}
                    >
                      <PushPin color="#FEDE8C" style={{ top: '16px', right: '28px' }} />

                      <div style={{ marginBottom: '24px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '12px',
                            fontWeight: 800,
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                            padding: '2px 8px',
                            display: 'inline-block',
                            marginBottom: '6px',
                          }}
                        >
                          STRUCTURED LLD SPECIFICATION
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>
                          Submit Your Architecture
                        </h2>
                        <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#555555' }}>
                          Fill out the structured sections below. When ready, submit to receive rubric-grounded evaluation.
                        </p>
                      </div>

                      {/* SECTION 1: UNDERSTAND (Assumptions & Constraints) */}
                      <fieldset style={{ border: '1.5px solid #000000', padding: '20px', marginBottom: '24px', backgroundColor: '#F8FAFC' }}>
                        <legend style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, padding: '0 8px', backgroundColor: '#FEDE8C', border: '1px solid #000000' }}>
                          1. UNDERSTAND: ASSUMPTIONS & CONSTRAINTS
                        </legend>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Assumptions:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="Operational scale, concurrency assumptions, customer types..."
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
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Constraints:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="Hardware, barrier dimensions, memory, response latencies..."
                              value={formData.requirements.constraints}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  requirements: { ...formData.requirements, constraints: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </fieldset>

                      {/* SECTION 2: DESIGN (Classes, Relationships, Interfaces) */}
                      <fieldset style={{ border: '1.5px solid #000000', padding: '20px', marginBottom: '24px', backgroundColor: '#F8FAFC' }}>
                        <legend style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, padding: '0 8px', backgroundColor: '#FEDE8C', border: '1px solid #000000' }}>
                          2. DESIGN: DOMAIN ARCHITECTURE & CONTRACTS
                        </legend>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                            Classes & Responsibilities (Required):
                          </label>
                          <textarea
                            rows={7}
                            required
                            style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                            placeholder="class ParkingLot { List<Floor> floors; Ticket issueTicket(Vehicle v); ... }"
                            value={formData.design.classes}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                design: { ...formData.design, classes: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Relationships:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="ParkingLot has-many Floors; Floor contains ParkingSpots (1..*)..."
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
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Interfaces & Polymorphism:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="interface IPricingStrategy { double compute(Ticket t); }..."
                              value={formData.design.interfaces}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  design: { ...formData.design, interfaces: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </fieldset>

                      {/* SECTION 3: REASONING (Decisions, Patterns, Trade-offs) */}
                      <fieldset style={{ border: '1.5px solid #000000', padding: '20px', marginBottom: '24px', backgroundColor: '#F8FAFC' }}>
                        <legend style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, padding: '0 8px', backgroundColor: '#FEDE8C', border: '1px solid #000000' }}>
                          3. REASON: DECISIONS & TRADE-OFFS
                        </legend>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Key Decisions:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="Why responsibilities were allocated this way..."
                              value={formData.reasoning.decisions}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  reasoning: { ...formData.reasoning, decisions: e.target.value },
                                })
                              }
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Design Patterns:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="Strategy pattern for pricing, Factory for tickets..."
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
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                              Trade-offs:
                            </label>
                            <textarea
                              rows={4}
                              style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                              placeholder="In-memory lookup speed vs memory consumption..."
                              value={formData.reasoning.tradeoffs}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  reasoning: { ...formData.reasoning, tradeoffs: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </fieldset>

                      {/* SECTION 4: EDGE CASES */}
                      <fieldset style={{ border: '1.5px solid #000000', padding: '20px', marginBottom: '28px', backgroundColor: '#F8FAFC' }}>
                        <legend style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, padding: '0 8px', backgroundColor: '#FEDE8C', border: '1px solid #000000' }}>
                          4. EDGE CASES & TESTABILITY
                        </legend>
                        <textarea
                          rows={3}
                          style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', border: '1.5px solid #000000' }}
                          placeholder="Concurrency race conditions at gates, full parking lot, ticket lost..."
                          value={formData.edgeCases}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              edgeCases: e.target.value,
                            })
                          }
                        />
                      </fieldset>

                      {/* SUBMIT BUTTON ROW */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '16px',
                          borderTop: '2px solid #000000',
                          paddingTop: '20px',
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#555555' }}>
                          * Submitting persists your design and triggers rubric-based evaluation.
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          style={{
                            backgroundColor: '#FEDE8C',
                            color: '#000000',
                            border: '2px solid #000000',
                            padding: '14px 32px',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '15px',
                            fontWeight: 900,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            boxShadow: '4px 4px 0px #000000',
                            transition: 'transform 0.1s ease',
                          }}
                        >
                          {submitting ? 'PERSISTING & EVALUATING...' : 'SUBMIT DESIGN →'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
