-- Seed: Big Sky Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Big Sky: Biggest Skiing in America',
  'Big Sky, MT',
  '2026-02-27', '2026-03-03', '1234',
  '{"destination":{"name":"Big Sky, MT"},"start_date":"2026-02-27","end_date":"2026-03-03","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["adventure","nature"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Big Sky: Biggest Skiing in America",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-27","day_number":1,"title":"Lone Mountain",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Big Sky Resort","description":"5,800 acres — the biggest skiing in America. Lone Mountain tram accesses expert terrain at 11,166 ft.","category":"adventure","estimated_cost_per_person":180,"duration_minutes":240,"location":{"name":"Big Sky Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"More skiable terrain than any resort in the US — and no lift lines"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at By Word of Mouth","description":"Local café in Big Sky Town Center — burritos, biscuits, and Montana-roasted coffee.","category":"food","estimated_cost_per_person":12,"duration_minutes":30,"location":{"name":"By Word of Mouth, Town Center"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Locals'' pre-ski fuel — hearty and honest"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Lone Mountain Tram & Big Couloir","description":"If conditions allow, hike the Big Couloir — 50-degree pitch, experts only. Or ski the tram-accessed bowls.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Lone Mountain summit, Big Sky"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most exposed inbounds run in the Lower 48"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Lunch at The Cabin Bar & Grill","description":"Slopeside deck with mountain views — bison burgers, chili, and craft beer.","category":"food","estimated_cost_per_person":20,"duration_minutes":45,"location":{"name":"The Cabin, Mountain Village"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Good food with no pretension — the Montana way"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner at Olive B''s","description":"Big Sky''s best restaurant — elk medallions, huckleberry crème brûlée, and Montana wines.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Olive B''s, Town Center"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Farm-to-table in Montana means the elk was probably nearby yesterday"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Stargazing from Meadow Village","description":"Big Sky has almost zero light pollution — the Milky Way is visible to the naked eye on clear nights.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Meadow Village, Big Sky"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Montana''s nickname is Big Sky Country for a reason — the night sky proves it"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-28","day_number":2,"title":"Yellowstone & Wildlife",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Yellowstone Snowcoach Tour","description":"Guided snowcoach into Yellowstone — Old Faithful in winter, bison herds, steaming geysers in the snow.","category":"adventure","estimated_cost_per_person":150,"duration_minutes":480,"location":{"name":"Yellowstone National Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Yellowstone in winter is a completely different park — fewer people, more wildlife, surreal steaming landscape"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"More Big Sky Skiing","description":"Explore the south face, Andesite Mountain, or the new terrain in Moonlight Basin.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Big Sky Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"5,800 acres means you can ski for days without repeating a run"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Old Faithful in Winter","description":"Watch Old Faithful erupt surrounded by snow — steam clouds tower into the cold air. Otherworldly.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Old Faithful, Yellowstone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Old Faithful with snow everywhere is a completely different (and better) experience"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Bison & Wolf Spotting in Lamar Valley","description":"Yellowstone''s ''Serengeti of America'' — bison herds, wolves, coyotes, and eagles along the valley.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Lamar Valley, Yellowstone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Winter is the best time for wolf sightings — they''re more active in the cold"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Montana Steak at Buck''s T-4 Lodge","description":"Western lodge dining — certified Angus steaks, Montana trout, and huckleberry everything.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Buck''s T-4 Lodge, Highway 191"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Real Montana lodge with real Montana beef"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Drinks at The Corral","description":"Classic Western bar and steakhouse since 1946 — live music, pool tables, and no pretension.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"The Corral, Gallatin Canyon"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"A Montana roadhouse that''s been here longer than the ski resort"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-01","day_number":3,"title":"Last Laps & Departure",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Final Morning Skiing","description":"Hit Lone Mountain one more time — or explore the quieter Andesite and Madison base areas.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Big Sky Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One more run... in Big Sky that means 10 more runs with no lift lines"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Breakfast at Gallatin Riverhouse Grill","description":"Riverside breakfast — pancakes, Montana Benedict, and views of the Gallatin River.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"Gallatin Riverhouse Grill"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Breakfast by the river — the peaceful Montana farewell"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Drive to Bozeman Airport (1 hour)","description":"Scenic drive through Gallatin Canyon — mountains, river, and elk along the road.","category":"transport","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Highway 191 to Bozeman"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Even the airport drive is beautiful in Montana"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Downtown Bozeman Walk","description":"Montana State University town — craft breweries (Bozeman Brewing, MAP), bookshops, and Western shops.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Downtown Bozeman, Main Street"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Bozeman is the coolest small city in Montana"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Fly out of Bozeman Yellowstone International","description":"Small, efficient airport with direct flights to major cities — no big-city airport stress.","category":"transport","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Bozeman Yellowstone International Airport"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Tiny airport, big mountains in the rearview"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Last Montana Meal at Dave''s Sushi","description":"Yes, sushi in Montana — and it''s surprisingly excellent. Dave''s is a Bozeman institution.","category":"food","estimated_cost_per_person":25,"duration_minutes":45,"location":{"name":"Dave''s Sushi, Bozeman"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Montana''s most unexpected culinary hit"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Big Sky averages 2 people per acre on a busy day — compare that to 30+ at Vail. The empty lift lines are the real luxury.","location":"Big Sky Resort"},
      {"day_number":2,"tip":"For the Yellowstone snowcoach, book through Yellowstone Forever for a smaller group and better guides.","location":"Yellowstone National Park"},
      {"day_number":3,"tip":"The Gallatin River scene in ''A River Runs Through It'' was filmed along the drive to Bozeman — bring your fly rod in summer.","location":"Gallatin Canyon, Highway 191"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Big Sky ski trip: 5,800 acres with no lift lines, Lone Mountain tram, winter Yellowstone snowcoach, bison herds, and Montana steaks.',
  ARRAY['big-sky', 'usa', 'skiing', 'winter', 'mountains', 'montana', 'yellowstone', 'wildlife']
);
RAISE NOTICE 'Big Sky ski trip inserted';
END $$;
