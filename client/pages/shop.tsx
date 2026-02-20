import Layout from '../components/layout';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IUserState } from '../models/User';
import { IIcon, IUserIcon, ContinentKey, CONTINENT_LABELS, RESOURCE_LABELS, ResourceType } from '../models/Icon';
import { shopService } from '../services/shopService';
import { showNotification } from '../lib/notifications';
import styles from '../styles/Shop.module.css';
import WorldMap from '../components/WorldMap';
import axios from 'axios';

const RESOURCE_FILTERS: { key: string; label: string; emoji: string }[] = [
  { key: 'all', label: 'Все', emoji: '' },
  { key: 'gold', label: 'Золото', emoji: '🟡' },
  { key: 'copper', label: 'Медь', emoji: '🔴' },
  { key: 'iron', label: 'Железо', emoji: '🔘' },
  { key: 'rare_metals', label: 'Редкие', emoji: '⚛' },
  { key: 'oil_gas', label: 'Нефть', emoji: '🛢' },
  { key: 'diamonds', label: 'Алмазы', emoji: '💎' },
  { key: 'coal', label: 'Уголь', emoji: '⚫' },
];

const Shop: React.FC = () => {
  const { data: session } = useSession();
  const [icons, setIcons] = useState<IIcon[]>([]);
  const [myIcons, setMyIcons] = useState<IUserIcon[]>([]);
  const [userData, setUserData] = useState<IUserState | null>(null);
  const [activeContinent, setActiveContinent] = useState<ContinentKey | null>(null);
  const [activeResource, setActiveResource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadUserData();
    }
  }, [session]);

  useEffect(() => {
    if (activeContinent) {
      loadIcons();
    }
  }, [activeContinent, activeResource]);

  const loadUserData = async () => {
    try {
      const telegramId = (session?.user as any)?.telegramId;
      if (!telegramId) return;
      const userRes = await axios.get(`/api/users/${telegramId}`);
      if (userRes.data.success) {
        setUserData(userRes.data.user);
        const userId = userRes.data.user._id;
        const myRes = await shopService.getMyIcons(userId);
        if (myRes.success) setMyIcons(myRes.userIcons);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadIcons = async () => {
    try {
      setIsLoading(true);
      const continent = activeContinent || undefined;
      const resourceType = activeResource !== 'all' ? activeResource : undefined;
      const res = await shopService.getIcons(continent, resourceType);
      if (res.success) setIcons(res.icons);
    } catch (error) {
      console.error('Error loading icons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async (iconId: string) => {
    if (!userData?._id) {
      showNotification('Авторизуйтесь для покупки');
      return;
    }
    try {
      setBuyingId(iconId);
      const result = await shopService.buyIcon(userData._id, iconId);
      if (result.success) {
        showNotification('Доля месторождения куплена!');
        await loadUserData();
        await loadIcons();
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Ошибка покупки';
      showNotification(msg);
    } finally {
      setBuyingId(null);
    }
  };

  const getOwnedCount = (iconId: string) => {
    return myIcons.filter(ui =>
      (typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id) === iconId
    ).length;
  };

  const handleContinentSelect = (continent: ContinentKey) => {
    setActiveContinent(continent);
    setActiveResource('all');
  };

  const handleBack = () => {
    setActiveContinent(null);
    setIcons([]);
  };

  // Карта мира — главный экран
  if (!activeContinent) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>Месторождения</h1>
          <div className={styles.coins}>
            💰 {userData?.coins?.toLocaleString() || 0} монет
          </div>
          <WorldMap onSelect={handleContinentSelect} activeContinent={null} />
          <div className={styles.mapHint}>
            Нажмите на регион, чтобы увидеть месторождения
          </div>
          {myIcons.length > 0 && (
            <div className={styles.ownedSection}>
              <h3>Ваши доли: {myIcons.length}</h3>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Список месторождений по региону
  return (
    <Layout>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Карта
        </button>
        <h1 className={styles.title}>
          {CONTINENT_LABELS[activeContinent]}
        </h1>
        <div className={styles.coins}>
          💰 {userData?.coins?.toLocaleString() || 0} монет
        </div>
        <div className={styles.tabs}>
          {RESOURCE_FILTERS.map(f => (
            <button
              key={f.key}
              className={`${styles.tab} ${activeResource === f.key ? styles.tabActive : ''}`}
              onClick={() => setActiveResource(f.key)}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : icons.length === 0 ? (
          <div className={styles.loading}>Нет месторождений в этом регионе</div>
        ) : (
          <div className={styles.grid}>
            {icons.map(icon => {
              const owned = getOwnedCount(icon._id);
              const resInfo = RESOURCE_LABELS[icon.resourceType as ResourceType];
              return (
                <div key={icon._id} className={styles.card}>
                  <div className={styles.cardEmoji}>
                    {icon.imageUrl ? <img src={icon.imageUrl} alt={icon.name} className={styles.cardImage} /> : (resInfo?.emoji || '⛏')}
                  </div>
                                      {icon.realPhotoUrl && (
                      <img src={icon.realPhotoUrl} alt={icon.name} className={styles.cardRealPhoto} />
                    )}
                  <div className={styles.cardName}>{icon.name}</div>
                  <div className={styles.cardCountry}>
                    {icon.country}
                  </div>
                  <div className={styles.cardResource}>
                    {resInfo?.label || icon.resourceType}
                  </div>
                  {icon.valuationUsd && (
                    <div className={styles.cardValuation}>
                      💵 {icon.valuationUsd}
                    </div>
                  )}
                  <div className={styles.cardRate}>
                    +{icon.stakingRate}/час
                  </div>
                  {icon.description && (
                    <div className={styles.cardDescription}>
                      {icon.description}
                    </div>
                  )}
                  {owned > 0 && (
                    <div className={styles.owned}>
                      ✓ Куплено: {owned}
                    </div>
                  )}
                  <button
                    className={styles.buyButton}
                    onClick={() => handleBuy(icon._id)}
                    disabled={buyingId === icon._id || (userData?.coins || 0) < icon.price}
                  >
                    {buyingId === icon._id ? '...' : `${icon.price.toLocaleString()} монет`}
                  </button>
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
