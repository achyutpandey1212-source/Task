import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { authService } from '../services/authService';
import { Attempt, Problem } from '../types';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape } from '../components/landing/TactileAccents';
import { SketchStar, SketchDashes } from '../components/landing/HandDrawnDoodles';

export const AttemptsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.getToken()) {
      navigate('/login');
      return;
    }

    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await attemptService.getAll();
        setAttempts(data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || err.message || 'Failed to open attempts archive');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [navigate]);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#bbf7d0', text: '#14532d', label: 'COMPLETED' };
      case 'EVALUATING':
        return { bg: '#FEDE8C', text: '#000000', label: 'EVALUATING' };
      case 'SUBMITTED':
        return { bg: '#D5BDFF', text: '#000000', label: 'SUBMITTED' };
      case 'FAILED':
        return { bg: '#fecaca', text: '#7f1d1d', label: 'FAILED' };
      default:
        return { bg: '#F4F3F3', text: '#333333', label: 'DRAFT' };
    }
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
      <LandingNavbar activePage="attempts" />

      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '56px 24px 80px',
          }}
        >
          {/* Handwritten Annotation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '26px',
                color: '#333333',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
              }}
            >
              what have you designed so far?
            </span>
            <SketchDashes />
          </div>

          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #000000',
              paddingBottom: '24px',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                YOUR NOTEBOOK
              </h1>
              <p
                style={{
                  fontSize: '17px',
                  color: '#222222',
                  margin: '8px 0 0 0',
                  fontWeight: 500,
                }}
              >
                Review old designs. See how your thinking changes. Try again.
              </p>
            </div>

            <Link
              to="/problems"
              style={{
                backgroundColor: '#FEDE8C',
                color: '#000000',
                border: '2px solid #000000',
                padding: '10px 20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '3px 3px 0px #000000',
              }}
            >
              BROWSE CASE FILES →
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ maxWidth: '600px', margin: '48px auto', textAlign: 'center' }}>
              <TornPaper
                color="lavender"
                rotation={-0.4}
                tornEdges="both"
                style={{ padding: '40px 28px', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000' }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '17px', fontWeight: 800 }}>
                  OPENING YOUR NOTEBOOK...
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#333333' }}>
                  Retrieving past design attempts and evaluation reports.
                </p>
              </TornPaper>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div style={{ maxWidth: '600px', margin: '48px auto', textAlign: 'center' }}>
              <TornPaper
                color="yellow"
                rotation={0.5}
                tornEdges="both"
                style={{ padding: '40px 28px', border: '2px solid #000000', boxShadow: '4px 4px 0px #000000' }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 800, color: '#991b1b' }}>
                  COULD NOT OPEN NOTEBOOK
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#333333' }}>
                  {error}
                </p>
              </TornPaper>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && attempts.length === 0 && (
            <div style={{ maxWidth: '640px', margin: '48px auto', textAlign: 'center' }}>
              <TornPaper
                color="white"
                rotation={-0.5}
                tornEdges="both"
                style={{
                  padding: '48px 32px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  position: 'relative',
                }}
              >
                <Tape rotation={-2} style={{ top: '-12px', left: '36px' }} />
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 900,
                    marginBottom: '12px',
                  }}
                >
                  YOUR NOTEBOOK IS EMPTY
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.5, color: '#444444', margin: '0 0 24px 0' }}>
                  That's not a bad thing. Pick a case and create your first object-oriented design.
                </p>
                <Link
                  to="/problems"
                  style={{
                    backgroundColor: '#FEDE8C',
                    color: '#000000',
                    border: '2px solid #000000',
                    padding: '12px 24px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '3px 3px 0px #000000',
                  }}
                >
                  BROWSE CASE FILES →
                </Link>
              </TornPaper>
            </div>
          )}

          {/* Attempt List (Archive layout) */}
          {!loading && !error && attempts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {attempts.map((att, idx) => {
                const problemTitle =
                  typeof att.problemId === 'object' && att.problemId !== null
                    ? (att.problemId as Problem).title
                    : 'LLD Problem';

                const badge = statusBadge(att.status);
                const isDraft = att.status === 'DRAFT';

                return (
                  <article
                    key={att.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000000',
                      borderRadius: '2px',
                      padding: '24px 28px',
                      boxShadow: '4px 4px 0px #000000',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '20px',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                            padding: '2px 6px',
                          }}
                        >
                          CASE #{String(attempts.length - idx).padStart(2, '0')}
                        </span>

                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            padding: '2px 8px',
                            border: '1px solid #000000',
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: '22px',
                          fontWeight: 900,
                          margin: '0 0 8px 0',
                          color: '#000000',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {problemTitle}
                      </h2>

                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '12px',
                          color: '#555555',
                          display: 'flex',
                          gap: '16px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>Started: {new Date(att.startedAt).toLocaleDateString()}</span>
                        {att.submittedAt && (
                          <span>Submitted: {new Date(att.submittedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Link
                        to={`/attempts/${att.id}`}
                        style={{
                          backgroundColor: isDraft ? '#FFFFFF' : att.status === 'FAILED' ? '#FEF2F2' : '#FEDE8C',
                          color: att.status === 'FAILED' ? '#991b1b' : '#000000',
                          border: att.status === 'FAILED' ? '2px solid #b91c1c' : '2px solid #000000',
                          padding: '10px 20px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '13px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-block',
                          boxShadow: att.status === 'FAILED' ? '3px 3px 0px #b91c1c' : '3px 3px 0px #000000',
                        }}
                      >
                        {isDraft ? 'CONTINUE DRAFT →' : att.status === 'FAILED' ? 'REVIEW / RETRY →' : 'REVIEW DESIGN →'}
                      </Link>
                    </div>
                  </article>
                );
              })}

              {/* Bottom footer encouragement */}
              <div
                style={{
                  marginTop: '48px',
                  paddingTop: '24px',
                  borderTop: '2px dashed #000000',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                  <SketchStar size={20} />
                  <span className="font-hand" style={{ fontSize: '20px', color: '#333333' }}>
                    every attempt sharpens your architectural intuition
                  </span>
                  <SketchStar size={20} />
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
