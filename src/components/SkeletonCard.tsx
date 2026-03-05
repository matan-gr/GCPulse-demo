import React from 'react';

export const SkeletonCard: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  const isList = viewMode === 'list';
  
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex ${isList ? 'flex-row h-[200px]' : 'flex-col h-[450px]'}`}>
      <div className={`${isList ? 'w-1/3' : 'h-48'} bg-zinc-200 dark:bg-zinc-800 animate-pulse`} />
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex space-x-2">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
