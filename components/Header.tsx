
import React from 'react';
import MyFavoritesIcon from './icons/MyFavoritesIcon';
import MyReelsIcon from './icons/MyReelsIcon';

type View = 'home' | 'feed' | 'submit' | 'favorites' | 'myReels' | 'profile' | 'editProfile';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  isMyProfile: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, isMyProfile }) => {
  const isHomePage = currentView === 'home';

  const handleBackClick = () => {
      if (['favorites', 'myReels', 'profile', 'editProfile'].includes(currentView)) {
          setView('feed');
      } else {
          setView('home');
      }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
      <h1 
        className="text-2xl font-bold text-white drop-shadow-lg cursor-pointer"
        onClick={() => setView('home')}
        aria-label="webroker home"
      >
        webroker
      </h1>
      {!isHomePage && (
        <div className="flex items-center gap-2">
            {isMyProfile && (
              <button
                onClick={() => setView('editProfile')}
                className="px-4 py-1.5 bg-blue-600 text-white backdrop-blur-sm rounded-md hover:bg-blue-700 transition text-sm font-semibold"
              >
                Edit Profile
              </button>
            )}
            <button
                onClick={() => setView('myReels')}
                className={`p-2 sm:px-3 sm:py-1.5 flex items-center gap-1.5 backdrop-blur-sm rounded-md transition text-sm font-semibold ${
                    currentView === 'myReels' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-current={currentView === 'myReels' ? 'page' : undefined}
                aria-label="My Reels"
            >
                <MyReelsIcon />
                <span className="hidden sm:inline">My Reels</span>
            </button>
            <button
                onClick={() => setView('favorites')}
                className={`p-2 sm:px-3 sm:py-1.5 flex items-center gap-1.5 backdrop-blur-sm rounded-md transition text-sm font-semibold ${
                    currentView === 'favorites' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-current={currentView === 'favorites' ? 'page' : undefined}
                aria-label="My Favorites"
            >
                <MyFavoritesIcon />
                <span className="hidden sm:inline">My Favorites</span>
            </button>
            <button 
              onClick={handleBackClick}
              className="px-4 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-md hover:bg-white/30 transition text-sm font-semibold"
            >
              {'← Back to Feed'}
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;