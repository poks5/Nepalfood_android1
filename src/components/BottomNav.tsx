import React from 'react';
import { Home, UtensilsCrossed, FileSpreadsheet, Heart, MoreHorizontal } from 'lucide-react';
import { NavTab, Language } from '../types';
import { translations } from '../i18n';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: Language;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
  favoritesCount,
}) => {
  const t = translations[lang];

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'foods', label: t.foods, icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'table', label: t.table, icon: <FileSpreadsheet className="w-5 h-5" /> },
    {
      id: 'favorites',
      label: t.favorites,
      icon: (
        <div className="relative">
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 min-w-[14px] h-3.5 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'more', label: t.more, icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px] select-none ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-50 scale-110' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight leading-none truncate max-w-[90%]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
