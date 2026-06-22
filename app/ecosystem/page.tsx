'use client';

import { useEffect, useState } from 'react';
import { AgentAvatar, AgentGrid } from '../components/AgentAvatar';
import { ETClock } from '../components/ETClock';

interface AgentActivity {
  agent: string;
  status: 'idle' | 'working' | 'awaiting_approval';
  current_task?: string;
  last_completed?: string;
  pending_approvals?: number;
}

const workspaceConfig = {
  finch: {
    title: "💰 War Room",
    subtitle: "Financial Command Post",
    color: "#10b981",
    metrics: [
      { label: 'Monthly Spend', value: '$112.70', status: 'ACTIVE' },
      { label: 'Budget Status', value: '41.0%', status: 'HEALTHY' },
      { label: 'Pending Alerts', value: '2', status: 'WATCH' }
    ]
  },
  scout: {
    title: "📖 Research Lab",
    subtitle: "Topic Discovery & Analysis",
    color: "#3b82f6",
    metrics: [
      { label: 'Topics Researched', value: '12', status: 'ACTIVE' },
      { label: 'Pending Ideas', value: '5', status: 'WATCH' },
      { label: 'Trend Strength', value: 'HIGH', status: 'ACTIVE' }
    ]
  },
  pulse: {
    title: "📊 Analytics Hub",
    subtitle: "Performance & Engagement Tracking",
    color: "#f59e0b",
    metrics: [
      { label: 'Videos Tracked', value: '47', status: 'ACTIVE' },
      { label: 'Avg Engagement', value: '6.2%', status: 'ACTIVE' },
      { label: 'Trend Analysis', value: '↗️ UP', status: 'ACTIVE' }
    ]
  },
  psyche: {
    title: "🧠 Command Center",
    subtitle: "Operations Coordination",
    color: "#a855f7",
    metrics: [
      { label: 'Active Agents', value: '4/4', status: 'ACTIVE' },
      { label: 'Pending Decisions', value: '8', status: 'WATCH' },
      { label: 'System Health', value: '100%', status: 'ACTIVE' }
    ]
  }
};

export default function EcosystemPage() {
  const [activities, setActivities] = useState<AgentActivity[]>([
    { agent: 'Finch', status: 'idle', current_task: 'Monitoring daily budget', pending_approvals: 2 },
    { agent: 'Scout', status: 'idle', current_task: 'Analyzing topic trends', pending_approvals: 0 },
    { agent: 'Pulse', status: 'idle', current_task: 'Computing engagement metrics', pending_approvals: 1 },
    { agent: 'Psyche', status: 'working', current_task: 'Coordinating approvals', pending_approvals: 0 }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<string>('psyche');

  useEffect(() => {
    // Simulate activity updates
    const interval = setInterval(() => {
      setActivities(prev =>
        prev.map(a => ({
          ...a,
          status: Math.random() > 0.7 ? 'working' : a.status === 'working' ? 'idle' : a.status
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statuses = activities.reduce((acc, a) => ({
    ...acc,
    [a.agent.toLowerCase()]: a.status
  }), {}) as Record<string, any>;

  const workspace = workspaceConfig[selectedAgent.toLowerCase() as keyof typeof workspaceConfig];

  return (
    <div>
      {/* System Status Bar */}
      <div style={{ padding: '16px', background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)', borderBottom: '1px solid var(--border-neon)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🌐 AGENT ECOSYSTEM
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time agent workspace coordination
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)' }}>
            ✅ ALL SYSTEMS OPERATIONAL
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <ETClock />
          </div>
        </div>
      </div>

      {/* Agent Selector Grid */}
      <div style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Select Agent Workspace
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
          {['Finch', 'Scout', 'Pulse', 'Psyche'].map(agent => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent.toLowerCase())}
              style={{
                background: selectedAgent === agent.toLowerCase() ? `var(--priority-${['finch', 'scout', 'pulse', 'psyche'].indexOf(agent.toLowerCase()) === 0 ? 'high' : ['scout'].includes(agent.toLowerCase()) ? 'critical' : ['pulse'].includes(agent.toLowerCase()) ? 'medium' : 'low'})33` : 'var(--bg-tertiary)',
                border: selectedAgent === agent.toLowerCase() ? `2px solid var(--${['finch', 'scout', 'pulse', 'psyche'][['finch', 'scout', 'pulse', 'psyche'].indexOf(agent.toLowerCase())]}` : '1px solid var(--border-secondary)',
                padding: '12px 16px',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = selectedAgent === agent.toLowerCase() ? 'inherit' : 'var(--border-secondary)'}
            >
              {['💰', '📖', '📊', '🧠'][['finch', 'scout', 'pulse', 'psyche'].indexOf(agent.toLowerCase())]} {agent}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid Display */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Agent Cluster Status
        </div>
        <AgentGrid statuses={statuses} />
      </div>

      {/* Selected Workspace */}
      {workspace && (
        <div style={{ padding: '32px', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)', border: `2px solid ${workspace.color}33`, borderRadius: '8px', marginBottom: '32px' }}>
          {/* Workspace Header */}
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${workspace.color}33` }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: workspace.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {workspace.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              {workspace.subtitle}
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {workspace.metrics.map((metric, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-tertiary)', border: `1px solid ${workspace.color}33`, borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: workspace.color, marginBottom: '4px' }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '9px', color: metric.status === 'ACTIVE' ? 'var(--accent-green)' : 'var(--accent-gold)', fontWeight: '600' }}>
                  ● {metric.status}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              📋 Activity Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activities
                .filter(a => a.agent.toLowerCase() === selectedAgent)
                .map(activity => (
                  <div key={activity.agent} style={{ padding: '12px', background: 'var(--bg-base)', borderLeft: `3px solid ${workspace.color}`, borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {activity.current_task}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                        Status: <span style={{ color: activity.status === 'working' ? 'var(--accent-green)' : 'var(--text-muted)' }}>{activity.status.toUpperCase()}</span>
                      </div>
                    </div>
                    {activity.pending_approvals ? (
                      <div style={{ background: 'var(--priority-high)33', color: 'var(--priority-high)', padding: '4px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                        {activity.pending_approvals} pending
                      </div>
                    ) : (
                      <div style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: '600' }}>
                        ✓ Clear
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* System Health Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {['Finch', 'Scout', 'Pulse', 'Psyche'].map((agent, i) => {
          const activity = activities.find(a => a.agent === agent);
          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#a855f7'];
          return (
            <div key={agent} style={{ padding: '16px', background: 'var(--bg-secondary)', border: `1px solid ${colors[i]}33`, borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: colors[i] }}>
                  {agent}
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activity?.status === 'working' ? 'var(--accent-green)' : 'var(--text-dim)', boxShadow: `0 0 8px ${activity?.status === 'working' ? 'var(--accent-green)' : 'var(--text-dim)'}66` }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <div>📍 {activity?.current_task}</div>
                {activity?.pending_approvals ? (
                  <div style={{ color: 'var(--priority-high)', fontWeight: '600', marginTop: '4px' }}>
                    ⚠️ {activity.pending_approvals} approval(s) pending
                  </div>
                ) : (
                  <div style={{ color: 'var(--accent-green)', fontWeight: '600', marginTop: '4px' }}>
                    ✓ All approvals current
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
