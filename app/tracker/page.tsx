export const revalidate = 30;

export default function Tracker() {
  return (
    <div>
      <div className="grid g4 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">📺 Total Generated</div>
          <div className="stat-value">—</div>
          <div className="stat-note">all time</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">✅ Approved</div>
          <div className="stat-value">—</div>
          <div className="stat-note">videos</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">⏳ Pending</div>
          <div className="stat-value">—</div>
          <div className="stat-note">awaiting review</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">❌ Rejected</div>
          <div className="stat-value">—</div>
          <div className="stat-note">videos</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Content Library</div>
        <div className="panel" style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
          <div>Content tracker and library management</div>
        </div>
      </div>
    </div>
  );
}
