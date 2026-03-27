-- Seed: Seattle Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Seattle: Coffee, Pike Place & the PNW',
  'Seattle, WA',
  '2026-06-26', '2026-06-29', '1234',
  '{"destination":{"name":"Seattle, WA"},"start_date":"2026-06-26","end_date":"2026-06-29","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food","nature"]}'::jsonb,
  '{
    "title":"Seattle: Coffee, Pike Place & the PNW",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-26","day_number":1,"title":"Pike Place & Waterfront",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Pike Place Market","description":"Flying fish, flower stalls, the original Starbucks, Beecher''s cheese, and the Gum Wall.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Pike Place Market"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"America''s best farmers market — arrive at 9am before the crowds"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Coffee at the Original Starbucks","description":"The 1971 flagship — tiny, always a line, but the experience matters. Then walk to Storyville for better coffee.","category":"food","estimated_cost_per_person":6,"duration_minutes":20,"location":{"name":"Original Starbucks, Pike Place"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Do it for the gram, then find real Seattle coffee"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Space Needle & Chihuly Garden","description":"Iconic tower with rotating glass floor + Dale Chihuly''s stunning blown glass gardens next door.","category":"attraction","estimated_cost_per_person":40,"duration_minutes":120,"location":{"name":"Space Needle / Chihuly Garden and Glass"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Two Seattle icons side by side"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Clam Chowder at Pike Place Chowder","description":"Award-winning New England clam chowder in a bread bowl — lines are long but fast.","category":"food","estimated_cost_per_person":14,"duration_minutes":20,"location":{"name":"Pike Place Chowder"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best clam chowder in the Pacific Northwest"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner at The Walrus and the Carpenter","description":"Ballard''s iconic oyster bar — Pacific oysters, aguachile, uni toast, natural wine.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"The Walrus and the Carpenter, Ballard"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Seattle''s most celebrated restaurant"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Sunset at Kerry Park","description":"The postcard view of Seattle — Space Needle, skyline, and Mount Rainier (on clear days).","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Kerry Park, Queen Anne"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most photographed view in Seattle"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-27","day_number":2,"title":"Capitol Hill & Ballard",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Capitol Hill Coffee Crawl","description":"Seattle''s coffee epicenter — Elm Coffee, Victrola, Espresso Vivace. Walk the neighborhood murals.","category":"food","estimated_cost_per_person":12,"duration_minutes":120,"location":{"name":"Capitol Hill"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Seattle invented modern coffee culture — taste the best of it"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Museum of Pop Culture (MoPOP)","description":"Frank Gehry building — Nirvana, Jimi Hendrix, sci-fi, horror, indie games exhibits.","category":"attraction","estimated_cost_per_person":32,"duration_minutes":120,"location":{"name":"MoPOP, Seattle Center"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Seattle''s music heritage in a building as wild as the exhibits"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Ballard Locks & Fish Ladder","description":"Watch boats move between salt and fresh water, then see salmon climbing the fish ladder (seasonal).","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Hiram M. Chittenden Locks, Ballard"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Engineering marvel + salmon — uniquely Seattle"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Ballard Brewery Walk","description":"10+ breweries within walking distance — Reuben''s, Stoup, Urban Family, Obec. Get a map and pace yourself.","category":"food","estimated_cost_per_person":20,"duration_minutes":150,"location":{"name":"Ballard Brewery District"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Ballard is Seattle''s brewery neighborhood"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Pho at Than Brothers","description":"Seattle''s beloved Vietnamese — the free cream puff with every bowl of pho is legendary.","category":"food","estimated_cost_per_person":12,"duration_minutes":30,"location":{"name":"Than Brothers, various"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Seattle''s large Vietnamese community means incredible pho"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Live Music at The Crocodile","description":"Legendary venue where Nirvana played — indie rock, hip-hop, and local acts nightly.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"The Crocodile, Belltown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Grunge was born here — the spirit lives on"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-28","day_number":3,"title":"Ferry & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Bainbridge Island Ferry","description":"35-minute ferry with skyline views — cute main street with wine tasting, ice cream, and galleries.","category":"adventure","estimated_cost_per_person":9,"duration_minutes":180,"location":{"name":"Bainbridge Island Ferry"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The ferry ride alone is worth it for the views"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Biscuit Bitch","description":"Irreverent biscuit shop — Hot Mess Bitch (gravy, sausage, egg, cheese) is the signature.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Biscuit Bitch, Pike Place"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The name. The biscuits. The attitude. Pure Seattle."}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Pioneer Square Underground Tour","description":"Walk beneath the streets of old Seattle — hear stories of the 1889 fire and the city rebuilt on top of itself.","category":"attraction","estimated_cost_per_person":22,"duration_minutes":75,"location":{"name":"Bill Speidel''s Underground Tour"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"There''s a whole city under Seattle — bizarre and fascinating"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Amazon Spheres (The Biosphere)","description":"Peek into Amazon''s glass spheres filled with 40,000 plants — public visits on select Saturdays.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Amazon Spheres, South Lake Union"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Tech meets nature in a way only Seattle would do"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Sushi at Shiro''s","description":"Seattle''s best sushi — omakase at the bar from a Jiro-trained chef. Fresh Pacific catches.","category":"food","estimated_cost_per_person":50,"duration_minutes":75,"location":{"name":"Shiro''s Sushi, Belltown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Seattle''s access to Pacific fish makes the sushi exceptional"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell at Zig Zag Café","description":"Hidden below Pike Place Market — one of America''s best cocktail bars. The Last Word cocktail was invented here.","category":"food","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"Zig Zag Café, Pike Place"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"A cocktail legend hidden in plain sight"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Pike Place, walk downstairs to the lower levels — Rachel the Pig gets all the attention but the best shops are underground.","location":"Pike Place Market lower levels"},
      {"day_number":2,"tip":"The Ballard Locks botanical gardens are free and gorgeous — most people just watch the boats and miss the gardens entirely.","location":"Carl S. English Jr. Botanical Garden"},
      {"day_number":3,"tip":"The underground tour is funny but sanitized — for the real gritty history, take the ''Beneath the Streets'' tour instead.","location":"Pioneer Square"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Seattle weekend: Pike Place Market, Space Needle, Capitol Hill coffee, Ballard breweries, Bainbridge ferry, and the PNW vibe.',
  ARRAY['seattle', 'usa', 'weekend', 'food', 'coffee', 'nature', 'culture']
);
RAISE NOTICE 'Seattle weekend trip inserted';
END $$;
