-- 002_trip_extras.sql
-- Dedicated tables for write-in options, memorable moments, and booked slots.
-- These were previously stored inside itinerary_data (fragile, race conditions).

-- Custom write-in options added by trip members
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

-- Memorable moments per member per trip
CREATE TABLE IF NOT EXISTS trip_moments (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  moment text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, member_name)
);

-- Booked slots: which option is confirmed for a slot
CREATE TABLE IF NOT EXISTS trip_booked_slots (
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  slot_id text NOT NULL,
  option_id text NOT NULL,
  booked_by text NOT NULL DEFAULT '',
  booked_at timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, slot_id)
);

-- RLS: public access (same pattern as slot_selections — anyone with the link can participate)
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

-- Realtime for all three
ALTER PUBLICATION supabase_realtime ADD TABLE trip_custom_options;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_moments;
ALTER PUBLICATION supabase_realtime ADD TABLE trip_booked_slots;
