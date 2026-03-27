-- Seed: Nashville Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Nashville: Honky Tonks, Hot Chicken & Country',
  'Nashville, TN',
  '2026-06-05', '2026-06-08', '1234',
  '{"destination":{"name":"Nashville, TN"},"start_date":"2026-06-05","end_date":"2026-06-08","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["nightlife","food"],"travel_theme":"nightlife-music"}'::jsonb,
  '{
    "title":"Nashville: Honky Tonks, Hot Chicken & Country",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-05","day_number":1,"title":"Broadway & Downtown",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Country Music Hall of Fame","description":"Interactive museum tracing country from its roots to Taylor Swift — costumes, instruments, and listening booths.","category":"attraction","estimated_cost_per_person":28,"duration_minutes":150,"location":{"name":"Country Music Hall of Fame"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The Smithsonian of country music"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Biscuits at Loveless Cafe","description":"Nashville''s most famous biscuits — fluffy, buttery, with country ham and red-eye gravy.","category":"food","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"Loveless Cafe, Highway 100"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Biscuits so good they''re a landmark"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Hot Chicken at Prince''s","description":"The original Nashville hot chicken since 1945 — order ''medium'' your first time. Extra hot is no joke.","category":"food","estimated_cost_per_person":12,"duration_minutes":30,"location":{"name":"Prince''s Hot Chicken, various"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where hot chicken was invented — the real deal"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Ryman Auditorium Tour","description":"The ''Mother Church of Country Music'' — where Johnny Cash and Patsy Cline performed. Self-guided tour.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":60,"location":{"name":"Ryman Auditorium"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Sacred ground for music lovers"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Broadway Honky Tonk Crawl","description":"Lower Broadway — free live music at Tootsie''s, Robert''s Western World, The Stage. No cover, tip the band.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Lower Broadway"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"4 blocks of non-stop live music — the energy is electric"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Grand Ole Opry Show","description":"The longest-running radio show in history — country legends and new artists every Saturday night.","category":"attraction","estimated_cost_per_person":55,"duration_minutes":150,"location":{"name":"Grand Ole Opry House"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most prestigious stage in country music"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-06","day_number":2,"title":"East Nashville & Music Row",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"East Nashville Walk","description":"Nashville''s hipster heart — vintage shops, coffee at Barista Parlor, murals, and the Five Points scene.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"East Nashville, Five Points"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where Nashville''s creative class lives and eats"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Pancakes at Pancake Pantry","description":"Nashville institution since 1961 — 23 varieties of pancakes. Line is part of the tradition.","category":"food","estimated_cost_per_person":14,"duration_minutes":45,"location":{"name":"Pancake Pantry, Hillsboro Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most beloved breakfast spot in Nashville"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Music Row & RCA Studio B","description":"The street where hit records are made — tour the studio where Elvis, Dolly, and Waylon recorded.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"RCA Studio B, Music Row"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Stand where Elvis stood — goosebumps guaranteed"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Hatch Show Print","description":"Working letterpress shop since 1879 — see live printing, buy posters of your favorite artists.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Hatch Show Print, Broadway"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The print shop behind every iconic concert poster"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Husk","description":"Sean Brock''s Southern masterpiece — heritage grains, local pork, and a menu that changes daily.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Husk, Rutledge Hill"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The restaurant that redefined Southern cuisine"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Songwriter Round at The Bluebird Cafe","description":"Intimate 90-seat venue where songwriters play their hits — Taylor Swift was discovered here.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"The Bluebird Cafe"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most famous songwriting venue in the world — book ahead"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-07","day_number":3,"title":"12 South & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"12 South Neighborhood Walk","description":"Trendy strip — Draper James (Reese Witherspoon''s store), boutiques, and the ''I Believe in Nashville'' mural.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"12 South"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Nashville''s most walkable and photogenic neighborhood"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Biscuit Love","description":"Nashville''s brunch obsession — bonuts (biscuit donuts), shrimp & grits, East Nashville scramble.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"Biscuit Love, 12 South"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The bonuts alone are worth the trip to Nashville"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"The Parthenon","description":"Full-scale replica of the Greek Parthenon — with a 42-foot Athena statue inside. Only in Nashville.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"The Parthenon, Centennial Park"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Why does Nashville have a Greek temple? Because it can."},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Boot Shopping on Broadway","description":"Custom cowboy boots at Lucchese or a $30 pair from a tourist shop — you choose.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Broadway boot shops"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"You can''t leave Nashville without boots"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at Robert''s Western World","description":"The best honky tonk on Broadway — real country music, cold beer, and fried bologna sandwiches.","category":"food","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Robert''s Western World, Broadway"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Locals agree: Robert''s is the best honky tonk, period"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Hot Chicken at Hattie B''s","description":"The hot chicken rival — ''shut the cluck up'' heat level. Get it with pimento mac & cheese.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Hattie B''s, various"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The Nashville hot chicken debate never ends — try both Prince''s and Hattie B''s"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Robert''s Western World, the fried bologna sandwich is $5 and genuinely delicious. The house band (Brazilbilly) is incredible.","location":"Robert''s Western World"},
      {"day_number":2,"tip":"The Bluebird Cafe takes online reservations — they open up exactly one week before each show. Set a reminder or you''ll miss it.","location":"The Bluebird Cafe"},
      {"day_number":3,"tip":"Skip the pedal taverns (loud, drunk, annoying) and rent electric scooters instead — you''ll see more of the city.","location":"Any Nashville street"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Nashville weekend: Broadway honky tonks, hot chicken, Grand Ole Opry, Bluebird Cafe songwriters, and boot shopping.',
  ARRAY['nashville', 'usa', 'weekend', 'food', 'music', 'nightlife', 'country']
);
RAISE NOTICE 'Nashville weekend trip inserted';
END $$;
