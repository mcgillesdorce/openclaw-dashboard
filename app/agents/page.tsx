'use client';

export default function Agents() {
  const agents = [
    { name: 'Psyche', emoji: '🧠', role: 'Pipeline Orchestration', status: 'live' },
    { name: 'Finch', emoji: '💰', role: 'Financial Analyst', status: 'live' },
    { name: 'Scout', emoji: '📖', role: 'Topic Discovery', status: 'live' },
    { name: 'Pulse', emoji: '📊', role: 'Performance Analytics', status: 'live' },
  ];

  return (
    <div>
      <div className="section-title mb-lg">🤖 Agent Status</div>

      <div className="grid g2 mb-2xl">
        {agents.map((agent) => (
          <div key={agent.name} className="panel">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '40px' }}>{agent.emoji}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{agent.name}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  {agent.role}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                  <span className="status-dot live" style={{ marginRight: '4px' }}></span>
                  Active
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Tasks</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#00d9ff' }}>—</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Success</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>—%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
