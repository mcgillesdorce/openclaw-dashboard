'use client';

import { useEffect, useState } from 'react';
import { formatTimeET } from '../utils/dateFormatter';

export function ETClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Set initial time
    setTime(formatTimeET(new Date()));

    // Update every second
    const interval = setInterval(() => {
      setTime(formatTimeET(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Prevent hydration mismatch

  return <span>{time} ET</span>;
}
