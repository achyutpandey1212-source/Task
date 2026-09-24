import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const NotFoundPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0e12' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '64px',
            fontWeight: 800,
            color: '#f59e0b',
            letterSpacing: '-0.04em',
            margin: '0 0 12px 0',
          }}
        >
          404
        </div>

        <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '0 0 12px 0', fontWeight: 700 }}>
          This page doesn't exist.
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#94a3b8',
            margin: '0 0 32px 0',
            maxWidth: '440px',
            lineHeight: 1.5,
          }}
        >
          The page you're looking for isn't available or may have moved.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Link
              to="/problems"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to Problems
            </Link>
          ) : (
            <Link
              to="/"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to Home
            </Link>
          )}

          <Link
            to="/how-it-works"
            style={{
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid #334155',
            }}
          >
            How It Works
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
