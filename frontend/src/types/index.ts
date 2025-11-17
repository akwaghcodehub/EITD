export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Item {
  _id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'claimed' | 'expired';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  itemId: string;
  claimantId: string;
  description: string;
  verificationDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceItem {
  _id: string;
  itemId: Item;
  price: number;
  status: 'available' | 'sold';
  listedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Keys',
  'Books',
  'IDs',
  'Bags & Backpacks',
  'Accessories',
  'Sports Equipment',
  'Other'
];

export const LOCATIONS = [
  'Grainger Library',
  'Undergrad Library',
  'Union',
  'ARC',
  'CRCE',
  'Siebel Center',
  'ECEB',
  'Everitt Lab',
  'DCL',
  'Main Quad',
  'Engineering Quad',
  'Altgeld Hall',
  'Foellinger',
  'ISR',
  'PAR',
  'FAR',
  'Other'
];
