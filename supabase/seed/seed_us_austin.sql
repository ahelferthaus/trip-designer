-- Seed: Austin Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Austin: BBQ, Live Music & Keep It Weird',
  'Austin, TX',
  '2026-05-29', '2026-06-01', '1234',
  '{"destination":{"name":"Austin, TX"},"start_date":"2026-05-29","end_date":"2026-06-01","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["food","nightlife"],"travel_theme":"nightlife-music"}'::jsonb,
  '{
    "title":"Austin: BBQ, Live Music & Keep It Weird",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-29","day_number":1,"title":"BBQ & South Congress",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Franklin Barbecue","description":"The most famous BBQ in America — line starts at 8am, sells out by 1pm. Brisket, pulled pork, sausage.","category":"food","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Franklin Barbecue, East 11th"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Worth the 3-hour wait — the best brisket on the planet"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast Tacos at Veracruz All Natural","description":"Austin''s best breakfast tacos — migas, bacon & egg, green salsa. Order at the food truck window.","category":"food","estimated_cost_per_person":8,"duration_minutes":20,"location":{"name":"Veracruz All Natural, East Austin"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The breakfast taco is Austin''s love language"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"South Congress (SoCo) Stroll","description":"Austin''s coolest strip — vintage shops, boot stores, food trucks, and the ''I love you so much'' mural.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"South Congress Avenue"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where Keep Austin Weird lives on"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Barton Springs Pool","description":"68°F natural spring-fed pool in Zilker Park — 3 acres of crystal-clear water. $5 entry.","category":"adventure","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Barton Springs Pool, Zilker Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s favorite place to cool off — a natural wonder"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"6th Street Live Music Crawl","description":"Austin''s entertainment district — free live music pouring out of every door. Rock, country, blues, funk.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Sixth Street"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Live Music Capital of the World — no cover, just walk in"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Tacos at Torchy''s & Whiskey at Hotel San José","description":"Late-night trailer park tacos, then craft whiskey in a minimalist courtyard bar on SoCo.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Torchy''s Tacos → Hotel San José"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The late-night Austin combo that never gets old"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-30","day_number":2,"title":"East Austin & Bats",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"East Austin Coffee & Food Truck Tour","description":"Hit 3-4 food trucks — Thai, Korean BBQ, vegan donuts. Coffee at Houndstooth or Fleet.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"East Austin food truck parks"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s food truck scene is unmatched in the US"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Lady Bird Lake Kayak or Paddleboard","description":"Rent a kayak and paddle the downtown lake — see the skyline, turtles, and heron colonies.","category":"adventure","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Lady Bird Lake"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Paddle through the heart of downtown Austin"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Texas State Capitol","description":"Taller than the US Capitol — free guided tour, beautiful grounds, and history of the Lone Star State.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Texas State Capitol"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Everything''s bigger in Texas — including the capitol"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Craft Beer at Jester King Brewery","description":"Farmhouse brewery on a ranch — wild ales, sour beers, pizza, and Hill Country views.","category":"food","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Jester King Brewery, Dripping Springs"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s most unique brewery — in the Hill Country"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Congress Avenue Bridge Bats","description":"1.5 million Mexican free-tailed bats emerge at sunset (March–October) — free viewing from the bridge.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Congress Avenue Bridge"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The largest urban bat colony in North America — absolutely surreal"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Live Show at The Continental Club","description":"Austin''s legendary honky-tonk — no cover before 9pm, rockabilly, country, and blues seven nights a week.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"The Continental Club, SoCo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most authentic music venue in Austin"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-31","day_number":3,"title":"Rainey Street & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Brunch at Paperboy","description":"Farm-to-table brunch in a converted East Austin bungalow — grain bowl, pastries, excellent coffee.","category":"food","estimated_cost_per_person":18,"duration_minutes":45,"location":{"name":"Paperboy, East Austin"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin does brunch beautifully"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Graffiti Park at Castle Hill","description":"Colorful concrete canvas covered in layers of street art — great photos and free.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"HOPE Outdoor Gallery / Castle Hill"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s most photogenic art installation"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Rainey Street Bars","description":"Historic bungalows turned into bars — craft cocktails, food trucks, string lights, and live music.","category":"food","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Rainey Street"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s most fun drinking street — houses turned bars"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Record Shopping on South Congress","description":"Dig through vinyl at Waterloo Records and End of an Ear — Austin''s independent music shops.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Waterloo Records / South Congress"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The Live Music Capital needs a proper record store visit"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell BBQ at la Barbecue","description":"If you missed Franklin — la Barbecue is the locals'' secret weapon. Shorter line, arguably as good.","category":"food","estimated_cost_per_person":25,"duration_minutes":60,"location":{"name":"la Barbecue, East Cesar Chavez"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The BBQ that locals actually eat when they don''t want to wait at Franklin"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell Margarita at Trudy''s","description":"The Mexican Martini — Austin''s signature cocktail, served with a shaker. Two-drink limit (they''re strong).","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Trudy''s, various locations"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"No Austin trip is complete without a Mexican Martini"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Franklin BBQ tip: Order by the pound, get extra sliced brisket for tomorrow''s breakfast tacos. They sell out of ribs first.","location":"Franklin Barbecue"},
      {"day_number":2,"tip":"The bats at Congress Ave Bridge are best March–October. Stand on the southeast side of the bridge for the best views.","location":"Congress Avenue Bridge"},
      {"day_number":3,"tip":"On Rainey Street, the food trucks are often better than the bars — Gus''s Fried Chicken and Via 313 Detroit-style pizza are legendary.","location":"Rainey Street food trucks"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Austin weekend: Franklin BBQ, 6th Street live music, Barton Springs, breakfast tacos, and 1.5 million bats at sunset.',
  ARRAY['austin', 'usa', 'weekend', 'food', 'bbq', 'music', 'nightlife']
);
RAISE NOTICE 'Austin weekend trip inserted';
END $$;
