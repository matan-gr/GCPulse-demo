import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { 
  Menu, 
  Sun, 
  Moon, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Cpu,
  Database,
  Zap,
  MessageSquarePlus,
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
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] dark:bg-[var(--color-bg-app-dark)] font-sans text-slate-950 dark:text-slate-50 flex">
      
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
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 h-14 flex items-center">
          <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 flex items-center justify-between gap-4">
            
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Menu Trigger */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Menu size={18} />
              </button>

              {/* Desktop Sidebar Toggle */}
              {!isPresentationMode && (
                <button
                  onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                  className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  title={isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                  {isDesktopSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
              )}

              {isPresentationMode && (
                <div className="flex items-center space-x-2 mr-4 group cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">GCP Pulse</span>
                </div>
              )}
              
              {/* Breadcrumbs */}
              <div className="hidden lg:block">
                <Breadcrumbs activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
            </div>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
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
            <div className="flex items-center gap-2 sm:gap-3">
               {/* Author Link */}
               <Tooltip content="Contact Author" position="bottom">
                 <a 
                   href="mailto:matangr@google.com"
                   className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-slate-200 dark:border-slate-800 uppercase tracking-widest"
                 >
                   <MessageSquarePlus size={14} />
                   <span>matangr</span>
                 </a>
               </Tooltip>

               <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

               {/* Theme Toggle */}
               <Tooltip content={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`} position="bottom">
                 <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
               </Tooltip>
            </div>
          </div>
        </header>

        {/* Mobile Search (visible only on small screens) */}
        <div className="md:hidden px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
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
            <div className="mb-6 flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Filter size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Active Search & Filters</p>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Viewing a filtered subset of the feed.</p>
                </div>
              </div>
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
              >
                <X size={12} />
                <span>Clear</span>
              </button>
            </div>
          )}
          {children}
        </div>

        {/* Minimal Footer */}
        <footer className={`fixed bottom-0 right-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 py-2 px-6 z-40 transition-all duration-300 ${!isPresentationMode && isDesktopSidebarOpen ? 'left-72' : 'left-0'}`}>
          <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Cpu size={12} /> v2.6.0</span>
              <span className="flex items-center gap-1.5"><Database size={12} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span className="hidden sm:block">GCP Pulse Intelligence</span>
          </div>
        </footer>
        
        <ScrollToTopButton />
      </div>
    </div>
  );
};
