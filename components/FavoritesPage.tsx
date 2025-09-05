
import React, { useState } from 'react';
import type { Reel, FavoriteList } from '../types';
import * as favoritesService from '../services/favoritesService';
import { formatPrice } from './ReelCard';
import CloseIcon from './icons/CloseIcon';

interface FavoritesPageProps {
    allReels: Reel[];
    favoriteLists: FavoriteList[];
    setFavoriteLists: React.Dispatch<React.SetStateAction<FavoriteList[]>>;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ allReels, favoriteLists, setFavoriteLists }) => {
    const [selectedList, setSelectedList] = useState<FavoriteList | null>(null);

    const reelsByListId = (listId: string): Reel[] => {
        const list = favoriteLists.find(l => l.id === listId);
        if (!list) return [];
        return allReels.filter(reel => list.reelIds.includes(reel.id));
    };

    const handleDeleteList = (listId: string) => {
        if(window.confirm("Are you sure you want to delete this list?")){
            const updatedLists = favoritesService.deleteList(listId);
            setFavoriteLists(updatedLists);
            if(selectedList?.id === listId) {
                setSelectedList(null);
            }
        }
    };
    
    const handleVideoHover = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>, action: 'play' | 'pause') => {
        const video = e.target as HTMLVideoElement;
        if (action === 'play') {
            video.play().catch(err => console.log("Autoplay was prevented"));
        } else {
            video.pause();
            video.currentTime = 0; // Reset video to start
        }
    };

    if (selectedList) {
        const reels = reelsByListId(selectedList.id);
        return (
             <div className="w-full h-full flex flex-col items-center bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto">
                <div className="w-full max-w-4xl">
                    <button onClick={() => setSelectedList(null)} className="mb-4 text-blue-400 hover:underline">
                        &larr; Back to all lists
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">{selectedList.name} ({reels.length} properties)</h2>
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
                </div>
             </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">My Favorite Properties</h1>
                {favoriteLists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteLists.map(list => (
                            <div key={list.id} className="relative group bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                <button onClick={() => handleDeleteList(list.id)} className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all" aria-label={`Delete list ${list.name}`}>
                                    <CloseIcon />
                                </button>
                                <div onClick={() => setSelectedList(list)} className="cursor-pointer">
                                    <div className="p-5">
                                        <h3 className="text-lg sm:text-xl font-bold truncate">{list.name}</h3>
                                        <p className="text-gray-400">{list.reelIds.length} {list.reelIds.length === 1 ? 'property' : 'properties'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <h2 className="text-2xl font-semibold text-gray-300">No Favorite Lists Yet</h2>
                        <p className="mt-2 text-gray-500">
                            Click the heart icon on any property to start creating your personalized lists.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
