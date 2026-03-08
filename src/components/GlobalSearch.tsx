import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Sparkles, X, Calendar, Tag, LayoutGrid, List, Download, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip } from './ui/Tooltip';

import { getCategoryColor } from '../utils';

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
  onClearFilters?: () => void;
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
  onClearFilters
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

  const hasActiveFilters = selectedCategories.length > 0 || dateRange || value !== '';

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors ${isSmartFilter ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white'}`} />
        </div>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isSmartFilter ? "Ask AI..." : "Search..."}
          className={`w-full bg-slate-100 dark:bg-slate-900 border border-transparent rounded-xl pl-10 pr-24 py-2 text-sm font-medium transition-all duration-300 outline-none ${
            isSmartFilter 
              ? 'focus:border-blue-500/50 ring-2 ring-blue-500/10 bg-blue-50/50 dark:bg-blue-900/10' 
              : 'focus:border-slate-300 dark:focus:border-slate-700 focus:bg-white dark:focus:bg-slate-800'
          }`}
        />
        
        {/* Shortcut Hint */}
        <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none z-20 hidden lg:flex">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-bold text-slate-400 dark:text-slate-500">
            <Command size={9} />
            <span>K</span>
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1 z-20">
          {/* Smart Filter Toggle */}
          <Tooltip content="Toggle AI Smart Search" position="bottom">
            <button
              onClick={onToggleSmartFilter}
              className={`p-1.5 rounded-lg transition-all ${
                isSmartFilter 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles size={16} className={loading ? 'animate-pulse' : ''} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Active Filters Bar */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap items-center gap-2 mt-2"
          >
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Filters:</div>
            
            {value && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-200 dark:border-slate-700">
                Search: {value}
                <button onClick={() => onChange('')} className="ml-1.5 hover:text-slate-900 dark:hover:text-white">
                  <X size={10} />
                </button>
              </div>
            )}

            {selectedCategories.map(cat => {
              const color = getCategoryColor(cat);
              return (
                <div key={cat} className={`flex items-center bg-${color}-50 dark:bg-${color}-900/10 text-${color}-600 dark:text-${color}-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-${color}-200/50 dark:border-${color}-800/50`}>
                  {cat}
                  <button onClick={() => onSelectCategory(cat)} className={`ml-1.5 hover:text-${color}-800 dark:hover:text-${color}-200`}>
                    <X size={10} />
                  </button>
                </div>
              );
            })}

            {dateRange && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-200 dark:border-slate-700">
                Date Range
                <button onClick={() => onDateRangeChange(null)} className="ml-1.5 hover:text-slate-900 dark:hover:text-white">
                  <X size={10} />
                </button>
              </div>
            )}

            {onClearFilters && (
              <button 
                onClick={onClearFilters}
                className="text-[9px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest ml-auto"
              >
                Clear All
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Filters Panel Removed */}
    </div>
  );
};
