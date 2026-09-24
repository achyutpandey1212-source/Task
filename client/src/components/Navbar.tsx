import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types';

interface NavbarProps {
  activePage?: 'landing' | 'how-it-works' | 'problems' | 'attempts' | 'settings' | 'login';
}

export const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? '#f59e0b' : '#94a3b8',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.15s ease',
  });

  return (
    <header
      style={{
        borderBottom: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: '#f59e0b',
              borderRadius: '2px',
            }}
          />
          LLD Practice
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
          aria-label="Main Navigation"
        >
          <Link to="/how-it-works" style={navLinkStyle(activePage === 'how-it-works')}>
            How It Works
          </Link>
          <Link to="/problems" style={navLinkStyle(activePage === 'problems')}>
            Problems
          </Link>

          {!loading && user && (
            <>
              <Link to="/attempts" style={navLinkStyle(activePage === 'attempts')}>
                My Attempts
              </Link>
              <Link to="/settings" style={navLinkStyle(activePage === 'settings')}>
                Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Log out
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link to="/login" style={navLinkStyle(activePage === 'login')}>
                Sign In
              </Link>
              <Link
                to="/problems"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Start Practicing
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
