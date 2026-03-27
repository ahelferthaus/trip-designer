-- Seed: Buenos Aires Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Buenos Aires: Boca, Tango & Steak',
  'Buenos Aires, Argentina',
  '2026-07-04', '2026-07-11', '1234',
  '{"destination":{"name":"Buenos Aires, Argentina"},"start_date":"2026-07-04","end_date":"2026-07-11","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food","nightlife"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Buenos Aires: Boca, Tango & Steak",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-07-04","day_number":1,"title":"San Telmo & La Boca",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"La Bombonera Stadium Tour","description":"Tour Boca Juniors'' legendary stadium — the stands are so steep they literally shake during matches.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Estadio Alberto J. Armando (La Bombonera)"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"One of football''s most iconic and intense stadiums"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Café Tortoni Breakfast","description":"Buenos Aires'' oldest café (1858) — medialunas, cortado, and art deco elegance.","category":"food","estimated_cost_per_person":8,"duration_minutes":45,"location":{"name":"Café Tortoni, Av. de Mayo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"An institution of porteño culture"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Caminito & La Boca Walk","description":"Colorful tin houses, tango dancers, Boca Juniors murals, and street art in the famous barrio.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Caminito, La Boca"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Football and art collide in Buenos Aires'' most photogenic street"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"San Telmo Antiques Market","description":"Sunday market stretching 10 blocks — antiques, tango records, vintage silverware, and empanadas.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Feria de San Telmo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Buenos Aires'' best market experience"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Asado at Don Julio","description":"Argentina''s #1 steakhouse — dry-aged beef, provoleta, malbec from an all-Argentine wine list.","category":"food","estimated_cost_per_person":40,"duration_minutes":120,"location":{"name":"Don Julio, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best steak in a country obsessed with steak"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Tango Show at Café de los Angelitos","description":"Grand milonga dinner show — professional tango dancers, live orchestra, three-course meal.","category":"attraction","estimated_cost_per_person":45,"duration_minutes":150,"location":{"name":"Café de los Angelitos"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Tango in its birthplace"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-07-05","day_number":2,"title":"Recoleta & River Plate",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Recoleta Cemetery","description":"Ornate mausoleum city — find Evita''s tomb among presidents, generals, and oligarchs.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Cementerio de la Recoleta"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the world''s most extraordinary cemeteries"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Medialunas at La Biela","description":"Classic sidewalk café next to the ancient rubber tree — facturas (pastries) and café con leche.","category":"food","estimated_cost_per_person":6,"duration_minutes":30,"location":{"name":"La Biela, Recoleta"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Old-money Buenos Aires breakfast"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"El Monumental — River Plate Tour","description":"Tour the rival side — River Plate''s enormous stadium and museum in Núñez.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Estadio Monumental, Núñez"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The other half of the Superclásico rivalry"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"MALBA Modern Art Museum","description":"Latin American art powerhouse — Frida Kahlo, Diego Rivera, contemporary Argentine artists.","category":"attraction","estimated_cost_per_person":8,"duration_minutes":90,"location":{"name":"MALBA, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class Latin American art"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Boca Juniors Match at La Bombonera","description":"50,000 fans bouncing so hard the concrete shakes. Flares, drums, chanting — pure football passion.","category":"adventure","estimated_cost_per_person":40,"duration_minutes":150,"location":{"name":"La Bombonera"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most intense football atmosphere on Earth"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Palermo Soho Bar Hopping","description":"Buenos Aires'' nightlife hub — craft cocktail bars, secret speakeasies, rooftop terraces.","category":"food","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Palermo Soho"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"BA nightlife doesn''t start until midnight"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-07-06","day_number":3,"title":"Palermo & Empanadas",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Palermo Parks & Rose Garden","description":"Stroll through Bosques de Palermo — the rose garden, Japanese Garden, and planetarium.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Bosques de Palermo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Buenos Aires'' green lung"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Empanada Crawl","description":"Try empanadas at 3 top spots — La Cocina, El Sanjuanino, and Cuervo. Vote for the best.","category":"food","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"Various, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Argentina''s national snack deserves a proper tour"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Street Art Tour in Villa Crespo","description":"Buenos Aires has more murals per block than anywhere — guided tour through graffiti alleys.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Villa Crespo / Colegiales"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"BA is a global street art capital"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Mate & Alfajores at a Local''s Home","description":"Cultural experience: learn to prepare and share mate the Argentine way. Taste artisan alfajores.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Palermo Hollywood"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Mate is Argentina''s social ritual — you must try it properly"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Milonga Dance Lesson + Social Dance","description":"Learn basic tango steps, then join a real milonga (tango dance hall) with locals.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":180,"location":{"name":"La Viruta, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Dance tango where it was invented"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Parilla Dinner at La Cabrera","description":"Palermo''s famous parilla — enormous portions, 14 side dishes, sizzling provoleta.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"La Cabrera, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The parilla experience turned up to 11"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-07-07","day_number":4,"title":"Tigre & Wine",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Tigre Delta Day Trip","description":"Take the train to Tigre, then a boat through the river delta — floating markets, island cafés.","category":"adventure","estimated_cost_per_person":10,"duration_minutes":240,"location":{"name":"Tigre Delta"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Escape the city to the jungle river delta"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Puerto Madero Waterfront Walk","description":"Converted docklands with Calatrava bridge, restaurants, and the Costanera Sur nature reserve.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Puerto Madero"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Buenos Aires'' modern waterfront"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Argentine Wine Tasting","description":"Sample Malbec, Torrontés, and Bonarda at a Palermo wine bar with sommelier guidance.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Aldo''s Vinoteca, Palermo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Argentina produces the world''s best Malbec"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"El Ateneo Grand Splendid Bookshop","description":"Former opera house converted into the world''s most beautiful bookshop — sit in the old boxes.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"El Ateneo Grand Splendid"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Jaw-dropping bookshop in a former theater"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell at Florería Atlántico","description":"Speakeasy hidden behind a flower shop — one of the world''s best bars, Argentine spirits focus.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Florería Atlántico, Retiro"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World''s #3 bar, hidden in plain sight"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Late-Night Pizza at El Cuartito","description":"BA-style thick pizza at 2am — a porteño tradition since 1934. Stand-up, no seats.","category":"food","estimated_cost_per_person":6,"duration_minutes":30,"location":{"name":"El Cuartito, Microcentro"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Buenos Aires pizza culture is its own thing"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At La Bombonera, look for the ''12th player'' mural on the stadium exterior — it tells the story of Boca''s working-class roots.","location":"La Bombonera exterior"},
      {"day_number":2,"tip":"Visit La Bombonera on a non-match day too — the Passion Museum inside is one of the best football museums anywhere.","location":"Museo de la Pasión Boquense"},
      {"day_number":3,"tip":"At the milonga, sit and watch the first hour — the best dancers come late and the floor transforms around midnight.","location":"La Viruta"},
      {"day_number":4,"tip":"At El Ateneo Grand Splendid, go up to the old stage — there''s a café where you can read with a coffee where the orchestra once played.","location":"El Ateneo Grand Splendid"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Buenos Aires trip: La Bombonera, Boca Juniors match, tango milongas, world-class steak, Tigre delta, and Argentine wine.',
  ARRAY['buenos-aires', 'argentina', 'soccer', 'sports', 'tango', 'food', 'steak', 'nightlife']
);
RAISE NOTICE 'Buenos Aires soccer trip inserted';
END $$;
