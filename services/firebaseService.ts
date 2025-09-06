import type { Reel, UserVotes } from '../types';
import { REELS_DATA, USER_VOTES_DATA } from '../constants';

const REELS_STORAGE_KEY = 'webroker_reels';
const VOTES_STORAGE_KEY_PREFIX = 'webroker_votes_';

// --- Helper Functions ---

const getReelsFromStorage = (): Reel[] => {
    try {
        const storedReels = localStorage.getItem(REELS_STORAGE_KEY);
        if (storedReels) {
            return JSON.parse(storedReels);
        }
        // If no reels in storage, initialize with dummy data
        localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(REELS_DATA));
        return REELS_DATA;
    } catch (e) {
        console.error("Failed to read reels from localStorage", e);
        return REELS_DATA; // Fallback to initial data
    }
};

const saveReelsToStorage = (reels: Reel[]) => {
    try {
        localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(reels));
    } catch (e) {
        console.error("Failed to save reels to localStorage", e);
    }
};

const getVotesFromStorage = (userId: string): UserVotes => {
     try {
        const storedVotes = localStorage.getItem(`${VOTES_STORAGE_KEY_PREFIX}${userId}`);
        if (storedVotes) {
            return JSON.parse(storedVotes);
        }
        // If no votes in storage for this user, initialize with dummy data for the default user
        if (userId === 'user-_CURRENT_USER_') {
            localStorage.setItem(`${VOTES_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(USER_VOTES_DATA));
            return USER_VOTES_DATA;
        }
        return {};
    } catch (e) {
        console.error("Failed to read votes from localStorage", e);
        return {};
    }
}

const saveVotesToStorage = (userId: string, votes: UserVotes) => {
    try {
        localStorage.setItem(`${VOTES_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(votes));
    } catch (e) {
        console.error("Failed to save votes to localStorage", e);
    }
};

// --- Mock Service Functions ---

// Simulate async API calls
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getReels = async (): Promise<Reel[]> => {
    await mockDelay(500); // Simulate network latency
    const reels = getReelsFromStorage();
    // Sort by creation date, descending
    return reels.sort((a, b) => b.createdAt - a.createdAt);
};

// FIX: Updated function signature and implementation to match the current Reel type, which requires `property` and `realtor` data. The function now accepts a `reelData` object.
export const addReel = async (reelData: Omit<Reel, 'id' | 'createdAt' | 'submittedBy' | 'likes' | 'dislikes'>, userId: string): Promise<Reel> => {
    await mockDelay(500);
    const allReels = getReelsFromStorage();
    const newReel: Reel = {
        ...reelData,
        id: `reel-${Date.now()}`,
        submittedBy: userId,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
    };
    const updatedReels = [newReel, ...allReels];
    saveReelsToStorage(updatedReels);
    return newReel;
};

export const getUserVotes = async (userId: string): Promise<UserVotes> => {
    await mockDelay(100);
    if (!userId) return {};
    return getVotesFromStorage(userId);
};

export const updateVote = async (userId: string, reelId: string, currentVote: 'like' | 'dislike' | null, newVote: 'like' | 'dislike') => {
    await mockDelay(200);
    const allReels = getReelsFromStorage();
    const userVotes = getVotesFromStorage(userId);

    const reelIndex = allReels.findIndex(r => r.id === reelId);
    if (reelIndex === -1) {
        throw new Error("Reel not found");
    }

    const reel = allReels[reelIndex];

    // Decrement old vote count
    if (currentVote === 'like') reel.likes = Math.max(0, reel.likes - 1);
    if (currentVote === 'dislike') reel.dislikes = Math.max(0, reel.dislikes - 1);

    // Increment new vote count
    if (newVote === 'like') reel.likes += 1;
    if (newVote === 'dislike') reel.dislikes += 1;
    
    // Update and save reels
    allReels[reelIndex] = reel;
    saveReelsToStorage(allReels);

    // Update and save user votes
    userVotes[reelId] = newVote;
    saveVotesToStorage(userId, userVotes);
    
    return;
};