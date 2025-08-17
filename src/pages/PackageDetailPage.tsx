import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Plane, Car, Building2, Check, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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
  hotels?: { name: string; location: string; image: string; description: string };
  transfers?: { name: string; type: string; description: string };
}

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    numberOfRooms: 1,
    numberOfGuests: 2,
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
  });

  React.useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        hotels (name, location, image, description),
        transfers (name, type, description)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (!error && data) {
      setPackageData(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/packages/${id}` } } });
      return;
    }

    const totalAmount = packageData.price * bookingData.numberOfGuests;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          package_id: packageData.id,
          user_id: user.id,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          number_of_rooms: bookingData.numberOfRooms,
          number_of_guests: bookingData.numberOfGuests,
          total_amount: totalAmount,
          status: 'pending',
        });

      if (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
        return;
      }

      alert('Booking request submitted successfully! Your request is pending admin approval.');
      setShowBookingForm(false);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  const totalPrice = packageData.price * bookingData.numberOfGuests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={packageData.image}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 text-white w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <div className="flex items-center space-x-1">
                <MapPin size={20} />
                <span>{packageData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={20} />
                <span>{packageData.duration} Days</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="fill-current text-yellow-400" size={20} />
                <span>{packageData.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Overview</h2>
              <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {packageData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Information */}
            {packageData.hotels && (
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Information</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={packageData.hotels.image}
                      alt={packageData.hotels.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{packageData.hotels.name}</h3>
                    <div className="flex items-center space-x-1 mb-3">
                      <MapPin className="text-gray-400" size={16} />
                      <span className="text-gray-600">{packageData.hotels.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-gray-900 font-medium">{packageData.rating}</span>
                    </div>
                    <p className="text-gray-600">{packageData.hotels.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transportation Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {packageData.transfers && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Car className="text-emerald-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Transfers</h3>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium capitalize">{packageData.transfers.type} Transfer</p>
                  <p className="text-gray-600 text-sm">{packageData.transfers.description}</p>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Plane className="text-emerald-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Flight Details</h3>
                </div>
                <p className="text-gray-600 mb-1">
                  <strong>From:</strong> {packageData.flight_departure}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>To:</strong> {packageData.flight_destination}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-emerald-600">
                  ${packageData.price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">per person</span>
              </div>

              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-lg"
                >
                  Book This Package
                </button>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                      <select
                        value={bookingData.numberOfRooms}
                        onChange={(e) => setBookingData({...bookingData, numberOfRooms: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                      <select
                        value={bookingData.numberOfGuests}
                        onChange={(e) => setBookingData({...bookingData, numberOfGuests: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Price per person:</span>
                      <span>${packageData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Number of guests:</span>
                      <span>{bookingData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-600">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Submit Booking Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      packageId: packageData.id,
      userId: user.id,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      numberOfRooms: bookingData.numberOfRooms,
      numberOfGuests: bookingData.numberOfGuests,
      totalAmount,
    });
    
    alert('Booking request submitted successfully! Your request is pending admin approval.');
    setShowBookingForm(false);
    navigate('/my-bookings');
  };

  const totalPrice = packageData.price * bookingData.numberOfGuests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={packageData.image}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 text-white w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <div className="flex items-center space-x-1">
                <MapPin size={20} />
                <span>{packageData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={20} />
                <span>{packageData.duration} Days</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="fill-current text-yellow-400" size={20} />
                <span>{packageData.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Overview</h2>
              <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {packageData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Information */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={packageData.hotel.image}
                    alt={packageData.hotel.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{packageData.hotel.name}</h3>
                  <div className="flex items-center space-x-1 mb-3">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-gray-600">{packageData.hotel.location}</span>
                  </div>
                  {packageData.hotel.rating && (
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-gray-900 font-medium">{packageData.hotel.rating}</span>
                    </div>
                  )}
                  <p className="text-gray-600">{packageData.hotel.description}</p>
                </div>
              </div>
            </div>

            {/* Transportation Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Car className="text-emerald-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Transfers</h3>
                </div>
                <p className="text-gray-600 mb-2 font-medium capitalize">{packageData.transfers.type} Transfer</p>
                <p className="text-gray-600 text-sm">{packageData.transfers.description}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Plane className="text-emerald-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Flight Details</h3>
                </div>
                <p className="text-gray-600 mb-1">
                  <strong>From:</strong> {packageData.flight.departure}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>To:</strong> {packageData.flight.destination}
                </p>
                {packageData.flight.timing && (
                  <p className="text-gray-600 text-sm">{packageData.flight.timing}</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-emerald-600">
                  ${packageData.price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">per person</span>
              </div>

              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-lg"
                >
                  Book This Package
                </button>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                      <select
                        value={bookingData.numberOfRooms}
                        onChange={(e) => setBookingData({...bookingData, numberOfRooms: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                      <select
                        value={bookingData.numberOfGuests}
                        onChange={(e) => setBookingData({...bookingData, numberOfGuests: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Price per person:</span>
                      <span>${packageData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Number of guests:</span>
                      <span>{bookingData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-600">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Submit Booking Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}