import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Info, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  Droplet, 
  Zap, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language } from '../types';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { calculateServing, getCategoryMeta } from '../utils/nutrition';
import { translations } from '../i18n';

interface FoodDetailViewProps {
  food: FoodMasterItem;
  photo?: FoodPhotoItem;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (foodId: string) => void;
  onBack: () => void;
}

export const FoodDetailView: React.FC<FoodDetailViewProps> = ({
  food,
  photo,
  lang,
  isFavorite,
  onToggleFavorite,
  onBack,
}) => {
  const t = translations[lang];
  const [servingGrams, setServingGrams] = useState<number>(100);
  const [customServingInput, setCustomServingInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [showSource, setShowSource] = useState<boolean>(false);

  const cat = getCategoryMeta(food.food_group);

  const predefinedServings = [25, 50, 100, 150, 200];

  const handleSelectServing = (grams: number) => {
    setServingGrams(grams);
    setIsCustomMode(false);
    setCustomServingInput('');
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomServingInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 5000) {
      setServingGrams(parsed);
      setIsCustomMode(true);
    }
  };

  // Full Nutritional Composition table items (per 100g source)
  const fullNutrients = [
    { label: t.energy, key: 'energy_kcal', unit: 'kcal', value: food.energy_kcal, highlight: false },
    { label: t.protein, key: 'protein_g', unit: 'g', value: food.protein_g, highlight: true },
    { label: t.fat, key: 'fat_g', unit: 'g', value: food.fat_g, highlight: false },
    { label: t.carbohydrate, key: 'carbohydrate_g', unit: 'g', value: food.carbohydrate_g, highlight: false },
    { label: t.crudeFiber, key: 'crude_fiber_g', unit: 'g', value: food.crude_fiber_g, highlight: false },
    { label: t.water, key: 'water_g', unit: 'g', value: food.water_g, highlight: true },
    { label: t.ash, key: 'ash_g', unit: 'g', value: food.ash_g, highlight: false },
    { label: t.calcium, key: 'calcium_mg', unit: 'mg', value: food.calcium_mg, highlight: false },
    { label: t.iron, key: 'iron_mg', unit: 'mg', value: food.iron_mg, highlight: false },
    { label: t.phosphorus, key: 'phosphorus_mg', unit: 'mg', value: food.phosphorus_mg, highlight: true },
    { label: t.potassium, key: 'potassium_mg', unit: 'mg', value: food.potassium_mg, highlight: true },
    { label: t.sodium, key: 'sodium_mg', unit: 'mg', value: food.sodium_mg, highlight: true },
    { label: t.zinc, key: 'zinc_mg', unit: 'mg', value: food.zinc_mg, highlight: false },
    { label: t.vitaminC, key: 'vitamin_c_mg', unit: 'mg', value: food.vitamin_c_mg, highlight: false },
    { label: t.totalCarotenoids, key: 'total_carotenoids_ug', unit: 'µg', value: food.total_carotenoids_ug, highlight: false },
  ];

  // Kidney nutrients specifically highlighted
  const kidneyNutrientList = [
    {
      name: t.potassium,
      symbol: 'K',
      raw: food.potassium_mg,
      unit: 'mg',
      color: 'border-purple-200 bg-purple-50/60 text-purple-900',
      badge: 'bg-purple-100 text-purple-800'
    },
    {
      name: t.phosphorus,
      symbol: 'P',
      raw: food.phosphorus_mg,
      unit: 'mg',
      color: 'border-teal-200 bg-teal-50/60 text-teal-900',
      badge: 'bg-teal-100 text-teal-800'
    },
    {
      name: t.sodium,
      symbol: 'Na',
      raw: food.sodium_mg,
      unit: 'mg',
      color: 'border-blue-200 bg-blue-50/60 text-blue-900',
      badge: 'bg-blue-100 text-blue-800'
    },
    {
      name: t.protein,
      symbol: 'Prot',
      raw: food.protein_g,
      unit: 'g',
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
      badge: 'bg-amber-100 text-amber-800'
    },
    {
      name: t.water,
      symbol: 'H2O',
      raw: food.water_g,
      unit: 'g',
      color: 'border-sky-200 bg-sky-50/60 text-sky-900',
      badge: 'bg-sky-100 text-sky-800'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Detail Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(food.food_id)}
              className={`p-2 rounded-lg transition-all ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title={isFavorite ? t.removedFromFavorites : t.savedToFavorites}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        {/* Food Photograph Area */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs p-3 sm:p-4">
          <PhotoPlaceholder
            foodName={food.food_name_original}
            foodGroup={food.food_group}
            photoInfo={photo}
            size="lg"
          />

          {/* Heading info */}
          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                {food.food_id}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${cat.bgClass} ${cat.textClass} ${cat.borderClass}`}>
                <span>{cat.emoji}</span>
                <span>{food.food_group}</span>
              </span>
              {food.food_subgroup && (
                <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  {food.food_subgroup}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {food.food_name_original}
            </h1>
            <p className="text-sm italic text-neutral-600 font-serif mt-0.5">
              {food.scientific_name}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-neutral-100 text-xs">
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                {t.variety}
              </span>
              <span className="font-semibold text-neutral-800 mt-0.5 block">
                {food.variety_name || '—'}
              </span>
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                {t.collectionArea}
              </span>
              <span className="font-semibold text-neutral-800 mt-0.5 block">
                {[food.collection_area, food.district, food.province].filter(Boolean).join(', ') || '—'}
              </span>
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                {t.foodState}
              </span>
              <span className="font-semibold text-neutral-800 mt-0.5 block">
                {food.food_state || 'Raw'}
              </span>
            </div>

            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                {t.ediblePortion}
              </span>
              <span className="font-semibold text-neutral-800 mt-0.5 block">
                {food.edible_part_percent ? `${food.edible_part_percent}%` : '100%'}
              </span>
            </div>
          </div>
        </section>

        {/* Serving Size Selector */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                {t.servingSize}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {servingGrams} {t.grams}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {predefinedServings.map((g) => {
              const active = servingGrams === g && !isCustomMode;
              return (
                <button
                  key={g}
                  onClick={() => handleSelectServing(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 border border-neutral-200/60'
                  }`}
                >
                  {g} {t.grams}
                </button>
              );
            })}

            {/* Custom Input */}
            <div className="relative inline-flex items-center">
              <input
                type="number"
                min="1"
                max="2000"
                value={customServingInput}
                onChange={handleCustomInputChange}
                placeholder={t.customServing}
                className={`w-28 px-3 py-1.5 text-xs rounded-xl border font-mono transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  isCustomMode
                    ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-900'
                    : 'border-neutral-300 bg-white text-neutral-700'
                }`}
              />
              <span className="absolute right-2.5 text-[10px] text-neutral-400 font-medium pointer-events-none">
                {t.grams}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 italic mt-2">
            ℹ️ {t.sourceValuesNote}
          </p>
        </section>

        {/* Kidney-Monitored Nutrients Spotlight */}
        <section className="bg-white rounded-2xl border border-purple-200/80 p-4 sm:p-5 shadow-xs">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {t.kidneyNutrientsTitle}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t.kidneyNutrientsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {kidneyNutrientList.map((item) => {
              const scaledVal = calculateServing(item.raw, servingGrams);
              return (
                <div
                  key={item.symbol}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${item.color}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">
                      {item.name}
                    </span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${item.badge}`}>
                      {item.symbol}
                    </span>
                  </div>
                  <div>
                    <span className="text-lg font-black font-mono tracking-tight text-neutral-900">
                      {scaledVal}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-500 ml-1">
                      {item.unit}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 font-mono">
                    per {servingGrams}g
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-[11px] text-neutral-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <p>{t.kidneyDisclaimer}</p>
          </div>
        </section>

        {/* Nutritional Composition Full Table */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              {t.nutritionComposition}
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              Basis: {servingGrams} {t.grams}
            </span>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {fullNutrients.map((n) => {
              const scaled = calculateServing(n.value, servingGrams);
              return (
                <div
                  key={n.key}
                  className={`py-2 px-1 flex items-center justify-between ${
                    n.highlight ? 'bg-neutral-50/70 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-700">{n.label}</span>
                    {n.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="font-mono text-right">
                    <span className="font-bold text-neutral-900 text-sm">
                      {scaled}
                    </span>
                    <span className="text-[10px] text-neutral-500 ml-1.5">
                      {n.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Expandable Source / Reference Section */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs">
          <button
            onClick={() => setShowSource(!showSource)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-neutral-900">
                  {t.sourceInfo}
                </h2>
                <p className="text-[11px] text-neutral-500">
                  {t.sourceDoc} &bull; NARC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <span>{showSource ? t.hideSource : t.viewSource}</span>
              {showSource ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showSource && (
            <div className="p-4 pt-1 bg-neutral-50/70 border-t border-neutral-100 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                    {t.source} Document
                  </span>
                  <span className="font-bold text-neutral-900 mt-0.5 block">
                    {food.source_document || 'Nepal Food Composition Database'} ({food.source_year || '2024'})
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {t.sourcePublisher}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-200/70 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t.sourcePage}:</span>
                    <span className="font-mono font-bold text-neutral-800">{food.source_page || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t.sourceTable}:</span>
                    <span className="font-mono font-bold text-neutral-800">{food.source_table || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t.sourceFigure}:</span>
                    <span className="font-mono font-bold text-neutral-800">{food.source_figure || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t.confidence}:</span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {food.extraction_confidence || 'HIGH'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked photo citation if present */}
              {photo && (
                <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-sky-900 mb-1">
                    <span>Mapped Photograph Citation: {photo.figure_number}</span>
                    <span className="font-mono">PDF Page {photo.pdf_page}</span>
                  </div>
                  <p className="text-neutral-700 text-xs italic">
                    "{photo.figure_caption}"
                  </p>
                  <p className="text-neutral-500 text-[11px] mt-1">
                    Description: {photo.image_description}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
