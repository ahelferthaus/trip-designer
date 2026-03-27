-- Seed: Munich Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Munich: Bayern, Beer & Bavarian Culture',
  'Munich, Germany',
  '2026-06-05', '2026-06-10', '1234',
  '{"destination":{"name":"Munich, Germany"},"start_date":"2026-06-05","end_date":"2026-06-10","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Munich: Bayern, Beer & Bavarian Culture",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-05","day_number":1,"title":"Allianz Arena & Marienplatz",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Allianz Arena Stadium Tour","description":"Tour Bayern Munich''s inflatable-looking arena — locker rooms, tunnel, pitchside, and the FC Bayern Museum.","category":"attraction","estimated_cost_per_person":19,"duration_minutes":120,"location":{"name":"Allianz Arena"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Home of the most successful club in German football"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Weisswurst Breakfast at Schneider Bräuhaus","description":"Traditional Bavarian white sausage breakfast with sweet mustard, pretzel, and wheat beer — must eat before noon.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Schneider Bräuhaus"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic Bavarian morning tradition"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Marienplatz & Glockenspiel","description":"Munich''s central square — watch the famous clock figures dance at 11am or noon, then explore.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Marienplatz"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The heart of Munich"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Viktualienmarkt Food Tour","description":"Open-air market with 140+ stalls — artisan cheeses, sausages, baked goods, and a beer garden in the center.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Viktualienmarkt"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Munich''s best food in one place"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Hofbräuhaus Beer Hall","description":"The world''s most famous beer hall since 1589 — brass band, 1-liter steins, pork knuckle, and lederhosen.","category":"food","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Hofbräuhaus"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The quintessential Munich experience"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Augustiner Keller","description":"Locals'' favorite beer garden — under chestnut trees, self-service grill, and Munich''s best beer.","category":"food","estimated_cost_per_person":18,"duration_minutes":120,"location":{"name":"Augustiner Keller, Arnulfstraße"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where actual Münchners drink"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-06","day_number":2,"title":"Art, Parks & Match Night",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"English Garden Surfing","description":"Watch locals surf the Eisbach river wave in Munich''s massive urban park — yes, real surfing.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Eisbach Wave, English Garden"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the most unexpected things you''ll ever see in a city"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Alte Pinakothek","description":"World-class Old Masters — Dürer, Rubens, Rembrandt in a stunning neoclassical gallery.","category":"attraction","estimated_cost_per_person":7,"duration_minutes":120,"location":{"name":"Alte Pinakothek"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of the most important art museums in the world"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"FC Bayern Fan Shop & Paulaner am Nockherberg","description":"Pick up Bayern merch, then pre-match Helles at the brewery''s own beer hall.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Paulaner am Nockherberg"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Pre-match fuel the Bavarian way"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"BMW Welt & Museum","description":"Free futuristic showroom + museum tracing BMW history from motorcycles to i-series.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"BMW Welt, Olympiapark"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Munich''s engineering pride"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Bayern Munich Match at Allianz Arena","description":"The arena glows red on matchday — 75,000 fans chanting ''Stern des Südens'' is unforgettable.","category":"adventure","estimated_cost_per_person":70,"duration_minutes":150,"location":{"name":"Allianz Arena"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Bundesliga atmosphere at its peak"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Dinner at Wirtshaus in der Au","description":"Traditional Bavarian inn — Knödel (dumplings), Schweinebraten (roast pork), dark beer.","category":"food","estimated_cost_per_person":22,"duration_minutes":90,"location":{"name":"Wirtshaus in der Au"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic Bavarian cooking at honest prices"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-07","day_number":3,"title":"Castles & Countryside",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Neuschwanstein Castle Day Trip","description":"Ludwig II''s fairytale castle (Disney''s inspiration) — 2-hour drive through Alpine scenery.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":360,"location":{"name":"Neuschwanstein Castle, Schwangau"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most famous castle in the world"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Dachau Memorial","description":"Sobering but essential visit to the first Nazi concentration camp — free audio guide included.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Dachau Concentration Camp Memorial"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Important history that must not be forgotten"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Nymphenburg Palace Gardens","description":"Baroque summer palace with vast gardens, canals, and a porcelain collection.","category":"attraction","estimated_cost_per_person":8,"duration_minutes":120,"location":{"name":"Schloss Nymphenburg"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Royal Bavarian grandeur"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Pretzel Making Class","description":"Learn to twist a proper Bavarian Brez''n from a master baker.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"Hofbäckerei Munich"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Take a Bavarian skill home with you"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Beer Garden at Chinese Tower","description":"Munich''s most iconic beer garden — 7,000 seats under the pagoda in the English Garden.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Chinesischer Turm, English Garden"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The ultimate Munich beer garden experience"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Cocktails at Schumann''s","description":"Munich''s legendary cocktail bar — impeccable drinks, sharp service, old-school glamour.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Schumann''s Bar, Odeonsplatz"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of Europe''s most famous cocktail bars"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-06-08","day_number":4,"title":"Olympic Park & Farewell",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Olympic Park Rooftop Walk","description":"Walk across the 1972 Olympic stadium''s tent-like roof with a harness — incredible views.","category":"adventure","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Olympiapark"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Unique adventure with history and views"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Munich Residenz","description":"Largest city palace in Germany — opulent rooms, treasury, and the stunning Antiquarium.","category":"attraction","estimated_cost_per_person":9,"duration_minutes":120,"location":{"name":"Residenz München"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Bavarian royal splendor"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Shopping on Maximilianstraße","description":"Munich''s luxury boulevard — designer boutiques, galleries, and the Opera House.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Maximilianstraße"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Munich''s most elegant street"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Currywurst at Steinheil 16","description":"Munich''s best late-night currywurst — crispy fries, homemade sauce. Bavarian street food.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Steinheil 16"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"German fast food done right"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell Dinner at Tantris","description":"Two-Michelin-star icon — the restaurant that put Munich on the fine dining map.","category":"food","estimated_cost_per_person":80,"duration_minutes":150,"location":{"name":"Tantris, Schwabing"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Grand farewell at Munich''s most legendary restaurant"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"One Last Stein at Augustiner Stammhaus","description":"Augustiner''s original brewery tap — Munich''s most beloved beer in its spiritual home.","category":"food","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"Augustiner Stammhaus, Neuhauser Str."},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best beer in Munich, period"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Viktualienmarkt, the Biergarten in the center is the only beer garden in Munich that rotates through all 6 major breweries.","location":"Viktualienmarkt Biergarten"},
      {"day_number":2,"tip":"The Eisbach wave is surfable — if you''re good, bring your board. But it''s expert-only, currents are dangerous.","location":"Eisbach, English Garden"},
      {"day_number":3,"tip":"Skip the Neuschwanstein interior queue — the Marienbrücke bridge view is free and honestly more impressive.","location":"Marienbrücke, Schwangau"},
      {"day_number":4,"tip":"Augustiner from a wooden barrel (Holzfass) tastes different from the bottle — always ask for ''vom Fass'' at the Stammhaus.","location":"Augustiner Stammhaus"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '5-day Munich trip: Allianz Arena, Bayern Munich match, beer halls, Neuschwanstein Castle, Bavarian food culture.',
  ARRAY['munich', 'germany', 'europe', 'soccer', 'sports', 'beer', 'food', 'culture']
);
RAISE NOTICE 'Munich soccer trip inserted';
END $$;
