-- OAuth Integration Migration
-- This adds support for OAuth authentication (Google, LinkedIn, GitHub, etc.)

-- Create OAuth accounts table to link multiple OAuth providers to one user
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(u_id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'linkedin', 'github', 'microsoft', 'apple'
  provider_user_id VARCHAR(255) NOT NULL, -- OAuth provider's user ID
  access_token TEXT, -- OAuth access token (should be encrypted in production)
  refresh_token TEXT, -- OAuth refresh token (should be encrypted in production)
  token_expires_at TIMESTAMP,
  profile_data JSONB, -- Store raw profile data from provider
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider, provider_user_id);

-- Add OAuth provider tracking to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider_id VARCHAR(255);

-- Make password nullable for OAuth-only users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add fields for OAuth profile data import to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_imported_from VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_imported_at TIMESTAMP;

-- Comments for documentation
COMMENT ON TABLE oauth_accounts IS 'Stores OAuth authentication data for multiple providers';
COMMENT ON COLUMN oauth_accounts.provider IS 'OAuth provider name (google, linkedin, github, etc.)';
COMMENT ON COLUMN oauth_accounts.provider_user_id IS 'User ID from the OAuth provider';
COMMENT ON COLUMN oauth_accounts.profile_data IS 'Raw profile data from OAuth provider for debugging and data import';
COMMENT ON COLUMN users.oauth_provider IS 'Primary OAuth provider used for account creation';
COMMENT ON COLUMN users.oauth_provider_id IS 'User ID from primary OAuth provider';

-- Verification queries
SELECT 'OAuth migration completed successfully!' AS status;

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('oauth_accounts', 'users', 'profiles') 
ORDER BY table_name;

