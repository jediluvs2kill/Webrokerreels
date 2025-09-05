
import React, { useState, useEffect } from 'react';
import type { Reel, FavoriteList } from '../types';
import CloseIcon from './icons/CloseIcon';

interface FavoritesModalProps {
    reel: Reel;
    lists: FavoriteList[];
    onClose: () => void;
    onUpdateFavorites: (reelId: string, selectedListIds: string[]) => void;
    onCreateList: (name: string) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ reel, lists, onClose, onUpdateFavorites, onCreateList }) => {
    const [selectedLists, setSelectedLists] = useState<string[]>([]);
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        // Pre-select lists that already contain this reel
        const initialSelected = lists
            .filter(list => list.reelIds.includes(reel.id))
            .map(list => list.id);
        setSelectedLists(initialSelected);
    }, [reel, lists]);

    const handleCheckboxChange = (listId: string) => {
        setSelectedLists(prev => 
            prev.includes(listId) 
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const handleSave = () => {
        onUpdateFavorites(reel.id, selectedLists);
        onClose();
    };
    
    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if(newListName.trim()){
            onCreateList(newListName.trim());
            setNewListName('');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="favorites-heading"
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 id="favorites-heading" className="text-xl font-bold">Add to Favorites</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {lists.length > 0 ? lists.map(list => (
                        <label key={list.id} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded-md cursor-pointer hover:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={selectedLists.includes(list.id)}
                                onChange={() => handleCheckboxChange(list.id)}
                                className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="font-medium">{list.name}</span>
                        </label>
                    )) : (
                        <p className="text-gray-400 text-sm text-center py-4">No lists created yet. Create one below!</p>
                    )}
                </div>

                <form onSubmit={handleCreateList} className="mt-4 pt-4 border-t border-gray-700">
                    <label htmlFor="new-list-name" className="block text-sm font-medium text-gray-300 mb-2">Create a new list</label>
                    <div className="flex gap-2">
                        <input
                            id="new-list-name"
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="e.g., Dream Homes"
                            className="flex-grow px-3 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-gray-500" disabled={!newListName.trim()}>
                            Create
                        </button>
                    </div>
                </form>

                <button onClick={handleSave} className="w-full mt-6 py-2.5 px-4 bg-green-600 font-semibold rounded-lg shadow-md hover:bg-green-700 transition">
                    Save to Lists
                </button>
            </div>
        </div>
    );
};

export default FavoritesModal;
