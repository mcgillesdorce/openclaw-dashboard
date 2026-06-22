'use client';

import { useEffect, useState } from 'react';
import { AgentAvatar } from '../components/AgentAvatar';
import { ETClock } from '../components/ETClock';

interface Recommendation {
  id: string;
  agent: string;
  title: string;
  priority: string;
  confidence: number;
  status: string;
  description: string;
  action_items?: Array<{ title: string }>;
}

interface AgentActivity {
  agent: string;
  status: 'idle' | 'working' | 'awaiting_approval';
  current_task?: string;
  pending_approvals?: number;
}

const agentColors: Record<string, string> = {
  'Finch': '#8833ff',
  'Scout': '#003366',
  'Pulse': '#884400',
  'Psyche': '#cc0033'
};

const workspaceConfig: Record<string, any> = {
  finch: {
    title: "💰 War Room",
    subtitle: "Financial Command Post",
    color: "#8833ff",
    metrics: [
      { label: 'Monthly Spend', value: '$112.70', status: 'ACTIVE' },
      { label: 'Budget Status', value: '41.0%', status: 'CAUTION' },
      { label: 'Pending Alerts', value: '2', status: 'CRITICAL' }
    ]
  },
  scout: {
    title: "📖 Research Lab",
    subtitle: "Topic Discovery & Analysis",
    color: "#003366",
    metrics: [
      { label: 'Topics Researched', value: '12', status: 'ACTIVE' },
      { label: 'Pending Ideas', value: '5', status: 'WATCH' },
      { label: 'Trend Strength', value: 'HIGH', status: 'ACTIVE' }
    ]
  },
  pulse: {
    title: "📊 Analytics Hub",
    subtitle: "Performance & Engagement Tracking",
    color: "#884400",
    metrics: [
      { label: 'Videos Tracked', value: '47', status: 'ACTIVE' },
      { label: 'Avg Engagement', value: '6.2%', status: 'ACTIVE' },
      { label: 'Trend Analysis', value: '↗️ UP', status: 'ACTIVE' }
    ]
  },
  psyche: {
    title: "🧠 Command Center",
    subtitle: "Operations Coordination",
    color: "#cc0033",
    metrics: [
      { label: 'Active Agents', value: '4/4', status: 'ACTIVE' },
      { label: 'Pending Decisions', value: '8', status: 'CRITICAL' },
      { label: 'System Health', value: '100%', status: 'ACTIVE' }
    ]
  }
};

