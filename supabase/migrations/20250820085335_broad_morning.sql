/*
  # Create Admin User

  1. Admin User Setup
    - Creates admin user profile with proper credentials
    - Sets up admin role and permissions
    - Ensures admin can access dashboard

  Note: This migration creates the admin user profile.
  The actual auth user must be created through Supabase Auth UI or API.
*/

-- Insert admin user profile (this assumes the auth user already exists)
-- Replace 'ADMIN_USER_ID' with the actual UUID from Supabase Auth
INSERT INTO public.users (id, name, email, phone, role)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Placeholder UUID - replace with actual auth user ID
  'Admin User',
  'admin@umrahbooking.com',
  '+1234567890',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- Ensure admin has all necessary permissions
-- The RLS policies already handle admin access based on role