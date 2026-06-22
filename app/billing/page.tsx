'use client';

import { useState, useEffect } from 'react';

interface BillingData {
  monthly_total?: number;
  by_service?: { [key: string]: number };
}

export default function Billing() {
  const [billing, setBilling] = useState<BillingData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/billing_data.json'
        );
        if (res.ok) {
          const json = await res.json();
          setBilling(json);
        }
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const monthlySpend = billing?.monthly_total || 0;
  const remaining = 10 - monthlySpend;
  const pct = (monthlySpend / 10) * 100;

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
          <div className="stat-value" style={{ color: remaining > 0 ? '#10b981' : '#ef4444' }}>
            ${remaining.toFixed(2)}
          </div>
          <div className="stat-note">{100 - pct.toFixed(0)}% available</div>
        </div>
      </div>

      <div className="panel mb-2xl">
        <div className="gauge">
          <div className="gauge-label">
            <span className="gauge-label-left">Budget Used</span>
            <span className="gauge-label-right">{pct.toFixed(0)}%</span>
          </div>
          <div className="gauge-bar">
            <div className={`gauge-fill ${pct > 80 ? 'warning' : ''}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Service Costs</div>
        <div className="panel">
          {billing?.by_service && Object.entries(billing.by_service).length > 0 ? (
            <div>
              {Object.entries(billing.by_service).map(([service, cost], i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < Object.entries(billing.by_service!).length - 1 ? '1px solid var(--border-primary)' : 'none',
                  }}
                >
                  <div style={{ color: 'var(--text-primary)' }}>{service}</div>
                  <div style={{ fontWeight: '700', color: '#00d9ff' }}>${(cost as number).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No billing data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
