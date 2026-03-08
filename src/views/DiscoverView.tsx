import React, { useState, useMemo } from 'react';
import { FeedItem } from '../types';
import { StatusDashboard } from '../components/StatusDashboard';
import { FeedCard } from '../components/FeedCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { AnalysisResult } from '../types';
import { EmptyState } from '../components/EmptyState';
import { Loader2, LayoutTemplate, AlignJustify, Grid, Download, Sparkles, TrendingUp, Filter, SearchX } from 'lucide-react';
import { UserPreferences } from '../hooks/useUserPreferences';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useStandardFeedView } from '../hooks/useStandardFeedView';

interface DiscoverViewProps {
  items: FeedItem[];
  loading: boolean;
  prefs: UserPreferences;
  onSummarize: (item: FeedItem) => void;
  summarizingId: string | null;
  onSave: (item: FeedItem) => void;
  toggleCategorySubscription: (category: string) => void;
  handleCategoryChange: (category: string) => void;
  analyses: Record<string, AnalysisResult>;
  isPresentationMode: boolean;
  isAiLoading: boolean;
  onToggleColumnVisibility: (column: string) => void;
  onUpdateColumnOrder: (order: string[]) => void;
  onClearFilters?: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  items,
  loading,
  prefs,
  onSummarize,
  summarizingId,
  onSave,
  toggleCategorySubscription,
  handleCategoryChange,
  analyses,
  isPresentationMode,
  isAiLoading,
  onClearFilters,
}) => {
  // View Customization State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and organize items for the Discover feed
  const allFeedItems = useMemo(() => {
    return items.filter(item => item.source !== 'Security Bulletins');
  }, [items]);

  // Extract popular categories for quick filters
  const popularCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    allFeedItems.forEach(item => {
      (item.categories || []).forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
  }, [allFeedItems]);

  const { visibleItems, loadMoreRef, hasMore } = useStandardFeedView(allFeedItems);

  // Split into Featured and Regular items
  const featuredItems = useMemo(() => {
    // Top 2 items if they are "New"
    const now = new Date();
    return allFeedItems.slice(0, 2).filter(item => {
      const hoursSince = (now.getTime() - new Date(item.isoDate).getTime()) / (1000 * 60 * 60);
      return hoursSince < 48;
    });
  }, [allFeedItems]);

  const regularItems = useMemo(() => {
    const featuredLinks = new Set(featuredItems.map(i => i.link));
    return visibleItems.filter(item => !featuredLinks.has(item.link));
  }, [visibleItems, featuredItems]);

  const handleExportCSV = () => {
    if (allFeedItems.length === 0) {
      toast.error("No items to export");
      return;
    }

    const headers = ['Title', 'Source', 'Date', 'Link', 'Categories'];
    const csvContent = [
      headers.join(','),
      ...allFeedItems.map(item => {
        const date = new Date(item.isoDate).toLocaleDateString();
        const title = `"${item.title.replace(/"/g, '""')}"`;
        const source = `"${item.source.replace(/"/g, '""')}"`;
        const link = `"${item.link}"`;
        const categories = `"${(item.categories || []).join('; ').replace(/"/g, '""')}"`;
        return [title, source, date, link, categories].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gcp_updates_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${allFeedItems.length} items to CSV`);
  };

  const handleScrollToFeed = () => {
    const feedElement = document.getElementById('feed-grid');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Dashboard - Only visible in Presentation Mode */}
      {!loading && items.length > 0 && isPresentationMode && (
        <StatusDashboard 
          items={items} 
          onViewCritical={handleScrollToFeed}
          isPresentationMode={isPresentationMode}
        />
      )}

      {isAiLoading && (
          <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full border border-purple-100 shadow-sm animate-pulse">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm font-medium">AI is analyzing the feed...</span>
              </div>
          </div>
      )}

      {/* View Customization Toolbar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-[80px] z-20"
      >
        <div className="flex flex-col gap-4 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/20 dark:shadow-none transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
                <LayoutTemplate size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">Discover Feed</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Personalized Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Export CSV Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-sm bg-white dark:bg-[#121212] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest"
                title="Export to CSV"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export CSV</span>
              </motion.button>

              <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1" />

              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
                {/* View Options Group */}
                <div className="flex items-center bg-slate-100 dark:bg-[#121212]/50 rounded-xl p-1 border border-slate-200 dark:border-white/10 shadow-inner">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-white/10 shadow-md text-blue-600 dark:text-blue-400' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="Grid View"
                  >
                    <Grid size={18} />
                    <span className="text-xs font-bold hidden lg:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-white/10 shadow-md text-blue-600 dark:text-blue-400' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="List View"
                  >
                    <AlignJustify size={18} />
                    <span className="text-xs font-bold hidden lg:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mr-2 whitespace-nowrap">
              <Filter size={12} />
              <span>Quick Filters:</span>
            </div>
            {popularCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap border shadow-sm ${
                  prefs.subscribedCategories.includes(cat)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-[#121212]/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Section */}
      {!loading && featuredItems.length > 0 && viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <TrendingUp size={18} />
            <h2 className="text-lg font-bold tracking-tight">Featured Updates</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredItems.map((item, index) => (
              <FeedCard 
                key={`featured-${item.link}-${index}`} 
                item={item} 
                index={index}
                onSummarize={onSummarize}
                isSummarizing={summarizingId === item.link}
                onSave={onSave}
                isSaved={prefs.savedPosts.includes(item.link)}
                viewMode="grid"
                subscribedCategories={prefs.subscribedCategories}
                onToggleSubscription={toggleCategorySubscription}
                onSelectCategory={handleCategoryChange}
                analysis={analyses[item.link]}
                isPresentationMode={isPresentationMode}
                showImages={true}
              />
            ))}
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-8" />
        </div>
      )}

      {/* Unified Feed Layout */}
      <div id="feed-grid" className={`grid gap-8 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 max-w-4xl mx-auto'
      }`}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} viewMode={viewMode} />
          ))
        ) : regularItems.length === 0 && featuredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              icon={SearchX}
              title="No updates match your filters"
              description="Try adjusting your search terms or filters to find what you're looking for."
              actionLabel="Clear All Filters"
              onAction={onClearFilters}
            />
          </div>
        ) : (
          <>
            {regularItems.map((item, index) => (
              <FeedCard 
                key={`${item.link}-${index}`} 
                item={item} 
                index={index}
                onSummarize={onSummarize}
                isSummarizing={summarizingId === item.link}
                onSave={onSave}
                isSaved={prefs.savedPosts.includes(item.link)}
                viewMode={viewMode}
                subscribedCategories={prefs.subscribedCategories}
                onToggleSubscription={toggleCategorySubscription}
                onSelectCategory={handleCategoryChange}
                analysis={analyses[item.link]}
                isPresentationMode={isPresentationMode}
              />
            ))}
            
            {/* Load More Sentinel */}
            {hasMore ? (
              <div ref={loadMoreRef} className="col-span-full flex justify-center py-8">
                <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Loading more updates...</span>
                </div>
              </div>
            ) : (
              <div className="col-span-full flex justify-center py-12">
                <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                  You've reached the end of the updates.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
