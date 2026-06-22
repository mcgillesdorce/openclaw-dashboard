'use client';

import { useState, useEffect } from 'react';

interface ScheduleItem {
  time: string;
  ampm: string;
  agent: string;
  icon: string;
  task: string;
}

interface Event {
  icon?: string;
  time?: string;
  agent?: string;
  task?: string;
  status?: string;
  duration?: string;
  cost?: string;
}

const STATIC_SCHEDULE: ScheduleItem[] = [
  { time: '08:00', ampm: 'AM', agent: 'Finch', icon: '💰', task: 'Morning cost analysis' },
  { time: '10:00', ampm: 'AM', agent: 'Scout', icon: '📖', task: 'Topic research & trends' },
  { time: '12:00', ampm: 'PM', agent: 'Psyche', icon: '🎬', task: 'Pipeline review & approval' },
  { time: '14:00', ampm: 'PM', agent: 'Pulse', icon: '📊', task: 'Analytics & insights' },
  { time: '16:00', ampm: 'PM', agent: 'Finch', icon: '💰', task: 'Evening cost analysis' },
  { time: '18:00', ampm: 'PM', agent: 'Scout', icon: '📖', task: 'Content discovery' },
  { time: '20:00', ampm: 'PM', agent: 'Psyche', icon: '⚙️', task: 'Evening state sync' },
];

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totals, setTotals] = useState({ tasks: 0, cost: 0, errors: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/schedule_data.json'
        );
        if (res.ok) {
          const json = await res.json();
          setEvents(json.events || []);
          setTotals(json.totals || { tasks: 0, cost: 0, errors: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch schedule data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', marginBottom: '32px' }}>
      {/* Static Schedule Sidebar */}
      <div>
        <div className="panel" style={{ position: 'sticky', top: '80px' }}>
          <div className="section-title" style={{ marginBottom: '20px' }}>📅 Daily Schedule</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STATIC_SCHEDULE.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr',
                  gap: '12px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  transition: 'all var(--trans-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-cyan)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0, 217, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Monaco', 'Courier New', monospace", fontWeight: '700', color: '#00d9ff', fontSize: '14px' }}>
                    {item.time}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.ampm}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    <div style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
                      {item.agent}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.task}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-primary)' }}>
            <div className="section-title" style={{ marginTop: 0 }}>Legend</div>
            <div style={{ fontSize: '12px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              <div>💰 = Financial checks</div>
              <div>📖 = Topic research</div>
              <div>📊 = Analytics</div>
              <div>🎬 = Content gen</div>
              <div>⚙️ = System tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Section */}
      <div>
        <div className="section">
          <div className="section-title">Today's Activity</div>

          <div className="timeline">
            {events.length > 0 ? (
              events.map((evt, i) => {
                const icon = evt.status === 'success' ? '✅' : evt.status === 'error' ? '❌' : '⏳';
                return (
                  <div key={i} className="event">
                    <div className="event-icon">{icon}</div>
                    <div className="event-time">{evt.time || '—'}</div>
                    <div className="event-agent">{evt.agent || '—'}</div>
                    <div className="event-desc">{evt.task || '—'}</div>
                    <div className="event-cost">{evt.cost || '—'}</div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No activity today</div>
            )}
          </div>
        </div>

        {/* Daily Totals */}
        <div className="grid g3">
          <div className="stat-box">
            <div className="stat-label">✅ Tasks</div>
            <div className="stat-value">{totals.tasks}</div>
            <div className="stat-note">completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💳 Daily Cost</div>
            <div className="stat-value">${totals.cost.toFixed(2)}</div>
            <div className="stat-note">today</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🚨 Errors</div>
            <div className="stat-value">{totals.errors}</div>
            <div className="stat-note">incidents</div>
          </div>
        </div>
      </div>
    </div>
  );
}
