import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import { stakingService } from '../services/stakingService';
import { shopService } from '../services/shopService';
import { IUserIcon, IStakedIcon, IIcon } from '../models/Icon';
import Head from 'next/head';

const StakingPage = () => {
  const { data: session } = useSession();
  const [userIcons, setUserIcons] = useState<IUserIcon[]>([]);
  const [stakedIcons, setStakedIcons] = useState<IStakedIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState<string | null>(null);

  const telegramId = (session?.user as any)?.telegramId;

  const loadData = useCallback(async () => {
    if (!telegramId) return;
    try {
      const [userIconsData, stakingData] = await Promise.all([
        shopService.getUserIcons(telegramId),
        stakingService.getUserStaking(telegramId)
      ]);
      setUserIcons(userIconsData);
      setStakedIcons(stakingData.stakedIcons || []);
    } catch (err) {
      console.error('Failed to load staking data:', err);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStake = async (iconId: string) => {
    if (!telegramId) return;
    setStaking(iconId);
    try {
      await stakingService.stake(telegramId, iconId);
      await loadData();
    } catch (err: any) {
      console.error('Staking failed:', err);
      alert(err.response?.data?.error || 'Ошибка стейкинга');
    } finally {
      setStaking(null);
    }
  };

  const handleUnstake = async (stakedIconId: string) => {
    if (!telegramId) return;
    try {
      await stakingService.unstake(telegramId, stakedIconId);
      await loadData();
    } catch (err) {
      console.error('Unstake failed:', err);
    }
  };

  const handleClaim = async (stakedIconId: string) => {
    if (!telegramId) return;
    try {
      const result = await stakingService.claimRewards(telegramId, stakedIconId);
      alert(`Собрано ${result.reward} монет!`);
      await loadData();
    } catch (err: any) {
      console.error('Claim failed:', err);
      alert(err.response?.data?.error || 'Ошибка сбора наград');
    }
  };

  // Вычисляем время стейкинга
  const getStakingDuration = (stakedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(stakedAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  // Иконки, доступные для стейкинга (не застейканные)
  const stakedIconIds = stakedIcons
    .filter(si => si.isActive)
    .map(si => typeof si.iconId === 'string' ? si.iconId : si.iconId._id);

  const availableForStaking = userIcons.filter(ui => {
    const iconId = typeof ui.iconId === 'string' ? ui.iconId : ui.iconId._id;
    return !stakedIconIds.includes(iconId);
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Стейкинг — DGTL</title>
      </Head>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-2">Стейкинг</h1>
        <p className="text-center text-gray-400 text-sm mb-4">
          Застейкайте иконки и получайте пассивный доход
        </p>

        {/* Активные стейки */}
        {stakedIcons.filter(si => si.isActive).length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Активные стейки</h2>
            <div className="space-y-3">
              {stakedIcons
                .filter(si => si.isActive)
                .map((si) => {
                  const icon = typeof si.iconId === 'string' ? null : si.iconId as IIcon;
                  return (
                    <div key={si._id} className="bg-base-200 rounded-xl p-4 border border-green-800">
                      <div className="flex items-center gap-3">
                        {icon?.imageUrl && (
                          <img src={icon.imageUrl} alt={icon.name} className="w-14 h-14 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{icon?.name || 'Иконка'}</h4>
                          <p className="text-xs text-gray-400">
                            Застейкано: {getStakingDuration(si.stakedAt)}
                          </p>
                          {icon?.stakingBonus && (
                            <p className="text-xs text-green-400">+{icon.stakingBonus}% бонус</p>
                          )}
                          <p className="text-xs text-yellow-400">
                            Собрано: {si.rewardsClaimed} монет
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => handleClaim(si._id)}
                          >
                            Собрать
                          </button>
                          <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => handleUnstake(si._id)}
                          >
                            Снять
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Доступные для стейкинга */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Доступные иконки</h2>
          {availableForStaking.length === 0 ? (
            <p className="text-center text-gray-400 py-6">
              Нет иконок для стейкинга. Купите иконки в магазине.
            </p>
          ) : (
            <div className="space-y-3">
              {availableForStaking.map((ui) => {
                const icon = typeof ui.iconId === 'string' ? null : ui.iconId as IIcon;
                if (!icon) return null;
                const iconId = icon._id;
                return (
                  <div key={ui._id} className="flex items-center bg-base-200 rounded-xl p-3 gap-3">
                    {icon.imageUrl && (
                      <img src={icon.imageUrl} alt={icon.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{icon.name}</h4>
                      <span className="badge badge-xs badge-outline">{icon.rarity}</span>
                      {icon.stakingBonus > 0 && (
                        <p className="text-xs text-green-400">+{icon.stakingBonus}% бонус</p>
                      )}
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={staking === iconId}
                      onClick={() => handleStake(iconId)}
                    >
                      {staking === iconId ? '...' : 'Стейк'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StakingPage;
