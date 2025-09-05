
import type { Reel } from './types';

export const REELS_DATA: Reel[] = [
  {
    id: 'reel-1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-and-luxurious-house-with-a-pool-39833-large.mp4',
    realtor: {
      id: 'realtor-1',
      name: 'Anjali Sharma',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor1',
      agency: 'Prestige Properties',
      type: 'Broker',
      contact: '+91 98765 43210'
    },
    property: {
      address: 'DLF Phase 5, Gurgaon',
      price: 52000000, // 5.2 Cr
      beds: 4,
      baths: 5,
      area: 3200,
    },
  },
  {
    id: 'reel-2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-and-high-end-apartment-in-a-condominium-40487-large.mp4',
    realtor: {
      id: 'realtor-2',
      name: 'Rohan Verma',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor2',
      agency: 'Elite Homes',
      type: 'Broker',
      contact: '+91 91234 56789'
    },
    property: {
      address: 'Sector 45, Noida',
      price: 21000000, // 2.1 Cr
      beds: 3,
      baths: 3,
      area: 1850,
    },
  },
  {
    id: 'reel-3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-family-walking-in-front-of-their-new-house-39798-large.mp4',
    realtor: {
      id: 'realtor-3',
      name: 'Priya Singh',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor3',
      agency: 'NCR Realty Kings',
      type: 'Broker',
      contact: '+91 87654 32109'
    },
    property: {
      address: 'Vasant Kunj, New Delhi',
      price: 75000000, // 7.5 Cr
      beds: 5,
      baths: 6,
      area: 4500,
    },
  },
  {
    id: 'reel-4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-house-with-a-certain-modern-style-4250-large.mp4',
    realtor: {
      id: 'realtor-4',
      name: 'Karan Malhotra',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor4',
      agency: 'Self-listed',
      type: 'Owner',
      contact: '+91 76543 21098'
    },
    property: {
      address: 'Greater Kailash, New Delhi',
      price: 120000000, // 12 Cr
      beds: 6,
      baths: 7,
      area: 6000,
    },
  },
  {
    id: 'reel-5',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-house-with-a-swimming-pool-4263-large.mp4',
    realtor: {
      id: 'realtor-5',
      name: 'Sameer Gupta',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor5',
      agency: 'Prestige Properties',
      type: 'Broker',
      contact: '+91 65432 10987'
    },
    property: {
      address: 'Sector 15, Faridabad',
      price: 15000000, // 1.5 Cr
      beds: 3,
      baths: 2,
      area: 1500,
    },
  },
  {
    id: 'reel-6',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-in-a-quiet-and-beautiful-neighborhood-4257-large.mp4',
    realtor: {
      id: 'realtor-2', // Rohan Verma from Elite Homes again
      name: 'Rohan Verma',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor2',
      agency: 'Elite Homes',
      type: 'Broker',
      contact: '+91 91234 56789'
    },
    property: {
      address: 'Indirapuram, Ghaziabad',
      price: 38000000, // 3.8 Cr
      beds: 4,
      baths: 4,
      area: 2500,
    },
  },
   {
    id: 'reel-7',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-big-house-with-a-garden-and-a-stone-path-4261-large.mp4',
    realtor: {
      id: 'realtor-6',
      name: 'Sunita Devi',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor6',
      agency: 'Self-listed',
      type: 'Owner',
      contact: '+91 99988 77665'
    },
    property: {
      address: 'Saket, New Delhi',
      price: 9500000, // 95 Lakhs
      beds: 2,
      baths: 2,
      area: 1100,
    },
  },
  {
    id: 'reel-8',
    videoUrl: 'https://www.instagram.com/reel/C8K4Jz7S-ag/',
    sourceType: 'instagram',
    realtor: {
      id: 'realtor-1', // Anjali Sharma
      name: 'Anjali Sharma',
      avatarUrl: 'https://i.pravatar.cc/150?u=realtor1',
      agency: 'Prestige Properties',
      type: 'Broker',
      contact: '+91 98765 43210'
    },
    property: {
      address: 'Sushant Lok, Gurgaon',
      price: 65000000, // 6.5 Cr
      beds: 5,
      baths: 5,
      area: 4100,
    },
  },
];