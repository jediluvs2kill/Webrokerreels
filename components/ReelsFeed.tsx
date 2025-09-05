
import React from 'react';
import type { Reel } from '../types';
import ReelCard from './ReelCard';

interface ReelsFeedProps {
  reels: Reel[];
}

const ReelsFeed: React.FC<ReelsFeedProps> = ({ reels }) => {
  if (reels.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
            <h2 className="text-2xl font-semibold">No Properties Found</h2>
            <p className="mt-2">Try adjusting your search or filter criteria.</p>
        </div>
    );
  }

  return (
    <div className="relative w-full md:w-[400px] h-full overflow-y-auto snap-y snap-mandatory">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default ReelsFeed;
