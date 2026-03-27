-- Seed: New Orleans Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'New Orleans: Jazz, Beignets & Bourbon Street',
  'New Orleans, LA',
  '2026-06-12', '2026-06-15', '1234',
  '{"destination":{"name":"New Orleans, LA"},"start_date":"2026-06-12","end_date":"2026-06-15","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["food","nightlife","culture"]}'::jsonb,
  '{
    "title":"New Orleans: Jazz, Beignets & Bourbon Street",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-12","day_number":1,"title":"French Quarter",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Beignets at Café Du Monde","description":"Powdered sugar mountains on hot fried dough since 1862 — café au lait mandatory. Open 24 hours.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Café Du Monde, French Market"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic breakfast in America"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"French Quarter Walking Tour","description":"Jackson Square, St. Louis Cathedral, Pirates Alley, Royal Street galleries, and wrought-iron balconies.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"French Quarter"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"300 years of history in every block"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Po'' Boy at Parkway Bakery","description":"Roast beef or fried shrimp po'' boy — dressed with lettuce, tomato, pickles, and mayo on crispy French bread.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Parkway Bakery & Tavern, Mid-City"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best po'' boy in New Orleans — worth the drive"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"National WWII Museum","description":"The #1 museum in America (TripAdvisor) — immersive exhibits, real aircraft, and a 4D theater.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"National WWII Museum, Warehouse District"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Genuinely one of the best museums in the world"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Bourbon Street Night","description":"Neon, open containers, live music pouring out of every door — love it or hate it, you have to see it once.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Bourbon Street"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most famous party street in America"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Jazz at Preservation Hall","description":"Intimate jazz venue since 1961 — no food, no drinks, just pure traditional New Orleans jazz. Standing room.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":50,"location":{"name":"Preservation Hall, French Quarter"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The purest jazz experience in the world"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-13","day_number":2,"title":"Garden District & Bayou",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"St. Charles Streetcar & Garden District","description":"Ride the 1920s streetcar through the oak-lined avenue, hop off to walk past antebellum mansions.","category":"attraction","estimated_cost_per_person":2,"duration_minutes":120,"location":{"name":"St. Charles Avenue / Garden District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most beautiful streetcar ride in America"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Brunch at Commander''s Palace","description":"The 25-cent martini lunch is legendary — turtle soup, pecan-crusted Gulf fish, bread pudding soufflé.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Commander''s Palace, Garden District"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where Emeril and Paul Prudhomme learned to cook"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Swamp Tour","description":"Airboat through Louisiana bayou — alligators, herons, cypress trees draped in Spanish moss.","category":"adventure","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"Bayou Swamp Tours, Lafitte"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"See real alligators in the wild — 30 minutes from downtown"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Magazine Street Shopping","description":"6-mile stretch of boutiques, antique shops, galleries, and restaurants — the uptown locals'' favorite.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Magazine Street"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"New Orleans'' best shopping street"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Crawfish Boil","description":"Seasonal crawfish (Feb–June) boiled with corn, potatoes, and andouille — get messy, it''s expected.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Bevi Seafood Co. or Clesi''s"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"A New Orleans ritual — crack shells, suck heads, eat tails"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Live Music on Frenchmen Street","description":"The locals'' alternative to Bourbon Street — better music, better vibes, better people.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Frenchmen Street, Marigny"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where New Orleanians actually go for live music"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-14","day_number":3,"title":"Bywater & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Bywater Neighborhood & Street Art","description":"Colorful shotgun houses, the Studio Be warehouse gallery, and the Press Street railroad gardens.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Bywater"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"New Orleans'' most artistically vibrant neighborhood"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Eggs Benedict at Elizabeth''s","description":"''Real food done real good'' — praline bacon, boudin balls, and the best brunch in the Bywater.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"Elizabeth''s, Bywater"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Praline bacon should be a controlled substance"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Gumbo & Jambalaya at Coop''s Place","description":"Tiny, packed, cash-only Cajun joint — the rabbit & sausage jambalaya is legendary.","category":"food","estimated_cost_per_person":18,"duration_minutes":30,"location":{"name":"Coop''s Place, French Quarter"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Real Cajun food in a real New Orleans dive bar"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Voodoo Museum & St. Louis Cemetery","description":"Tiny voodoo museum, then walk through the above-ground tombs of Cemetery No. 1 (guided tour required).","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"St. Louis Cemetery No. 1"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"New Orleans'' eerie, spiritual side"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Hurricane at Pat O''Brien''s","description":"The iconic pink cocktail in the flame-fountain courtyard — the ultimate NOLA goodbye drink.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Pat O''Brien''s, French Quarter"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"You can''t leave New Orleans without a Hurricane"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Muffuletta at Central Grocery","description":"The original muffuletta since 1906 — layers of Italian meats, provolone, and olive salad on round bread.","category":"food","estimated_cost_per_person":15,"duration_minutes":20,"location":{"name":"Central Grocery, Decatur St"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The sandwich that rivals the po'' boy — split one, it''s enormous"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Skip the Bourbon Street hand grenades — walk 2 blocks to Royal Street for better bars and actual live jazz in the street.","location":"Royal Street, French Quarter"},
      {"day_number":2,"tip":"Frenchmen Street is infinitely better than Bourbon — d.b.a. and The Spotted Cat have the best live music with no cover.","location":"Frenchmen Street"},
      {"day_number":3,"tip":"At Central Grocery, order the muffuletta half — it''s still enough for two people. Get there before 11am to avoid the line.","location":"Central Grocery"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day New Orleans weekend: Beignets, jazz at Preservation Hall, Bourbon Street, swamp tour, crawfish boil, and Frenchmen Street music.',
  ARRAY['nola', 'new-orleans', 'usa', 'weekend', 'food', 'jazz', 'nightlife', 'culture']
);
RAISE NOTICE 'New Orleans weekend trip inserted';
END $$;
