'use client';

const STATIC_SCHEDULE = [
  { time: '08:00', ampm: 'AM', agent: 'Finch', icon: '💰', task: 'Morning cost analysis' },
  { time: '10:00', ampm: 'AM', agent: 'Scout', icon: '📖', task: 'Topic research & trends' },
  { time: '12:00', ampm: 'PM', agent: 'Psyche', icon: '🎬', task: 'Pipeline review & approval' },
  { time: '14:00', ampm: 'PM', agent: 'Pulse', icon: '📊', task: 'Analytics & insights' },
  { time: '16:00', ampm: 'PM', agent: 'Finch', icon: '💰', task: 'Evening cost analysis' },
  { time: '18:00', ampm: 'PM', agent: 'Scout', icon: '📖', task: 'Content discovery' },
  { time: '20:00', ampm: 'PM', agent: 'Psyche', icon: '⚙️', task: 'Evening state sync' },
];

export default function SchedulePage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', marginBottom: '32px' }}>
      <div>
        <div className="panel" style={{ position: 'sticky', top: '80px' }}>
          <div className="section-title" style={{ marginBottom: '20px' }}>📅 Daily Schedule</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STATIC_SCHEDULE.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}>
                <div><div style={{ fontFamily: "'Monaco', 'Courier New', monospace", fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '14px' }}>{item.time}</div><div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.ampm}</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '14px' }}>{item.icon}</span><div style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>{item.agent}</div></div><div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.task}</div></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-primary)' }}>
            <div className="section-title" style={{ marginTop: 0 }}>Legend</div>
            <div style={{ fontSize: '12px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <div>💰 = Financial checks</div>
              <div>📖 = Topic research</div>
              <div>📊 = Analytics</div>
              <div>🎬 = Content gen</div>
              <div>⚙️ = System tasks</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="section">
          <div className="section-title">Today's Activity</div>
          <div className="panel" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
            <div>Live activity loads from GitHub schedule_data.json</div>
            <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>Updates every 30 seconds</div>
          </div>
        </div>
        <div className="grid g3">
          <div className="stat-box">
            <div className="stat-label">✅ Tasks</div>
            <div className="stat-value">—</div>
            <div className="stat-note">completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💳 Daily Cost</div>
            <div className="stat-value">$—</div>
            <div className="stat-note">today</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🚨 Errors</div>
            <div className="stat-value">—</div>
            <div className="stat-note">incidents</div>
          </div>
        </div>
      </div>
    </div>
  );
}
