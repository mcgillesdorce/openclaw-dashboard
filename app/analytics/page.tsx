'use client';

export default function Analytics() {
  // Sample data - will be synced from GitHub data branch
  const engagementMetrics = [
    { label: 'Total Views', value: '2,847', trend: '+12%' },
    { label: 'Avg Duration', value: '45s', trend: '+8%' },
    { label: 'Engagement Rate', value: '6.2%', trend: '+2.1%' },
    { label: 'Save Rate', value: '3.4%', trend: '+1.2%' },
  ];

  const costMetrics = [
    { label: 'Avg Cost / 1K Views', value: '$0.82', color: '#10b981' },
    { label: 'Cost per Engagement', value: '$0.13', color: '#fbbf24' },
    { label: 'ROI (Views/Cost)', value: '1,220x', color: 'var(--accent-cyan)' },
    { label: 'Efficiency Score', value: '92%', color: '#8b5cf6' },
  ];

  const videoPerformance = [
    { title: 'Dopamine Detox', views: 1024, cost: 0.89, engagement: 7.2, status: 'High' },
    { title: 'Focus Flow', views: 856, cost: 0.76, engagement: 5.8, status: 'Good' },
    { title: 'Anxiety Relief', views: 967, cost: 0.85, engagement: 6.1, status: 'Good' },
  ];

  return (
    <div>
      {/* Engagement Overview */}
      <div>
        <div className="section-title" style={{ marginBottom: '24px' }}>📊 Engagement Analytics</div>
        <div className="grid g4 mb-2xl">
          {engagementMetrics.map((metric, i) => (
            <div key={i} className="stat-box">
              <div className="stat-label">{metric.label}</div>
              <div className="stat-value">{metric.value}</div>
              <div className="stat-note" style={{ color: '#10b981' }}>{metric.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Efficiency Metrics */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>💰 Cost Efficiency</div>
        <div className="grid g4 mb-2xl">
          {costMetrics.map((metric, i) => (
            <div key={i} className="stat-box">
              <div className="stat-label">{metric.label}</div>
              <div className="stat-value" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className="stat-note">tracked</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost vs Performance Trend */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>📈 Cost vs Performance Trend</div>
        
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{day}</div>
                
                {/* Views bar */}
                <div style={{ 
                  width: '100%', 
                  height: '40px', 
                  background: 'var(--accent-cyan)', 
                  borderRadius: '4px', 
                  opacity: 0.3 + (Math.random() * 0.4),
                  marginBottom: '4px'
                }} />
                
                {/* Cost bar */}
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  background: '#f59e0b', 
                  borderRadius: '4px', 
                  opacity: 0.3 + (Math.random() * 0.4)
                }} />
                
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  ${(0.20 + Math.random() * 0.20).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>■ Views</span> vs 
            <span style={{ color: '#f59e0b', marginLeft: '4px' }}>■ Cost</span>
          </div>
        </div>
      </div>

      {/* Video Performance Table */}
      <div>
        <div className="section-title" style={{ marginBottom: '24px' }}>🎬 Top Performing Videos (by ROI)</div>
        
        <div className="panel">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Video Title</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>Views</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>Cost</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>Engagement</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {videoPerformance.map((video, i) => (
                  <tr key={i} style={{ borderBottom: i < videoPerformance.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                      <div style={{ fontWeight: '500' }}>{video.title}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--accent-cyan)', fontWeight: '500' }}>
                      {video.views.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      ${video.cost.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#10b981', fontWeight: '500' }}>
                      {video.engagement}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: video.status === 'High' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                        color: video.status === 'High' ? '#10b981' : '#fbbf24',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {video.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Insights Box */}
      <div style={{ marginTop: '32px' }}>
        <div className="panel" style={{ padding: '20px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-cyan)' }}>
          <div style={{ fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
            💡 Key Insights
          </div>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>🎯 Average cost per video: $0.83. Best performer: "Dopamine Detox" with $0.89 cost + 7.2% engagement.</li>
            <li style={{ marginBottom: '8px' }}>📊 Cost efficiency improving: ROI is 1,220x (views per dollar spent).</li>
            <li style={{ marginBottom: '8px' }}>💰 Spending on track: $2.35 spent (23.5% of $10 monthly budget). Projected: $8.40 for full month.</li>
            <li>✅ Recommendation: Maintain current cost discipline. All videos performing within efficiency targets.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
