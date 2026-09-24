import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape, PushPin } from '../components/landing/TactileAccents';
import { SketchStar, SketchDashes } from '../components/landing/HandDrawnDoodles';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    authService
      .getMe()
      .then((data) => {
        setUser(data.user);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.error?.message || err.message || 'Session expired');
        authService.logout();
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

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
      <LandingNavbar activePage="settings" />

      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '56px 24px 80px',
          }}
        >
          {/* Handwritten Annotation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              className="font-hand"
              style={{
                fontSize: '24px',
                color: '#333333',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
              }}
            >
              keep things in order.
            </span>
            <SketchDashes />
          </div>

          {/* Section Header */}
          <div
            style={{
              borderBottom: '2px solid #000000',
              paddingBottom: '20px',
              marginBottom: '36px',
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
                marginBottom: '8px',
              }}
            >
              UTILITY / CONFIGURATION
            </div>
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              SETTINGS
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#444444' }}>
              Manage your authenticated account profile and session.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '36px 0' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 800 }}>
                LOADING ACCOUNT SPECIFICATION...
              </div>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #dc2626',
                color: '#991b1b',
                padding: '12px 16px',
                fontSize: '13px',
                marginBottom: '24px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <strong>ERROR:</strong> {error}
            </div>
          )}

          {!loading && user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Account Section */}
              <TornPaper
                color="white"
                rotation={-0.3}
                tornEdges="both"
                style={{
                  padding: '32px 28px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  position: 'relative',
                }}
              >
                <Tape rotation={-2} style={{ top: '-12px', left: '32px' }} />
                <PushPin color="#FEDE8C" style={{ top: '14px', right: '20px' }} />

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '1.5px solid #000000',
                    paddingBottom: '8px',
                    marginBottom: '20px',
                  }}
                >
                  ACCOUNT PROFILE
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#666666',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Full Name
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                      {user.name ? user.name : <span style={{ color: '#888888', fontStyle: 'italic' }}>Not specified</span>}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#666666',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Email Address
                    </label>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#000000',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#666666',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Unique Account ID
                    </label>
                    <div
                      style={{
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#555555',
                      }}
                    >
                      {user.id}
                    </div>
                  </div>
                </div>
              </TornPaper>

              {/* Session Section */}
              <TornPaper
                color="lavender"
                rotation={0.4}
                tornEdges="both"
                style={{
                  padding: '28px 28px',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px #000000',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '1.5px solid #000000',
                    paddingBottom: '8px',
                    marginBottom: '14px',
                  }}
                >
                  ACTIVE SESSION
                </div>

                <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: 1.5, color: '#222222' }}>
                  You are currently authenticated on this machine. Logging out will clear your authorization token from local storage.
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#991b1b',
                    border: '2px solid #000000',
                    padding: '10px 22px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #000000',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  LOG OUT OF NOTEBOOK
                </button>
              </TornPaper>

              {/* Bottom decorative anchor */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <SketchStar size={20} />
              </div>
            </div>
          )}
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};
