-- 005_catch_up.sql
-- Idempotent: creates ALL missing tables, columns, policies, and indexes.
-- Safe to run on any state of the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------
-- TABLES (all IF NOT EXISTS)
-------------------------------------------------------------------

-- user_profiles (from 001)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_type text NOT NULL DEFAULT 'initials',
  avatar_value text NOT NULL DEFAULT '',
  default_passcode text NOT NULL DEFAULT '1234',
  bio text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- travel_partners (from 001)
CREATE TABLE IF NOT EXISTS travel_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'adult',
  age int,
  created_at timestamptz DEFAULT now()
);

-- partner_groups (from 001)
CREATE TABLE IF NOT EXISTS partner_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  partner_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- trip_invitations (from 001)
CREATE TABLE IF NOT EXISTS trip_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  token text UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 16),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- trip_custom_options (from 002)
CREATE TABLE IF NOT EXISTS trip_custom_options (
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

-- trip_moments (from 002)
CREATE TABLE IF NOT EXISTS trip_moments (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  moment text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, member_name)
);

-- trip_booked_slots (from 002)
CREATE TABLE IF NOT EXISTS trip_booked_slots (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  slot_id text NOT NULL,
  option_id text NOT NULL,
  booked_by text NOT NULL DEFAULT '',
  booked_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, slot_id)
);

-- trip_reviews (from 003)
CREATE TABLE IF NOT EXISTS trip_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- user_follows (from 004)
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'accepted',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- trip_comments (from 004)
CREATE TABLE IF NOT EXISTS trip_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES trip_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- trip_likes (from 004)
CREATE TABLE IF NOT EXISTS trip_likes (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, user_id)
);

