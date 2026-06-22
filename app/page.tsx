import { Suspense } from 'react';

// Revalidate every 30 seconds for ISR
export const revalidate = 30;

async function DashboardContent() {
  return (
    <div>
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">💰 Cost / Approved</div>
          <div className="stat-value">$—</div>
          <div className="stat-note">Target: &lt;$3.00</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">📊 Approval Rate</div>
          <div className="stat-value">—%</div>
          <div className="stat-note">— generated</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">🎬 Videos Today</div>
          <div className="stat-value">—</div>
          <div className="stat-note">0 videos</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">💳 Monthly Spend</div>
          <div className="stat-value">$—</div>
          <div className="stat-note">$10.00 budget</div>
        </div>
      </div>

      <div className="panel mb-2xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)', animation: 'pulse 2s infinite' }}></div>
          <span style={{ color: '#10b981' }}>Pipeline Active</span>
        </div>
      </div>

      <div className="panel mb-2xl" style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <div>Real-time dashboard syncing from GitHub data branch</div>
        <div style={{ fontSize: '12px', marginTop: '16px', color: 'var(--text-muted)' }}>Data updates every 30 seconds via ISR</div>
      </div>

      <div style={{ textAlign: 'right', padding: '24px 0', fontSize: '11px', color: 'var(--text-dim)', borderTop: '1px solid var(--border-primary)', marginTop: '48px' }}>
        Data source: GitHub | Last sync: <span className="mono">—</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
