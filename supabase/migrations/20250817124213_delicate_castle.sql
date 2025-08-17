/*
  # Insert Sample Data

  1. Sample Data
    - Insert sample hotels, transfers, flights, and packages
    - Create admin user
    - Add sample bookings
*/

-- Insert sample hotels
INSERT INTO hotels (id, name, location, image, description, rating, distance_to_haram) VALUES
('hotel-1', 'Fairmont Makkah Clock Royal Tower', 'Adjacent to Masjid al-Haram, Makkah', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', 'Luxury accommodation with stunning views of the Holy Kaaba. Premium location.', 4.8, '50m'),
('hotel-2', 'Madinah Hilton Hotel', 'Prophet''s Mosque Area, Madinah', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'Premium hotel near the Prophet''s Mosque with excellent service', 4.7, '200m'),
('hotel-3', 'The Ritz-Carlton Makkah', 'Premium Haram View, Makkah', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'Ultra-luxury accommodation with premium Haram views and world-class service', 4.5, '100m');

-- Insert sample transfers
INSERT INTO transfers (id, name, type, description, capacity, price) VALUES
('transfer-1', 'Premium Coach Service', 'bus', 'Air-conditioned luxury coaches with experienced drivers for comfortable group travel.', 45, 50),
('transfer-2', 'Private Luxury Fleet', 'car', 'Fleet of luxury Mercedes vehicles with professional chauffeurs for VIP service.', 4, 200),
('transfer-3', 'Family-Friendly Transport', 'van', 'Comfortable vehicles equipped with child safety seats and entertainment systems for families.', 8, 75);

-- Insert sample flights
INSERT INTO flights (id, airline, flight_number, departure, destination, departure_time, arrival_time, class, price) VALUES
('flight-1', 'Saudi Arabian Airlines', 'SV101', 'JFK New York', 'JED Jeddah', '23:30', '19:45', 'economy', 850),
('flight-2', 'Emirates', 'EK205', 'LHR London', 'JED Jeddah', '14:20', '23:15', 'business', 2400),
('flight-3', 'Qatar Airways', 'QR8354', 'DXB Dubai', 'MED Madinah', '08:30', '10:45', 'economy', 450);

-- Insert sample packages
INSERT INTO packages (id, title, price, duration, image, description, features, hotel_id, transfer_id, flight_departure, flight_destination, location, category) VALUES
('package-1', 'Premium Umrah Experience - 14 Days', 3500, 14, 'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg', 'Experience the ultimate spiritual journey with our premium 14-day Umrah package. Stay in 5-star accommodations with breathtaking views of the Holy Kaaba.', ARRAY['Luxury 5-star accommodation', 'VIP transportation', 'Guided Ziyarat tours', 'All meals included', 'Experienced religious guide', '24/7 customer support'], 'hotel-1', 'transfer-2', 'New York (JFK)', 'Jeddah (JED)', 'Adjacent to Masjid al-Haram, Makkah', 'premium'),
('package-2', 'Essential Umrah Package - 10 Days', 2200, 10, 'https://images.pexels.com/photos/12419022/pexels-photo-12419022.jpeg', 'Perfect for first-time pilgrims, this comprehensive 10-day package includes comfortable accommodations and essential services.', ARRAY['Comfortable 4-star hotel', 'Group transportation', 'Basic Ziyarat tours', 'Breakfast and dinner included', 'Group religious guide', 'Customer support'], 'hotel-2', 'transfer-1', 'London (LHR)', 'Madinah (MED)', 'Walking distance to Prophet''s Mosque, Madinah', 'standard'),
('package-3', 'Family Umrah Journey - 12 Days', 2800, 12, 'https://images.pexels.com/photos/8013106/pexels-photo-8013106.jpeg', 'Specially designed for families, this 12-day package offers family-friendly accommodations, flexible schedules, and child-friendly amenities.', ARRAY['Family-friendly hotel', 'Flexible scheduling', 'Child care services', 'Family group tours', 'Special kids activities', 'Family meal options'], 'hotel-3', 'transfer-3', 'Toronto (YYZ)', 'Jeddah (JED)', 'Family-oriented area near Haram, Makkah', 'premium');

-- Insert admin user (this will be handled by auth, but we need the profile)
INSERT INTO users (id, name, email, role) VALUES
('admin-1', 'Admin', 'admin@umrahbooking.com', 'admin');