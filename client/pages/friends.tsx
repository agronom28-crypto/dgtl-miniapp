import Layout from "@/components/layout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getTranslations, Lang } from "../lib/i18n";

// Define the type for user data
interface User {
  name: string;
  coins: number;
}

const Index: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ru');
  const t = getTranslations(lang);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);
  }, []);

  // Sample data for users and their coin balances
  const users: User[] = [
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 },
    { name: "Alice", coins: 1200 },
    { name: "Bob", coins: 950 },
    { name: "Charlie", coins: 780 },
    { name: "Diana", coins: 1500 },
    { name: "Eve", coins: 1100 }
  ];

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Main content */}
        <div className="flex-grow">
          <div className="text-center p-5">
            <h1 className="text-3xl font-bold p-2">{t.friends_title}</h1>
            <p className="p-2 text-white/70">{t.friends_subtitle}</p>
          </div>

          {/* Card Section */}
          <div className="p-3">
            <div className="card bg-base-100 text-white border-2 border-accent shadow-glow">
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold">{t.friends_invite_card}</h2>
                <p className="text-lg opacity-80">
                  {t.friends_invite_desc}
                </p>
                <div className="mt-4">
                  <span className="text-xl font-bold text-accent">5 frens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* Table Body */}
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="p-4 font-bold text-lg">{user.name}</td>
                      <td className="p-4 text-right text-accent font-mono text-lg">{user.coins} GTL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invite Button */}
        <div className="fixed bottom-24 left-0 right-0 p-4">
          <button className="btn btn-primary w-full text-lg shadow-lg">
            {t.friends_btn}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
