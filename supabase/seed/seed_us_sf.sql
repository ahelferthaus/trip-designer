-- Seed: San Francisco Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'San Francisco: Golden Gate, Fog & Sourdough',
  'San Francisco, CA',
  '2026-07-03', '2026-07-06', '1234',
  '{"destination":{"name":"San Francisco, CA"},"start_date":"2026-07-03","end_date":"2026-07-06","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food","nature"]}'::jsonb,
  '{
    "title":"San Francisco: Golden Gate, Fog & Sourdough",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-07-03","day_number":1,"title":"Golden Gate & Fisherman''s Wharf",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Walk the Golden Gate Bridge","description":"1.7-mile walk across the most famous bridge in the world — fog rolls in dramatically in the morning.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Golden Gate Bridge"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic bridge on Earth"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Tartine Bakery Breakfast","description":"San Francisco''s most famous bakery — morning buns, croissants, and the bread that launched a movement.","category":"food","estimated_cost_per_person":12,"duration_minutes":30,"location":{"name":"Tartine Bakery, Mission"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The bakery that changed American bread culture"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Fisherman''s Wharf & Pier 39 Sea Lions","description":"Yes it''s touristy, but the sea lions at Pier 39 are genuinely amazing. Plus Boudin sourdough bread bowls.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Fisherman''s Wharf / Pier 39"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sea lions lounging and barking — kids and adults love it"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Cable Car Ride","description":"The last manually operated cable car system in the world — ride the Powell-Hyde line for the best views.","category":"transport","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Powell-Hyde Cable Car"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"A rolling National Historic Landmark"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner at State Bird Provisions","description":"Michelin-starred dim sum-style service — dishes come to you on a cart. Creative California cuisine.","category":"food","estimated_cost_per_person":55,"duration_minutes":90,"location":{"name":"State Bird Provisions, Western Addition"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of the most inventive restaurants in America"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"North Beach Italian Dinner","description":"SF''s Little Italy — pasta at Tosca Cafe or pizza at Tony''s Coal-Fired, then cannoli at Stella Pastry.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"North Beach"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Italian-American dining in the shadow of Coit Tower"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-07-04","day_number":2,"title":"Mission, Castro & Haight",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Mission District Murals & Taquerias","description":"Balmy Alley murals, Clarion Alley street art, then the best burritos outside Mexico at La Taqueria.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":150,"location":{"name":"Mission District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"SF''s most vibrant neighborhood — murals, food, and culture"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Brunch at Zazie","description":"French bistro brunch with no tipping — shakshuka, croque madame, and a cocktail garden.","category":"food","estimated_cost_per_person":25,"duration_minutes":60,"location":{"name":"Zazie, Cole Valley"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The no-tip model works because the food is extraordinary"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Golden Gate Park","description":"Bigger than Central Park — Japanese Tea Garden, de Young Museum, California Academy of Sciences, bison paddock.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Golden Gate Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"An entire day''s worth of world-class attractions in one park"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Haight-Ashbury Walk","description":"The birthplace of the 1967 Summer of Love — vintage shops, psychedelic murals, and counterculture vibes.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Haight-Ashbury"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where the hippie movement started"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"4th of July Fireworks at Crissy Field","description":"Watch fireworks over the Golden Gate Bridge from Crissy Field beach — bring blankets and layers.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Crissy Field, Presidio"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Fireworks with the Golden Gate Bridge as backdrop — unforgettable"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Cocktails at Trick Dog","description":"Menu changes themes every 6 months — once a conspiracy theory menu, once a Pantone color chart. Always incredible.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Trick Dog, Mission"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"America''s most creative cocktail menu"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-07-05","day_number":3,"title":"Alcatraz & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Alcatraz Island Tour","description":"Ferry to ''The Rock'' — audio tour narrated by former inmates and guards. Book weeks ahead.","category":"attraction","estimated_cost_per_person":42,"duration_minutes":180,"location":{"name":"Alcatraz Island"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the most fascinating tours in America"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Exploratorium","description":"Hands-on science museum on Pier 15 — tactile dome, wave machines, fog bridges. Adults love it as much as kids.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":150,"location":{"name":"Exploratorium, Pier 15"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most fun museum in San Francisco"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Ferry Building Marketplace","description":"Artisan food hall on the waterfront — Cowgirl Creamery cheese, Blue Bottle, Hog Island Oysters.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Ferry Building"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"SF''s food culture in one beautiful building"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Chinatown Walk","description":"The oldest Chinatown in North America — dim sum, apothecaries, temples, and dragon gate.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Chinatown, Grant Avenue"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Vibrant, authentic, and endlessly fascinating"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Cioppino at Sotto Mare","description":"SF''s famous Italian seafood stew — crab, clams, mussels, shrimp in tomato broth. Cash only.","category":"food","estimated_cost_per_person":35,"duration_minutes":60,"location":{"name":"Sotto Mare, North Beach"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Cioppino was invented in San Francisco — this is the best"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Sunset at Baker Beach","description":"Panoramic Golden Gate Bridge views from the sand — the most dramatic bridge perspective.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Baker Beach, Presidio"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The definitive San Francisco farewell view"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Skip the Powell-Mason cable car (always packed) — take the California Street line instead. Same experience, way fewer tourists.","location":"California Street Cable Car"},
      {"day_number":2,"tip":"La Taqueria on Mission St won the James Beard award for best burrito — order the ''dorado style'' (griddled crispy). No rice, that''s a San Diego thing.","location":"La Taqueria, Mission St"},
      {"day_number":3,"tip":"Alcatraz night tours (Thursday-Monday) are far more atmospheric than day tours — the sunset ferry ride alone is worth it. Book 2+ months ahead.","location":"Alcatraz Island"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day San Francisco weekend: Golden Gate Bridge, Alcatraz, Mission burritos, Chinatown, cable cars, and incredible Pacific views.',
  ARRAY['sf', 'san-francisco', 'usa', 'weekend', 'culture', 'food', 'nature']
);
RAISE NOTICE 'San Francisco weekend trip inserted';
END $$;
