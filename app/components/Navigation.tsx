'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatTimeET } from '../utils/dateFormatter';

const tabs = [
  { label: 'Overview', href: '/' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Agents', href: '/agents' },
  { label: 'Approvals', href: '/approvals' },
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
          {/* Approvals indicator */}
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', padding: '4px 8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '4px' }}>
            ⏳ Approvals
          </div>
          
          <button
            onClick={handleRefresh}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
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
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--accent-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--text-muted)';
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
