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
  { label: 'Billing', href: '/billing' },
  { label: 'Tracker', href: '/tracker' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>('—');

  useEffect(() => {
    const updateTime = () => {
      const formatted = formatTimeET(new Date());
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="nav-status">
          <span title="Eastern Time">{time} ET</span>
        </div>
        <div className="nav-dot"></div>
      </div>
    </nav>
  );
}
