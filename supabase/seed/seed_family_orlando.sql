-- Seed: Orlando Family Spring Break
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Orlando: Theme Parks & Family Fun',
  'Orlando, FL',
  '2026-03-21', '2026-03-28', '1234',
  '{"destination":{"name":"Orlando, FL"},"start_date":"2026-03-21","end_date":"2026-03-28","group_members":[{"name":"Mom","type":"adult"},{"name":"Dad","type":"adult"},{"name":"Kid 1","type":"child","age":10},{"name":"Kid 2","type":"child","age":7}],"budget_level":"mid","vibes":["family","adventure"]}'::jsonb,
  '{
    "title":"Orlando: Theme Parks & Family Fun",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-21","day_number":1,"title":"Magic Kingdom Day",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Magic Kingdom — Rope Drop","description":"Arrive at park opening for Space Mountain, Seven Dwarfs Mine Train, and Big Thunder Mountain with short lines.","category":"adventure","estimated_cost_per_person":120,"duration_minutes":240,"location":{"name":"Magic Kingdom, Walt Disney World"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most magical place on Earth — go early for short waits"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Chef Mickey''s","description":"Character breakfast with Mickey, Minnie, Donald, Goofy — all-you-can-eat buffet at Contemporary Resort.","category":"food","estimated_cost_per_person":42,"duration_minutes":75,"location":{"name":"Chef Mickey''s, Contemporary Resort"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Kids meet characters while you eat — genius"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Fantasyland & Tomorrowland","description":"It''s a Small World, Buzz Lightyear, Pirates of the Caribbean — the classic Disney afternoon.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Magic Kingdom"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The rides that define childhood memories"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Pool Break at Resort","description":"Beat the afternoon heat with a swim — most Disney resorts have themed pools with slides.","category":"rest","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Resort Pool"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Kids need a break, parents need a drink"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Fireworks at Magic Kingdom","description":"Happily Ever After fireworks spectacular — projections on Cinderella Castle with a full soundtrack.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Main Street USA, Magic Kingdom"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The perfect ending to a Disney day"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at ''Ohana","description":"Polynesian-style family feast — grilled meats, noodles, dumplings served family-style. Kids love it.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"''Ohana, Polynesian Village Resort"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"All-you-can-eat with fireworks views"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-22","day_number":2,"title":"Universal Studios & Harry Potter",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Wizarding World of Harry Potter","description":"Diagon Alley + Hogsmeade connected by the Hogwarts Express. Butterbeer, Ollivanders, Forbidden Journey ride.","category":"adventure","estimated_cost_per_person":110,"duration_minutes":240,"location":{"name":"Universal Studios / Islands of Adventure"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Every kid (and adult) dreams of visiting Hogwarts"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Early Park Admission at Volcano Bay","description":"Universal''s water theme park — Krakatau drop slide, lazy river, wave pool. Get there early.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":240,"location":{"name":"Universal''s Volcano Bay"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Best water park in Orlando"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Jurassic World & Marvel Areas","description":"Velocicoaster (for the brave), Spider-Man, Incredible Hulk — Universal''s big thrill rides.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Islands of Adventure"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Thrill rides that rival any park in the world"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Lunch at Three Broomsticks","description":"Harry Potter-themed pub — fish & chips, shepherd''s pie, pumpkin juice, and butterbeer.","category":"food","estimated_cost_per_person":18,"duration_minutes":45,"location":{"name":"Three Broomsticks, Hogsmeade"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Eat where wizards eat"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"CityWalk Dinner & Entertainment","description":"Universal''s entertainment district — Toothsome Chocolate Emporium, Bob Marley''s, and mini golf.","category":"food","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Universal CityWalk"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Fun dining without a park ticket"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Nighttime Hogwarts Light Show","description":"Projections on Hogwarts Castle — house colors, dark arts, and spells. Free with park entry.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":20,"location":{"name":"Hogwarts Castle, Islands of Adventure"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Magical way to end a Universal day"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-23","day_number":3,"title":"EPCOT World Showcase",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"EPCOT Future World","description":"Test Track, Frozen Ever After, Guardians of the Galaxy: Cosmic Rewind — EPCOT''s best rides.","category":"adventure","estimated_cost_per_person":120,"duration_minutes":180,"location":{"name":"EPCOT, Walt Disney World"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"EPCOT combines rides with education — parents love it"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Breakfast at Beaches & Cream","description":"Retro soda shop — Mickey waffles, milkshakes, and the legendary Kitchen Sink sundae.","category":"food","estimated_cost_per_person":20,"duration_minutes":45,"location":{"name":"Beaches & Cream, Beach Club Resort"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Kids go wild for the Kitchen Sink"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"World Showcase Food Tour","description":"Eat around the world — tacos in Mexico, pastries in France, fish & chips in UK, sushi in Japan.","category":"food","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"World Showcase, EPCOT"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"11 countries, one afternoon — food education the kids actually enjoy"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Spaceship Earth + Living with the Land","description":"Classic EPCOT dark rides — one through human history, one through a real greenhouse.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"EPCOT Future World"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Gentle rides perfect for all ages"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"EPCOT Fireworks — Luminous","description":"Fireworks and water show on World Showcase Lagoon — stunning from the Japan or UK pavilions.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":20,"location":{"name":"World Showcase Lagoon, EPCOT"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class fireworks over the lagoon"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Dinner at Le Cellier","description":"Canadian steakhouse in the Canada pavilion — filet mignon, cheddar cheese soup, maple crème brûlée.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Le Cellier, Canada Pavilion, EPCOT"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Most popular sit-down restaurant in EPCOT"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-03-24","day_number":4,"title":"Animal Kingdom & Rest Day",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Animal Kingdom — Flight of Passage","description":"Avatar flight simulator (the best ride at Disney), Kilimanjaro Safari, and Expedition Everest.","category":"adventure","estimated_cost_per_person":120,"duration_minutes":240,"location":{"name":"Disney''s Animal Kingdom"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Flight of Passage is consistently rated the best ride in Orlando"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Kennedy Space Center Day Trip","description":"1 hour from Orlando — see real rockets, meet an astronaut, experience a shuttle launch simulator.","category":"attraction","estimated_cost_per_person":60,"duration_minutes":360,"location":{"name":"Kennedy Space Center"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Educational and awe-inspiring for all ages"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Resort Pool Afternoon","description":"Take the afternoon off — swim, water slide, poolside snacks. Recharge for more parks tomorrow.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Resort Pool"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Pace yourself — park exhaustion is real"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Disney Springs Shopping","description":"Outdoor shopping/dining complex — LEGO store, World of Disney, Sprinkles cupcakes, and the Void VR.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Disney Springs"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Free entertainment without a park ticket"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Pandora at Night","description":"Avatar''s Pandora bioluminescent forest comes alive after dark — magical for kids.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Pandora, Animal Kingdom"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most immersive themed land ever built"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Dinner at Boma","description":"African-inspired buffet at Animal Kingdom Lodge — kids love the variety, adults love the quality.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Boma, Animal Kingdom Lodge"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best buffet on Disney property — watch giraffes from the lobby"}
          ]}
        ]
      },
      {"id":"day-5","trip_id":"trip-1","date":"2026-03-25","day_number":5,"title":"Hollywood Studios & Star Wars",
        "slots":[
          {"id":"slot-5-1","day_id":"day-5","slot_type":"morning","status":"open","options":[
            {"id":"opt-5-1-1","slot_id":"slot-5-1","title":"Galaxy''s Edge — Star Wars","description":"Build a lightsaber, pilot the Millennium Falcon, ride Rise of the Resistance (best ride at Disney).","category":"adventure","estimated_cost_per_person":120,"duration_minutes":240,"location":{"name":"Star Wars: Galaxy''s Edge, Hollywood Studios"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most immersive Star Wars experience ever created"},
            {"id":"opt-5-1-2","slot_id":"slot-5-1","title":"Toy Story Land","description":"Slinky Dog Dash coaster, Alien Swirling Saucers — you''re toy-sized in Andy''s backyard.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Toy Story Land, Hollywood Studios"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Perfect for younger kids"}
          ]},
          {"id":"slot-5-2","day_id":"day-5","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-5-2-1","slot_id":"slot-5-2","title":"Tower of Terror & Rock ''n'' Roller Coaster","description":"Hollywood Studios'' big thrill rides — one drops you 13 stories, the other launches you through Aerosmith.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Hollywood Studios"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Classic Disney thrills"},
            {"id":"opt-5-2-2","slot_id":"slot-5-2","title":"Lunch at Woody''s Lunch Box","description":"Quick-service in Toy Story Land — totchos, grilled cheese, and those Instagram-famous lunch box tarts.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"Woody''s Lunch Box, Toy Story Land"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Fun themed food the kids will actually eat"}
          ]},
          {"id":"slot-5-3","day_id":"day-5","slot_type":"evening","status":"open","options":[
            {"id":"opt-5-3-1","slot_id":"slot-5-3","title":"Fantasmic! Night Show","description":"Fireworks, water screens, lasers, and Disney villains — in a 6,900-seat amphitheater.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Hollywood Hills Amphitheater"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of Disney''s most spectacular shows"},
            {"id":"opt-5-3-2","slot_id":"slot-5-3","title":"Farewell Dinner at Sci-Fi Dine-In Theater","description":"Eat in a vintage car while watching B-movie clips on a drive-in screen. Kids go crazy for this.","category":"food","estimated_cost_per_person":30,"duration_minutes":60,"location":{"name":"Sci-Fi Dine-In Theater, Hollywood Studios"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most fun restaurant in any theme park"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Use the My Disney Experience app to join the virtual queue for the newest rides at 7am — you don''t even need to be in the park.","location":"Any Disney park"},
      {"day_number":2,"tip":"The Hogwarts Express between the two Universal parks is different in each direction — ride it both ways.","location":"Universal Studios / Islands of Adventure"},
      {"day_number":3,"tip":"In EPCOT, the pastries at the France pavilion''s Les Halles bakery are genuinely excellent and cheaper than sit-down restaurants.","location":"France Pavilion, EPCOT"},
      {"day_number":4,"tip":"At Animal Kingdom Lodge, walk to the Uzima savanna viewing area at dusk — giraffes and zebras come close and it''s free even if you''re not staying there.","location":"Animal Kingdom Lodge"},
      {"day_number":5,"tip":"Build a custom lightsaber at Savi''s Workshop ($250) — it''s a 20-minute immersive ceremony that''s worth every penny. Book way ahead.","location":"Galaxy''s Edge"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Orlando family spring break: Magic Kingdom, Universal Harry Potter, EPCOT World Showcase, Animal Kingdom, Hollywood Studios Star Wars.',
  ARRAY['orlando', 'usa', 'family', 'spring-break', 'theme-park', 'disney', 'universal', 'harry-potter', 'star-wars']
);
RAISE NOTICE 'Orlando family spring break inserted';
END $$;
