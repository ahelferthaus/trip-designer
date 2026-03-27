-- Seed: Steamboat Springs Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Steamboat: Champagne Powder & Hot Springs',
  'Steamboat Springs, CO',
  '2026-03-06', '2026-03-10', '1234',
  '{"destination":{"name":"Steamboat Springs, CO"},"start_date":"2026-03-06","end_date":"2026-03-10","group_members":[{"name":"Traveler","type":"adult"},{"name":"Kid","type":"child","age":10}],"budget_level":"mid","vibes":["adventure","family"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Steamboat: Champagne Powder & Hot Springs",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-06","day_number":1,"title":"Champagne Powder Day",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Steamboat Resort","description":"165 trails, legendary tree skiing, and trademarked ''Champagne Powder'' — the lightest, driest snow in Colorado.","category":"adventure","estimated_cost_per_person":180,"duration_minutes":240,"location":{"name":"Steamboat Ski Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Champagne Powder® is literally trademarked — it''s that special"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Cowboy Breakfast at Creekside Cafe","description":"Hearty ranch-style breakfast — biscuits and gravy, huevos rancheros, and strong cowboy coffee.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Creekside Cafe, Steamboat"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Real ranching town breakfast — not a ski resort chain"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Morningside Park Tree Skiing","description":"Steamboat''s famous gladed terrain — pillow lines, natural halfpipes, and champagne powder stashes.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Morningside Park, Steamboat"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best tree skiing in Colorado — powder hides between aspens all day"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Tubing Hill at Howelsen Hill","description":"Steamboat''s local hill — tubing lanes, a conveyor lift, and views of the ski jumps where Olympians train.","category":"adventure","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Howelsen Hill"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Fun for the whole family — Howelsen is America''s oldest continuously operating ski area"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Strawberry Park Hot Springs","description":"Natural hot springs 7 miles from town — pools surrounded by snow-covered rocks under the stars. Clothing optional after dark.","category":"rest","estimated_cost_per_person":20,"duration_minutes":120,"location":{"name":"Strawberry Park Hot Springs"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Steaming natural pools surrounded by snow — the quintessential Colorado experience"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Cafe Diva","description":"Steamboat''s best restaurant — Colorado lamb, wild game, and a wine list that surprises for a mountain town.","category":"food","estimated_cost_per_person":50,"duration_minutes":90,"location":{"name":"Cafe Diva, Ski Time Square"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fine dining with a genuine mountain-town soul"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-07","day_number":2,"title":"Town & Ranch Life",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"More Champagne Powder Laps","description":"Hit the back side — Pioneer Ridge, Sunshine Peak, and the Storm Peak zone for less-skied terrain.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":240,"location":{"name":"Storm Peak area, Steamboat"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Steamboat''s back side is where the locals go on powder days"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Horseback Ride through Yampa Valley","description":"Winter horseback riding through ranch land — cowboy guides, mountain views, and real Western heritage.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":120,"location":{"name":"Saddleback Ranch, Steamboat"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Steamboat is a real ranching town — this is the genuine cowboy experience"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Old Town Hot Springs","description":"Community hot spring pools right in downtown Steamboat — water slide, lap pool, and mineral soaking pool.","category":"rest","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Old Town Hot Springs, Steamboat"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Less dramatic than Strawberry Park but right in town — easy afternoon soak"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Lincoln Avenue Shopping","description":"Real Western main street — tack shops, art galleries, bookstores, and F.M. Light & Sons (Western wear since 1905).","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Lincoln Avenue, downtown Steamboat"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"An actual working ranching town''s main street — not a resort village"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Laundry Kitchen & Cocktails","description":"Farm-to-table in a converted laundromat — bison burger, house-smoked trout, craft cocktails.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Laundry, downtown Steamboat"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Creative mountain cuisine in a funky space"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Craft Beer at Mountain Tap Brewery","description":"Local microbrewery with 15+ taps — Headwall IPA, Yampa lager, and Thursday trivia nights.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Mountain Tap Brewery, downtown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Steamboat''s best local brewery — real mountain town vibes"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-08","day_number":3,"title":"Last Laps & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Final Morning — Buddy''s Run to Steamboat Gondola","description":"Top-to-bottom cruiser run — 3,668 vertical feet of groomed perfection to end the trip.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Buddy''s Run, Steamboat"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The signature run at Steamboat — long, fast, and satisfying"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Breakfast at Winona''s","description":"Steamboat''s brunch institution — massive cinnamon rolls, chicken fried steak, and eggs done every way.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"Winona''s, Lincoln Ave"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The cinnamon roll alone is worth the trip to Steamboat"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Drive to Denver (3.5 hours)","description":"Scenic Rabbit Ears Pass (9,426 ft) through the Routt National Forest — stop at Beau Jo''s in Idaho Springs.","category":"transport","estimated_cost_per_person":0,"duration_minutes":210,"location":{"name":"US-40 / I-70 to Denver"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Rabbit Ears Pass in winter is gorgeous — and less traffic than I-70 resorts"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Fly out of Yampa Valley Airport","description":"Steamboat''s local airport 22 miles away — direct flights to Denver, Dallas, Houston during ski season.","category":"transport","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Yampa Valley Regional Airport"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Small airport, easy in and out — no Denver traffic"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at The Cabin","description":"Log cabin bar and restaurant — whiskey flights, live music, and the warmth of a real wood-burning fireplace.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"The Cabin, downtown Steamboat"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The coziest farewell spot in any ski town"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Last Hot Springs Soak","description":"One final soak at Old Town Hot Springs before heading home — the perfect bookend to a ski trip.","category":"rest","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Old Town Hot Springs"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"End where you began — hot water, cold air, mountain memories"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Strawberry Park requires 4WD or chains in winter — many rental cars can''t make it. Book the shuttle from town instead ($10 round-trip).","location":"Strawberry Park Hot Springs"},
      {"day_number":2,"tip":"F.M. Light & Sons has been selling cowboy hats since 1905 — they''ll custom-shape one to your head in 10 minutes.","location":"F.M. Light & Sons, Lincoln Ave"},
      {"day_number":3,"tip":"Steamboat has produced more Winter Olympians (100+) than any other town in North America — the ski jumping hill at Howelsen is where they all started.","location":"Howelsen Hill"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Steamboat ski trip: Champagne Powder®, Strawberry Park hot springs, real cowboy ranch town, tree skiing, and Western heritage.',
  ARRAY['steamboat', 'usa', 'skiing', 'winter', 'family', 'mountains', 'colorado', 'hot-springs']
);
RAISE NOTICE 'Steamboat ski trip inserted';
END $$;
