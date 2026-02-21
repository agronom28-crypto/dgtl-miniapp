import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { stakingService } from '../services/stakingService';
import { shopService } from '../services/shopService';
import { IUserIcon, IStakedIcon, IIcon } from '../models/Icon';
import Head from 'next/head';
import axios from 'axios';

const StakingPage = () => {
  const { data: session } = useSession();
  const [userIcons, setUserIcons] = useState<IUserIcon[]>([]);
  const [stakedIcons, setStakedIcons] = useState<IStakedIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const telegramId = (session?.user as any)?.telegramId;

  // Load MongoDB _id for current user
  useEffect(() => {
    if (!telegramId) return;
    axios.get(`/api/users/${telegramId}`).then(res => {
      if (res.data.success) setUserId(res.data.user._id);
    }).catch(err => console.error('Failed to load user:', err));
  }, [telegramId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      const [userIconsData, stakingData] = await Promise.all([
        shopService.getUserIcons(userId),
        stakingService.getUserStaking(userId)
      ]);
      setUserIcons(Array.isArray(userIconsData) ? userIconsData : userIconsData?.userIcons || []);
      setStakedIcons(stakingData.stakedIcons || []);
    } catch (err) {
      console.error('Failed to load staking data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadData();
  }, [userId, loadData]);

  const handleStake = async (iconId: string) => {
    if (!userId) return;
    setStaking(iconId);
    try {
      await stakingService.stake(userId, iconId);
      await loadData();
    } catch (err: any) {
      console.error('Staking failed:', err);
      alert(err.response?.data?.error || 'Ошибка стейкинга');
    } finally {
      setStaking(null);
    }
  };

  const handleUnstake = async (stakedIconId: string) => {
    if (!userId) return;
    try {
      await stakingService.unstake(userId, stakedIconId);
      await loadData();
    } catch (err) {
      console.error('Unstake failed:', err);
    }
  };

  const handleClaim = async () => {
    if (!userId) return;
    try {
      const result = await stakingService.claimRewards(userId);
      alert(`Собрано ${result.earnings} монет!`);
      await loadData();
    } catch (err: any) {
      console.error('Claim failed:', err);
      alert(err.response?.data?.error || 'Ошибка сбора наград');
    }
  };

  const getStakingDuration = (stakedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(stakedAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const stakedIconIds = stakedIcons
    .filter(si => si.isActive)
    .map(si => typeof si.iconId === 'string' ? si.iconId : (si.iconId as IIcon)._id);

  const availableForStaking = userIcons.filter(ui => {
    const iconId = typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id;
    return !stakedIconIds.includes(iconId);
  });

  const activeStakes = stakedIcons.filter(si => si.isActive);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>Стейкинг — DGTL</title></Head>
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <h1>Стейкинг</h1>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>Застейкайте доли месторождений и получайте пассивный доход</p>

        {activeStakes.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0 }}>Активные стейки</h2>
              <button onClick={handleClaim} style={{
                background: '#4CAF50', color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
              }}>
                Собрать всё
              </button>
            </div>
            {activeStakes.map((si) => {
              const icon = typeof si.iconId === 'string' ? null : si.iconId as IIcon;
              return (
                <div key={si._id} style={{
                  background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px',
                  padding: '12px', marginBottom: '8px', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{icon?.name || 'Иконка'}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>Застейкано: {getStakingDuration(si.stakedAt)}</div>
                    <div style={{ color: '#4CAF50', fontSize: '12px' }}>+{icon?.stakingRate || 10}/час</div>
                  </div>
                  <button onClick={() => handleUnstake(si._id)} style={{
                    background: '#e53935', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '6px 12px', cursor: 'pointer'
                  }}>
                    Снять
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <h2>Доступные доли</h2>
        {availableForStaking.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '24px' }}>
            {userIcons.length === 0
              ? 'Нет долей. Купите доли месторождений в магазине.'
              : 'Все доли уже застейканы.'}
          </div>
        ) : (
          <div>
            {availableForStaking.map((ui) => {
              const icon = typeof ui.iconId === 'string' ? null : ui.iconId as IIcon;
              if (!icon) return null;
              const iconId = icon._id;
              return (
                <div key={ui._id} style={{
                  background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px',
                  padding: '12px', marginBottom: '8px', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{icon.name}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{icon.country}</div>
                    <div style={{ color: '#4CAF50', fontSize: '12px' }}>+{icon.stakingRate}/час</div>
                  </div>
                  <button
                    onClick={() => handleStake(iconId)}
                    disabled={staking === iconId}
                    style={{
                      background: staking === iconId ? '#555' : '#1976d2',
                      color: 'white', border: 'none', borderRadius: '8px',
                      padding: '6px 16px', cursor: staking === iconId ? 'default' : 'pointer'
                    }}
                  >
                    {staking === iconId ? '...' : 'Стейк'}
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

export default StakingPage;
