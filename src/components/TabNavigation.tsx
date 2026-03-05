import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setSearch: (search: string) => void;
  setIsSmartFilter: (isSmart: boolean) => void;
  handleCategoryChange: (category: string | null) => void;
  handleDateRangeChange: (range: { start: string; end: string } | null) => void;
  savedCount: number;
  isPresentationMode: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  setSearch,
  setIsSmartFilter,
  handleCategoryChange,
  handleDateRangeChange,
  savedCount,
  isPresentationMode
}) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  if (isPresentationMode) return null;

  const tabs = [
    { id: 'all', label: 'Discover', color: 'blue' },
    { id: 'cloud-blog', label: 'Cloud Blog', color: 'blue' },
    { id: 'updates', label: 'Updates and innovation', color: 'blue' },
    { id: 'release-notes', label: 'Release Notes', color: 'blue' },
    { id: 'incidents', label: 'Incidents', color: 'red' },
    { id: 'deprecations', label: 'Deprecations', color: 'amber' },
    { id: 'security', label: 'Security', color: 'purple' },
    { id: 'architecture', label: 'Architecture', color: 'indigo' },
    { id: 'youtube', label: 'YouTube', color: 'red' },
    { id: 'saved', label: `Read Later (${savedCount})`, color: 'blue' },
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearch('');
    setIsSmartFilter(false);
    handleCategoryChange(null);
    handleDateRangeChange(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      setFocusedIndex(nextIndex);
      tabsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setFocusedIndex(prevIndex);
      tabsRef.current[prevIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 relative">
      <div className="flex overflow-x-auto relative" role="tablist" aria-label="Feed Categories">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabsRef.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`relative px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-lg ${
                isActive 
                  ? tab.color === 'red' ? 'text-red-600 dark:text-red-400'
                  : tab.color === 'amber' ? 'text-amber-600 dark:text-amber-400'
                  : tab.color === 'purple' ? 'text-purple-600 dark:text-purple-400'
                  : 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    tab.color === 'red' ? 'bg-red-600 dark:bg-red-400'
                    : tab.color === 'amber' ? 'bg-amber-600 dark:bg-amber-400'
                    : tab.color === 'purple' ? 'bg-purple-600 dark:bg-purple-400'
                    : 'bg-indigo-600 dark:bg-indigo-400'
                  }`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
