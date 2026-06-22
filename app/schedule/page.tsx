'use client';

import { useEffect, useState } from 'react';
import { ETClock } from '../components/ETClock';
import { formatTimeET } from '../utils/dateFormatter';

const STATIC_SCHEDULE = [
  { time: '08:00', hour: 8, ampm: 'AM', agent: 'Finch', icon: '💰', task: 'Morning cost analysis' },
  { time: '10:00', hour: 10, ampm: 'AM', agent: 'Scout', icon: '📖', task: 'Topic research & trends' },
  { time: '12:00', hour: 12, ampm: 'PM', agent: 'Psyche', icon: '🎬', task: 'Pipeline review & approval' },
  { time: '14:00', hour: 14, ampm: 'PM', agent: 'Pulse', icon: '📊', task: 'Analytics & insights' },
  { time: '16:00', hour: 16, ampm: 'PM', agent: 'Finch', icon: '💰', task: 'Evening cost analysis' },
  { time: '18:00', hour: 18, ampm: 'PM', agent: 'Scout', icon: '📖', task: 'Content discovery' },
  { time: '20:00', hour: 20, ampm: 'PM', agent: 'Psyche', icon: '⚙️', task: 'Evening state sync' },
];

function getRunStatus(hour: number): 'past' | 'next' | 'future' {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (hour < currentHour) return 'past';
  if (hour === currentHour) return 'next';
  return 'future';
}

export default function SchedulePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (!currentTime) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', marginBottom: '32px' }}>
      <div>
        <div className="panel" style={{ position: 'sticky', top: '80px' }}>
          <div className="section-title" style={{ marginBottom: '20px' }}>📅 Daily Schedule (ET)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Current time: <ETClock />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STATIC_SCHEDULE.map((item, i) => {
              const status = getRunStatus(item.hour);
              const isPast = status === 'past';
              const isNext = status === 'next';
              const isFuture = status === 'future';
              
              return (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr',
                    gap: '12px',
                    padding: '12px',
                    background: isPast ? 'var(--bg-secondary)' : isNext ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                    border: isPast ? '1px solid var(--border-primary)' : isNext ? '2px solid #22c55e' : '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    opacity: isPast ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Monaco', 'Courier New', monospace",
                        fontWeight: '700',
                        color: isPast ? 'var(--text-muted)' : isNext ? '#22c55e' : 'var(--accent-cyan)',
                        fontSize: '14px',
                      }}
                    >
                      {item.time}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.ampm}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>
                        {isPast ? '✅' : isNext ? '▶️' : item.icon}
                      </span>
                      <div
                        style={{
                          fontWeight: '700',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          color: isPast ? 'var(--text-muted)' : isNext ? '#22c55e' : 'var(--text-primary)',
                        }}
                      >
                        {item.agent}
                      </div>
                      {isNext && <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: '600' }}>NEXT</span>}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: isPast ? 'var(--text-dim)' : 'var(--text-secondary)',
                        lineHeight: '1.4',
                        textDecoration: isPast ? 'line-through' : 'none',
                      }}
                    >
                      {item.task}
                    </div>
                  </div>
                </div>
              );
            })}
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
      <div>
        {/* Next Run Highlight */}
        {(() => {
          const nextRun = STATIC_SCHEDULE.find(s => getRunStatus(s.hour) === 'next' || getRunStatus(s.hour) === 'future');
          const pastCount = STATIC_SCHEDULE.filter(s => getRunStatus(s.hour) === 'past').length;
          
          return (
            <div>
              {/* Current Status */}
              <div className="section">
                <div className="section-title">Status Today</div>
                <div className="grid g3" style={{ marginBottom: '24px' }}>
                  <div className="stat-box">
                    <div className="stat-label">✅ Completed</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>{pastCount}</div>
                    <div className="stat-note">of {STATIC_SCHEDULE.length} tasks</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">⏭️ Up Next</div>
                    <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>⏰</div>
                    <div className="stat-note">{nextRun ? nextRun.time + ' ' + nextRun.ampm : 'None'}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">⏳ Remaining</div>
                    <div className="stat-value">{STATIC_SCHEDULE.length - pastCount}</div>
                    <div className="stat-note">tasks today</div>
                  </div>
                </div>
              </div>
              
              {/* Next Run Card */}
              {nextRun && (
                <div className="panel" style={{ padding: '20px', marginBottom: '24px', background: 'rgba(34, 197, 94, 0.05)', border: '2px solid #22c55e', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', marginBottom: '8px' }}>NEXT RUN</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{nextRun.icon}</div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
                        {nextRun.agent} @ {nextRun.time} {nextRun.ampm}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {nextRun.task}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        
        {/* Past & Future Runs Summary */}
        <div className="section">
          <div className="section-title">Run Breakdown</div>
          
          {/* Completed Runs */}
          {(() => {
            const pastRuns = STATIC_SCHEDULE.filter(s => getRunStatus(s.hour) === 'past');
            return pastRuns.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '12px' }}>✅ COMPLETED TODAY ({pastRuns.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pastRuns.map((run, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
                      <span style={{ fontSize: '12px' }}>{run.icon} {run.agent}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{run.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
          
          {/* Upcoming Runs */}
          {(() => {
            const futureRuns = STATIC_SCHEDULE.filter(s => getRunStatus(s.hour) === 'future');
            return futureRuns.length > 0 ? (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '12px' }}>⏰ UPCOMING ({futureRuns.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {futureRuns.map((run, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px' }}>{run.icon} {run.agent}</span>
                      <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '600' }}>{run.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}
