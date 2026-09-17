import React, { useMemo } from 'react';
import { Heart, UtensilsCrossed } from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language, NavTab } from '../types';
import { FoodCard } from './FoodCard';
import { translations } from '../i18n';

interface FavoritesScreenProps {
  foods: FoodMasterItem[];
  photos: FoodPhotoItem[];
  lang: Language;
  favoriteIds: string[];
  onSelectFood: (food: FoodMasterItem) => void;
  onToggleFavorite: (foodId: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  foods,
  photos,
  lang,
  favoriteIds,
  onSelectFood,
  onToggleFavorite,
  onNavigate,
}) => {
  const t = translations[lang];

  const photoMap = useMemo(() => {
    const map = new Map<string, FoodPhotoItem>();
    photos.forEach((p) => map.set(p.food_id, p));
    return map;
  }, [photos]);

  const favoriteFoods = useMemo(() => {
    return foods.filter((f) => favoriteIds.includes(f.food_id));
  }, [foods, favoriteIds]);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span>{t.favoritesTitle}</span>
          </h1>
          <p className="text-xs text-neutral-500">
            {favoriteFoods.length} {lang === 'ne' ? 'सुरक्षित गरिएका खानाहरू' : 'saved items'}
          </p>
        </div>
      </div>

      {favoriteFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteFoods.map((food) => (
            <FoodCard
              key={food.food_id}
              food={food}
              photo={photoMap.get(food.food_id)}
              lang={lang}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectFood}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-neutral-800 text-sm">{t.favoritesEmpty}</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {t.favoritesHint}
          </p>
          <button
            onClick={() => onNavigate('foods')}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{t.exploreFoods}</span>
          </button>
        </div>
      )}
    </div>
  );
};
