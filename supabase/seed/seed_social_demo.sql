-- Seed: Demo social data
-- Creates sample comments, likes, and activity feed items on existing trips
-- Run AFTER loading trip seeds
-- Requires at least one user in auth.users

DO $$
DECLARE
  uid uuid;
  trip1_id uuid;
  trip2_id uuid;
  trip3_id uuid;
  trip4_id uuid;
  trip5_id uuid;
BEGIN
  -- Get the user
  SELECT id INTO uid FROM auth.users LIMIT 1;
  IF uid IS NULL THEN
    RAISE EXCEPTION 'No users found. Sign up first.';
  END IF;

  -- Get some trip IDs (first 5 published trips)
  SELECT id INTO trip1_id FROM trips WHERE is_published = true ORDER BY created_at LIMIT 1 OFFSET 0;
  SELECT id INTO trip2_id FROM trips WHERE is_published = true ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO trip3_id FROM trips WHERE is_published = true ORDER BY created_at LIMIT 1 OFFSET 2;
  SELECT id INTO trip4_id FROM trips WHERE is_published = true ORDER BY created_at LIMIT 1 OFFSET 3;
  SELECT id INTO trip5_id FROM trips WHERE is_published = true ORDER BY created_at LIMIT 1 OFFSET 4;

  -- Add likes to trips
  IF trip1_id IS NOT NULL THEN
    INSERT INTO trip_likes (trip_id, user_id) VALUES (trip1_id, uid) ON CONFLICT DO NOTHING;
    UPDATE trips SET likes_count = likes_count + 1 WHERE id = trip1_id;
  END IF;
  IF trip2_id IS NOT NULL THEN
    INSERT INTO trip_likes (trip_id, user_id) VALUES (trip2_id, uid) ON CONFLICT DO NOTHING;
    UPDATE trips SET likes_count = likes_count + 1 WHERE id = trip2_id;
  END IF;
  IF trip3_id IS NOT NULL THEN
    INSERT INTO trip_likes (trip_id, user_id) VALUES (trip3_id, uid) ON CONFLICT DO NOTHING;
    UPDATE trips SET likes_count = likes_count + 1 WHERE id = trip3_id;
  END IF;

  -- Add comments to trips
  IF trip1_id IS NOT NULL THEN
    INSERT INTO trip_comments (trip_id, user_id, body) VALUES
      (trip1_id, uid, 'This looks amazing! We did a similar trip last year and loved every minute.'),
      (trip1_id, uid, 'The hidden gem tips are gold. Thanks for sharing!');
  END IF;
  IF trip2_id IS NOT NULL THEN
    INSERT INTO trip_comments (trip_id, user_id, body) VALUES
      (trip2_id, uid, 'Adding this to our bucket list for next spring.'),
      (trip2_id, uid, 'Great restaurant recommendations — the food spots are always the hardest to find.');
  END IF;
  IF trip3_id IS NOT NULL THEN
    INSERT INTO trip_comments (trip_id, user_id, body) VALUES
      (trip3_id, uid, 'We''re planning this exact trip for February. Any tips on timing?');
  END IF;
  IF trip4_id IS NOT NULL THEN
    INSERT INTO trip_comments (trip_id, user_id, body) VALUES
      (trip4_id, uid, 'The day-by-day breakdown is so helpful. Cloning this for our group!');
  END IF;

  -- Add view counts to make trips look active
  UPDATE trips SET view_count = view_count + floor(random() * 50 + 10)::int WHERE is_published = true;

  -- Add some clone counts
  UPDATE trips SET clone_count = clone_count + floor(random() * 8 + 1)::int WHERE is_published = true AND random() < 0.4;

  -- Add activity feed items
  IF trip1_id IS NOT NULL THEN
    INSERT INTO activity_feed (actor_id, action_type, trip_id, metadata) VALUES
      (uid, 'published', trip1_id, '{"note": "Just published my trip!"}'),
      (uid, 'liked', trip1_id, '{}');
  END IF;
  IF trip2_id IS NOT NULL THEN
    INSERT INTO activity_feed (actor_id, action_type, trip_id, metadata) VALUES
      (uid, 'published', trip2_id, '{"note": "New trip published"}'),
      (uid, 'commented', trip2_id, '{"body": "Great restaurant recommendations"}');
  END IF;
  IF trip3_id IS NOT NULL THEN
    INSERT INTO activity_feed (actor_id, action_type, trip_id, metadata) VALUES
      (uid, 'cloned', trip3_id, '{"note": "Cloned for our family trip"}');
  END IF;

  -- Update user profile with sample data if empty
  UPDATE user_profiles SET
    bio = CASE WHEN bio = '' THEN 'Travel enthusiast. Building VYBR to help everyone plan amazing trips.' ELSE bio END,
    is_public = true
  WHERE id = uid;

  RAISE NOTICE 'Demo social data inserted: likes, comments, views, clones, and feed items';
END $$;
