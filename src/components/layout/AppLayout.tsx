import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { 
  Menu, 
  Sun, 
  Moon, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Github, 
  ExternalLink, 
  ShieldCheck, 
  Globe,
  Cpu,
  Database,
  Zap,
  MessageSquarePlus,
  Search,
  Command,
  X,
  Filter
} from 'lucide-react';
import { GlobalSearch } from '../GlobalSearch';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../ui/Tooltip';
import { ScrollToTopButton } from '../ui/ScrollToTopButton';
import { Breadcrumbs } from './Breadcrumbs';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (mode: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  // Search Props
  search: string;
  setSearch: (search: string) => void;
  isSmartFilter: boolean;
  setIsSmartFilter: (isSmart: boolean) => void;
  isAiLoading: boolean;
  categories: string[];
  selectedCategories: string[];
  filterType: 'include' | 'exclude';
  handleCategoryChange: (category: string) => void;
  handleFilterTypeChange: (type: 'include' | 'exclude') => void;
  dateRange: { start: string; end: string } | null;
  handleDateRangeChange: (range: { start: string; end: string } | null) => void;
  sortBy: 'date' | 'category';
  sortDirection: 'asc' | 'desc';
  handleSortChange: (sortBy: 'date' | 'category', sortDirection: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExportCSV: () => void;
  isAnyFilterActive?: boolean;
  onClearFilters?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  isPresentationMode,
  setIsPresentationMode,
  isSidebarOpen,
  setIsSidebarOpen,
  search,
  setSearch,
  isSmartFilter,
  setIsSmartFilter,
  isAiLoading,
  categories,
  selectedCategories,
  filterType,
  handleCategoryChange,
  handleFilterTypeChange,
  dateRange,
  handleDateRangeChange,
  sortBy,
  sortDirection,
  handleSortChange,
  viewMode,
  onViewModeChange,
  onExportCSV,
  isAnyFilterActive,
  onClearFilters
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] dark:bg-[var(--color-bg-app-dark)] font-sans text-slate-900 dark:text-slate-100 flex">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isPresentationMode={isPresentationMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${!isPresentationMode && isDesktopSidebarOpen ? 'lg:ml-72' : ''}`}>
        
        {/* Top Header / Controls */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 h-20 flex items-center">
          <div className="max-w-[1600px] mx-auto w-full px-6 flex items-center justify-between gap-4">
            
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Mobile Menu Trigger */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Desktop Sidebar Toggle */}
              {!isPresentationMode && (
                <button
                  onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                  className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                  title={isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                  {isDesktopSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
              )}

              {isPresentationMode && (
                <div className="flex items-center space-x-3 mr-6 group cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
                    <div className="relative w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                      <Zap size={18} className="text-white fill-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none flex items-baseline">
                      GCP
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent ml-0.5">Pulse</span>
                    </span>
                  </div>
                </div>
              )}
              
              {/* Breadcrumbs */}
              <div className="hidden lg:block">
                <Breadcrumbs activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>

              <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize truncate tracking-tight sm:hidden">
                {(() => {
                  if (isPresentationMode) return 'Executive Briefing';
                  const titles: Record<string, string> = {
                    'all': 'All Updates',
                    'updates': 'Innovation Hub',
                    'cloud-blog': 'Official Blog',
                    'release-notes': 'Release Notes',
                    'deprecations': 'Deprecation Notices',
                    'youtube': 'Video Library',
                    'incidents': 'Service Health',
                    'security': 'Security Advisories',
                    'architecture': 'Architecture Center',
                    'saved': 'Saved Items',
                    'tools': 'Developer Tools',
                    'weekly-brief': 'Weekly Brief'
                  };
                  return titles[activeTab] || activeTab;
                })()}
              </h1>
            </div>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
               {!isPresentationMode && activeTab !== 'tools' && (
                  <GlobalSearch 
                    value={search} 
                    onChange={setSearch} 
                    isSmartFilter={isSmartFilter}
                    onToggleSmartFilter={() => setIsSmartFilter(!isSmartFilter)}
                    loading={isAiLoading}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    filterType={filterType}
                    onSelectCategory={handleCategoryChange}
                    onFilterTypeChange={handleFilterTypeChange}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                    viewMode={viewMode}
                    onViewModeChange={onViewModeChange}
                    onExportCSV={onExportCSV}
                  />
               )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
               {/* Author Link */}
               <Tooltip content="Contact Author" position="bottom">
                 <a 
                   href="mailto:matangr@google.com"
                   className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50"
                 >
                   <MessageSquarePlus size={16} />
                   <span>Created by matangr</span>
                 </a>
               </Tooltip>

               <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

               {/* Theme Toggle */}
               <Tooltip content={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`} position="bottom">
                 <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 active:scale-95"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
               </Tooltip>
            </div>
          </div>
        </header>

        {/* Mobile Search (visible only on small screens) */}
        <div className="md:hidden px-4 py-2 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#121212]">
           {!isPresentationMode && activeTab !== 'tools' && (
              <GlobalSearch 
                value={search} 
                onChange={setSearch} 
                isSmartFilter={isSmartFilter}
                onToggleSmartFilter={() => setIsSmartFilter(!isSmartFilter)}
                loading={isAiLoading}
                categories={categories}
                selectedCategories={selectedCategories}
                filterType={filterType}
                onSelectCategory={handleCategoryChange}
                onFilterTypeChange={handleFilterTypeChange}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onExportCSV={onExportCSV}
              />
           )}
        </div>

        <div className="p-4 sm:p-6 pb-24 max-w-[1600px] mx-auto min-h-[calc(100vh-200px)]">
          {isAnyFilterActive && onClearFilters && (
            <div className="mb-6 flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Filter size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Active Search & Filters</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">You are currently viewing a filtered subset of the feed.</p>
                </div>
              </div>
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95"
              >
                <X size={14} />
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
          {children}
        </div>

        {/* Minimal Footer */}
        <footer className="fixed bottom-0 left-72 right-0 bg-white dark:bg-[#121212] border-t border-slate-200/60 dark:border-white/5 py-4 px-6 z-40">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-10 group-hover:opacity-30 transition-opacity" />
                <div className="relative w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10 ring-1 ring-white/10">
                  <Zap size={16} className="text-white fill-white" />
                </div>
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter flex items-baseline">
                GCP
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent ml-0.5">Pulse</span>
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <Cpu size={14} className="opacity-40" />
                <span>v2.4.0-stable</span>
              </div>
              <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                <Database size={14} className="opacity-40" />
                <span>Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </footer>
        
        <ScrollToTopButton />
      </div>
    </div>
  );
};
