
export interface Realtor {
  id: string;
  name: string;
  avatarUrl: string;
  agency: string;
  type: 'Broker' | 'Owner';
  contact: string;
}

export interface Property {
  address: string;
  price: number; // Changed from string to number for filtering
  beds: number;
  baths: number;
  area: number; // in sqft
}

export interface Reel {
  id: string;
  videoUrl: string;
  realtor: Realtor;
  property: Property;
}

export interface FavoriteList {
  id: string;
  name: string;
  reelIds: string[];
}
