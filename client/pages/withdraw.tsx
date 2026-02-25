import Layout from "../components/layout";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getTranslations, Lang } from '../lib/i18n';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Dev mode fallback telegramId for testing outside Telegram
const DEV_TELEGRAM_ID = 12345678;

interface WithdrawConfig {
  commissionRate: number;
  minWithdrawGTL: number;
  maxWithdrawGTL: number;
  gtlToDgtlRate: number;
  dgtlDecimals: number;
}

interface WithdrawHistory {
  _id: string;
  amountGTL: number;
  amountDGTL: number;
  commission: number;
  status: string;
  createdAt: string;
  txHash: string | null;
}

const WithdrawPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ru');
  const [amount, setAmount] = useState('');
  const [config, setConfig] = useState<WithdrawConfig | null>(null);
  const [history, setHistory] = useState<WithdrawHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);
  const t = getTranslations(lang);

  const getTelegramId = useCallback(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
    // Dev mode fallback
    if (process.env.NODE_ENV === 'development' || !tg) {
      console.warn('Telegram WebApp not available, using dev telegramId');
      return DEV_TELEGRAM_ID;
    }
    return null;
  }, []);

  // Fetch config and history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const telegramId = getTelegramId();
        const [configRes, historyRes, walletRes] = await Promise.all([
          axios.get(`${API_URL}/api/withdraw/config`),
          telegramId
            ? axios.get(`${API_URL}/api/withdraw/history?telegramId=${telegramId}`)
            : Promise.resolve({ data: { success: true, data: { requests: [] } } }),
          telegramId
            ? axios.get(`${API_URL}/api/wallet/status?telegramId=${telegramId}`).catch(() => ({ data: { success: true, data: { balance: 0, connected: true } } }))
            : Promise.resolve({ data: { success: true, data: { balance: 0, connected: true } } }),
        ]);

        if (configRes.data.success) setConfig(configRes.data.data);
        if (historyRes.data.success) setHistory(historyRes.data.data.requests || []);
        if (walletRes.data.success) {
          setUserBalance(walletRes.data.data.balance || 0);
          // Only redirect if wallet is genuinely not connected (not dev fallback)
          if (!walletRes.data.data.connected && walletRes.data.data.walletAddress) {
            router.push('/wallet');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getTelegramId, router]);

  // Fetch estimate when amount changes
  useEffect(() => {
    const fetchEstimate = async () => {
      if (!amount || parseInt(amount) <= 0) {
        setEstimate(null);
        return;
      }
      try {
        const res = await axios.get(
          `${API_URL}/api/withdraw/estimate?amountGTL=${amount}`
        );
        if (res.data.success) setEstimate(res.data.data);
      } catch (err) {
        setEstimate(null);
      }
    };

    const timer = setTimeout(fetchEstimate, 300);
    return () => clearTimeout(timer);
  }, [amount]);

  // Handle withdraw submission
  const handleWithdraw = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const telegramId = getTelegramId();
      const response = await axios.post(`${API_URL}/api/withdraw/request`, {
        telegramId,
        amountGTL: parseInt(amount),
      });

      if (response.data.success) {
        const data = response.data.data;
        if (data.status === 'completed') {
          setSuccess(`Withdrawal successful! ${data.amountGTL} GTL converted to DGTL tokens.`);
        } else if (data.status === 'processing') {
          setSuccess('Withdrawal is being processed. Check history for updates.');
        } else {
          setError(data.error || 'Withdrawal failed. Your GTL has been refunded.');
        }
        setAmount('');

        // Refresh data
        const [historyRes, walletRes] = await Promise.all([
          axios.get(`${API_URL}/api/withdraw/history?telegramId=${telegramId}`),
          axios.get(`${API_URL}/api/wallet/status?telegramId=${telegramId}`).catch(() => ({ data: { success: true, data: { balance: 0, connected: true } } })),
        ]);
        if (historyRes.data.success) setHistory(historyRes.data.data.requests || []);
        if (walletRes.data.success) setUserBalance(walletRes.data.data.balance || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#30d158';
      case 'processing': return '#ff9f0a';
      case 'pending': return '#64d2ff';
      case 'failed': return '#ff3b30';
      case 'cancelled': return '#8e8e93';
      default: return '#aaa';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#aaa' }}>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '24px' }}>
          Withdraw DGTL
        </h1>

        {/* Balance */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#aaa' }}>Available Balance</span>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
            {userBalance.toLocaleString()} GTL
          </span>
        </div>

        {/* Messages */}
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
        {success && (
          <div style={{
            background: 'rgba(48, 209, 88, 0.1)',
            border: '1px solid rgba(48, 209, 88, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#30d158',
          }}>
            {success}
          </div>
        )}

        {/* Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Amount (GTL)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={config ? `Min: ${config.minWithdrawGTL}` : '...'}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '18px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => setAmount(String(userBalance))}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              background: 'transparent',
              color: '#667eea',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            MAX
          </button>
        </div>

        {/* Estimate */}
        {estimate && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>Commission ({(estimate.commissionRate * 100).toFixed(0)}%)</span>
              <span style={{ color: '#ff9f0a', fontSize: '14px' }}>-{estimate.commission} GTL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>You receive</span>
              <span style={{ color: '#30d158', fontSize: '16px', fontWeight: 'bold' }}>
                {parseFloat(estimate.outputDGTLFormatted)} DGTL
              </span>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleWithdraw}
          disabled={submitting || !amount || parseInt(amount) <= 0}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: submitting || !amount
              ? 'rgba(102, 126, 234, 0.3)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: submitting || !amount ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
          }}
        >
          {submitting ? 'Processing...' : 'Withdraw'}
        </button>

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '12px' }}>History</h3>
            {history.map((item) => (
              <div
                key={item._id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#fff' }}>{item.amountGTL} GTL</span>
                  <span style={{ color: getStatusColor(item.status), fontSize: '13px', textTransform: 'capitalize' }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WithdrawPage;
