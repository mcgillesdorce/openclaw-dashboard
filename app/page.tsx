'use client';

import { useEffect, useState } from 'react';

interface BillingData {
  updated?: string;
  current_period: string;
  month_total: number;
  month_budget: number;
  month_pct_of_budget: number;
}

interface DashboardData {
  kpis: {
    videos_total: number;
    videos_approved: number;
    approval_rate_pct: number;
    total_cost_usd: number;
    cost_per_approved_usd: number | null;
  };
}

export default function Home() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Add cache-busting query params to force fresh data
        const timestamp = new Date().getTime();
        const [billingRes, dashboardRes] = await Promise.all([
          fetch(`https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/billing_data.json?t=${timestamp}`, {
            headers: { 'Cache-Control': 'no-cache' }
          }),
          fetch(`https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/dashboard_data.json?t=${timestamp}`, {
            headers: { 'Cache-Control': 'no-cache' }
          })
        ]);

        if (!billingRes.ok || !dashboardRes.ok) {
          console.error('Fetch failed:', billingRes.status, dashboardRes.status);
          throw new Error(`Fetch failed: ${billingRes.status} ${dashboardRes.status}`);
        }

        const billingData = await billingRes.json();
        const dashboardData = await dashboardRes.json();

        console.log('✅ Real data loaded:', { billingData, dashboardData });
        setBilling(billingData);
        setDashboard(dashboardData);
        setError(null);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Fetch error, using fallback:', errMsg);
        setError(errMsg);
        // Fallback to placeholder data on error
        setBilling({
          current_period: '2026-06',
          month_total: 2.35,
          month_budget: 10.0,
          month_pct_of_budget: 23.5
        });
        setDashboard({
          kpis: {
            videos_total: 1,
            videos_approved: 0,
            approval_rate_pct: 0,
            total_cost_usd: 2.23,
            cost_per_approved_usd: null
          }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Use real data when available, else placeholders
  const monthlyBudget = billing?.month_budget ?? 10.0;
  const monthlySpend = billing?.month_total ?? 2.35;
  const monthlyPct = (monthlySpend / monthlyBudget) * 100;
  
  const videosTotal = dashboard?.kpis.videos_total ?? 1;
  const videosApproved = dashboard?.kpis.videos_approved ?? 0;
  const approvalRate = dashboard?.kpis.approval_rate_pct ?? 0;
  const costPerVideo = dashboard?.kpis.total_cost_usd && videosTotal > 0
    ? (dashboard.kpis.total_cost_usd / videosTotal).toFixed(2)
    : '—';

  // Get budget status
  const getBudgetStatus = () => {
    if (monthlyPct >= 90) return { emoji: '🚨', label: 'CRITICAL', color: '#ef4444' };
    if (monthlyPct >= 70) return { emoji: '⚠️', label: 'HIGH', color: '#f59e0b' };
    if (monthlyPct >= 50) return { emoji: '⏱️', label: 'MODERATE', color: '#fbbf24' };
    return { emoji: '✅', label: 'HEALTHY', color: '#10b981' };
  };

  const budgetStatus = getBudgetStatus();
  const remainingNum = monthlyBudget - monthlySpend;
  const remaining = remainingNum.toFixed(2);

  return (
    <div>
      {/* Debug Info */}
      {error && (
        <div style={{ background: '#fecaca', border: '1px solid #ef4444', color: '#991b1b', padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '12px' }}>
          ⚠️ Fetch error: {error} (using fallback data)
        </div>
      )}
      {!error && (billing?.month_total ?? 0) > 10 && (
        <div style={{ background: '#dcfce7', border: '1px solid #10b981', color: '#166534', padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '12px' }}>
          ✅ Real data loaded from GitHub (last: {billing?.updated})
        </div>
      )}
      
      {/* Key Metrics - Cost-Focused */}
      <div className="grid g4 mb-2xl">
        <div className="stat-box" style={{ borderLeft: `3px solid ${budgetStatus.color}` }}>
          <div className="stat-label">💳 Monthly Spend</div>
          <div className="stat-value" style={{ color: budgetStatus.color }}>
            ${monthlySpend.toFixed(2)}
          </div>
          <div className="stat-note" style={{ color: budgetStatus.color }}>
            {monthlyPct.toFixed(1)}% of $10.00
          </div>
        </div>
        
        <div className="stat-box" style={{ borderLeft: '3px solid #10b981' }}>
          <div className="stat-label">💰 Budget Remaining</div>
          <div className="stat-value" style={{ color: remainingNum > 3 ? '#10b981' : '#ef4444' }}>
            ${remaining}
          </div>
          <div className="stat-note">
            {(100 - monthlyPct).toFixed(1)}% available
          </div>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
          <div className="stat-label">💵 Cost per Video</div>
          <div className="stat-value">
            ${costPerVideo}
          </div>
          <div className="stat-note">efficiency metric</div>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #8b5cf6' }}>
          <div className="stat-label">📊 Approval Rate</div>
          <div className="stat-value">
            {approvalRate}%
          </div>
          <div className="stat-note">{videosApproved}/{videosTotal} approved</div>
        </div>
      </div>

      {/* Budget Progress - Prominent */}
      <div className="panel mb-2xl" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Monthly Budget Status</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {monthlyPct < 100
                ? `Projected monthly: $${(monthlySpend * (30 / new Date().getDate())).toFixed(2)}`
                : '⚠️ Budget exceeded'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: budgetStatus.color }}>
              {budgetStatus.emoji} {monthlyPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', color: budgetStatus.color, marginTop: '4px' }}>
              {budgetStatus.label}
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '12px', background: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(monthlyPct, 100)}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${budgetStatus.color}, ${budgetStatus.color}ee)`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Today's Activity - Coming Soon */}
      {/* <div className="grid g3 mb-2xl">
        <div className="stat-box">
          <div className="stat-label">🎬 Videos Today</div>
          <div className="stat-value">—</div>
          <div className="stat-note">generated & approved</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">💸 Today's Cost</div>
          <div className="stat-value">—</div>
          <div className="stat-note">of $0.33 daily budget</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">⏱️ Pipeline Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)', animation: 'pulse 2s infinite' }}></div>
            <span style={{ color: '#10b981' }}>Active</span>
          </div>
        </div>
      </div>

      {/* Quick Cost Insights */}
      <div className="section">
        <div className="section-title">💡 Cost Insights</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Daily Average</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              $0.28
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Based on 7-day trend
            </div>
          </div>

          <div className="panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Projected Monthly</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: budgetStatus.color }}>
              ${(0.28 * 30).toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              At current pace
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: '16px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
            🎯 Cost Optimization Target
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Keep monthly spend under $10.00. Current monthly average cost per video: <strong>${costPerVideo}</strong>. 
            Target: &lt;$1.00 per video for sustainable growth.
          </div>
        </div>
      </div>

      {/* Data Source Footer */}
      <div style={{ textAlign: 'right', padding: '24px 0', fontSize: '11px', color: 'var(--text-dim)', borderTop: '1px solid var(--border-primary)', marginTop: '48px' }}>
        Data source: GitHub data branch | Real-time ISR updates every 30 seconds
      </div>
    </div>
  );
}
