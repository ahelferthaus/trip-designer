-- Seed: Maui Family Spring Break
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Maui: Road to Hana, Snorkeling & Aloha',
  'Maui, Hawaii',
  '2026-03-21', '2026-03-28', '1234',
  '{"destination":{"name":"Maui, Hawaii"},"start_date":"2026-03-21","end_date":"2026-03-28","group_members":[{"name":"Mom","type":"adult"},{"name":"Dad","type":"adult"},{"name":"Kid","type":"child","age":11}],"budget_level":"splurge","vibes":["family","nature","relaxed"]}'::jsonb,
  '{
    "title":"Maui: Road to Hana, Snorkeling & Aloha",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-21","day_number":1,"title":"Ka''anapali Beach & Arrival",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ka''anapali Beach","description":"3-mile stretch of golden sand with calm swimming, Black Rock snorkeling, and resort vibes.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Ka''anapali Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of Hawaii''s most beautiful beaches — settle into island time"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Açaí & Shave Ice at Ululani''s","description":"Maui''s legendary shave ice — real fruit syrups, ice cream base, mochi toppings.","category":"food","estimated_cost_per_person":8,"duration_minutes":20,"location":{"name":"Ululani''s Hawaiian Shave Ice, Lahaina"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best shave ice in Hawaii, period"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Black Rock Cliff Jump & Snorkel","description":"Snorkel with sea turtles and tropical fish at Pu''u Keka''a, or watch the cliff divers at sunset.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Black Rock, Ka''anapali"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Snorkeling with turtles right off the beach"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Whalers Village Shopping","description":"Open-air beachfront mall — whale museum (free), surf shops, and kids'' activities.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Whalers Village, Ka''anapali"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Relaxed shopping steps from the beach"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Luau at Old Lahaina Luau","description":"Maui''s best luau — traditional ceremony, hula dance, poi, kalua pig, open bar, oceanfront.","category":"food","estimated_cost_per_person":130,"duration_minutes":180,"location":{"name":"Old Lahaina Luau"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Authentic Hawaiian cultural experience — the kids will be in awe"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Sunset Dinner at Merriman''s","description":"Farm-to-table Hawaiian cuisine with floor-to-ceiling ocean views — catch of the day, local produce.","category":"food","estimated_cost_per_person":55,"duration_minutes":90,"location":{"name":"Merriman''s Kapalua"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best fine dining sunset view in Maui"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-22","day_number":2,"title":"Road to Hana",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Road to Hana — Full Day Drive","description":"620 curves, 59 bridges — stop at Twin Falls, Garden of Eden, Wai''anapanapa black sand beach.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":480,"location":{"name":"Hana Highway"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most beautiful road trip in America"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Snorkel Tour to Molokini Crater","description":"Catamaran to the crescent-shaped volcanic crater — crystal visibility, 250+ fish species, and dolphins.","category":"adventure","estimated_cost_per_person":120,"duration_minutes":300,"location":{"name":"Molokini Crater"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class snorkeling in a volcanic caldera"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Wai''anapanapa Black Sand Beach","description":"Dramatic volcanic black sand, sea caves, blowholes, and lush tropical vegetation.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Wai''anapanapa State Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the most unique beaches in the world"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Banana Bread at Aunty Sandy''s","description":"Fresh-baked banana bread from a roadside stand in Ke''anae — warm, dense, and legendary.","category":"food","estimated_cost_per_person":5,"duration_minutes":15,"location":{"name":"Aunty Sandy''s, Ke''anae"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most famous banana bread in Hawaii"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Poke Bowls at Tin Roof Maui","description":"Chef Sheldon Simeon''s casual spot — garlic noodles, poke, and fried chicken that locals line up for.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"Tin Roof, Kahului"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Top Chef winner''s casual Maui kitchen"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Stargazing from Haleakalā","description":"Drive to the summit (10,023 ft) for some of the best stargazing on Earth — Milky Way visible to naked eye.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Haleakalā National Park summit"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Above the clouds, the stars are extraordinary"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-23","day_number":3,"title":"Haleakalā Sunrise & Upcountry",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Haleakalā Sunrise","description":"Watch the sunrise from 10,000 feet above the clouds — book reservations weeks ahead. Bring warm layers.","category":"adventure","estimated_cost_per_person":1,"duration_minutes":120,"location":{"name":"Haleakalā Summit"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Mark Twain called it ''the most sublime spectacle I have ever witnessed''"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Downhill Bike Ride from Haleakalā","description":"Coast 23 miles downhill from the volcano to the coast — guided tour with bikes provided.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":180,"location":{"name":"Haleakalā to Paia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The coolest way to descend a volcano"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Paia Town Lunch & Shopping","description":"Bohemian surf town — boutiques, galleries, lunch at Mama''s Fish House or Paia Fish Market.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Paia"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Maui''s most charming little town"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Ho''okipa Beach — Turtle Watch","description":"World-famous windsurfing beach where sea turtles haul out on the sand in the afternoon.","category":"nature","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Ho''okipa Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Guaranteed turtle sightings in the afternoon"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Dinner at Mama''s Fish House","description":"Maui''s most famous restaurant — the fisherman who caught your fish is named on the menu.","category":"food","estimated_cost_per_person":75,"duration_minutes":90,"location":{"name":"Mama''s Fish House, Paia"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Legendary Maui dining — book months ahead"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Flatbread at Monkeypod Kitchen","description":"Peter Merriman''s casual spot — wood-fired flatbreads, craft cocktails, live music.","category":"food","estimated_cost_per_person":25,"duration_minutes":60,"location":{"name":"Monkeypod Kitchen, Wailea"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Laid-back Maui dining done right"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Black Rock, the cliff diving ceremony at sunset is a free daily tradition — a torch-lit diver leaps from the rock at dusk.","location":"Black Rock, Ka''anapali"},
      {"day_number":2,"tip":"On the Road to Hana, stop at mile marker 19 for the Upper Waikani Falls — pull over and walk 1 minute to see three waterfalls.","location":"Mile marker 19, Hana Highway"},
      {"day_number":3,"tip":"Book Haleakalā sunrise reservations at recreation.gov exactly 60 days before your date at 7am ET — they sell out in minutes.","location":"Haleakalā National Park"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Maui family trip: Road to Hana, Haleakalā sunrise, Molokini snorkeling, sea turtles, luau, and world-class dining.',
  ARRAY['maui', 'hawaii', 'usa', 'family', 'spring-break', 'beach', 'nature', 'snorkeling']
);
RAISE NOTICE 'Maui family spring break inserted';
END $$;
