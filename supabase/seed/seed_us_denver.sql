-- Seed: Denver Weekend Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Denver: Mountains, Breweries & Red Rocks',
  'Denver, CO',
  '2026-06-19', '2026-06-22', '1234',
  '{"destination":{"name":"Denver, CO"},"start_date":"2026-06-19","end_date":"2026-06-22","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["adventure","nature","food"]}'::jsonb,
  '{
    "title":"Denver: Mountains, Breweries & Red Rocks",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-19","day_number":1,"title":"RiNo & Downtown",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"RiNo Art District Walk","description":"River North''s street art, galleries, and coffee at Corvus or Huckleberry Roasters.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"RiNo Art District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Denver''s coolest neighborhood — murals on every wall"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast Burrito at Santiago''s","description":"Denver''s beloved green chile breakfast burrito — $4, enormous, and the green chile is addictive.","category":"food","estimated_cost_per_person":5,"duration_minutes":15,"location":{"name":"Santiago''s, various"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Denver runs on green chile breakfast burritos"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Denver Art Museum","description":"Daniel Libeskind''s titanium-clad building — Western American art, Impressionists, and textile galleries.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Denver Art Museum"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Stunning architecture and a world-class Western art collection"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Craft Beer on Larimer Street","description":"Denver has 100+ breweries — start at Great Divide, walk to Ratio Beerworks, end at Our Mutual Friend.","category":"food","estimated_cost_per_person":20,"duration_minutes":150,"location":{"name":"Larimer Street, RiNo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Denver is America''s craft beer capital"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Dinner at Linger","description":"Globally-inspired small plates in a converted mortuary — rooftop with Rocky Mountain views.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Linger, LoHi"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best restaurant view in Denver"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Red Rocks Amphitheatre Concert","description":"The most beautiful outdoor venue in America — check the schedule for any show, the venue IS the experience.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":180,"location":{"name":"Red Rocks Amphitheatre, Morrison"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Seeing any concert at Red Rocks is a bucket list item"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-20","day_number":2,"title":"Mountains & Golden",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Drive to Rocky Mountain National Park","description":"90 minutes from Denver — Trail Ridge Road, elk spotting, alpine lakes, and 14,000-foot peaks.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":360,"location":{"name":"Rocky Mountain National Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Rockies in person are staggering — photos don''t do justice"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Hike at Red Rocks Park","description":"Free hiking trails around the amphitheatre rocks — Trading Post Trail loop with incredible formations.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Red Rocks Park, Morrison"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class hiking 20 minutes from downtown"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Coors Brewery Tour in Golden","description":"Free tour of the world''s largest single-site brewery — see the process, taste fresh Banquet beer.","category":"food","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Coors Brewery, Golden"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Free beer at the foot of the Rockies — yes please"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Golden Main Street","description":"Charming mountain town — Clear Creek kayaking, Woody''s Pizza, and a small-town Colorado vibe.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Golden, CO"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where Denver goes to feel like a small town"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Dinner at Guard and Grace","description":"Denver''s best steakhouse — dry-aged prime cuts, rooftop cocktails, downtown skyline views.","category":"food","estimated_cost_per_person":60,"duration_minutes":90,"location":{"name":"Guard and Grace, downtown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Colorado beef at its finest"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Cocktails at Williams & Graham","description":"Speakeasy behind a bookshelf — craft cocktails in a 1920s setting. Reservations recommended.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Williams & Graham, LoHi"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Denver''s best-kept cocktail secret"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-21","day_number":3,"title":"Union Station & Farewell",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Union Station Brunch","description":"Beautifully restored Beaux-Arts station — Mercantile brunch, Pigtrain Coffee, or Milkbox Ice Cream.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Denver Union Station"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Denver''s living room — gorgeous building, great food"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"16th Street Mall Walk","description":"Mile-long pedestrian promenade — free shuttle bus, shopping, street performers, and people-watching.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"16th Street Mall"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Denver''s main drag — easy walking and free transit"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Denver Botanic Gardens","description":"24 acres of themed gardens — tropical conservatory, Japanese garden, and mountain views.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Denver Botanic Gardens, Cheesman Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the top botanical gardens in the US"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Shopping in Cherry Creek","description":"Denver''s upscale shopping district — local boutiques, galleries, and the Cherry Creek Mall.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Cherry Creek"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Denver''s most polished neighborhood"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell Green Chile at The Cherry Cricket","description":"Denver''s best burger — half-pound patty with Pueblo green chile and cheddar. Since 1945.","category":"food","estimated_cost_per_person":16,"duration_minutes":45,"location":{"name":"The Cherry Cricket, Cherry Creek"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The green chile cheeseburger is Denver''s gift to humanity"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Sunset at City Park","description":"Watch the sun set behind the Rockies with the Denver Museum of Nature & Science as a backdrop.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"City Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Rocky Mountain sunset is the perfect Denver farewell"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Red Rocks shows sell out fast — check the calendar months ahead. Even without a concert, the venue is open for free hiking/exercise.","location":"Red Rocks Amphitheatre"},
      {"day_number":2,"tip":"At RMNP, the Bear Lake trailhead fills up by 9am in summer — take the free park shuttle from the Estes Park visitor center.","location":"Rocky Mountain National Park"},
      {"day_number":3,"tip":"The Terminal Bar inside Union Station has craft cocktails and you can sit in vintage train-station chairs. Most tourists walk right past it.","location":"Denver Union Station"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '3-day Denver weekend: Red Rocks, Rocky Mountain National Park, 100+ craft breweries, green chile everything, and mountain views.',
  ARRAY['denver', 'usa', 'weekend', 'adventure', 'nature', 'food', 'beer', 'mountains']
);
RAISE NOTICE 'Denver weekend trip inserted';
END $$;
