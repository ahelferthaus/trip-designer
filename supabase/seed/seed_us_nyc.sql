-- Seed: NYC Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'New York City Weekend',
  'New York City, NY',
  '2026-05-01', '2026-05-04', '1234',
  '{"destination":{"name":"New York City, NY"},"start_date":"2026-05-01","end_date":"2026-05-04","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food","nightlife"]}'::jsonb,
  '{
    "title":"New York City Weekend",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-01","day_number":1,"title":"Manhattan Highlights",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Central Park Morning Walk","description":"Enter at Columbus Circle — walk The Mall, Bethesda Fountain, Bow Bridge, and the Ramble.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Central Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The heart of Manhattan — beautiful any time of year"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Bagels at Russ & Daughters","description":"Legendary since 1914 — nova lox on everything bagel with cream cheese, capers, and tomato.","category":"food","estimated_cost_per_person":18,"duration_minutes":30,"location":{"name":"Russ & Daughters, Lower East Side"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best bagel in New York, not debatable"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"The Met (Metropolitan Museum of Art)","description":"2 million works spanning 5,000 years — Egyptian temple, Impressionists, rooftop garden with skyline views.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":180,"location":{"name":"The Metropolitan Museum of Art"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The greatest art museum in the Americas"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"High Line Walk","description":"Elevated park on a former railway — public art, wildflowers, and Chelsea skyline views all the way to Hudson Yards.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"The High Line"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"NYC''s most innovative public space"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dollar Slice & Times Square Walk","description":"Grab a $1.50 slice from Joe''s Pizza, then walk through the neon chaos of Times Square.","category":"food","estimated_cost_per_person":3,"duration_minutes":60,"location":{"name":"Joe''s Pizza → Times Square"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most New York thing you can do"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Broadway Show","description":"See a Tony Award-winning musical — Hamilton, Wicked, The Lion King, or whatever''s hot.","category":"attraction","estimated_cost_per_person":120,"duration_minutes":150,"location":{"name":"Broadway Theater District"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"No NYC trip is complete without Broadway"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-02","day_number":2,"title":"Brooklyn & Downtown",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Brooklyn Bridge Walk","description":"Walk the iconic bridge from Manhattan to Brooklyn — stop for photos with the skyline behind you.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Brooklyn Bridge"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most photogenic walk in New York"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"DUMBO & Brooklyn Bridge Park","description":"Cobblestone streets, the famous Manhattan Bridge view from Washington St, Jane''s Carousel.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"DUMBO, Brooklyn"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most Instagrammed neighborhood in NYC"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Williamsburg Food Tour","description":"Brooklyn''s coolest neighborhood — Smorgasburg food market (Saturdays), vintage shops, street art.","category":"food","estimated_cost_per_person":20,"duration_minutes":150,"location":{"name":"Williamsburg, Brooklyn"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Brooklyn is where NYC''s food innovation happens"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"9/11 Memorial & Museum","description":"Reflecting pools on the Twin Towers footprints, moving museum with artifacts and survivor stories.","category":"attraction","estimated_cost_per_person":26,"duration_minutes":120,"location":{"name":"9/11 Memorial, Lower Manhattan"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Powerful and essential New York experience"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at L''Artusi","description":"West Village Italian — hand-rolled pasta, burrata, and one of the best wine lists in the city.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"L''Artusi, West Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"NYC Italian dining at its finest"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Rooftop at Westlight","description":"29th-floor rooftop in Williamsburg — 360° views of the Manhattan skyline. Best at golden hour.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Westlight, William Vale Hotel"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best rooftop view in all of New York"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-03","day_number":3,"title":"SoHo, Food & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"SoHo Shopping & Architecture","description":"Cast-iron buildings, designer boutiques, gallery hopping, and people-watching on Spring Street.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"SoHo"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"NYC''s most stylish neighborhood"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Balthazar","description":"Iconic French brasserie — steak frites, eggs Benedict, fresh baked bread. Book ahead.","category":"food","estimated_cost_per_person":35,"duration_minutes":75,"location":{"name":"Balthazar, SoHo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The quintessential NYC brunch"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Chelsea Market & Meatpacking","description":"Food hall in a former Nabisco factory — tacos, lobster, crepes, artisan chocolate, and the High Line entrance.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Chelsea Market"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"NYC''s best indoor food hall"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Top of the Rock or Edge","description":"Observation deck with unobstructed views of the Empire State Building and Central Park.","category":"attraction","estimated_cost_per_person":40,"duration_minutes":60,"location":{"name":"Top of the Rock, Rockefeller Center"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The best view of the NYC skyline"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at PDT (Please Don''t Tell)","description":"Famous speakeasy accessed through a phone booth inside a hot dog shop. Reservation-only cocktails.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"PDT, East Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most iconic speakeasy in the city"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Late-Night at Katz''s Deli","description":"Open until midnight — the legendary pastrami sandwich. ''I''ll have what she''s having.''","category":"food","estimated_cost_per_person":25,"duration_minutes":30,"location":{"name":"Katz''s Delicatessen, Lower East Side"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"A New York institution since 1888"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The Met has a ''suggested admission'' — you can pay what you wish if you''re a NY state resident (or just be honest about it).","location":"The Metropolitan Museum of Art"},
      {"day_number":2,"tip":"DUMBO''s best photo spot is the intersection of Washington & Water streets — the Manhattan Bridge frames perfectly between buildings.","location":"DUMBO, Brooklyn"},
      {"day_number":3,"tip":"For Broadway, get same-day discount tickets at the TKTS booth in Times Square — up to 50% off, shows start around 2pm for matinées.","location":"TKTS Booth, Times Square"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day NYC weekend: Central Park, Met Museum, Brooklyn Bridge, Broadway, world-class food, and Manhattan skyline views.',
  ARRAY['nyc', 'usa', 'weekend', 'culture', 'food', 'nightlife', 'broadway']
);
RAISE NOTICE 'NYC weekend trip inserted';
END $$;
