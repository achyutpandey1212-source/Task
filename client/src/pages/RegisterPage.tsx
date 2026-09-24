import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { TornPaper } from '../components/landing/TornPaper';
import { Tape, PushPin } from '../components/landing/TactileAccents';
import { SketchStar } from '../components/landing/HandDrawnDoodles';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await authService.register(email.trim(), password, name.trim() || undefined);
      navigate('/problems');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Couldn't set up your notebook. Please check your information and try again.";
      setError(msg);
      setLoading(false);
    }
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
      <LandingNavbar activePage="login" />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px 80px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
          {/* Handwritten Annotation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingLeft: '8px',
            }}
          >
            <span
              className="font-hand"
              style={{
                fontSize: '22px',
                color: '#333333',
                transform: 'rotate(-1.5deg)',
              }}
            >
              everyone starts somewhere →
            </span>
            <SketchStar size={22} />
          </div>

          {/* Registration Card Paper Sheet */}
          <TornPaper
            color="white"
            rotation={0.4}
            tornEdges="both"
            style={{
              padding: 'clamp(28px, 5vw, 44px) clamp(20px, 4vw, 36px)',
              border: '2px solid #000000',
              boxShadow: '6px 6px 0px #000000',
              position: 'relative',
            }}
          >
            <Tape rotation={3} style={{ top: '-12px', right: '36px' }} />
            <PushPin color="#D5BDFF" style={{ top: '16px', left: '20px' }} />

            {/* Label & Header */}
            <div style={{ marginBottom: '24px', borderBottom: '2px solid #000000', paddingBottom: '16px' }}>
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
                AUTH / 02
              </div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#000000',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                START YOUR NOTEBOOK.
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#555555' }}>
                Practice designing systems. Learn from trade-offs. Try again.
              </p>
            </div>

            {/* Error Notice */}
            {error && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #dc2626',
                  color: '#991b1b',
                  padding: '12px 14px',
                  fontSize: '13px',
                  lineHeight: 1.45,
                  marginBottom: '20px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <strong>REGISTRATION ERROR:</strong> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="register-name"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    color: '#000000',
                  }}
                >
                  Name (Optional)
                </label>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1.5px solid #000000',
                    backgroundColor: '#F8FAFC',
                    color: '#000000',
                    borderRadius: '2px',
                  }}
                  placeholder="Ada Lovelace"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="register-email"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    color: '#000000',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1.5px solid #000000',
                    backgroundColor: '#F8FAFC',
                    color: '#000000',
                    borderRadius: '2px',
                  }}
                  placeholder="engineer@domain.com"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="register-password"
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    color: '#000000',
                  }}
                >
                  Password (Minimum 6 Characters)
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1.5px solid #000000',
                    backgroundColor: '#F8FAFC',
                    color: '#000000',
                    borderRadius: '2px',
                  }}
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#FEDE8C',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '12px 20px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '3px 3px 0px #000000',
                  marginBottom: '20px',
                  transition: 'transform 0.1s ease',
                }}
              >
                {loading ? 'SETTING UP YOUR NOTEBOOK...' : 'CREATE NOTEBOOK →'}
              </button>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#555555',
                  borderTop: '1px dashed #CCCCCC',
                  paddingTop: '16px',
                }}
              >
                <span>Already have an account? </span>
                <Link
                  to="/login"
                  style={{
                    color: '#000000',
                    fontWeight: 800,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Enter the notebook →
                </Link>
              </div>
            </form>
          </TornPaper>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
