'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatTimeET } from '../utils/dateFormatter';

const tabs = [
  { label: 'Overview', href: '/' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Billing', href: '/billing' },
  { label: 'Tracker', href: '/tracker' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>('—');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const formatted = formatTimeET(new Date());
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.href = window.location.href;
  };

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          🧠 Psyche
          <span>Control</span>
        </Link>

        <div className="nav-tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`nav-tab ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Pending Approvals indicator */}
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--priority-high)', padding: '6px 10px', background: 'rgba(255, 51, 51, 0.15)', borderRadius: '4px', border: '1px solid var(--priority-high)33', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            ⏳ 8 PENDING
          </div>
          
          <button
            onClick={handleRefresh}
            style={{
              background: 'rgba(0, 255, 221, 0.05)',
              border: '1px solid var(--border-neon)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '6px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isRefreshing ? 0.5 : 1,
              transform: isRefreshing ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 221, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="Refresh page"
            disabled={isRefreshing}
          >
            🔄
          </button>
          <div className="nav-status">
            <span title="Eastern Time">{time} ET</span>
          </div>
          <div className="nav-dot"></div>
        </div>
      </div>
    </nav>
  );
}
