import Layout from '../components/layout';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IUserState } from '../models/User';
import { IIcon, IUserIcon, ContinentKey, CONTINENT_LABELS, RESOURCE_LABELS, ResourceType } from '../models/Icon';
import { shopService } from '../services/shopService';
import { starsService } from '../services/starsService';
import { showNotification } from '../lib/notifications';
import { getTranslations, getCountryName, Lang } from '../lib/i18n';
import styles from '../styles/Shop.module.css';
import WorldMap from '../components/WorldMap';
import axios from 'axios';

const RESOURCE_ICON_URLS: Record<string, string> = {
  gold: '/icons/resources/gold.svg',
  copper: '/icons/resources/copper.svg',
  iron: '/icons/resources/iron.svg',
  rare_metals: '/icons/resources/rare_metals.svg',
  oil_gas: '/icons/resources/oil_gas.svg',
  diamonds: '/icons/resources/diamonds.svg',
  coal: '/icons/resources/coal.svg',
};
const Shop: React.FC = () => {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);
  const getIconName = (icon: IIcon) => lang === 'en' ? (icon.nameEn || icon.name) : icon.name;
  const RESOURCE_FILTERS = [
    { key: 'all', label: t.filter_all, emoji: '' },
    { key: 'gold', label: t.filter_gold, emoji: '🟡' },
    { key: 'copper', label: t.filter_copper, emoji: '🔴' },
    { key: 'iron', label: t.filter_iron, emoji: '🔘' },
    { key: 'rare_metals', label: t.filter_rare, emoji: '⚛' },
    { key: 'oil_gas', label: t.filter_oil, emoji: '🛢' },
    { key: 'diamonds', label: t.filter_diamonds, emoji: '💎' },
    { key: 'coal', label: t.filter_coal, emoji: '⚫' },
  ];
  const [icons, setIcons] = useState<IIcon[]>([]);
  const [myIcons, setMyIcons] = useState<IUserIcon[]>([]);
  const [userData, setUserData] = useState<IUserState | null>(null);
  const [activeContinent, setActiveContinent] = useState<ContinentKey | null>(null);
  const [activeResource, setActiveResource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [buyingStarsId, setBuyingStarsId] = useState<string | null>(null);
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);
  useEffect(() => {
    if (session?.user) loadUserData();
  }, [session]);
  useEffect(() => {
    if (activeContinent) loadIcons();
  }, [activeContinent, activeResource]);
  const loadUserData = async () => {
    try {
      const telegramId = (session?.user as any)?.telegramId;
      if (!telegramId) return;
      const userRes = await axios.get(`/api/users/${telegramId}`);
      if (userRes.data.success) {
        setUserData(userRes.data.user);
        const myRes = await shopService.getMyIcons(userRes.data.user._id);
        if (myRes.success) setMyIcons(myRes.userIcons);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const loadIcons = async () => {
    try {
      setIsLoading(true);
      const res = await shopService.getIcons(activeContinent || undefined, activeResource !== 'all' ? activeResource : undefined);
      if (res.success) setIcons(res.icons);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBuy = async (iconId: string) => {
    if (!userData?._id) return showNotification(t.shop_auth);
    try {
      setBuyingId(iconId);
      const result = await shopService.buyIcon(userData._id, iconId);
      if (result.success) {
        showNotification(t.shop_bought);
        await loadUserData();
        await loadIcons();
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.error || t.shop_error);
    } finally {
      setBuyingId(null);
    }
  };
  const handleBuyWithStars = async (icon: IIcon) => {
    const telegramId = (session?.user as any)?.telegramId;
    if (!telegramId) return showNotification(t.shop_auth);
    if (!icon.starsPrice) return showNotification(t.shop_no_stars);
    try {
      setBuyingStarsId(icon._id);
      const result = await starsService.createInvoice({
        telegramId,
        itemType: 'icon',
        itemId: icon._id,
        title: getIconName(icon),
        description: `${t.shop_share}: ${getIconName(icon)}`,
        starsPrice: icon.starsPrice,
        imageUrl: icon.imageUrl || RESOURCE_ICON_URLS[icon.resourceType] || '',
      });
      if (!result.success || !result.invoiceLink) return showNotification(result.error || t.shop_invoice_error);
      const status = await starsService.openInvoice(result.invoiceLink);
      if (status === 'paid') {
        showNotification(t.shop_paid);
        await loadUserData();
        await loadIcons();
      } else if (status === 'cancelled') {
        showNotification(t.shop_cancelled);
      } else {
        showNotification(t.shop_error + ': ' + status);
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.error || t.shop_error_stars);
    } finally {
      setBuyingStarsId(null);
    }
  };
  const getOwnedCount = (iconId: string) => {
    return myIcons.filter(ui => (typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id) === iconId).length;
  };
  if (!activeContinent) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>{t.shop_title}</h1>
          <div className={styles.coins}>
            💰 {userData?.coins?.toLocaleString() || 0} {t.shop_coins}
          </div>
          <WorldMap onSelect={(c) => setActiveContinent(c)} activeContinent={null} />
          <p className={styles.mapHint}>{t.shop_map_hint}</p>
          {myIcons.length > 0 &&
            <div className={styles.ownedSection}>
              <h3>{t.shop_owned}: {myIcons.length}</h3>
            </div>
          }
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => { setActiveContinent(null); setIcons([]); }}>{t.shop_back}</button>
        <h1 className={styles.title}>
          {lang === 'ru' ? CONTINENT_LABELS[activeContinent] : (t as any)[`continent_${activeContinent}`]}
        </h1>
        <div className={styles.coins}>
          💰 {userData?.coins?.toLocaleString() || 0} {t.shop_coins}
        </div>
        <div className={styles.tabs}>
          {RESOURCE_FILTERS.map(f => (
            <button key={f.key} className={`${styles.tab} ${activeResource === f.key ? styles.tabActive : ''}`} onClick={() => setActiveResource(f.key)}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
        {isLoading ?
          <div className={styles.loading}>{t.shop_loading}</div>
        : icons.length === 0 ?
          <div className={styles.loading}>{t.shop_empty}</div>
        : (
          <div className={styles.grid}>
            {icons.map(icon => {
              const owned = getOwnedCount(icon._id);
              return (
                <div key={icon._id} className={styles.card}>
                  <img src={icon.imageUrl || RESOURCE_ICON_URLS[icon.resourceType] || '/icons/resources/gold.svg'} alt={getIconName(icon)} className={styles.cardImage} />
                  <div className={styles.cardName}>{getIconName(icon)}</div>
                  <div className={styles.cardCountry}>{getCountryName(lang, icon.country)}</div>
                  <div className={styles.cardShare}>{t.shop_share}</div>
                  <div className={styles.cardRate}>+{icon.stakingRate}{t.shop_per_hour}</div>
                  {owned > 0 &&
                    <div className={styles.owned}>{t.shop_owned_label}: {owned}</div>
                  }
                  <button className={styles.buyButton} onClick={() => handleBuy(icon._id)} disabled={buyingId === icon._id || (userData?.coins || 0) < icon.price}>
                    {buyingId === icon._id ? '...' : `${icon.price.toLocaleString()} ${t.shop_coins}`}
                  </button>
                  {icon.starsPrice && (
                    <button className={styles.buyStarsButton} onClick={() => handleBuyWithStars(icon)} disabled={buyingStarsId === icon._id}>
                      {buyingStarsId === icon._id ? '...' : `⭐ ${icon.starsPrice} Stars`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Shop;
