
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import ReelsFeed from './components/ReelsFeed';
import HomePage from './components/HomePage';
import SubmitReelForm from './components/SubmitReelForm';
import FavoritesPage from './components/FavoritesPage';
import FavoritesModal from './components/FavoritesModal';
import ShareModal from './components/ShareModal';
import BrokerProfile from './components/BrokerProfile';
import EditProfile from './components/EditProfile';
import * as favoritesService from './services/favoritesService';
import * as reelService from './services/reelService';
import type { Reel, FavoriteList, UserVotes, Realtor } from './types';
import { DEFAULT_USER } from './constants';

type View = 'home' | 'feed' | 'submit' | 'favorites' | 'myReels' | 'profile' | 'editProfile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for favorites
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [activeReelForFavorites, setActiveReelForFavorites] = useState<Reel | null>(null);

  // State for sharing
  const [shareableContent, setShareableContent] = useState<{ url: string; title: string; } | null>(null);
  
  // State for error handling
  const [error, setError] = useState<string | null>(null);
  
  // Simulate a logged-in user
  const [currentUserId] = useState<string>(DEFAULT_USER.id);
  const [currentUserProfile, setCurrentUserProfile] = useState<Realtor>(DEFAULT_USER);
  const [activeRealtor, setActiveRealtor] = useState<Realtor | null>(null);
  
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Fetch initial data from local service
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [fetchedReels, fetchedVotes, profile] = await Promise.all([
                reelService.getReels(),
                reelService.getUserVotes(currentUserId),
                reelService.getRealtorProfile(currentUserId),
            ]);
            setReels(fetchedReels);
            setUserVotes(fetchedVotes);
            setCurrentUserProfile(profile);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            setError("Could not load properties. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [currentUserId]);

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
    const reelId = params.get('reelId');

    if (viewParam === 'feed' && reelId) {
      setView('feed');
      // The ReelsFeed component will handle scrolling to the reel
    } else if (viewParam) {
      setView(viewParam);
    }
  }, []);

  const handleAddReel = async (newReelData: Omit<Reel, 'id' | 'createdAt' | 'submittedBy' | 'likes' | 'dislikes'>) => {
    try {
        const newReel = await reelService.addReel(newReelData, currentUserId);
        setReels(prevReels => [newReel, ...prevReels]);
        // Also update the current user's profile info if it was part of the submission
        if (newReel.realtor.id === currentUserId) {
            setCurrentUserProfile(newReel.realtor);
        }
        setView('feed');
    } catch (error) {
        console.error("Error submitting reel:", error);
        setError("There was an error submitting your reel. Please try again.");
    }
  };

  const handleUpdateProfile = async (updatedData: Realtor) => {
    try {
      const updatedReels = await reelService.updateRealtorInfo(updatedData);
      setReels(updatedReels);
      setCurrentUserProfile(updatedData);
      setView('profile');
      setActiveRealtor(updatedData);
    } catch(err) {
      console.error("Failed to update profile", err);
      setError("Your profile could not be updated. Please try again.");
    }
  };

  const handleViewProfile = (realtor: Realtor) => {
    setActiveRealtor(realtor);
    setView('profile');
  };

  const handleVote = async (reelId: string, newVote: 'like' | 'dislike') => {
      const currentVote = userVotes[reelId] || null;
      if (currentVote === newVote) return; // No change

      // Optimistic UI update
      const originalReels = [...reels];
      const originalVotes = {...userVotes};

      setReels(reels.map(r => {
        if (r.id === reelId) {
          const reelCopy = {...r};
          // Decrement old vote if exists
          if (currentVote === 'like') reelCopy.likes--;
          if (currentVote === 'dislike') reelCopy.dislikes--;
          // Increment new vote
          if (newVote === 'like') reelCopy.likes++;
          if (newVote === 'dislike') reelCopy.dislikes++;
          return reelCopy;
        }
        return r;
      }));
      setUserVotes(prev => ({...prev, [reelId]: newVote}));

      try {
        await reelService.updateVote(currentUserId, reelId, currentVote, newVote);
      } catch (err) {
        console.error("Failed to update vote:", err);
        setError("Your vote could not be saved. Please try again.");
        // Revert on failure
        setReels(originalReels);
        setUserVotes(originalVotes);
      }
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
    const title = `Check out this property: ${reel.property.address}`;
    handleShare(url, title);
  };

  const handleShareRealtor = (realtor: Realtor) => {
    const url = window.location.origin; // Simplified for now
    const title = `Check out ${realtor.name}'s profile on webroker!`;
    handleShare(url, title);
  };


  const myReels = useMemo(() => {
    return reels.filter(reel => reel.submittedBy === currentUserId);
  }, [reels, currentUserId]);

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }
    
    switch (view) {
      case 'feed':
        return (
          <div className="w-full h-full flex flex-col items-center">
            <ReelsFeed 
                reels={reels}
                onOpenFavoritesModal={handleOpenFavoritesModal}
                isReelInFavorites={isReelInAnyFavoriteList}
                onShare={handleShareReel}
                onVote={handleVote}
                userVotes={userVotes}
                onViewProfile={handleViewProfile}
            />
          </div>
        );
      case 'myReels':
        return (
            <div className="w-full h-full flex flex-col items-center">
                <ReelsFeed 
                    reels={myReels} 
                    onOpenFavoritesModal={handleOpenFavoritesModal}
                    isReelInFavorites={isReelInAnyFavoriteList}
                    onShare={handleShareReel}
                    onVote={handleVote}
                    userVotes={userVotes}
                    onViewProfile={handleViewProfile}
                />
            </div>
        );
      case 'submit':
        return <SubmitReelForm onAddReel={handleAddReel} currentUserProfile={currentUserProfile} />;
      case 'favorites':
        return <FavoritesPage allReels={reels} favoriteLists={favoriteLists} setFavoriteLists={setFavoriteLists} />
      case 'profile':
        if (!activeRealtor) {
          setView('feed');
          return null;
        }
        const profileReels = reels.filter(reel => reel.realtor.id === activeRealtor.id);
        return <BrokerProfile realtor={activeRealtor} reels={profileReels} onShare={handleShareRealtor} />;
      case 'editProfile':
        if (!currentUserProfile) return null;
        return <EditProfile 
                  currentUser={currentUserProfile} 
                  onUpdateProfile={handleUpdateProfile} 
                  onCancel={() => {
                    setActiveRealtor(currentUserProfile);
                    setView('profile');
                  }} 
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
        isMyProfile={activeRealtor?.id === currentUserId && view === 'profile'}
      />
      <main className="relative flex-grow w-full h-full flex justify-center">
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
      
      {error && (
        <div 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 w-11/12 max-w-md p-4 bg-red-600 text-white rounded-lg shadow-lg"
          role="alert"
        >
          <p className="text-sm font-medium">{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="p-1 rounded-full hover:bg-red-700 transition-colors flex-shrink-0"
            aria-label="Dismiss error message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;