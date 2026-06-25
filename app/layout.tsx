import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
import Navigation from '@/app/components/Navigation';

export const metadata: Metadata = {
  title: 'Psyche — Mission Control',
  description: 'Real-time business-critical pipeline dashboard (Eastern Time)',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: [{ url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>' }],
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      </head>
      <body>
        <Navigation />
        <main className="page-container">
          {children}
        </main>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Psyche Mission Control</span>
          <span className="site-footer-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </span>
        </footer>
      </body>
    </html>
  );
}
