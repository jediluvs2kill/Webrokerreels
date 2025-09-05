import React, { useEffect, useRef } from 'react';
import type { Reel } from '../types';
import ReelCard from './ReelCard';

interface ReelsFeedProps {
  reels: Reel[];
  onViewProfile: (realtorId: string) => void;
  onOpenFavoritesModal: (reel: Reel) => void;
  isReelInFavorites: (reelId: string) => boolean;
  onShare: (reel: Reel) => void;
}

const ReelsFeed: React.FC<ReelsFeedProps> = ({ reels, onViewProfile, onOpenFavoritesModal, isReelInFavorites, onShare }) => {
  const reelRefs = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reelId = params.get('reelId');
    if (reelId && reelRefs.current[reelId]) {
      // Use a small timeout to ensure the layout is settled before scrolling
      setTimeout(() => {
        reelRefs.current[reelId].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [reels]);

  if (reels.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
            <h2 className="text-2xl font-semibold">No Properties Found</h2>
            <p className="mt-2">Try adjusting your search or filter criteria.</p>
        </div>
    );
  }

  return (
    <div className="relative w-full md:w-[400px] flex-grow overflow-y-auto snap-y snap-mandatory">
      {reels.map((reel) => (
        <section 
          key={reel.id} 
          ref={el => { if(el) reelRefs.current[reel.id] = el }}
          className="relative h-full w-full flex-shrink-0 snap-start flex items-center justify-center bg-black"
        >
          <ReelCard 
            reel={reel} 
            onViewProfile={onViewProfile} 
            onOpenFavoritesModal={onOpenFavoritesModal}
            isLiked={isReelInFavorites(reel.id)}
            onShare={onShare}
          />
        </section>
      ))}
    </div>
  );
};

export default ReelsFeed;