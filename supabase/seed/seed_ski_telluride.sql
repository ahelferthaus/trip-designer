-- Seed: Telluride Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Telluride: Box Canyon, Free Gondola & Old West',
  'Telluride, CO',
  '2026-03-06', '2026-03-10', '1234',
  '{"destination":{"name":"Telluride, CO"},"start_date":"2026-03-06","end_date":"2026-03-10","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","relaxed","nature"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Telluride: Box Canyon, Free Gondola & Old West",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-06","day_number":1,"title":"Historic Town & Ski",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Telluride","description":"2,000+ acres in a box canyon — steep San Sophia ridge, perfect groomers on the valley floor. Free gondola between town and Mountain Village.","category":"adventure","estimated_cost_per_person":190,"duration_minutes":240,"location":{"name":"Telluride Ski Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Nestled in a box canyon — the most dramatic ski town setting in America"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at The Butcher & The Baker","description":"Farm-to-table breakfast — sourdough everything, local eggs, pastries, and excellent pour-over coffee.","category":"food","estimated_cost_per_person":16,"duration_minutes":30,"location":{"name":"The Butcher & The Baker, Colorado Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Telluride does artisan breakfast better than towns 10x its size"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Revelation Bowl & Gold Hill","description":"Telluride''s newest terrain — Revelation Bowl''s open alpine is world-class when it''s on.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Revelation Bowl / Gold Hill, Telluride"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Expert terrain with views of the San Juan Mountains — dramatic and uncrowded"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Free Gondola Ride","description":"America''s only free gondola — connects historic Telluride to Mountain Village. 13-minute scenic ride.","category":"transport","estimated_cost_per_person":0,"duration_minutes":13,"location":{"name":"Telluride Free Gondola"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"A free gondola with jaw-dropping canyon views — only in Telluride"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner at Allred''s","description":"Fine dining at 10,551 ft — accessed by gondola. Colorado elk, duck, and a 700-label wine list.","category":"food","estimated_cost_per_person":70,"duration_minutes":90,"location":{"name":"Allred''s, St. Sophia Station"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Gondola ride to dinner at 10,000 feet — the most dramatic restaurant approach in Colorado"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Après & Live Music at The Sheridan","description":"Historic opera house turned bar — live music, craft cocktails, and 1890s architecture.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"The Sheridan, Colorado Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Butch Cassidy robbed his first bank across the street — Telluride is that kind of town"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-07","day_number":2,"title":"Backcountry & Town",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Heli-Skiing with Telluride Helitrax","description":"Helicopter-accessed backcountry — untracked powder in the San Juan Mountains. 10,000-15,000 vertical feet per day.","category":"adventure","estimated_cost_per_person":1200,"duration_minutes":360,"location":{"name":"San Juan Mountains backcountry"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The ultimate ski experience — pristine powder accessed only by helicopter"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Cross-Country at Town Park","description":"Free groomed Nordic trails right in town — peaceful skiing along the San Miguel River.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Town Park, Telluride"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Scenic riverside skiing for free — very Telluride"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Telluride Historic Walking Tour","description":"1880s mining town — Victorian buildings, Butch Cassidy''s first bank robbery site, the New Sheridan Hotel.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Colorado Avenue, Telluride"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the best-preserved mining towns in the West"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Hot Chocolate at Brown Dog Pizza","description":"Wood-fired pizza joint with the best hot chocolate in town — topped with house-made marshmallows.","category":"food","estimated_cost_per_person":10,"duration_minutes":30,"location":{"name":"Brown Dog Pizza, Colorado Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The pizza is great but the hot chocolate is legendary"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at 221 South Oak","description":"Telluride''s most inventive restaurant — elk tartare, foie gras, and a tasting menu that changes nightly.","category":"food","estimated_cost_per_person":65,"duration_minutes":90,"location":{"name":"221 South Oak"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"James Beard-nominated — the best meal in the San Juans"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Last Chair Saloon","description":"Slopeside dive bar — pool, pinball, cheap beer, and the ski bum vibe Telluride was built on.","category":"food","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"Last Dollar Saloon, Mountain Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The anti-Allred''s — Telluride''s scrappy soul"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-08","day_number":3,"title":"Bridal Veil Falls & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Snowshoe to Bridal Veil Falls","description":"Colorado''s tallest waterfall (365 ft) — frozen in winter, accessible by snowshoe up the box canyon.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Bridal Veil Falls, Telluride"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"A frozen 365-foot waterfall at the end of a box canyon — Telluride''s most dramatic sight"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Final Morning Laps","description":"Ski your favorites — the Plunge, Prospect Bowl, or the long Galloping Goose cruiser back to town.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Telluride Ski Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One more gondola ride, one more view of the box canyon"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Drive Million Dollar Highway (summer)","description":"If visiting spring/summer, the drive to Ouray on the Million Dollar Highway is one of America''s most spectacular.","category":"transport","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Million Dollar Highway, US-550"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Hairpin turns, no guardrails, 1,000-foot drops — and the views are worth every second"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Fly from Telluride Regional Airport","description":"One of America''s highest commercial airports at 9,070 ft — approach through the mountains is thrilling.","category":"transport","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Telluride Regional Airport"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The approach to TEX airport is legendary among pilots"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at New Sheridan Bar","description":"Telluride''s grand old bar since 1895 — original mahogany bar, tin ceiling, and Colorado whiskey.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"New Sheridan Bar, Colorado Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Raise a glass where miners, outlaws, and ski bums have for 130 years"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Pizza at Brown Dog","description":"Wood-fired farewell pizza — the wild mushroom and truffle pie is the move.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"Brown Dog Pizza"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best pizza in any ski town in Colorado"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The free gondola runs until midnight — ride it at night for a moonlit view of the box canyon and stars above the peaks.","location":"Telluride Free Gondola, nighttime"},
      {"day_number":2,"tip":"Butch Cassidy robbed the San Miguel Valley Bank on June 24, 1889 — the building is now a bar. You can drink where he stole.","location":"San Miguel Valley Bank site, Colorado Ave"},
      {"day_number":3,"tip":"In summer, the Telluride Bluegrass Festival (June) and Film Festival (September) turn this tiny town into a world-class cultural destination.","location":"Town Park, Telluride"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Telluride ski trip: Box canyon setting, free gondola, Bridal Veil Falls, heli-skiing, Victorian mining town, and mountain fine dining.',
  ARRAY['telluride', 'usa', 'skiing', 'winter', 'luxury', 'mountains', 'colorado']
);
RAISE NOTICE 'Telluride ski trip inserted';
END $$;
