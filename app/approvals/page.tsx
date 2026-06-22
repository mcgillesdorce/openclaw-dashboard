'use client';

import { useEffect, useState } from 'react';
import { ETClock } from '../components/ETClock';

interface Recommendation {
  id: string;
  agent: string;
  role: string;
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: string;
  impact: string;
  tags: string[];
  action_items?: Array<{ title: string; description: string; estimated_time_minutes: number }>;
  historical_context?: { similar_past_recommendations: string[]; outcome_if_approved: string; outcome_if_ignored: string; frequency: string };
  trend_analysis?: { metric: string; current_value: number; previous_value: number; trend: string; percent_change: number; direction_emoji: string };
  evidence?: Array<{ metric: string; value: string; timestamp: string; source: string }>;
  data: Record<string, any>;
  timestamp: string;
  status: string;
  approved_by?: string;
  approval_reason?: string;
}

const agentColors: Record<string, string> = {
  'Finch': '#10b981',
  'Scout': '#3b82f6',
  'Pulse': '#f59e0b',
  'Psyche': '#a855f7'
};

const priorityConfig: Record<string, { color: string; emoji: string; label: string }> = {
  critical: { color: 'var(--priority-critical)', emoji: '🚨', label: 'CRITICAL' },
  high: { color: 'var(--priority-high)', emoji: '⚠️', label: 'HIGH' },
  medium: { color: 'var(--priority-medium)', emoji: '⏱️', label: 'MEDIUM' },
  low: { color: 'var(--priority-low)', emoji: '📌', label: 'LOW' }
};

export default function ApprovalsEnhancedPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

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
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      await fetch('/api/recommendations/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: 'Approved via dashboard' })
      });
      await fetchRecommendations();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  }

  async function handleReject(id: string, reason: string) {
    try {
      await fetch('/api/recommendations/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      await fetchRecommendations();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  }

  const filtered = recommendations.filter(r => {
    const priorityMatch = filterPriority === 'all' || r.priority === filterPriority;
    const agentMatch = filterAgent === 'all' || r.agent.toLowerCase() === filterAgent.toLowerCase();
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    return priorityMatch && agentMatch && statusMatch;
  });

  const stats = {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === 'pending_approval').length,
    critical: recommendations.filter(r => r.priority === 'critical' && r.status === 'pending_approval').length
  };

  return (
    <div>
      {/* Header with Statistics */}
      <div style={{ marginBottom: '32px', padding: '24px', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)', border: '1px solid var(--border-neon)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚖️ RECOMMENDATION GOVERNANCE
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Agent decisions awaiting human approval
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <ETClock />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Total</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.total}</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(255, 51, 51, 0.1)', border: '1px solid var(--priority-critical)33', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--priority-critical)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>🚨 Critical</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--priority-critical)' }}>{stats.critical}</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(255, 170, 0, 0.1)', border: '1px solid var(--priority-high)33', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--priority-high)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>⏳ Pending</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--priority-high)' }}>{stats.pending}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
            Priority
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'inherit' }}
          >
            <option value="all">All Priorities</option>
            <option value="critical">🚨 Critical</option>
            <option value="high">⚠️ High</option>
            <option value="medium">⏱️ Medium</option>
            <option value="low">📌 Low</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
            Agent
          </label>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'inherit' }}
          >
            <option value="all">All Agents</option>
            <option value="finch">💰 Finch</option>
            <option value="scout">📖 Scout</option>
            <option value="pulse">📊 Pulse</option>
            <option value="psyche">🧠 Psyche</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontFamily: 'inherit' }}
          >
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: '8px', color: 'var(--text-muted)' }}>
          No recommendations match your filters
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(rec => {
            const priority = priorityConfig[rec.priority] || priorityConfig.low;
            const agentColor = agentColors[rec.agent];
            const isExpanded = expandedId === rec.id;

            return (
              <div
                key={rec.id}
                style={{
                  background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                  border: isExpanded ? `2px solid ${priority.color}` : `1px solid var(--border-secondary)`,
                  borderLeft: `4px solid ${priority.color}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? `0 0 20px ${priority.color}33` : 'none'
                }}
              >
                {/* Collapsed Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
                >
                  <div style={{ flex: 1 }}>
                    {/* Title Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '18px' }}>{priority.emoji}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {rec.title}
                        </div>
                        <div style={{ fontSize: '11px', color: agentColor, fontWeight: '600', marginTop: '2px' }}>
                          {rec.agent.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                      <div style={{ fontSize: '10px', background: `${priority.color}22`, color: priority.color, padding: '4px 8px', borderRadius: '3px', fontWeight: '600', textTransform: 'uppercase' }}>
                        {priority.label}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Confidence: <span style={{ color: rec.confidence > 0.8 ? 'var(--accent-green)' : rec.confidence > 0.6 ? 'var(--accent-gold)' : 'var(--priority-high)' }}>
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        ID: {rec.id}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: isExpanded ? priority.color : 'var(--text-muted)', fontSize: '20px', marginLeft: '16px', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ padding: '24px', borderTop: `1px solid var(--border-secondary)`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Reasoning Section */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        🧠 Reasoning
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '12px', borderRadius: '4px', borderLeft: `3px solid ${agentColor}`, lineHeight: '1.6' }}>
                        {rec.reasoning}
                      </div>
                    </div>

                    {/* Impact Section */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--priority-high)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        ⚡ Impact
                      </div>
                      <div style={{ fontSize: '13px', color: '#ff9999', background: 'rgba(255, 51, 51, 0.1)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid var(--priority-high)', lineHeight: '1.6' }}>
                        {rec.impact}
                      </div>
                    </div>

                    {/* Action Items */}
                    {rec.action_items && rec.action_items.length > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          ✓ Action Items
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {rec.action_items.map((action, i) => (
                            <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '10px', borderRadius: '4px', display: 'flex', gap: '8px' }}>
                              <div style={{ color: 'var(--accent-green)', fontWeight: '700', minWidth: '20px' }}>
                                {i + 1}.
                              </div>
                              <div>
                                <div style={{ fontWeight: '600' }}>{action.title}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                                  {action.description} ({action.estimated_time_minutes}min)
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trend Analysis */}
                    {rec.trend_analysis && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          {rec.trend_analysis.direction_emoji} Trend Analysis
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '12px', borderRadius: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px' }}>Metric</div>
                            <div style={{ fontWeight: '600' }}>{rec.trend_analysis.metric}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px' }}>Change</div>
                            <div style={{ fontWeight: '600', color: rec.trend_analysis.percent_change > 0 ? 'var(--priority-high)' : 'var(--accent-green)' }}>
                              {rec.trend_analysis.percent_change > 0 ? '+' : ''}{rec.trend_analysis.percent_change.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evidence */}
                    {rec.evidence && rec.evidence.length > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          📊 Evidence
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                          {rec.evidence.map((ev, i) => (
                            <div key={i} style={{ fontSize: '11px', background: 'var(--bg-base)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-secondary)' }}>
                              <div style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>{ev.metric}</div>
                              <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{ev.value}</div>
                              <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>
                                {ev.source}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {rec.status === 'pending_approval' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-secondary)' }}>
                        <button
                          onClick={() => handleApprove(rec.id)}
                          style={{
                            background: 'var(--accent-green)',
                            color: '#000',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 16px var(--accent-green)66'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                          ✅ APPROVE
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Rejection reason:');
                            if (reason) handleReject(rec.id, reason);
                          }}
                          style={{
                            background: 'var(--priority-high)',
                            color: '#000',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 16px var(--priority-high)66'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                          ❌ REJECT
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
