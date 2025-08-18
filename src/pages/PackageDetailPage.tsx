import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, Plane, Car, Building2, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Package, Hotel, Transfer } from '../types';

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    rooms: 1,
    guests: 2,
    customerName: user?.user_metadata?.name || '',
    customerEmail: user?.email || '',
    customerPhone: ''
  });

  useEffect(() => {
    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch package details
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (packageError) throw packageError;
      setPackageData(packageData);

      // Fetch hotel details if hotel_id exists
      if (packageData.hotel_id) {
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', packageData.hotel_id)
          .single();

        if (!hotelError) setHotel(hotelData);
      }

      // Fetch transfer details if transfer_id exists
      if (packageData.transfer_id) {
        const { data: transferData, error: transferError } = await supabase
          .from('transfers')
          .select('*')
          .eq('id', packageData.transfer_id)
          .single();

        if (!transferError) setTransfer(transferData);
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !packageData) {
      alert('Please log in to make a booking');
      return;
    }

    try {
      const totalAmount = packageData.price * bookingData.guests;
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          package_id: packageData.id,
          user_id: user.id,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          number_of_rooms: bookingData.rooms,
          number_of_guests: bookingData.guests,
          total_amount: totalAmount,
          status: 'pending'
        });

      if (error) throw error;

      alert('Booking request submitted successfully! We will contact you soon.');
      setShowBookingForm(false);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/packages')}
          className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={packageData.image}
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {packageData.duration} Days
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{packageData.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{packageData.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{packageData.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">
                      ${packageData.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">per person</div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Information */}
            {hotel && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-emerald-600" />
                  Hotel Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{hotel.location}</span>
                    </div>
                    {hotel.rating && (
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                        <span className="text-gray-600">{hotel.rating}/5</span>
                      </div>
                    )}
                    {hotel.distance_to_haram && (
                      <div className="text-sm text-gray-600 mb-4">
                        Distance to Haram: {hotel.distance_to_haram}
                      </div>
                    )}
                    <p className="text-gray-700">{hotel.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Details */}
            {transfer && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Car className="w-6 h-6 mr-3 text-emerald-600" />
                  Transfer Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{transfer.name}</h3>
                    <p className="text-gray-600 mb-4">{transfer.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{transfer.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{transfer.capacity} passengers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flight Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plane className="w-6 h-6 mr-3 text-emerald-600" />
                Flight Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Departure</h3>
                  <p className="text-gray-600">{packageData.flight_departure}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination</h3>
                  <p className="text-gray-600">{packageData.flight_destination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  ${packageData.price.toLocaleString()}
                </div>
                <div className="text-gray-500">per person</div>
              </div>

              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Book This Package
                </button>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rooms
                      </label>
                      <select
                        value={bookingData.rooms}
                        onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guests
                      </label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-emerald-600">
                        ${(packageData.price * bookingData.guests).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{packageData.duration} days duration</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Group bookings available</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}