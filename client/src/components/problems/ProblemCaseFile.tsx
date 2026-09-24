import React from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../../types';
import { TornPaper } from '../landing/TornPaper';
import { Tape, PushPin } from '../landing/TactileAccents';

interface ProblemCaseFileProps {
  problem: Problem;
  index: number;
}

export const ProblemCaseFile: React.FC<ProblemCaseFileProps> = ({ problem, index }) => {
  // Rotations varied slightly (-0.8deg to +0.8deg) for natural notebook imperfection
  const rotations = [-0.6, 0.4, -0.8, 0.5, -0.3, 0.7];
  const rot = rotations[index % rotations.length];

  // Alternating palette: 1st Lavender, 2nd White, 3rd Lavender, 4th Yellow, etc.
  const colors: ('lavender' | 'white' | 'yellow')[] = ['lavender', 'white', 'lavender', 'yellow'];
  const paperColor = colors[index % colors.length];

  const caseNumber = String(index + 1).padStart(2, '0');

  // Derive preview requirements: first 3
  const previewRequirements = problem.requirements.slice(0, 3);
  const remainingRequirementsCount = Math.max(0, problem.requirements.length - 3);

  // Difficulty badge styling
  const difficultyStyles: Record<string, { bg: string; text: string }> = {
    easy: { bg: '#bbf7d0', text: '#14532d' },
    medium: { bg: '#FEDE8C', text: '#000000' },
    hard: { bg: '#fecaca', text: '#7f1d1d' },
  };

  const diffStyle = difficultyStyles[problem.difficulty.toLowerCase()] || difficultyStyles.medium;

  return (
    <article
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TornPaper
        color={paperColor}
        rotation={rot}
        tornEdges="both"
        style={{
          padding: '32px 24px',
          border: '2px solid #000000',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {/* Subtle decorative tape or push pin based on index */}
        {index % 3 === 0 && <Tape rotation={-4} style={{ top: '-12px', left: '32px' }} />}
        {index % 3 === 1 && <PushPin color="#D5BDFF" style={{ top: '14px', right: '20px' }} />}
        {index % 3 === 2 && <Tape rotation={3} style={{ top: '-12px', right: '32px' }} />}

        <div>
          {/* Header row: Case File # and Difficulty Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '2px 8px',
                letterSpacing: '0.04em',
              }}
            >
              CASE FILE #{caseNumber}
            </span>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: diffStyle.bg,
                color: diffStyle.text,
                padding: '2px 8px',
                border: '1.5px solid #000000',
                boxShadow: '1px 1px 0px #000000',
              }}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#000000',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            {problem.title}
          </h2>

          {/* Description (concise) */}
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.55,
              color: '#222222',
              margin: '0 0 20px 0',
              fontWeight: 500,
            }}
          >
            {problem.description}
          </p>

          {/* Requirements Preview Sheet */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #000000',
              padding: '14px',
              marginBottom: '20px',
              borderRadius: '2px',
              boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 800,
                color: '#555555',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
                borderBottom: '1px solid #E7E5E5',
                paddingBottom: '4px',
              }}
            >
              REQUIREMENTS SPEC ({problem.requirements.length} TOTAL)
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: '18px',
                fontSize: '12px',
                lineHeight: 1.5,
                color: '#222222',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {previewRequirements.map((req, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {req}
                </li>
              ))}
            </ul>

            {remainingRequirementsCount > 0 && (
              <div
                style={{
                  fontSize: '11px',
                  color: '#666666',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '6px',
                  fontStyle: 'italic',
                }}
              >
                + {remainingRequirementsCount} more in full case specification...
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ paddingTop: '8px', borderTop: '1.5px dashed rgba(0,0,0,0.2)' }}>
          <Link
            to={`/problems/${problem.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              backgroundColor: paperColor === 'yellow' ? '#000000' : '#FEDE8C',
              color: paperColor === 'yellow' ? '#FFFFFF' : '#000000',
              border: '2px solid #000000',
              padding: '10px 16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '3px 3px 0px #000000',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
          >
            OPEN CASE FILE →
          </Link>
        </div>
      </TornPaper>
    </article>
  );
};
