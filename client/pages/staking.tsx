import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { stakingService } from '../services/stakingService';
import { shopService } from '../services/shopService';
import { IUserIcon, IStakedIcon, IIcon } from '../models/Icon';
import { getTranslations, Lang } from '../lib/i18n';
import Head from 'next/head';
import axios from 'axios';

const StakingPage = () => {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

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
    } catch (err) { console.error(err); }
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
  const stakedIconIds = activeStakes.map(si => typeof si.iconId === 'string' ? si.iconId : (si.iconId as IIcon)._id);
  const availableForStaking = userIcons.filter(ui => {
    const iconId = typeof ui.iconId === 'string' ? ui.iconId : (ui.iconId as IIcon)._id;
    return !stakedIconIds.includes(iconId);
  });
 // loading state
      if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {t.staking_loading}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>{t.staking_page_title}</title></Head>
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <h1>{t.staking_title}</h1>
        <p style={{ color: '#aaa', marginBottom: '16px' }}>{t.staking_subtitle}</p>
        
        {activeStakes.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0 }}>{t.staking_active}</h2>
              <button onClick={handleClaim} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>
                {t.staking_claim}
              </button>
            </div>
            {activeStakes.map((si) => {
              const icon = typeof si.iconId === 'string' ? null : si.iconId as IIcon;
              return (
                <div key={si._id} style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{icon?.name || 'Item'}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{t.staking_staked_label}: {getStakingDuration(si.stakedAt)}</div>
                    <div style={{ color: '#4CAF50', fontSize: '12px' }}>+{icon?.stakingRate || 10}/h</div>
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
          <div style={{ color: '#aaa', textAlign: 'center', padding: '24px' }}>
            {userIcons.length === 0 ? t.staking_empty_all : t.staking_empty_all_staked}
          </div>
        ) : (
          <div>
            {availableForStaking.map((ui) => {
              const icon = typeof ui.iconId === 'string' ? null : ui.iconId as IIcon;
              if (!icon) return null;
              return (
                <div key={ui._id} style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{icon.name}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{icon.country}</div>
                    <div style={{ color: '#4CAF50', fontSize: '12px' }}>+{icon.stakingRate}/h</div>
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
  );
};
export default StakingPage;
