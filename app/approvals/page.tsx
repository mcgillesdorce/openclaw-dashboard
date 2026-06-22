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
  historical_context?: { outcome_if_approved: string; outcome_if_ignored: string; frequency: string };
  trend_analysis?: { metric: string; current_value: number; previous_value: number; trend: string; percent_change: number; direction_emoji: string };
  evidence?: Array<{ metric: string; value: string; timestamp: string; source: string }>;
  data: Record<string, any>;
  timestamp: string;
  status: string;
  approved_by?: string;
}

const agentColors: Record<string, string> = {
  'Finch': '#8833ff',
  'Scout': '#003366',
  'Pulse': '#884400',
  'Psyche': '#cc0033'
};

export default function ApprovalsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending_approval');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchRecommendations() {
    try {
      const res = await fetch('/api/recommendations');
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched recommendations:', data);
        setRecommendations(data);
      } else {
        console.error('API returned:', res.status);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    setApprovingId(id);
    try {
      const res = await fetch('/api/recommendations/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: 'Approved via dashboard' })
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: '✅ Recommendation approved!' });
        setTimeout(() => setFeedback(null), 3000);
        await fetchRecommendations();
      } else {
        const msg = await res.text();
        setFeedback({ type: 'error', message: '❌ Approval failed: ' + msg });
      }
    } catch (err) {
      console.error('Approval failed:', err);
      setFeedback({ type: 'error', message: '❌ Network error' });
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(id: string, reason?: string) {
    if (!reason || !reason.trim()) {
      setFeedback({ type: 'error', message: '⚠️ Please provide a reason' });
      return;
    }
    
    setApprovingId(id);
    try {
      const res = await fetch('/api/recommendations/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: '✅ Recommendation rejected!' });
        setTimeout(() => setFeedback(null), 3000);
        await fetchRecommendations();
      } else {
        const msg = await res.text();
        setFeedback({ type: 'error', message: '❌ Rejection failed: ' + msg });
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      setFeedback({ type: 'error', message: '❌ Network error' });
    } finally {
      setApprovingId(null);
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
    critical: recommendations.filter(r => r.priority === 'high' && r.status === 'pending_approval').length
  };

  const priorityConfig: Record<string, { emoji: string; color: string }> = {
    high: { emoji: '🚨', color: '#cc0033' },
    medium: { emoji: '⚠️', color: '#8833ff' },
    low: { emoji: '📌', color: '#884400' }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)',
        border: '1px solid rgba(136, 51, 255, 0.3)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#8833ff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
              ⚖️ APPROVALS GOVERNANCE
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Review and approve agent recommendations one at a time
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <ETClock />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#e0e0e0' }}>{stats.total}</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(204, 0, 51, 0.1)', border: '1px solid rgba(204, 0, 51, 0.3)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#cc0033', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>🚨 Pending</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#cc0033' }}>{stats.pending}</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(136, 51, 255, 0.1)', border: '1px solid rgba(136, 51, 255, 0.3)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#8833ff', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>⚠️ Critical</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#8833ff' }}>{stats.critical}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Priority</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '12px' }}>
            <option value="all">All</option>
            <option value="high">🚨 High</option>
            <option value="medium">⚠️ Medium</option>
            <option value="low">📌 Low</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Agent</label>
          <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '12px' }}>
            <option value="all">All</option>
            <option value="finch">💰 Finch</option>
            <option value="scout">📖 Scout</option>
            <option value="pulse">📊 Pulse</option>
            <option value="psyche">🧠 Psyche</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '12px' }}>
            <option value="pending_approval">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '14px' }}>🔄 Loading approvals...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: '8px', color: 'var(--text-muted)' }}>
          ✓ No recommendations pending
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((rec, idx) => {
            const config = priorityConfig[rec.priority] || priorityConfig.low;
            const agentColor = agentColors[rec.agent];
            const isExpanded = expandedId === rec.id;

            return (
              <div key={rec.id} style={{
                background: isExpanded ? 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-accent) 100%)' : 'var(--bg-secondary)',
                border: isExpanded ? `2px solid ${config.color}` : '1px solid var(--border-secondary)',
                borderLeft: `4px solid ${config.color}`,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: isExpanded ? `0 0 20px ${config.color}44` : 'none',
                transition: 'all 0.2s ease'
              }}>
                {/* Header - Click to Expand */}
                <div onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '20px' }}>{config.emoji}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {rec.title}
                        </div>
                        <div style={{ fontSize: '11px', color: agentColor, fontWeight: '600', marginTop: '4px' }}>
                          {rec.agent.toUpperCase()} • {rec.role.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '10px', background: `${config.color}33`, color: config.color, padding: '4px 8px', borderRadius: '3px', fontWeight: '600', textTransform: 'uppercase' }}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        Confidence: <span style={{ color: rec.confidence > 0.9 ? '#004400' : rec.confidence > 0.7 ? '#8833ff' : '#cc0033', fontWeight: '600' }}>
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '24px', color: isExpanded ? config.color : 'var(--text-muted)', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border-secondary)' }}>
                    {/* Description */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>📋 Summary</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '4px' }}>
                        {rec.description}
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>🧠 Reasoning</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '4px' }}>
                        {rec.reasoning}
                      </div>
                    </div>

                    {/* Impact */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: '#cc0033', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>⚡ Impact</div>
                      <div style={{ fontSize: '12px', color: '#e0e0e0', lineHeight: '1.6', background: 'rgba(204, 0, 51, 0.1)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #cc0033' }}>
                        {rec.impact}
                      </div>
                    </div>

                    {/* Action Items */}
                    {rec.action_items && rec.action_items.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>✓ Action Items</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {rec.action_items.map((item, i) => (
                            <div key={i} style={{ padding: '12px', background: 'var(--bg-tertiary)', border: `1px solid ${config.color}33`, borderRadius: '4px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {i + 1}. {item.title}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                {item.description}
                              </div>
                              <div style={{ fontSize: '10px', color: config.color, fontWeight: '600' }}>
                                ⏱️ ~{item.estimated_time_minutes} min
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trend Analysis */}
                    {rec.trend_analysis && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>📈 Trend</div>
                        <div style={{ padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rec.trend_analysis.metric}</span>
                            <span style={{ fontSize: '14px' }}>{rec.trend_analysis.direction_emoji}</span>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#8833ff', marginTop: '6px' }}>
                            {rec.trend_analysis.current_value} (↑ {rec.trend_analysis.percent_change.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evidence */}
                    {rec.evidence && rec.evidence.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>📊 Evidence</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                          {rec.evidence.map((ev, i) => (
                            <div key={i} style={{ padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: '4px' }}>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{ev.metric}</div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{ev.value}</div>
                              <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>← {ev.source}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Historical Context */}
                    {rec.historical_context && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>📜 History</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div style={{ padding: '12px', background: 'rgba(0, 68, 0, 0.1)', border: '1px solid rgba(0, 68, 0, 0.3)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '10px', color: '#004400', fontWeight: '600', marginBottom: '4px' }}>✓ If Approved</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {rec.historical_context.outcome_if_approved}
                            </div>
                          </div>
                          <div style={{ padding: '12px', background: 'rgba(204, 0, 51, 0.1)', border: '1px solid rgba(204, 0, 51, 0.3)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '10px', color: '#cc0033', fontWeight: '600', marginBottom: '4px' }}>✗ If Ignored</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {rec.historical_context.outcome_if_ignored}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-secondary)' }}>
                      <button onClick={() => handleApprove(rec.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#004400',
                          color: 'var(--text-primary)',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 68, 0, 0.6)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                      >
                        ✅ APPROVE
                      </button>
                      <button onClick={() => handleReject(rec.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(204, 0, 51, 0.2)',
                          color: '#cc0033',
                          border: '1px solid #cc0033',
                          borderRadius: '4px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(204, 0, 51, 0.3)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(204, 0, 51, 0.4)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(204, 0, 51, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        ✗ REJECT
                      </button>
                    </div>
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
