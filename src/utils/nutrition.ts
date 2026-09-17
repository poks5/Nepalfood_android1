// Helper functions for nutritional scaling and format

export function calculateServing(originalVal: string | undefined | null, grams: number): string {
  if (!originalVal) return '—';
  const trimmed = originalVal.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '—') return '—';
  
  // Non-numeric special notations in Food Composition Tables
  const upper = trimmed.toUpperCase();
  if (upper === 'ND' || upper === 'TR' || upper === 'NA' || upper === 'N/A') {
    return trimmed;
  }

  const num = parseFloat(trimmed);
  if (isNaN(num)) {
    return trimmed;
  }

  // Linear scaling from standard 100g basis
  const scaled = (num * grams) / 100;

  // Format nicely: for large numbers (e.g., energy > 10) 1 decimal, for small numbers (e.g., trace minerals) 2 decimals
  if (scaled >= 100) {
    return scaled.toFixed(1).replace(/\.0$/, '');
  } else if (scaled >= 1) {
    return Number(scaled.toFixed(2)).toString();
  } else {
    return Number(scaled.toFixed(3)).toString();
  }
}

export interface CategoryMeta {
  key: string;
  nameEn: string;
  nameNe: string;
  emoji: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  aliases?: string[];
}

export const CANONICAL_CATEGORIES: CategoryMeta[] = [
  {
    key: 'cereals',
    nameEn: 'Cereals & Pseudocereals',
    nameNe: 'अन्न तथा कोदो बाली',
    emoji: '🍚',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    aliases: ['CEREALS AND PSEUDOCEREALS', 'CEREAL & CEREAL PRODUCT', 'A(1). INSTANT SEASONED NOODLES']
  },
  {
    key: 'legumes',
    nameEn: 'Beans & Legumes',
    nameNe: 'दाल तथा गेडागुडी',
    emoji: '🫘',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-200',
    aliases: ['LEGUMES AND PULSES', 'PULSES & LEGUMES']
  },
  {
    key: 'tubers',
    nameEn: 'Potatoes & Tubers',
    nameNe: 'आलु तथा कन्दमूल',
    emoji: '🥔',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-200',
    aliases: ['POTATO AND TUBERS', 'ROOTS AND TUBERS']
  },
  {
    key: 'fruits',
    nameEn: 'Fruits',
    nameNe: 'फलफूल',
    emoji: '🍎',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
    borderClass: 'border-rose-200',
    aliases: ['FRUITS']
  },
  {
    key: 'vegetables',
    nameEn: 'Vegetables',
    nameNe: 'तरकारीहरू',
    emoji: '🥬',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    aliases: ['VEGETABLES', 'GREEN LEAFY VEGETABLES', 'OTHER VEGETABLES', 'VEGETABLES PRODUCT']
  },
  {
    key: 'dairy',
    nameEn: 'Milk & Dairy',
    nameNe: 'दूध तथा दुग्धजन्य',
    emoji: '🥛',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
    aliases: ['MILK & MILK PRODUCTS']
  },
  {
    key: 'meat',
    nameEn: 'Meat & Eggs',
    nameNe: 'मासु तथा अण्डा',
    emoji: '🥩',
    bgClass: 'bg-red-50',
    textClass: 'text-red-800',
    borderClass: 'border-red-200',
    aliases: ['MEAT & MEAT PRODUCTS', 'EGG']
  },
  {
    key: 'fish',
    nameEn: 'Fish & Aquatic Foods',
    nameNe: 'माछा',
    emoji: '🐟',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-800',
    borderClass: 'border-cyan-200',
    aliases: ['FISH & FISH PRODUCTS']
  },
  {
    key: 'spices',
    nameEn: 'Spices & Condiments',
    nameNe: 'मसला तथा सुगन्धित द्रव्य',
    emoji: '🌶️',
    bgClass: 'bg-lime-50',
    textClass: 'text-lime-800',
    borderClass: 'border-lime-200',
    aliases: ['CONDIMENTS AND SPICES']
  },
  {
    key: 'nuts_oils',
    nameEn: 'Nuts, Seeds & Oils',
    nameNe: 'गेडागुडी तथा तेलहन',
    emoji: '🥜',
    bgClass: 'bg-stone-50',
    textClass: 'text-stone-800',
    borderClass: 'border-stone-200',
    aliases: ['NUTS & OILSEEDS', 'FATS & EDIBLE OILS']
  },
  {
    key: 'cooked',
    nameEn: 'Cooked & Traditional Foods',
    nameNe: 'परम्परागत तथा अन्य परिकार',
    emoji: '🍲',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-200',
    aliases: ['COOKED FOOD', 'WEANING FOODS', 'WILD EDIBLE FOOD', 'SUPPLEMENTARY FOOD', 'MISCELLANEOUS FOODS']
  }
];

