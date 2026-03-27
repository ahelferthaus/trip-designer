-- Seed: Whistler Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Whistler Blackcomb: Peak to Peak & Poutine',
  'Whistler, BC, Canada',
  '2026-02-27', '2026-03-03', '1234',
  '{"destination":{"name":"Whistler, BC, Canada"},"start_date":"2026-02-27","end_date":"2026-03-03","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","nature"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Whistler Blackcomb: Peak to Peak & Poutine",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-27","day_number":1,"title":"Whistler Mountain",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Whistler Mountain","description":"8,171 acres of terrain across two mountains — the largest ski resort in North America. Start on Whistler side.","category":"adventure","estimated_cost_per_person":180,"duration_minutes":240,"location":{"name":"Whistler Mountain"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"More terrain than you could ski in a week — start with the alpine bowls"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Purebread Bakery","description":"Whistler''s cult bakery — almond croissants, breakfast sandwiches, and the famous Hello Dolly bars.","category":"food","estimated_cost_per_person":10,"duration_minutes":20,"location":{"name":"Purebread, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Every pastry is made from scratch daily — the line is part of the experience"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Peak to Peak Gondola","description":"Record-breaking gondola connecting Whistler and Blackcomb peaks — glass-bottom cars at 436m above the valley.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Peak 2 Peak Gondola"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The longest unsupported span of any lift in the world — vertigo guaranteed"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Christine''s on Blackcomb","description":"Fine dining at 6,000 ft — BC salmon, risotto, and views of the Spearhead Range.","category":"food","estimated_cost_per_person":35,"duration_minutes":60,"location":{"name":"Christine''s, Rendezvous Lodge"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best on-mountain restaurant in North America"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Après at GLC (Garibaldi Lift Co.)","description":"Whistler''s iconic après bar — slopeside patio, live DJs, nachos, and pitchers of beer.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"GLC Bar, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The heartbeat of Whistler après-ski — packed every afternoon"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Poutine at La Belle Patate","description":"Quebec-style poutine — hand-cut fries, cheese curds, and gravy. The ultimate Canadian après food.","category":"food","estimated_cost_per_person":12,"duration_minutes":20,"location":{"name":"La Belle Patate, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"You''re in Canada — poutine is mandatory"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-28","day_number":2,"title":"Blackcomb Glacier & Village",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Ski Blackcomb Glacier","description":"Ski on a real glacier at 7,494 ft — the Horstman Glacier area offers steep chutes and wide-open alpine.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Blackcomb Mountain / 7th Heaven"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Glacier skiing in February — conditions are typically incredible"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Zipline Across Fitzsimmons Creek","description":"Zipline between Whistler and Blackcomb mountains — 2km at speeds up to 100km/h over the valley.","category":"adventure","estimated_cost_per_person":150,"duration_minutes":120,"location":{"name":"Superfly Ziplines, Whistler"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The longest zipline in Canada — screaming optional"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Scandinave Spa","description":"Outdoor Nordic-style hydrotherapy — hot pools, cold plunges, steam rooms, surrounded by old-growth forest.","category":"rest","estimated_cost_per_person":80,"duration_minutes":150,"location":{"name":"Scandinave Spa, Whistler"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Hot pools in the snow surrounded by ancient trees — pure bliss"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Whistler Village Stroll & Shopping","description":"Pedestrian village — ski shops, galleries, Roots Canada, and chocolate at Rogers'' Chocolates.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Whistler Village"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The best planned ski village in North America"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Araxi","description":"Whistler''s finest restaurant — oyster bar, BC wild salmon, rack of lamb, and a legendary wine list.","category":"food","estimated_cost_per_person":70,"duration_minutes":90,"location":{"name":"Araxi, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Araxi has been Whistler''s best restaurant for 40 years"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Cocktails at Bar Oso","description":"Araxi''s casual sibling — Spanish tapas, craft cocktails, and a buzzy atmosphere.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Bar Oso, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The coolest bar in Whistler"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-01","day_number":3,"title":"Backcountry & Sea to Sky",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Cat Skiing in the Whistler Backcountry","description":"Snowcat-accessed backcountry powder — guided runs through gladed old-growth forest.","category":"adventure","estimated_cost_per_person":450,"duration_minutes":360,"location":{"name":"Whistler Backcountry"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Waist-deep BC powder through ancient trees — skiing doesn''t get better"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Cross-Country at Lost Lake","description":"22km of groomed Nordic trails through the forest — peaceful, beautiful, and free.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Lost Lake Park, Whistler"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"A completely different pace — serene forest skiing"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Sea to Sky Gondola (Squamish)","description":"30 min south of Whistler — gondola to a summit with suspension bridge and Howe Sound views.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"Sea to Sky Gondola, Squamish"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The drive itself (Sea to Sky Highway) is one of the world''s most scenic roads"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Audain Art Museum","description":"World-class collection of BC art — Emily Carr paintings, First Nations masks, in a stunning building.","category":"attraction","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Audain Art Museum, Whistler"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Unexpectedly excellent art museum for a ski town"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at The Bearfoot Bistro","description":"Champagne sabering, vodka ice room (-32°C), and a 5-course tasting menu — Whistler''s most extravagant dinner.","category":"food","estimated_cost_per_person":120,"duration_minutes":150,"location":{"name":"Bearfoot Bistro, Whistler Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Saber a champagne bottle, drink vodka in a freezer — Whistler at its wildest"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell Beers at Whistler Brewing Co.","description":"Local craft brewery — après lager, black tusk ale, and a chill vibe to end the trip.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Whistler Brewing Co."},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Locally brewed, locally loved"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The Peak 2 Peak has 2 glass-bottom gondola cars — wait for one (they cycle through every 15 min) for the full vertigo experience.","location":"Peak 2 Peak Gondola"},
      {"day_number":2,"tip":"Scandinave Spa is a silence spa — no talking, no phones. Book the 10am slot when it''s quietest.","location":"Scandinave Spa"},
      {"day_number":3,"tip":"The Sea to Sky Highway from Vancouver to Whistler (99N) is one of the most scenic drives in the world — don''t sleep on the drive.","location":"Sea to Sky Highway"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Whistler ski trip: 8,171 acres, Peak 2 Peak Gondola, Blackcomb glacier, Scandinave Spa, Sea to Sky Highway, and world-class dining.',
  ARRAY['whistler', 'canada', 'skiing', 'winter', 'luxury', 'mountains', 'spa']
);
RAISE NOTICE 'Whistler ski trip inserted';
END $$;
