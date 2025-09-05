
import React from 'react';
import MyFavoritesIcon from './icons/MyFavoritesIcon';

type View = 'home' | 'feed' | 'submit' | 'profile' | 'favorites' | 'editProfile';
interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onEditProfile: () => void;
  isOwnProfile: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, onEditProfile, isOwnProfile }) => {
  const isHomePage = currentView === 'home';

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
            {isOwnProfile && (
              <button
                onClick={onEditProfile}
                className="px-4 py-1.5 bg-blue-600 text-white backdrop-blur-sm rounded-md hover:bg-blue-700 transition text-sm font-semibold"
              >
                Edit Profile
              </button>
            )}
            <button 
              onClick={() => setView(currentView === 'profile' || currentView === 'favorites' || currentView === 'editProfile' ? 'feed' : 'home')} 
              className="px-4 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-md hover:bg-white/30 transition text-sm font-semibold"
            >
              {currentView === 'profile' || currentView === 'favorites' || currentView === 'editProfile' ? '← Back to Feed' : 'Home'}
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;
