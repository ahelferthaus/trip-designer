-- Seed: Jackson Hole Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Jackson Hole: The Big One',
  'Jackson Hole, WY',
  '2026-02-20', '2026-02-24', '1234',
  '{"destination":{"name":"Jackson Hole, WY"},"start_date":"2026-02-20","end_date":"2026-02-24","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","nature"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Jackson Hole: The Big One",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-20","day_number":1,"title":"Teton Village & Corbet''s",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Jackson Hole Mountain Resort","description":"Aerial tram to 10,450 ft — 4,139 ft of continuous vertical, the most in the US. Corbet''s Couloir if you dare.","category":"adventure","estimated_cost_per_person":200,"duration_minutes":240,"location":{"name":"Jackson Hole Mountain Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most challenging inbounds ski terrain in North America"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Persephone Bakery","description":"French-inspired bakery in Jackson town — croissants, quiche, and espresso that rivals Paris.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Persephone Bakery, Jackson"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Jackson''s best bakery — fuel for a big ski day"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Hobacks & Expert Terrain","description":"Steep, deep, and legendary — the Hobacks hold powder for days. Cheyenne Bowl for the brave.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"The Hobacks, JHMR"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Jackson''s steep terrain separates the skiers from the tourists"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Waffle Cabin at Base","description":"Belgian waffles with Nutella and whipped cream — the mid-day reward you deserve.","category":"food","estimated_cost_per_person":8,"duration_minutes":15,"location":{"name":"Waffle Cabin, Teton Village base"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Hot waffle in cold air — simple perfection"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Après at The Mangy Moose","description":"Legendary Teton Village bar — live music, elk burgers, and ski bums since 1967.","category":"food","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"The Mangy Moose, Teton Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most authentic ski bar in Wyoming"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at The Kitchen","description":"Modern American in Teton Village — bison short ribs, house-made pasta, wine from the owner''s cellar.","category":"food","estimated_cost_per_person":55,"duration_minutes":90,"location":{"name":"The Kitchen, Teton Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Elevated mountain dining without the pretension"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-21","day_number":2,"title":"Grand Teton Views & Town Square",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Tram Laps & Rendezvous Bowl","description":"Ride the tram repeatedly for 4,139 vertical feet per run — Rendezvous Bowl is steep, wide, and magnificent.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Aerial Tram, JHMR"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The tram ride alone — with the Grand Teton looming behind you — is worth the trip"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Snowshoe in Grand Teton National Park","description":"Guided snowshoe through the Tetons — frozen lakes, wildlife, and the most dramatic mountain wall in America.","category":"adventure","estimated_cost_per_person":65,"duration_minutes":180,"location":{"name":"Grand Teton National Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Tetons in winter are hauntingly beautiful"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Jackson Town Square Walk","description":"Iconic antler arches, western boutiques, art galleries, and the Million Dollar Cowboy Bar.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Town Square, Jackson"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most Western town in America — elk antler arches and all"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"National Museum of Wildlife Art","description":"12 galleries of wildlife art built into a hillside — stunning Bierstadt and Rungius paintings.","category":"attraction","estimated_cost_per_person":14,"duration_minutes":90,"location":{"name":"National Museum of Wildlife Art"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class art museum in one of America''s most scenic settings"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Snake River Grill","description":"Jackson''s finest — Idaho trout, bison tenderloin, wood-fired oven. Sundance Film Festival favorite.","category":"food","estimated_cost_per_person":65,"duration_minutes":90,"location":{"name":"Snake River Grill, Town Square"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where celebrities eat during Sundance — and it deserves the hype"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Million Dollar Cowboy Bar","description":"Saddle barstools, live country music, and cold beer — the real Wyoming cowboy experience.","category":"food","estimated_cost_per_person":12,"duration_minutes":90,"location":{"name":"Million Dollar Cowboy Bar, Town Square"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"You sit on actual saddles at the bar — it doesn''t get more Wyoming than this"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-22","day_number":3,"title":"Wildlife Safari & Hot Springs",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Wildlife Safari Tour","description":"Guided winter safari — moose, elk herds, bald eagles, and possibly wolves in the National Elk Refuge.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":180,"location":{"name":"National Elk Refuge / Grand Teton"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"7,500 elk winter here — plus moose, wolves, and eagles"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Dog Sledding in the Tetons","description":"Mush your own team of Alaskan huskies through snowy meadows with Teton views.","category":"adventure","estimated_cost_per_person":200,"duration_minutes":120,"location":{"name":"Continental Divide Dogsled Adventures"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Dog sledding with the Tetons as backdrop — bucket list material"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Granite Hot Springs","description":"Natural hot springs 25 miles south — 93°F pool surrounded by snow-covered mountains. Drive or snowmobile in.","category":"rest","estimated_cost_per_person":12,"duration_minutes":120,"location":{"name":"Granite Hot Springs, Hoback Canyon"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Soaking in natural hot springs surrounded by wilderness — transcendent"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Stagecoach Bar in Wilson","description":"Legendary dive bar — Thursday night band is a local institution. Pool, cheap beer, and cowboys.","category":"food","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"Stagecoach Bar, Wilson"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The real Jackson Hole — locals, not tourists"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at Local Restaurant & Bar","description":"Craft cocktails and elevated pub food — the locals'' favorite spot in Jackson town.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"Local Restaurant & Bar, Jackson"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Named ''Local'' for a reason — this is where Jackson eats"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Stargazing","description":"Jackson Hole has some of the darkest skies in the Lower 48 — Milky Way visible on clear nights.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Teton Village or town outskirts"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The night sky here is staggering — no light pollution"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Corbet''s Couloir: you don''t have to jump in. Traverse right to the S&S Couloir for the same thrill with a ski-in entry.","location":"Top of the Tram, JHMR"},
      {"day_number":2,"tip":"The elk antler arches on Town Square were built from naturally shed antlers collected by Boy Scouts — no elk were harmed.","location":"Town Square, Jackson"},
      {"day_number":3,"tip":"Granite Hot Springs is accessed by a 10-mile drive on a bumpy road — or rent a snowmobile for a more adventurous approach.","location":"Granite Hot Springs road"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Jackson Hole ski trip: 4,139 ft vertical, Corbet''s Couloir, Grand Teton views, wildlife safari, hot springs, and cowboy bars.',
  ARRAY['jackson-hole', 'usa', 'skiing', 'winter', 'luxury', 'mountains', 'wyoming', 'wildlife']
);
RAISE NOTICE 'Jackson Hole ski trip inserted';
END $$;
