-- Add LinkedIn OAuth support
-- Migration to add linkedin_id column for LinkedIn OAuth users

ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);

-- Add comment for documentation
COMMENT ON COLUMN users.linkedin_id IS 'LinkedIn OAuth ID for social login';

-- Update auth_provider to support linkedin
-- Note: This will update existing google users to have 'google' as auth_provider
-- and new linkedin users will have 'linkedin' as auth_provider
UPDATE users SET auth_provider = 'google' WHERE google_id IS NOT NULL AND auth_provider = 'local';
