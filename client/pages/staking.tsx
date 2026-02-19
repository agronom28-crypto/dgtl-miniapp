import Layout from '../components/layout';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IUserState } from '../models/User';
import { IUserIcon, IStakedIcon } from '../models/Icon';
import { shopService } from '../services/shopService';
import { stakingService } from '../services/stakingService';
import { showNotification } from '../lib/notifications';
import styles from '../styles/Staking.module.css';
import axios from 'axios';

const Staking: React.FC = () => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<IUserState | null>(null);
    const [myIcons, setMyIcons] = useState<IUserIcon[]>([]);
    const [activeStakes, setActiveStakes] = useState<IStakedIcon[]>([]);
    const [pendingEarnings, setPendingEarnings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        if (session?.user) {
            loadData();
        }
    }, [session]);

    // Обновляем доход каждые 30 секунд
    useEffect(() => {
        if (!userData?._id) return;
        const interval = setInterval(async () => {
            try {
                const res = await stakingService.getEarnings(userData._id);
                if (res.success) setPendingEarnings(res.pendingEarnings);
            } catch (e) {}
        }, 30000);
        return () => clearInterval(interval);
    }, [userData]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const telegramId = (session?.user as any)?.telegramId;
            if (!telegramId) return;

            const userRes = await axios.get(`/api/users/${telegramId}`);
            if (userRes.data.success) {
                setUserData(userRes.data.user);
                const userId = userRes.data.user._id;

                const [myRes, stakesRes, earningsRes] = await Promise.all([
                    shopService.getMyIcons(userId),
                    stakingService.getActiveStakes(userId),
                    stakingService.getEarnings(userId)
                ]);

                if (myRes.success) setMyIcons(myRes.userIcons);
                if (stakesRes.success) setActiveStakes(stakesRes.stakes);
                if (earningsRes.success) setPendingEarnings(earningsRes.pendingEarnings);
            }
        } catch (error) {
            console.error('Error loading staking data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async () => {
        if (!userData?._id || pendingEarnings === 0) return;
        try {
            setIsClaiming(true);
            const result = await stakingService.claimEarnings(userData._id);
            if (result.success) {
                showNotification(`+${result.earnings} монет собрано!`);
                setPendingEarnings(0);
                await loadData();
            }
        } catch (error) {
            showNotification('Ошибка сбора дохода');
        } finally {
            setIsClaiming(false);
        }
    };

    const handleStake = async (iconId: string) => {
        if (!userData?._id) return;
        try {
            const result = await stakingService.stakeIcon(userData._id, iconId);
            if (result.success) {
                showNotification('Иконка в стейкинге!');
                await loadData();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.error || 'Ошибка стейкинга';
            showNotification(msg);
        }
    };

    const handleUnstake = async (iconId: string) => {
        if (!userData?._id) return;
        try {
            const result = await stakingService.unstakeIcon(userData._id, iconId);
            if (result.success) {
                showNotification('Иконка снята из стейкинга');
                await loadData();
            }
        } catch (error: any) {
            const msg = error?.response?.data?.error || 'Ошибка';
            showNotification(msg);
        }
    };

    const isStaked = (iconId: string) => {
        return activeStakes.some(s => {
            const id = typeof s.iconId === 'string' ? s.iconId : s.iconId._id;
            return id === iconId;
        });
    };

    // Иконки, которые куплены, но НЕ в стейкинге
    const unstaked = myIcons.filter(ui => {
        const iconId = typeof ui.iconId === 'string' ? ui.iconId : ui.iconId._id;
        return !isStaked(iconId);
    });

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.container}>
                    <div className={styles.loading}>Загрузка...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.title}>Стейкинг</h1>

                {/* Блок дохода */}
                <div className={styles.earningsCard}>
                    <div className={styles.earningsLabel}>Накопленный доход</div>
                    <div className={styles.earningsValue}>
                        +{pendingEarnings.toLocaleString()}
                    </div>
                    <button
                        className={styles.claimButton}
                        onClick={handleClaim}
                        disabled={isClaiming || pendingEarnings === 0}
                    >
                        {isClaiming ? 'Сбор...' : 'Собрать'}
                    </button>
                </div>

                {/* Активные стейки */}
                <div className={styles.sectionTitle}>
                    В стейкинге ({activeStakes.length})
                </div>
                <div className={styles.stakeList}>
                    {activeStakes.length === 0 ? (
                        <div className={styles.emptyText}>
                            Нет иконок в стейкинге. Купите иконку в магазине и поставьте её сюда.
                        </div>
                    ) : (
                        activeStakes.map(stake => {
                            const icon = stake.iconId;
                            return (
                                <div key={stake._id} className={styles.stakeItem}>
                                    <img src={icon.imageUrl} alt={icon.name} className={styles.stakeImage} />
                                    <div className={styles.stakeInfo}>
                                        <div className={styles.stakeName}>{icon.name}</div>
                                        <div className={styles.stakeRate}>+{icon.stakingRate}/час</div>
                                    </div>
                                    <button
                                        className={styles.unstakeButton}
                                        onClick={() => handleUnstake(icon._id)}
                                    >
                                        Снять
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Доступные для стейкинга */}
                {unstaked.length > 0 && (
                    <>
                        <div className={styles.sectionTitle}>
                            Доступно ({unstaked.length})
                        </div>
                        <div className={styles.stakeList}>
                            {unstaked.map(ui => {
                                const icon = typeof ui.iconId === 'string' ? null : ui.iconId;
                                if (!icon) return null;
                                return (
                                    <div key={ui._id} className={styles.stakeItem}>
                                        <img src={icon.imageUrl} alt={icon.name} className={styles.stakeImage} />
                                        <div className={styles.stakeInfo}>
                                            <div className={styles.stakeName}>{icon.name}</div>
                                            <div className={styles.stakeRate}>+{icon.stakingRate}/час</div>
                                        </div>
                                        <button
                                            className={styles.stakeButton}
                                            onClick={() => handleStake(icon._id)}
                                        >
                                            Стейкать
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Staking;
