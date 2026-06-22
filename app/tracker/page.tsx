'use client';

import { useState, useEffect } from 'react';

interface Video {
  id?: string;
  topic?: string;
  status: string;
  views?: number;
  cost_usd?: number;
  created_at: string;
  generated_by?: string;
}

export default function Tracker() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/dashboard_data.json'
        );
        if (res.ok) {
          const json = await res.json();
          setVideos(json.videos || []);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const approved = videos.filter((v) => v.status === 'approved').length;
  const pending = videos.filter((v) => v.status === 'pending').length;
  const rejected = videos.filter((v) => v.status === 'rejected').length;

  const topics = [...new Set(videos.map((v) => v.topic || 'Unknown'))];

  let filtered = videos.filter((v) => {
    if (filterStatus && v.status !== filterStatus) return false;
    if (filterTopic && v.topic !== filterTopic) return false;
    return true;
  });

  filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">📺 Total Generated</div>
          <div className="stat-value">{videos.length}</div>
          <div className="stat-note">all time</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">✅ Approved</div>
          <div className="stat-value">{approved}</div>
          <div className="stat-note">{approved === 1 ? '1 video' : `${approved} videos`}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">⏳ Pending</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-note">awaiting review</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">❌ Rejected</div>
          <div className="stat-value">{rejected}</div>
          <div className="stat-note">{rejected === 1 ? '1 video' : `${rejected} videos`}</div>
        </div>
      </div>

      <div className="panel mb-2xl">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
              Topic
            </label>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Content Library</div>
        <div className="panel" style={{ overflow: 'auto' }}>
          {filtered.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Topic
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Agent
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Created
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Views
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const statusIcon = v.status === 'approved' ? '✅' : v.status === 'rejected' ? '❌' : '⏳';
                  const date = new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                      <td style={{ padding: '12px 0', color: 'var(--text-primary)' }}>{v.topic || 'Untitled'}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ color: v.status === 'approved' ? '#10b981' : v.status === 'rejected' ? '#ef4444' : '#f59e0b' }}>
                          {statusIcon} {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>{v.generated_by || '—'}</td>
                      <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>{date}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: '#00d9ff', fontWeight: '700' }}>
                        {(v.views || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: '#00d9ff', fontFamily: "'Monaco', 'Courier New', monospace", fontWeight: '700' }}>
                        ${(v.cost_usd || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No videos match filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
