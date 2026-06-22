export const revalidate = 30;

export default function Billing() {
  const monthlySpend = 0;
  const pct = 0;

  return (
    <div>
      <div className="grid g3 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">💳 Monthly Budget</div>
          <div className="stat-value">$10.00</div>
          <div className="stat-note">limit</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">💰 Current Spend</div>
          <div className="stat-value">${monthlySpend.toFixed(2)}</div>
          <div className="stat-note">{pct.toFixed(0)}% used</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">✅ Remaining</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            ${(10 - monthlySpend).toFixed(2)}
          </div>
          <div className="stat-note">{(100 - pct).toFixed(0)}% available</div>
        </div>
      </div>

      <div className="panel mb-2xl">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
          <div>Budget tracking and billing dashboard</div>
        </div>
      </div>
    </div>
  );
}
