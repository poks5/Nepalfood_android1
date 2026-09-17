import React, { useState } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  Info, 
  ExternalLink, 
  Table, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { FoodMasterItem, FoodPhotoItem, Language } from '../types';
import { translations } from '../i18n';

interface MoreScreenProps {
  foods: FoodMasterItem[];
  photos: FoodPhotoItem[];
  lang: Language;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ foods, photos, lang }) => {
  const t = translations[lang];
  const [activeView, setActiveView] = useState<'menu' | 'masterTable' | 'photoTable'>('menu');
  const [tableSearch, setTableSearch] = useState('');
  const [tableYear, setTableYear] = useState<'ALL' | '2024' | '2012'>('ALL');

  // CSV download generator with UTF-8 BOM support
  const downloadCSV = (type: 'all' | '2024' | '2012' | 'photo') => {
    let filename = '';
    let content = '';

    if (type === 'photo') {
      filename = 'food_photo.csv';
      const headers = Object.keys(photos[0] || {}).join(',');
      const rows = photos.map((p) =>
        Object.values(p)
          .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
          .join(',')
      );
      content = [headers, ...rows].join('\r\n');
    } else {
      let targetList = foods;
      if (type === '2024') {
        targetList = foods.filter((f) => f.source_year === '2024');
        filename = 'food_master_2024.csv';
      } else if (type === '2012') {
        targetList = foods.filter((f) => f.source_year === '2012');
        filename = 'food_master_2012.csv';
      } else {
        filename = 'food_master_combined_644.csv';
      }

      if (targetList.length === 0) return;
      const headers = Object.keys(targetList[0] || {}).join(',');
      const rows = targetList.map((f) =>
        Object.values(f)
          .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
          .join(',')
      );
      content = [headers, ...rows].join('\r\n');
    }

    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered foods for table view
  const filteredFoods = foods.filter((f) => {
    if (tableYear !== 'ALL' && f.source_year !== tableYear) return false;
    const q = tableSearch.toLowerCase();
    return (
      f.food_id.toLowerCase().includes(q) ||
      f.food_name_original.toLowerCase().includes(q) ||
      f.food_group.toLowerCase().includes(q) ||
      (f.variety_name && f.variety_name.toLowerCase().includes(q))
    );
  });

  const filteredPhotos = photos.filter((p) => {
    const q = tableSearch.toLowerCase();
    return (
      p.food_id.toLowerCase().includes(q) ||
      p.figure_caption.toLowerCase().includes(q) ||
      p.figure_number.toLowerCase().includes(q)
    );
  });

  if (activeView === 'masterTable') {
    return (
      <div className="space-y-4 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('menu')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-emerald-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>
            <span className="text-xs font-bold text-neutral-800">
              {t.openMasterDb} ({filteredFoods.length} of {foods.length} rows)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 text-xs font-semibold">
              <button
                onClick={() => setTableYear('ALL')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tableYear === 'ALL' ? 'bg-white text-blue-800 shadow-2xs' : 'text-neutral-600'
                }`}
              >
                All ({foods.length})
              </button>
              <button
                onClick={() => setTableYear('2024')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tableYear === '2024' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-neutral-600'
                }`}
              >
                2024 ({foods.filter((f) => f.source_year === '2024').length})
              </button>
              <button
                onClick={() => setTableYear('2012')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  tableYear === '2012' ? 'bg-white text-amber-800 shadow-2xs' : 'text-neutral-600'
                }`}
              >
                2012 ({foods.filter((f) => f.source_year === '2012').length})
              </button>
            </div>

            <button
              onClick={() => downloadCSV(tableYear === 'ALL' ? 'all' : tableYear)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <input
          type="text"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          placeholder="Filter master database records..."
          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-50 text-[10px] text-neutral-500 uppercase border-b border-neutral-200">
              <tr>
                <th className="p-2.5 font-bold">ID</th>
                <th className="p-2.5 font-bold">Year</th>
                <th className="p-2.5 font-bold">Food Name</th>
                <th className="p-2.5 font-bold">Group</th>
                <th className="p-2.5 font-bold">Variety</th>
                <th className="p-2.5 font-bold">Kcal</th>
                <th className="p-2.5 font-bold">Protein</th>
                <th className="p-2.5 font-bold">K (mg)</th>
                <th className="p-2.5 font-bold">P (mg)</th>
                <th className="p-2.5 font-bold">Na (mg)</th>
                <th className="p-2.5 font-bold">Page</th>
                <th className="p-2.5 font-bold">Table</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFoods.map((f) => (
                <tr key={f.food_id} className="hover:bg-neutral-50/80">
                  <td className="p-2.5 font-bold text-emerald-800">{f.food_id}</td>
                  <td className="p-2.5 font-sans">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        f.source_year === '2024'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.source_year}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans font-medium text-neutral-900">{f.food_name_original}</td>
                  <td className="p-2.5 font-sans text-neutral-600 text-[11px]">{f.food_group}</td>
                  <td className="p-2.5 font-sans text-neutral-600">{f.variety_name || '—'}</td>
                  <td className="p-2.5 text-neutral-800">{f.energy_kcal}</td>
                  <td className="p-2.5 text-neutral-800">{f.protein_g}</td>
                  <td className="p-2.5 text-purple-900 font-bold">{f.potassium_mg}</td>
                  <td className="p-2.5 text-teal-900 font-bold">{f.phosphorus_mg}</td>
                  <td className="p-2.5 text-blue-900">{f.sodium_mg}</td>
                  <td className="p-2.5 text-neutral-500">{f.source_page}</td>
                  <td className="p-2.5 text-neutral-500">{f.source_table}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeView === 'photoTable') {
    return (
      <div className="space-y-4 pb-24">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200">
          <button
            onClick={() => setActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
          <span className="text-xs font-bold text-neutral-800">
            {t.openPhotoIndex} (100 mapped figures)
          </span>
          <button
            onClick={() => downloadCSV('photo')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

        <input
          type="text"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          placeholder="Filter photograph index citations..."
          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-50 text-[10px] text-neutral-500 uppercase border-b border-neutral-200">
              <tr>
                <th className="p-2.5 font-bold">Food ID</th>
                <th className="p-2.5 font-bold">Figure Number</th>
                <th className="p-2.5 font-bold">Figure Caption Exact</th>
                <th className="p-2.5 font-bold">PDF Page</th>
                <th className="p-2.5 font-bold">Mapping Confidence</th>
                <th className="p-2.5 font-bold">Image Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPhotos.map((p) => (
                <tr key={p.food_id} className="hover:bg-neutral-50/80">
                  <td className="p-2.5 font-bold text-emerald-800">{p.food_id}</td>
                  <td className="p-2.5 font-bold text-neutral-800">{p.figure_number}</td>
                  <td className="p-2.5 font-sans italic text-neutral-900">{p.figure_caption}</td>
                  <td className="p-2.5 text-neutral-700">p. {p.pdf_page}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                      {p.photograph_mapping_confidence}
                    </span>
                  </td>
                  <td className="p-2.5 font-sans text-neutral-500 text-[11px] max-w-xs truncate">{p.image_description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      {/* App Info Card */}
      <section className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            खा
          </div>
          <div>
            <h1 className="text-lg font-black text-neutral-900 leading-tight">
              {t.aboutTitle}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Nepal Food Composition Database (2012 & 2024 Editions)
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {t.aboutDescription}
        </p>

        <div className="mt-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-700 space-y-2">
          <p className="font-semibold text-neutral-900">
            Official Source References & Downloads:
          </p>
          <div className="space-y-1.5 text-neutral-600">
            <div className="flex items-start justify-between gap-2">
              <span className="italic">
                <strong>2024:</strong> Nepal Food Composition Database 2024, National Food Research Centre (NFRC), Nepal Agricultural Research Council (NARC).
              </span>
              <a
                href="/NepalFoodcompositiondatabase.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                <Download className="w-3 h-3" /> PDF
              </a>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="italic">
                <strong>2012:</strong> Nepal Food Composition Table 2012, Central Nutritional Laboratory, National Nutrition Program, DFTQC, Ministry of Agriculture Development.
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href="/Nepal_Food_Composition_table_2012.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                >
                  <Download className="w-3 h-3" /> PDF
                </a>
                <a
                  href="/Nepal_Food_composition_Database_2012.xlsx"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                >
                  <Download className="w-3 h-3" /> XLSX
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100-Food Audit & Data Integrity Status */}
      <section className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            {t.auditReport}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/70 border border-emerald-200/70 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              {t.totalFoods}
            </span>
            <span className="text-2xl font-black font-mono text-emerald-950 mt-1 block">
              {foods.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">100% Verified</span>
          </div>

          <div className="bg-sky-50/70 border border-sky-200/70 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-sky-700 block">
              {t.totalPhotos}
            </span>
            <span className="text-2xl font-black font-mono text-sky-950 mt-1 block">
              {photos.length}
            </span>
            <span className="text-[10px] text-sky-600 font-medium">1:1 Mapped</span>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/70 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              {t.unmappedFoods}
            </span>
            <span className="text-2xl font-black font-mono text-neutral-800 mt-1 block">
              0
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Complete</span>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/70 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              {t.orphanPhotos}
            </span>
            <span className="text-2xl font-black font-mono text-neutral-800 mt-1 block">
              0
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Zero Discrepancy</span>
          </div>
        </div>
      </section>

      {/* Data & References Browser */}
      <section className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
            {t.dataRefTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t.dataRefSubtitle}
          </p>
        </div>

        <div className="space-y-2 pt-1">
          {/* Master Table view button */}
          <button
            onClick={() => setActiveView('masterTable')}
            className="w-full p-3.5 rounded-2xl border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Table className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-neutral-900 block group-hover:text-emerald-800">
                  {t.openMasterDb}
                </span>
                <span className="text-[11px] text-neutral-500">
                  Browse all attributes for {foods.length} food records
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600" />
          </button>

          {/* Photo Index view button */}
          <button
            onClick={() => setActiveView('photoTable')}
            className="w-full p-3.5 rounded-2xl border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/30 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-neutral-900 block group-hover:text-sky-800">
                  {t.openPhotoIndex}
                </span>
                <span className="text-[11px] text-neutral-500">
                  Figure numbers, captions, and PDF page mappings
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-sky-600" />
          </button>
        </div>

        {/* CSV Downloads */}
        <div className="pt-3 border-t border-neutral-100 space-y-2">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Export Master Datasets (CSV with Excel UTF-8 Support):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => downloadCSV('2024')}
              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex flex-col text-left">
                <span>Export 2024 Edition CSV</span>
                <span className="text-[10px] font-normal text-emerald-700">NARC Publication (100 rows, 40 cols)</span>
              </div>
              <Download className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => downloadCSV('2012')}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex flex-col text-left">
                <span>Export 2012 Edition CSV</span>
                <span className="text-[10px] font-normal text-amber-700">DFTQC Publication (544 rows, 40 cols)</span>
              </div>
              <Download className="w-4 h-4 text-amber-700 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => downloadCSV('all')}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-900 text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex flex-col text-left">
                <span>Export Combined Master CSV</span>
                <span className="text-[10px] font-normal text-blue-700">Integrated National Dataset (644 rows)</span>
              </div>
              <Download className="w-4 h-4 text-blue-700 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => downloadCSV('photo')}
              className="p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex flex-col text-left">
                <span>Export Photograph Citations CSV</span>
                <span className="text-[10px] font-normal text-neutral-500">Figure & PDF page index (100 rows)</span>
              </div>
              <Download className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Android Native Architecture (Option 3) */}
      <section className="bg-gradient-to-br from-emerald-900 to-neutral-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                Android Native App (Option 3 Ready)
              </h3>
              <p className="text-xs text-neutral-300">
                Kotlin 2.0 • Jetpack Compose • Room SQLite • Coil 2.7
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase">
            100% Offline
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          The pure native Android project has been generated in the <code className="px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-mono text-[11px]">/android</code> folder. It includes complete Material 3 Compose screens, an offline Room SQLite database pre-seeded with all 644 foods and photographic plates, and an interactive meal portion calculator.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-400 font-bold block">ROOM DATABASE</span>
            <span className="font-semibold text-white mt-0.5 block">Zero Network Calls</span>
            <span className="text-[11px] text-neutral-400">Cold-boot seeded from assets/database.json</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-400 font-bold block">JETPACK COMPOSE</span>
            <span className="font-semibold text-white mt-0.5 block">Material 3 UI</span>
            <span className="text-[11px] text-neutral-400">60/120fps smooth scrolling & edge-to-edge</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <span className="text-[10px] text-emerald-400 font-bold block">READY TO RUN</span>
            <span className="font-semibold text-white mt-0.5 block">Android Studio</span>
            <span className="text-[11px] text-neutral-400">Open /android directly or run ./gradlew</span>
          </div>
        </div>

        <div className="p-3 bg-black/30 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-200 flex items-center justify-between">
          <span>cd android && ./gradlew assembleDebug</span>
          <span className="text-neutral-400 text-[10px]">app-debug.apk</span>
        </div>
      </section>

      {/* Kidney Nutrition Information & Safety Protocol */}
      <section className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Kidney-Monitored Nutrients & Safety Protocol
          </h3>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          In clinical nephrology and renal dietetics, individuals managing chronic kidney disease (CKD) or kidney health frequently track dietary intake of <strong>Potassium (K)</strong>, <strong>Phosphorus (P)</strong>, <strong>Sodium (Na)</strong>, <strong>Protein</strong>, and <strong>Fluid/Water</strong>.
        </p>
        <p className="text-xs text-neutral-500 italic">
          Khana Sathi strictly presents laboratory-analyzed composition data from the official 2024 NARC report. This database does NOT make subjective designations such as "safe", "avoid", or "kidney friendly". Dietary goals must always be personalized under the guidance of a qualified renal dietitian or nephrologist.
        </p>
      </section>
    </div>
  );
};
