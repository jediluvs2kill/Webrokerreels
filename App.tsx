
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ReelsFeed from './components/ReelsFeed';
import HomePage from './components/HomePage';
import SubmitReelForm from './components/SubmitReelForm';
import FilterComponent, { Filters } from './components/FilterComponent';
import { REELS_DATA } from './constants';
import type { Reel } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'feed' | 'submit'>('home');
  const [reels, setReels] = useState<Reel[]>(REELS_DATA);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    beds: 0,
    baths: 0,
    minPrice: '',
    maxPrice: '',
  });

  const handleReelSubmit = (newReel: Reel) => {
    setReels(prevReels => [newReel, ...prevReels]);
    setView('feed');
  };

  const filteredReels = useMemo(() => {
    const minPriceNum = filters.minPrice ? parseFloat(filters.minPrice) * 100000 : 0;
    const maxPriceNum = filters.maxPrice ? parseFloat(filters.maxPrice) * 100000 : Infinity;
    
    return reels.filter(reel => {
      const searchLower = filters.searchQuery.toLowerCase();

      const matchesSearch = filters.searchQuery.trim() === '' ||
        reel.property.address.toLowerCase().includes(searchLower) ||
        reel.realtor.name.toLowerCase().includes(searchLower) ||
        reel.realtor.agency.toLowerCase().includes(searchLower);

      const matchesBeds = reel.property.beds >= Number(filters.beds);
      const matchesBaths = reel.property.baths >= Number(filters.baths);
      
      const matchesPrice = reel.property.price >= minPriceNum && reel.property.price <= maxPriceNum;

      return matchesSearch && matchesBaths && matchesBeds && matchesPrice;
    });
  }, [reels, filters]);


  const renderContent = () => {
    switch (view) {
      case 'feed':
        return (
          <div className="w-full h-full flex flex-col items-center">
            <FilterComponent onFilterChange={setFilters} initialFilters={filters} />
            <ReelsFeed reels={filteredReels} />
          </div>
        );
      case 'submit':
        return <SubmitReelForm onReelSubmit={handleReelSubmit} />;
      case 'home':
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col items-center">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow w-full h-full flex justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
