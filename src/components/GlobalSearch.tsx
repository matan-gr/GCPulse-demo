import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Sparkles, X, Calendar, Tag, LayoutGrid, List, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip } from './ui/Tooltip';

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  isSmartFilter: boolean;
  onToggleSmartFilter: () => void;
  loading?: boolean;
  categories: string[];
  selectedCategories: string[];
  filterType: 'include' | 'exclude';
  onSelectCategory: (category: string) => void;
  onFilterTypeChange: (type: 'include' | 'exclude') => void;
  dateRange: { start: string; end: string } | null;
  onDateRangeChange: (range: { start: string; end: string } | null) => void;
  sortBy: 'date' | 'category';
  sortDirection: 'asc' | 'desc';
  onSortChange: (sortBy: 'date' | 'category', sortDirection: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExportCSV?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  value,
  onChange,
  isSmartFilter,
  onToggleSmartFilter,
  loading,
  categories,
  selectedCategories,
  filterType,
  onSelectCategory,
  onFilterTypeChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  sortDirection,
  onSortChange,
  viewMode,
  onViewModeChange,
  onExportCSV,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = selectedCategories.length > 0 || dateRange;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors ${isSmartFilter ? 'text-violet-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
        </div>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isSmartFilter ? "Ask AI to find updates..." : "Search updates (Cmd+K)..."}
          className={`input-field pl-11 pr-32 py-2.5 relative z-10 ${
            isSmartFilter ? 'focus:border-violet-500 ring-violet-500/20' : ''
          }`}
        />
        
        {/* Right Actions */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1 z-20">
          {/* Smart Filter Toggle */}
          <Tooltip content="Toggle AI Smart Search" position="bottom">
            <button
              onClick={onToggleSmartFilter}
              className={`p-1.5 rounded-lg transition-all ${
                isSmartFilter 
                  ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' 
                  : 'text-slate-400 hover:text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles size={16} className={loading ? 'animate-pulse' : ''} />
            </button>
          </Tooltip>

          {/* Filter Toggle */}
          <Tooltip content="Filters & View Options" position="bottom">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`p-1.5 rounded-lg transition-all ${
                isFiltersOpen || hasActiveFilters
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-[#15171c] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
          >
            <div className="space-y-4">
              {/* Header with Clear All */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</h3>
                {(selectedCategories.length > 0 || dateRange) && (
                  <button 
                    onClick={() => {
                      selectedCategories.forEach(cat => onSelectCategory(cat)); // Toggle all off
                      onDateRangeChange(null);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center"
                  >
                    <X size={12} className="mr-1" /> Clear All
                  </button>
                )}
              </div>

              {/* View Mode & Sort */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort By</span>
                    <select
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value as 'date' | 'category', sortDirection)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date">Date</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                  <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <Tooltip content="Ascending" position="top">
                      <button
                        onClick={() => onSortChange(sortBy, 'asc')}
                        className={`p-1.5 rounded ${sortDirection === 'asc' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <ArrowUp size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Descending" position="top">
                      <button
                        onClick={() => onSortChange(sortBy, 'desc')}
                        className={`p-1.5 rounded ${sortDirection === 'desc' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Layout</span>
                  <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <Tooltip content="Grid View" position="top">
                      <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip content="List View" position="top">
                      <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <List size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    <Tag size={14} className="mr-2" /> Categories
                  </label>
                  <div className="flex bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => onFilterTypeChange('include')}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${filterType === 'include' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500'}`}
                    >
                      Include
                    </button>
                    <button
                      onClick={() => onFilterTypeChange('exclude')}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${filterType === 'exclude' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'text-slate-500'}`}
                    >
                      Exclude
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {categories.map(cat => {
                    const isSelected = selectedCategories.includes(cat);
                    const isExcluded = filterType === 'exclude' && isSelected;
                    return (
                      <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          isSelected
                            ? isExcluded 
                              ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                              : 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2" /> Date Range
                  </div>
                  {onExportCSV && (
                    <button
                      onClick={onExportCSV}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      title="Export visible items to CSV for QBR"
                    >
                      <Download size={12} className="mr-1" /> Export CSV
                    </button>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange?.start || ''}
                    onChange={(e) => onDateRangeChange({ start: e.target.value, end: dateRange?.end || '' })}
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="date"
                    value={dateRange?.end || ''}
                    onChange={(e) => onDateRangeChange({ start: dateRange?.start || '', end: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
