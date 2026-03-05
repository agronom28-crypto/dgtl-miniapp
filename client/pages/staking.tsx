import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { stakingService } from '../services/stakingService';
import { shopService } from '../services/shopService';
import { IUserIcon, IStakedIcon, IIcon } from '../models/Icon';
import { getTranslations, getCountryName, Lang } from '../lib/i18n';
import Head from 'next/head';
import axios from 'axios';
import { LEVELS } from '../game/constants/levels';

const TOTAL_LEVELS = LEVELS.length; // 13 levels

const StakingPage = () => {
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);
  const getIconName = (icon: IIcon | null) => {
    if (!icon) return 'Item';
    return lang === 'en' ? (icon.nameEn || icon.name) : icon.name;
  };

  const [userIcons, setUserIcons] = useState<IUserIcon[]>([]);
  const [stakedIcons, setStakedIcons] = useState<IStakedIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [allLevelsCompleted, setAllLevelsCompleted] = useState(false);
  const [levelCheckDone, setLevelCheckDone] = useState(false);
  const telegramId = (session?.user as any)?.telegramId;

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);
  useEffect(() => {
    const handleLangChange = (e: any) => setLang(e.detail as Lang);
    window.addEventListener('langChange', handleLangChange);
    return () => window.removeEventListener('langChange', handleLangChange);
  }, []);

  // Fix: handle case when session is loaded but no telegramId
  useEffect(() => {
    if (status !== 'loading' && !telegramId) {
      setLoading(false);
      setLevelCheckDone(true);
    }
  }, [status, telegramId]);

  useEffect(() => {
    if (!telegramId) return;
    axios.get(`/api/users/${telegramId}`).then(res => {
      if (res.data.success) {
        setUserId(res.data.user._id);
        // Check level completion
        const completedLevels = res.data.user.completedLevels || [];
        setAllLevelsCompleted(completedLevels.length >= TOTAL_LEVELS);
        setLevelCheckDone(true);
      }
    }).catch(err => {
      console.error('Failed to load user:', err);
      setLoading(false);
      setLevelCheckDone(true);
    });
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

  useEffect(() => { if (userId) loadData(); }, [userId, loadData]);

  const handleStake = async (iconId: string) => {
    if (!userId) return;
    setStaking(iconId);
    try {
      await stakingService.stake(userId, iconId);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || t.staking_error);
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
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (!userId) return;
    try {
      const result = await stakingService.claimRewards(userId);
      alert(`${t.staking_claim_prefix} ${result.earnings} ${t.staking_claim_success}`);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || t.staking_error);
    }
  };

  const getStakingDuration = (stakedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(stakedAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return lang === 'ru' ? `${hours}ч ${minutes}м` : `${hours}h ${minutes}m`;
  };

  const activeStakes = stakedIcons.filter(si => si.isActive);
  const stakedIconIds = activeStakes.map(si =>
    typeof si.iconId === 'string' ? si.iconId : (si.iconId as IIcon)._id
  );
  const availableForStaking = userIcons.filter(ui => {
    const iconId = typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id;
    return !stakedIconIds.includes(iconId);
  });

  // Loading state
  if (loading || !levelCheckDone) {
    return (
      <Layout>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '40px' }}>
          {t.staking_loading}
        </div>
      </Layout>
    );
  }

  // Lock screen: staking is blocked until all levels are completed
  if (!allLevelsCompleted) {
    return (
      <Layout>
        <div style={{
          color: 'white',
          textAlign: 'center',
          marginTop: '80px',
          padding: '0 20px'
        }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ marginBottom: '12px' }}>
                        {lang === 'ru' ? 'Стейкинг заблокирован' : 'Staking Locked'}
          </h2>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
            {lang === 'ru'
                            ? `Пройдите все ${TOTAL_LEVELS} уровней игры, чтобы разблокировать стейкинг.`
              : `Complete all ${TOTAL_LEVELS} game levels to unlock staking.`
            }
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head><title>{t.staking_page_title}</title></Head>
      <Layout>
        <div style={{ padding: '16px', color: 'white' }}>
          <h1>{t.staking_title}</h1>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>{t.staking_subtitle}</p>

          {activeStakes.length > 0 && (
            <div>
              <h2>{t.staking_active}</h2>
              <button onClick={handleClaim} style={{ background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', marginBottom: '12px' }}>
                {t.staking_claim}
              </button>
              {activeStakes.map((si) => {
                const icon = typeof si.iconId === 'string' ? null : si.iconId as IIcon;
                return (
                  <div key={si._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{getIconName(icon)}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>{t.staking_staked_label}: {getStakingDuration(si.stakedAt)}</div>
                      <div style={{ color: '#4caf50', fontSize: '12px' }}>+{icon?.stakingRate || 10}{t.shop_per_hour}</div>
                    </div>
                    <button onClick={() => handleUnstake(si._id)} style={{ background: '#e53935', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>
                      {t.staking_unstake}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <h2>{t.staking_available}</h2>
          {availableForStaking.length === 0 ? (
            <div style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
              {userIcons.length === 0 ? t.staking_empty_all : t.staking_empty_all_staked}
            </div>
          ) : (
            <div>
              {availableForStaking.map((ui) => {
                const icon = typeof ui.iconId === 'string' ? null : ui.iconId as IIcon;
                if (!icon) return null;
                return (
                  <div key={ui._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{getIconName(icon)}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>{getCountryName(lang, icon.country)}</div>
                      <div style={{ color: '#4caf50', fontSize: '12px' }}>+{icon.stakingRate}{t.shop_per_hour}</div>
                    </div>
                    <button onClick={() => handleStake(icon._id)} disabled={staking === icon._id} style={{ background: staking === icon._id ? '#555' : '#1976d2', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 16px', cursor: staking === icon._id ? 'default' : 'pointer' }}>
                      {staking === icon._id ? '...' : t.staking_stake_btn}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default StakingPage;
