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
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  totalAmount: number;
}

export interface Transfer {
  id: string;
  name: string;
  type: 'bus' | 'car' | 'van';
  description: string;
  capacity: number;
  price: number;
  status: 'active' | 'inactive';
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  class: 'economy' | 'business' | 'first';
  price: number;
  status: 'active' | 'inactive';
}