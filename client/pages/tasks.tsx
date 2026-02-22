import Link from "next/link";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { getTranslations, Lang } from "../lib/i18n";

// Define the type for the social network card data
interface SocialNetwork {
  name: string;
  logo: string;
  points: string;
  url: string;
}

// Define the props for the SocialCard component
interface SocialCardProps {
  name: string;
  logo: string;
  points: string;
  url: string;
  followText: string;
  openText: string;
}

// Sample data for the cards
const socialNetworks: SocialNetwork[] = [
  {
    name: "Facebook",
    logo: "/facebook.svg",
    points: "500",
    url: "https://www.facebook.com",
  },
  {
    name: "X",
    logo: "/x.svg",
    points: "500",
    url: "https://www.x.com",
  },
  {
    name: "Instagram",
    logo: "/instagram.svg",
    points: "500",
    url: "https://www.instagram.com",
  },
  {
    name: "Tiktok",
    logo: "/tiktok.svg",
    points: "500",
    url: "https://www.instagram.com",
  },
  {
    name: "Telegram",
    logo: "/telegram.svg",
    points: "500",
    url: "https://www.instagram.com",
  },
];

const SocialCard: React.FC<SocialCardProps> = ({ name, logo, points, url, followText, openText }) => {
  return (
    <div className="card bg-base-100 border-2 border-accent shadow-glow mb-4">
      <div className="card-body flex-row items-center p-4">
        {/* Logo Section */}
        <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
          <img src={logo} alt={name} className="w-8 h-8" />
        </div>

        {/* Points Section */}
        <div className="flex-grow ml-4">
          <h3 className="font-bold text-lg">{followText} {name}</h3>
          <p className="text-accent font-mono">+{points} GTL</p>
        </div>

        {/* Redirect Button */}
        <button
          onClick={() => window.open(url, "_blank")}
          className="btn btn-sm btn-base-100 text-white border-2 border-accent shadow-glow"
        >
          {openText}
        </button>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Main content */}
        <div className="p-5 text-center">
          <h1 className="text-3xl font-bold mb-2">{t.tasks_title}</h1>
          <p className="opacity-70">{t.tasks_subtitle}</p>
        </div>

        {/* Social Cards Section */}
        <div className="p-3">
          {socialNetworks.map((network, index) => (
            <SocialCard
              key={index}
              name={network.name}
              logo={network.logo}
              points={network.points}
              url={network.url}
              followText={t.tasks_follow}
              openText={t.tasks_open}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
