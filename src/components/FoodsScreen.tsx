import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Filter, Search, FileSpreadsheet, Layers, Download } from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language } from '../types';
import { FoodCard } from './FoodCard';
import { translations } from '../i18n';
import { CANONICAL_CATEGORIES, isFoodInCategory, getCategoryMeta } from '../utils/nutrition';

interface FoodsScreenProps {
  foods: FoodMasterItem[];
  allFoods?: FoodMasterItem[];
  photos: FoodPhotoItem[];
  lang: Language;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectFood: (food: FoodMasterItem) => void;
  isFavorite: (foodId: string) => boolean;
  onToggleFavorite: (foodId: string) => void;
  filterYear?: string;
  onFilterYearChange?: (year: string) => void;
  onOpenTable?: () => void;
}

export const FoodsScreen: React.FC<FoodsScreenProps> = ({
  foods,
  allFoods,
  photos,
  lang,
  selectedCategory,
  onSelectCategory,
  onSelectFood,
  isFavorite,
  onToggleFavorite,
  filterYear = 'ALL',
  onFilterYearChange,
  onOpenTable,
}) => {
  const t = translations[lang];
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'energy' | 'protein' | 'potassium' | 'phosphorus'>('default');

  const photoMap = useMemo(() => {
    const map = new Map<string, FoodPhotoItem>();
    photos.forEach((p) => map.set(p.food_id, p));
    return map;
  }, [photos]);

  // Dynamically extract distinct categories with verified positive counts
  const activeCategories = useMemo(() => {
    const list: { key: string; count: number; nameNe?: string; nameEn?: string; emoji?: string }[] = [
      { key: 'ALL', count: foods.length, nameNe: t.allCategories, nameEn: t.allCategories, emoji: '🌾' }
    ];

    for (const cat of CANONICAL_CATEGORIES) {
      const count = foods.filter((f) => isFoodInCategory(f.food_group, cat.key)).length;
      if (count > 0) {
        list.push({
          key: cat.key,
          count,
          nameNe: cat.nameNe,
          nameEn: cat.nameEn,
          emoji: cat.emoji
        });
      }
    }

    return list;
  }, [foods, t.allCategories]);

  const filteredAndSortedFoods = useMemo(() => {
    let list = foods.filter((f) => {
      const matchCategory =
        selectedCategory === 'ALL' || isFoodInCategory(f.food_group, selectedCategory);
      const q = searchFilter.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        f.food_name_original.toLowerCase().includes(q) ||
        (f.variety_name && f.variety_name.toLowerCase().includes(q)) ||
        f.scientific_name.toLowerCase().includes(q) ||
        f.food_id.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });

    // Helper to extract float safely
    const numVal = (str: string) => {
      const p = parseFloat(str);
      return isNaN(p) ? -1 : p;
    };

    if (sortBy === 'energy') {
      list = [...list].sort((a, b) => numVal(b.energy_kcal) - numVal(a.energy_kcal));
    } else if (sortBy === 'protein') {
      list = [...list].sort((a, b) => numVal(b.protein_g) - numVal(a.protein_g));
    } else if (sortBy === 'potassium') {
      list = [...list].sort((a, b) => numVal(b.potassium_mg) - numVal(a.potassium_mg));
    } else if (sortBy === 'phosphorus') {
      list = [...list].sort((a, b) => numVal(b.phosphorus_mg) - numVal(a.phosphorus_mg));
    }

    return list;
  }, [foods, selectedCategory, searchFilter, sortBy]);

  const totalAll = (allFoods || foods).length;
  const total2024 = (allFoods || foods).filter((f) => f.source_year === '2024').length;
  const total2012 = (allFoods || foods).filter((f) => f.source_year === '2012').length;

  return (
    <div className="space-y-4 pb-24">
      {/* Edition Segregation Switcher */}
      {onFilterYearChange && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                {lang === 'ne' ? 'संस्करण अनुसार डाटा विभाजन:' : 'Dataset Edition Segregation:'}
              </span>
            </div>

            {onOpenTable && (
              <button
                onClick={onOpenTable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors w-fit"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'ne' ? 'डाटा तालिका र एक्सपोर्ट खोल्नुहोस्' : 'Open Data Table & Export'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onFilterYearChange('ALL')}
              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                filterYear === 'ALL'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 font-bold text-blue-950 shadow-2xs'
                  : 'bg-neutral-50/70 border-neutral-200 text-neutral-600 hover:bg-neutral-100 font-medium'
              }`}
            >
              <div className="text-xs font-bold truncate">All Editions</div>
              <div className="text-[11px] font-mono text-blue-700 mt-0.5">{totalAll} foods</div>
            </button>

            <button
              onClick={() => onFilterYearChange('2024')}
              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                filterYear === '2024'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 font-bold text-emerald-950 shadow-2xs'
                  : 'bg-neutral-50/70 border-neutral-200 text-neutral-600 hover:bg-neutral-100 font-medium'
              }`}
            >
              <div className="text-xs font-bold truncate">2024 NARC</div>
              <div className="text-[11px] font-mono text-emerald-700 mt-0.5">{total2024} foods</div>
            </button>

            <button
              onClick={() => onFilterYearChange('2012')}
              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                filterYear === '2012'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 font-bold text-amber-950 shadow-2xs'
                  : 'bg-neutral-50/70 border-neutral-200 text-neutral-600 hover:bg-neutral-100 font-medium'
              }`}
            >
              <div className="text-xs font-bold truncate">2012 DFTQC</div>
              <div className="text-[11px] font-mono text-amber-700 mt-0.5">{total2012} foods</div>
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs & Filter Header */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              {t.exploreFoods}
            </h1>
            <p className="text-xs text-neutral-500">
              {filteredAndSortedFoods.length} {t.resultsFound}
              {filterYear !== 'ALL' && ` (${filterYear} Edition)`}
            </p>
          </div>

          {/* Quick inline search input & sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-neutral-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter foods..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-neutral-700 focus:outline-none cursor-pointer"
              >
                <option value="default">{t.sortDefault}</option>
                <option value="energy">{t.sortEnergy}</option>
                <option value="protein">{t.sortProtein}</option>
                <option value="potassium">{t.sortPotassium}</option>
                <option value="phosphorus">{t.sortPhosphorus}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none pb-1">
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const label = lang === 'ne' ? cat.nameNe || cat.key : cat.nameEn || cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70 border border-neutral-200/60'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-white text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedFoods.map((food) => (
          <FoodCard
            key={food.food_id}
            food={food}
            photo={photoMap.get(food.food_id)}
            lang={lang}
            isFavorite={isFavorite(food.food_id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectFood}
          />
        ))}
      </div>

      {filteredAndSortedFoods.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-2">
          <p className="text-sm font-bold text-neutral-800">{t.noResults}</p>
          <p className="text-xs text-neutral-500">{t.tryDifferentSearch}</p>
        </div>
      )}
    </div>
  );
};
