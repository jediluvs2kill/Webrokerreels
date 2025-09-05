
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
  onViewProfile: (realtorId: string) => void;
  onOpenFavoritesModal: (reel: Reel) => void;
  isLiked: boolean;
  onShare: (reel: Reel) => void;
}


// Helper function to format price
export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${price.toLocaleString('en-IN')}`;
};


const ReelCard: React.FC<ReelCardProps> = ({ reel, onViewProfile, onOpenFavoritesModal, isLiked, onShare }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAiInsight, setShowAiInsight] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isInstagramReel = reel.sourceType === 'instagram' || reel.videoUrl.includes('instagram.com');

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

  const getInstagramEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/').filter(p => p);
        if ((pathParts[0] === 'p' || pathParts[0] === 'reel') && pathParts[1]) {
            // Using /embed/captioned to include the original post's caption
            return `https://www.instagram.com/${pathParts[0]}/${pathParts[1]}/embed/captioned`;
        }
    } catch (e) {
        console.error("Invalid URL for Instagram reel", e);
    }
    return null;
  };

  const renderVideoPlayer = () => {
    if (isInstagramReel) {
        const embedUrl = getInstagramEmbedUrl(reel.videoUrl);
        if (embedUrl) {
            return (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    <iframe 
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0" 
                        allowFullScreen
                        scrolling="no"
                        title={`Instagram reel for ${reel.property.address}`}
                    ></iframe>
                </div>
            );
        }
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white p-4 text-center">
                <p>Invalid or unsupported Instagram Reel link.</p>
            </div>
        );
    }

    return (
        <>
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
        </>
    );
  };

  return (
    <>
      {renderVideoPlayer()}
      
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
            <button 
              onClick={() => onViewProfile(reel.realtor.id)}
              className="flex items-center space-x-3 text-left hover:opacity-80 transition-opacity"
              aria-label={`View profile for ${reel.realtor.name}`}
            >
              <div className="relative">
                <img src={reel.realtor.avatarUrl} alt={reel.realtor.name} className="w-12 h-12 rounded-full border-2 border-white" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-black" title={reel.realtor.type}>
                  {reel.realtor.type === 'Broker' ? <BrokerIcon /> : <OwnerIcon />}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">{reel.realtor.name}</h3>
                <p className="text-sm text-gray-300">{reel.realtor.agency}</p>
              </div>
            </button>
            <div>
              <h4 className="text-lg sm:text-xl font-semibold flex items-center gap-2"><LocationIcon />{reel.property.address}</h4>
              <p className="text-xl sm:text-2xl font-bold mt-1">{formatPrice(reel.property.price)}</p>
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
              onClick={() => onOpenFavoritesModal(reel)} 
              className={`flex flex-col items-center transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}
              aria-label={isLiked ? 'Manage in favorites' : 'Add to favorites'}
              aria-pressed={isLiked}
            >
              <HeartIcon isLiked={isLiked} />
              <span className="text-xs mt-1 font-semibold">Favorite</span>
            </button>
            <button onClick={() => setShowContactInfo(true)} className="flex flex-col items-center">
              <ChatIcon />
              <span className="text-xs mt-1">Contact</span>
            </button>
            <button onClick={() => onShare(reel)} className="flex flex-col items-center">
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
    </>
  );
};

export default ReelCard;