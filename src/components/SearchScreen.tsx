import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight, Utensils } from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language } from '../types';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { translations } from '../i18n';
import { CANONICAL_CATEGORIES, isFoodInCategory, getCategoryMeta } from '../utils/nutrition';

interface SearchScreenProps {
  foods: FoodMasterItem[];
  photos: FoodPhotoItem[];
  lang: Language;
  initialQuery?: string;
  onSelectFood: (food: FoodMasterItem) => void;
  isFavorite: (foodId: string) => boolean;
  onToggleFavorite: (foodId: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  foods,
  photos,
  lang,
  initialQuery = '',
  onSelectFood,
  isFavorite,
  onToggleFavorite,
}) => {
  const t = translations[lang];
  const [query, setQuery] = useState(initialQuery);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  const photoMap = useMemo(() => {
    const map = new Map<string, FoodPhotoItem>();
    photos.forEach((p) => map.set(p.food_id, p));
    return map;
  }, [photos]);

  const activeCategories = useMemo(() => {
    const list = [
      { key: 'ALL', nameNe: t.allCategories, nameEn: t.allCategories, emoji: '🌾' }
    ];
    for (const cat of CANONICAL_CATEGORIES) {
      const count = foods.filter((f) => isFoodInCategory(f.food_group, cat.key)).length;
      if (count > 0) {
        list.push({
          key: cat.key,
          nameNe: cat.nameNe,
          nameEn: cat.nameEn,
          emoji: cat.emoji
        });
      }
    }
    return list;
  }, [foods, t.allCategories]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    return foods.filter((item) => {
      const matchQuery =
        q === '' ||
        item.food_name_original.toLowerCase().includes(q) ||
        (item.variety_name && item.variety_name.toLowerCase().includes(q)) ||
        item.scientific_name.toLowerCase().includes(q) ||
        item.food_group.toLowerCase().includes(q) ||
        (item.food_subgroup && item.food_subgroup.toLowerCase().includes(q)) ||
        item.food_id.toLowerCase().includes(q);

      const matchGroup = selectedGroup === 'ALL' || isFoodInCategory(item.food_group, selectedGroup);
      return matchQuery && matchGroup;
    });
  }, [foods, query, selectedGroup]);

  // Quick suggestions
  const suggestions = ['Rice', 'Maize', 'Soybean', 'Potato', 'Apple', 'Basmati', 'Millet'];

  return (
    <div className="space-y-4 pb-24">
      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs sticky top-16 z-20">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-3.5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none pb-1">
          {activeCategories.map((cat) => {
            const isSelected = selectedGroup === cat.key;
            const label = lang === 'ne' ? cat.nameNe : cat.nameEn;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedGroup(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestion Chips if search is empty */}
      {!query && (
        <div className="px-1 py-1 flex items-center gap-1.5 flex-wrap text-xs text-neutral-500">
          <span className="font-semibold text-neutral-400 text-[11px] uppercase tracking-wider">
            {lang === 'ne' ? 'सुझाव:' : 'Popular:'}
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 font-medium transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-700">
          {searchResults.length} {t.resultsFound}
        </span>
        {query && (
          <span>
            {lang === 'ne' ? `"${query}" को लागि परिणाम` : `Results for "${query}"`}
          </span>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {searchResults.map((item) => {
          const photo = photoMap.get(item.food_id);
          const cat = getCategoryMeta(item.food_group);

          return (
            <div
              key={item.food_id}
              onClick={() => onSelectFood(item)}
              className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
            >
              {/* Left Photo & Food Summary */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
                  <PhotoPlaceholder
                    foodName={item.food_name_original}
                    foodGroup={item.food_group}
                    photoInfo={photo}
                    size="sm"
                    className="h-full"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {item.food_id}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500 truncate">
                      {item.food_group}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 leading-tight truncate">
                    {item.food_name_original}
                  </h3>

                  <p className="text-xs italic text-neutral-500 truncate font-serif mt-0.5">
                    {item.scientific_name}
                  </p>

                  {item.variety_name && (
                    <span className="inline-block mt-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {t.variety}: {item.variety_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Nutrients Highlights (per 100g) */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 justify-between sm:justify-end">
                <div className="grid grid-cols-5 sm:flex sm:items-center gap-1.5 text-center flex-1 sm:flex-initial">
                  {/* Energy */}
                  <div className="bg-neutral-50 px-2 py-1.5 rounded-lg border border-neutral-100 min-w-[56px]">
                    <span className="block text-[9px] text-neutral-400 font-bold uppercase">{t.energy}</span>
                    <span className="text-[11px] font-extrabold font-mono text-neutral-800">{item.energy_kcal || '—'}</span>
                  </div>
                  {/* Protein */}
                  <div className="bg-neutral-50 px-2 py-1.5 rounded-lg border border-neutral-100 min-w-[56px]">
                    <span className="block text-[9px] text-neutral-400 font-bold uppercase">{t.protein}</span>
                    <span className="text-[11px] font-extrabold font-mono text-neutral-800">{item.protein_g || '—'}g</span>
                  </div>
                  {/* Potassium (K) */}
                  <div className="bg-purple-50 px-2 py-1.5 rounded-lg border border-purple-100 min-w-[56px]">
                    <span className="block text-[9px] text-purple-700 font-bold uppercase">K</span>
                    <span className="text-[11px] font-extrabold font-mono text-purple-900">{item.potassium_mg || '—'}</span>
                  </div>
                  {/* Phosphorus (P) */}
                  <div className="bg-teal-50 px-2 py-1.5 rounded-lg border border-teal-100 min-w-[56px]">
                    <span className="block text-[9px] text-teal-700 font-bold uppercase">Ph</span>
                    <span className="text-[11px] font-extrabold font-mono text-teal-900">{item.phosphorus_mg || '—'}</span>
                  </div>
                  {/* Sodium (Na) */}
                  <div className="bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100 min-w-[56px]">
                    <span className="block text-[9px] text-blue-700 font-bold uppercase">Na</span>
                    <span className="text-[11px] font-extrabold font-mono text-blue-900">{item.sodium_mg || '—'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-2xs inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.viewDetails}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {searchResults.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-2">
            <Utensils className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-neutral-800 text-sm">{t.noResults}</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {t.tryDifferentSearch}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
