import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IUserState } from '../models/User';
import { IBoostCard } from '../models/Boosts';
import { showNotification } from '../lib/notifications';
import { getTranslations, Lang } from '../lib/i18n';

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

const Store: React.FC = () => {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  const [boostCards, setBoostCards] = useState<IBoostCard[]>([]);
  const [isBoostsLoading, setIsBoostsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<IUserState | null>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  useEffect(() => {
    const fetchBoostCards = async () => {
      try {
        const response = await axios.get("/api/boost-cards");
        setBoostCards(Array.isArray(response.data) ? response.data : []);
      } catch (err) { console.error(err); } finally { setIsBoostsLoading(false); }
    };
    fetchBoostCards();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data');
        if (res.ok) setUserData(await res.json());
      } catch (err) { console.error(err); } finally { setIsUserDataLoading(false); }
    };
    if (session) fetchUserData(); else setIsUserDataLoading(false);
  }, [session]);

  const handlePurchase = async (boostId: string) => {
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
    } catch (err) { showNotification(t.boosts_no_coins, 'error'); } finally { setBuyingId(null); }
  };

  const handlePurchaseStars = async (boostId: string) => {
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
    } catch (err) { showNotification(t.boosts_stars_error, 'error'); } finally { setBuyingId(null); }
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
    } catch (err) { showNotification(t.boosts_not_enough, 'error'); } finally { setBuyingId(null); }
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
    } catch (err) { showNotification(t.boosts_stars_error, 'error'); } finally { setBuyingId(null); }
  };

  const isLoading = isBoostsLoading || isUserDataLoading;

  return (
    <Layout>
      <div className=\"flex flex-col min-h-screen pb-20\">
        <div className=\"text-center p-5\">
          <div className=\"flex justify-between items-center px-4\">
            <h1 className=\"text-3xl font-bold\">{t.boosts_title}</h1>
            <button onClick={toggleLang} className=\"px-3 py-1 bg-gray-700 rounded text-xs text-white\">{lang === 'ru' ? 'EN' : 'RU'}</button>
          </div>
          <p className=\"p-2\">{t.boosts_subtitle}</p>
          {userData && <p className=\"text-sm text-yellow-400 font-semibold\">💰 {t.boosts_balance}: {userData.coins?.toLocaleString()} GTL</p>}
        </div>

        <div className=\"card bg-neutral text-white p-5 shadow-lg m-3\">
          <h2 className=\"card-title text-center mb-4\">{t.boosts_section}</h2>
          {isLoading ? <div className=\"skeleton h-20 w-full rounded-xl\"></div> : boostCards.length === 0 ? <p className=\"text-center text-gray-400\">{t.boosts_no_cards}</p> : (
            <div className=\"flex flex-col gap-4\">
              {boostCards.map((card) => (
                <div key={card.id} className=\"flex items-center bg-secondary text-white p-4 rounded-xl\">
                  <img src={card.imageUrl} alt={card.title} className=\"w-16 h-16 object-contain mr-4 rounded-xl\" />
                  <div className=\"flex-1\">
                    <h3 className=\"font-bold text-lg\">{card.title}</h3>
                    <p className=\"text-sm font-semibold\">💰 {card.price} GTL</p>
                    <p className=\"text-sm font-semibold text-yellow-400\">⭐ {(card as any).starsPrice} Stars</p>
                    <p className=\"text-xs text-gray-400\">{t.boosts_owned}: {userData?.boosts?.[card.id] || 0}</p>
          ))}
    </div>
  )
}
</div>

    </div>
  )
}

          )}
        </div>

        <div className=\"card bg-neutral text-white p-5 shadow-lg m-3\">
          <h2 className=\"card-title text-center mb-4\">{t.boosts_minerals}</h2>
          <div className=\"flex flex-col gap-4\">
            {minerals.map((m, i) => (
              <div key={i} className=\"flex items-center bg-secondary text-white p-4 rounded-xl\">
                <img src={m.imageUrl} alt={m.name} className=\"w-16 h-16 object-contain mr-4 rounded-xl\" />
                <div className=\"flex-1\">
                  <p className=\"font-bold text-lg\">{m.name} ({m.symbol})</p>
                  <p className=\"text-sm font-semibold\">💰 {m.price} GTL</p>
                  <p className=\"text-sm font-semibold text-yellow-400\">⭐ {m.starsPrice} Stars</p>
                </div>
                <div className=\"flex flex-col gap-2 ml-2\">
                  <button className=\"btn btn-sm btn-base-100 rounded-xl\" disabled={buyingId === 'mineral-' + m.symbol + '-coins'} onClick={() => handleMineralPurchase(m.symbol, m.price)}>{buyingId === 'mineral-' + m.symbol + '-coins' ? '...' : t.boosts_buy}</button>
                  <button className=\"btn btn-sm btn-warning rounded-xl\" disabled={buyingId === 'mineral-' + m.symbol + '-stars'} onClick={() => handleMineralPurchaseStars(m.symbol)}>{buyingId === 'mineral-' + m.symbol + '-stars' ? '...' : t.boosts_stars}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Store;
