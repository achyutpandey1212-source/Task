import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape, PushPin } from '../components/landing/TactileAccents';
import { DesignJourney } from '../components/landing/DesignJourney';
import {
  SketchDashes,
  SketchUnderline,
} from '../components/landing/HandDrawnDoodles';
import { PrimaryButton } from '../components/landing/PrimaryButton';

export const HowItWorksPage: React.FC = () => {
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
      <LandingNavbar activePage="how-it-works" />

      <main style={{ flex: 1 }}>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '64px 24px 48px',
          }}
        >
          {/* Annotation */}
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
              the methodology behind the practice →
            </span>
            <SketchDashes />
          </div>

          <div
            style={{
              borderBottom: '2px solid #000000',
              paddingBottom: '32px',
              maxWidth: '880px',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '2px 8px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              PRODUCT METHODOLOGY
            </div>
            <h1
              style={{
                fontSize: 'clamp(34px, 5.5vw, 56px)',
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
              }}
            >
              HOW IT WORKS
            </h1>
            <p
              style={{
                fontSize: '19px',
                lineHeight: 1.5,
                color: '#222222',
                margin: 0,
                fontWeight: 500,
              }}
            >
              Don't just memorize system design patterns. Practice thinking through classes, responsibilities, trade-offs, and edge cases.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE CORE PRACTICE LOOP                                                 */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '32px 24px 64px',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 800,
                  backgroundColor: '#FEDE8C',
                  padding: '2px 8px',
                  border: '1px solid #000000',
                }}
              >
                THE 6-STEP CYCLE
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                from problem to evaluated architecture
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>
              The Iteration Loop
            </h2>
          </div>

          <DesignJourney />
        </section>

        {/* ========================================================================= */}
        {/* 3. WHAT GETS EVALUATED (THE 7 RUBRIC DIMENSIONS)                          */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '64px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div style={{ marginBottom: '36px', maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 800,
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                }}
              >
                EVALUATION CRITERIA
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                grounded in real software engineering
              </span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 12px 0' }}>
              What Actually Gets Evaluated
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#333333', margin: 0 }}>
              Every submitted design is evaluated against seven core object-oriented dimensions established in the platform's evaluation rubric.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                num: '01',
                title: 'REQUIREMENTS UNDERSTANDING',
                question: 'Did you capture what the system actually needs?',
                detail: 'Identifies core functional requirements, extracts implicit operational boundaries, and states sound capacity and scale assumptions.',
                color: 'lavender' as const,
                rot: -0.5,
              },
              {
                num: '02',
                title: 'RESPONSIBILITIES (SRP)',
                question: 'Does each object have one clear reason to change?',
                detail: 'Strict alignment with the Single Responsibility Principle. Avoids bloating classes with conflicting domain and infrastructure tasks.',
                color: 'yellow' as const,
                rot: 0.6,
              },
              {
                num: '03',
                title: 'COUPLING & COHESION',
                question: 'How dependent are your objects on each other?',
                detail: 'High internal cohesion within classes and loose coupling across components so individual modules can evolve independently.',
                color: 'white' as const,
                rot: -0.4,
              },
              {
                num: '04',
                title: 'ABSTRACTION & INTERFACES',
                question: 'Are polymorphic interfaces meaningful?',
                detail: 'Introduces contracts where business rules naturally vary (such as pricing or payment processors) rather than arbitrary over-abstraction.',
                color: 'lavender' as const,
                rot: 0.5,
              },
              {
                num: '05',
                title: 'EXTENSIBILITY',
                question: 'Can the design evolve without cascade breaks?',
                detail: 'Open for extension, closed for modification. Introducing a new vehicle type or pricing model should not rewrite existing core classes.',
                color: 'white' as const,
                rot: -0.6,
              },
              {
                num: '06',
                title: 'EDGE CASES & TESTABILITY',
                question: 'Did you think beyond the happy path?',
                detail: 'Accounts for full-capacity conditions, boundary values, concurrent race collisions at gates, and ensures classes can be isolated for unit testing.',
                color: 'yellow' as const,
                rot: 0.4,
              },
              {
                num: '07',
                title: 'DESIGN REASONING',
                question: 'Can another engineer understand your trade-offs?',
                detail: 'Articulates explicit rationale for chosen patterns and justifies memory vs CPU trade-offs and discarded alternatives.',
                color: 'lavender' as const,
                rot: -0.5,
              },
            ].map((c) => (
              <TornPaper
                key={c.num}
                color={c.color}
                rotation={c.rot}
                tornEdges="both"
                style={{
                  padding: '24px 20px',
                  border: '1.5px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '200px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#000000' }}>
                      {c.num}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666666' }}>
                      RUBRIC CRITERION
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                    {c.title}
                  </h3>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#333333', marginBottom: '10px' }}>
                    "{c.question}"
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#222222', margin: 0 }}>
                    {c.detail}
                  </p>
                </div>
              </TornPaper>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PHILOSOPHY: MULTIPLE VALID DESIGNS                                     */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '64px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <TornPaper
            color="lavender"
            rotation={-0.3}
            tornEdges="both"
            style={{
              padding: 'clamp(36px, 5vw, 60px) clamp(24px, 4vw, 48px)',
              border: '2px solid #000000',
              boxShadow: '6px 6px 0px #000000',
              position: 'relative',
            }}
          >
            <PushPin color="#FEDE8C" style={{ top: '16px', left: '24px' }} />

            <div style={{ maxWidth: '820px' }}>
              <div
                className="font-hand"
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  lineHeight: 1.2,
                  color: '#000000',
                  marginBottom: '16px',
                  fontWeight: 700,
                }}
              >
                "There isn't always one 'correct' design."
              </div>

              <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#111111', margin: '0 0 20px 0', fontWeight: 500 }}>
                The goal of low-level design is not to guess the exact class names a specific interviewer or author had in mind. In real software engineering, different architectural requirements demand different trade-offs.
              </p>

              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#333333', margin: 0 }}>
                The evaluator focuses on whether you defended your design boundaries, assigned cohesive roles to objects, and handled critical failure states. It provides structured feedback against the rubric rather than penalizing solutions for being distinct.
              </p>

              <div style={{ marginTop: '20px' }}>
                <SketchUnderline width={240} />
              </div>
            </div>
          </TornPaper>
        </section>

        {/* ========================================================================= */}
        {/* 5. FEEDBACK STRUCTURE                                                     */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '64px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 800,
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                }}
              >
                FEEDBACK ARCHITECTURE
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#444444' }}>
                how the critique is organized
              </span>
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 900, margin: 0 }}>
              Evidence-First Engineering Review
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
                tag: 'EVIDENCE',
                color: '#0284c7',
                title: 'Grounding in Your Work',
                desc: 'Specific snippets, class names, or declarations from your submission demonstrating where the criterion was satisfied.',
              },
              {
                tag: 'CONCERN',
                color: '#dc2626',
                title: 'Architectural Friction',
                desc: 'Identifies potential race conditions, tight coupling, god objects, or lack of extensibility that could cause production pain.',
              },
              {
                tag: 'SUGGESTION',
                color: '#16a34a',
                title: 'Concrete Refinements',
                desc: 'Actionable engineering advice on how to refactor class contracts, introduce patterns, or decouple components in your next attempt.',
              },
              {
                tag: 'CONFIDENCE',
                color: '#000000',
                title: 'Calibrated Confidence',
                desc: 'Confidence rating reflecting the clarity and explicitness of the evidence provided in your submitted architecture.',
              },
            ].map((item) => (
              <div
                key={item.tag}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  padding: '22px',
                  borderRadius: '2px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 900,
                    color: item.color,
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  {item.tag}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 8px 0', color: '#000000' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#333333', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. WORK IN PROGRESS CANVAS HONESTY                                        */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '64px 24px',
            borderTop: '2px dashed #000000',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '2px',
              padding: '36px 32px',
              boxShadow: '5px 5px 0px #000000',
              position: 'relative',
            }}
          >
            <Tape rotation={-2} style={{ top: '-10px', left: '32px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 800,
                  backgroundColor: '#FEDE8C',
                  padding: '2px 8px',
                  border: '1.5px solid #000000',
                }}
              >
                WORK IN PROGRESS
              </span>
              <span className="font-hand" style={{ fontSize: '20px', color: '#333333' }}>
                the design canvas is taking shape
              </span>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 12px 0' }}>
              Visual Modeling Canvas
            </h2>

            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#222222', maxWidth: '780px', margin: '0 0 16px 0' }}>
              Inside the attempt workspace, you can experiment with class and interface nodes on an interactive graph canvas. Currently, the platform evaluates your structured written design, which allows for explicit reasoning and detailed trade-off justifications. Direct visual diagram evaluation is being developed for future releases.
            </p>

            <div style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#666666' }}>
              Status: Interactive scratchpad active in workspace • Written specification remains evaluated source of truth.
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FINAL CTA                                                              */}
        {/* ========================================================================= */}
        <section
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '80px 24px 120px',
            textAlign: 'center',
          }}
        >
          <span className="font-hand" style={{ fontSize: '26px', color: '#333333', display: 'block', marginBottom: '8px' }}>
            ready to design something?
          </span>

          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              color: '#000000',
              margin: '0 0 24px 0',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            PUT THE METHODOLOGY TO WORK
          </h2>

          <PrimaryButton to="/problems" variant="yellow" style={{ fontSize: '16px', padding: '14px 32px' }}>
            BROWSE CASE FILES →
          </PrimaryButton>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
