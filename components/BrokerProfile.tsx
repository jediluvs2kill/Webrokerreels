
import React from 'react';
import type { Reel, Realtor } from '../types';
import BrokerIcon from './icons/BrokerIcon';
import OwnerIcon from './icons/OwnerIcon';
import ShareIcon from './icons/ShareIcon';
import { formatPrice } from './ReelCard'; 

interface BrokerProfileProps {
  realtor: Realtor;
  reels: Reel[];
  onShare: (realtor: Realtor) => void;
}

const BrokerProfile: React.FC<BrokerProfileProps> = ({ realtor, reels, onShare }) => {
    const handleVideoHover = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>, action: 'play' | 'pause') => {
        const video = e.target as HTMLVideoElement;
        if (action === 'play') {
            video.play().catch(err => console.log("Autoplay was prevented"));
        } else {
            video.pause();
            video.currentTime = 0; // Reset video to start
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="w-full max-w-4xl">
                {/* Profile Header */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-800 rounded-lg shadow-lg">
                    <img src={realtor.avatarUrl} alt={realtor.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-blue-500" />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold">{realtor.name}</h2>
                        <p className="text-lg text-gray-400">{realtor.agency}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                           {realtor.type === 'Broker' ? <BrokerIcon /> : <OwnerIcon />}
                           <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-300 font-medium">{realtor.type}</span>
                        </div>
                    </div>
                    <div className="sm:ml-auto flex flex-col items-center sm:items-end gap-2 mt-4 sm:mt-0">
                         <p className="text-gray-300">Contact</p>
                         <a href={`tel:${realtor.contact}`} className="text-lg font-semibold text-blue-400 hover:underline">{realtor.contact}</a>
                         <a href={`tel:${realtor.contact}`} className="w-full sm:w-auto mt-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center">
                            Call Now
                         </a>
                    </div>
                    <button 
                        onClick={() => onShare(realtor)}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Share this profile"
                    >
                        <ShareIcon />
                    </button>
                </div>

                {/* Reels Grid */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
                        {`Listings (${reels.length})`}
                    </h3>
                    {reels.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {reels.map(reel => (
                                <div key={reel.id} className="group relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden shadow-md">
                                    <video 
                                        src={reel.videoUrl} 
                                        className="w-full h-full object-cover" 
                                        muted 
                                        loop
                                        playsInline
                                        onMouseEnter={e => handleVideoHover(e, 'play')}
                                        onMouseLeave={e => handleVideoHover(e, 'pause')}
                                        aria-label={`Video thumbnail for ${reel.property.address}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                                        <p className="text-white font-semibold text-sm truncate">{reel.property.address}</p>
                                        <p className="text-white font-bold text-lg">{formatPrice(reel.property.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No listings found for this broker.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrokerProfile;
