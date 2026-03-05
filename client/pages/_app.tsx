import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

// Use env variable for manifest URL, fallback to localhost for dev
const manifestUrl = process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? `${window.location.origin}/tonconnect-manifest.json`
    : 'https://dgtl-miniapp.vercel.app/tonconnect-manifest.json');

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isTelegram, setIsTelegram] = useState<boolean | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
    const router = useRouter();

  useEffect(() => {
    // Check if running inside Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      tg.ready();
      tg.expand();
    } else {
      setIsTelegram(false);
      // Allow dev mode on localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setIsDevMode(true);
      }
    }
  }, []);

  // Show warning banner when not in Telegram (but still render the app for testing)
  const showDevBanner = isTelegram === false && isDevMode && !router.pathname.startsWith('/game');

    // Hide TonConnect widget on game page
  const isGamePage = router.pathname.startsWith('/game');
  useEffect(() => {
    const tcWidget = document.getElementById('tc-widget-root');
    if (tcWidget) {
      tcWidget.style.display = isGamePage ? 'none' : '';
    }
  }, [isGamePage]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <SessionProvider session={session}>
        <Head>
          <script src="https://telegram.org/js/telegram-web-app.js" />
        </Head>
        {showDevBanner && (
          <div style={{
            background: '#ff9800',
            color: '#000',
            textAlign: 'center',
            padding: '4px 16px',
            fontSize: '11px',
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '0 0 8px 8px',
            zIndex: 9999,
            whiteSpace: 'nowrap'
          }}>
            Dev mode - open in Telegram for full functionality
          </div>
        )}
        {isTelegram === false && !isDevMode ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px',
            background: '#000',
            color: '#fff'
          }}>
            <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>DGTL Mini App</h1>
            <p style={{ opacity: 0.7 }}>Please open this app inside Telegram</p>
          </div>
        ) : (
          <div style={{ marginTop: showDevBanner ? '28px' : '0' }}>
            <Component {...pageProps} />
          </div>
        )}
      </SessionProvider>
    </TonConnectUIProvider>
  );
}

export default MyApp;
