-- 009_postcards.sql
-- Postcard drafts, send history, and delivery tracking

CREATE TABLE IF NOT EXISTS postcards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  message text NOT NULL DEFAULT '',
  template text NOT NULL DEFAULT 'minimal', -- 'minimal' | 'vintage' | 'family'
  recipient_name text NOT NULL DEFAULT '',
  recipient_email text,
  recipient_phone text,
  recipient_address jsonb, -- { street1, street2, city, state, postalCode, country }
  delivery_type text NOT NULL DEFAULT 'email', -- 'email' | 'sms' | 'print'
  status text NOT NULL DEFAULT 'draft', -- 'draft' | 'sent' | 'delivered' | 'failed'
  provider_id text, -- external ID from SendGrid/Twilio/Lob
  provider_meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS postcards_user_idx ON postcards (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS postcards_trip_idx ON postcards (trip_id);

ALTER TABLE postcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own postcards" ON postcards;
DROP POLICY IF EXISTS "Users manage own postcards" ON postcards;
CREATE POLICY "Users read own postcards" ON postcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own postcards" ON postcards FOR ALL USING (auth.uid() = user_id);
