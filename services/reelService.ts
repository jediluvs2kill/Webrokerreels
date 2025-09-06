
import type { Reel, UserVotes, Realtor } from '../types';
import { REELS_DATA, USER_VOTES_DATA, DEFAULT_USER } from '../constants';

const REELS_STORAGE_KEY = 'webroker_reels';
const VOTES_STORAGE_KEY_PREFIX = 'webroker_votes_';
const PROFILE_STORAGE_KEY_PREFIX = 'webroker_profile_';

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

const getProfileFromStorage = (userId: string): Realtor => {
    try {
        const key = `${PROFILE_STORAGE_KEY_PREFIX}${userId}`;
        const storedProfile = localStorage.getItem(key);
        if (storedProfile) {
            return JSON.parse(storedProfile);
        }
        if (userId === DEFAULT_USER.id) {
            localStorage.setItem(key, JSON.stringify(DEFAULT_USER));
            return DEFAULT_USER;
        }
        // Fallback for other users from REELS_DATA if they exist
        const anyReelFromUser = getReelsFromStorage().find(r => r.realtor.id === userId);
        if (anyReelFromUser) {
            return anyReelFromUser.realtor;
        }
    } catch(e) {
        console.error("Failed to read profile from localStorage", e);
    }
    // Absolute fallback
    return { ...DEFAULT_USER, id: userId, name: `User ${userId.substring(0,5)}` };
};

const saveProfileToStorage = (profile: Realtor) => {
    try {
        localStorage.setItem(`${PROFILE_STORAGE_KEY_PREFIX}${profile.id}`, JSON.stringify(profile));
    } catch (e) {
        console.error("Failed to save profile to localStorage", e);
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

export const addReel = async (
    reelData: Omit<Reel, 'id' | 'createdAt' | 'submittedBy' | 'likes' | 'dislikes'>,
    userId: string
): Promise<Reel> => {
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
    // Ensure realtor ID is the current user's ID
    newReel.realtor.id = userId;

    const updatedReels = [newReel, ...allReels];
    saveReelsToStorage(updatedReels);
    // Also save/update the user's profile info from the submission
    saveProfileToStorage(newReel.realtor);
    return newReel;
};

export const updateRealtorInfo = async (updatedRealtor: Realtor): Promise<Reel[]> => {
    await mockDelay(300);
    const allReels = getReelsFromStorage();
    const updatedReels = allReels.map(reel => {
        if (reel.realtor.id === updatedRealtor.id) {
            return { ...reel, realtor: updatedRealtor };
        }
        return reel;
    });
    saveReelsToStorage(updatedReels);
    saveProfileToStorage(updatedRealtor);
    return updatedReels;
};

export const getRealtorProfile = async (userId: string): Promise<Realtor> => {
    await mockDelay(100);
    return getProfileFromStorage(userId);
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