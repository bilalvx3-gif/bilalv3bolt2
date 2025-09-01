import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Building2, Users, DollarSign, Calendar, TrendingUp, 
  Plus, Search, Edit, Trash2, Eye, Car, Plane, MapPin, Star, Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddPackageModal from '../../components/admin/AddPackageModal';
import AddHotelModal from '../../components/admin/AddHotelModal';
import AddTransferModal from '../../components/admin/AddTransferModal';
import AddFlightModal from '../../components/admin/AddFlightModal';

interface Package {
  id: string;
  title: string;
  price: number;
  duration: number;
  image: string;
  description: string;
  features: string[];
  hotel_id: string;
  transfer_id: string;
  flight_departure: string;
  flight_destination: string;
  rating: number;
  location: string;
  category: string;
  status: string;
  created_at: string;
  hotels?: { name: string; location: string };
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  distance_to_haram: string;
  status: string;
  created_at: string;
}

interface Transfer {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  status: string;
  created_at: string;
}

interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  class: string;
  price: number;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  package_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_rooms: number;
  number_of_guests: number;
  status: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  total_amount: number;
  created_at: string;
  packages?: { title: string };
  personal_info?: {
    title?: string;
    givenName?: string;
    surname?: string;
    countryOfResidence?: string;
    nationality?: string;
    birthDate?: string;
    passportNumber?: string;
    passportIssueCountry?: string;
    passportIssueDate?: string;
    passportExpirationDate?: string;
    hasValidVisa?: boolean;
    email?: string;
    phone?: string;
  } | null;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  
  // Modal states
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchPackages(),
      fetchHotels(),
      fetchTransfers(),
      fetchFlights(),
      fetchBookings(),
    ]);
    setIsLoading(false);
  };

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        hotels (name, location)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPackages(data);
    }
  };

  const fetchHotels = async () => {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setHotels(data);
    }
  };

  const fetchTransfers = async () => {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTransfers(data);
    }
  };

  const fetchFlights = async () => {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setFlights(data);
    }
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (title)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setBookings(data);
    }
  };

  const openDetails = (booking: Booking) => {
    setDetailsBooking(booking);
    setShowDetailsModal(true);
  };

  const closeDetails = () => {
    setShowDetailsModal(false);
    setDetailsBooking(null);
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings(); // Refresh bookings
    }
  };

  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (!error) {
      // Refresh the appropriate data
      switch (table) {
        case 'packages':
          fetchPackages();
          break;
        case 'hotels':
          fetchHotels();
          break;
        case 'transfers':
          fetchTransfers();
          break;
        case 'flights':
          fetchFlights();
          break;
      }
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_amount, 0);
  const pendingRequests = bookings.filter(b => b.status === 'pending').length;

  const stats = [
    {
      label: 'Total Packages',
      value: packages.length,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pending Requests',
      value: pendingRequests,
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100',
    },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'transfers', label: 'Transfers', icon: Car },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`text-white ${stat.color}`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Booking Requests */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2" size={24} />
            Recent Booking Requests
          </h2>
          <span className="text-sm text-gray-500">Last 5 bookings</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Guests</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{booking.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {booking.customer_email}
                  </td>
                  <td className="py-3 px-4">{booking.number_of_guests}</td>
                  <td className="py-3 px-4 font-semibold">${booking.total_amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Insights</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-4">View detailed analytics and revenue reports</p>
          <button className="w-full bg-green-50 text-green-700 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors">
            View Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Schedule Overview</h3>
            <Calendar className="text-blue-500" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage upcoming departures and bookings</p>
          <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
            View Schedule
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Package Performance</h3>
            <Package className="text-purple-500" size={24} />
          </div>
          <p className="text-sm text-gray-600 mb-4">Analyze popular packages and optimize pricing</p>
          <button className="w-full bg-purple-50 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors">
            View Performance
          </button>
        </div>
      </div>
    </>
  );

  const renderPackages = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package size={24} className="text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Package Management</h2>
            <p className="text-sm text-gray-500">{packages.length} packages</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddPackageModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Package</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Package</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Hotel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img src={pkg.image} alt={pkg.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{pkg.title}</p>
                      <p className="text-sm text-gray-500">{pkg.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold">${pkg.price.toLocaleString()}</td>
                <td className="py-3 px-4">{pkg.duration} days</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{pkg.hotels?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{pkg.location}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pkg.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('packages', pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHotels = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building2 size={24} className="text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hotel Management</h2>
            <p className="text-sm text-gray-500">{hotels.length} hotels</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddHotelModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Hotel</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Hotel</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Rating</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Distance to Haram</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img src={hotel.image} alt={hotel.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.location.split(',')[1]}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span>{hotel.rating}/5</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {hotel.distance_to_haram || 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    hotel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {hotel.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('hotels', hotel.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransfers = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Car size={24} className="text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transfer Management</h2>
            <p className="text-sm text-gray-500">{transfers.length} options</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddTransferModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Transfer</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Capacity</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{transfer.name}</p>
                    <p className="text-sm text-gray-500">{transfer.description}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car size={16} className="text-blue-600" />
                    </div>
                    <span className="capitalize">{transfer.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Users size={16} className="text-gray-400" />
                    <span>{transfer.capacity}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold">${transfer.price}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    transfer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {transfer.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('transfers', transfer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFlights = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Plane size={24} className="text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Flight Management</h2>
            <p className="text-sm text-gray-500">{flights.length} flights</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddFlightModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Flight</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Flight</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Route</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Time</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Class</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{flight.airline}</p>
                    <p className="text-sm text-gray-500">{flight.flight_number}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{flight.departure}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm">{flight.destination}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm">{flight.departure_time} - {flight.arrival_time}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    flight.class === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {flight.class}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold">${flight.price}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    flight.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {flight.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem('flights', flight.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar size={24} className="text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Management</h2>
            <p className="text-sm text-gray-500">{bookings.length} bookings</p>
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Package</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Details</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customer_name}</p>
                    <p className="text-sm text-gray-500">{booking.customer_email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{booking.packages?.title || 'Unknown Package'}</p>
                    <p className="text-sm text-gray-500">#{booking.id.slice(-6)}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    <p>{booking.number_of_guests} guests</p>
                    <p>{booking.number_of_rooms} rooms</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold">${booking.total_amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(booking.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as 'pending' | 'confirmed' | 'cancelled')}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : booking.payment_status === 'failed' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.payment_status || 'pending'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => openDetails(booking)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Umrah booking platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-1">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'packages' && renderPackages()}
        {activeTab === 'hotels' && renderHotels()}
        {activeTab === 'transfers' && renderTransfers()}
        {activeTab === 'flights' && renderFlights()}
        {activeTab === 'bookings' && renderBookings()}
      </div>

      {/* Modals */}
      <AddPackageModal 
        isOpen={showAddPackageModal} 
        onClose={() => setShowAddPackageModal(false)}
        onSuccess={fetchPackages}
      />
      <AddHotelModal 
        isOpen={showAddHotelModal} 
        onClose={() => setShowAddHotelModal(false)}
        onSuccess={fetchHotels}
      />
      <AddTransferModal 
        isOpen={showAddTransferModal} 
        onClose={() => setShowAddTransferModal(false)}
        onSuccess={fetchTransfers}
      />
      <AddFlightModal 
        isOpen={showAddFlightModal} 
        onClose={() => setShowAddFlightModal(false)}
        onSuccess={fetchFlights}
      />

      {/* Booking Details Modal */}
      {showDetailsModal && detailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetails}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Given Name</p>
                <p className="font-medium">{detailsBooking.personal_info?.givenName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Surname</p>
                <p className="font-medium">{detailsBooking.personal_info?.surname || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country of Residence</p>
                <p className="font-medium">{detailsBooking.personal_info?.countryOfResidence || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium">{detailsBooking.personal_info?.nationality || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Birth Date</p>
                <p className="font-medium">{detailsBooking.personal_info?.birthDate || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport Number</p>
                <p className="font-medium">{detailsBooking.personal_info?.passportNumber || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport Issue Country</p>
                <p className="font-medium">{detailsBooking.personal_info?.passportIssueCountry || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport Issue Date</p>
                <p className="font-medium">{detailsBooking.personal_info?.passportIssueDate || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passport Expiration Date</p>
                <p className="font-medium">{detailsBooking.personal_info?.passportExpirationDate || '—'}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={closeDetails} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}