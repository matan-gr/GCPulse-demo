import { useMemo } from 'react';
import { FeedItem } from '../types';
import { UserPreferences } from './useUserPreferences';

export const useDiscoverView = (items: FeedItem[], prefs: UserPreferences) => {
  const visibleColumns = useMemo(() => {
    return prefs.columnOrder
      .filter((source: string) => source !== 'Product Deprecations' && source !== 'Service Health' && source !== 'Cloud Blog' && source !== 'Release Notes' && source !== 'Gemini Enterprise' && source !== 'Product Updates' && source !== 'Google AI Research' && !prefs.hiddenColumns?.includes(source));
  }, [prefs.columnOrder, prefs.hiddenColumns]);

  const getColumnItems = (source: string) => {
    return items.filter(i => i.source === source);
  };

  const handleScrollToFeed = () => {
    const feedElement = document.getElementById('feed-grid');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    visibleColumns,
    getColumnItems,
    handleScrollToFeed
  };
};
