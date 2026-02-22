import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { IUser } from '../models/User';
import { ILevel } from '../models/Level';
import ChemicalBadge from '../components/ChemicalBadge';
import axios from 'axios';
import toast from 'react-hot-toast';
import Head from 'next/head';
import { getTranslations, Lang } from '../lib/i18n';

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState<IUser | null>(null);
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/leveldata');
      let levelsData = response.data;
      if (levelsData.length < 13) {
        const filled = [...levelsData];
        for (let i = levelsData.length; i < 13; i++) {
          filled.push({
            name: `Level ${i + 1}`,
            badges: [],
            backgroundUrl: '',
            order: i + 1,
            availability: false
          });
        }
        levelsData = filled;
      }
      setLevels(levelsData);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Could not load levels.');
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (session?.user?.telegramId) {
      setLoading(true);
      try {
        const res = await fetch('/api/user/data');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Could not load user data.');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setUserData(null);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      router.replace('/authpage');
    } else if (status === 'loading') {
      setLoading(true);
    }
  }, [status, router, fetchUserData]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Head>
          <title>Home | DGTL P2E Game</title>
        </Head>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Head>
          <title>Home | DGTL P2E Game</title>
        </Head>
        <div className="flex items-center justify-center h-screen">
          <p>{t.home_error}</p>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Home | DGTL P2E Game</title>
      </Head>
      <div className="flex flex-col min-h-screen pb-20">
        <div className="p-4">
          <div className="card bg-base-100 shadow-xl border-2 border-accent">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">
                {userData?.username || userData?.firstName || 'Player'}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm opacity-70">{t.home_balance}</span>
                  <span className="text-xl font-mono text-accent">
                    {typeof userData.coins === 'number' ? userData.coins.toFixed(2) : userData.coins} GTL
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm opacity-70">{t.home_level}</span>
                  <span className="text-xl font-bold">1</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">{t.home_levels}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levels.length > 0 ? (
              levels.map((level) => (
                <div key={level.order} className="card bg-base-200 shadow-lg overflow-hidden border border-white/10">
                  {level.availability ? (
                    <>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {level.badges.map((badge, i) => (
                          <ChemicalBadge key={i} symbol={badge.symbol} name={badge.name} color={badge.color} />
                        ))}
                      </div>
                      {level.backgroundUrl && (
                        <figure><img src={level.backgroundUrl} alt={level.name} /></figure>
                      )}
                      <div className="card-body p-4">
                        <h2 className="card-title">{level.name}</h2>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-accent btn-sm">{t.home_play}</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="card-body p-8 items-center justify-center bg-black/40">
                      <span className="text-lg opacity-50">{t.home_locked}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="opacity-50">{t.home_no_levels}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
