'use client';

import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface Video {
  id?: string;
  topic?: string;
  status: string;
  views?: number;
  cost_usd?: number;
  created_at: string;
  date?: string;
  approved?: boolean;
  generated_by?: string;
}

interface DashboardData {
  videos: Video[];
  approval_rate?: number;
  monthly_spend?: number;
}

export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const costChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/dashboard_data.json'
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data?.videos) return;

    // Render cost chart
    const dailyCosts: { [key: string]: number } = {};
    data.videos.forEach((v) => {
      const date = v.date || v.created_at.split('T')[0];
      dailyCosts[date] = (dailyCosts[date] || 0) + (v.cost_usd || 0);
    });

    const sorted = Object.entries(dailyCosts)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-14);

    const canvas = document.getElementById('costChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (costChartRef.current) {
      costChartRef.current.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    costChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(([d]) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
          {
            label: 'Daily Spend',
            data: sorted.map(([, cost]) => cost),
            borderColor: '#00d9ff',
            backgroundColor: 'rgba(0, 217, 255, 0.05)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#00d9ff',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            titleColor: '#00d9ff',
            bodyColor: '#e8eaed',
            borderColor: '#00d9ff',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            ticks: { color: '#6f7684', callback: (v) => '$' + v },
            grid: { color: 'rgba(37, 45, 74, 0.3)' },
            beginAtZero: true,
          },
          x: {
            ticks: { color: '#6f7684' },
            grid: { display: false },
          },
        },
      },
    });
  }, [data]);

  const approved = data?.videos.filter((v) => v.status === 'approved').length || 0;
  const totalCost = data?.videos.reduce((s, v) => s + (v.cost_usd || 0), 0) || 0;
  const cpa = approved > 0 ? (totalCost / approved).toFixed(2) : '—';
  const approvalRate = data?.approval_rate ? (data.approval_rate * 100).toFixed(0) : '—';
  const today = data?.videos.filter((v) => v.date === new Date().toISOString().split('T')[0]).length || 0;
  const monthlySpend = (data?.monthly_spend || 0).toFixed(2);
  const budgetPct = ((data?.monthly_spend || 0) / 10.0) * 100;

  const topVideos = data?.videos
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8) || [];

  const topicMap: { [key: string]: number } = {};
  data?.videos.forEach((v) => {
    const topic = v.topic || 'Unknown';
    topicMap[topic] = (topicMap[topic] || 0) + 1;
  });
  const topTopics = Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const recentVideos = data?.videos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10) || [];

  return (
    <div>
      {/* Hero Stats */}
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">💰 Cost / Approved</div>
          <div className="stat-value">${cpa}</div>
          <div className="stat-note">Target: &lt;$3.00</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">📊 Approval Rate</div>
          <div className="stat-value">
            {approvalRate}
            <span className="stat-unit">%</span>
          </div>
          <div className="stat-note">
            {approved}/{data?.videos.length || 0} generated
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">🎬 Videos Today</div>
          <div className="stat-value">{today}</div>
          <div className="stat-note">{today === 1 ? '1 video' : `${today} videos`}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">💳 Monthly Spend</div>
          <div className="stat-value">${monthlySpend}</div>
          <div className="stat-note">$10.00 budget</div>
        </div>
      </div>

      {/* Status & Gauges */}
      <div className="panel mb-2xl">
        <div className="grid g3">
          <div>
            <div className="gauge-label">
              <span className="gauge-label-left">Pipeline Status</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot live"></span> Running
              </span>
            </div>
          </div>
          <div>
            <div className="gauge">
              <div className="gauge-label">
                <span className="gauge-label-left">Daily Budget</span>
                <span className="gauge-label-right">{budgetPct.toFixed(0)}%</span>
              </div>
              <div className="gauge-bar">
                <div
                  className={`gauge-fill ${budgetPct > 80 ? 'warning' : ''}`}
                  style={{ width: `${Math.min(budgetPct, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid g2 mb-2xl">
        <div className="section">
          <div className="section-title">Daily Spend Trend</div>
          <div className="panel">
            <div className="chart-container">
              <canvas id="costChart"></canvas>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Top Videos</div>
          <div className="panel">
            {topVideos.length > 0 ? (
              <div>
                {topVideos.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 100px',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i < topVideos.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#00d9ff' }}>#{i + 1}</div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{v.topic || 'Untitled'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.status}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: '700', color: '#00d9ff' }}>
                      {(v.views || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No videos yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Leaderboard */}
      <div className="section mb-2xl">
        <div className="section-title">Topic Leaderboard</div>
        <div className="panel">
          {topTopics.length > 0 ? (
            <div>
              {topTopics.map(([topic, count], i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < topTopics.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px' }}>{topic}</div>
                    <div style={{ height: '4px', background: 'var(--border-secondary)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #00d9ff, #a855f7)',
                          width: `${(count / (topTopics[0]?.[1] || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', color: '#00d9ff' }}>{count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No topics yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <div className="section-title">Recent Activity</div>
        <div className="timeline">
          {recentVideos.length > 0 ? (
            recentVideos.map((v, i) => {
              const icon = v.status === 'approved' ? '✅' : v.status === 'rejected' ? '❌' : '⏳';
              const time = new Date(v.created_at);
              const ago = formatTimeAgo(time);
              return (
                <div key={i} className="event">
                  <div className="event-icon">{icon}</div>
                  <div className="event-time">{ago}</div>
                  <div className="event-agent">{v.topic || 'Video'}</div>
                  <div className="event-desc">{v.status}</div>
                  <div className="event-cost">${(v.cost_usd || 0).toFixed(2)}</div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No activity yet</div>
          )}
        </div>
      </div>

      <div className="data-footer">Data source: GitHub | Last sync: <span className="text-cyan mono" id="lastSync">—</span></div>
    </div>
  );
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
