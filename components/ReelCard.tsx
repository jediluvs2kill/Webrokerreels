
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Reel } from '../types';
import { generatePropertyInsights } from '../services/geminiService';
import BedIcon from './icons/BedIcon';
import BathIcon from './icons/BathIcon';
import AreaIcon from './icons/AreaIcon';
import LocationIcon from './icons/LocationIcon';
import HeartIcon from './icons/HeartIcon';
import ShareIcon from './icons/ShareIcon';
import ChatIcon from './icons/ChatIcon';
import SparklesIcon from './icons/SparklesIcon';
import BrokerIcon from './icons/BrokerIcon';
import OwnerIcon from './icons/OwnerIcon';
import CloseIcon from './icons/CloseIcon';

interface ReelCardProps {
  reel: Reel;
}

// --- LocalStorage Helper Functions ---
const LIKED_REELS_KEY = 'webroker_liked_reels';

const getLikedReels = (): string[] => {
  try {
    const likedReels = localStorage.getItem(LIKED_REELS_KEY);
    return likedReels ? JSON.parse(likedReels) : [];
  } catch (error) {
    console.error("Failed to parse liked reels from localStorage", error);
    return [];
  }
};

const saveLikedReels = (reelIds: string[]) => {
  try {
    localStorage.setItem(LIKED_REELS_KEY, JSON.stringify(reelIds));
  } catch (error) {
    console.error("Failed to save liked reels to localStorage", error);
  }
};
// --- End Helper Functions ---


// Helper function to format price
const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${price.toLocaleString('en-IN')}`;
};


const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAiInsight, setShowAiInsight] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1200); // Dummy base count
  const [showContactInfo, setShowContactInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const likedReels = getLikedReels();
    if (likedReels.includes(reel.id)) {
      setIsLiked(true);
    }
  }, [reel.id]);

  const handleLikeClick = () => {
    const likedReels = getLikedReels();
    const newLikedState = !isLiked;
    
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
      saveLikedReels([...likedReels, reel.id]);
    } else {
      saveLikedReels(likedReels.filter(id => id !== reel.id));
    }
  };

  const handleVideoClick = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleGenerateInsight = async () => {
    if (aiInsight) {
        setShowAiInsight(!showAiInsight);
        return;
    }
    setIsLoading(true);
    setShowAiInsight(true);
    const insight = await generatePropertyInsights(reel.property);
    setAiInsight(insight);
    setIsLoading(false);
  };
  
  const formatLikeCount = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  return (
    <section className="relative h-full w-full snap-start flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        src={reel.videoUrl}
        loop
        className="w-full h-full object-cover"
        aria-label={`Property reel for ${reel.property.address}`}
      ></video>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {showContactInfo && (
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20"
          onClick={() => setShowContactInfo(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-heading"
        >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-center relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => setShowContactInfo(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close contact info"
                >
                    <CloseIcon />
                </button>
                <img src={reel.realtor.avatarUrl} alt={reel.realtor.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500" />
                <h3 id="contact-heading" className="text-xl font-bold">{reel.realtor.name}</h3>
                <p className="text-sm text-gray-400">{reel.realtor.agency}</p>
                <div className="my-4 pt-4 border-t border-gray-700 text-left space-y-3">
                    <p className="flex items-center gap-3">
                        <span className="font-semibold text-gray-300 w-16">Role:</span> 
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300">{reel.realtor.type}</span>
                    </p>
                    <p className="flex items-center gap-3">
                        <span className="font-semibold text-gray-300 w-16">Contact:</span> 
                        <a href={`tel:${reel.realtor.contact}`} className="text-blue-400 hover:underline">{reel.realtor.contact}</a>
                    </p>
                </div>
                <a href={`tel:${reel.realtor.contact}`} className="w-full inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Call Now</a>
            </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-end">
          {/* Left Side: Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={reel.realtor.avatarUrl} alt={reel.realtor.name} className="w-12 h-12 rounded-full border-2 border-white" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-black" title={reel.realtor.type}>
                  {reel.realtor.type === 'Broker' ? <BrokerIcon /> : <OwnerIcon />}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{reel.realtor.name}</h3>
                <p className="text-sm text-gray-300">{reel.realtor.agency}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold flex items-center gap-2"><LocationIcon />{reel.property.address}</h4>
              <p className="text-2xl font-bold mt-1">{formatPrice(reel.property.price)}</p>
            </div>
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center gap-1.5"><BedIcon /> {reel.property.beds} Beds</span>
              <span className="flex items-center gap-1.5"><BathIcon /> {reel.property.baths} Baths</span>
              <span className="flex items-center gap-1.5"><AreaIcon /> {reel.property.area} sqft</span>
            </div>
          </div>
          {/* Right Side: Actions */}
          <div className="flex flex-col items-center space-y-5">
            <button 
              onClick={handleLikeClick} 
              className={`flex flex-col items-center transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}
              aria-label={isLiked ? 'Unlike reel' : 'Like reel'}
              aria-pressed={isLiked}
            >
              <HeartIcon isLiked={isLiked} />
              <span className="text-xs mt-1 font-semibold">{formatLikeCount(likeCount)}</span>
            </button>
            <button onClick={() => setShowContactInfo(true)} className="flex flex-col items-center">
              <ChatIcon />
              <span className="text-xs mt-1">Contact</span>
            </button>
            <button className="flex flex-col items-center">
              <ShareIcon />
              <span className="text-xs mt-1">Share</span>
            </button>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="mt-4">
            <button
                onClick={handleGenerateInsight}
                disabled={isLoading && !aiInsight}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:bg-gray-500"
            >
                <SparklesIcon />
                {isLoading ? 'Generating...' : (showAiInsight ? 'Hide AI Insight' : 'Show AI Insight')}
            </button>
            {showAiInsight && (
                <div className="mt-2 p-3 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-600">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-200">{aiInsight}</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default ReelCard;