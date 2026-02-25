import Layout from "../components/layout";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getTranslations, Lang } from '../lib/i18n';
import { useRouter } from 'next/router';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Dev mode fallback telegramId for testing outside Telegram
const DEV_TELEGRAM_ID = 12345678;

interface WalletStatus {
  connected: boolean;
  walletAddress: string | null;
  balance: number;
  tonBalance: string | null;
}

const WalletPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ru');
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tonConnectUI] = useTonConnectUI();
  const tonWallet = useTonWallet();

  const t = getTranslations(lang);

    useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail as Lang);
    window.addEventListener('langChange', handleLangChange);
    return () => window.removeEventListener('langChange', handleLangChange);
  }, []);

  // Get telegramId from session or Telegram WebApp, fallback to dev ID
  const getTelegramId = useCallback(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
    // Dev mode fallback
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return DEV_TELEGRAM_ID;
    }
    return null;
  }, []);

  // Fetch wallet status
  const fetchWalletStatus = useCallback(async () => {
    const telegramId = getTelegramId();
    if (!telegramId) {
      setLoading(false);
      setError(t.wallet_error_detect);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/wallet/status?telegramId=${telegramId}`
      );
      if (response.data.success) {
        setWalletStatus(response.data.data);
      }
    } catch (err: any) {
      // If user not found, show connect wallet UI instead of error
      if (err.response?.status === 404) {
        setWalletStatus({ connected: false, walletAddress: null, balance: 0, tonBalance: null });
      } else {
        setError(err.response?.data?.error || 'Failed to fetch wallet status');
      }
    } finally {
      setLoading(false);
    }
  }, [getTelegramId]);

  useEffect(() => {
    fetchWalletStatus();
  }, [fetchWalletStatus]);

  // Handle TON Connect
  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      setError(null);

      if (!tonConnectUI) {
        setError(t.wallet_error_init);
        return;
      }

      await tonConnectUI.openModal();
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setConnecting(false);
    }
  };

  // Watch for wallet connection changes from TonConnect
  useEffect(() => {
    if (tonWallet) {
      const walletAddress = tonWallet.account.address;
      const telegramId = getTelegramId();
      if (telegramId && walletAddress) {
        // Save wallet to backend
        axios.post(`${API_URL}/api/wallet/connect`, {
          telegramId,
          walletAddress,
        }).then(() => {
          fetchWalletStatus();
        }).catch((err) => {
          setError(err.response?.data?.error || 'Failed to save wallet');
        });
      }
    }
  }, [tonWallet, getTelegramId, fetchWalletStatus]);

  // Handle disconnect
  const handleDisconnectWallet = async () => {
    try {
      setError(null);
      const telegramId = getTelegramId();

      const response = await axios.post(`${API_URL}/api/wallet/disconnect`, {
        telegramId,
      });

      if (response.data.success) {
        // Also disconnect TonConnect
        if (tonConnectUI) {
          await tonConnectUI.disconnect();
        }
        await fetchWalletStatus();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Disconnect failed');
    }
  };

  // Shorten address for display
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '24px' }}>
          TON Wallet
        </h1>

        {error && (
          <div style={{
            background: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#ff3b30',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>
            Loading...
          </div>
        ) : walletStatus?.connected ? (
          <div>
            {/* Connected wallet info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                Connected Wallet
              </div>
              <div style={{ color: '#fff', fontSize: '16px', fontFamily: 'monospace' }}>
                {shortenAddress(walletStatus.walletAddress || '')}
              </div>
            </div>

            {/* Balances */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#aaa' }}>GTL Balance</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  {walletStatus.balance?.toLocaleString()} GTL
                </span>
              </div>
              {walletStatus.tonBalance && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#aaa' }}>TON Balance</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>
                    {walletStatus.tonBalance} TON
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={() => router.push('/withdraw')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Withdraw DGTL Tokens
            </button>

            <button
              onClick={handleDisconnectWallet}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                background: 'transparent',
                color: '#ff3b30',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '40px 20px',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{String.fromCodePoint(0x1F4B0)}</div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>{t.wallet_connect_title}</h3>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                Connect your TON wallet to withdraw DGTL tokens
              </p>
            </div>

            <button
              onClick={handleConnectWallet}
              disabled={connecting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: connecting
                  ? 'rgba(102, 126, 234, 0.5)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: connecting ? 'not-allowed' : 'pointer',
              }}
            >
              {connecting ? t.wallet_connecting : t.wallet_connect_btn}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WalletPage;
