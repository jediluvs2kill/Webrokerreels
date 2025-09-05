import React from 'react';

interface HeaderProps {
  currentView: 'home' | 'feed' | 'submit';
  setView: (view: 'home' | 'feed' | 'submit') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
      <h1 
        className="text-2xl font-bold text-white drop-shadow-lg cursor-pointer"
        onClick={() => setView('home')}
        aria-label="webroker home"
      >
        webroker
      </h1>
      {currentView !== 'home' && (
        <button 
          onClick={() => setView('home')} 
          className="px-4 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-md hover:bg-white/30 transition text-sm font-semibold"
        >
          Home
        </button>
      )}
    </header>
  );
};

export default Header;
