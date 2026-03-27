-- Seed: Miami Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Miami: South Beach, Cuban Food & Nightlife',
  'Miami, FL',
  '2026-05-22', '2026-05-25', '1234',
  '{"destination":{"name":"Miami, FL"},"start_date":"2026-05-22","end_date":"2026-05-25","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["nightlife","food","relaxed"]}'::jsonb,
  '{
    "title":"Miami: South Beach, Cuban Food & Nightlife",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-22","day_number":1,"title":"South Beach & Art Deco",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"South Beach Morning","description":"Turquoise water, white sand, pastel lifeguard towers — the beach that needs no introduction.","category":"rest","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"South Beach, Miami Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the world''s most famous beaches"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Cuban Breakfast at Versailles","description":"The cathedral of Cuban food — cortadito, tostada con mantequilla, croquetas. Join the abuela crowd.","category":"food","estimated_cost_per_person":10,"duration_minutes":30,"location":{"name":"Versailles, Little Havana"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most legendary Cuban restaurant in America"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Art Deco Walking Tour","description":"1920s-40s pastel hotels along Ocean Drive — guided tour of Miami Beach''s architectural treasures.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Art Deco Historic District, South Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Miami''s signature look — pink, teal, and white deco beauties"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Wynwood Walls & Street Art","description":"Open-air museum of massive murals by world-famous artists — plus galleries, breweries, and food halls.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Wynwood Arts District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best street art district in the US"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner on Ocean Drive","description":"People-watch from a sidewalk table — mojitos, stone crabs, and the neon Art Deco buildings lit up at night.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Ocean Drive, South Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic dining scene in Miami"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Cocktails at Sweet Liberty","description":"Award-winning cocktail bar — tropical drinks, oysters, and the best vibe on Miami Beach.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Sweet Liberty, Collins Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best cocktail bar in Miami Beach"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-23","day_number":2,"title":"Little Havana & Design District",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Little Havana Walking Tour","description":"Calle Ocho — domino park, cigar rolling, fruit stands, live salsa, and window-counter coladas.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Calle Ocho, Little Havana"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The heartbeat of Miami''s Cuban soul"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Colada & Empanadas at La Ventanita","description":"Order a colada (4 shots of sweet Cuban espresso) and ham croquetas from a walk-up window.","category":"food","estimated_cost_per_person":5,"duration_minutes":15,"location":{"name":"Any ventanita on Calle Ocho"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most Miami thing you can do — $2 for liquid energy"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Miami Design District","description":"Luxury shopping, art installations, and free outdoor galleries — Louis Vuitton, Dior, De la Cruz museum.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Miami Design District"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Where fashion, art, and architecture collide"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Pérez Art Museum Miami (PAMM)","description":"Modern art on Biscayne Bay — hanging gardens, waterfront terrace, and views of the cruise ships.","category":"attraction","estimated_cost_per_person":16,"duration_minutes":90,"location":{"name":"PAMM, Museum Park"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Best museum setting in Miami"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Mandolin","description":"Greek-Turkish small plates in a 1940s bungalow with fairy-lit garden — grilled octopus, lamb chops.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Mandolin, Design District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most charming restaurant in Miami"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Nightclub at LIV or E11EVEN","description":"Miami nightlife at its most extra — bottle service, celebrity DJs, and dancing until sunrise.","category":"attraction","estimated_cost_per_person":40,"duration_minutes":180,"location":{"name":"LIV Miami Beach / E11EVEN"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"This is what Miami is famous for"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-24","day_number":3,"title":"Key Biscayne & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Crandon Park Beach, Key Biscayne","description":"Quieter than South Beach — calm waters, palm trees, kayak rentals, and a nature center.","category":"rest","estimated_cost_per_person":5,"duration_minutes":150,"location":{"name":"Crandon Park, Key Biscayne"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Locals'' favorite beach — way less crowded than South Beach"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at The Salty","description":"Oceanfront brunch in Surfside — lobster rolls, fried chicken biscuits, and mimosas on the terrace.","category":"food","estimated_cost_per_person":30,"duration_minutes":60,"location":{"name":"The Salty, Surfside"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Beachfront brunch perfection"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Vizcaya Museum & Gardens","description":"Italian Renaissance-style mansion on Biscayne Bay — 10 acres of formal gardens, grottos, and bay views.","category":"attraction","estimated_cost_per_person":22,"duration_minutes":120,"location":{"name":"Vizcaya Museum, Coconut Grove"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Miami''s most beautiful estate — feels like Europe"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Coconut Grove Walk","description":"Miami''s oldest neighborhood — banyan trees, waterfront cafés, Peacock Park, and boutique shopping.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Coconut Grove"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Old Miami charm under canopy trees"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Ceviche at La Mar","description":"Peruvian oceanfront dining by Gastón Acurio — tiradito, causa, pisco sours with Biscayne views.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"La Mar by Gastón Acurio, Brickell"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Best Peruvian food in the US with a killer view"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Sunset at South Pointe Pier","description":"Walk to the tip of South Beach — watch cruise ships pass through Government Cut at golden hour.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"South Pointe Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most peaceful sunset spot on Miami Beach"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Skip the overpriced Ocean Drive restaurants — walk one block to Collins Ave for half the price and twice the quality.","location":"Collins Avenue, South Beach"},
      {"day_number":2,"tip":"In Little Havana, Azucar Ice Cream makes ''Abuela Maria'' flavor — vanilla, guava, and cream cheese. It''s life-changing.","location":"Azucar Ice Cream, Calle Ocho"},
      {"day_number":3,"tip":"At Vizcaya, the grottos under the main terrace are hidden and gorgeous — most visitors miss them entirely.","location":"Vizcaya Museum grottos"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Miami weekend: South Beach, Little Havana Cuban food, Wynwood street art, Design District, and legendary nightlife.',
  ARRAY['miami', 'usa', 'weekend', 'beach', 'food', 'nightlife', 'cuban', 'art-deco']
);
RAISE NOTICE 'Miami weekend trip inserted';
END $$;
