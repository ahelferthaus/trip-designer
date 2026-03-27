-- Seed: Chicago Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Chicago: Deep Dish, Jazz & Architecture',
  'Chicago, IL',
  '2026-05-15', '2026-05-18', '1234',
  '{"destination":{"name":"Chicago, IL"},"start_date":"2026-05-15","end_date":"2026-05-18","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"]}'::jsonb,
  '{
    "title":"Chicago: Deep Dish, Jazz & Architecture",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-15","day_number":1,"title":"Lakefront & Loop",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Architecture River Cruise","description":"90-minute boat tour through downtown — docent explains 50+ iconic buildings. Best intro to Chicago.","category":"attraction","estimated_cost_per_person":47,"duration_minutes":90,"location":{"name":"Chicago Riverwalk, Michigan Ave"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Rated the #1 tour in the US — Chicago''s architecture is world-class"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Lou Mitchell''s","description":"Classic diner since 1923 — thick French toast, omelets, and they give you donut holes while you wait.","category":"food","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"Lou Mitchell''s, West Loop"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Old-school Chicago breakfast institution"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Art Institute of Chicago","description":"One of the world''s best art museums — American Gothic, A Sunday on La Grande Jatte, Nighthawks.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":180,"location":{"name":"Art Institute of Chicago"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Seurat, Hopper, Monet — world-class collection"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Millennium Park & The Bean","description":"Cloud Gate sculpture (The Bean), Crown Fountain, Lurie Garden — Chicago''s public living room.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Millennium Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Bean photo is mandatory"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Deep Dish at Lou Malnati''s","description":"Chicago''s best deep dish — buttery crust, chunky tomato sauce, sausage patty. Order 45 min ahead.","category":"food","estimated_cost_per_person":20,"duration_minutes":75,"location":{"name":"Lou Malnati''s, River North"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The deep dish debate is real — Lou Malnati''s wins for crust"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Jazz at Green Mill","description":"Al Capone''s favorite speakeasy — live jazz nightly since 1907. Arrive early for a booth.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Green Mill, Uptown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most storied jazz club in America"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-16","day_number":2,"title":"Neighborhoods & Food",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Wicker Park & Bucktown Walk","description":"Chicago''s hipster heart — indie shops, coffee at Intelligentsia, street art, and the 606 Trail.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Wicker Park / Bucktown"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Chicago''s most creative neighborhood"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Chicago-Style Hot Dog at Portillo''s","description":"No ketchup! Yellow mustard, onion, relish, tomato, pickle, sport peppers, celery salt on a poppy seed bun.","category":"food","estimated_cost_per_person":6,"duration_minutes":20,"location":{"name":"Portillo''s"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The Chicago hot dog is a religion — follow the rules"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Skydeck Ledge at Willis Tower","description":"Step onto a glass ledge 1,353 feet above the ground — see four states on a clear day.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":60,"location":{"name":"Skydeck, Willis Tower"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Standing on glass over the Chicago skyline — terrifying and thrilling"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Navy Pier & Lakefront","description":"Ferris wheel, boat rides, shops, and the Chicago Children''s Museum. Walk the lakefront path.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Navy Pier"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Lake Michigan feels like an ocean — stunning shoreline"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Girl & The Goat","description":"Stephanie Izard''s flagship — goat empanadas, wood-oven roasted pig face, creative small plates.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Girl & The Goat, West Loop"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Chicago''s most famous restaurant — book weeks ahead"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Blues at Kingston Mines","description":"Two stages, music until 4am — the best blues club in Chicago. Gritty, sweaty, real.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Kingston Mines, Lincoln Park"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Chicago invented the electric blues — hear it where it lives"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-17","day_number":3,"title":"West Loop & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"West Loop Randolph Street Walk","description":"Chicago''s restaurant row — peek into famous kitchens, coffee at Sawada, browse the Fulton Market.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":90,"location":{"name":"Randolph Street / Fulton Market"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The West Loop is the epicenter of Chicago dining"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Bongo Room","description":"Famous pancakes — white chocolate caramel pretzel, red velvet, lemon ricotta. Always a line.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Bongo Room, Wicker Park"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most decadent pancakes in America"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Museum of Science & Industry","description":"Massive hands-on museum — walk through a U-505 submarine, tornado simulator, coal mine replica.","category":"attraction","estimated_cost_per_person":22,"duration_minutes":180,"location":{"name":"Museum of Science & Industry, Hyde Park"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The largest science museum in the Western Hemisphere"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Garrett Popcorn & Riverwalk","description":"Get the Chicago Mix (cheese + caramel) and walk the Riverwalk — wine bars, kayak rentals, city views.","category":"food","estimated_cost_per_person":8,"duration_minutes":60,"location":{"name":"Chicago Riverwalk"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sweet and savory popcorn by the river — pure Chicago"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Italian Beef at Al''s #1","description":"Chicago''s essential sandwich — thinly sliced beef, giardiniera, dipped in jus. Order it ''wet.''","category":"food","estimated_cost_per_person":10,"duration_minutes":20,"location":{"name":"Al''s #1 Italian Beef, Little Italy"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The sandwich that made Chicago — you must try it dipped"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Cocktails at The Aviary","description":"Grant Achatz''s molecular cocktail bar — drinks served in ice globes, bird''s nests, and test tubes.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"The Aviary, West Loop"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most creative cocktail bar in America"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"On the architecture cruise, sit on the right side of the boat (heading south) for the best building views. Book the first cruise of the day.","location":"Chicago Riverwalk"},
      {"day_number":2,"tip":"The 606 Trail (Bloomingdale Trail) is Chicago''s version of the High Line — elevated bike/walk path through four neighborhoods. Locals love it.","location":"The 606 Trail, Wicker Park to Logan Square"},
      {"day_number":3,"tip":"The Museum of Science & Industry is in Jackson Park — the same park as the 1893 World''s Fair. Walk around the lagoon for beautiful architecture.","location":"Jackson Park, Hyde Park"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Chicago weekend: Architecture river cruise, Art Institute, deep dish pizza, jazz & blues clubs, and the best hot dogs in America.',
  ARRAY['chicago', 'usa', 'weekend', 'culture', 'food', 'architecture', 'jazz']
);
RAISE NOTICE 'Chicago weekend trip inserted';
END $$;
