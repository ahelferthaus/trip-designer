-- Seed: Vail Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Vail: Powder, Après & Mountain Luxury',
  'Vail, CO',
  '2026-02-06', '2026-02-10', '1234',
  '{"destination":{"name":"Vail, CO"},"start_date":"2026-02-06","end_date":"2026-02-10","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","relaxed"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Vail: Powder, Après & Mountain Luxury",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-06","day_number":1,"title":"Front Side & Village",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Vail Front Side","description":"5,317 acres of terrain — warm up on Riva Ridge and Born Free, then hit the legendary Back Bowls after lunch.","category":"adventure","estimated_cost_per_person":220,"duration_minutes":240,"location":{"name":"Vail Mountain Front Side"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The largest ski resort in Colorado — endless groomed runs"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at The Little Diner","description":"Legendary breakfast burritos smothered in green chile — fuel up before first chair.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"The Little Diner, Vail"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Locals'' favorite pre-ski fuel"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Back Bowls Powder Run","description":"Seven massive bowls of open terrain — Blue Sky Basin on a powder day is life-changing.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Vail Back Bowls / Blue Sky Basin"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Wide-open alpine bowls with no trees — pure freedom"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"On-Mountain Lunch at Two Elk Lodge","description":"Mid-mountain restaurant at 11,220 ft — elk chili, craft beer, and panoramic Gore Range views.","category":"food","estimated_cost_per_person":25,"duration_minutes":45,"location":{"name":"Two Elk Lodge, Vail"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best on-mountain dining in Colorado"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Après at The Red Lion","description":"Vail''s original après bar since 1966 — live music, boot-stomping, and pitchers of beer.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"The Red Lion, Vail Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The legendary après-ski party — ski boots still on"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Sweet Basil","description":"Vail''s finest restaurant since 1977 — Colorado lamb, truffle risotto, and a deep wine list.","category":"food","estimated_cost_per_person":65,"duration_minutes":90,"location":{"name":"Sweet Basil, Vail Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Mountain town fine dining at its peak"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-07","day_number":2,"title":"Blue Sky Basin & Spa",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"First Tracks at Blue Sky Basin","description":"Be on the first chair to Blue Sky — untouched corduroy groomers and powder stashes in the trees.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Blue Sky Basin, Vail"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"First tracks on fresh corduroy — the best feeling in skiing"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Snowshoe Tour through Vail Valley","description":"Guided 2-hour snowshoe through the White River National Forest — wildlife spotting, alpine silence.","category":"adventure","estimated_cost_per_person":55,"duration_minutes":120,"location":{"name":"White River National Forest"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Experience the mountains without skis — peaceful and beautiful"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Spa at Four Seasons Vail","description":"Hot stone massage, alpine herbal wrap, outdoor heated pool with mountain views.","category":"rest","estimated_cost_per_person":200,"duration_minutes":120,"location":{"name":"Four Seasons Resort Vail"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Après-ski luxury — sore muscles need this"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Ice Skating in Vail Village","description":"Outdoor rink in the heart of the Bavarian-style village — hot cocoa from the lodge.","category":"adventure","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Vail Village ice rink"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Postcard-perfect mountain village skating"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Mountain Standard","description":"Elevated mountain cuisine — bone marrow, elk tartare, truffle fries, craft cocktails.","category":"food","estimated_cost_per_person":55,"duration_minutes":90,"location":{"name":"Mountain Standard, Vail Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Modern Colorado cuisine in a stylish setting"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Fireside Cocktails at The Sebastian","description":"Leather chairs, roaring fire, hot toddies — the perfect mountain evening drink.","category":"food","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"The Sebastian Hotel, Vail"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fireplace + whiskey + snowfall = mountain perfection"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-08","day_number":3,"title":"Beaver Creek & Luxury",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Ski Beaver Creek","description":"Vail''s sister resort 15 min away — impeccably groomed, less crowded, and they hand out fresh cookies at 3pm.","category":"adventure","estimated_cost_per_person":200,"duration_minutes":240,"location":{"name":"Beaver Creek Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"More polished than Vail, fewer people, better grooming"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Cross-Country Skiing at Vail Nordic Center","description":"15km of groomed trails through the valley — peaceful, great exercise, and stunning scenery.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Vail Nordic Center"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"A quieter way to enjoy the mountain landscape"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Beaver Creek Cookies at 3pm","description":"Famous free chocolate chip cookies handed out at the base — warm, gooey, and a beloved tradition.","category":"food","estimated_cost_per_person":0,"duration_minutes":15,"location":{"name":"Beaver Creek base area"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most beloved free cookie in skiing"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Vail Village Shopping","description":"Browse the cobblestone village — fur shops, art galleries, ski gear, and chocolate at Vail Mountain Coffee.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Vail Village"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Alpine village charm at its best"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at The 10th Mountain Division Hut","description":"Snowcat dinner at the historic 10th Mountain Division hut — multi-course meal at 11,000 feet.","category":"food","estimated_cost_per_person":120,"duration_minutes":180,"location":{"name":"10th Mountain Hut, Vail"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Once-in-a-lifetime mountain dining experience"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell Fondue at Swiss Chalet","description":"Traditional Swiss fondue in a cozy alpine setting — cheese, chocolate, and schnapps.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Swiss Chalet, Vail Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fondue and a ski town — the perfect pairing"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-02-09","day_number":4,"title":"Last Runs & Departure",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Last Morning Laps","description":"Hit your favorite runs one more time — Game Creek Bowl or the front-side groomers for a victory lap.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Vail Mountain"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One more run... OK, maybe five more runs"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Breakfast at Loaded Joe''s","description":"Hearty mountain breakfast — huevos rancheros, pancake stacks, and strong coffee for the drive home.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"Loaded Joe''s, Avon"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fuel for the journey home"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Hot Springs at Glenwood Springs","description":"World''s largest hot springs pool — on the way to Denver airport. Perfect post-ski recovery stop.","category":"rest","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Glenwood Hot Springs, I-70"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Soak sore muscles on the drive home — the ultimate recovery"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Drive I-70 through Glenwood Canyon","description":"One of America''s most scenic highway stretches — carved through massive canyon walls along the Colorado River.","category":"transport","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Glenwood Canyon, I-70"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Even the drive home is beautiful in Colorado"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Departure from Denver","description":"3-hour drive from Vail to DEN airport — leave by 2pm for evening flights.","category":"transport","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Denver International Airport"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The mountain views in the rearview mirror hit different"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Last Colorado Meal at Root Down DIA","description":"Farm-to-table restaurant inside Denver airport — surprisingly excellent airport dining.","category":"food","estimated_cost_per_person":25,"duration_minutes":45,"location":{"name":"Root Down DIA, Concourse C"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Denver airport actually has great restaurants"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The Back Bowls get tracked out by noon — ski them first thing, then move to Blue Sky Basin which holds powder longer in the trees.","location":"Vail Back Bowls"},
      {"day_number":2,"tip":"The outdoor heated pool at Four Seasons is open to spa guests — swimming in 100°F water while snow falls around you is surreal.","location":"Four Seasons Vail"},
      {"day_number":3,"tip":"At Beaver Creek, ski the Talons run (double black) for the best views of the entire valley. Or take the scenic route down for the same views.","location":"Beaver Creek, Talons Challenge"},
      {"day_number":4,"tip":"Stop at the Beau Jo''s in Idaho Springs (on I-70) for mountain-style pizza with honey on the crust — a Colorado tradition.","location":"Beau Jo''s, Idaho Springs"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Vail ski trip: 5,317 acres, Back Bowls powder, Beaver Creek day trip, après at Red Lion, mountain luxury dining, and hot springs recovery.',
  ARRAY['vail', 'usa', 'skiing', 'winter', 'luxury', 'mountains', 'colorado']
);
RAISE NOTICE 'Vail ski trip inserted';
END $$;
