import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Menu, Maximize2, Minimize2, Sun, Moon, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { GlobalSearch } from '../GlobalSearch';
import { useTheme } from '../../hooks/useTheme';
import { Tooltip } from '../ui/Tooltip';
import { ScrollToTopButton } from '../ui/ScrollToTopButton';

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
  onExportCSV
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0b0c10] font-sans text-slate-900 dark:text-slate-100 flex">
      
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
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#15171c]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Menu & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            {!isPresentationMode && (
              <button
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {isDesktopSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
            )}

            {isPresentationMode && (
              <div className="flex items-center space-x-3 mr-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">GCP Pulse</span>
              </div>
            )}
            
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize truncate tracking-tight hidden sm:block">
              {(() => {
                if (isPresentationMode) return 'Executive Briefing';
                const titles: Record<string, string> = {
                  'all': 'Discover Feed',
                  'updates': 'Updates & Innovation',
                  'cloud-blog': 'Cloud Blog',
                  'release-notes': 'Release Notes',
                  'deprecations': 'Product Deprecations',
                  'youtube': 'GCP YouTube Channel',
                  'incidents': 'Cloud Incidents',
                  'security': 'Security Bulletins',
                  'architecture': 'Architecture',
                  'saved': 'Read Later',
                  'tools': 'Tools',
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
          <div className="flex items-center gap-2">
             {/* Theme Toggle */}
             <Tooltip content={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`} position="bottom">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
             </Tooltip>
          </div>
        </div>

        {/* Mobile Search (visible only on small screens) */}
        <div className="md:hidden px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15171c]">
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

        <div className="p-4 sm:p-6 pb-20 max-w-[1600px] mx-auto">
          {children}
        </div>
        
        <ScrollToTopButton />
      </div>
    </div>
  );
};
