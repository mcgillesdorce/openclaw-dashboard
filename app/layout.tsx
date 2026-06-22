import type { Metadata } from 'next';
import './globals.css';
import Navigation from './components/Navigation';

export const metadata: Metadata = {
  title: 'Psyche — Mission Control',
  description: 'Real-time pipeline dashboard for psychology video production',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" defer></script>
      </head>
      <body>
        <Navigation />
        <main className="page-container">
          {children}
        </main>
      </body>
    </html>
  );
}