export default function EcosystemPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([
    { agent: 'Finch', status: 'idle', current_task: 'Monitoring daily budget', pending_approvals: 2 },
    { agent: 'Scout', status: 'idle', current_task: 'Analyzing topic trends', pending_approvals: 0 },
    { agent: 'Pulse', status: 'idle', current_task: 'Computing engagement metrics', pending_approvals: 1 },
    { agent: 'Psyche', status: 'working', current_task: 'Coordinating approvals', pending_approvals: 0 }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<string>('psyche');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchRecommendations() {
    try {
      const res = await fetch('/api/recommendations');
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
        
        // Update activities with pending counts per agent
        setActivities(prev => prev.map(activity => ({
          ...activity,
          pending_approvals: data.filter((r: Recommendation) => 
            r.agent.toLowerCase() === activity.agent.toLowerCase() && 
            r.status === 'pending_approval'
          ).length
        })));
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }

  const workspace = workspaceConfig[selectedAgent.toLowerCase()];
  const agentRecs = recommendations.filter(r => r.agent.toLowerCase() === selectedAgent.toLowerCase() && r.status === 'pending_approval');

  const priorityEmoji: Record<string, string> = {
    critical: '🚨',
    high: '⚠️',
    medium: '⏱️',
    low: '📌'
  };

  return (
    <div>
      {/* System Status Bar */}
      <div style={{
        padding: '16px 24px',
        background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)',
        borderBottom: '1px solid var(--border-secondary)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#8833ff', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🌐 AGENT ECOSYSTEM
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time agent workspace coordination
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#004400' }}>
            ✅ SYSTEMS OPERATIONAL
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <ETClock />
          </div>
        </div>
      </div>

      {/* Agent Selector Grid */}
      <div style={{
        marginBottom: '32px',
        padding: '24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Select Agent Workspace
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {['Finch', 'Scout', 'Pulse', 'Psyche'].map((agent) => {
            const agentLower = agent.toLowerCase();
            const agentColor = agentColors[agent];
            const pendingCount = recommendations.filter(r => 
              r.agent.toLowerCase() === agentLower && r.status === 'pending_approval'
            ).length;
            
            return (
              <button
                key={agent}
                onClick={() => setSelectedAgent(agentLower)}
                style={{
                  background: selectedAgent === agentLower ? `${agentColor}22` : 'var(--bg-tertiary)',
                  border: selectedAgent === agentLower ? `2px solid ${agentColor}` : '1px solid var(--border-secondary)',
                  padding: '16px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = agentColor}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = selectedAgent === agentLower ? agentColor : 'var(--border-secondary)'}
              >
                <span>['💰', '📖', '📊', '🧠'][['finch', 'scout', 'pulse', 'psyche'].indexOf(agentLower)]</span>
                {agent}
                {pendingCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#cc0033',
                    color: '#e0e0e0',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    boxShadow: '0 0 8px #cc0033'
                  }}>
                    {pendingCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agent Grid Display */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Agent Cluster Status
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px',
          padding: '24px',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-secondary)'
        }}>
          {(['Finch', 'Scout', 'Pulse', 'Psyche'] as const).map(agent => {
            const activity = activities.find(a => a.agent === agent);
            const pendingCount = recommendations.filter(r => 
              r.agent.toLowerCase() === agent.toLowerCase() && r.status === 'pending_approval'
            ).length;
            
            return (
              <div key={agent} style={{ display: 'flex', justifyContent: 'center' }}>
                <AgentAvatar
                  agent={agent.toLowerCase() as any}
                  size="md"
                  status={activity?.status || 'idle'}
                  showLabel={true}
                  pendingCount={pendingCount}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Workspace */}
      {workspace && (
        <div style={{
          padding: '32px',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)',
          border: `2px solid ${workspace.color}55`,
          borderRadius: '8px',
          marginBottom: '32px'
        }}>
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
            {workspace.metrics.map((metric: any, i: number) => (
              <div key={i} style={{
                padding: '12px',
                background: 'var(--bg-tertiary)',
                border: `1px solid ${workspace.color}33`,
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: workspace.color, marginBottom: '4px' }}>
                  {metric.value}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: metric.status === 'ACTIVE' ? '#004400' : metric.status === 'CRITICAL' ? '#cc0033' : '#884400',
                  fontWeight: '600'
                }}>
                  ● {metric.status}
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals Section */}
          {agentRecs.length > 0 && (
            <div style={{
              padding: '16px',
              background: 'rgba(204, 0, 51, 0.1)',
              border: '1px solid #cc00334d',
              borderRadius: '6px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#cc0033',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                🚨 {agentRecs.length} PENDING APPROVAL{agentRecs.length !== 1 ? 'S' : ''}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agentRecs.map(rec => (
                  <div key={rec.id} style={{
                    padding: '12px',
                    background: 'var(--bg-base)',
                    border: `1px solid ${workspace.color}33`,
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}>
                        {priorityEmoji[rec.priority] || '📌'} {rec.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        marginBottom: '6px'
                      }}>
                        {rec.description}
                      </div>
                      {rec.action_items && rec.action_items.length > 0 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          {rec.action_items.length} action item{rec.action_items.length !== 1 ? 's' : ''} pending
                        </div>
                      )}
                    </div>
                    <div style={{
                      background: `${workspace.color}33`,
                      color: workspace.color,
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {(rec.confidence * 100).toFixed(0)}% confident
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-secondary)',
                textAlign: 'right'
              }}>
                👉 Go to <a href="/approvals" style={{ color: workspace.color, textDecoration: 'none' }}>Approvals</a> to review & decide
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              📋 Activity Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activities
                .filter(a => a.agent.toLowerCase() === selectedAgent)
                .map(activity => (
                  <div key={activity.agent} style={{
                    padding: '12px',
                    background: 'var(--bg-base)',
                    borderLeft: `3px solid ${workspace.color}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {activity.current_task}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                        Status: <span style={{ color: activity.status === 'working' ? '#004400' : 'var(--text-muted)' }}>
                          {activity.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {activity.pending_approvals ? (
                      <div style={{
                        background: '#cc00334d',
                        color: '#cc0033',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {activity.pending_approvals} pending
                      </div>
                    ) : (
                      <div style={{ color: '#004400', fontSize: '11px', fontWeight: '600' }}>
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
        {(['Finch', 'Scout', 'Pulse', 'Psyche'] as const).map((agent) => {
          const activity = activities.find(a => a.agent === agent);
          const agentColor = agentColors[agent];
          const pendingCount = recommendations.filter(r => 
            r.agent.toLowerCase() === agent.toLowerCase() && r.status === 'pending_approval'
          ).length;

          return (
            <div key={agent} style={{
              padding: '16px',
              background: 'var(--bg-secondary)',
              border: `1px solid ${agentColor}33`,
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: agentColor }}>
                  {agent}
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: activity?.status === 'working' ? '#004400' : '#555555',
                  boxShadow: `0 0 8px ${activity?.status === 'working' ? '#004400' : '#555555'}66`
                }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <div>📍 {activity?.current_task}</div>
                {pendingCount > 0 ? (
                  <div style={{ color: '#cc0033', fontWeight: '600', marginTop: '4px' }}>
                    ⚠️ {pendingCount} approval{pendingCount !== 1 ? 's' : ''} pending
                  </div>
                ) : (
                  <div style={{ color: '#004400', fontWeight: '600', marginTop: '4px' }}>
                    ✓ All clear
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
