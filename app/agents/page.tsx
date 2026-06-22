export const revalidate = 30;

const AGENTS = [
  { name: 'Psyche', emoji: '🧠', role: 'Pipeline Orchestration' },
  { name: 'Finch', emoji: '💰', role: 'Financial Analyst' },
  { name: 'Scout', emoji: '📖', role: 'Topic Discovery' },
  { name: 'Pulse', emoji: '📊', role: 'Performance Analytics' },
];

export default function Agents() {
  return (
    <div>
      <div className="section-title mb-lg">🤖 Agent Status</div>
      <div className="grid g2 mb-2xl">
        {AGENTS.map((agent) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}
