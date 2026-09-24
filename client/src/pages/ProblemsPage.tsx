import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { Problem } from '../types';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const data = await problemService.getAll();
        setProblems(data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || err.message || 'Failed to load problems');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Low-Level Design (LLD) Problems</h1>
      <p>
        <Link to="/">← Back to Home</Link> | <Link to="/how-it-works">How It Works</Link> | <Link to="/attempts">My Attempts History</Link>
      </p>
      <hr />

      {loading && <p>Loading problems...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && problems.length === 0 && (
        <p>No problems found. Run `npm run db:seed` on the server.</p>
      )}

      <div style={{ marginTop: '20px' }}>
        {problems.map((problem) => (
          <div
            key={problem.id}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: '0 0 8px 0' }}>{problem.title}</h2>
              <span
                style={{
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  border: '1px solid #999',
                }}
              >
                {problem.difficulty}
              </span>
            </div>
            <p style={{ margin: '8px 0' }}>{problem.description}</p>
            <div style={{ fontSize: '13px', color: '#555', margin: '8px 0' }}>
              <strong>Key Requirements:</strong> {problem.requirements.length} requirements defined
            </div>
            <div style={{ marginTop: '12px' }}>
              <Link to={`/problems/${problem.id}`}>
                <button style={{ padding: '6px 12px', cursor: 'pointer' }}>View Problem Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
