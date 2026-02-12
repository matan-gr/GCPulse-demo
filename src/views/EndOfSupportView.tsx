
import React from 'react';
import { FeedItem } from '../types';
import { EndOfSupportTimeline } from '../components/EndOfSupportTimeline';
import { EndOfSupportLoader } from '../components/EndOfSupportLoader';

interface EndOfSupportViewProps {
  items: FeedItem[];
  loading: boolean;
}

export const EndOfSupportView: React.FC<EndOfSupportViewProps> = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="col-span-full flex justify-center items-center min-h-[400px]">
        <EndOfSupportLoader />
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <EndOfSupportTimeline items={items} />
    </div>
  );
};
