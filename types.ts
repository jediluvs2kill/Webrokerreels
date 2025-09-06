
export interface Property {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
}

export interface Realtor {
  id: string;
  name: string;
  agency: string;
  contact: string;
  avatarUrl: string;
  type: 'Broker' | 'Owner';
}

export interface Reel {
  id: string;
  videoUrl: string;
  sourceType: 'instagram';
  createdAt: number;
  submittedBy: string; // The ID of the user who submitted the link
  likes: number;
  dislikes: number;
  property: Property;
  realtor: Realtor;
}

// This will store which reels a user has voted on, and how.
// e.g. { 'reel-1': 'like', 'reel-2': 'dislike' }
export interface UserVotes {
    [reelId: string]: 'like' | 'dislike';
}

export interface FavoriteList {
  id:string;
  name: string;
  reelIds: string[];
}

// FIX: Added Reaction type to resolve import error in FloatingReactions.tsx.
export interface Reaction {
  id: string;
  emoji: string;
}