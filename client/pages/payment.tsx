import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { shopService } from '../services/shopService';
import { IIcon } from '../models/Icon';
import Head from 'next/head';
import { getTranslations, getCountryName, Lang } from '../lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const RESOURCE_ICON_URLS: Record<string, string> = {
  gold: '/icons/resources/gold.svg',
  copper: '/icons/resources/copper.svg',
  iron: '/icons/resources/iron.svg',
  rare_metals: '/icons/resources/rare_metals.svg',
  oil_gas: '/icons/resources/oil_gas.svg',
  diamonds: '/icons/resources/diamonds.svg',
  coal: '/icons/resources/coal.svg',
};

const PaymentPage = () => {
  const { data: session } = useSession();
  const [icons, setIcons] = useState<IIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
  const telegramId = tg?.initDataUnsafe?.user?.id || (session?.user as any)?.telegramId;

  const getIconName = (icon: IIcon) => lang === 'en' ? (icon.nameEn || icon.name) : icon.name;

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

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-2">{t.payment_title}...</p>
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
              <div key={item._id} className="card bg-base-200 shadow-xl border border-gray-700">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={RESOURCE_ICON_URLS[item.resourceType] || item.imageUrl}
                      alt={getIconName(item)}
                      className="w-12 h-12"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">{getIconName(item)}</h2>
                      <p className="text-xs opacity-60">{getCountryName(lang, item.country)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge badge-sm badge-outline">{item.resourceType}</span>
                    <span className="badge badge-sm badge-ghost">{t.shop_share}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-green-400">+{item.stakingRate || item.hashrate}{t.shop_per_hour}</span>
                    <span className="text-sm opacity-60">{item.availableShares}/{item.totalShares}</span>
                  </div>
                  <div className="text-2xl font-bold text-accent text-center mb-3">
                                        ⭐ {item.starsPrice} Stars
                  </div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => handleBuy(item)}
                    disabled={purchasing === item._id || item.availableShares === 0}
                  >
                    {purchasing === item._id ? '...' : item.availableShares === 0 ? t.shop_owned_label : t.payment_buy}
                  </button>
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
