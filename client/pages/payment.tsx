import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { shopService } from '../services/shopService';
import { IIcon } from '../models/Icon';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const PaymentPage = () => {
  const { data: session } = useSession();
  const [icons, setIcons] = useState<IIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const tg = typeof window !== 'undefined'
    ? (window as any).Telegram?.WebApp : null;
  const telegramId = tg?.initDataUnsafe?.user?.id
    || (session?.user as any)?.telegramId;

  useEffect(() => { loadItems(); }, []);

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
    if (!telegramId) { tg?.showAlert?.('Откройте через Telegram'); return; }
    setPurchasing(item._id);
    try {
      const res = await fetch(`${API_URL}/api/stars/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId, itemType: 'icon', itemId: item._id,
          title: item.name, description: item.description || item.name,
          starsPrice: item.starsPrice, imageUrl: item.imageUrl
        })
      });
      const data = await res.json();
      if (data.success && data.invoiceLink) {
        tg?.openInvoice(data.invoiceLink, (status: string) => {
          if (status === 'paid') {
            tg?.showAlert?.('Покупка совершена!');
            loadItems();
          }
          setPurchasing(null);
        });
      } else {
        tg?.showAlert?.('Не удалось создать счёт');
        setPurchasing(null);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPurchasing(null);
    }
  };

  const rarityColors: Record<string, string> = {
    common: 'border-gray-500', rare: 'border-blue-500',
    epic: 'border-purple-500', legendary: 'border-yellow-500'
  };

  if (loading) return (
    <Layout><div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg" />
    </div></Layout>
  );

  return (
    <Layout>
      <Head><title>Stars — DGTL</title></Head>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-1">Покупка за Stars</h1>
        <p className="text-center text-gray-400 text-sm mb-4">Оплата через Telegram Stars</p>
        {icons.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Нет товаров для покупки за Stars</p>
        ) : (
          <div className="space-y-3">
            {icons.map((item) => (
              <div key={item._id}
                className={`flex items-center bg-base-200 rounded-xl p-3 gap-3 border ${rarityColors[item.rarity] || 'border-gray-600'}`}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <span className="badge badge-xs badge-outline">{item.rarity}</span>
                  <p className="text-yellow-400 font-bold text-sm mt-1">⭐ {item.starsPrice} Stars</p>
                </div>
                <button className="btn btn-sm btn-warning"
                  disabled={purchasing === item._id}
                  onClick={() => handleBuy(item)}>
                  {purchasing === item._id ? '...' : 'Купить'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;
