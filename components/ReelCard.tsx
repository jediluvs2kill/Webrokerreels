
import React from 'react';
import type { Reel, Realtor } from '../types';
import HeartIcon from './icons/HeartIcon';
import ShareIcon from './icons/ShareIcon';
import ThumbsUpIcon from './icons/BrokerIcon'; // Re-purposed for ThumbsUp
import ThumbsDownIcon from './icons/OwnerIcon'; // Re-purposed for ThumbsDown
import BedIcon from './icons/BedIcon';
import BathIcon from './icons/BathIcon';
import AreaIcon from './icons/AreaIcon';
import LocationIcon from './icons/LocationIcon';

interface ReelCardProps {
  reel: Reel;
  onOpenFavoritesModal: (reel: Reel) => void;
  isLiked: boolean; // Note: "isLiked" here refers to being in a favorites list
  onShare: (reel: Reel) => void;
  onVote: (reelId: string, vote: 'like' | 'dislike') => void;
  userVote: 'like' | 'dislike' | null;
  onViewProfile: (realtor: Realtor) => void;
}

// Helper to format large numbers into Lakhs & Crores
const formatPrice = (price: number): string => {
    if (price >= 10000000) { // 1 Crore
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) { // 1 Lakh
        return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
};

const ReelCard: React.FC<ReelCardProps> = ({ 
  reel, 
  onOpenFavoritesModal, 
  isLiked, 
  onShare, 
  onVote, 
  userVote,
  onViewProfile
}) => {
  const { property, realtor } = reel;

  const getInstagramEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
        const urlObject = new URL(url);
        // Instagram URLs can be /p/, /reel/, or /reels/
        const pathParts = urlObject.pathname.split('/').filter(p => p);
        if ((pathParts[0] === 'p' || pathParts[0] === 'reel' || pathParts[0] === 'reels') && pathParts[1]) {
            // By removing "/captioned", we get a cleaner embed without the post caption.
            return `https://www.instagram.com/${pathParts[0]}/${pathParts[1]}/embed/`;
        }
    } catch (e) {
        console.error("Invalid URL for Instagram reel", e);
    }
    return null;
  };
  
  const renderVideoPlayer = () => {
    const embedUrl = getInstagramEmbedUrl(reel.videoUrl);
    if (embedUrl) {
        return (
            <div className="w-full h-full bg-black overflow-hidden">
                <iframe 
                    src={embedUrl}
                    // We make the iframe taller than its container and use negative margins
                    // to hide the Instagram header and footer, creating a video-only experience.
                    // The extra height (120px) should cover both header (~60px) and footer (~60px).
                    // The negative top margin (-60px) pushes the header out of view.
                    className="w-full h-[calc(100%_+_120px)] -mt-[60px]"
                    frameBorder="0" 
                    allowFullScreen
                    scrolling="no"
                    title={`Instagram reel for ${property.address}`}
                ></iframe>
            </div>
        );
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white p-4 text-center">
            <p>Invalid or unsupported Instagram Reel link.</p>
        </div>
    );
  };

  return (
    <>
      {renderVideoPlayer()}
      
      {/* Action Buttons */}
      <div className="absolute bottom-24 sm:bottom-4 right-0 p-4 text-white">
        <div className="flex flex-col items-center space-y-5">
            <button 
              onClick={() => onVote(reel.id, 'like')} 
              className={`flex flex-col items-center transition-colors ${userVote === 'like' ? 'text-green-400' : 'text-white'}`}
              aria-label="Like this reel"
              aria-pressed={userVote === 'like'}
            >
              <ThumbsUpIcon />
              <span className="text-sm mt-1 font-semibold">{reel.likes}</span>
            </button>
            <button 
              onClick={() => onVote(reel.id, 'dislike')} 
              className={`flex flex-col items-center transition-colors ${userVote === 'dislike' ? 'text-red-400' : 'text-white'}`}
              aria-label="Dislike this reel"
              aria-pressed={userVote === 'dislike'}
            >
              <ThumbsDownIcon />
              <span className="text-sm mt-1 font-semibold">{reel.dislikes}</span>
            </button>
            <button 
              onClick={() => onOpenFavoritesModal(reel)} 
              className={`flex flex-col items-center transition-colors ${isLiked ? 'text-yellow-400' : 'text-white'}`}
              aria-label={isLiked ? 'Manage in favorites' : 'Add to favorites'}
              aria-pressed={isLiked}
            >
              <HeartIcon isLiked={isLiked} />
              <span className="text-xs mt-1 font-semibold">Favorite</span>
            </button>
            <button onClick={() => onShare(reel)} className="flex flex-col items-center">
              <ShareIcon />
              <span className="text-xs mt-1">Share</span>
            </button>
          </div>
      </div>
      
      {/* Property Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-[calc(100%-60px)]">
          <h3 className="font-bold text-2xl drop-shadow-lg">{formatPrice(property.price)}</h3>
          <p className="text-md flex items-center gap-1.5 drop-shadow">
            <LocationIcon />
            {property.address}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-md">
                <BedIcon /> <strong>{property.beds}</strong> <span className="hidden sm:inline">Beds</span>
              </div>
               <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-md">
                <BathIcon /> <strong>{property.baths}</strong> <span className="hidden sm:inline">Baths</span>
              </div>
               <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-md">
                <AreaIcon /> <strong>{property.sqft.toLocaleString('en-IN')}</strong> <span className="hidden sm:inline">sqft</span>
              </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <img src={realtor.avatarUrl} alt={realtor.name} className="w-8 h-8 rounded-full border-2 border-white/50" />
            <div>
                <p 
                    className="font-semibold text-sm cursor-pointer hover:underline"
                    onClick={() => onViewProfile(realtor)}
                >
                    {realtor.name}
                </p>
                <p className="text-xs text-gray-300">{realtor.agency}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReelCard;
