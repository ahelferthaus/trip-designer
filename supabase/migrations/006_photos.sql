-- 006_photos.sql
-- Per-activity photos: one photo per user per slot

CREATE TABLE IF NOT EXISTS trip_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  slot_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, slot_id, user_id)
);

CREATE INDEX IF NOT EXISTS trip_photos_trip_idx ON trip_photos (trip_id);
CREATE INDEX IF NOT EXISTS trip_photos_slot_idx ON trip_photos (trip_id, slot_id);

ALTER TABLE trip_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read photos" ON trip_photos;
DROP POLICY IF EXISTS "Auth insert photos" ON trip_photos;
DROP POLICY IF EXISTS "Auth delete own photos" ON trip_photos;
DROP POLICY IF EXISTS "Auth update own photos" ON trip_photos;

CREATE POLICY "Public read photos" ON trip_photos FOR SELECT USING (true);
CREATE POLICY "Auth insert photos" ON trip_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own photos" ON trip_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own photos" ON trip_photos FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for trip photos (run this separately in Supabase Dashboard > Storage if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('trip-photos', 'trip-photos', true)
-- ON CONFLICT DO NOTHING;
