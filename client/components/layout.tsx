import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Lang } from "../lib/i18n";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang === 'ru' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    const newLang: Lang = lang === 'ru' ? 'en' : 'ru';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    window.dispatchEvent(new CustomEvent('langChange', { detail: newLang }));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Language toggle button */}
      <div className="fixed top-3 right-3 z-50">
        <button
          onClick={toggleLang}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}
        >
          {lang === 'ru' ? 'EN' : 'RU'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-grow">{children}</div>

      {/* Tab Navigation */}
      <div
        role="tablist"
        className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 z-50"
        style={{ background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/') ? 'text-yellow-400' : 'text-gray-400'}`} href="/">
          <img src="/icons/nav/home.svg" alt="Home" className="w-6 h-6 mb-1" />
          Home
        </a>
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/shop') ? 'text-yellow-400' : 'text-gray-400'}`} href="/shop">
          <img src="/icons/nav/shop.svg" alt="Shop" className="w-6 h-6 mb-1" />
          Shop
        </a>
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/boosts') ? 'text-yellow-400' : 'text-gray-400'}`} href="/boosts">
          <img src="/icons/nav/boosts.svg" alt="Boosts" className="w-6 h-6 mb-1" />
          Boosts
        </a>
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/staking') ? 'text-yellow-400' : 'text-gray-400'}`} href="/staking">
          <img src="/icons/nav/staking.svg" alt="Staking" className="w-6 h-6 mb-1" />
          Staking
        </a>
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/friends') ? 'text-yellow-400' : 'text-gray-400'}`} href="/friends">
          <img src="/icons/nav/friends.svg" alt="Friends" className="w-6 h-6 mb-1" />
          Friends
        </a>
        <a role="tab" className={`flex flex-col items-center text-xs ${isActive('/tasks') ? 'text-yellow-400' : 'text-gray-400'}`} href="/tasks">
          <img src="/icons/nav/tasks.svg" alt="Tasks" className="w-6 h-6 mb-1" />
          Tasks
        </a>
      </div>
    </div>
  );
};

export default Layout;
