import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../services/attemptService';
import { Attempt, Problem } from '../types';

export const AttemptsHistoryPage: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const data = await attemptService.getAll();
        setAttempts(data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || err.message || 'Failed to load attempts');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Attempt History</h1>
      <p>
        <Link to="/">← Back to Home</Link> | <Link to="/problems">Browse Problems</Link> | <Link to="/settings">Settings</Link>
      </p>
      <hr />

      {loading && <p>Loading your attempts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && attempts.length === 0 && (
        <div style={{ margin: '20px 0' }}>
          <p>You have not started any attempts yet.</p>
          <Link to="/problems">
            <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Browse Problems</button>
          </Link>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {attempts.map((att) => {
          const problemTitle =
            typeof att.problemId === 'object' && att.problemId !== null
              ? (att.problemId as Problem).title
              : 'Problem';
          const isSubmitted = att.status === 'SUBMITTED';

          return (
            <div
              key={att.id}
              style={{
                border: '1px solid #ccc',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 6px 0' }}>{problemTitle}</h3>
                <div style={{ fontSize: '13px', color: '#444' }}>
                  Started: {new Date(att.startedAt).toLocaleString()}
                </div>
                {att.submittedAt && (
                  <div style={{ fontSize: '13px', color: '#444' }}>
                    Submitted: {new Date(att.submittedAt).toLocaleString()}
                  </div>
                )}
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: '1px solid',
                      borderColor: isSubmitted ? 'green' : 'orange',
                      color: isSubmitted ? 'green' : '#b25900',
                    }}
                  >
                    {att.status}
                  </span>
                </div>
              </div>

              <div>
                <Link to={`/attempts/${att.id}`}>
                  <button style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    {isSubmitted ? 'View Submission' : 'Continue Draft'}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
