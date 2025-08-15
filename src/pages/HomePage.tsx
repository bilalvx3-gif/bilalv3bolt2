import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Star,
      title: 'Premium Packages',
      description: 'Carefully curated Umrah packages with luxury accommodations and services',
    },
    {
      icon: Users,
      title: 'Experienced Guides',
      description: 'Knowledgeable religious guides to enhance your spiritual journey',
    },
    {
      icon: Shield,
      title: 'Trusted Service',
      description: 'Reliable and secure booking platform with 24/7 customer support',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Multiple departure dates and durations to fit your schedule',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Sacred Journey
                <span className="text-emerald-600 block">Awaits</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Embark on a spiritually enriching Umrah experience with our carefully designed packages. 
                From luxury accommodations to guided tours, we handle every detail of your pilgrimage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors group"
                >
                  Explore Packages
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/hotels"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  View Hotels
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg"
                  alt="Kaaba in Makkah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Star className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-sm text-gray-600">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose UmrahBooking</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with an exceptional Umrah experience, 
              handling every aspect of your spiritual journey with care and expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                    <Icon className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of pilgrims who have trusted us with their sacred journey. 
            Book your Umrah package today and experience the trip of a lifetime.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors group"
          >
            Start Your Journey
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}