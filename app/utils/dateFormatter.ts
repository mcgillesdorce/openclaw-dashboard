/**
 * Timezone-aware date formatting utility
 * All dates formatted to Eastern Time (America/New_York)
 */

const TZ = 'America/New_York';

export function formatDateET(dateStr: string | Date | number): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr instanceof Date ? dateStr : new Date(dateStr);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

export function formatTimeET(dateStr: string | Date | number): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr instanceof Date ? dateStr : new Date(dateStr);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

export function formatDateShortET(dateStr: string | Date | number): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr instanceof Date ? dateStr : new Date(dateStr);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatMonthYearET(dateStr: string | Date | number): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr instanceof Date ? dateStr : new Date(dateStr);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function getCurrentTimeET(): Date {
  // Returns current time (browser's time adjusted by timezone offset)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const values: { [key: string]: number } = {};
  
  parts.forEach(part => {
    if (part.type !== 'literal') {
      values[part.type] = parseInt(part.value, 10);
    }
  });
  
  return new Date(values.year, values.month - 1, values.day, values.hour, values.minute, values.second);
}
