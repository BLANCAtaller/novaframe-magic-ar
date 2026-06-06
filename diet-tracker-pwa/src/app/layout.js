import { Geist } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Diet Tracker',
  description: 'Registra tu dieta con fotos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Diet Tracker',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10b981',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Diet Tracker" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={geist.className} style={{ background: '#f9fafb', minHeight: '100%' }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
        <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100%', position: 'relative' }}>
          <main style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
