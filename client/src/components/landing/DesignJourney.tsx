import React from 'react';
import { TornPaper } from './TornPaper';

export interface JourneyStage {
  step: string;
  name: string;
  desc: string;
  color: 'yellow' | 'lavender' | 'white';
  rotation: number;
}

const defaultStages: JourneyStage[] = [
  { step: '01', name: 'CHOOSE', desc: 'Select from canonical LLD challenges.', color: 'lavender', rotation: -1 },
  { step: '02', name: 'THINK', desc: 'Analyze actors, state, and boundary rules.', color: 'white', rotation: 0.8 },
  { step: '03', name: 'DESIGN', desc: 'Structure classes, contracts & relationships.', color: 'yellow', rotation: -0.7 },
  { step: '04', name: 'SUBMIT', desc: 'Lock in your design decisions.', color: 'white', rotation: 0.5 },
  { step: '05', name: 'FEEDBACK', desc: 'Get rubric-grounded evidence & suggestions.', color: 'lavender', rotation: -0.8 },
  { step: '06', name: 'TRY AGAIN', desc: 'Iterate on weaknesses in a new attempt.', color: 'yellow', rotation: 1.2 },
];

export const DesignJourney: React.FC<{ stages?: JourneyStage[] }> = ({ stages = defaultStages }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '20px',
        alignItems: 'stretch',
        position: 'relative',
      }}
    >
      {stages.map((stage) => (
        <TornPaper
          key={stage.step}
          color={stage.color}
          rotation={stage.rotation}
          tornEdges="both"
          style={{
            padding: '24px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1.5px solid #000000',
            minHeight: '160px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 700,
                color: '#000000',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{stage.step}</span>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                STAGE
              </span>
            </div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#000000',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
              }}
            >
              {stage.name}
            </h3>
          </div>
          <p
            style={{
              fontSize: '13px',
              lineHeight: 1.45,
              color: '#333333',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {stage.desc}
          </p>
        </TornPaper>
      ))}
    </div>
  );
};