export const CATEGORIES: Record<string, CategoryMeta> = {
  // Canonical keys
  cereals: CANONICAL_CATEGORIES[0],
  legumes: CANONICAL_CATEGORIES[1],
  tubers: CANONICAL_CATEGORIES[2],
  fruits: CANONICAL_CATEGORIES[3],
  vegetables: CANONICAL_CATEGORIES[4],
  dairy: CANONICAL_CATEGORIES[5],
  meat: CANONICAL_CATEGORIES[6],
  fish: CANONICAL_CATEGORIES[7],
  spices: CANONICAL_CATEGORIES[8],
  nuts_oils: CANONICAL_CATEGORIES[9],
  cooked: CANONICAL_CATEGORIES[10],

  // 2024 NARC exact keys
  'Cereals and Pseudocereals': CANONICAL_CATEGORIES[0],
  'Legumes and Pulses': CANONICAL_CATEGORIES[1],
  'Potato and Tubers': CANONICAL_CATEGORIES[2],
  'Fruits': CANONICAL_CATEGORIES[3],
  'Vegetables': CANONICAL_CATEGORIES[4],

  // 2012 DFTQC exact keys
  'CEREAL & CEREAL PRODUCT': {
    key: 'CEREAL & CEREAL PRODUCT',
    nameEn: 'Cereal & Cereal Products',
    nameNe: 'अन्न तथा खाद्यान्न परिकार',
    emoji: '🌾',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200'
  },
  'PULSES & LEGUMES': {
    key: 'PULSES & LEGUMES',
    nameEn: 'Pulses & Legumes',
    nameNe: 'दाल तथा गेडागुडी',
    emoji: '🫘',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-200'
  },
  'GREEN LEAFY VEGETABLES': {
    key: 'GREEN LEAFY VEGETABLES',
    nameEn: 'Green Leafy Vegetables',
    nameNe: 'हरियो सागपात',
    emoji: '🥬',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200'
  },
  'OTHER VEGETABLES': {
    key: 'OTHER VEGETABLES',
    nameEn: 'Other Vegetables',
    nameNe: 'अन्य तरकारीहरू',
    emoji: '🥕',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-800',
    borderClass: 'border-teal-200'
  },
  'ROOTS AND TUBERS': {
    key: 'ROOTS AND TUBERS',
    nameEn: 'Roots & Tubers',
    nameNe: 'कन्दमूल तथा जरा बाली',
    emoji: '🥔',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-200'
  },
  'FRUITS': {
    key: 'FRUITS',
    nameEn: 'Fruits',
    nameNe: 'फलफूलहरू',
    emoji: '🍎',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
    borderClass: 'border-rose-200'
  },
  'CONDIMENTS AND SPICES': {
    key: 'CONDIMENTS AND SPICES',
    nameEn: 'Condiments & Spices',
    nameNe: 'मसला तथा सुगन्धित द्रव्य',
    emoji: '🌶️',
    bgClass: 'bg-red-50',
    textClass: 'text-red-800',
    borderClass: 'border-red-200'
  },
  'MEAT & MEAT PRODUCTS': {
    key: 'MEAT & MEAT PRODUCTS',
    nameEn: 'Meat & Meat Products',
    nameNe: 'मासु तथा मासुका परिकार',
    emoji: '🥩',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
    borderClass: 'border-rose-200'
  },
  'EGG': {
    key: 'EGG',
    nameEn: 'Egg',
    nameNe: 'अण्डा',
    emoji: '🥚',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200'
  },
  'MILK & MILK PRODUCTS': {
    key: 'MILK & MILK PRODUCTS',
    nameEn: 'Milk & Dairy Products',
    nameNe: 'दूध तथा दुग्धजन्य पदार्थ',
    emoji: '🥛',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200'
  },
  'COOKED FOOD': {
    key: 'COOKED FOOD',
    nameEn: 'Cooked Dishes',
    nameNe: 'पकाइएका परिकारहरू',
    emoji: '🍲',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-800',
    borderClass: 'border-indigo-200'
  },
  'A(1). INSTANT SEASONED NOODLES': {
    key: 'A(1). INSTANT SEASONED NOODLES',
    nameEn: 'Instant Seasoned Noodles',
    nameNe: 'चाउचाउ / तयारी नुडल्स',
    emoji: '🍜',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200'
  },
  'VEGETABLES PRODUCT': {
    key: 'VEGETABLES PRODUCT',
    nameEn: 'Vegetable Products',
    nameNe: 'तरकारीका परिकारहरू',
    emoji: '🥒',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200'
  },
  'NUTS & OILSEEDS': {
    key: 'NUTS & OILSEEDS',
    nameEn: 'Nuts & Oilseeds',
    nameNe: 'गेडागुडी तथा तेलहन',
    emoji: '🥜',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200'
  },
  'FISH & FISH PRODUCTS': {
    key: 'FISH & FISH PRODUCTS',
    nameEn: 'Fish & Products',
    nameNe: 'माछा तथा माछाका परिकार',
    emoji: '🐟',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-800',
    borderClass: 'border-cyan-200'
  },
  'FATS & EDIBLE OILS': {
    key: 'FATS & EDIBLE OILS',
    nameEn: 'Fats & Edible Oils',
    nameNe: 'घिउ तथा खाने तेल',
    emoji: '🧈',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-200'
  },
  'MISCELLANEOUS FOODS': {
    key: 'MISCELLANEOUS FOODS',
    nameEn: 'Miscellaneous Foods',
    nameNe: 'विविध खाद्य पदार्थ',
    emoji: '🍽️',
    bgClass: 'bg-neutral-50',
    textClass: 'text-neutral-800',
    borderClass: 'border-neutral-200'
  },
  'WEANING FOODS': {
    key: 'WEANING FOODS',
    nameEn: 'Weaning Foods (Child Nutrition)',
    nameNe: 'शिशु आहार / लित्तो',
    emoji: '🥣',
    bgClass: 'bg-pink-50',
    textClass: 'text-pink-800',
    borderClass: 'border-pink-200'
  },
  'WILD EDIBLE FOOD': {
    key: 'WILD EDIBLE FOOD',
    nameEn: 'Wild Edible Foods',
    nameNe: 'जङ्गली कन्दमूल र सागपात',
    emoji: '🌿',
    bgClass: 'bg-lime-50',
    textClass: 'text-lime-800',
    borderClass: 'border-lime-200'
  },
  'SUPPLEMENTARY FOOD': {
    key: 'SUPPLEMENTARY FOOD',
    nameEn: 'Supplementary Foods',
    nameNe: 'पूरक पोषणयुक्त आहार',
    emoji: '🍱',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-800',
    borderClass: 'border-violet-200'
  }
};

