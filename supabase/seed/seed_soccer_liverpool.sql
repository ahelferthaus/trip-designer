-- Seed: Liverpool Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Liverpool: Football & Beatles',
  'Liverpool, England',
  '2026-05-22', '2026-05-26', '1234',
  '{"destination":{"name":"Liverpool, England"},"start_date":"2026-05-22","end_date":"2026-05-26","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","nightlife"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Liverpool: Football & Beatles",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-22","day_number":1,"title":"Anfield & Albert Dock",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Anfield Stadium Tour","description":"Walk through the tunnel touching the ''This Is Anfield'' sign, see the Kop, visit the LFC museum.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Anfield Stadium"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"One of the most atmospheric stadiums in world football"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"English Breakfast at Bold Street Coffee","description":"Independent café on Liverpool''s coolest street — full English with sourdough, flat white.","category":"food","estimated_cost_per_person":10,"duration_minutes":45,"location":{"name":"Bold Street Coffee"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fuel up on Bold Street"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Albert Dock & Tate Liverpool","description":"UNESCO waterfront — maritime museum, Tate gallery, and the iconic Liver Building views.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Royal Albert Dock"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Liverpool''s stunning UNESCO waterfront"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"The Beatles Story","description":"Immersive museum inside Albert Dock tracing the Fab Four from Cavern Club to Abbey Road.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"The Beatles Story, Albert Dock"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Can''t visit Liverpool without The Beatles"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Drinks at The Philharmonic Pub","description":"Grade I listed pub — ornate tiling, stained glass. Even the toilets are heritage listed.","category":"food","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"The Philharmonic Dining Rooms"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most beautiful pub in Britain"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Live Music on Mathew Street","description":"The Cavern Quarter — live bands every night, often free. The spirit of 1960s Liverpool lives on.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Mathew Street, Cavern Quarter"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where it all started for The Beatles"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-23","day_number":2,"title":"Match Day & Merseyside Derby",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Everton''s New Stadium Tour","description":"Tour Everton''s brand new Bramley-Moore Dock stadium on the waterfront.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Bramley-Moore Dock Stadium"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"See both sides of Liverpool football"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Liverpool Cathedral Tower Climb","description":"Britain''s largest cathedral — climb the tower for panoramic city views.","category":"attraction","estimated_cost_per_person":8,"duration_minutes":60,"location":{"name":"Liverpool Cathedral"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Stunning architecture and views"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Pre-Match at The Sandon","description":"The pub where LFC was founded in 1892 — packed with fans singing You''ll Never Walk Alone.","category":"food","estimated_cost_per_person":8,"duration_minutes":90,"location":{"name":"The Sandon, Anfield"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The birthplace of Liverpool FC"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Scouse Lunch at Keith''s","description":"Try Liverpool''s signature dish — lamb or beef scouse (stew) with beetroot and bread.","category":"food","estimated_cost_per_person":8,"duration_minutes":45,"location":{"name":"Keith''s, various locations"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"You can''t leave without trying scouse"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Liverpool FC Match at Anfield","description":"The Kop singing YNWA before kickoff is one of the most emotional experiences in sport.","category":"adventure","estimated_cost_per_person":55,"duration_minutes":150,"location":{"name":"Anfield"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Anfield atmosphere is unique in world football"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Comedy at The Hot Water Comedy Club","description":"Liverpool''s funniest night out — Scouse humor is sharp and relentless.","category":"attraction","estimated_cost_per_person":12,"duration_minutes":120,"location":{"name":"Hot Water Comedy Club"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Liverpool humor is legendary"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-24","day_number":3,"title":"Culture & Georgian Quarter",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Walker Art Gallery","description":"Outstanding Pre-Raphaelite collection, Hockney, Rembrandt — free entry.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Walker Art Gallery"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of the best free galleries in England"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Moose Coffee","description":"Canadian-inspired brunch — pancake stacks, maple syrup, eggs Benedict.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Moose Coffee, Dale Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Liverpool''s most popular brunch spot"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Georgian Quarter Walking Tour","description":"Elegant townhouses, Rodney Street (Liverpool''s Harley Street), Falkner Square gardens.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Georgian Quarter"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Beautiful architecture away from the tourist trail"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Baltic Triangle Creative District","description":"Former industrial area now home to breweries, galleries, street food, and creative studios.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Baltic Triangle"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Liverpool''s coolest neighborhood"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Dinner at Maray","description":"Bold Street gem — Middle Eastern small plates, charred cauliflower, disco falafel.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Maray, Bold Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Liverpool''s best-loved restaurant"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Ferry Across the Mersey","description":"Evening cruise on the iconic Mersey ferry — views of the Liverpool skyline at golden hour.","category":"attraction","estimated_cost_per_person":12,"duration_minutes":50,"location":{"name":"Pier Head, Mersey Ferry"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The song, the view, the experience"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-05-25","day_number":4,"title":"Farewell Liverpool",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Penny Lane & Strawberry Field","description":"Beatles tour — walk Penny Lane, visit the Strawberry Field exhibition, see childhood homes.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":150,"location":{"name":"Penny Lane / Strawberry Field"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Walk in The Beatles'' footsteps"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Crosby Beach Iron Men","description":"Antony Gormley''s 100 iron figures standing in the sand and sea — haunting and beautiful.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Crosby Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class public art on the beach"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Shopping at Liverpool ONE","description":"Open-air shopping complex — high street brands, independent stores, rooftop terrace.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Liverpool ONE"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Retail therapy before heading home"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"LFC Official Store Souvenirs","description":"Pick up an authentic Liverpool shirt, scarf, or signed memorabilia from the Anfield shop.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"LFC Store, Williamson Square"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Take a piece of Liverpool home"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell Fish & Chips at Rough Hand","description":"Liverpool''s best chippie — beer-battered cod, mushy peas, chippy sauce.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Rough Hand, Lark Lane"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Proper Liverpool farewell meal"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Farewell Drinks at Cavern Club","description":"End the trip where The Beatles started — live bands nightly in the rebuilt Cavern.","category":"food","estimated_cost_per_person":5,"duration_minutes":90,"location":{"name":"The Cavern Club, Mathew Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The only way to end a Liverpool trip"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The roof terrace at Albert Dock''s Matou restaurant has the best waterfront view and most people walk right past it.","location":"Matou, Albert Dock"},
      {"day_number":2,"tip":"Walk down Anfield Road before the match — local houses sell homemade scouse and cups of tea from their front windows.","location":"Anfield Road"},
      {"day_number":3,"tip":"The Bombed Out Church (St Luke''s) is an atmospheric ruin turned open-air events space — perfect for photos.","location":"St Luke''s Church, Berry Street"},
      {"day_number":4,"tip":"Take the Merseyrail to Formby for red squirrel sightings in the pine woods — 20 minutes from the city.","location":"Formby Nature Reserve"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Liverpool trip: Anfield stadium tour, LFC match day, Beatles heritage, Albert Dock waterfront, and Merseyside culture.',
  ARRAY['liverpool', 'england', 'europe', 'soccer', 'sports', 'music', 'beatles']
);
RAISE NOTICE 'Liverpool soccer trip inserted';
END $$;
