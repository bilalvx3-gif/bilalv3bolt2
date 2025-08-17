/*
  # Initial Schema for Umrah Booking Platform

  1. New Tables
    - `users` - User accounts with role-based access
    - `hotels` - Hotel information and details
    - `transfers` - Transportation options
    - `flights` - Flight information
    - `packages` - Umrah packages combining hotels, transfers, and flights
    - `bookings` - Customer booking requests

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and role-based access
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  rating numeric(2,1) CHECK (rating >= 0 AND rating <= 5),
  distance_to_haram text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('bus', 'car', 'van')),
  description text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline text NOT NULL,
  flight_number text NOT NULL,
  departure text NOT NULL,
  destination text NOT NULL,
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  class text NOT NULL CHECK (class IN ('economy', 'business', 'first')),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  duration integer NOT NULL CHECK (duration > 0),
  image text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  transfer_id uuid REFERENCES transfers(id) ON DELETE CASCADE,
  flight_departure text NOT NULL,
  flight_destination text NOT NULL,
  rating numeric(2,1) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5),
  location text NOT NULL,
  category text DEFAULT 'standard' CHECK (category IN ('premium', 'standard', 'economy')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  number_of_rooms integer NOT NULL CHECK (number_of_rooms > 0),
  number_of_guests integer NOT NULL CHECK (number_of_guests > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create policies for hotels table
CREATE POLICY "Anyone can read active hotels" ON hotels
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage hotels" ON hotels
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create policies for transfers table
CREATE POLICY "Anyone can read active transfers" ON transfers
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage transfers" ON transfers
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create policies for flights table
CREATE POLICY "Anyone can read active flights" ON flights
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage flights" ON flights
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create policies for packages table
CREATE POLICY "Anyone can read active packages" ON packages
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage packages" ON packages
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create policies for bookings table
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all bookings" ON bookings
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));