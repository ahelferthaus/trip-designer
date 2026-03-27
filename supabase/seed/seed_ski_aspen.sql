-- Seed: Aspen Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Aspen: Glamour, Glades & Après',
  'Aspen, CO',
  '2026-02-13', '2026-02-17', '1234',
  '{"destination":{"name":"Aspen, CO"},"start_date":"2026-02-13","end_date":"2026-02-17","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","nightlife"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Aspen: Glamour, Glades & Après",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-13","day_number":1,"title":"Aspen Mountain & Downtown",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Aspen Mountain (Ajax)","description":"Aspen''s original mountain — steep, challenging, no beginners allowed. Silver Queen gondola to the summit at 11,212 ft.","category":"adventure","estimated_cost_per_person":200,"duration_minutes":240,"location":{"name":"Aspen Mountain"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The mountain that made Aspen famous — expert terrain with incredible views"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at The White House Tavern","description":"Upscale casual in a historic Victorian — avocado toast, eggs Benedict, fresh pastries.","category":"food","estimated_cost_per_person":22,"duration_minutes":45,"location":{"name":"The White House Tavern"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Aspen''s most charming breakfast spot"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Ajax Bumps & Steeps","description":"Walsh''s, Gentleman''s Ridge, Hyrup''s — Aspen Mountain''s legendary mogul runs.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Aspen Mountain steeps"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Mogul skiing at its finest — legs will burn"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Sundeck Lunch at 11,212 ft","description":"On-mountain restaurant at the summit — elk sliders, truffle fries, and views of the Maroon Bells.","category":"food","estimated_cost_per_person":30,"duration_minutes":45,"location":{"name":"Sundeck, Aspen Mountain summit"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Lunch at 11,000 feet with 360° mountain views"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Après at Ajax Tavern","description":"The place to see and be seen — truffle fries, champagne, and fur coats on the patio.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Ajax Tavern, base of gondola"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Aspen après at its most glamorous"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Matsuhisa","description":"Nobu''s original mountain outpost — omakase, black cod miso, and celebrities at every table.","category":"food","estimated_cost_per_person":75,"duration_minutes":90,"location":{"name":"Matsuhisa Aspen"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where Nobu meets the Rockies"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-14","day_number":2,"title":"Aspen Highlands & Maroon Bells",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Ski Aspen Highlands","description":"Locals'' favorite — the Highland Bowl hike (45 min bootpack to 12,382 ft) rewards with the best skiing in Colorado.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Aspen Highlands / Highland Bowl"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Highland Bowl is a bucket-list ski experience — earn your turns"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Snowmobile Tour to Maroon Bells","description":"Guided snowmobile ride to Colorado''s most photographed peaks — Maroon Bells in winter silence.","category":"adventure","estimated_cost_per_person":150,"duration_minutes":180,"location":{"name":"Maroon Bells, Aspen"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic mountain scenery in Colorado — stunning in snow"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Cloud Nine Alpine Bistro","description":"European mountain hut accessible only by skiing — fondue, schnapps, and a DJ. Book ahead.","category":"food","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"Cloud Nine Alpine Bistro, Highlands"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"A ski-in fondue party at 10,000 feet — wild and unforgettable"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Aspen Art Museum","description":"Shigeru Ban''s woven-exterior building — free admission, rooftop terrace with Aspen Mountain views.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Aspen Art Museum"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class contemporary art in a stunning building — free"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at The Wild Fig","description":"Mediterranean small plates — lamb meatballs, beet salad, handmade pasta. Aspen''s coziest spot.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"The Wild Fig, downtown Aspen"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where locals eat when they want something special"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Cocktails at The J-Bar","description":"Historic bar inside the Hotel Jerome (1889) — the most storied watering hole in the Rockies.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"J-Bar, Hotel Jerome"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Hunter S. Thompson drank here — need we say more"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-15","day_number":3,"title":"Snowmass & Family Fun",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Ski Snowmass","description":"3,332 acres — the biggest of Aspen''s 4 mountains. Perfect grooming, incredible intermediate terrain, and the Cirque.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Snowmass Ski Area"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"More skiable terrain than Vail, with way fewer people"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Buttermilk for Beginners","description":"Aspen''s learning mountain — gentle groomers, terrain parks, and home of the Winter X Games.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Buttermilk Mountain"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best beginner/intermediate mountain in the valley"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Elk Camp Gondola Lunch","description":"Ride the gondola to the Elk Camp restaurant — wood-fired pizza, BBQ, and alpine views.","category":"food","estimated_cost_per_person":22,"duration_minutes":60,"location":{"name":"Elk Camp, Snowmass"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Snowmass has the best on-mountain dining in the valley"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Aspen Shopping Stroll","description":"Galena Street boutiques — Gucci, Prada, plus local galleries, bookshops, and chocolate at Paradise Bakery.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Downtown Aspen, Galena St"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Window shopping with mountain views"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at Pine Creek Cookhouse","description":"Sleigh ride dinner through the woods to a candlelit log cabin — 5-course meal with wine pairings.","category":"food","estimated_cost_per_person":125,"duration_minutes":240,"location":{"name":"Pine Creek Cookhouse, Ashcroft"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Horse-drawn sleigh to a wilderness dinner — the most romantic evening in Aspen"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell at Jimmy''s","description":"Aspen''s late-night scene — bottle service, dancing, and the see-and-be-seen crowd.","category":"food","estimated_cost_per_person":30,"duration_minutes":120,"location":{"name":"Jimmy''s, downtown Aspen"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Aspen after dark — the party never stops"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-02-16","day_number":4,"title":"Last Runs & Hot Springs",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Last Morning on Ajax","description":"One final gondola ride — ski your favorites and soak in the views before heading home.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Aspen Mountain"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Always save your best runs for the last morning"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Brunch at The Limelight Hotel","description":"Upscale buffet brunch — smoked salmon, made-to-order omelets, fresh pastries, mountain views.","category":"food","estimated_cost_per_person":28,"duration_minutes":60,"location":{"name":"The Limelight, Aspen"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Elegant farewell brunch"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Glenwood Hot Springs Stop","description":"World''s largest mineral hot springs pool — on the way to the airport. Perfect post-ski recovery.","category":"rest","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Glenwood Hot Springs"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Soak away 4 days of skiing on the drive out"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Drive Independence Pass (summer only)","description":"If visiting in summer, the drive over 12,095-ft Independence Pass is one of America''s most spectacular roads.","category":"transport","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Independence Pass"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Only open June–October but worth planning around"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Fly out of Aspen-Pitkin Airport","description":"Tiny airport 4 miles from town — one of America''s most scenic approaches through the mountains.","category":"transport","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Aspen-Pitkin County Airport"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The landing approach through the Rockies is thrilling"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Drive to Denver (4 hours)","description":"Scenic I-70 drive through Glenwood Canyon — stop at Beau Jo''s in Idaho Springs for pizza.","category":"transport","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"I-70 to Denver"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The Glenwood Canyon stretch is breathtaking"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Ajax Tavern''s truffle fries are $22 but the serving is massive — split between two people with champagne and you''ve nailed Aspen après.","location":"Ajax Tavern"},
      {"day_number":2,"tip":"Highland Bowl bootpack: start early (10am at the latest), bring water, and dress in layers. The hike is brutal but the skiing down is transcendent.","location":"Highland Bowl, Aspen Highlands"},
      {"day_number":3,"tip":"Pine Creek Cookhouse books out weeks ahead in winter — reserve the moment you confirm your trip dates.","location":"Pine Creek Cookhouse"},
      {"day_number":4,"tip":"At Glenwood Hot Springs, the vapor caves (underground steam rooms) are less crowded and more unique than the main pool.","location":"Glenwood Hot Springs vapor caves"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Aspen ski trip: Ajax steeps, Highland Bowl bootpack, Cloud Nine fondue party, Pine Creek sleigh dinner, and mountain glamour.',
  ARRAY['aspen', 'usa', 'skiing', 'winter', 'luxury', 'mountains', 'colorado', 'nightlife']
);
RAISE NOTICE 'Aspen ski trip inserted';
END $$;
