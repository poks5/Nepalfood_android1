import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

props_interface = """interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onNavigate: (tab: NavTab) => void;
  favoritesCount: number;
}"""

new_props_interface = """interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onNavigate: (tab: NavTab) => void;
  favoritesCount: number;
  filterYear?: string;
  onFilterYearChange?: (year: string) => void;
}"""

content = content.replace(props_interface, new_props_interface)

header_func = """export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onNavigate,
  favoritesCount
}) => {"""

new_header_func = """export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onNavigate,
  favoritesCount,
  filterYear = 'ALL',
  onFilterYearChange
}) => {"""

content = content.replace(header_func, new_header_func)

controls_div = """        {/* Right side controls: Language Switcher & Quick Favorites */}
        <div className="flex items-center gap-2">"""

new_controls_div = """        {/* Right side controls: Language Switcher & Quick Favorites */}
        <div className="flex items-center gap-2">
          {onFilterYearChange && (
            <select
              value={filterYear}
              onChange={(e) => onFilterYearChange(e.target.value)}
              className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-1.5 font-medium"
            >
              <option value="ALL">All Years</option>
              <option value="2024">2024 Only</option>
              <option value="2012">2012 Only</option>
            </select>
          )}
"""

content = content.replace(controls_div, new_controls_div)

# Remove the static 2024 tag from the header since we now have both years
tag_to_remove = """              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                2024
              </span>"""
content = content.replace(tag_to_remove, "")

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
