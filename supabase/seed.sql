-- NOTE: Your tables use UUID primary keys. This script lets Postgres generate UUIDs.
-- Packages will reference the proper rows via subselects on names.

begin;

-- Hotels
insert into public.hotels (name, location, image, description, rating, distance_to_haram, status)
values
  ('Fairmont Makkah Clock Royal Tower', 'Adjacent to Masjid al-Haram, Makkah', 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', 'Luxury accommodation with stunning views of the Holy Kaaba. Premium location.', 4.8, '50m', 'active'),
  ('Madinah Hilton Hotel', 'Prophet''s Mosque Area, Madinah', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'Premium hotel near the Prophet''s Mosque with excellent service', 4.7, '200m', 'active'),
  ('The Ritz-Carlton Makkah', 'Premium Haram View, Makkah', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg', 'Ultra-luxury accommodation with premium Haram views and world-class service', 4.5, '100m', 'active');

-- Transfers
insert into public.transfers (name, type, description, capacity, price, status)
values
  ('Premium Coach Service', 'bus', 'Air-conditioned luxury coaches with experienced drivers for comfortable group travel.', 45, 50, 'active'),
  ('Private Luxury Fleet', 'car', 'Fleet of luxury Mercedes vehicles with professional chauffeurs for VIP service.', 4, 200, 'active'),
  ('Family-Friendly Transport', 'van', 'Comfortable vehicles equipped with child safety seats and entertainment systems for families.', 8, 75, 'active');

-- Flights
insert into public.flights (airline, flight_number, departure, destination, departure_time, arrival_time, class, price, status)
values
  ('Saudi Arabian Airlines', 'SV101', 'JFK New York', 'JED Jeddah', '23:30', '19:45', 'economy', 850, 'active'),
  ('Emirates', 'EK205', 'LHR London', 'JED Jeddah', '14:20', '23:15', 'business', 2400, 'active'),
  ('Qatar Airways', 'QR8354', 'DXB Dubai', 'MED Madinah', '08:30', '10:45', 'economy', 450, 'active');

-- Packages
-- Insert packages only if a package with the same title does not already exist
insert into public.packages (
  title, price, duration, image, description, features, hotel_id, transfer_id,
  flight_departure, flight_destination, rating, location, category, status
)
select
  'Premium Umrah Experience - 14 Days',
  3500,
  14,
  'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg',
  'Experience the ultimate spiritual journey with our premium 14-day Umrah package. Stay in 5-star accommodations with breathtaking views of the Holy Kaaba.',
  array['Luxury 5-star accommodation','VIP transportation','Guided Ziyarat tours','All meals included','Experienced religious guide','24/7 customer support'],
  (select id from public.hotels where name = 'Fairmont Makkah Clock Royal Tower' limit 1),
  (select id from public.transfers where name = 'Private Luxury Fleet' limit 1),
  'New York (JFK)',
  'Jeddah (JED)',
  4.8,
  'Adjacent to Masjid al-Haram, Makkah',
  'premium',
  'active'
where not exists (select 1 from public.packages where title = 'Premium Umrah Experience - 14 Days');

insert into public.packages (
  title, price, duration, image, description, features, hotel_id, transfer_id,
  flight_departure, flight_destination, rating, location, category, status
)
select
  'Essential Umrah Package - 10 Days',
  2200,
  10,
  'https://images.pexels.com/photos/12419022/pexels-photo-12419022.jpeg',
  'Perfect for first-time pilgrims, this comprehensive 10-day package includes comfortable accommodations and essential services.',
  array['Comfortable 4-star hotel','Group transportation','Basic Ziyarat tours','Breakfast and dinner included','Group religious guide','Customer support'],
  (select id from public.hotels where name = 'Madinah Hilton Hotel' limit 1),
  (select id from public.transfers where name = 'Premium Coach Service' limit 1),
  'London (LHR)',
  'Madinah (MED)',
  4.8,
  'Walking distance to Prophet''s Mosque, Madinah',
  'standard',
  'active'
where not exists (select 1 from public.packages where title = 'Essential Umrah Package - 10 Days');

insert into public.packages (
  title, price, duration, image, description, features, hotel_id, transfer_id,
  flight_departure, flight_destination, rating, location, category, status
)
select
  'Family Umrah Journey - 12 Days',
  2800,
  12,
  'https://images.pexels.com/photos/8013106/pexels-photo-8013106.jpeg',
  'Specially designed for families, this 12-day package offers family-friendly accommodations, flexible schedules, and child-friendly amenities.',
  array['Family-friendly hotel','Flexible scheduling','Child care services','Family group tours','Special kids activities','Family meal options'],
  (select id from public.hotels where name = 'The Ritz-Carlton Makkah' limit 1),
  (select id from public.transfers where name = 'Family-Friendly Transport' limit 1),
  'Toronto (YYZ)',
  'Jeddah (JED)',
  4.8,
  'Family-oriented area near Haram, Makkah',
  'premium',
  'active'
where not exists (select 1 from public.packages where title = 'Family Umrah Journey - 12 Days');

commit;

-- After running the above, create an Auth user for admin in Dashboard and then upsert its profile row:
-- Replace YOUR_ADMIN_AUTH_USER_ID with the UUID from Authentication → Users
-- Example values:
--   email: admin@umrahbooking.com
--   role: admin

-- Upsert admin profile row (run after creating the auth user)
insert into public.users (id, name, email, phone, role)
values ('YOUR_ADMIN_AUTH_USER_ID', 'Admin', 'admin@umrahbooking.com', '+1234567890', 'admin')
on conflict (id) do update set
  name  = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  role  = excluded.role;

