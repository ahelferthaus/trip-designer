-- 001_user_features.sql
-- Adds user profiles, travel partners, partner groups, trip invitations,
-- and ties trips/members to auth.users

-- User profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_type text NOT NULL DEFAULT 'initials', -- 'initials' | 'emoji' | 'upload'
  avatar_value text NOT NULL DEFAULT '',
  default_passcode text NOT NULL DEFAULT '1234',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Travel partners (saved contacts)
CREATE TABLE IF NOT EXISTS travel_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'adult', -- 'adult' | 'child'
  age int,
  created_at timestamptz DEFAULT now()
);

-- Partner groups (named sets of partners)
CREATE TABLE IF NOT EXISTS partner_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  partner_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Trip invitations (email-based)
CREATE TABLE IF NOT EXISTS trip_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'expired'
  token text UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 16),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- Add user_id to trips (nullable for anonymous trips)
ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add user_id to trip_members (nullable for anonymous members)
ALTER TABLE trip_members ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- RLS for travel_partners
ALTER TABLE travel_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own partners" ON travel_partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own partners" ON travel_partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own partners" ON travel_partners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own partners" ON travel_partners FOR DELETE USING (auth.uid() = user_id);

-- RLS for partner_groups
ALTER TABLE partner_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own groups" ON partner_groups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own groups" ON partner_groups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own groups" ON partner_groups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own groups" ON partner_groups FOR DELETE USING (auth.uid() = user_id);

-- RLS for trip_invitations
ALTER TABLE trip_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inviter can read invitations" ON trip_invitations FOR SELECT USING (auth.uid() = invited_by);
CREATE POLICY "Anyone can read by token" ON trip_invitations FOR SELECT USING (true);
CREATE POLICY "Auth users can insert invitations" ON trip_invitations FOR INSERT WITH CHECK (auth.uid() = invited_by);
CREATE POLICY "Auth users can update invitations" ON trip_invitations FOR UPDATE USING (true);

-- Update trips RLS: owner can always access their trips, keep public fallback for anonymous
CREATE POLICY "Owner reads own trips" ON trips FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Owner updates own trips" ON trips FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);
