import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a state for the year filter
state_import = "import React, { useState, useEffect } from 'react';"
new_state_import = "import React, { useState, useEffect, useMemo } from 'react';"
content = content.replace(state_import, new_state_import)

state_vars = """  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);"""

new_state_vars = """  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [filterYear, setFilterYear] = useState<string>('ALL'); // 'ALL', '2024', '2012'"""

content = content.replace(state_vars, new_state_vars)

# Create a filtered list of foods based on the year filter
data_load = """  // Load verified datasets
  const foods: FoodMasterItem[] = dbData.master as FoodMasterItem[];
  const photos: FoodPhotoItem[] = dbData.photos as FoodPhotoItem[];"""

new_data_load = """  // Load verified datasets
  const allFoods: FoodMasterItem[] = dbData.master as FoodMasterItem[];
  const photos: FoodPhotoItem[] = dbData.photos as FoodPhotoItem[];

  const foods = useMemo(() => {
    if (filterYear === 'ALL') return allFoods;
    return allFoods.filter(f => f.source_year === filterYear);
  }, [allFoods, filterYear]);"""

content = content.replace(data_load, new_data_load)

# Add the filter UI to the Header props
header_tag = """      <Header
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={handleNavSelect}
        favoritesCount={favoriteIds.length}
      />"""

new_header_tag = """      <Header
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={handleNavSelect}
        favoritesCount={favoriteIds.length}
        filterYear={filterYear}
        onFilterYearChange={setFilterYear}
      />"""

content = content.replace(header_tag, new_header_tag)

with open('src/App.tsx', 'w') as f:
    f.write(content)
