-- Seed: Park City Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Park City: Sundance Town, Epic Skiing',
  'Park City, UT',
  '2026-01-30', '2026-02-03', '1234',
  '{"destination":{"name":"Park City, UT"},"start_date":"2026-01-30","end_date":"2026-02-03","group_members":[{"name":"Traveler","type":"adult"},{"name":"Kid","type":"child","age":12}],"budget_level":"mid","vibes":["adventure","family"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Park City: Sundance Town, Epic Skiing",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-01-30","day_number":1,"title":"Park City Mountain",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Park City Mountain","description":"Largest ski resort in the US — 7,300+ acres connected to Canyons. 35 min from SLC airport.","category":"adventure","estimated_cost_per_person":180,"duration_minutes":240,"location":{"name":"Park City Mountain Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"America''s biggest resort and closest major ski area to an international airport"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Five5eeds","description":"Australian-inspired café — smashed avo, flat whites, grain bowls. Park City''s best morning spot.","category":"food","estimated_cost_per_person":16,"duration_minutes":40,"location":{"name":"Five5eeds, Main Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Great coffee and healthy food before hitting the slopes"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Jupiter Bowl Expert Terrain","description":"Park City''s steepest terrain — chutes, moguls, and powder stashes accessed from the Jupiter lift.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Jupiter Bowl, Park City"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Utah''s legendary ''Greatest Snow on Earth'' in steep terrain"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Mid-Mountain Lodge Lunch","description":"Historic mining cabin turned mountain restaurant — elk chili, grilled cheese, and Utah craft beer.","category":"food","estimated_cost_per_person":20,"duration_minutes":45,"location":{"name":"Mid-Mountain Lodge"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best on-mountain lunch setting in Park City"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Après on Main Street","description":"Park City''s historic Main Street — No Name Saloon (buffalo burgers), High West Distillery (whiskey flights).","category":"food","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Main Street, Park City"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best après scene in Utah — real mining town charm"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Handle","description":"Farm-to-table small plates — beet tartare, lamb neck, and Park City''s best cocktails.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Handle, Main Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Park City''s most creative restaurant"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-01-31","day_number":2,"title":"Deer Valley & Olympic Legacy",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Ski Deer Valley","description":"America''s most luxurious ski resort — limited daily tickets, impeccable grooming, no snowboarders allowed.","category":"adventure","estimated_cost_per_person":230,"duration_minutes":240,"location":{"name":"Deer Valley Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Four Seasons of ski resorts — worth every penny for the grooming alone"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Utah Olympic Park","description":"Tour the 2002 Winter Olympics venues — see the ski jumps, bobsled track, and try the zipline or alpine coaster.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Utah Olympic Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Ride a bobsled on an actual Olympic track — thrilling for all ages"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Royal Street Café at Deer Valley","description":"Sit-down mountain dining at 9,100 ft — the turkey chili in a bread bowl is legendary.","category":"food","estimated_cost_per_person":25,"duration_minutes":45,"location":{"name":"Royal Street Café, Deer Valley"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Deer Valley''s on-mountain dining is in a class of its own"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Tubing at Gorgoza Park","description":"6 tubing lanes, conveyor lift, and a snack bar — perfect for kids or non-skiers.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Gorgoza Park, I-80"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Pure fun — no skill required, maximum laughs"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"High West Distillery Tasting","description":"America''s only ski-in distillery — whiskey flights, bourbon barrel-aged Manhattan, and campfire S''mores dip.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"High West Distillery, Main Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The only place in the world where you can ski to a distillery"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Dinner at Riverhorse on Main","description":"Park City''s signature fine dining — elk loin, duck confit, and a chandelier-lit dining room.","category":"food","estimated_cost_per_person":60,"duration_minutes":90,"location":{"name":"Riverhorse on Main"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The Grand Dame of Park City restaurants"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-01","day_number":3,"title":"Canyons Side & Night Skiing",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Ski Canyons Village Side","description":"Park City''s quieter side — 4,000 acres with excellent intermediate terrain and shorter lift lines.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Canyons Village, Park City"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Same lift ticket as Park City side, half the crowds"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Snowcat Tour in the Wasatch Backcountry","description":"Guided snowcat skiing or riding in untracked powder — for advanced skiers seeking fresh tracks.","category":"adventure","estimated_cost_per_person":400,"duration_minutes":360,"location":{"name":"Wasatch Backcountry"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Waist-deep Utah powder that few ever experience"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Main Street Gallery Walk","description":"Park City''s 20+ art galleries — Western art, photography, glass sculpture, and bronze work.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Main Street galleries"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Park City has a serious art scene most people miss"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Park City Museum","description":"Free museum in the old city jail — the silver mining boom, ski history, and 2002 Olympics story.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Park City Museum, Main Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"From silver mines to ski resort — Park City''s fascinating history"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Night Skiing at Park City","description":"Ski under the lights on PayDay run — surreal experience with city lights below you.","category":"adventure","estimated_cost_per_person":40,"duration_minutes":120,"location":{"name":"Park City Mountain, PayDay lift"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Skiing at night feels completely different — magical and peaceful"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Farewell at No Name Saloon","description":"Main Street''s most famous bar — buffalo burgers, live music, and a mechanical bull in the back.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"No Name Saloon, Main Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The iconic Park City bar — everyone ends up here eventually"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"On powder days, skip the front side and go straight to McConkey''s Bowl via Iron Mountain — it holds powder all day.","location":"McConkey''s Bowl, Park City"},
      {"day_number":2,"tip":"Deer Valley''s complimentary ski valet, tissues at the lift lines, and silver service at lunch are not a joke — they''re a lifestyle.","location":"Deer Valley Resort"},
      {"day_number":3,"tip":"The Town Lift on Main Street lets you ski right from downtown to the mountain — no bus or driving needed.","location":"Town Lift, Main Street, Park City"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Park City ski trip: America''s largest resort, Deer Valley luxury, Olympic Park, High West Distillery, and Main Street après.',
  ARRAY['park-city', 'usa', 'skiing', 'winter', 'family', 'mountains', 'utah', 'olympics']
);
RAISE NOTICE 'Park City ski trip inserted';
END $$;
