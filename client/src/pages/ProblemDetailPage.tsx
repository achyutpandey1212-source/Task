import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { attemptService } from '../services/attemptService';
import { authService } from '../services/authService';
import { Problem } from '../types';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await problemService.getById(id);
        setProblem(data);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleStartAttempt = async () => {
    if (!problem) return;

    if (!authService.getToken()) {
      alert('You must sign in before starting an attempt.');
      navigate('/login');
      return;
    }

    try {
      setStarting(true);
      setError(null);
      const attempt = await attemptService.create(problem.id);
      navigate(`/attempts/${attempt.id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message || err.message || 'Failed to create attempt'
      );
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <p>Loading problem details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: 'red' }}>Error: {error || 'Problem not found'}</p>
        <Link to="/problems">← Back to Problems</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <p>
        <Link to="/problems">← Back to Problems</Link> | <Link to="/attempts">My Attempts</Link>
      </p>
      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{problem.title}</h1>
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

      <section style={{ margin: '16px 0' }}>
        <h3>Description</h3>
        <p>{problem.description}</p>
      </section>

      <section style={{ margin: '16px 0' }}>
        <h3>Functional Requirements</h3>
        <ol>
          {problem.requirements.map((req, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }}>
              {req}
            </li>
          ))}
        </ol>
      </section>

      {problem.constraints && problem.constraints.length > 0 && (
        <section style={{ margin: '16px 0' }}>
          <h3>Constraints & Clarifications</h3>
          <ul>
            {problem.constraints.map((c, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr />

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={handleStartAttempt}
          disabled={starting}
          style={{
            padding: '10px 20px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: starting ? 'not-allowed' : 'pointer',
          }}
        >
          {starting ? 'Initializing Attempt...' : 'Start New Attempt'}
        </button>
      </div>
    </div>
  );
};
