/*
  # Remove phone verification from users table

  Changes:
    - Remove phone_verified column as phone verification is no longer required
    - Keep email_verified column for email verification
*/

-- Remove phone verification column from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS phone_verified;
