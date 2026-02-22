import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { shopService } from '../services/shopService';
import { IIcon } from '../models/Icon';
import Head from 'next/head';
import { getTranslations, Lang } from '../lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const PaymentPage = () => {
  const { data: session } = useSession();
  const [icons, setIcons] = useState<IIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
  const telegramId = tg?.initDataUnsafe?.user?.id || (session?.user as any)?.telegramId;

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await shopService.getIcons();
      const allIcons = data.icons || data;
      setIcons(allIcons.filter((i: IIcon) => i.starsPrice && i.starsPrice > 0));
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (item: IIcon) => {
    if (!telegramId) {
      tg?.showAlert?.(t.payment_tg_alert);
      return;
    }
    setPurchasing(item._id);
    try {
      const res = await fetch(`${API_URL}/api/stars/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          itemType: 'icon',
          itemId: item._id,
          title: item.name,
          description: item.description || item.name,
          starsPrice: item.starsPrice,
          imageUrl: item.imageUrl
        })
      });
      const data = await res.json();
      if (data.success && data.invoiceLink) {
        tg?.openInvoice(data.invoiceLink, (status: string) => {
          if (status === 'paid') {
            tg?.showAlert?.(t.payment_success);
            loadItems();
          }
          setPurchasing(null);
        });
      } else {
        tg?.showAlert?.(t.payment_error);
        setPurchasing(null);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPurchasing(null);
    }
  };

  const rarityColors: Record<string, string> = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <Head>
        <title>Stars — DGTL</title>
      </Head>
      <div className="p-4 pb-20">
        <h1 className="text-3xl font-bold text-center mb-2">{t.payment_title}</h1>
        <p className="text-center opacity-70 mb-8">{t.payment_subtitle}</p>

        {icons.length === 0 ? (
          <p className="text-center opacity-50 mt-20">{t.payment_empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {icons.map((item) => (
              <div key={item._id} className={`card bg-base-100 shadow-xl border-2 ${rarityColors[item.rarity || 'common']}`}>
                <div className="card-body items-center text-center">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mb-4" />}
                  <h2 className="card-title">{item.name}</h2>
                  <div className="badge badge-outline mb-2 uppercase text-xs">{item.rarity}</div>
                  <div className="text-2xl font-bold text-accent mb-4">⭐ {item.starsPrice} Stars</div>
                  <div className="card-actions w-full">
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => handleBuy(item)}
                      disabled={purchasing === item._id}
                    >
                      {purchasing === item._id ? '...' : t.payment_buy}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;
