/*
  # Add verification fields to users table

  1. New Columns
    - `email_verified` (boolean) - tracks email verification status
    - `phone_verified` (boolean) - tracks phone verification status
  
  2. Changes
    - Add verification status columns with default false
    - Update existing users to have email_verified = true for backward compatibility
*/

-- Add verification fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;

-- Update existing users to have email verified (backward compatibility)
UPDATE users SET email_verified = true WHERE email_verified IS NULL OR email_verified = false;

-- Add personal_info column to bookings table for storing detailed passenger information
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS personal_info jsonb;