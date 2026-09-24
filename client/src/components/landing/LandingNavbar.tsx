import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { User } from '../../types';

interface LandingNavbarProps {
  activePage?: 'landing' | 'how-it-works' | 'problems' | 'attempts' | 'settings' | 'login';
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ activePage }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      authService
        .getMe()
        .then((res) => setUser(res.user))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <header
      style={{
        borderBottom: '2px solid #000000',
        backgroundColor: '#F4F3F3',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand identity: Editorial stamped label */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              backgroundColor: '#FEDE8C',
              border: '2px solid #000000',
              padding: '2px 8px',
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: '2px 2px 0px #000000',
            }}
          >
            LLD.
          </span>
          <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
            Practice Experience
          </span>
        </Link>

        {/* Minimal Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
          aria-label="Landing Navigation"
        >
          <Link
            to="/how-it-works"
            style={{
              color: activePage === 'how-it-works' ? '#000000' : '#444444',
              fontSize: '14px',
              fontWeight: activePage === 'how-it-works' ? 800 : 600,
              textDecoration: activePage === 'how-it-works' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
            }}
          >
            How It Works
          </Link>
          <Link
            to="/problems"
            style={{
              color: activePage === 'problems' ? '#000000' : '#444444',
              fontSize: '14px',
              fontWeight: activePage === 'problems' ? 800 : 600,
              textDecoration: activePage === 'problems' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
            }}
          >
            Problems
          </Link>

          {user ? (
            <>
              <Link
                to="/attempts"
                style={{
                  color: activePage === 'attempts' ? '#000000' : '#444444',
                  fontSize: '14px',
                  fontWeight: activePage === 'attempts' ? 800 : 600,
                  textDecoration: activePage === 'attempts' ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                My Attempts
              </Link>
              <Link
                to="/settings"
                style={{
                  color: activePage === 'settings' ? '#000000' : '#444444',
                  fontSize: '14px',
                  fontWeight: activePage === 'settings' ? 800 : 600,
                  textDecoration: activePage === 'settings' ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                Settings
              </Link>
              <Link
                to="/problems"
                style={{
                  backgroundColor: '#FEDE8C',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '2px 2px 0px #000000',
                  textDecoration: 'none',
                }}
              >
                Workspace →
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#333333',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
              <Link
                to="/problems"
                style={{
                  backgroundColor: '#FEDE8C',
                  color: '#000000',
                  border: '2px solid #000000',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '2px 2px 0px #000000',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                START PRACTICING →
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
