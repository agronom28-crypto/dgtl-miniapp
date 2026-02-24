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
    window.location.reload();
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
        className="fixed bottom-0 left-0 right-0 tabs tabs-boxed p-3 z-30"
      >
        <a
          role="tab"
          className={`tab h-16 ${isActive("/") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/"
        >
          <img src="/icons/white/home-1.svg" alt="Home" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/shop") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/shop"
        >
          <img src="/icons/white/shop.svg" alt="Shop" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/staking") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/staking"
        >
          <img src="/icons/white/staking.svg" alt="Staking" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/friends") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/friends"
        >
          <img src="/icons/white/friends.svg" alt="Friends" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/tasks") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/tasks"
        >
          <img src="/icons/white/tasks.svg" alt="Tasks" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/boosts") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/boosts"
        >
          <img src="/icons/white/boosts.svg" alt="Boosts" className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
};

export default Layout;
