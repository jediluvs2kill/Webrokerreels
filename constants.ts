import type { Reel, UserVotes, Realtor } from './types';

// This file now serves as a mock database for the MVP.
// Data will be loaded from here into localStorage by the reelService.

export const DEFAULT_USER: Realtor = {
  id: 'user-_CURRENT_USER_',
  name: 'Jane Doe',
  agency: 'Prestige Properties',
  contact: '+91 98765 43210',
  avatarUrl: `https://i.pravatar.cc/150?u=user-_CURRENT_USER_`,
  type: 'Broker',
};

// --- New Realtor Profiles for the provided data ---
const rohanSharma: Realtor = {
  id: 'user-2',
  name: 'Rohan Sharma',
  agency: 'Luxury Homes Realty',
  contact: '+91 99999 88888',
  avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
  type: 'Broker',
};

const priyaSingh: Realtor = {
  id: 'user-3',
  name: 'Priya Singh',
  agency: 'Elite Estates',
  contact: '+91 88888 77777',
  avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
  type: 'Owner',
};

const adityaVerma: Realtor = {
  id: 'user-4',
  name: 'Aditya Verma',
  agency: 'Prime Properties Delhi',
  contact: '+91 77777 66666',
  avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
  type: 'Broker',
};

const nehaKapoor: Realtor = {
  id: 'user-5',
  name: 'Neha Kapoor',
  agency: 'The Real Estate Co.',
  contact: '+91 66666 55555',
  avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
  type: 'Owner',
};


export const REELS_DATA: Reel[] = [
  {
    id: 'reel-4',
    videoUrl: 'https://www.instagram.com/reel/DOLO4RzAd_M/',
    sourceType: 'instagram',
    createdAt: 1722632400000, // Aug 2, 2024
    submittedBy: adityaVerma.id,
    likes: 310,
    dislikes: 8,
    property: {
      address: 'The Manvi Estate, Gurgaon',
      price: 800000000, // 80 Cr (Estimated)
      beds: 10,
      baths: 12,
      sqft: 15000, // Estimated
    },
    realtor: adityaVerma,
  },
  {
    id: 'reel-5',
    videoUrl: 'https://www.instagram.com/reel/DNANVIJB7CO/',
    sourceType: 'instagram',
    createdAt: 1722546000000, // Aug 1, 2024
    submittedBy: nehaKapoor.id,
    likes: 450,
    dislikes: 12,
    property: {
      address: 'Anantam, New Delhi',
      price: 180000000, // 18 Cr (Estimated)
      beds: 4,
      baths: 4,
      sqft: 4000, // Estimated
    },
    realtor: nehaKapoor,
  },
  {
    id: 'reel-6',
    videoUrl: 'https://www.instagram.com/reel/DNA1EzCo7wJ/',
    sourceType: 'instagram',
    createdAt: 1722459600000, // July 31, 2024
    submittedBy: rohanSharma.id,
    likes: 180,
    dislikes: 5,
    property: {
      address: 'South Extension–2, New Delhi (Rental)',
      price: 500000, // 5 Lac / month (Estimated as rental)
      beds: 3,
      baths: 3,
      sqft: 4500, // 500 sq yd
    },
    realtor: rohanSharma,
  },
   {
    id: 'reel-7',
    videoUrl: 'https://www.instagram.com/reel/DLAIDNRTwad/',
    sourceType: 'instagram',
    createdAt: 1722373200000, // July 30, 2024
    submittedBy: priyaSingh.id,
    likes: 520,
    dislikes: 15,
    property: {
      address: 'South Delhi Luxury Villa',
      price: 450000000, // 45 Cr (Estimated)
      beds: 6,
      baths: 7, // Rounded from 7.5
      sqft: 8000, // Estimated
    },
    realtor: priyaSingh,
  },
  {
    id: 'reel-8',
    videoUrl: 'https://www.instagram.com/reel/DKvt9_HSgUH/',
    sourceType: 'instagram',
    createdAt: 1722286800000, // July 29, 2024
    submittedBy: adityaVerma.id,
    likes: 680,
    dislikes: 20,
    property: {
      address: '1200 sq-yd Farmhouse, South Delhi',
      price: 350000000, // 35 Cr (Estimated)
      beds: 5,
      baths: 6,
      sqft: 10800, // 1200 sq yd
    },
    realtor: adityaVerma,
  },
  {
    id: 'reel-9',
    videoUrl: 'https://www.instagram.com/reel/DGDjc9QPYcw/',
    sourceType: 'instagram',
    createdAt: 1722200400000, // July 28, 2024
    submittedBy: nehaKapoor.id,
    likes: 812,
    dislikes: 25,
    property: {
      address: 'Palm House Villa (Elite), South Delhi',
      price: 750000000, // 75 Cr (Estimated)
      beds: 6,
      baths: 8,
      sqft: 19800, // 2200 sq yd
    },
    realtor: nehaKapoor,
  },
  {
    id: 'reel-10',
    videoUrl: 'https://www.instagram.com/reel/DLT8l12T6qt/',
    sourceType: 'instagram',
    createdAt: 1722114000000, // July 27, 2024
    submittedBy: rohanSharma.id,
    likes: 330,
    dislikes: 9,
    property: {
      address: 'Sun-Drenched Luxury, South Delhi',
      price: 160000000, // 16 Cr (Estimated)
      beds: 4,
      baths: 5,
      sqft: 3500, // Estimated
    },
    realtor: rohanSharma,
  }
];

export const USER_VOTES_DATA: UserVotes = {
    'reel-4': 'like',
    'reel-7': 'like',
    'reel-8': 'dislike',
};
