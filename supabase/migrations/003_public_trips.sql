-- 003_public_trips.sql
-- Public trip publishing, search, cloning, reviews

-- Add publishing columns to trips
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cover_photo_url text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS view_count int NOT NULL DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS clone_count int NOT NULL DEFAULT 0;

-- Full-text search index
ALTER TABLE trips ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(destination, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS trips_search_idx ON trips USING gin(search_vector);
CREATE INDEX IF NOT EXISTS trips_published_idx ON trips (is_published, visibility) WHERE is_published = true;

-- Trip reviews
CREATE TABLE IF NOT EXISTS trip_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

ALTER TABLE trip_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON trip_reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert reviews" ON trip_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own reviews" ON trip_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own reviews" ON trip_reviews FOR DELETE USING (auth.uid() = user_id);
