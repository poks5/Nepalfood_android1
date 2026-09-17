import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Eye, 
  Sparkles,
  Layers,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { FoodMasterItem, Language } from '../types';
import { translations } from '../i18n';

interface DataTableScreenProps {
  foods: FoodMasterItem[];
  lang: Language;
  onSelectFood: (food: FoodMasterItem) => void;
  activeEdition?: string; // 'ALL' | '2024' | '2012'
  onEditionChange?: (edition: string) => void;
}

export const DataTableScreen: React.FC<DataTableScreenProps> = ({
  foods,
  lang,
  onSelectFood,
  activeEdition = 'ALL',
  onEditionChange,
}) => {
  const t = translations[lang];

  // Local edition tab if not managed externally
  const [currentTab, setCurrentTab] = useState<'ALL' | '2024' | '2012'>(
    (activeEdition as 'ALL' | '2024' | '2012') || 'ALL'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof FoodMasterItem | 'default'>('default');
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Synchronize when activeEdition prop changes
  const handleTabChange = (edition: 'ALL' | '2024' | '2012') => {
    setCurrentTab(edition);
    setSelectedGroup('ALL');
    setCurrentPage(1);
    if (onEditionChange) {
      onEditionChange(edition);
    }
  };

  // Base list filtered by selected edition tab
  const editionFoods = useMemo(() => {
    if (currentTab === '2024') {
      return foods.filter((f) => f.source_year === '2024');
    }
    if (currentTab === '2012') {
      return foods.filter((f) => f.source_year === '2012');
    }
    return foods;
  }, [foods, currentTab]);

  // Distinct groups for currently selected edition
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    editionFoods.forEach((f) => {
      if (f.food_group) groups.add(f.food_group);
    });
    return Array.from(groups).sort();
  }, [editionFoods]);

  // Filtered and sorted dataset
  const filteredFoods = useMemo(() => {
    let list = editionFoods.filter((f) => {
      // Group filter
      if (selectedGroup !== 'ALL' && f.food_group !== selectedGroup) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = f.food_name_original?.toLowerCase().includes(q);
        const matchesId = f.food_id?.toLowerCase().includes(q);
        const matchesScientific = f.scientific_name?.toLowerCase().includes(q);
        const matchesVariety = f.variety_name?.toLowerCase().includes(q);
        const matchesGroup = f.food_group?.toLowerCase().includes(q);
        const matchesDistrict = f.district?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesScientific && !matchesVariety && !matchesGroup && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortField !== 'default') {
      list = [...list].sort((a, b) => {
        const valA = parseFloat(a[sortField] as string);
        const valB = parseFloat(b[sortField] as string);
        
        if (!isNaN(valA) && !isNaN(valB)) {
          return sortAsc ? valA - valB : valB - valA;
        }
        
        const strA = String(a[sortField] || '');
        const strB = String(b[sortField] || '');
        return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return list;
  }, [editionFoods, selectedGroup, searchQuery, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredFoods.length / pageSize);
  const displayedFoods = useMemo(() => {
    if (pageSize === -1) return filteredFoods;
    const start = (currentPage - 1) * pageSize;
    return filteredFoods.slice(start, start + pageSize);
  }, [filteredFoods, currentPage, pageSize]);

  // Handle column sort toggle
  const toggleSort = (field: keyof FoodMasterItem) => {
    if (sortField === field) {
      if (!sortAsc) {
        setSortAsc(true);
      } else {
        setSortField('default');
        setSortAsc(false);
      }
    } else {
      setSortField(field);
      setSortAsc(false); // Default to descending (high to low)
    }
  };

  // CSV Exporter with UTF-8 BOM for Microsoft Excel compatibility
  const handleExportCSV = (targetEdition: '2024' | '2012' | 'ALL' | 'CURRENT') => {
    let dataToExport: FoodMasterItem[] = [];
    let filename = '';

    if (targetEdition === '2024') {
      dataToExport = foods.filter((f) => f.source_year === '2024');
      filename = 'Nepal_Food_Database_2024_Edition.csv';
    } else if (targetEdition === '2012') {
      dataToExport = foods.filter((f) => f.source_year === '2012');
      filename = 'Nepal_Food_Database_2012_Edition.csv';
    } else if (targetEdition === 'ALL') {
      dataToExport = foods;
      filename = 'Nepal_Food_Database_Combined_644.csv';
    } else {
      dataToExport = filteredFoods;
      filename = `Nepal_Food_Database_Filtered_${currentTab}_${filteredFoods.length}rows.csv`;
    }

    if (dataToExport.length === 0) return;

    const headers = Object.keys(dataToExport[0]);
    const csvRows = [
      headers.join(','),
      ...dataToExport.map((row) =>
        headers
          .map((h) => {
            const cell = (row as any)[h] ?? '';
            return `"${String(cell).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 without mangling characters
    const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${dataToExport.length} rows to ${filename}`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // JSON Exporter
  const handleExportJSON = (targetEdition: '2024' | '2012' | 'ALL') => {
    let dataToExport: FoodMasterItem[] = [];
    let filename = '';

    if (targetEdition === '2024') {
      dataToExport = foods.filter((f) => f.source_year === '2024');
      filename = 'nepal_food_database_2024.json';
    } else if (targetEdition === '2012') {
      dataToExport = foods.filter((f) => f.source_year === '2012');
      filename = 'nepal_food_database_2012.json';
    } else {
      dataToExport = foods;
      filename = 'nepal_food_database_combined.json';
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported JSON file (${dataToExport.length} records)`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const count2024 = foods.filter((f) => f.source_year === '2024').length;
  const count2012 = foods.filter((f) => f.source_year === '2012').length;

  return (
    <div className="space-y-4 pb-28">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {t.dataTableTitle}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
              {t.dataTableSubtitle}
            </p>
          </div>

          {/* Export Toolbar Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExportCSV(currentTab)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors"
              title="Download filtered CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {currentTab === 'ALL' ? 'All (644)' : currentTab} CSV</span>
            </button>

            <button
              onClick={() => handleExportJSON(currentTab)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold border border-neutral-200 transition-colors"
              title="Download JSON format"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Success toast / notice */}
        {exportNotice && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Clear Edition Segregation Tabs */}
        <div className="mt-5 border-t border-neutral-100 pt-4">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.segregationNotice}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 2024 Edition Tab */}
            <button
              onClick={() => handleTabChange('2024')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                currentTab === '2024'
                  ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-black text-neutral-900">
                    2024 NARC Edition
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  National Food Research Centre (100 foods)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black shrink-0">
                {count2024}
              </span>
            </button>

            {/* 2012 Edition Tab */}
            <button
              onClick={() => handleTabChange('2012')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                currentTab === '2012'
                  ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-black text-neutral-900">
                    2012 DFTQC Edition
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  National Nutrition Program (544 foods)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-black shrink-0">
                {count2012}
              </span>
            </button>

            {/* Combined Tab */}
            <button
              onClick={() => handleTabChange('ALL')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                currentTab === 'ALL'
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-black text-neutral-900">
                    Combined Master
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Full integrated repository (644 foods)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-black shrink-0">
                {foods.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Real-time search input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Food Name, Variety, ID, or Scientific Name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Group dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Food Groups ({availableGroups.length})</option>
              {availableGroups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
              <option value={-1}>All ({filteredFoods.length})</option>
            </select>
          </div>
        </div>

        {/* Quick Batch Download Buttons */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-neutral-500 font-medium">
            Showing <strong>{filteredFoods.length}</strong> matching foods
            {currentTab !== 'ALL' && ` in ${currentTab} Edition`}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-medium">Download Editions:</span>
            <button
              onClick={() => handleExportCSV('2024')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors"
            >
              2024 CSV (100)
            </button>
            <button
              onClick={() => handleExportCSV('2012')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-colors"
            >
              2012 CSV (544)
            </button>
            <button
              onClick={() => handleExportCSV('ALL')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition-colors"
            >
              All 644 CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Header */}
            <thead className="bg-neutral-50 text-[11px] text-neutral-600 uppercase font-bold sticky top-0 z-10 border-b border-neutral-200 shadow-2xs">
              <tr>
                <th className="p-3 whitespace-nowrap bg-neutral-50">
                  <button
                    onClick={() => toggleSort('food_id')}
                    className="flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap min-w-[200px] bg-neutral-50">
                  <button
                    onClick={() => toggleSort('food_name_original')}
                    className="flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Food Name</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-center">Edition</th>
                <th className="p-3 whitespace-nowrap min-w-[150px] bg-neutral-50">
                  <button
                    onClick={() => toggleSort('food_group')}
                    className="flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Food Group</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('energy_kcal')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Kcal</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('water_g')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Moist (g)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('protein_g')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Prot (g)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('fat_g')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Fat (g)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('carbohydrate_g')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Carb (g)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('crude_fiber_g')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Fiber (g)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('calcium_mg')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Ca (mg)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('iron_mg')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Fe (mg)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('potassium_mg')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>K (mg)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-right">
                  <button
                    onClick={() => toggleSort('sodium_mg')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700"
                  >
                    <span>Na (mg)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </button>
                </th>
                <th className="p-3 whitespace-nowrap bg-neutral-50 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-neutral-100 font-mono">
              {displayedFoods.length > 0 ? (
                displayedFoods.map((food, i) => {
                  const is2024 = food.source_year === '2024';
                  return (
                    <tr
                      key={food.food_id + i}
                      className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectFood(food)}
                    >
                      <td className="p-3 font-semibold text-neutral-800 whitespace-nowrap">
                        {food.food_id}
                      </td>
                      <td className="p-3 font-sans font-medium text-neutral-900">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                            {food.food_name_original}
                          </span>
                          {food.scientific_name && (
                            <span className="text-[10px] text-neutral-500 italic font-sans truncate max-w-[240px]">
                              {food.scientific_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            is2024
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {food.source_year}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-neutral-600 text-[11px] whitespace-nowrap">
                        {food.food_group}
                      </td>
                      <td className="p-3 text-right font-semibold text-neutral-900 whitespace-nowrap">
                        {food.energy_kcal || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.water_g || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.protein_g || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.fat_g || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.carbohydrate_g || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.crude_fiber_g || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.calcium_mg || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.iron_mg || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.potassium_mg || '—'}
                      </td>
                      <td className="p-3 text-right text-neutral-700 whitespace-nowrap">
                        {food.sodium_mg || '—'}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectFood(food)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 hover:bg-emerald-600 hover:text-white text-neutral-700 text-[11px] font-sans font-semibold transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={15} className="p-8 text-center text-neutral-500 font-sans">
                    No foods found matching your filter criteria. Try clearing search or selecting a different food group.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pageSize !== -1 && totalPages > 1 && (
          <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-medium">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
              {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredFoods.length)} of{' '}
              {filteredFoods.length} records)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-neutral-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
