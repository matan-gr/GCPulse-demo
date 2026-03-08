import React from 'react';
import { FeedItem } from '../types';
import { motion } from 'motion/react';
import { Youtube, ExternalLink, Calendar, Play, Clock, Eye, ThumbsUp } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

interface YouTubeViewProps {
  items: FeedItem[];
  loading: boolean;
  onClearFilters?: () => void;
}

export const YouTubeView: React.FC<YouTubeViewProps> = ({ items, loading, onClearFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        icon={Youtube}
        title="No videos found"
        description="There are currently no videos available matching your filters."
        actionLabel="Clear All Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" />
            Google Cloud YouTube
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Latest videos, tutorials, and announcements from Google Cloud.
          </p>
        </div>
        <a 
          href="https://www.youtube.com/@googlecloud" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium transition-colors"
        >
          Visit Channel
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            {item.videoId ? (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-full aspect-video bg-slate-900 block group-hover:opacity-90 transition-opacity"
              >
                <img 
                  src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                {item.duration && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded flex items-center gap-1">
                    <Clock size={10} />
                    {item.duration}
                  </div>
                )}
              </a>
            ) : (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-red-500 ml-1" />
                </div>
              </a>
            )}
            
            <div className="p-5 flex flex-col flex-grow">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-2"
              >
                {item.title}
              </a>

              {item.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
              )}
              
              <div className="mt-auto flex flex-col gap-3">
                {item.categories && item.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.categories.slice(0, 3).map(cat => (
                      <span key={cat} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                       {(item as any).channelTitle}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.isoDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {(item as any).duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(item as any).duration}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {(item as any).viewCount && (
                      <div className="flex items-center gap-1">
                        {Intl.NumberFormat('en-US', { notation: 'compact' }).format((item as any).viewCount)} views
                        <Eye className="w-3 h-3" />
                      </div>
                    )}
                    {(item as any).likeCount && (
                      <div className="flex items-center gap-1 text-red-500">
                        {Intl.NumberFormat('en-US', { notation: 'compact' }).format((item as any).likeCount)} likes
                        <ThumbsUp className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
