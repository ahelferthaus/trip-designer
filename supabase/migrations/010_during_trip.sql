-- ============================================
-- 010: During-Trip Experience Tables
-- GPS tracking, photo journal, daily stats
-- ============================================

-- Trip tracking sessions (start/stop recording)
CREATE TABLE IF NOT EXISTS trip_tracking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  total_distance_m real DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trip_tracking_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own sessions" ON trip_tracking_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON trip_tracking_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Trip members read sessions" ON trip_tracking_sessions FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

-- GPS tracking points (high volume breadcrumbs)
CREATE TABLE IF NOT EXISTS trip_tracking_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES trip_tracking_sessions(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL,
  user_id uuid NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  altitude_m real,
  accuracy_m real,
  speed_mps real,
  heading real,
  recorded_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_points_trip_user_time
  ON trip_tracking_points (trip_id, user_id, recorded_at);

ALTER TABLE trip_tracking_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own points" ON trip_tracking_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Trip members read points" ON trip_tracking_points FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

-- Journal entries (photos + text, geotagged)
CREATE TABLE IF NOT EXISTS trip_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type text NOT NULL DEFAULT 'text',
  body text,
  photo_url text,
  thumbnail_url text,
  lat double precision,
  lng double precision,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_trip_time
  ON trip_journal_entries (trip_id, recorded_at);

ALTER TABLE trip_journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own entries" ON trip_journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own entries" ON trip_journal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Trip members read entries" ON trip_journal_entries FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

-- Daily stats (steps, distance, photo count per user per day)
CREATE TABLE IF NOT EXISTS trip_daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  step_count integer DEFAULT 0,
  distance_walked_m real DEFAULT 0,
  distance_total_m real DEFAULT 0,
  photos_taken integer DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id, date)
);

ALTER TABLE trip_daily_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users upsert own stats" ON trip_daily_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Trip members read stats" ON trip_daily_stats FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);

-- Add status column to trips if not exists
DO $$ BEGIN
  ALTER TABLE trips ADD COLUMN IF NOT EXISTS status text DEFAULT 'planning';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
