import React, { useState, useEffect, useMemo } from 'react';
import dbData from './data/database.json';
import { FoodMasterItem, FoodPhotoItem, Language, NavTab } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { FoodsScreen } from './components/FoodsScreen';
import { SearchScreen } from './components/SearchScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { MoreScreen } from './components/MoreScreen';
import { DataTableScreen } from './components/DataTableScreen';
import { FoodDetailView } from './components/FoodDetailView';
import { getFavorites, toggleFavorite } from './utils/nutrition';

export default function App() {
  const [lang, setLang] = useState<Language>('ne');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedFood, setSelectedFood] = useState<FoodMasterItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [filterYear, setFilterYear] = useState<string>('ALL'); // 'ALL', '2024', '2012'

  // Load verified datasets
  const allFoods: FoodMasterItem[] = dbData.master as FoodMasterItem[];
  const photos: FoodPhotoItem[] = dbData.photos as FoodPhotoItem[];

  const foods = useMemo(() => {
    if (filterYear === 'ALL') return allFoods;
    return allFoods.filter(f => f.source_year === filterYear);
  }, [allFoods, filterYear]);

  // Initialize favorites from localStorage
  useEffect(() => {
    setFavoriteIds(getFavorites());
  }, []);

  const handleToggleFavorite = (foodId: string) => {
    toggleFavorite(foodId);
    setFavoriteIds(getFavorites());
  };

  const isFavorite = (foodId: string) => {
    return favoriteIds.includes(foodId);
  };

  const handleSelectFood = (food: FoodMasterItem) => {
    setSelectedFood(food);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedFood(null);
  };

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setActiveTab('foods');
    setSelectedFood(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeSearchSubmit = (query: string) => {
    setSearchInitialQuery(query);
    setActiveTab('search');
    setSelectedFood(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedFood(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find photo mapping for a food
  const getPhotoForFood = (foodId: string) => {
    return photos.find((p) => p.food_id === foodId);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={handleNavSelect}
        favoritesCount={favoriteIds.length}
        filterYear={filterYear}
        onFilterYearChange={setFilterYear}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4">
        {selectedFood ? (
          <FoodDetailView
            food={selectedFood}
            photo={getPhotoForFood(selectedFood.food_id)}
            lang={lang}
            isFavorite={isFavorite(selectedFood.food_id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={handleBackFromDetail}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                foods={foods}
                photos={photos}
                lang={lang}
                onSelectFood={handleSelectFood}
                onSelectCategory={handleCategorySelect}
                onNavigate={handleNavSelect}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onSearchSubmit={handleHomeSearchSubmit}
              />
            )}

            {activeTab === 'foods' && (
              <FoodsScreen
                foods={foods}
                allFoods={allFoods}
                photos={photos}
                lang={lang}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectFood={handleSelectFood}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                filterYear={filterYear}
                onFilterYearChange={setFilterYear}
                onOpenTable={() => handleNavSelect('table')}
              />
            )}

            {activeTab === 'table' && (
              <DataTableScreen
                foods={allFoods}
                lang={lang}
                onSelectFood={handleSelectFood}
                activeEdition={filterYear}
                onEditionChange={setFilterYear}
              />
            )}

            {activeTab === 'search' && (
              <SearchScreen
                foods={foods}
                photos={photos}
                lang={lang}
                initialQuery={searchInitialQuery}
                onSelectFood={handleSelectFood}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesScreen
                foods={foods}
                photos={photos}
                lang={lang}
                favoriteIds={favoriteIds}
                onSelectFood={handleSelectFood}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={handleNavSelect}
              />
            )}

            {activeTab === 'more' && (
              <MoreScreen
                foods={foods}
                photos={photos}
                lang={lang}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden when in FoodDetailView for maximum focus) */}
      {!selectedFood && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleNavSelect}
          lang={lang}
          favoritesCount={favoriteIds.length}
        />
      )}
    </div>
  );
}
