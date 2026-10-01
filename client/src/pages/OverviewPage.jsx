const stats = [
  { label: 'Workdays', value: '0 / 0' },
  { label: 'Logged days', value: '0' },
  { label: 'Open reminders', value: '0' },
  { label: 'Overdue', value: '0' },
];

export default function OverviewPage() {
  return (
    <section className="page">
      <h1>Overview</h1>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Progress</h2>
        <div className="progress-bar">
          <span style={{ width: '0%' }}></span>
        </div>
      </div>

      <div className="panel">
        <h2>Next deadlines</h2>
        <p>No reminders yet.</p>
      </div>
    </section>
  );
}
