import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const criteriaList = [
    { name: 'Requirement Understanding', desc: 'Identify domain boundaries, constraints, and assumptions accurately.' },
    { name: 'Responsibilities', desc: 'Assign coherent, single-purpose roles to classes without god objects.' },
    { name: 'Coupling & Cohesion', desc: 'Ensure high cohesion within components and loose coupling between them.' },
    { name: 'Abstraction & Interfaces', desc: 'Use polymorphism and contracts where variability actually occurs.' },
    { name: 'Extensibility', desc: 'Support new behaviors or business rules without cascading refactors.' },
    { name: 'Edge Cases & Testability', desc: 'Plan for state transitions, capacity limits, concurrency, and validation.' },
    { name: 'Design Reasoning', desc: 'Articulate explicit trade-offs and rationale behind design patterns chosen.' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0e12' }}>
      <Navbar activePage="landing" />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '72px 20px 48px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ maxWidth: '780px' }}>
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
                marginBottom: '20px',
              }}
            >
              Low-Level Design Practice
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#f8fafc',
                margin: '0 0 20px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Practice Low-Level Design.
              <br />
              <span style={{ color: '#94a3b8' }}>Get feedback. Try again.</span>
            </h1>

            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: '#cbd5e1',
                margin: '0 0 32px 0',
                maxWidth: '640px',
              }}
            >
              Solve realistic object-oriented design problems with structured requirements. Submit your classes, interfaces, and trade-offs to receive structured, rubric-based evaluation.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/problems"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Start Practicing →
              </Link>
              <Link
                to="/how-it-works"
                style={{
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: '1px solid #334155',
                }}
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* PRACTICE LOOP */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '56px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 700 }}>
              The Practice Loop
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
              A disciplined cycle to hone real-world object-oriented engineering skills.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { step: '01', title: 'Choose a problem', desc: 'Select from canonical LLD challenges like Parking Lot or Rate Limiter.' },
              { step: '02', title: 'Design your solution', desc: 'Define your classes, contracts, relationships, assumptions, and edge cases.' },
              { step: '03', title: 'Submit', desc: 'Lock in your structured design and trigger the evaluation engine.' },
              { step: '04', title: 'Get feedback', desc: 'Receive evidence, concerns, and suggestions grounded in your submission.' },
              { step: '05', title: 'Improve & try again', desc: 'Iterate on your design with new attempts to address specific weak spots.' },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#f59e0b',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT YOU PRACTICE */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '56px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 700 }}>
              What You Practice
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
              Your submissions are evaluated across seven core Low-Level Design dimensions:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {criteriaList.map((c) => (
              <div
                key={c.name}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '20px',
                }}
              >
                <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 6px 0', fontWeight: 600 }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEEDBACK PREVIEW */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '56px 20px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '3px',
                backgroundColor: '#1e293b',
                color: '#94a3b8',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}
            >
              Illustrative Preview
            </div>
            <h2 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 700 }}>
              Actionable, Structured Feedback
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
              Instead of an arbitrary single number, evaluations provide itemized evidence, architectural concerns, and concrete suggestions.
            </p>
          </div>

          {/* PREVIEW CARD */}
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '820px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #1e293b',
                paddingBottom: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Evaluated Submission Preview</span>
                <h4 style={{ margin: '4px 0 0 0', color: '#f8fafc', fontSize: '16px' }}>
                  Parking Lot System — Attempt #1
                </h4>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: '#1e293b',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#f59e0b',
                  fontWeight: 600,
                }}
              >
                Overall Score: 7.4 / 10
              </div>
            </div>

            {/* CRITERION SAMPLE 1 */}
            <div
              style={{
                backgroundColor: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#f8fafc', fontSize: '14px' }}>Responsibilities</strong>
                <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600, fontSize: '13px' }}>
                  7 / 10
                </span>
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>Evidence: </span>
                  <span style={{ color: '#cbd5e1' }}>ParkingLot class delegates spot lookup to Floor, and Spot tracks vehicle occupancy.</span>
                </div>
                <div>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>Concern: </span>
                  <span style={{ color: '#cbd5e1' }}>ParkingLot directly handles cash collection and card processing along with gate control.</span>
                </div>
                <div>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>Suggestion: </span>
                  <span style={{ color: '#cbd5e1' }}>Extract a dedicated PaymentService or GateController boundary to keep ParkingLot cohesive.</span>
                </div>
              </div>
            </div>

            {/* CRITERION SAMPLE 2 */}
            <div
              style={{
                backgroundColor: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#f8fafc', fontSize: '14px' }}>Abstraction & Interfaces</strong>
                <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600, fontSize: '13px' }}>
                  8 / 10
                </span>
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>Evidence: </span>
                  <span style={{ color: '#cbd5e1' }}>Created IPricingStrategy with HourlyRateStrategy and WeekendRateStrategy implementations.</span>
                </div>
                <div>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>Concern: </span>
                  <span style={{ color: '#cbd5e1' }}>Ticket creation logic is coupled directly to the concrete Ticket class inside the entry gate.</span>
                </div>
                <div>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>Suggestion: </span>
                  <span style={{ color: '#cbd5e1' }}>Consider a factory method or TicketFactory interface if customized ticket formats are required later.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '72px 20px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '28px', color: '#f8fafc', margin: '0 0 12px 0', fontWeight: 700 }}>
            Ready to practice?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 28px 0' }}>
            Choose a problem, build your design, and iterate with feedback.
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
            Start Practicing
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};
