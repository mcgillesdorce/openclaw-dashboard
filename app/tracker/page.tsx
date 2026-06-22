'use client';

import { useEffect, useState } from 'react';

interface TrackerStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function Tracker() {
  const [stats, setStats] = useState<TrackerStats>({
    total: 1,
    approved: 0,
    pending: 1,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        const kpis = data.dashboard?.kpis || {};
        setStats({
          total: kpis.videos_total || 1,
          approved: kpis.videos_approved || 0,
          pending: (kpis.videos_total || 1) - (kpis.videos_approved || 0),
          rejected: 0
        });
      } catch (err) {
        console.error('Tracker fetch error:', err);
        // Use fallback
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tracker...</div>;

  return (
    <div>
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">📺 Total Generated</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-note">all time</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">✅ Approved</div>
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-note">videos</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">⏳ Pending</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-note">awaiting review</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">❌ Rejected</div>
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-note">videos</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Content Library</div>
        <div className="panel" style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
          <div>Content tracker library coming soon</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>Track: {stats.total} videos | {stats.approved} approved</div>
        </div>
      </div>
    </div>
  );
}
