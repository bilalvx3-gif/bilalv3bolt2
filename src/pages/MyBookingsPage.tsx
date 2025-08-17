import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Mail, Package as PackageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  total_amount: number;
  created_at: string;
  packages?: {
    title: string;
    image: string;
    location: string;
    duration: number;
  };
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (title, image, location, duration)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setBookings(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track your Umrah reservations and booking status</p>
        </div>

        {bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageIcon size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h2>
            <p className="text-gray-600 mb-8">
              Start your spiritual journey by booking an Umrah package
            </p>
            <Link
              to="/packages"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {bookings.map((booking) => {
              if (!booking.packages) return null;

              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Package Image */}
                    <div className="relative">
                      <img
                        src={booking.packages.image}
                        alt={booking.packages.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {booking.packages.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin size={16} className="mr-1" />
                            <span className="text-sm">{booking.packages.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <Calendar size={16} className="mr-1" />
                            <span className="text-sm">
                              Booked {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-emerald-600">
                            ${booking.total_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">Total Amount</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Users size={16} className="mr-2" />
                            Guest Details
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>Guests: <span className="font-medium">{booking.number_of_guests}</span></div>
                            <div>Rooms: <span className="font-medium">{booking.number_of_rooms}</span></div>
                            <div>Duration: <span className="font-medium">{booking.packages.duration} days</span></div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Mail size={16} className="mr-2" />
                            Contact Details
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>{booking.customer_email}</div>
                            {booking.customer_phone && <div>{booking.customer_phone}</div>}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Status Information</h4>
                          <div className="text-sm text-gray-600">
                            <div className="mb-1 font-medium">
                              Current Status: 
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            {booking.status === 'confirmed' ? (
                              <p className="text-green-600">Your booking has been confirmed! Check your email for details.</p>
                            ) : booking.status === 'cancelled' ? (
                              <p className="text-red-600">Your booking has been cancelled. Contact support for more information.</p>
                            ) : (
                              <p className="text-yellow-600">Your booking is being processed. We'll update you soon.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Link
                          to={`/packages/${booking.package_id}`}
                          className="flex-1 border border-emerald-600 text-emerald-600 py-3 px-4 rounded-lg font-semibold text-center hover:bg-emerald-50 transition-colors"
                        >
                          View Package Details
                        </Link>
                        <button className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}