export function getCategoryMeta(groupName: string): CategoryMeta {
  if (CATEGORIES[groupName]) {
    return CATEGORIES[groupName];
  }
  const upper = groupName.toUpperCase();
  for (const cat of CANONICAL_CATEGORIES) {
    if (cat.aliases?.includes(upper)) {
      return cat;
    }
  }
  return {
    key: groupName,
    nameEn: groupName,
    nameNe: groupName,
    emoji: '🥗',
    bgClass: 'bg-neutral-50',
    textClass: 'text-neutral-800',
    borderClass: 'border-neutral-200'
  };
}

export function isFoodInCategory(foodGroup: string | undefined, categoryKey: string): boolean {
  if (!foodGroup || categoryKey === 'ALL') return true;
  if (foodGroup === categoryKey) return true;

  // Check canonical category aliases
  const canonical = CANONICAL_CATEGORIES.find((c) => c.key === categoryKey);
  if (canonical && canonical.aliases) {
    return canonical.aliases.includes(foodGroup.toUpperCase());
  }

  // Also check if categoryKey is a group with aliases
  const meta = CATEGORIES[categoryKey];
  if (meta && meta.aliases) {
    return meta.aliases.includes(foodGroup.toUpperCase());
  }

  return foodGroup.toLowerCase() === categoryKey.toLowerCase();
}

const FAVORITES_KEY = 'khana_sathi_favorites';

export function getFavorites(): string[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(foodId: string): boolean {
  try {
    const current = getFavorites();
    let updated: string[];
    let added = false;
    if (current.includes(foodId)) {
      updated = current.filter((id) => id !== foodId);
    } else {
      updated = [...current, foodId];
      added = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return added;
  } catch {
    return false;
  }
}

export function isFavorite(foodId: string): boolean {
  return getFavorites().includes(foodId);
}
