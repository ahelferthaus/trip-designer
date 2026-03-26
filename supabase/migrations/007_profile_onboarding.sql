-- 007_profile_onboarding.sql
-- Add username, home_location, avatar_url, onboarded to user_profiles

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username text NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS home_location text NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;

-- Unique username (only enforce on non-empty)
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_username_idx
  ON user_profiles (username) WHERE username != '';
