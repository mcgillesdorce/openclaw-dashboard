'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { label: 'Overview', href: '/' },
    { label: 'Schedule', href: '/schedule' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Agents', href: '/agents' },
    { label: 'Billing', href: '/billing' },
    { label: 'Tracker', href: '/tracker' },
  ];

  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="nav-brand">
          🧠 Psyche
          <span>Control</span>
        </a>
        
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || 
                           (tab.href !== '/' && pathname.startsWith(tab.href));
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

        <div className="nav-status">updated: {time || '—'}</div>
        <div className="nav-dot"></div>
      </div>
    </nav>
  );
}
