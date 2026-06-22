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
  impact: string;
  tags: string[];
  data: Record<string, any>;
  timestamp: string;
  status: string;
  approved_by?: string;
  approval_reason?: string;
}

export default function ApprovalsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('pending');

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
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string, reason: string = '') {
    try {
      const res = await fetch('/api/recommendations/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      if (res.ok) {
        await fetchRecommendations();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  }

  async function handleReject(id: string, reason: string) {
    try {
      const res = await fetch('/api/recommendations/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      if (res.ok) {
        await fetchRecommendations();
      }
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  }

  const filtered = recommendations.filter(r => {
    if (filter === 'pending') return r.status === 'pending_approval';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    if (filter === 'executed') return r.status === 'executed';
    return true;
  });

  const pending = recommendations.filter(r => r.status === 'pending_approval');
  const approved = recommendations.filter(r => r.status === 'approved');
  const rejected = recommendations.filter(r => r.status === 'rejected');

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      'Finch': '#10b981',
      'Scout': '#3b82f6',
      'Pulse': '#f59e0b',
      'Psyche': '#8b5cf6'
    };
    return colors[agent] || '#6b7280';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return '#10b981';
    if (conf >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      {/* Status Overview */}
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">⏳ Pending</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {pending.length}
          </div>
          <div className="stat-note">awaiting approval</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">✅ Approved</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {approved.length}
          </div>
          <div className="stat-note">this session</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">❌ Rejected</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {rejected.length}
          </div>
          <div className="stat-note">dismissed</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">🕐 Current</div>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
            <ETClock />
          </div>
          <div className="stat-note">Eastern Time</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px' }}>
        {['pending', 'approved', 'rejected', 'executed', 'all'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: filter === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: filter === tab ? '600' : '400',
              fontSize: '14px',
              padding: '8px 12px',
              textTransform: 'uppercase',
              borderBottom: filter === tab ? '2px solid var(--accent-cyan)' : 'none',
              marginBottom: '-13px'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No {filter} recommendations
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(rec => (
            <div
              key={rec.id}
              className="panel"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${getAgentColor(rec.agent)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: selectedId === rec.id ? 'var(--bg-secondary)' : 'transparent',
                border: selectedId === rec.id ? `2px solid ${getAgentColor(rec.agent)}` : '1px solid var(--border-primary)'
              }}
              onClick={() => setSelectedId(selectedId === rec.id ? null : rec.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: getAgentColor(rec.agent) }}>
                      {rec.agent}
                    </span>
                    <span style={{ fontSize: '12px', background: getAgentColor(rec.agent), color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                      {rec.status.toUpperCase()}
                    </span>
                    {rec.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '11px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '3px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {rec.title}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    ID: {rec.id}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {new Date(rec.timestamp).toLocaleString('en-US', { timeZone: 'America/New_York' })}
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confidence</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: getConfidenceColor(rec.confidence) }}>
                    {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${rec.confidence * 100}%`,
                      height: '100%',
                      background: getConfidenceColor(rec.confidence),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                {rec.description}
              </div>

              {/* Expanded View */}
              {selectedId === rec.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
                  {/* Reasoning */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                      🧠 Reasoning
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', lineHeight: '1.6' }}>
                      {rec.reasoning}
                    </div>
                  </div>

                  {/* Impact */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                      ⚠️ Impact
                    </div>
                    <div style={{ fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                      {rec.impact}
                    </div>
                  </div>

                  {/* Data Context */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                      📊 Data
                    </div>
                    <pre style={{ fontSize: '11px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', overflow: 'auto', maxHeight: '200px', color: 'var(--text-secondary)' }}>
                      {JSON.stringify(rec.data, null, 2)}
                    </pre>
                  </div>

                  {/* Approval History */}
                  {rec.approved_by && (
                    <div style={{ marginBottom: '16px', padding: '12px', background: rec.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', borderLeft: `3px solid ${rec.status === 'rejected' ? '#ef4444' : '#10b981'}` }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: rec.status === 'rejected' ? '#ef4444' : '#10b981' }}>
                        {rec.status === 'rejected' ? '❌ REJECTED' : '✅ APPROVED'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        By: {rec.approved_by}
                      </div>
                      {rec.approval_reason && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {rec.approval_reason}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons (only for pending) */}
                  {rec.status === 'pending_approval' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        onClick={() => handleApprove(rec.id)}
                        style={{
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) handleReject(rec.id, reason);
                        }}
                        style={{
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
