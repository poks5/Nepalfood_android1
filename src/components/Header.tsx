import React from 'react';
import { Sparkles, Globe, Heart, FileSpreadsheet } from 'lucide-react';
import { Language, NavTab } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onNavigate: (tab: NavTab) => void;
  favoritesCount: number;
  filterYear?: string;
  onFilterYearChange?: (year: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onNavigate,
  favoritesCount,
  filterYear = 'ALL',
  onFilterYearChange
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Identity */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-lg font-bold select-none">खा</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-neutral-900 leading-none">
                {t.appName}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </button>

        {/* Right side controls: Data Table shortcut, Edition Switcher, Favorites & Language */}
        <div className="flex items-center gap-2">
          {/* Quick Data Table & Export Link */}
          <button
            onClick={() => onNavigate('table')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors shadow-2xs"
            title="Open interactive Data Table & Export CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.table}</span>
          </button>

          {/* Prominent Edition Filter */}
          {onFilterYearChange && (
            <div className="flex items-center">
              <select
                value={filterYear}
                onChange={(e) => onFilterYearChange(e.target.value)}
                className={`text-xs rounded-lg block p-1.5 font-bold transition-all border ${
                  filterYear === '2024'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : filterYear === '2012'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                }`}
                title="Filter dataset by publication edition"
              >
                <option value="ALL">All (644)</option>
                <option value="2024">2024 (100)</option>
                <option value="2012">2012 (544)</option>
              </select>
            </div>
          )}

          {/* Quick Favorite Icon indicator */}
          <button
            onClick={() => onNavigate('favorites')}
            className="relative p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title={t.favorites}
            aria-label={t.favorites}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('ne')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'ne'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              नेपाली
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
