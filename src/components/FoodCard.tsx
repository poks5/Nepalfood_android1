import React from 'react';
import { Heart, ChevronRight, Zap, Droplet } from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language } from '../types';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { translations } from '../i18n';

interface FoodCardProps {
  food: FoodMasterItem;
  photo?: FoodPhotoItem;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (foodId: string) => void;
  onSelect: (food: FoodMasterItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  photo,
  lang,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const t = translations[lang];

  return (
    <div
      onClick={() => onSelect(food)}
      className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Media Area with Heart Button */}
      <div className="relative">
        <PhotoPlaceholder
          foodName={food.food_name_original}
          foodGroup={food.food_group}
          photoInfo={photo}
          size="md"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.food_id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-sm scale-105'
              : 'bg-white/90 text-neutral-400 hover:text-rose-500 hover:bg-white shadow-2xs'
          }`}
          title={isFavorite ? t.removedFromFavorites : t.savedToFavorites}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Food ID & Year pill */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
          <span className="font-mono text-[9px] font-bold bg-neutral-900/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded shadow-2xs">
            {food.food_id}
          </span>
          {food.source_year && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs ${
                food.source_year === '2024'
                  ? 'bg-emerald-600/80 text-white'
                  : 'bg-amber-600/80 text-white'
              }`}
            >
              {food.source_year}
            </span>
          )}
        </div>
      </div>

      {/* Body Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1">
              {food.food_name_original}
            </h3>
          </div>

          {/* Variety & Scientific Name */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mb-3">
            {food.variety_name ? (
              <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                {food.variety_name}
              </span>
            ) : null}
            <span className="italic text-[11px] truncate max-w-[180px]">
              {food.scientific_name}
            </span>
          </div>

          {/* Key Nutrients Grid (Factual per 100g) */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-50/80 rounded-xl p-2.5 border border-neutral-100 mb-3 text-xs">
            {/* Energy */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] text-neutral-400 font-medium">
                  {t.energy}
                </span>
                <span className="font-bold text-neutral-800 font-mono text-[11px]">
                  {food.energy_kcal || '—'} <span className="text-[9px] font-normal text-neutral-500">kcal</span>
                </span>
              </div>
            </div>

            {/* Protein */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">P</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] text-neutral-400 font-medium">
                  {t.protein}
                </span>
                <span className="font-bold text-neutral-800 font-mono text-[11px]">
                  {food.protein_g || '—'} <span className="text-[9px] font-normal text-neutral-500">g</span>
                </span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">K</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] text-neutral-400 font-medium">
                  {t.potassium}
                </span>
                <span className="font-bold text-neutral-800 font-mono text-[11px]">
                  {food.potassium_mg || '—'} <span className="text-[9px] font-normal text-neutral-500">mg</span>
                </span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">Ph</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] text-neutral-400 font-medium">
                  {t.phosphorus}
                </span>
                <span className="font-bold text-neutral-800 font-mono text-[11px]">
                  {food.phosphorus_mg || '—'} <span className="text-[9px] font-normal text-neutral-500">mg</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 group-hover:bg-emerald-600 text-neutral-700 group-hover:text-white font-semibold text-xs transition-colors"
        >
          <span>{t.viewDetails}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
