import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import {
  SketchStar,
  SketchArrowDownRight,
  SketchArrowCurveDown,
  SketchArrowLoop,
  SketchDashes,
  SketchUnderline,
} from '../components/landing/HandDrawnDoodles';
import { Tape, PushPin } from '../components/landing/TactileAccents';
import { DesignJourney } from '../components/landing/DesignJourney';
import { TechnicalDiagram } from '../components/landing/TechnicalDiagram';
import { PrimaryButton } from '../components/landing/PrimaryButton';

export const LandingPage: React.FC = () => {
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
      <LandingNavbar />

      <main style={{ flex: 1 }}>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '72px 24px 80px',
            position: 'relative',
          }}
        >
          {/* Subtle Top Annotation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <span
              className="font-hand"
              style={{
                fontSize: '26px',
                color: '#333333',
                transform: 'rotate(-2deg)',
                display: 'inline-block',
              }}
            >
              let's design something.
            </span>
            <SketchDashes />
          </div>

          {/* Large Hero Composition with Ripped Paper */}
          <div style={{ position: 'relative', maxWidth: '1080px' }}>
            {/* Top-right decorative doodles */}
            <div
              style={{
                position: 'absolute',
                top: '-36px',
                right: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 20,
              }}
            >
              <SketchArrowDownRight size={56} style={{ transform: 'rotate(-10deg)' }} />
              <SketchStar size={40} style={{ transform: 'rotate(12deg)' }} />
            </div>

            {/* Main Lavender Paper Surface */}
            <TornPaper
              color="lavender"
              rotation={-0.3}
              tornEdges="both"
              style={{
                padding: 'clamp(36px, 6vw, 68px) clamp(24px, 5vw, 56px)',
                border: '2px solid #000000',
                borderRadius: '2px',
              }}
            >
              <Tape rotation={-5} style={{ top: '-12px', left: '48px' }} />
              <PushPin color="#FEDE8C" style={{ top: '16px', right: '28px' }} />

              <h1
                style={{
                  fontSize: 'clamp(38px, 6.5vw, 76px)',
                  lineHeight: 1.05,
                  fontWeight: 900,
                  color: '#000000',
                  margin: '0 0 24px 0',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                }}
              >
                THINK IN OBJECTS.
                <br />
                DESIGN THE SYSTEM.
              </h1>

              <p
                style={{
                  fontSize: 'clamp(17px, 2.2vw, 22px)',
                  lineHeight: 1.5,
                  color: '#111111',
                  margin: '0 0 36px 0',
                  maxWidth: '720px',
                  fontWeight: 500,
                }}
              >
                Practice Low-Level Design problems, explain your decisions, and get structured feedback on how you designed them.
              </p>

              {/* Action row with tactile yellow CTA and hand annotation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <PrimaryButton to="/problems" variant="yellow" style={{ fontSize: '16px', padding: '14px 32px' }}>
                  START PRACTICING →
                </PrimaryButton>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="font-hand"
                    style={{
                      fontSize: '22px',
                      color: '#222222',
                      transform: 'rotate(-1.5deg)',
                    }}
                  >
                    no perfect answer required.
                  </span>
                  <SketchUnderline width={110} style={{ marginTop: '4px' }} />
                </div>
              </div>
            </TornPaper>

            {/* Bottom-left accent doodle */}
            <div style={{ position: 'absolute', bottom: '-40px', left: '16px', zIndex: 10 }}>
              <SketchArrowLoop size={52} />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION — "WHAT IS THIS?" & PRACTICE LOOP                              */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '96px 24px 80px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div style={{ maxWidth: '820px', marginBottom: '48px' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '26px',
                color: '#333333',
                display: 'block',
                marginBottom: '8px',
                transform: 'rotate(-1deg)',
              }}
            >
              so... what's the point?
            </span>
            <h2
              style={{
                fontSize: 'clamp(28px, 4.5vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 16px 0',
                color: '#000000',
              }}
            >
              LLD practice without the lecture.
            </h2>
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: '#333333',
                margin: 0,
              }}
            >
              Most tutorials hand you a neat UML diagram and pretend software design is settled. In reality, low-level design is about trade-offs, boundaries, and justifying why one class owns behavior instead of another.
            </p>
          </div>

          {/* Reusable DesignJourney Component */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                THE WORKFLOW
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                a repeatable practice loop
              </span>
            </div>
            <DesignJourney />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION — THE LLD PROBLEM (PARKING LOT CASE FILE)                      */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '96px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          {/* Header with Case File Stamped Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <span
              style={{
                backgroundColor: '#FEDE8C',
                border: '2px solid #000000',
                padding: '4px 12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 800,
                boxShadow: '3px 3px 0px #000000',
                transform: 'rotate(-1.5deg)',
              }}
            >
              CASE FILE #01
            </span>
            <span className="font-hand" style={{ fontSize: '24px', color: '#222222' }}>
              real problems. real trade-offs.
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left: Problem statement sheet */}
            <TornPaper
              color="lavender"
              rotation={0.4}
              tornEdges="both"
              style={{
                padding: '36px 28px',
                border: '2px solid #000000',
                position: 'relative',
              }}
            >
              <Tape rotation={3} style={{ top: '-12px', right: '36px' }} />

              <h3
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                DESIGN A PARKING LOT
              </h3>

              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#111111', marginBottom: '20px' }}>
                Design a multi-floor parking lot system supporting diverse vehicle dimensions, automated ticket issuance at barrier gates, and flexible hourly pricing models.
              </p>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #000000',
                  padding: '16px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#000000' }}>
                  CORE REQUIREMENTS:
                </div>
                <div>• Support Motorcycles, Cars, and Trucks across multiple levels.</div>
                <div>• Automatically locate and assign the nearest vacant spot.</div>
                <div>• Issue timestamped entry tickets and calculate checkout fees.</div>
                <div>• Account for full-capacity lots and concurrency safety.</div>
              </div>

              {/* Hand-drawn mentor questions positioned organically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SketchStar size={20} />
                  <span className="font-hand" style={{ fontSize: '20px', color: '#000000' }}>
                    What are the core domain objects?
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SketchStar size={20} />
                  <span className="font-hand" style={{ fontSize: '20px', color: '#000000' }}>
                    Who owns the pricing responsibility?
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SketchStar size={20} />
                  <span className="font-hand" style={{ fontSize: '20px', color: '#000000' }}>
                    What happens when the pricing rules change?
                  </span>
                </div>
              </div>
            </TornPaper>

            {/* Right: Technical Diagram with structured engineering precision */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-28px',
                  right: '12px',
                  zIndex: 20,
                  transform: 'rotate(2deg)',
                }}
              >
                <span
                  className="font-hand"
                  style={{
                    backgroundColor: '#FEDE8C',
                    border: '1.5px solid #000000',
                    padding: '2px 8px',
                    fontSize: '18px',
                    boxShadow: '2px 2px 0px #000000',
                  }}
                >
                  engineering layer: precise & structured
                </span>
              </div>

              <TechnicalDiagram />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION — MULTIPLE VALID DESIGNS                                       */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '80px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <TornPaper
            color="lavender"
            rotation={-0.4}
            tornEdges="both"
            style={{
              padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px)',
              border: '2px solid #000000',
              position: 'relative',
            }}
          >
            <PushPin color="#FEDE8C" style={{ top: '16px', left: '24px' }} />

            <div style={{ maxWidth: '820px' }}>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 48px)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: '0 0 20px 0',
                }}
              >
                There isn't always one{' '}
                <span
                  style={{
                    backgroundColor: '#FEDE8C',
                    padding: '2px 8px',
                    border: '1.5px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    display: 'inline-block',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  "correct"
                </span>{' '}
                design.
              </h2>

              <p
                style={{
                  fontSize: '18px',
                  lineHeight: 1.6,
                  color: '#111111',
                  margin: '0 0 24px 0',
                  fontWeight: 500,
                }}
              >
                In Low-Level Design, multiple valid architectures can solve the exact same requirement. A design that prioritizes rapid search speed makes different trade-offs than one optimizing for low memory footprint or distributed concurrency.
              </p>

              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: '#333333',
                  margin: 0,
                }}
              >
                The evaluator does not force you into a single rigid template. Instead, it inspects your stated assumptions, weighs your trade-offs, and scores your solution across a fixed, transparent rubric.
              </p>

              <div style={{ marginTop: '24px' }}>
                <SketchUnderline width={220} />
              </div>
            </div>
          </TornPaper>
        </section>

        {/* ========================================================================= */}
        {/* 5. SECTION — FEEDBACK PREVIEW                                             */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '96px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                EVALUATION SHEET PREVIEW
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                illustrative example (grounded in rubric)
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Actionable feedback you can learn from.
            </h2>
          </div>

          {/* Large Notebook Paper Sheet */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '3px',
              padding: 'clamp(24px, 4vw, 44px)',
              boxShadow: '6px 6px 0px #000000',
              position: 'relative',
            }}
          >
            <Tape rotation={-3} style={{ top: '-14px', right: '48px' }} />

            {/* Score header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '2px solid #000000',
                paddingBottom: '20px',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#666666', textTransform: 'uppercase' }}>
                  EVALUATION RESULT
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0' }}>
                  Parking Lot System — Attempt #1
                </h3>
              </div>
              <div
                style={{
                  backgroundColor: '#FEDE8C',
                  border: '2px solid #000000',
                  padding: '8px 18px',
                  borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '20px',
                  fontWeight: 800,
                  boxShadow: '2px 2px 0px #000000',
                }}
              >
                OVERALL: 7.4 / 10
              </div>
            </div>

            {/* Rubric Breakdown Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Left Column: 7 Criteria scores */}
              <div
                style={{
                  backgroundColor: '#F4F3F3',
                  border: '1.5px solid #000000',
                  padding: '20px',
                  borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: 800, borderBottom: '1px solid #000000', paddingBottom: '8px', marginBottom: '12px' }}>
                  RUBRIC SCORE BREAKDOWN
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Requirement Understanding</span>
                  <strong>8 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Responsibilities</span>
                  <strong>7 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Coupling & Cohesion</span>
                  <strong>8 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Abstraction & Interfaces</span>
                  <strong>6 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Extensibility</span>
                  <strong>7 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Edge Cases & Testability</span>
                  <strong>8 / 10</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Reasoning</span>
                  <strong>8 / 10</strong>
                </div>
              </div>

              {/* Right Column: Evidence, Concern, Suggestion card */}
              <div
                style={{
                  backgroundColor: '#D5BDFF',
                  border: '1.5px solid #000000',
                  padding: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  CRITERION SPOTLIGHT: RESPONSIBILITIES
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                    EVIDENCE
                  </div>
                  <div style={{ fontSize: '14px', color: '#111111', lineHeight: 1.45, marginTop: '2px' }}>
                    Your design clearly separates parking spot allocation from vehicle representation.
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                    CONCERN
                  </div>
                  <div style={{ fontSize: '14px', color: '#111111', lineHeight: 1.45, marginTop: '2px' }}>
                    Pricing logic and rate multipliers are tightly coupled to the parking spot entity.
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                    SUGGESTION
                  </div>
                  <div style={{ fontSize: '14px', color: '#111111', lineHeight: 1.45, marginTop: '2px' }}>
                    Consider isolating pricing behavior behind an IPricingStrategy contract so rate calculations can vary independently.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SECTION — WHAT YOU PRACTICE (THE 7 RUBRIC DIMENSIONS)                  */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '96px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div style={{ marginBottom: '40px' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '26px',
                color: '#333333',
                display: 'block',
                marginBottom: '8px',
                transform: 'rotate(1deg)',
              }}
            >
              evaluated with precision
            </span>
            <h2
              style={{
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              The 7 Evaluation Dimensions
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                title: 'Requirement Understanding',
                detail: 'Identifying implicit vs explicit requirements, defining scope, constraints, and operational assumptions.',
                color: 'lavender' as const,
                rot: -0.6,
              },
              {
                title: 'Responsibilities',
                detail: 'Strict alignment with SRP. Ensuring classes do not aggregate conflicting domain functions.',
                color: 'yellow' as const,
                rot: 0.8,
              },
              {
                title: 'Coupling & Cohesion',
                detail: 'High cohesion within modules, loose coupling between components, clean boundary management.',
                color: 'white' as const,
                rot: -0.4,
              },
              {
                title: 'Abstraction & Interfaces',
                detail: 'Introducing meaningful polymorphism where business variation actually exists rather than speculative over-engineering.',
                color: 'lavender' as const,
                rot: 0.5,
              },
              {
                title: 'Extensibility',
                detail: 'Open for extension, closed for modification. New rules or classes can be added without cascade breaks.',
                color: 'white' as const,
                rot: -0.7,
              },
              {
                title: 'Edge Cases & Testability',
                detail: 'Accounting for empty/null boundaries, resource exhaustion, race conditions, and mockable interfaces.',
                color: 'yellow' as const,
                rot: 0.6,
              },
              {
                title: 'Design Reasoning',
                detail: 'Expressing explicit trade-offs and rationale for patterns used rather than arbitrary architectural choices.',
                color: 'lavender' as const,
                rot: -0.5,
              },
            ].map((c) => (
              <TornPaper
                key={c.title}
                color={c.color}
                rotation={c.rot}
                tornEdges="both"
                style={{
                  padding: '24px 20px',
                  border: '1.5px solid #000000',
                  minHeight: '170px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: '#000000',
                      margin: '0 0 10px 0',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.5,
                      color: '#222222',
                      margin: 0,
                    }}
                  >
                    {c.detail}
                  </p>
                </div>
              </TornPaper>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. SECTION — ENGINEERING NOTEBOOK MOMENT                                  */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '96px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '4px',
              padding: 'clamp(36px, 5vw, 64px) clamp(24px, 4vw, 48px)',
              boxShadow: '6px 6px 0px #000000',
              position: 'relative',
            }}
          >
            <PushPin color="#D5BDFF" style={{ top: '16px', right: '28px' }} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Left: ASCII Technical Relationship */}
              <div
                style={{
                  backgroundColor: '#F4F3F3',
                  border: '1.5px solid #000000',
                  padding: '24px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #000000',
                    padding: '8px 16px',
                    display: 'inline-block',
                    fontWeight: 700,
                  }}
                >
                  Vehicle
                </div>
                <div style={{ height: '18px', width: '1.5px', backgroundColor: '#000000', margin: '4px auto' }} />
                <div style={{ fontSize: '11px', color: '#666666' }}>↓ occupies (0..1)</div>
                <div style={{ height: '18px', width: '1.5px', backgroundColor: '#000000', margin: '4px auto' }} />
                <div
                  style={{
                    backgroundColor: '#D5BDFF',
                    border: '1.5px solid #000000',
                    padding: '8px 16px',
                    display: 'inline-block',
                    fontWeight: 700,
                  }}
                >
                  ParkingSpot
                </div>
                <div style={{ height: '18px', width: '1.5px', backgroundColor: '#000000', margin: '4px auto' }} />
                <div style={{ fontSize: '11px', color: '#666666' }}>↓ contains (1..N)</div>
                <div style={{ height: '18px', width: '1.5px', backgroundColor: '#000000', margin: '4px auto' }} />
                <div
                  style={{
                    backgroundColor: '#FEDE8C',
                    border: '1.5px solid #000000',
                    padding: '8px 16px',
                    display: 'inline-block',
                    fontWeight: 700,
                  }}
                >
                  ParkingLot
                </div>
              </div>

              {/* Right: Handwritten mentor inquiry & insight */}
              <div style={{ position: 'relative' }}>
                <SketchArrowCurveDown width={60} height={50} style={{ transform: 'rotate(-15deg)', marginBottom: '12px' }} />

                <div
                  className="font-hand"
                  style={{
                    fontSize: '32px',
                    lineHeight: 1.2,
                    color: '#000000',
                    marginBottom: '20px',
                    fontWeight: 700,
                  }}
                >
                  "Wait... who should own this?"
                </div>

                <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#333333', marginBottom: '24px' }}>
                  Does the ParkingSpot know about the Vehicle, or does the Vehicle hold a reference to its ParkingSpot? Should the ParkingLot compute fees or delegate to an isolated BillingEngine?
                </p>

                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FEDE8C',
                    border: '2px solid #000000',
                    padding: '8px 16px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 800,
                    boxShadow: '3px 3px 0px #000000',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  THINK ABOUT RESPONSIBILITY
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FINAL CTA                                                              */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '120px 24px 140px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '28px',
                color: '#333333',
                display: 'block',
                marginBottom: '12px',
                transform: 'rotate(-2deg)',
              }}
            >
              your turn.
            </span>

            <h2
              style={{
                fontSize: 'clamp(36px, 5.5vw, 60px)',
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#000000',
                margin: '0 0 20px 0',
              }}
            >
              PICK A PROBLEM.
              <br />
              START DESIGNING.
            </h2>

            <p style={{ fontSize: '18px', color: '#444444', lineHeight: 1.5, margin: '0 0 36px 0' }}>
              Practice realistic Low-Level Design scenarios, submit your architecture, and receive structured feedback.
            </p>

            <PrimaryButton to="/problems" variant="yellow" style={{ fontSize: '17px', padding: '16px 36px' }}>
              START PRACTICING →
            </PrimaryButton>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
