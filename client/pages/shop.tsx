import Layout from '../components/layout';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IUserState } from '../models/User';
import { IIcon, IUserIcon } from '../models/Icon';
import { shopService } from '../services/shopService';
import { showNotification } from '../lib/notifications';
import styles from '../styles/Shop.module.css';
import axios from 'axios';

const CATEGORIES = [
    { key: 'all', label: 'Все' },
    { key: 'oil_rig', label: 'Вышки' },
    { key: 'mine', label: 'Шахты' },
    { key: 'quarry', label: 'Карьеры' },
    { key: 'factory', label: 'Заводы' },
];

const Shop: React.FC = () => {
    const { data: session } = useSession();
    const [icons, setIcons] = useState<IIcon[]>([]);
    const [myIcons, setMyIcons] = useState<IUserIcon[]>([]);
    const [userData, setUserData] = useState<IUserState | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [buyingId, setBuyingId] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user) {
            loadData();
        }
    }, [session]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const telegramId = (session?.user as any)?.telegramId;
            if (!telegramId) return;

            // Загружаем данные пользователя
            const userRes = await axios.get(`/api/users/${telegramId}`);
            if (userRes.data.success) {
                setUserData(userRes.data.user);
                const userId = userRes.data.user._id;

                // Загружаем иконки магазина и купленные
                const [shopRes, myRes] = await Promise.all([
                    shopService.getIcons(),
                    shopService.getMyIcons(userId)
                ]);

                if (shopRes.success) setIcons(shopRes.icons);
                if (myRes.success) setMyIcons(myRes.userIcons);
            }
        } catch (error) {
            console.error('Error loading shop data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (iconId: string) => {
        if (!userData?._id) return;
        try {
            setBuyingId(iconId);
            const result = await shopService.buyIcon(userData._id, iconId);
            if (result.success) {
                showNotification('Иконка куплена!');
                await loadData(); // Перезагружаем данные
            }
        } catch (error: any) {
            const msg = error?.response?.data?.error || 'Ошибка покупки';
            showNotification(msg);
        } finally {
            setBuyingId(null);
        }
    };

    const isOwned = (iconId: string) => {
        return myIcons.some(ui => 
            (typeof ui.iconId === 'string' ? ui.iconId : ui.iconId._id) === iconId
        );
    };

    const filteredIcons = activeCategory === 'all'
        ? icons
        : icons.filter(i => i.category === activeCategory);

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.container}>
                    <div className={styles.loading}>Загрузка магазина...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.title}>Магазин</h1>
                <div className={styles.coins}>
                    💰 {userData?.coins?.toLocaleString() || 0} монет
                </div>

                <div className={styles.tabs}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            className={`${styles.tab} ${activeCategory === cat.key ? styles.tabActive : ''}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredIcons.map(icon => (
                        <div key={icon._id} className={styles.card}>
                            <img
                                src={icon.imageUrl}
                                alt={icon.name}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardName}>{icon.name}</div>
                            <div className={`${styles.cardRarity} ${styles[`rarity${icon.rarity.charAt(0).toUpperCase() + icon.rarity.slice(1)}`]}`}>
                                {icon.rarity}
                            </div>
                            <div className={styles.cardRate}>
                                +{icon.stakingRate}/час
                            </div>
                            {isOwned(icon._id) ? (
                                <div className={styles.owned}>✓ Куплено</div>
                            ) : (
                                <button
                                    className={styles.buyButton}
                                    onClick={() => handleBuy(icon._id)}
                                    disabled={buyingId === icon._id || (userData?.coins || 0) < icon.price}
                                >
                                    {buyingId === icon._id ? '...' : `${icon.price} монет`}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;
