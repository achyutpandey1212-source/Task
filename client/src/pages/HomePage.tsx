import React, { useEffect, useState } from 'react';
import { healthService } from '../services/healthService';
import { authService } from '../services/authService';
import { HealthResponse, User } from '../types';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const data = await healthService.getHealth();
      setHealth(data);
    } catch (err: unknown) {
      setHealthError((err as Error).message || 'Failed to reach backend');
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchUser = async () => {
    const token = authService.getToken();
    if (!token) {
      setCurrentUser(null);
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authService.getMe();
      setCurrentUser(data.user);
    } catch (err: unknown) {
      setAuthError('Failed to verify session or token expired');
      setCurrentUser(null);
      authService.logout();
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>LLD Practice Platform — Engineering Shell (Phase 1)</h1>
      <hr />

      <section style={{ margin: '16px 0', padding: '16px', border: '1px solid #ccc' }}>
        <h2>1. System Connectivity Status</h2>
        <button onClick={fetchHealth} disabled={healthLoading}>
          {healthLoading ? 'Checking...' : 'Refresh Health'}
        </button>

        <div style={{ marginTop: '12px' }}>
          <div>
            <strong>Backend status: </strong>
            {healthLoading
              ? 'Checking...'
              : health
              ? `Connected (${health.status})`
              : `Not connected (${healthError || 'Error'})`}
          </div>
          <div>
            <strong>MongoDB status: </strong>
            {healthLoading
              ? 'Checking...'
              : health?.database === 'connected'
              ? 'Connected'
              : 'Disconnected'}
          </div>
          {health && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
              Timestamp: {health.timestamp} | Uptime: {Math.round(health.uptime)}s
            </div>
          )}
        </div>
      </section>

      <section style={{ margin: '16px 0', padding: '16px', border: '1px solid #ccc' }}>
        <h2>2. Authentication Status</h2>
        <button onClick={fetchUser} disabled={authLoading}>
          {authLoading ? 'Verifying...' : 'Check Session (/api/auth/me)'}
        </button>

        <div style={{ marginTop: '12px' }}>
          {authLoading ? (
            <div>Checking authentication...</div>
          ) : currentUser ? (
            <div>
              <p style={{ color: 'green', fontWeight: 'bold' }}>Authentication: [Signed in]</p>
              <div><strong>User ID:</strong> {currentUser.id}</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
              <div><strong>Name:</strong> {currentUser.name || '(none)'}</div>
              <button onClick={handleLogout} style={{ marginTop: '10px' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'gray' }}>Authentication: [Signed out]</p>
              {authError && <div style={{ color: 'red' }}>{authError}</div>}
              <p>Go to <a href="/login">/login</a> to sign up or sign in.</p>
            </div>
          )}
        </div>
      </section>

      <section style={{ margin: '16px 0', padding: '16px', border: '1px solid #ccc' }}>
        <h2>3. Quick Navigation</h2>
        <ul>
          <li><a href="/">/ (Home / Status)</a></li>
          <li><a href="/login">/login (Test Sign In / Sign Up)</a></li>
          <li><a href="/problems">/problems (Stub for Phase 2)</a></li>
        </ul>
      </section>
    </div>
  );
};