-- activity_feed (from 004)
CREATE TABLE IF NOT EXISTS activity_feed (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-------------------------------------------------------------------
-- COLUMN ADDITIONS (all IF NOT EXISTS)
-------------------------------------------------------------------

-- trips columns from 001
ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- trips columns from 003
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cover_photo_url text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS view_count int NOT NULL DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS clone_count int NOT NULL DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- trips columns from 004
ALTER TABLE trips ADD COLUMN IF NOT EXISTS likes_count int NOT NULL DEFAULT 0;

-- trip_members columns from 001
ALTER TABLE trip_members ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- user_profiles columns from 004 (may already exist if table was just created)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-------------------------------------------------------------------
-- SEARCH TRIGGER (from 003, replaces generated column approach)
-------------------------------------------------------------------

CREATE OR REPLACE FUNCTION trips_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.destination, '') || ' ' ||
    coalesce(NEW.description, '') || ' ' ||
    coalesce(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trips_search_vector_trigger ON trips;
CREATE TRIGGER trips_search_vector_trigger
  BEFORE INSERT OR UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION trips_search_vector_update();

-- Backfill
UPDATE trips SET search_vector = to_tsvector('english',
  coalesce(title, '') || ' ' ||
  coalesce(destination, '') || ' ' ||
  coalesce(description, '') || ' ' ||
  coalesce(array_to_string(tags, ' '), '')
);

-------------------------------------------------------------------
-- INDEXES
-------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS trips_search_idx ON trips USING gin(search_vector);
CREATE INDEX IF NOT EXISTS trips_published_idx ON trips (is_published, visibility) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS activity_feed_actor_idx ON activity_feed (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS activity_feed_created_idx ON activity_feed (created_at DESC);
CREATE INDEX IF NOT EXISTS trip_comments_trip_idx ON trip_comments (trip_id, created_at);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON user_follows (following_id);

-------------------------------------------------------------------
-- RLS ENABLE
-------------------------------------------------------------------

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_booked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------
-- POLICIES (all DROP IF EXISTS + CREATE)
-------------------------------------------------------------------

-- trips
DROP POLICY IF EXISTS "Public read trips" ON trips;
DROP POLICY IF EXISTS "Public insert trips" ON trips;
DROP POLICY IF EXISTS "Public update trips" ON trips;
CREATE POLICY "Public read trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Public insert trips" ON trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update trips" ON trips FOR UPDATE USING (true);

-- trip_members
DROP POLICY IF EXISTS "Public read members" ON trip_members;
DROP POLICY IF EXISTS "Public insert members" ON trip_members;
CREATE POLICY "Public read members" ON trip_members FOR SELECT USING (true);
CREATE POLICY "Public insert members" ON trip_members FOR INSERT WITH CHECK (true);

-- slot_selections
DROP POLICY IF EXISTS "Public read selections" ON slot_selections;
DROP POLICY IF EXISTS "Public upsert selections" ON slot_selections;
CREATE POLICY "Public read selections" ON slot_selections FOR SELECT USING (true);
CREATE POLICY "Public upsert selections" ON slot_selections FOR ALL USING (true);

-- user_profiles
DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Read public profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Read public profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- travel_partners
DROP POLICY IF EXISTS "Users read own partners" ON travel_partners;
DROP POLICY IF EXISTS "Users manage own partners" ON travel_partners;
CREATE POLICY "Users read own partners" ON travel_partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own partners" ON travel_partners FOR ALL USING (auth.uid() = user_id);

-- partner_groups
DROP POLICY IF EXISTS "Users read own groups" ON partner_groups;
DROP POLICY IF EXISTS "Users manage own groups" ON partner_groups;
CREATE POLICY "Users read own groups" ON partner_groups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own groups" ON partner_groups FOR ALL USING (auth.uid() = user_id);

-- trip_invitations
DROP POLICY IF EXISTS "Read invitations by token" ON trip_invitations;
DROP POLICY IF EXISTS "Auth users insert invitations" ON trip_invitations;
DROP POLICY IF EXISTS "Auth users update invitations" ON trip_invitations;
CREATE POLICY "Read invitations by token" ON trip_invitations FOR SELECT USING (true);
CREATE POLICY "Auth users insert invitations" ON trip_invitations FOR INSERT WITH CHECK (auth.uid() = invited_by);
CREATE POLICY "Auth users update invitations" ON trip_invitations FOR UPDATE USING (true);

-- trip_custom_options
DROP POLICY IF EXISTS "Public read custom options" ON trip_custom_options;
DROP POLICY IF EXISTS "Public insert custom options" ON trip_custom_options;
DROP POLICY IF EXISTS "Public delete custom options" ON trip_custom_options;
CREATE POLICY "Public read custom options" ON trip_custom_options FOR SELECT USING (true);
CREATE POLICY "Public insert custom options" ON trip_custom_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete custom options" ON trip_custom_options FOR DELETE USING (true);

-- trip_moments
DROP POLICY IF EXISTS "Public read moments" ON trip_moments;
DROP POLICY IF EXISTS "Public upsert moments" ON trip_moments;
CREATE POLICY "Public read moments" ON trip_moments FOR SELECT USING (true);
CREATE POLICY "Public upsert moments" ON trip_moments FOR ALL USING (true);

-- trip_booked_slots
DROP POLICY IF EXISTS "Public read booked slots" ON trip_booked_slots;
DROP POLICY IF EXISTS "Public upsert booked slots" ON trip_booked_slots;
CREATE POLICY "Public read booked slots" ON trip_booked_slots FOR SELECT USING (true);
CREATE POLICY "Public upsert booked slots" ON trip_booked_slots FOR ALL USING (true);

-- trip_reviews
DROP POLICY IF EXISTS "Public read reviews" ON trip_reviews;
DROP POLICY IF EXISTS "Auth insert reviews" ON trip_reviews;
DROP POLICY IF EXISTS "Auth update own reviews" ON trip_reviews;
DROP POLICY IF EXISTS "Auth delete own reviews" ON trip_reviews;
CREATE POLICY "Public read reviews" ON trip_reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert reviews" ON trip_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own reviews" ON trip_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own reviews" ON trip_reviews FOR DELETE USING (auth.uid() = user_id);

-- user_follows
DROP POLICY IF EXISTS "Read follows" ON user_follows;
DROP POLICY IF EXISTS "Insert own follows" ON user_follows;
DROP POLICY IF EXISTS "Delete own follows" ON user_follows;
DROP POLICY IF EXISTS "Update follows targeting me" ON user_follows;
CREATE POLICY "Read follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Insert own follows" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Delete own follows" ON user_follows FOR DELETE USING (auth.uid() = follower_id);
CREATE POLICY "Update follows targeting me" ON user_follows FOR UPDATE USING (auth.uid() = following_id);

-- trip_comments
DROP POLICY IF EXISTS "Read comments" ON trip_comments;
DROP POLICY IF EXISTS "Insert comments" ON trip_comments;
DROP POLICY IF EXISTS "Delete own comments" ON trip_comments;
CREATE POLICY "Read comments" ON trip_comments FOR SELECT USING (true);
CREATE POLICY "Insert comments" ON trip_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own comments" ON trip_comments FOR DELETE USING (auth.uid() = user_id);

-- trip_likes
DROP POLICY IF EXISTS "Read likes" ON trip_likes;
DROP POLICY IF EXISTS "Insert likes" ON trip_likes;
DROP POLICY IF EXISTS "Delete own likes" ON trip_likes;
CREATE POLICY "Read likes" ON trip_likes FOR SELECT USING (true);
CREATE POLICY "Insert likes" ON trip_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own likes" ON trip_likes FOR DELETE USING (auth.uid() = user_id);

-- activity_feed
DROP POLICY IF EXISTS "Read feed" ON activity_feed;
DROP POLICY IF EXISTS "Insert feed" ON activity_feed;
CREATE POLICY "Read feed" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Insert feed" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = actor_id);

-------------------------------------------------------------------
-- REALTIME
-------------------------------------------------------------------

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE trips;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE slot_selections;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE trip_custom_options;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE trip_moments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE trip_booked_slots;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
