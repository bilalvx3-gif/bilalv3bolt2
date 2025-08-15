import { Package, Hotel, BookingRequest } from '../types';

export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Hilton Suites Makkah',
    location: 'Adjacent to Masjid al-Haram, Makkah',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    description: 'Luxury accommodation with stunning views of the Holy Kaaba',
    rating: 4.8,
  },
  {
    id: 'hotel-2',
    name: 'Madinah Marriott',
    location: 'Walking distance to Prophet\'s Mosque, Madinah',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    description: 'Premium hotel near the Prophet\'s Mosque with excellent service',
    rating: 4.7,
  },
  {
    id: 'hotel-3',
    name: 'Family Resort Makkah',
    location: 'Family-oriented area near Haram, Makkah',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    description: 'Perfect for families with spacious rooms and kid-friendly amenities',
    rating: 4.5,
  },
];

export const mockPackages: Package[] = [
  {
    id: 'package-1',
    title: 'Premium Umrah Experience - 14 Days',
    price: 3500,
    duration: 14,
    image: 'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg',
    description: 'Experience the ultimate spiritual journey with our premium 14-day Umrah package. Stay in 5-star accommodations with breathtaking views of the Holy Kaaba.',
    features: [
      'Luxury 5-star accommodation',
      'VIP transportation',
      'Guided Ziyarat tours',
      'All meals included',
      'Experienced religious guide',
      '24/7 customer support'
    ],
    hotel: mockHotels[0],
    transfers: {
      id: 'transfer-1',
      type: 'car',
      description: 'Private luxury car with professional driver',
      price: 200,
    },
    flight: {
      id: 'flight-1',
      departure: 'New York (JFK)',
      destination: 'Jeddah (JED)',
      timing: 'Multiple departures available',
    },
    rating: 4.8,
    location: 'Adjacent to Masjid al-Haram, Makkah',
    category: 'premium',
  },
  {
    id: 'package-2',
    title: 'Essential Umrah Package - 10 Days',
    price: 2200,
    duration: 10,
    image: 'https://images.pexels.com/photos/12419022/pexels-photo-12419022.jpeg',
    description: 'Perfect for first-time pilgrims, this comprehensive 10-day package includes comfortable accommodations and essential services.',
    features: [
      'Comfortable 4-star hotel',
      'Group transportation',
      'Basic Ziyarat tours',
      'Breakfast and dinner included',
      'Group religious guide',
      'Customer support'
    ],
    hotel: mockHotels[1],
    transfers: {
      id: 'transfer-2',
      type: 'bus',
      description: 'Comfortable group bus transportation',
      price: 100,
    },
    flight: {
      id: 'flight-2',
      departure: 'London (LHR)',
      destination: 'Madinah (MED)',
      timing: 'Weekly departures',
    },
    rating: 4.8,
    location: 'Walking distance to Prophet\'s Mosque, Madinah',
    category: 'standard',
  },
  {
    id: 'package-3',
    title: 'Family Umrah Journey - 12 Days',
    price: 2800,
    duration: 12,
    image: 'https://images.pexels.com/photos/8013106/pexels-photo-8013106.jpeg',
    description: 'Specially designed for families, this 12-day package offers family-friendly accommodations, flexible schedules, and child-friendly amenities.',
    features: [
      'Family-friendly hotel',
      'Flexible scheduling',
      'Child care services',
      'Family group tours',
      'Special kids activities',
      'Family meal options'
    ],
    hotel: mockHotels[2],
    transfers: {
      id: 'transfer-3',
      type: 'car',
      description: 'Family-friendly vehicle with car seats available',
      price: 150,
    },
    flight: {
      id: 'flight-3',
      departure: 'Toronto (YYZ)',
      destination: 'Jeddah (JED)',
      timing: 'Family-friendly timing',
    },
    rating: 4.8,
    location: 'Family-oriented area near Haram, Makkah',
    category: 'premium',
  },
];

export const mockBookings: BookingRequest[] = [
  {
    id: 'booking-1',
    packageId: 'package-1',
    userId: 'user-1',
    customerName: 'R S',
    customerEmail: 'bilalxv1@gmail.com',
    customerPhone: '+1234567890',
    numberOfRooms: 1,
    numberOfGuests: 2,
    status: 'confirmed',
    createdAt: '2025-08-13',
    totalAmount: 7000,
  },
];