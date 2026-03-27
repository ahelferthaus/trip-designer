-- Seed: San Diego Family Spring Break
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'San Diego: Zoo, Beach & LEGOLAND',
  'San Diego, CA',
  '2026-03-21', '2026-03-28', '1234',
  '{"destination":{"name":"San Diego, CA"},"start_date":"2026-03-21","end_date":"2026-03-28","group_members":[{"name":"Mom","type":"adult"},{"name":"Dad","type":"adult"},{"name":"Kid","type":"child","age":8}],"budget_level":"mid","vibes":["family","nature","relaxed"]}'::jsonb,
  '{
    "title":"San Diego: Zoo, Beach & LEGOLAND",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-21","day_number":1,"title":"San Diego Zoo",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"San Diego Zoo — Morning Safari","description":"World-famous zoo with pandas, koalas, elephants, polar bears. Take the Skyfari aerial tram for views.","category":"adventure","estimated_cost_per_person":67,"duration_minutes":300,"location":{"name":"San Diego Zoo, Balboa Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"#1 zoo in the world — kids will remember this forever"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast Burritos at Lola 55","description":"Birria breakfast tacos, chilaquiles, and horchata cold brew — authentic Mexican morning.","category":"food","estimated_cost_per_person":14,"duration_minutes":45,"location":{"name":"Lola 55, East Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"San Diego does Mexican breakfast better than anywhere in the US"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Zoo continued — Africa Rocks & Lost Forest","description":"Penguins, gorillas, orangutans, and the leopard exhibit — the zoo''s best afternoon sections.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"San Diego Zoo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"There''s easily a full day of content here"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Balboa Park Museums","description":"Free gardens + 17 museums in a Spanish Colonial setting. Air & Space, Natural History, and Model Railroad museums.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Balboa Park"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Culture and beauty surrounding the zoo"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Fish Tacos at Oscar''s Mexican Seafood","description":"Street-style fish tacos with battered cod, cabbage slaw, creamy sauce — the San Diego staple.","category":"food","estimated_cost_per_person":10,"duration_minutes":30,"location":{"name":"Oscar''s Mexican Seafood, Hillcrest"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best fish tacos in San Diego, no debate"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Sunset at La Jolla Cove","description":"Watch the sunset over the Pacific with sea lions barking below — magical family moment.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"La Jolla Cove"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sea lions + sunset = unforgettable"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-22","day_number":2,"title":"LEGOLAND Day",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"LEGOLAND California","description":"30+ rides for kids, Miniland USA (entire cities built from LEGO), and the Driving School.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":300,"location":{"name":"LEGOLAND, Carlsbad"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The ultimate theme park for kids under 12"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Flower Fields at Carlsbad","description":"50 acres of ranunculus flowers in bloom (March–May). Stunning rainbow hillside near LEGOLAND.","category":"nature","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"The Flower Fields, Carlsbad"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Only blooms during spring break — perfect timing"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"LEGOLAND Water Park","description":"Build your own LEGO raft, lazy river, splash zone, and tube slides — bring swimsuits.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"LEGOLAND Water Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Cool off after a morning of rides"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Lunch at LEGOLAND","description":"Multiple options inside — pizza, burgers, chicken. The Apple Fries at Granny''s are legendary.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"LEGOLAND restaurants"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Granny''s Apple Fries are a LEGOLAND institution"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner in Carlsbad Village","description":"Charming seaside town — walk the shops, get ice cream at Handel''s, dinner at Pizza Port.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Carlsbad Village"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Small-town beach vibes after a big park day"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Board Games & Pool Night","description":"Wind down at the hotel — swim, play cards, early bed. Tomorrow is another adventure.","category":"rest","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Hotel"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Recharge for tomorrow"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-23","day_number":3,"title":"La Jolla & Beach Day",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"La Jolla Sea Lions & Tide Pools","description":"Walk the La Jolla shoreline — sea lions sunbathing, tide pools with starfish, and snorkeling.","category":"nature","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"La Jolla Shores"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Wild sea lions right on the beach — kids are mesmerized"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Kayak Tour of La Jolla Caves","description":"Family kayak tour through sea caves — see leopard sharks, sea lions, and hidden beaches.","category":"adventure","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"La Jolla Sea Caves"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Paddling through sea caves is a San Diego bucket list item"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Mission Beach Boardwalk","description":"3-mile boardwalk — rent bikes, ride Belmont Park''s Giant Dipper roller coaster, play arcade games.","category":"adventure","estimated_cost_per_person":10,"duration_minutes":180,"location":{"name":"Mission Beach / Belmont Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Classic California boardwalk fun"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"USS Midway Museum","description":"Tour an actual aircraft carrier — flight simulators, cockpit climbing, and 29 restored aircraft on deck.","category":"attraction","estimated_cost_per_person":26,"duration_minutes":150,"location":{"name":"USS Midway Museum, Harbor"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Kids love climbing on a real aircraft carrier"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Dinner at Hodad''s","description":"Legendary burger joint — massive bacon cheeseburgers, milkshakes, and license plates on every wall.","category":"food","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"Hodad''s, Ocean Beach"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best burger in San Diego — cash only, always worth the wait"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Sunset Cliffs Golden Hour","description":"Dramatic Pacific cliffs that glow orange at sunset — bring a blanket and sit on the edge.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Sunset Cliffs, Point Loma"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most photogenic sunset in Southern California"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"San Diego Zoo is enormous — download the app and use the map to prioritize. Pandas and koalas have the longest lines, go first.","location":"San Diego Zoo"},
      {"day_number":2,"tip":"LEGOLAND pro tip: the Build & Test area is air-conditioned and kids can spend hours there while parents rest.","location":"LEGOLAND"},
      {"day_number":3,"tip":"At La Jolla, walk to the Children''s Pool — it''s where harbor seals haul out. The viewing is from a wall above, not in the water.","location":"Children''s Pool, La Jolla"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day San Diego family trip: World-famous zoo, LEGOLAND, La Jolla sea lions, Mission Beach boardwalk, and incredible fish tacos.',
  ARRAY['san-diego', 'usa', 'family', 'spring-break', 'zoo', 'legoland', 'beach']
);
RAISE NOTICE 'San Diego family spring break inserted';
END $$;
