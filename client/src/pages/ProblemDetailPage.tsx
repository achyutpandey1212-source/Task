import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { attemptService } from '../services/attemptService';
import { authService } from '../services/authService';
import { Problem } from '../types';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape, PushPin } from '../components/landing/TactileAccents';
import {
  SketchStar,
  SketchArrowCurveDown,
} from '../components/landing/HandDrawnDoodles';
import { PrimaryButton } from '../components/landing/PrimaryButton';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await problemService.getById(id);
        setProblem(data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || err.message || 'Failed to load case specification');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleStartAttempt = async () => {
    if (!problem) return;

    if (!authService.getToken()) {
      navigate('/login');
      return;
    }

    try {
      setStarting(true);
      setError(null);
      const attempt = await attemptService.create(problem.id);
      navigate(`/attempts/${attempt.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to initialize attempt');
      setStarting(false);
    }
  };

  const difficultyStyles: Record<string, { bg: string; text: string }> = {
    easy: { bg: '#bbf7d0', text: '#14532d' },
    medium: { bg: '#FEDE8C', text: '#000000' },
    hard: { bg: '#fecaca', text: '#7f1d1d' },
  };

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
      <LandingNavbar activePage="problems" />

      <main style={{ flex: 1 }}>
        {/* ========================================================================= */}
        {/* CASE FILE HEADER                                                          */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '48px 24px 28px',
          }}
        >
          {/* Back navigation & breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Link
              to="/problems"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                fontWeight: 700,
                color: '#333333',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← BACK TO CASE FILES
            </Link>

            <Link
              to="/attempts"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                fontWeight: 700,
                color: '#555555',
              }}
            >
              MY ATTEMPTS ARCHIVE →
            </Link>
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
                  OPENING CASE FILE...
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#333333' }}>
                  Unpacking specification, requirements & constraints.
                </p>
              </TornPaper>
            </div>
          )}

          {/* Error State */}
          {!loading && (error || !problem) && (
            <div style={{ maxWidth: '640px', margin: '48px auto', textAlign: 'center' }}>
              <TornPaper
                color="yellow"
                rotation={0.6}
                tornEdges="both"
                style={{ padding: '40px 28px', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000' }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '17px', fontWeight: 800, color: '#991b1b' }}>
                  COULD NOT LOCATE CASE FILE
                </div>
                <p style={{ margin: '8px 0 20px 0', fontSize: '14px', color: '#333333' }}>
                  {error || 'The requested problem does not exist in the cabinet.'}
                </p>
                <Link
                  to="/problems"
                  style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '8px 18px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  RETURN TO CASE FILES
                </Link>
              </TornPaper>
            </div>
          )}

          {/* Problem Case Sheet Content */}
          {!loading && problem && (
            <div>
              {/* Handwritten mentor note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  className="font-hand"
                  style={{
                    fontSize: '24px',
                    color: '#333333',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  read the constraints before touching the classes →
                </span>
                <SketchArrowCurveDown width={40} height={32} style={{ transform: 'rotate(10deg)' }} />
              </div>

              {/* Case Header Banner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '2px solid #000000',
                  paddingBottom: '24px',
                  marginBottom: '36px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 800,
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      display: 'inline-block',
                      marginBottom: '10px',
                    }}
                  >
                    CASE FILE SPECIFICATION
                  </div>
                  <h1
                    style={{
                      fontSize: 'clamp(32px, 5vw, 54px)',
                      fontWeight: 900,
                      color: '#000000',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {problem.title}
                  </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: difficultyStyles[problem.difficulty?.toLowerCase()]?.bg || '#FEDE8C',
                      color: difficultyStyles[problem.difficulty?.toLowerCase()]?.text || '#000000',
                      padding: '4px 12px',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                    }}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>

              {/* Problem Brief Section */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '36px',
                  alignItems: 'start',
                }}
              >
                {/* Left: The Brief & Requirements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* The Brief Sheet */}
                  <TornPaper
                    color="white"
                    rotation={-0.3}
                    tornEdges="both"
                    style={{
                      padding: '32px 28px',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      position: 'relative',
                    }}
                  >
                    <Tape rotation={-3} style={{ top: '-12px', left: '32px' }} />
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#666666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '8px',
                      }}
                    >
                      THE BRIEF
                    </div>
                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: '#111111',
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {problem.description}
                    </p>
                  </TornPaper>

                  {/* Functional Requirements */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000000',
                      padding: '28px',
                      boxShadow: '4px 4px 0px #000000',
                      borderRadius: '2px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '16px',
                        borderBottom: '1.5px solid #000000',
                        paddingBottom: '8px',
                      }}
                    >
                      WHAT THE SYSTEM MUST DO ({problem.requirements.length} CORE REQUIREMENTS)
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {problem.requirements.map((req, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#000000',
                              backgroundColor: '#FEDE8C',
                              padding: '2px 6px',
                              border: '1px solid #000000',
                            }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span style={{ fontSize: '15px', lineHeight: 1.5, color: '#222222' }}>
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints & Clarifications (if present) */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#F4F3F3',
                        border: '2px solid #000000',
                        padding: '24px',
                        boxShadow: '3px 3px 0px #000000',
                        borderRadius: '2px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#7f1d1d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '12px',
                        }}
                      >
                        CONSTRAINTS & CLARIFICATIONS
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '20px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '13px',
                          lineHeight: 1.6,
                          color: '#333333',
                        }}
                      >
                        {problem.constraints.map((c, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: What You're Designing & Primary Start CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* Orientation Section */}
                  <TornPaper
                    color="lavender"
                    rotation={0.4}
                    tornEdges="both"
                    style={{
                      padding: '32px 24px',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      position: 'relative',
                    }}
                  >
                    <PushPin color="#FEDE8C" style={{ top: '14px', right: '20px' }} />

                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 900,
                        margin: '0 0 12px 0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      WHAT YOU ARE DESIGNING
                    </h3>

                    <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#222222', marginBottom: '16px' }}>
                      In the upcoming workspace, model your solution with clean object-oriented rigor across:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                      {[
                        { title: 'Classes & Roles', text: 'Define state and cohesive behavior without god objects.' },
                        { title: 'Relationships', text: 'Composition vs inheritance; specify multiplicities.' },
                        { title: 'Interfaces', text: 'Abstract contracts where behaviors naturally vary.' },
                        { title: 'Trade-offs & Edge Cases', text: 'Justify your decisions and handle boundary conditions.' },
                      ].map((item) => (
                        <div key={item.title} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ color: '#000000', fontWeight: 800 }}>•</span>
                          <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
                            <strong>{item.title}:</strong> {item.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1.5px dashed rgba(0,0,0,0.2)', paddingTop: '20px' }}>
                      <PrimaryButton
                        onClick={handleStartAttempt}
                        variant="yellow"
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '15px',
                        }}
                      >
                        {starting ? 'INITIALIZING WORKSPACE...' : 'START DESIGNING →'}
                      </PrimaryButton>
                    </div>
                  </TornPaper>

                  {/* Mentor closing note */}
                  <div
                    style={{
                      padding: '20px',
                      border: '2px dashed #000000',
                      backgroundColor: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      className="font-hand"
                      style={{
                        fontSize: '20px',
                        color: '#333333',
                        display: 'block',
                      }}
                    >
                      "There isn't one perfect design. Make your reasoning clear and defend your boundaries."
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                      <SketchStar size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
