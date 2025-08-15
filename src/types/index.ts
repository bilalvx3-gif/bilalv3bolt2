export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  rating?: number;
}

export interface Transfer {
  id: string;
  type: 'bus' | 'train' | 'car';
  description: string;
  price: number;
}

export interface Flight {
  id: string;
  departure: string;
  destination: string;
  timing?: string;
}

export interface Package {
  id: string;
  title: string;
  price: number;
  duration: number;
  image: string;
  description: string;
  features: string[];
  hotel: Hotel;
  transfers: Transfer;
  flight: Flight;
  rating: number;
  location: string;
  category: 'premium' | 'standard' | 'economy';
}

export interface BookingRequest {
  id: string;
  packageId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfRooms: number;
  numberOfGuests: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
  totalAmount: number;
}