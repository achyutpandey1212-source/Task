import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid #1e293b',
        backgroundColor: '#0c0e12',
        color: '#64748b',
        padding: '32px 20px',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>LLD Practice Experience</span>
          <span style={{ margin: '0 8px' }}>—</span>
          <span>A focused practice workspace for domain & low-level design</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" style={{ color: '#94a3b8' }}>Home</Link>
          <Link to="/how-it-works" style={{ color: '#94a3b8' }}>How It Works</Link>
          <Link to="/problems" style={{ color: '#94a3b8' }}>Problems</Link>
        </div>
      </div>
    </footer>
  );
};
