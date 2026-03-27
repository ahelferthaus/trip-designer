-- Seed: Zermatt Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Zermatt: Matterhorn, Glacier Skiing & Swiss Precision',
  'Zermatt, Switzerland',
  '2026-02-14', '2026-02-21', '1234',
  '{"destination":{"name":"Zermatt, Switzerland"},"start_date":"2026-02-14","end_date":"2026-02-21","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","relaxed"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Zermatt: Matterhorn, Glacier Skiing & Swiss Precision",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-14","day_number":1,"title":"Arrival & Rothorn",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Rothorn Paradise","description":"Zermatt''s sunniest area — wide groomers with the Matterhorn dominating every view. Perfect first day.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":240,"location":{"name":"Rothorn / Sunnegga, Zermatt"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Ski with the Matterhorn directly in front of you — surreal"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Swiss Breakfast at Café du Pont","description":"Birchermüesli, fresh bread, Gruyère cheese, and strong Swiss coffee — fuel for the mountains.","category":"food","estimated_cost_per_person":18,"duration_minutes":30,"location":{"name":"Café du Pont, Zermatt village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Swiss breakfast done right — hearty and precise"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Chez Vrony Mountain Restaurant","description":"Legendary sun terrace at 2,130m — rösti with egg, lamb chops, and the most photographed Matterhorn view from any restaurant.","category":"food","estimated_cost_per_person":35,"duration_minutes":75,"location":{"name":"Chez Vrony, Findeln"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Ranked among the world''s best mountain restaurants"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Gornergrat Railway","description":"Cog railway to 3,089m — 360° view of 29 peaks over 4,000m including Monte Rosa, the Matterhorn, and the Gorner Glacier.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Gornergrat, Zermatt"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most spectacular panorama in the Alps"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Fondue at Whymper Stube","description":"Named after the Matterhorn''s first summiter — traditional Swiss fondue in a 19th-century wood-paneled dining room.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"Whymper Stube, Bahnhofstrasse"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"History, cheese, and wine — the holy trinity of Zermatt"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Walk Through Car-Free Village","description":"Zermatt bans combustion engines — walk the atmospheric main street lit by lanterns, with the Matterhorn glowing above.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Bahnhofstrasse, Zermatt"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"No cars means the village feels frozen in time — magical at night"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-15","day_number":2,"title":"Matterhorn Glacier Paradise",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Matterhorn Glacier Paradise (3,883m)","description":"Europe''s highest cable car station — ski the glacier year-round. Cross into Cervinia, Italy for lunch.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":300,"location":{"name":"Klein Matterhorn / Cervinia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Ski from Switzerland to Italy on a glacier at nearly 4,000m — absurd and magnificent"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Glacier Palace Ice Cave","description":"Walk through an ice cave 15m under the glacier surface — ice sculptures, crystal formations.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Glacier Palace, Klein Matterhorn"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"An ice cave under a glacier at 3,883m — otherworldly"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Italian Lunch in Cervinia","description":"Ski across the border — pasta, polenta, and espresso at half the Swiss price.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Cervinia, Italy"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Same mountain, different country, better pasta prices"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Schwarzsee Chapel Viewpoint","description":"Tiny chapel at 2,583m with arguably the most iconic Matterhorn view — the reflection in the lake (summer) or snow field.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Schwarzsee, Zermatt"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Matterhorn postcard view — every angle is different"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at After Seven","description":"Michelin-starred tasting menu — modern Swiss cuisine, wine pairings, and views of the Matterhorn.","category":"food","estimated_cost_per_person":120,"duration_minutes":150,"location":{"name":"After Seven, The Omnia Hotel"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Zermatt''s most exclusive dining experience"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Après at Papperla Pub","description":"Zermatt''s wildest après bar — live music, dancing, and beer steins. Starts at 4pm, peaks at 6pm.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Papperla Pub, Zermatt"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Swiss après gets surprisingly rowdy here"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-16","day_number":3,"title":"Gornergrat & Relaxation",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Ski the Gornergrat Zone","description":"Long runs from 3,089m back to the village — 12km continuous descents, stunning glacier views the whole way.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Gornergrat ski area"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The longest runs in Zermatt with the most dramatic scenery"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Matterhorn Museum","description":"Underground museum telling the story of the first Matterhorn ascent in 1865 — including the broken rope.","category":"attraction","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Matterhorn Museum Zermatlantis"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The tragic and triumphant story of mountaineering''s most famous peak"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Spa at The Cervo","description":"Boutique hotel spa with sauna, steam room, and outdoor hot tub facing the Matterhorn.","category":"rest","estimated_cost_per_person":60,"duration_minutes":120,"location":{"name":"Cervo Mountain Resort"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Hot tub + Matterhorn view = the Swiss spa dream"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Swiss Chocolate & Cheese Shopping","description":"Buy Toblerone at its source, sample local raclette cheese, and pick up a Swiss army knife.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Bahnhofstrasse shops, Zermatt"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Swiss souvenirs from the source"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Raclette at Le Gitan","description":"Whole wheel of raclette melted and scraped onto your plate — potatoes, pickles, and dried meat.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Le Gitan, Zermatt"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The ultimate Swiss comfort food farewell"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Nightcap at The Vernissage","description":"Bar, cinema, and gallery in a converted underground space — cocktails surrounded by art installations.","category":"food","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"Vernissage Bar, Backstage Hotel"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Zermatt''s most unique bar — underground art meets alpine cocktails"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Chez Vrony is so popular that you need to book for lunch. Call ahead or ski there early. The lamb is raised on the hillside you''re looking at.","location":"Chez Vrony, Findeln"},
      {"day_number":2,"tip":"When you ski to Cervinia, your Swiss lift pass works on the Italian side. Buy an espresso for €1 — it''s €5 back in Zermatt.","location":"Cervinia, Italy"},
      {"day_number":3,"tip":"Take the Gornergrat train at sunrise — the Matterhorn turns pink (''Alpenglühen'') and you''ll have the observation deck almost to yourself.","location":"Gornergrat railway, sunrise"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Zermatt ski trip: Matterhorn glacier, ski to Italy, Gornergrat panorama, car-free village, fondue, raclette, and Swiss precision.',
  ARRAY['zermatt', 'switzerland', 'europe', 'skiing', 'winter', 'luxury', 'alps', 'matterhorn']
);
RAISE NOTICE 'Zermatt ski trip inserted';
END $$;
