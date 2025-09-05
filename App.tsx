
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import ReelsFeed from './components/ReelsFeed';
import HomePage from './components/HomePage';
import SubmitReelForm from './components/SubmitReelForm';
import FilterComponent, { Filters } from './components/FilterComponent';
import BrokerProfile from './components/BrokerProfile';
import FavoritesPage from './components/FavoritesPage';
import EditProfile from './components/EditProfile';
import FavoritesModal from './components/FavoritesModal';
import ShareModal from './components/ShareModal';
import { REELS_DATA } from './constants';
import * as favoritesService from './services/favoritesService';
import type { Reel, Realtor, FavoriteList } from './types';

type View = 'home' | 'feed' | 'submit' | 'profile' | 'favorites' | 'editProfile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [reels, setReels] = useState<Reel[]>(REELS_DATA);
  const [selectedRealtorId, setSelectedRealtorId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    beds: 0,
    baths: 0,
    minPrice: '',
    maxPrice: '',
  });

  // State for favorites
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [activeReelForFavorites, setActiveReelForFavorites] = useState<Reel | null>(null);

  // State for sharing
  const [shareableContent, setShareableContent] = useState<{ url: string; title: string; } | null>(null);
  
  // Simulate a logged-in user
  const [currentUserId] = useState<string>('realtor-1');
  
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Set main container height to window.innerHeight for mobile friendliness
  useEffect(() => {
    const setHeight = () => {
        if (mainContainerRef.current) {
            mainContainerRef.current.style.height = `${window.innerHeight}px`;
        }
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    setFavoriteLists(favoritesService.getFavoriteLists());
  }, []);
  
  // Handle deep linking from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as View;
    const realtorId = params.get('realtorId');
    const reelId = params.get('reelId');

    if (viewParam === 'profile' && realtorId) {
      handleViewProfile(realtorId);
    } else if (viewParam === 'feed' && reelId) {
      setView('feed');
      // The ReelsFeed component will handle scrolling to the reel
    } else if (viewParam) {
      setView(viewParam);
    }
  }, []);

  const handleReelSubmit = (newReel: Reel) => {
    setReels(prevReels => [newReel, ...prevReels]);
    setView('feed');
  };

  const handleViewProfile = (realtorId: string) => {
    setSelectedRealtorId(realtorId);
    setView('profile');
  };
  
  const handleProfileUpdate = (updatedRealtor: Realtor) => {
    // Update the realtor's information across all their reels
    const newReels = reels.map(reel => {
        if (reel.realtor.id === updatedRealtor.id) {
            return { ...reel, realtor: updatedRealtor };
        }
        return reel;
    });
    setReels(newReels);
    setView('profile'); // Go back to the profile view
  };

  // --- Favorites Handlers ---
  const handleOpenFavoritesModal = (reel: Reel) => {
    setActiveReelForFavorites(reel);
  };
  
  const handleCloseFavoritesModal = () => {
    setActiveReelForFavorites(null);
  };

  const handleUpdateFavorites = (reelId: string, listIds: string[]) => {
    const updatedLists = favoritesService.updateReelInLists(reelId, listIds);
    setFavoriteLists(updatedLists);
  };

  const handleCreateFavoriteList = (name: string) => {
    if (activeReelForFavorites) {
        const updatedLists = favoritesService.createListAndAddReel(name, activeReelForFavorites.id);
        setFavoriteLists(updatedLists);
    }
  };
  
  const isReelInAnyFavoriteList = (reelId: string): boolean => {
      return favoriteLists.some(list => list.reelIds.includes(reelId));
  };

  // --- Sharing Handlers ---
  const handleShare = async (url: string, title: string) => {
      if (navigator.share) {
          try {
              await navigator.share({ title, url });
          } catch (error) {
              console.error('Error sharing:', error);
          }
      } else {
          setShareableContent({ url, title });
      }
  };
  
  const handleShareReel = (reel: Reel) => {
    const url = `${window.location.origin}?view=feed&reelId=${reel.id}`;
    handleShare(url, `Check out this property: ${reel.property.address}`);
  };

  const handleShareProfile = (realtor: Realtor) => {
      const url = `${window.location.origin}?view=profile&realtorId=${realtor.id}`;
      handleShare(url, `Check out ${realtor.name}'s listings on webroker`);
  };

  const currentUser = useMemo(() => {
    return reels.find(reel => reel.realtor.id === currentUserId)?.realtor ?? null;
  }, [reels, currentUserId]);

  const selectedRealtor = useMemo(() => {
    if (!selectedRealtorId) return null;
    return reels.find(reel => reel.realtor.id === selectedRealtorId)?.realtor ?? null;
  }, [selectedRealtorId, reels]);

  const realtorReels = useMemo(() => {
    if (!selectedRealtorId) return [];
    return reels.filter(reel => reel.realtor.id === selectedRealtorId);
  }, [selectedRealtorId, reels]);


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
            <ReelsFeed 
                reels={filteredReels} 
                onViewProfile={handleViewProfile}
                onOpenFavoritesModal={handleOpenFavoritesModal}
                isReelInFavorites={isReelInAnyFavoriteList}
                onShare={handleShareReel}
            />
          </div>
        );
      case 'submit':
        return <SubmitReelForm onReelSubmit={handleReelSubmit} />;
      case 'profile':
        if (!selectedRealtor) {
          setView('feed'); // Fallback if realtor not found
          return null;
        }
        return <BrokerProfile realtor={selectedRealtor} reels={realtorReels} onShare={handleShareProfile}/>;
      case 'favorites':
        return <FavoritesPage allReels={reels} favoriteLists={favoriteLists} setFavoriteLists={setFavoriteLists} />
      case 'editProfile':
        if (!currentUser) {
            setView('feed'); // Fallback if user data not found
            return null;
        }
        return <EditProfile 
            currentUser={currentUser} 
            onUpdateProfile={handleProfileUpdate}
            onCancel={() => setView('profile')}
        />;
      case 'home':
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div ref={mainContainerRef} className="bg-black text-white w-screen overflow-y-hidden flex flex-col items-center">
      <Header 
        currentView={view} 
        setView={setView} 
        onEditProfile={() => setView('editProfile')}
        isOwnProfile={view === 'profile' && selectedRealtorId === currentUserId}
      />
      <main className="flex-grow w-full h-full flex justify-center">
        {renderContent()}
      </main>
      
      {activeReelForFavorites && (
        <FavoritesModal
          reel={activeReelForFavorites}
          lists={favoriteLists}
          onClose={handleCloseFavoritesModal}
          onUpdateFavorites={handleUpdateFavorites}
          onCreateList={handleCreateFavoriteList}
        />
      )}

      {shareableContent && (
        <ShareModal 
            url={shareableContent.url}
            title={shareableContent.title}
            onClose={() => setShareableContent(null)}
        />
      )}
    </div>
  );
};

export default App;
