import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, Heart, Zap, Info } from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language, NavTab } from '../types';
import { FoodCard } from './FoodCard';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { CANONICAL_CATEGORIES, isFoodInCategory } from '../utils/nutrition';
import { translations } from '../i18n';

interface HomeScreenProps {
  foods: FoodMasterItem[];
  photos: FoodPhotoItem[];
  lang: Language;
  onSelectFood: (food: FoodMasterItem) => void;
  onSelectCategory: (categoryKey: string) => void;
  onNavigate: (tab: NavTab) => void;
  isFavorite: (foodId: string) => boolean;
  onToggleFavorite: (foodId: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  foods,
  photos,
  lang,
  onSelectFood,
  onSelectCategory,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  onSearchSubmit,
}) => {
  const t = translations[lang];
  const [searchInput, setSearchInput] = useState('');

  // First demo food: NFD-00001
  const demoFood = foods.find((f) => f.food_id === 'NFD-00001') || foods[0];
  const demoPhoto = photos.find((p) => p.food_id === demoFood.food_id);

  // Dynamically compute non-empty categories based on currently active foods
  const activeHomeCategories = useMemo(() => {
    return CANONICAL_CATEGORIES.map((cat) => {
      const count = foods.filter((f) => isFoodInCategory(f.food_group, cat.key)).length;
      return {
        ...cat,
        count
      };
    }).filter((cat) => cat.count > 0);
  }, [foods]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearchSubmit(searchInput);
    }
  };

  // Curated explore list (mix across groups)
  const exploreFoods = [
    foods[0],  // Pokhreli Basmati
    foods[14], // Wheat Gautam
    foods[34], // Soybean Puja
    foods[46], // Potato White
    foods[57], // Apple Red Delicious
    foods[74], // Spinach Leafy
  ].filter(Boolean);

  const getPhotoForFood = (id: string) => photos.find((p) => p.food_id === id);

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Banner & Search Box */}
      <section className="bg-linear-to-b from-emerald-50/70 via-white to-white rounded-3xl p-5 sm:p-7 border border-emerald-100 shadow-2xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>NARC 2024 Verified Food Composition</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
            {lang === 'ne' ? 'आधिकारिक नेपाली खाद्य तथा पोषण' : 'Reliable Nepali Food & Nutrition'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
            {t.tagline}
          </p>

          {/* Large Search Box */}
          <div className="mt-5 relative">
            <div className="relative flex items-center shadow-sm rounded-2xl bg-white border-2 border-emerald-600/30 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden">
              <Search className="w-5 h-5 ml-4 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                placeholder={t.searchPlaceholder}
                className="w-full py-3.5 pl-3 pr-24 text-sm font-medium text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onSearchSubmit(searchInput)}
                className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                {t.searchButton}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            {t.categories}
          </h2>
          <button
            onClick={() => onNavigate('foods')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>{t.exploreFoods}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {activeHomeCategories.map((cat) => {
            return (
              <button
                key={cat.key}
                onClick={() => {
                  onSelectCategory(cat.key);
                  onNavigate('foods');
                }}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-sm ${cat.bgClass} ${cat.borderClass} group`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 border border-neutral-200/60 text-neutral-600">
                    {cat.count}
                  </span>
                </div>
                <div className="mt-3">
                  <span className={`font-bold text-xs leading-snug block ${cat.textClass}`}>
                    {lang === 'ne' ? cat.nameNe : cat.nameEn}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    {cat.count} {lang === 'ne' ? 'प्रमाणित खाद्य' : 'verified foods'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Demonstration Food Spotlight: NFD-00001 (Pokhreli Basmati) */}
      {demoFood && (
        <section className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.featuredFood} (NFD-00001)</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-neutral-400">
              Kaski, Gandaki
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Photo Placeholder */}
            <div className="md:col-span-5">
              <PhotoPlaceholder
                foodName={demoFood.food_name_original}
                foodGroup={demoFood.food_group}
                photoInfo={demoPhoto}
                size="md"
              />
            </div>

            {/* Right Nutritional Info */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <h3 className="text-xl font-black text-neutral-900">
                  {demoFood.food_name_original}
                </h3>
                <p className="text-xs italic text-neutral-500 font-serif">
                  {demoFood.scientific_name} &bull; Variety: {demoFood.variety_name}
                </p>
              </div>

              {/* Factual Nutrition Pills per 100g */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                    {t.energy}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-neutral-900">
                    {demoFood.energy_kcal} <span className="text-[10px] font-normal text-neutral-500">kcal</span>
                  </span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                    {t.protein}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-neutral-900">
                    {demoFood.protein_g} <span className="text-[10px] font-normal text-neutral-500">g</span>
                  </span>
                </div>
                <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                  <span className="text-[10px] text-purple-700 block uppercase font-bold">
                    {t.potassium}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-purple-950">
                    {demoFood.potassium_mg} <span className="text-[10px] font-normal text-neutral-500">mg</span>
                  </span>
                </div>
                <div className="bg-teal-50/70 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-teal-700 block uppercase font-bold">
                    {t.phosphorus}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-teal-950">
                    {demoFood.phosphorus_mg} <span className="text-[10px] font-normal text-neutral-500">mg</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectFood(demoFood)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-neutral-400">
                  Basis: 100g edible portion
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Explore Foods Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            {t.exploreFoods}
          </h2>
          <button
            onClick={() => onNavigate('foods')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {lang === 'ne' ? `सबै ${foods.length} खाद्य हेर्नुहोस्` : `View all ${foods.length} foods`} &rarr;
          </button>
        </div>

        {/* Quick Data Table & Export Banner */}
        <div className="mb-4 p-4 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-600 text-white text-xs font-bold">CSV / Table</span>
              <h3 className="text-sm font-black text-neutral-900">
                {lang === 'ne' ? 'डाटा तालिका र एक्सपोर्ट (२०२४ र २०१२)' : 'Full Data Table & CSV Export (2024 & 2012)'}
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              {lang === 'ne'
                ? '२०२४ (१०० खाद्य) र २०१२ (५४४ खाद्य) का सम्पूर्ण पोषण विवरण तालिकामा हेर्नुहोस् र डाउनलोड गर्नुहोस्।'
                : 'Interactive spreadsheet with isolated 2024/2012 editions, search, and one-click Excel/CSV export.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('table')}
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {lang === 'ne' ? 'डाटा तालिका खोल्नुहोस्' : 'Open Data Table'} &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exploreFoods.map((food) => (
            <FoodCard
              key={food.food_id}
              food={food}
              photo={getPhotoForFood(food.food_id)}
              lang={lang}
              isFavorite={isFavorite(food.food_id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectFood}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
