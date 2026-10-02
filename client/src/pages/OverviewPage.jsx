import { useEffect, useMemo, useState } from 'react';
import { apiRequest, clearStoredToken, getStoredToken } from '../lib/api.js';

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      setError('Please log in to view your dashboard.');
      return;
    }

    apiRequest('/api/stats')
      .then((data) => {
        setStats(data);
        setError('');
      })
      .catch((requestError) => {
        if (requestError.message.toLowerCase().includes('authentication') || requestError.message.toLowerCase().includes('token')) {
          clearStoredToken();
        }
        setError(requestError.message || 'Unable to load statistics.');
      });
  }, []);

  const statCards = useMemo(() => {
    if (!stats) {
      return [
        { label: 'Workdays', value: '—' },
        { label: 'Logged days', value: '—' },
        { label: 'Open reminders', value: '—' },
        { label: 'Overdue', value: '—' },
      ];
    }

    return [
      { label: 'Workdays', value: `${stats.days_logged ?? 0} / ${stats.workday_count ?? 0}` },
      { label: 'Logged days', value: String(stats.days_logged ?? 0) },
      { label: 'Open reminders', value: String(stats.open_reminders ?? 0) },
      { label: 'Overdue', value: String(stats.overdue_reminders ?? 0) },
    ];
  }, [stats]);

  return (
    <section className="page">
      <h1>Overview</h1>

      {error ? <p role="alert">{error}</p> : null}

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Progress</h2>
        <div className="progress-bar">
          <span
            style={{
              width: stats ? `${Math.min((Number(stats.days_logged ?? 0) / Math.max(Number(stats.workday_count ?? 1), 1)) * 100, 100)}%` : '0%',
            }}
          ></span>
        </div>
      </div>

      <div className="panel">
        <h2>Next deadlines</h2>
        <p>{stats && Number(stats.open_reminders ?? 0) > 0 ? 'Your reminders are available in the reminders page.' : 'No reminders yet.'}</p>
      </div>
    </section>
  );
}
