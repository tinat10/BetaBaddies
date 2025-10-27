-- Add Google OAuth support
-- Migration to add google_id and make password nullable for OAuth users

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Add comment for documentation
COMMENT ON COLUMN users.google_id IS 'Google OAuth ID for social login';
COMMENT ON COLUMN users.auth_provider IS 'Authentication provider: local or google';
