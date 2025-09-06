
import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Reel, UserVotes, Realtor } from '../types';
import ReelCard from './ReelCard';
import FilterComponent, { Filters } from './FilterComponent';

interface ReelsFeedProps {
  reels: Reel[];
  onOpenFavoritesModal: (reel: Reel) => void;
  isReelInFavorites: (reelId: string) => boolean;
  onShare: (reel: Reel) => void;
  onVote: (reelId: string, vote: 'like' | 'dislike') => void;
  userVotes: UserVotes;
  onViewProfile: (realtor: Realtor) => void;
}

const ReelsFeed: React.FC<ReelsFeedProps> = ({ 
  reels, 
  onOpenFavoritesModal, 
  isReelInFavorites, 
  onShare, 
  onVote, 
  userVotes,
  onViewProfile
}) => {
  const reelRefs = useRef<Record<string, HTMLElement>>({});
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    beds: 0,
    baths: 0,
    minPrice: '',
    maxPrice: '',
  });

  const filteredReels = useMemo(() => {
    return reels.filter(reel => {
        const { property, realtor } = reel;
        const { searchQuery, beds, baths, minPrice, maxPrice } = filters;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchLower ||
            property.address.toLowerCase().includes(searchLower) ||
            realtor.name.toLowerCase().includes(searchLower) ||
            realtor.agency.toLowerCase().includes(searchLower);

        const matchesBeds = !beds || property.beds >= beds;
        const matchesBaths = !baths || property.baths >= baths;

        const minPriceNum = minPrice ? parseFloat(minPrice) * 100000 : 0;
        const maxPriceNum = maxPrice ? parseFloat(maxPrice) * 100000 : Infinity;
        const matchesPrice = property.price >= minPriceNum && property.price <= maxPriceNum;
        
        return matchesSearch && matchesBeds && matchesBaths && matchesPrice;
    });
  }, [reels, filters]);


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
            <p className="mt-2">Try adding a new reel or adjusting your search.</p>
        </div>
    );
  }

  return (
    <>
      <FilterComponent onFilterChange={setFilters} initialFilters={filters} />
      <div className="relative w-full md:w-[400px] flex-grow overflow-y-auto snap-y snap-mandatory">
        {filteredReels.length > 0 ? filteredReels.map((reel) => (
          <section 
            key={reel.id} 
            ref={el => { if(el) reelRefs.current[reel.id] = el }}
            className="relative h-full w-full flex-shrink-0 snap-start flex items-center justify-center bg-black"
          >
            <ReelCard 
              reel={reel}
              onOpenFavoritesModal={onOpenFavoritesModal}
              isLiked={isReelInFavorites(reel.id)}
              onShare={onShare}
              onVote={onVote}
              userVote={userVotes[reel.id] || null}
              onViewProfile={onViewProfile}
            />
          </section>
        )) : (
           <div className="h-full w-full flex-shrink-0 snap-start flex items-center justify-center text-center p-8 text-gray-400">
             <div>
                <h2 className="text-2xl font-semibold">No Properties Match</h2>
                <p className="mt-2">Try adjusting or clearing your filters.</p>
             </div>
           </div>
        )}
      </div>
    </>
  );
};

export default ReelsFeed;