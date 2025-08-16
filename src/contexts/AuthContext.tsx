import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockBookings } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  addBooking: (booking: any) => void;
  updateBookingStatus: (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@umrahbooking.com',
    phone: '+1234567890',
    role: 'admin',
    createdAt: '2025-01-01',
  },
  {
    id: 'user-1',
    name: 'R S',
    email: 'bilalxv1@gmail.com',
    phone: '',
    role: 'customer',
    createdAt: '2025-08-13',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState(mockBookings);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const addBooking = (booking: any) => {
    const newBooking = {
      ...booking,
      id: `booking-${Date.now()}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings(prev => [...prev, newBooking]);
    // Update mock data for consistency
    mockBookings.push(newBooking);
  };

  const updateBookingStatus = (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
    // Update mock data for consistency
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = status;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    if (email === 'admin@umrahbooking.com' && password === 'Admin@123') {
      const adminUser = mockUsers.find(u => u.email === email);
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
    }
    
    // For demo purposes, allow any email/password for customers
    if (email && password) {
      let customerUser = mockUsers.find(u => u.email === email);
      if (!customerUser) {
        customerUser = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        mockUsers.push(customerUser);
      }
      setUser(customerUser);
      localStorage.setItem('currentUser', JSON.stringify(customerUser));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, addBooking, updateBookingStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}