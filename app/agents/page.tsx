'use client';

import { useEffect, useState } from 'react';
import { AgentAvatar } from '../components/AgentAvatar';

interface AgentStatus {
  name: string;
  emoji: string;
  role: string;
  status: 'idle' | 'working' | 'awaiting_approval';
  current_task?: string;
  pending_approvals?: number;
}

export default function Agents() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Psyche', emoji: '🧠', role: 'Pipeline Orchestration', status: 'idle', current_task: 'Monitoring pipeline', pending_approvals: 8 },
    { name: 'Finch', emoji: '💰', role: 'Financial Analyst', status: 'idle', current_task: 'Cost analysis', pending_approvals: 2 },
    { name: 'Scout', emoji: '📖', role: 'Topic Discovery', status: 'idle', current_task: 'Researching topics', pending_approvals: 0 },
    { name: 'Pulse', emoji: '📊', role: 'Performance Analytics', status: 'idle', current_task: 'Tracking metrics', pending_approvals: 1 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/recommendations');
        if (res.ok) {
          const recs = await res.json();
          const pendingByAgent = recs.reduce((acc: Record<string, number>, r: any) => {
            const agent = r.agent?.toLowerCase() || 'psyche';
            acc[agent] = (acc[agent] || 0) + (r.status === 'pending_approval' ? 1 : 0);
            return acc;
          }, {});

          setAgents(prev => prev.map(agent => ({
            ...agent,
            pending_approvals: pendingByAgent[agent.name.toLowerCase()] || 0
          })));
        }
      } catch (err) {
        console.error('Fetch agent status failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading agent status...</div>;

  return (
    <div>
      <div className="section-title mb-lg">🤖 Agent Status</div>
      <div className="grid g2 mb-2xl">
        {agents.map((agent) => (
          <div key={agent.name} className="panel">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'start', marginBottom: '16px' }}>
              <AgentAvatar 
                agent={agent.name.toLowerCase() as 'finch' | 'scout' | 'pulse' | 'psyche'} 
                size="md" 
                status={agent.status}
                showLabel={false}
                pendingCount={agent.pending_approvals || 0}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>{agent.name}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {agent.role}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {agent.current_task}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-secondary)' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: agent.status === 'working' ? '#00aa44' : agent.status === 'awaiting_approval' ? '#cc0033' : '#888888',
                  marginTop: '2px'
                }}>
                  {agent.status === 'working' ? '🟢 Working' : agent.status === 'awaiting_approval' ? '🔴 Pending' : '⚪ Idle'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: agent.pending_approvals && agent.pending_approvals > 0 ? '#cc0033' : '#10b981', marginTop: '2px' }}>
                  {agent.pending_approvals || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
