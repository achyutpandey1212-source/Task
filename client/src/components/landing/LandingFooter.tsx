import React from 'react';
import { Link } from 'react-router-dom';
import { SketchStar } from './HandDrawnDoodles';

export const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '2px solid #000000',
        backgroundColor: '#F4F3F3',
        padding: '48px 24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#FEDE8C',
                border: '2px solid #000000',
                padding: '2px 8px',
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: '2px 2px 0px #000000',
              }}
            >
              LLD.
            </span>
            <span style={{ fontWeight: 800, fontSize: '16px' }}>Practice Experience</span>
          </div>
          <div style={{ fontSize: '13px', color: '#666666', fontFamily: "'JetBrains Mono', monospace" }}>
            Practice. Design. Review. Repeat.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Link to="/problems" style={{ color: '#000000', fontWeight: 600, fontSize: '14px' }}>
            Problems
          </Link>
          <Link to="/how-it-works" style={{ color: '#000000', fontWeight: 600, fontSize: '14px' }}>
            How It Works
          </Link>
          <Link to="/login" style={{ color: '#000000', fontWeight: 600, fontSize: '14px' }}>
            Login
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="font-hand" style={{ fontSize: '18px', color: '#333333' }}>
            crafted for engineers
          </span>
          <SketchStar size={24} />
          <span style={{ fontSize: '12px', color: '#888888', fontFamily: 'monospace' }}>
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
};
