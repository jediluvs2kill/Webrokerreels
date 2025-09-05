
import type { FavoriteList } from '../types';

const FAVORITES_KEY = 'webroker_favorite_lists';

// --- Read from localStorage ---
export const getFavoriteLists = (): FavoriteList[] => {
    try {
        const listsJSON = localStorage.getItem(FAVORITES_KEY);
        return listsJSON ? JSON.parse(listsJSON) : [];
    } catch (error) {
        console.error("Failed to parse favorite lists from localStorage", error);
        return [];
    }
};

// --- Write to localStorage ---
const saveFavoriteLists = (lists: FavoriteList[]): void => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(lists));
    } catch (error) {
        console.error("Failed to save favorite lists to localStorage", error);
    }
};

// --- Service Functions ---

/**
 * Updates which lists a specific reel belongs to.
 * @param reelId The ID of the reel to update.
 * @param listIds An array of list IDs the reel should now belong to.
 * @returns The updated array of all favorite lists.
 */
export const updateReelInLists = (reelId: string, listIds: string[]): FavoriteList[] => {
    const currentLists = getFavoriteLists();
    
    currentLists.forEach(list => {
        const reelIndex = list.reelIds.indexOf(reelId);
        const shouldBeInList = listIds.includes(list.id);

        if (reelIndex > -1 && !shouldBeInList) {
            // Remove it
            list.reelIds.splice(reelIndex, 1);
        } else if (reelIndex === -1 && shouldBeInList) {
            // Add it
            list.reelIds.push(reelId);
        }
    });

    saveFavoriteLists(currentLists);
    return currentLists;
};

/**
 * Creates a new, empty favorite list.
 * @param name The name for the new list.
 * @returns The updated array of all favorite lists.
 */
export const createNewList = (name: string): FavoriteList[] => {
    const currentLists = getFavoriteLists();
    
    const newList: FavoriteList = {
        id: `list-${Date.now()}`,
        name,
        reelIds: [],
    };

    const updatedLists = [...currentLists, newList];
    saveFavoriteLists(updatedLists);
    return updatedLists;
};

/**
 * Creates a new list and adds a reel to it in one operation.
 * @param name The name for the new list.
 * @param reelId The ID of the reel to add to the new list.
 * @returns The updated array of all favorite lists.
 */
export const createListAndAddReel = (name: string, reelId: string): FavoriteList[] => {
    const currentLists = getFavoriteLists();
    
    const newList: FavoriteList = {
        id: `list-${Date.now()}`,
        name,
        reelIds: [reelId],
    };

    const updatedLists = [...currentLists, newList];
    saveFavoriteLists(updatedLists);
    return updatedLists;
}

/**
 * Deletes a favorite list.
 * @param listId The ID of the list to delete.
 * @returns The updated array of all favorite lists.
 */
export const deleteList = (listId: string): FavoriteList[] => {
    const currentLists = getFavoriteLists();
    const updatedLists = currentLists.filter(list => list.id !== listId);
    saveFavoriteLists(updatedLists);
    return updatedLists;
}
