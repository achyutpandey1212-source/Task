import React, { useEffect, useState, useMemo } from 'react';
import { problemService } from '../services/problemService';
import { Problem } from '../types';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ProblemFilters, DifficultyFilter } from '../components/problems/ProblemFilters';
import { ProblemCaseFile } from '../components/problems/ProblemCaseFile';
import {
  SketchStar,
  SketchArrowCurveDown,
  SketchDashes,
  SketchUnderline,
} from '../components/landing/HandDrawnDoodles';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape } from '../components/landing/TactileAccents';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await problemService.getAll();
      setProblems(data);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to open case files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Filter calculations
  const counts = useMemo(() => {
    return {
      all: problems.length,
      easy: problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length,
      medium: problems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length,
      hard: problems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length,
    };
  }, [problems]);

  const filteredProblems = useMemo(() => {
    if (difficultyFilter === 'all') return problems;
    return problems.filter((p) => p.difficulty?.toLowerCase() === difficultyFilter);
  }, [problems, difficultyFilter]);

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
        {/* PAGE HEADER                                                               */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '56px 24px 32px',
            position: 'relative',
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
              let's find something to design.
            </span>
            <SketchDashes />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '24px',
              borderBottom: '2px solid #000000',
              paddingBottom: '32px',
            }}
          >
            {/* Title & description */}
            <div style={{ maxWidth: '680px' }}>
              <h1
                style={{
                  fontSize: 'clamp(38px, 5.5vw, 64px)',
                  lineHeight: 1.05,
                  fontWeight: 900,
                  color: '#000000',
                  margin: '0 0 16px 0',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                }}
              >
                CASE FILES
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: 1.5,
                  color: '#222222',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Pick a system. Think through its objects, responsibilities, relationships, and trade-offs.
              </p>
            </div>

            {/* Technical sketch element near header */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #000000',
                padding: '12px 18px',
                borderRadius: '3px',
                boxShadow: '3px 3px 0px #000000',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                transform: 'rotate(1deg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800 }}>OBJECTIVE:</span>
                <span style={{ color: '#555555' }}>Problem → Objects → Contracts → Design</span>
              </div>
              <div style={{ fontSize: '11px', color: '#666666', marginTop: '4px' }}>
                {counts.all > 0 ? `${String(counts.all).padStart(2, '0')} CASES IN FILE CABINET` : 'LOADING CABINET...'}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FILTER & CONTEXT BAR                                                      */}
          {/* ========================================================================= */}
          <div
            style={{
              padding: '24px 0 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <ProblemFilters
              currentFilter={difficultyFilter}
              onFilterChange={setDifficultyFilter}
              counts={counts}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                pick one that makes you think
              </span>
              <SketchArrowCurveDown width={40} height={32} style={{ transform: 'rotate(10deg)' }} />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CASE FILES COLLECTION / MAIN CONTENT                                      */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '16px 24px 96px',
          }}
        >
          {/* 1. LOADING STATE */}
          {loading && (
            <div
              style={{
                maxWidth: '600px',
                margin: '48px auto',
                textAlign: 'center',
              }}
            >
              <TornPaper
                color="lavender"
                rotation={-0.5}
                tornEdges="both"
                style={{
                  padding: '48px 32px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <Tape rotation={-3} style={{ top: '-12px', left: '40px' }} />
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: '#000000',
                    marginBottom: '12px',
                  }}
                >
                  OPENING CASE FILES...
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#333333' }}>
                  Retrieving design specifications and requirements from cabinet.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <SketchUnderline width={140} style={{ margin: '0 auto' }} />
                </div>
              </TornPaper>
            </div>
          )}

          {/* 2. ERROR STATE */}
          {!loading && error && (
            <div
              style={{
                maxWidth: '600px',
                margin: '48px auto',
                textAlign: 'center',
              }}
            >
              <TornPaper
                color="yellow"
                rotation={0.8}
                tornEdges="both"
                style={{
                  padding: '40px 32px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#991b1b',
                    marginBottom: '12px',
                  }}
                >
                  COULDN'T OPEN THE CASE FILES
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#222222' }}>
                  {error}
                </p>
                <button
                  onClick={fetchProblems}
                  style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    border: '2px solid #000000',
                    padding: '8px 20px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                  }}
                >
                  TRY AGAIN
                </button>
              </TornPaper>
            </div>
          )}

          {/* 3. EMPTY STATE */}
          {!loading && !error && filteredProblems.length === 0 && (
            <div
              style={{
                maxWidth: '600px',
                margin: '48px auto',
                textAlign: 'center',
              }}
            >
              <TornPaper
                color="white"
                rotation={-0.6}
                tornEdges="both"
                style={{
                  padding: '48px 32px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#000000',
                    marginBottom: '12px',
                  }}
                >
                  NO CASE FILES YET
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#444444' }}>
                  {difficultyFilter !== 'all'
                    ? `No problems found with difficulty "${difficultyFilter.toUpperCase()}".`
                    : 'Looks like the notebook is still empty. Check back soon.'}
                </p>
                {difficultyFilter !== 'all' && (
                  <button
                    onClick={() => setDifficultyFilter('all')}
                    style={{
                      backgroundColor: '#FEDE8C',
                      color: '#000000',
                      border: '2px solid #000000',
                      padding: '8px 16px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0px #000000',
                    }}
                  >
                    SHOW ALL CASES
                  </button>
                )}
              </TornPaper>
            </div>
          )}

          {/* 4. PROBLEM CASE FILES GRID */}
          {!loading && !error && filteredProblems.length > 0 && (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '36px 28px',
                  alignItems: 'stretch',
                }}
              >
                {filteredProblems.map((problem, index) => (
                  <ProblemCaseFile
                    key={problem.id}
                    problem={problem}
                    index={index}
                  />
                ))}
              </div>

              {/* Bottom mentor note */}
              <div
                style={{
                  marginTop: '64px',
                  paddingTop: '32px',
                  borderTop: '2px dashed #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <SketchStar size={28} />
                <span
                  className="font-hand"
                  style={{
                    fontSize: '22px',
                    color: '#222222',
                  }}
                >
                  "There's rarely one perfect design. Focus on clear responsibilities and sound trade-offs."
                </span>
                <SketchStar size={28} />
              </div>
            </div>
          )}
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
