-- Seed: LA Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Los Angeles: Beaches, Tacos & Hollywood',
  'Los Angeles, CA',
  '2026-05-08', '2026-05-11', '1234',
  '{"destination":{"name":"Los Angeles, CA"},"start_date":"2026-05-08","end_date":"2026-05-11","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["relaxed","food","nightlife"]}'::jsonb,
  '{
    "title":"Los Angeles: Beaches, Tacos & Hollywood",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-08","day_number":1,"title":"Venice & Santa Monica",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Venice Beach Boardwalk","description":"Street performers, Muscle Beach, skate park, murals, and the Abbot Kinney shopping strip nearby.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Venice Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"LA''s most eclectic beach scene"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Gjusta","description":"Venice''s legendary bakery-deli — smoked fish toast, shakshuka, pastries, and the best coffee on the westside.","category":"food","estimated_cost_per_person":18,"duration_minutes":45,"location":{"name":"Gjusta, Venice"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where Venice locals start their day"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Santa Monica Pier & Beach","description":"Iconic pier with ferris wheel, arcade games, then lay out on the wide sandy beach.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Santa Monica Pier"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The end of Route 66 — quintessential California"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"The Getty Center","description":"Free hilltop museum — incredible art collection, gardens, and panoramic LA views from Brentwood.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"The Getty Center"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"World-class art with the best view in LA, and it''s free"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Tacos at Leo''s Taco Truck","description":"LA''s most famous taco truck — al pastor carved off the trompo, $2 each. Line is part of the experience.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Leo''s Tacos, La Brea"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The taco that defines LA street food"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Cocktails at The Rooftop at Mama Shelter","description":"Hollywood rooftop bar — neon lights, skyline views, DJs, and surprisingly good pizzas.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Mama Shelter, Hollywood"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Hollywood nightlife without the pretension"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-09","day_number":2,"title":"Hollywood, Griffith & Silver Lake",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Griffith Observatory Hike","description":"Hike up from Fern Dell — 30-minute trail to the observatory with Hollywood Sign views and city panorama.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Griffith Observatory"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic LA view — free entry, free parking before 10am"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Brunch at Sqirl","description":"Silver Lake''s cult brunch — the famous ricotta toast with jam, grain bowls, turmeric lattes.","category":"food","estimated_cost_per_person":18,"duration_minutes":45,"location":{"name":"Sqirl, Silver Lake"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The restaurant that launched LA''s brunch obsession"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Hollywood Walk of Fame & TCL Chinese Theatre","description":"Find your favorite stars on the sidewalk, see handprints at the Chinese Theatre. It''s touristy but essential.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Hollywood Boulevard"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"You have to do it once"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"LACMA & La Brea Tar Pits","description":"Chris Burden''s Urban Light installation (iconic lampposts), plus actual ice-age fossils bubbling up from tar.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"LACMA, Miracle Mile"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Art + science in one block — the Urban Light photo is a must"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Bestia","description":"Industrial-chic Italian in the Arts District — wood-fired everything, handmade pasta, killer cocktails.","category":"food","estimated_cost_per_person":55,"duration_minutes":90,"location":{"name":"Bestia, Arts District"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"LA''s most celebrated restaurant"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Comedy at The Comedy Store","description":"Sunset Strip legend — you might catch Dave Chappelle, Bill Burr, or the next big thing on a random night.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"The Comedy Store, Sunset Blvd"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most famous comedy club in the world"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-10","day_number":3,"title":"Arts District & Malibu",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Arts District Coffee & Murals Walk","description":"Warehouse district turned creative hub — Blue Bottle Coffee, massive murals, gallery hopping.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":90,"location":{"name":"Arts District, DTLA"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"LA''s coolest neighborhood right now"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Grand Central Market Breakfast","description":"Historic food hall since 1917 — Eggslut, Tacos Tumbras a Tomas, Sticky Rice, and McConnell''s ice cream.","category":"food","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"Grand Central Market, DTLA"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"LA''s most diverse food hall under one roof"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Malibu Beach Drive","description":"PCH coastal drive to El Matador State Beach — sea caves, rock formations, turquoise water.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"El Matador Beach, Malibu"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"LA''s most beautiful beach — dramatic cliffs and hidden coves"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Runyon Canyon Hike","description":"2-mile loop in the Hollywood Hills — off-leash dogs, fit people, and 360° views of LA.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Runyon Canyon"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where LA goes to see and be seen while hiking"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Dinner at Nobu Malibu","description":"Celeb-favorite oceanfront Japanese — black cod miso, yellowtail sashimi, Pacific sunset.","category":"food","estimated_cost_per_person":70,"duration_minutes":90,"location":{"name":"Nobu Malibu"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most LA dinner possible — ocean, sushi, celebrities"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"In-N-Out Burger at LAX","description":"Double-Double animal style, fries well-done, neapolitan shake. The proper LA farewell meal.","category":"food","estimated_cost_per_person":8,"duration_minutes":20,"location":{"name":"In-N-Out near LAX"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"You can''t leave LA without In-N-Out"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Leo''s Taco Truck, the al pastor is carved from a glowing trompo spit — ask for ''with pineapple.'' Go after 8pm when the line''s shorter.","location":"Leo''s Tacos, La Brea & Olympic"},
      {"day_number":2,"tip":"Griffith Observatory is free but parking is a nightmare — take the DASH bus from the Vermont/Sunset Red Line station instead.","location":"Griffith Observatory"},
      {"day_number":3,"tip":"At El Matador Beach, arrive early (before 10am) — the parking lot has only 30 spots and the stairs down are steep but worth it.","location":"El Matador State Beach, Malibu"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day LA weekend: Venice Beach, Griffith Observatory, Hollywood, incredible tacos, Malibu sunset, and Arts District vibes.',
  ARRAY['la', 'los-angeles', 'usa', 'weekend', 'beach', 'food', 'nightlife']
);
RAISE NOTICE 'LA weekend trip inserted';
END $$;
