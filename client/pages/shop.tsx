import Layout from '../components/layout';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IUserState } from '../models/User';
import { IIcon, IUserIcon, ContinentKey, CONTINENT_LABELS, RESOURCE_LABELS, ResourceType } from '../models/Icon';
import { IBoostCard } from '../models/Boosts';
import { shopService } from '../services/shopService';
import { starsService } from '../services/starsService';
import { showNotification } from '../lib/notifications';
import { getTranslations, getCountryName, getResourceTypeName, getMineralName, getBoostName, Lang } from '../lib/i18n';
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

interface MineralCard {
  imageUrl: string;
  name: string;
  symbol: string;
  price: number;
  starsPrice: number;
  owned: number;
}

const minerals: MineralCard[] = [
  { imageUrl: "/mineral/c.png", name: "Carbon", symbol: "C", price: 300, starsPrice: 15, owned: 0 },
  { imageUrl: "/mineral/au.png", name: "Gold", symbol: "Au", price: 800, starsPrice: 40, owned: 0 },
  { imageUrl: "/mineral/as.png", name: "Arsenic", symbol: "As", price: 200, starsPrice: 10, owned: 0 },
];
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

  // Boosts state
  const [boostCards, setBoostCards] = useState<IBoostCard[]>([]);
  const [isBoostsLoading, setIsBoostsLoading] = useState(true);
  const [equippedBoots, setEquippedBoots] = useState<string | null>(null);
  const [equippedPickaxe, setEquippedPickaxe] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    const handleLangChange = (e: any) => { setLang(e.detail as Lang); };
    window.addEventListener('langChange', handleLangChange);
    return () => window.removeEventListener('langChange', handleLangChange);
  }, []);

  useEffect(() => {
    if (session?.user) loadUserData();
  }, [session]);

  useEffect(() => {
    if (activeContinent) loadIcons();
  }, [activeContinent, activeResource]);

  // Fetch boost cards
  useEffect(() => {
    const fetchBoostCards = async () => {
      try {
        const response = await axios.get('/api/boost-cards');
        setBoostCards(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsBoostsLoading(false);
      }
    };
    fetchBoostCards();
  }, []);

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
    } catch (err) { console.error(err); }
  };

  const loadIcons = async () => {
    try {
      setIsLoading(true);
      const res = await shopService.getIcons(activeContinent || undefined, activeResource !== 'all' ? activeResource : undefined);
      if (res.success) setIcons(res.icons);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
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
    } finally { setBuyingId(null); }
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
    } finally { setBuyingStarsId(null); }
  };

  const getOwnedCount = (iconId: string) => {
    return myIcons.filter(ui => (typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id) === iconId).length;
  };

  // Boost handlers
  const handleBoostPurchase = async (boostId: string) => {
    setBuyingId(boostId + '-coins');
    try {
      const response = await fetch('/api/buyboost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId }),
      });
      if (response.ok) {
        const boostPrice = boostCards.find((b) => b.id === boostId)?.price || 0;
        setUserData((p) => p ? { ...p, coins: p.coins - boostPrice, boosts: { ...p.boosts, [boostId]: (p.boosts[boostId] || 0) + 1 } } : p);
        showNotification(t.boosts_buy_success, 'success');
      } else {
        const data = await response.json();
        showNotification(data.message || t.boosts_no_coins, 'error');
      }
    } catch (err) {
      showNotification(t.boosts_no_coins, 'error');
    } finally { setBuyingId(null); }
  };

  const handleBoostPurchaseStars = async (boostId: string) => {
    setBuyingId(boostId + '-stars');
    try {
      const response = await fetch('/api/buyboost-stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, '_blank');
          showNotification(t.boosts_stars_success, 'success');
        } else showNotification(t.boosts_initiated, 'success');
      } else {
        const data = await response.json();
        showNotification(data.message || t.boosts_stars_fail, 'error');
      }
    } catch (err) {
      showNotification(t.boosts_stars_error, 'error');
    } finally { setBuyingId(null); }
  };

  const handleEquip = async (boostId: string, type: string) => {
    try {
      const response = await fetch('/api/equip-boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId, type }),
      });
      if (response.ok) {
        if (type === 'boots') {
          setEquippedBoots(boostId);
          showNotification(t.boosts_equipped || 'Equipped!', 'success');
        } else if (type === 'tool') {
          setEquippedPickaxe(boostId);
          showNotification(t.boosts_equipped || 'Equipped!', 'success');
        }
      }
    } catch (err) {
      showNotification('Error equipping', 'error');
    }
  };

  const handleMineralPurchase = async (symbol: string, price: number) => {
    setBuyingId('mineral-' + symbol + '-coins');
    try {
      const response = await fetch('/api/buyboost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId: 'mineral-' + symbol.toLowerCase() }),
      });
      if (response.ok) {
        setUserData((p) => p ? { ...p, coins: p.coins - price } : p);
        showNotification(`${symbol} ${t.boosts_mineral_success}`, 'success');
      } else showNotification(t.boosts_no_coins, 'error');
    } catch (err) {
      showNotification(t.boosts_not_enough, 'error');
    } finally { setBuyingId(null); }
  };

  const handleMineralPurchaseStars = async (symbol: string) => {
    setBuyingId('mineral-' + symbol + '-stars');
    try {
      const response = await fetch('/api/buyboost-stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId: 'mineral-' + symbol.toLowerCase() }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.invoiceUrl) window.open(data.invoiceUrl, '_blank');
        showNotification(t.boosts_stars_success, 'success');
      } else showNotification(t.boosts_stars_fail, 'error');
    } catch (err) {
      showNotification(t.boosts_stars_error, 'error');
    } finally { setBuyingId(null); }
  };

  // Render boosts section (reusable)
  const renderBoostsSection = () => (
    <>
      <h2 className={styles.sectionTitle}>{t.boosts_section}</h2>
      {isBoostsLoading ? (
        <div className={styles.loading}><div className={styles.spinner} /></div>
      ) : boostCards.length === 0 ? (
        <p className={styles.emptyText}>{t.boosts_no_cards}</p>
      ) : (
        <div className={styles.boostGrid}>
          {boostCards.map((card) => (
            <div key={card.id} className={styles.boostCard}>
              <img
                src={`/boosts/${card.image || card.id + '.png'}`}
                alt={getBoostName(lang, card.title)}
                className={styles.boostImage}
                onError={(e) => { (e.target as HTMLImageElement).src = '/boosts/boost.png'; }}
              />
              <h3 className={styles.boostName}>{getBoostName(lang, card.title)}</h3>
              <p className={styles.boostPrice}>{card.price} GTL</p>
              <p className={styles.boostStars}>{(card as any).starsPrice} Stars</p>
              <p className={styles.boostOwned}>{t.boosts_owned}: {userData?.boosts?.[card.id] || 0}</p>
              <div className={styles.boostButtons}>
                <button className={styles.buyBtn} onClick={() => handleBoostPurchase(card.id)}>
                  {buyingId === card.id + '-coins' ? '...' : t.boosts_buy}
                </button>
                <button className={styles.buyStarsBtn} onClick={() => handleBoostPurchaseStars(card.id)}>
                  {buyingId === card.id + '-stars' ? '...' : t.boosts_stars}
                </button>
                {((card as any).type === 'boots' || (card as any).type === 'tool') && (userData?.boosts?.[card.id] || 0) > 0 && (
                  <button className={styles.equipBtn} onClick={() => handleEquip(card.id, (card as any).type)}>
                    {equippedBoots === card.id || equippedPickaxe === card.id
                      ? (lang === 'ru' ? '\u0421\u043d\u044f\u0442\u044c' : 'Unequip')
                      : (lang === 'ru' ? '\u041e\u0434\u0435\u0442\u044c' : 'Equip')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className={styles.sectionTitle}>{t.boosts_minerals}</h2>
      <div className={styles.boostGrid}>
        {minerals.map((m, i) => (
          <div key={i} className={styles.boostCard}>
            <img src={m.imageUrl} alt={m.name} className={styles.boostImage} onError={(e) => { (e.target as HTMLImageElement).src = '/boosts/boost.png'; }} />
            <h3 className={styles.boostName}>{getMineralName(lang, m.name)} ({m.symbol})</h3>
            <p className={styles.boostPrice}>{m.price} GTL</p>
            <p className={styles.boostStars}>{m.starsPrice} Stars</p>
            <div className={styles.boostButtons}>
              <button className={styles.buyBtn} onClick={() => handleMineralPurchase(m.symbol, m.price)}>
                {buyingId === 'mineral-' + m.symbol + '-coins' ? '...' : t.boosts_buy}
              </button>
              <button className={styles.buyStarsBtn} onClick={() => handleMineralPurchaseStars(m.symbol)}>
                {buyingId === 'mineral-' + m.symbol + '-stars' ? '...' : t.boosts_stars}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (!activeContinent) {
    return (
      <Layout>
        <h1 className={styles.title}>{t.shop_title}</h1>
        <p className={styles.coins}>💰 {userData?.coins?.toLocaleString() || 0} {t.shop_coins}</p>
        <WorldMap onSelectContinent={(c: ContinentKey) => setActiveContinent(c)} activeContinent={null} />
        <p className={styles.hint}>{t.shop_map_hint}</p>
        {myIcons.length > 0 && (
          <div className={styles.ownedSection}>
            <h3>{t.shop_owned}: {myIcons.length}</h3>
          </div>
        )}

        {/* Boosts section below map */}
        {renderBoostsSection()}
      </Layout>
    );
  }

  return (
    <Layout>
      <button className={styles.backBtn} onClick={() => { setActiveContinent(null); setIcons([]); }}>{t.shop_back}</button>
      <h1 className={styles.title}>
        {lang === 'ru' ? CONTINENT_LABELS[activeContinent] : (t as any)[`continent_${activeContinent}`]}
      </h1>
      <p className={styles.coins}>💰 {userData?.coins?.toLocaleString() || 0} {t.shop_coins}</p>

      <div className={styles.filters}>
        {RESOURCE_FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${activeResource === f.key ? styles.filterActive : ''}`}
            onClick={() => setActiveResource(f.key)}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loading}><div className={styles.spinner} /></div>
      ) : icons.length === 0 ? (
        <p className={styles.emptyText}>{t.shop_empty}</p>
      ) : (
        <div className={styles.iconGrid}>
          {icons.map(icon => {
            const owned = getOwnedCount(icon._id);
            return (
              <div key={icon._id} className={styles.iconCard}>
                <img
                  src={icon.imageUrl || RESOURCE_ICON_URLS[icon.resourceType] || ''}
                  alt={getIconName(icon)}
                  className={styles.iconImage}
                />
                <h3 className={styles.iconName}>{getIconName(icon)}</h3>
                <p className={styles.iconCountry}>{getCountryName(lang, icon.country)}</p>
                <p className={styles.iconResource}>{icon.resourceEmoji} {getResourceTypeName(lang, icon.resourceType)}</p>
                <p className={styles.iconShare}>{t.shop_share}</p>
                <p className={styles.iconRate}>+{icon.stakingRate}{t.shop_per_hour}</p>
                {owned > 0 && <p className={styles.iconOwned}>{t.shop_owned_label}: {owned}</p>}
                <button
                  className={styles.buyBtn}
                  onClick={() => handleBuy(icon._id)}
                  disabled={buyingId === icon._id || (userData?.coins || 0) < icon.price}
                >
                  {buyingId === icon._id ? '...' : `${icon.price.toLocaleString()} ${t.shop_coins}`}
                </button>
                {icon.starsPrice && (
                  <button
                    className={styles.buyStarsBtn}
                    onClick={() => handleBuyWithStars(icon)}
                    disabled={buyingStarsId === icon._id}
                  >
                    {buyingStarsId === icon._id ? '...' : `\u2b50 ${icon.starsPrice} Stars`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Shop;
