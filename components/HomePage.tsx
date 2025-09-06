
import React from 'react';

interface HomePageProps {
  setView: (view: 'home' | 'feed' | 'submit') => void;
}

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-house-with-a-certain-modern-style-4250-large.mp4"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-house-with-a-certain-modern-style-4250-large.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-xl">
          Find Your Next Home,
          <span className="block mt-2 md:mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            One Reel at a Time.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200 drop-shadow-lg">
          Experience properties like never before. webroker brings you an immersive, video-first journey into Delhi NCR's finest homes, presented by top real estate agents.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setView('feed')}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Browse Properties
          </button>
          <button
            onClick={() => setView('submit')}
            className="w-full sm:w-auto px-8 py-3 bg-white/20 text-white backdrop-blur-sm font-semibold rounded-lg shadow-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Share Your Reel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;