import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const HowItWorksPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0e12' }}>
      <Navbar activePage="how-it-works" />

      <main style={{ flex: 1 }}>
        {/* HEADER */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '60px 20px 40px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: '#1e293b',
              color: '#f59e0b',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Product Methodology
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em',
            }}
          >
            How LLD Practice Works
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#94a3b8', margin: 0 }}>
            Mastering Low-Level Design is not about memorizing one correct answer. It is about understanding trade-offs, organizing responsibilities, and iteratively refining your abstractions.
          </p>
        </section>

        {/* 1. THE PRACTICE LOOP */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '48px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <h2 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 16px 0', fontWeight: 700 }}>
            1. The Practice Loop
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px', fontSize: '15px' }}>
            The platform is structured around a repeatable 6-step iteration loop:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { title: 'Choose Problem', desc: 'Browse the problem catalog and pick a real-world design exercise.' },
              { title: 'Design Solution', desc: 'Break down the domain into classes, interfaces, relationships, and edge cases.' },
              { title: 'Submit', desc: 'Submit your structured solution when ready for an objective evaluation.' },
              { title: 'Evaluate', desc: 'The evaluation engine reviews your submission against a fixed 7-criteria rubric.' },
              { title: 'Review Feedback', desc: 'Analyze the concrete evidence, architectural concerns, and improvement suggestions.' },
              { title: 'Try Again', desc: 'Start a new attempt to refine your architecture and track progress across attempts.' },
            ].map((step, idx) => (
              <div
                key={step.title}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '18px',
                }}
              >
                <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', marginBottom: '6px' }}>
                  STEP 0{idx + 1}
                </div>
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 6px 0', fontWeight: 600 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. WHAT YOU SUBMIT */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '48px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <h2 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 16px 0', fontWeight: 700 }}>
            2. What You Submit
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px', fontSize: '15px' }}>
            Rather than unstructured free-form text or unrunnable pseudocode snippets, each attempt organizes your design into clear structural sections:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '16px' }}>
              <strong style={{ color: '#f8fafc', fontSize: '15px' }}>Requirements Scope</strong>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                <span style={{ color: '#f59e0b' }}>Assumptions & Constraints:</span> Capacity limits, latency requirements, hardware constraints, scale expectations, and explicit assumptions made.
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '16px' }}>
              <strong style={{ color: '#f8fafc', fontSize: '15px' }}>Domain Architecture & Contracts</strong>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                <span style={{ color: '#f59e0b' }}>Classes, Relationships & Interfaces:</span> Class definitions with state and methods, association and composition relationships, and interface contracts separating behavior from implementation.
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '16px' }}>
              <strong style={{ color: '#f8fafc', fontSize: '15px' }}>Design Reasoning & Trade-offs</strong>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                <span style={{ color: '#f59e0b' }}>Decisions, Patterns & Trade-offs:</span> Rationale for choosing specific design patterns (e.g. Strategy vs Factory), memory vs CPU tradeoffs, and why alternative structures were dismissed.
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '16px' }}>
              <strong style={{ color: '#f8fafc', fontSize: '15px' }}>Edge Cases & Failure Handling</strong>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                <span style={{ color: '#f59e0b' }}>Edge Cases:</span> Boundary conditions, concurrent access collisions, resource exhaustion, and fallback strategies.
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW FEEDBACK WORKS */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '48px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <h2 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 16px 0', fontWeight: 700 }}>
            3. How Feedback Works
          </h2>
          <div
            style={{
              backgroundColor: '#111827',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <p style={{ color: '#f8fafc', fontWeight: 600, margin: '0 0 8px 0', fontSize: '15px' }}>
              Objective Evaluation Against a Fixed Rubric
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              The evaluator provides structured feedback against defined criteria. It does not act as an absolute judge, nor does it claim that there is only one universally correct LLD design. Different real-world tradeoffs lead to different valid architectures. The goal is to provide honest, grounded architectural analysis so you understand what works and what can be improved.
            </p>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Every criterion in an evaluation report provides:
          </p>
          <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
            <li><strong style={{ color: '#f8fafc' }}>Score (1–10):</strong> Calibration of alignment with design best practices.</li>
            <li><strong style={{ color: '#38bdf8' }}>Evidence:</strong> Concrete elements and lines directly cited from your submission.</li>
            <li><strong style={{ color: '#f87171' }}>Concern:</strong> Potential bottlenecks, architectural coupling, or violation of OOP principles.</li>
            <li><strong style={{ color: '#4ade80' }}>Suggestion:</strong> Actionable engineering advice to remedy identified concerns in subsequent attempts.</li>
          </ul>
        </section>

        {/* 4. WHAT MAKES A USEFUL DESIGN */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '48px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <h2 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 16px 0', fontWeight: 700 }}>
            4. What Makes a Useful Design
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px', fontSize: '15px' }}>
            We evaluate solutions across the 7 criteria established in the LLD Evaluation Rubric:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              {
                title: 'Requirement Understanding',
                detail: 'Accurately capturing explicit requirements and formulating sound assumptions without overcomplicating scope.',
              },
              {
                title: 'Clear Responsibilities',
                detail: 'Following the Single Responsibility Principle. Avoid "manager" classes that do everything.',
              },
              {
                title: 'Coupling & Cohesion',
                detail: 'Organizing cohesive components with minimal direct dependencies so modules can change independently.',
              },
              {
                title: 'Abstraction & Interfaces',
                detail: 'Introducing interfaces where polymorphism is necessary to decouple clients from implementations.',
              },
              {
                title: 'Extensibility',
                detail: 'Designing open for extension, closed for modification. Adding a new rule should not rewrite existing core classes.',
              },
              {
                title: 'Edge Cases & Testability',
                detail: 'Anticipating concurrency, zero-values, capacity limits, and structuring classes so they can be unit-tested.',
              },
              {
                title: 'Design Reasoning',
                detail: 'Articulating explicit reasons for chosen abstractions and discussing trade-offs between memory, CPU, and complexity.',
              },
            ].map((c) => (
              <div
                key={c.title}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '16px',
                }}
              >
                <h3 style={{ fontSize: '14px', color: '#f8fafc', margin: '0 0 6px 0', fontWeight: 600 }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 12px 0', fontWeight: 700 }}>
            Put the Methodology to Work
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px 0' }}>
            Start an attempt and put your low-level design decisions to the test.
          </p>
          <Link
            to="/problems"
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              padding: '12px 28px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Browse Problems →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};
