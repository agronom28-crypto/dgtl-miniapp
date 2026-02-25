import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { stakingService } from '../services/stakingService';
import { shopService } from '../services/shopService';
import { IUserIcon, IStakedIcon, IIcon } from '../models/Icon';
import { getTranslations, getCountryName, Lang } from '../lib/i18n';
import Head from 'next/head';
import axios from 'axios';

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
    }
  }, [status, telegramId]);

  useEffect(() => {
    if (!telegramId) return;
    axios.get(`/api/users/${telegramId}`).then(res => {
      if (res.data.success) setUserId(res.data.user._id);
    }).catch(err => {
      console.error('Failed to load user:', err);
      setLoading(false);
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
    return lang === 'ru' ? `${hours}\u0447 ${minutes}\u043c` : `${hours}h ${minutes}m`;
  };

  const activeStakes = stakedIcons.filter(si => si.isActive);
  const stakedIconIds = activeStakes.map(si =>
    typeof si.iconId === 'string' ? si.iconId : (si.iconId as IIcon)._id
  );
  const availableForStaking = userIcons.filter(ui => {
    const iconId = typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id;
    return !stakedIconIds.includes(iconId);
  });

  // loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="ml-2">{t.staking_loading}</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{t.staking_page_title}</title>
      </Head>
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{t.staking_title}</h1>
          <p className="text-sm opacity-70 mb-4">{t.staking_subtitle}</p>

          {activeStakes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{t.staking_active}</h2>
                <button
                  onClick={handleClaim}
                  className="btn btn-sm btn-accent"
                >
                  {t.staking_claim}
                </button>
              </div>
              {activeStakes.map((si) => {
                const icon = typeof si.iconId === 'string' ? null : si.iconId as IIcon;
                return (
                  <div key={si._id} className="card bg-base-200 shadow mb-2">
                    <div className="card-body p-3 flex-row items-center justify-between">
                      <div>
                        <p className="font-bold">{getIconName(icon)}</p>
                        <p className="text-xs opacity-60">
                          {t.staking_staked_label}: {getStakingDuration(si.stakedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-400">
                          +{icon?.stakingRate || 10}{t.shop_per_hour}
                        </span>
                        <button
                          onClick={() => handleUnstake(si._id)}
                          style={{
                            background: '#e53935', color: 'white', border: 'none',
                            borderRadius: '8px', padding: '6px 12px', cursor: 'pointer'
                          }}
                        >
                          {t.staking_unstake}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="text-lg font-bold mb-2">{t.staking_available}</h2>
          {availableForStaking.length === 0 ? (
            <p className="opacity-50">
              {userIcons.length === 0 ? t.staking_empty_all : t.staking_empty_all_staked}
            </p>
          ) : (
            <div className="space-y-2">
              {availableForStaking.map((ui) => {
                const icon = typeof ui.iconId === 'string' ? null : ui.iconId as IIcon;
                if (!icon) return null;
                return (
                  <div key={icon._id} className="card bg-base-200 shadow">
                    <div className="card-body p-3 flex-row items-center justify-between">
                      <div>
                        <p className="font-bold">{getIconName(icon)}</p>
                        <p className="text-xs opacity-60">{getCountryName(lang, icon.country)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-400">
                          +{icon.stakingRate}{t.shop_per_hour}
                        </span>
                        <button
                          onClick={() => handleStake(icon._id)}
                          disabled={staking === icon._id}
                          style={{
                            background: staking === icon._id ? '#555' : '#1976d2',
                            color: 'white', border: 'none',
                            borderRadius: '8px', padding: '6px 16px',
                            cursor: staking === icon._id ? 'default' : 'pointer'
                          }}
                        >
                          {staking === icon._id ? '...' : t.staking_stake_btn}
                        </button>
                      </div>
                    </div>
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
