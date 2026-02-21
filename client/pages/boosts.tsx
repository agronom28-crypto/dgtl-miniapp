import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IUserState } from '../models/User';
import { IBoostCard } from '../models/Boosts';
import { showNotification } from '../lib/notifications';

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
  const [boostCards, setBoostCards] = useState<IBoostCard[]>([]);
  const [isBoostsLoading, setIsBoostsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<IUserState | null>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  function triggerSuccess(msg?: string) {
    showNotification(msg || 'Purchase was successful!', 'success');
  }
  function triggerError(msg?: string) {
    showNotification(msg || 'Not enough tokens!', 'error');
  }

  // Fetch Boost Cards
  useEffect(() => {
    const fetchBoostCards = async () => {
      try {
        const response = await axios.get("/api/boost-cards");
        setBoostCards(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching boost cards:", err);
        setError("Failed to load boost cards.");
      } finally {
        setIsBoostsLoading(false);
      }
    };
    fetchBoostCards();
  }, []);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      } finally {
        setIsUserDataLoading(false);
      }
    };
    if (session) {
      fetchUserData();
    } else {
      setIsUserDataLoading(false);
    }
  }, [session]);

  // Покупка буста за монеты
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
        setUserData((prev) => prev
          ? { ...prev, coins: prev.coins - boostPrice, boosts: { ...prev.boosts, [boostId]: (prev.boosts[boostId] || 0) + 1 } }
          : prev);
        triggerSuccess('Boost purchased for coins!');
      } else {
        const data = await response.json();
        triggerError(data.message || 'Not enough coins!');
      }
    } catch (error) {
      console.error(error);
      triggerError();
    } finally {
      setBuyingId(null);
    }
  };

  // Покупка буста за Stars
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
          triggerSuccess('Stars invoice created! Complete payment in Telegram.');
        } else {
          triggerSuccess('Stars payment initiated!');
        }
      } else {
        const data = await response.json();
        triggerError(data.message || 'Stars payment failed!');
      }
    } catch (error) {
      console.error(error);
      triggerError('Stars payment error');
    } finally {
      setBuyingId(null);
    }
  };

  // Покупка Mineral Card за монеты
  const handleMineralPurchase = async (symbol: string, price: number) => {
    setBuyingId('mineral-' + symbol + '-coins');
    try {
      const response = await fetch('/api/buyboost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostId: 'mineral-' + symbol.toLowerCase() }),
      });
      if (response.ok) {
        setUserData((prev) => prev ? { ...prev, coins: prev.coins - price } : prev);
        triggerSuccess(`${symbol} mineral card purchased!`);
      } else {
        triggerError('Not enough coins!');
      }
    } catch (error) {
      triggerError();
    } finally {
      setBuyingId(null);
    }
  };

  // Покупка Mineral Card за Stars
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
        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, '_blank');
          triggerSuccess('Stars invoice created!');
        }
      } else {
        triggerError('Stars payment failed!');
      }
    } catch (error) {
      triggerError('Stars payment error');
    } finally {
      setBuyingId(null);
    }
  };

  const isLoading = isBoostsLoading || isUserDataLoading;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        <div className="text-center p-5">
          <h1 className="text-3xl font-bold p-2">🚀 Store</h1>
          <p className="p-2">Purchase boosts and collect minerals to accelerate your progress!</p>
          {userData && (
            <p className="text-sm text-yellow-400 font-semibold">💰 Balance: {userData.coins?.toLocaleString()} GTL</p>
          )}
        </div>

        {/* Boost Cards Section */}
        <div className="card bg-neutral text-white p-5 shadow-lg m-3">
          <h2 className="card-title text-center mb-4">Boost Cards</h2>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center rounded-xl bg-secondary p-4 text-white">
                  <div className="skeleton mr-4 h-20 w-20 rounded-xl"></div>
                  <div className="flex flex-col gap-2.5">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="w-38 skeleton h-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : boostCards.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No boost cards available</p>
          ) : (
            <div className="flex flex-col gap-4">
              {boostCards.map((card) => (
                <div key={card.id} className="flex items-center bg-secondary text-white p-4 rounded-xl">
                  <img src={card.imageUrl} alt={card.title} className="w-16 h-16 object-contain mr-4 rounded-xl" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    <p className="text-xs text-gray-300 mb-1">{(card as any).description}</p>
                    <p className="text-sm font-semibold">💰 {card.price} GTL</p>
                    <p className="text-sm font-semibold text-yellow-400">⭐ {(card as any).starsPrice} Stars</p>
                    <p className="text-xs text-gray-400">Owned: {userData?.boosts?.[card.id] || 0}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-2">
                    <button
                      className="btn btn-sm btn-base-100 rounded-xl border-2 text-xs"
                      disabled={buyingId === card.id + '-coins'}
                      onClick={() => handlePurchase(card.id)}>
                      {buyingId === card.id + '-coins' ? '...' : '💰 Buy'}
                    </button>
                    <button
                      className="btn btn-sm btn-warning rounded-xl text-xs"
                      disabled={buyingId === card.id + '-stars'}
                      onClick={() => handlePurchaseStars(card.id)}>
                      {buyingId === card.id + '-stars' ? '...' : '⭐ Stars'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mineral Cards Section */}
        <div className="card bg-neutral text-white p-5 shadow-lg m-3">
          <h2 className="card-title text-center mb-4">Mineral Cards</h2>
          <div className="flex flex-col gap-4">
            {minerals.map((mineral, index) => (
              <div key={index} className="flex items-center bg-secondary text-white p-4 rounded-xl">
                <img
                  src={mineral.imageUrl}
                  alt={mineral.name}
                  className="w-16 h-16 object-contain mr-4 rounded-xl"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg">{mineral.name} ({mineral.symbol})</p>
                  <p className="text-sm font-semibold">💰 {mineral.price} GTL</p>
                  <p className="text-sm font-semibold text-yellow-400">⭐ {mineral.starsPrice} Stars</p>
                </div>
                <div className="flex flex-col gap-2 ml-2">
                  <button
                    className="btn btn-sm btn-base-100 rounded-xl border-2 text-xs"
                    disabled={buyingId === 'mineral-' + mineral.symbol + '-coins'}
                    onClick={() => handleMineralPurchase(mineral.symbol, mineral.price)}>
                    {buyingId === 'mineral-' + mineral.symbol + '-coins' ? '...' : '💰 Buy'}
                  </button>
                  <button
                    className="btn btn-sm btn-warning rounded-xl text-xs"
                    disabled={buyingId === 'mineral-' + mineral.symbol + '-stars'}
                    onClick={() => handleMineralPurchaseStars(mineral.symbol)}>
                    {buyingId === 'mineral-' + mineral.symbol + '-stars' ? '...' : '⭐ Stars'}
                  </button>
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
