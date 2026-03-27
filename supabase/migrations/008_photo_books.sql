-- 008_photo_books.sql
-- Photo book drafts and orders

CREATE TABLE IF NOT EXISTS photo_books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  template text NOT NULL DEFAULT 'minimal', -- 'minimal' | 'scrapbook'
  cover_photo_url text,
  pages jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'draft', -- 'draft' | 'preview' | 'ordered' | 'shipped'
  order_id text, -- external print provider order ID
  order_provider text, -- 'lulu' | 'blurb' | 'pdf'
  order_meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS photo_books_trip_idx ON photo_books (trip_id);
CREATE INDEX IF NOT EXISTS photo_books_user_idx ON photo_books (user_id);

ALTER TABLE photo_books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own books" ON photo_books;
DROP POLICY IF EXISTS "Users manage own books" ON photo_books;
CREATE POLICY "Users read own books" ON photo_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own books" ON photo_books FOR ALL USING (auth.uid() = user_id);
