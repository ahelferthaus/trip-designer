-- 004_social_network.sql
-- Follow system, activity feed, comments, likes, profile extensions

-- Profile extensions
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Trip privacy
ALTER TABLE trips ADD COLUMN IF NOT EXISTS likes_count int NOT NULL DEFAULT 0;

-- Follow system (one-way, like Instagram/Strava)
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'accepted', -- 'pending' or 'accepted'
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Trip comments (threaded one level deep)
CREATE TABLE IF NOT EXISTS trip_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES trip_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Trip likes
CREATE TABLE IF NOT EXISTS trip_likes (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, user_id)
);

-- Activity feed (denormalized for fast reads)
CREATE TABLE IF NOT EXISTS activity_feed (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL, -- 'published', 'cloned', 'commented', 'liked'
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_feed_actor_idx ON activity_feed (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS activity_feed_created_idx ON activity_feed (created_at DESC);
CREATE INDEX IF NOT EXISTS trip_comments_trip_idx ON trip_comments (trip_id, created_at);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON user_follows (following_id);

-- RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- user_follows: read own + targeting you; manage own
CREATE POLICY "Read follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Insert own follows" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Delete own follows" ON user_follows FOR DELETE USING (auth.uid() = follower_id);
CREATE POLICY "Update follows targeting me" ON user_follows FOR UPDATE USING (auth.uid() = following_id);

-- trip_comments: public read on published trips, auth insert, delete own
CREATE POLICY "Read comments" ON trip_comments FOR SELECT USING (true);
CREATE POLICY "Insert comments" ON trip_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own comments" ON trip_comments FOR DELETE USING (auth.uid() = user_id);

-- trip_likes: public read, auth insert/delete own
CREATE POLICY "Read likes" ON trip_likes FOR SELECT USING (true);
CREATE POLICY "Insert likes" ON trip_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own likes" ON trip_likes FOR DELETE USING (auth.uid() = user_id);

-- activity_feed: read all (filtered in app by who you follow)
CREATE POLICY "Read feed" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Insert feed" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- Allow reading any public profile (drop old restrictive policy if it exists)
DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Read public profiles" ON user_profiles;
CREATE POLICY "Read public profiles" ON user_profiles FOR SELECT USING (true);
