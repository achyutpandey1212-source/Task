import React from 'react';
import { Evaluation } from '../../types';
import { Tape, PushPin } from '../landing/TactileAccents';
import { SketchStar } from '../landing/HandDrawnDoodles';

interface EvaluationReportProps {
  evaluation: Evaluation;
  problemTitle?: string;
  attemptStartedAt?: string;
  attemptCompletedAt?: string;
  onRetry?: () => void;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({
  evaluation,
  problemTitle,
  onRetry,
}) => {
  const formatCriterionName = (key: string) => {
    return key
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const scoreBadgeColor = (score: number) => {
    if (score >= 8) return { bg: '#bbf7d0', text: '#14532d' };
    if (score >= 6) return { bg: '#FEDE8C', text: '#000000' };
    return { bg: '#fecaca', text: '#7f1d1d' };
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* REVIEW SHEET HEADER */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #000000',
          borderRadius: '3px',
          padding: 'clamp(24px, 4vw, 44px)',
          boxShadow: '6px 6px 0px #000000',
          position: 'relative',
          marginBottom: '36px',
        }}
      >
        <Tape rotation={-3} style={{ top: '-14px', right: '48px' }} />
        <PushPin color="#FEDE8C" style={{ top: '16px', left: '24px' }} />

        {/* Top Header metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #000000',
            paddingBottom: '20px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 800,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}
            >
              DESIGN REVIEW SHEET
            </div>
            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              {problemTitle || 'LLD Case Evaluation'}
            </h1>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#555555',
                marginTop: '6px',
              }}
            >
              Reviewed at:{' '}
              {evaluation.completedAt
                ? new Date(evaluation.completedAt).toLocaleString()
                : new Date().toLocaleString()}
            </div>
          </div>

          {/* Overall score badge */}
          {evaluation.overallScore !== undefined && evaluation.overallScore !== null && (
            <div
              style={{
                backgroundColor: '#FEDE8C',
                border: '2px solid #000000',
                padding: '10px 22px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '24px',
                fontWeight: 900,
                boxShadow: '3px 3px 0px #000000',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                OVERALL SCORE
              </div>
              <div>{evaluation.overallScore.toFixed(1)} / 10</div>
            </div>
          )}
        </div>

        {/* Short Executive Summary */}
        {evaluation.summary && (
          <div
            style={{
              backgroundColor: '#F4F3F3',
              border: '1.5px solid #000000',
              padding: '20px 24px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 800,
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              THE SHORT VERSION
            </div>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: '#222222',
                margin: 0,
                fontWeight: 500,
              }}
            >
              {evaluation.summary}
            </p>
          </div>
        )}

        {/* Philosophy Note: Multiple Valid Designs */}
        <div
          style={{
            padding: '14px 18px',
            border: '1.5px dashed #000000',
            backgroundColor: '#FFFBEB',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <SketchStar size={24} />
          <div style={{ fontSize: '13px', lineHeight: 1.45, color: '#333333' }}>
            <strong>Good design does not mean there was only one answer.</strong> The review focuses on your reasoning, responsibilities, trade-offs, and extensibility against the fixed rubric.
          </div>
        </div>

        {/* 7-CRITERIA RUBRIC REVIEW NOTES */}
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              fontWeight: 800,
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              borderBottom: '2px solid #000000',
              paddingBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>RUBRIC CRITERIA BREAKDOWN ({evaluation.criteria.length} DIMENSIONS)</span>
            <span style={{ fontSize: '11px', color: '#666666' }}>EVIDENCE-FIRST CRITIQUE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {evaluation.criteria.map((c, idx) => {
              const badge = scoreBadgeColor(c.score);
              return (
                <article
                  key={c.criterion}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #000000',
                    boxShadow: '3px 3px 0px #000000',
                    padding: '20px 24px',
                    borderRadius: '2px',
                  }}
                >
                  {/* Top line: criterion title, score, confidence */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      borderBottom: '1px solid #E7E5E5',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '12px',
                          fontWeight: 800,
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#000000' }}>
                        {formatCriterionName(c.criterion)}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '11px',
                          color: '#666666',
                        }}
                      >
                        CONFIDENCE: {Math.round(c.confidence * 100)}%
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '14px',
                          fontWeight: 900,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          padding: '3px 10px',
                          border: '1.5px solid #000000',
                          boxShadow: '1px 1px 0px #000000',
                        }}
                      >
                        {c.score} / 10
                      </span>
                    </div>
                  </div>

                  {/* Evidence, Concern, Suggestion Columns/Blocks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: 1.5 }}>
                    {/* Evidence */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderLeft: '4px solid #0284c7',
                        padding: '10px 14px',
                      }}
                    >
                      <strong style={{ color: '#0284c7', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        EVIDENCE IN SUBMISSION
                      </strong>
                      <div style={{ color: '#1e293b' }}>{c.evidence}</div>
                    </div>

                    {/* Concern */}
                    <div
                      style={{
                        backgroundColor: '#FEF2F2',
                        borderLeft: '4px solid #dc2626',
                        padding: '10px 14px',
                      }}
                    >
                      <strong style={{ color: '#dc2626', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        ARCHITECTURAL CONCERN
                      </strong>
                      <div style={{ color: '#7f1d1d' }}>{c.concern}</div>
                    </div>

                    {/* Actionable Suggestion */}
                    <div
                      style={{
                        backgroundColor: '#F0FDF4',
                        borderLeft: '4px solid #16a34a',
                        padding: '10px 14px',
                      }}
                    >
                      <strong style={{ color: '#16a34a', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        ACTIONABLE SUGGESTION
                      </strong>
                      <div style={{ color: '#14532d' }}>{c.suggestion}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Retry / Iterate CTA */}
        {onRetry && (
          <div
            style={{
              marginTop: '40px',
              paddingTop: '28px',
              borderTop: '2px dashed #000000',
              textAlign: 'center',
            }}
          >
            <div className="font-hand" style={{ fontSize: '22px', color: '#333333', marginBottom: '12px' }}>
              ready to refine your abstractions?
            </div>
            <button
              onClick={onRetry}
              style={{
                backgroundColor: '#FEDE8C',
                color: '#000000',
                border: '2px solid #000000',
                padding: '12px 28px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #000000',
              }}
            >
              START A NEW ATTEMPT →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
