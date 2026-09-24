import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        await authService.register(email, password, name || undefined);
        setSuccess('Registration successful! Redirecting...');
      } else {
        await authService.login(email, password);
        setSuccess('Login successful! Redirecting...');
      }
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err.message ||
        'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{isRegister ? 'Test Sign Up' : 'Test Sign In'}</h1>
      <p><a href="/">← Back to System Status</a></p>
      <hr />

      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        {isRegister && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block' }}>Name (optional):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              placeholder="Your name"
            />
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="test@example.com"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block' }}>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Minimum 6 characters"
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '12px', padding: '8px', border: '1px solid red' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: 'green', marginBottom: '12px', padding: '8px', border: '1px solid green' }}>
            {success}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ padding: '8px 16px', marginRight: '10px' }}>
          {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
            setSuccess(null);
          }}
          style={{ padding: '8px 16px' }}
        >
          Switch to {isRegister ? 'Sign In' : 'Register'}
        </button>
      </form>
    </div>
  );
};
