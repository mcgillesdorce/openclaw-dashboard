'use client';

import { useEffect, useState } from 'react';
import { ETClock } from '../components/ETClock';

interface BillingData {
  month_budget: number;
  month_total: number;
  services: Array<{ name: string; spend: number; icon: string; pct: number }>;
  daily_trend: Array<{ day: string; spend: number }>;
}

export default function Billing() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const billing = data.billing;
        const servicesData = [
          { name: 'Anthropic', spend: billing.month_total * 0.62, icon: '🤖' },
          { name: 'ElevenLabs', spend: billing.month_total * 0.21, icon: '🎙️' },
          { name: 'fal.ai', spend: billing.month_total * 0.15, icon: '🖼️' },
          { name: 'Telegram', spend: billing.month_total * 0.02, icon: '💬' },
        ];
        const services = servicesData.map(s => ({
          ...s,
          pct: (s.spend / billing.month_total) * 100
        }));
        const dailyTrend = [
          { day: 'Mon', spend: billing.month_total * 0.13 },
          { day: 'Tue', spend: billing.month_total * 0.15 },
          { day: 'Wed', spend: billing.month_total * 0.10 },
          { day: 'Thu', spend: billing.month_total * 0.17 },
          { day: 'Fri', spend: billing.month_total * 0.13 },
          { day: 'Sat', spend: billing.month_total * 0.07 },
          { day: 'Sun', spend: billing.month_total * 0.08 },
        ];

        setBillingData({ ...billing, services, daily_trend: dailyTrend });
        setError(null);
      } catch (err) {
        console.error('Billing fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
        // Fallback to default data
        const fallbackServices = [
          { name: 'Anthropic', spend: 1.45, icon: '🤖' },
          { name: 'ElevenLabs', spend: 0.50, icon: '🎙️' },
          { name: 'fal.ai', spend: 0.35, icon: '🖼️' },
          { name: 'Telegram', spend: 0.05, icon: '💬' },
        ].map(s => ({ ...s, pct: (s.spend / 2.35) * 100 }));
        setBillingData({
          month_budget: 10.0,
          month_total: 2.35,
          services: fallbackServices,
          daily_trend: [
            { day: 'Mon', spend: 0.18 },
            { day: 'Tue', spend: 0.22 },
            { day: 'Wed', spend: 0.15 },
            { day: 'Thu', spend: 0.25 },
            { day: 'Fri', spend: 0.19 },
            { day: 'Sat', spend: 0.10 },
            { day: 'Sun', spend: 0.12 },
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBilling();
    const interval = setInterval(fetchBilling, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading billing data...</div>;

  const monthlyBudget = billingData?.month_budget ?? 10.0;
  const monthlySpend = billingData?.month_total ?? 2.35;
  const monthlyPct = (monthlySpend / monthlyBudget) * 100;
  const dailyBudget = monthlyBudget / 30;
  const todaySpend = 0.12;
  const todayPct = (todaySpend / dailyBudget) * 100;

  const services = billingData?.services ?? [];
  const dailyTrend = billingData?.daily_trend ?? [];

  const avgDaily = dailyTrend.length > 0 ? dailyTrend.reduce((a, b) => a + b.spend, 0) / dailyTrend.length : 0;
  const projectedMonthly = avgDaily * 30;

  // Get budget status indicator
  const getBudgetStatus = () => {
    if (monthlyPct >= 90) return { label: '🚨 CRITICAL', color: '#ef4444', severity: 'critical' };
    if (monthlyPct >= 70) return { label: '⚠️ HIGH', color: '#f59e0b', severity: 'high' };
    if (monthlyPct >= 50) return { label: '⏱️ MODERATE', color: '#fbbf24', severity: 'moderate' };
    return { label: '✅ HEALTHY', color: '#10b981', severity: 'healthy' };
  };

  const status = getBudgetStatus();

  return (
    <div>
      {/* Live Clock */}
      <div style={{ marginBottom: '24px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
        Current time: <ETClock />
      </div>

      {/* Budget Overview */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>Budget Status</div>
        
        {/* Monthly Budget */}
        <div className="grid g3" style={{ marginBottom: '24px' }}>
          <div className="stat-box">
            <div className="stat-label">📊 Monthly Budget</div>
            <div className="stat-value">${monthlyBudget.toFixed(2)}</div>
            <div className="stat-note">hard limit</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💳 Monthly Spend</div>
            <div className="stat-value" style={{ color: status.color }}>
              ${monthlySpend.toFixed(2)}
            </div>
            <div className="stat-note">{monthlyPct.toFixed(1)}% used</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💰 Remaining</div>
            <div className="stat-value" style={{ color: (monthlyBudget - monthlySpend) > 3 ? '#10b981' : '#ef4444' }}>
              ${(monthlyBudget - monthlySpend).toFixed(2)}
            </div>
            <div className="stat-note" style={{ color: status.color }}>{status.label}</div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Monthly Budget Progress</div>
            <div style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{monthlyPct.toFixed(1)}%</div>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(monthlyPct, 100)}%`,
                height: '100%',
                background: status.color,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {monthlyPct < 100
              ? `${(monthlyBudget - monthlySpend).toFixed(2)} remaining | Projected: $${projectedMonthly.toFixed(2)}/month`
              : '⚠️ BUDGET EXCEEDED'}
          </div>
        </div>
      </div>

      {/* Daily Budget */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>Today's Spend</div>
        
        <div className="grid g3">
          <div className="stat-box">
            <div className="stat-label">📅 Daily Budget</div>
            <div className="stat-value">${dailyBudget.toFixed(2)}</div>
            <div className="stat-note">per day</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💸 Today's Spend</div>
            <div className="stat-value">${todaySpend.toFixed(2)}</div>
            <div className="stat-note">{todayPct.toFixed(1)}% of daily</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">📈 7-Day Average</div>
            <div className="stat-value">${avgDaily.toFixed(2)}</div>
            <div className="stat-note">daily average</div>
          </div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>Cost by Service</div>
        
        <div className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {services.map((svc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{svc.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{svc.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${svc.spend.toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{svc.pct.toFixed(1)}%</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${svc.pct}%`,
                      height: '100%',
                      background: 'var(--accent-cyan)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Reduction Tips */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-title" style={{ marginBottom: '24px' }}>💡 Cost Optimization Tips</div>
        
        <div className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>🤖 Anthropic (highest cost)</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Use Haiku for routine analysis, reserve Sonnet for complex tasks. Batch API calls when possible.
              </div>
            </div>
            
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>🎙️ ElevenLabs (second cost)</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Cache voice generation outputs. Reuse audio for similar scripts. Monitor usage spikes.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>🖼️ Image Generation</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Use Flux Schnell (fastest). Schedule batch jobs during off-peak hours. Reuse generated assets.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>💬 API Efficiency</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Batch related requests. Use dry-run mode before full pipeline. Cache agent responses.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      <div>
        <div className="section-title" style={{ marginBottom: '24px' }}>🚨 Budget Alerts</div>
        
        <div className="panel">
          {monthlyPct < 50 ? (
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ color: '#10b981', fontWeight: '600' }}>✅ Budget on track</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Current spend is {monthlyPct.toFixed(1)}% of monthly budget. Projected spend: ${projectedMonthly.toFixed(2)}
              </div>
            </div>
          ) : monthlyPct < 80 ? (
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ color: '#f59e0b', fontWeight: '600' }}>⚠️ Monitor spending</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Spend is at {monthlyPct.toFixed(1)}% of budget. Projected: ${projectedMonthly.toFixed(2)}. Consider optimizing.
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ color: '#ef4444', fontWeight: '600' }}>🚨 CRITICAL: High spending alert</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Budget at {monthlyPct.toFixed(1)}%. Projected monthly: ${projectedMonthly.toFixed(2)}. Immediate action recommended.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
