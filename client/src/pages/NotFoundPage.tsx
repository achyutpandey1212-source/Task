import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape } from '../components/landing/TactileAccents';
import { SketchStar } from '../components/landing/HandDrawnDoodles';

export const NotFoundPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
  }, []);

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

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
          {/* Handwritten Annotation */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '24px',
                color: '#333333',
                transform: 'rotate(-2deg)',
                display: 'inline-block',
              }}
            >
              hmm... wrong folder.
            </span>
          </div>

          <TornPaper
            color="white"
            rotation={-0.5}
            tornEdges="both"
            style={{
              padding: '44px 32px',
              border: '2px solid #000000',
              boxShadow: '6px 6px 0px #000000',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Tape rotation={-3} style={{ top: '-12px', left: '40px' }} />

            {/* Technical Sketch Box */}
            <div
              style={{
                border: '1.5px dashed #000000',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: '24px',
                display: 'inline-block',
              }}
            >
              <div style={{ fontSize: '11px', color: '#666666' }}>CASE FILE #???</div>
              <div
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: '#991b1b',
                  letterSpacing: '0.05em',
                  margin: '4px 0',
                }}
              >
                404
              </div>
              <div
                style={{
                  backgroundColor: '#FEDE8C',
                  border: '1px solid #000000',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'inline-block',
                }}
              >
                [ FILE MISSING ]
              </div>
            </div>

            <h1
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#000000',
                margin: '0 0 10px 0',
                letterSpacing: '-0.01em',
              }}
            >
              CASE FILE NOT FOUND.
            </h1>

            <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.5, margin: '0 0 28px 0' }}>
              Looks like this page escaped the filing cabinet. It may have moved or was never drafted.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/problems"
                style={{
                  backgroundColor: '#FEDE8C',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '12px 22px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #000000',
                }}
              >
                BROWSE CASE FILES →
              </Link>

              <Link
                to={isAuthenticated ? '/problems' : '/'}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '12px 22px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #000000',
                }}
              >
                GO HOME
              </Link>
            </div>
          </TornPaper>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <SketchStar size={20} />
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
