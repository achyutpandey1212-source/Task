import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0c0e12' }}>
      <Navbar activePage="settings" />

      <main style={{ flex: 1, padding: '48px 20px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 700 }}>
            Account Settings
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 32px 0' }}>
            Manage your authenticated account profile and active session.
          </p>

          {loading && (
            <div style={{ color: '#94a3b8', padding: '24px 0' }}>
              Loading profile details...
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '24px',
              }}
            >
              {error}
            </div>
          )}

          {!loading && user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* ACCOUNT SECTION */}
              <section
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h2 style={{ fontSize: '18px', color: '#f8fafc', margin: '0 0 16px 0', fontWeight: 600 }}>
                  Account Profile
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <div style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: 500 }}>
                      {user.name ? user.name : <span style={{ color: '#64748b' }}>Not specified</span>}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <div style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: 500, fontFamily: 'monospace' }}>
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                      Account ID
                    </label>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {user.id}
                    </div>
                  </div>
                </div>
              </section>

              {/* SESSION SECTION */}
              <section
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '24px',
                }}
              >
                <h2 style={{ fontSize: '18px', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 600 }}>
                  Active Session
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  You are currently authenticated. Terminating your session removes your token from local storage.
                </p>

                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#f87171',
                    border: '1px solid #7f1d1d',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  Log out of account
                </button>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
