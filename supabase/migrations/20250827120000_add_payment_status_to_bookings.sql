/*
  # Add payment_status to bookings

  1. New Column
    - payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'))

  2. Notes
    - Mirrors Stripe payment lifecycle
    - Existing rows default to 'pending'
*/

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'));


