-- Trip Designer Schema
-- Safe to re-run: drops and recreates everything

DROP TABLE IF EXISTS slot_selections CASCADE;
DROP TABLE IF EXISTS trip_members CASCADE;
DROP TABLE IF EXISTS trips CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE trips (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  invite_code text UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  passcode text NOT NULL DEFAULT '1234',
  form_data jsonb NOT NULL,
  itinerary_data jsonb NOT NULL,
  created_by text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE trip_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  display_name text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, display_name)
);

CREATE TABLE slot_selections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  slot_id text NOT NULL,
  option_id text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, member_name, slot_id)
);

CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_type text NOT NULL DEFAULT 'initials',
  avatar_value text NOT NULL DEFAULT '',
  default_passcode text NOT NULL DEFAULT '1234',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE travel_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'adult',
  age int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE partner_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  partner_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE trip_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  token text UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 16),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE trip_custom_options (
  id text NOT NULL,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  slot_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'attraction',
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, id)
);

CREATE TABLE trip_moments (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  moment text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, member_name)
);

CREATE TABLE trip_booked_slots (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  slot_id text NOT NULL,
  option_id text NOT NULL,
  booked_by text NOT NULL DEFAULT '',
  booked_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, slot_id)
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Public insert trips" ON trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update trips" ON trips FOR UPDATE USING (true);
CREATE POLICY "Public read members" ON trip_members FOR SELECT USING (true);
CREATE POLICY "Public insert members" ON trip_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read selections" ON slot_selections FOR SELECT USING (true);
CREATE POLICY "Public upsert selections" ON slot_selections FOR ALL USING (true);

CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users read own partners" ON travel_partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own partners" ON travel_partners FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users read own groups" ON partner_groups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own groups" ON partner_groups FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Read invitations by token" ON trip_invitations FOR SELECT USING (true);
CREATE POLICY "Auth users insert invitations" ON trip_invitations FOR INSERT WITH CHECK (auth.uid() = invited_by);
CREATE POLICY "Auth users update invitations" ON trip_invitations FOR UPDATE USING (true);

ALTER TABLE trip_custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_booked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read custom options" ON trip_custom_options FOR SELECT USING (true);
CREATE POLICY "Public insert custom options" ON trip_custom_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete custom options" ON trip_custom_options FOR DELETE USING (true);

CREATE POLICY "Public read moments" ON trip_moments FOR SELECT USING (true);
CREATE POLICY "Public upsert moments" ON trip_moments FOR ALL USING (true);

CREATE POLICY "Public read booked slots" ON trip_booked_slots FOR SELECT USING (true);
CREATE POLICY "Public upsert booked slots" ON trip_booked_slots FOR ALL USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE trips;
ALTER PUBLICATION supabase_realtime ADD TABLE slot_selections;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_custom_options;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_moments;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_booked_slots;
