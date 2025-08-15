import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { mockHotels } from '../data/mockData';

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Hotels</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Stay in carefully selected accommodations near the holy sites
          </p>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-64 object-cover"
                />
                {hotel.rating && (
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{hotel.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Featured in packages</span>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockHotels.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels available</h3>
            <p className="text-gray-600">Hotels will be displayed here once added by administrators</p>
          </div>
        )}
      </div>
    </div>
  );
}