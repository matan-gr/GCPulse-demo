import React, { useState, useMemo } from 'react';
import { FeedItem } from '../types';
import { StatusDashboard } from '../components/StatusDashboard';
import { FeedCard } from '../components/FeedCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { AnalysisResult } from '../types';
import { Loader2, LayoutTemplate, AlignJustify, Grid, Download } from 'lucide-react';
import { UserPreferences } from '../hooks/useUserPreferences';
import { motion } from 'motion/react';
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
}) => {
  // View Customization State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and organize items for the Discover feed
  const allFeedItems = useMemo(() => {
    // If a specific sort order is active (other than default date-desc), 
    // or if the user wants strict chronological order, we bypass the "Featured" logic.
    // The items passed to this component are already sorted by App.tsx based on prefs.
    // So if sortBy is 'category' or sortDirection is 'asc', we just return items.
    // Even for 'date' 'desc', the user requested "newest items at the top", 
    // so we should probably just return the items as is to respect the strict sort.
    
    // However, the original "Featured" logic was designed to mix sources.
    // Let's only use the "Featured" logic if we are in the default state 
    // (sortBy='date', sortDirection='desc') AND the user hasn't explicitly asked for a strict list.
    // But since the user explicitly asked "In the Discover feed show by default the newest items at the top",
    // this implies the "Featured" interleaving (which might put a slightly older "Top 5" item above a newer one from another source)
    // might be undesirable.
    
    // Let's simplify: The user wants control. If they set a sort, they get that sort.
    // The "Featured" logic is a specific "Curated" view.
    // Since we don't have a "Curated" toggle yet, and the request is "newest items at the top",
    // I will disable the "Featured" logic effectively by just returning `items`.
    // The `items` prop is already filtered and sorted by `App.tsx`.
    
    // Filter out Security Bulletins as per user request
    return items.filter(item => item.source !== 'Security Bulletins');
  }, [items]);

  const { visibleItems, loadMoreRef, hasMore } = useStandardFeedView(allFeedItems);

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
        className="sticky top-[60px] sm:top-[70px] z-20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 transition-all">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
              <LayoutTemplate size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">All Updates</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">Unified feed of all Google Cloud announcements</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Export CSV Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Export to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </motion.button>

            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
              {/* View Options Group */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                  <span className="text-xs font-medium hidden lg:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                  title="List View"
                >
                  <AlignJustify size={16} />
                  <span className="text-xs font-medium hidden lg:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
        ) : (
          <>
            {visibleItems.map((item, index) => (
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
