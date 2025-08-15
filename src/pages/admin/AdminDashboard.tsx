import React from 'react';
import { BarChart3, Package, Building2, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { mockPackages, mockHotels, mockBookings } from '../../data/mockData';

export default function AdminDashboard() {
  const totalRevenue = mockBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingRequests = mockBookings.filter(b => b.status === 'pending').length;

  const stats = [
    {
      label: 'Total Packages',
      value: mockPackages.length,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Bookings',
      value: mockBookings.length,
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: true },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'transfers', label: 'Transfers', icon: Users },
    { id: 'flights', label: 'Flights', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

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
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    tab.active
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
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{booking.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {booking.customerEmail}
                    </td>
                    <td className="py-3 px-4">{booking.numberOfGuests}</td>
                    <td className="py-3 px-4 font-semibold">${booking.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
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
      </div>
    </div>
  );
}