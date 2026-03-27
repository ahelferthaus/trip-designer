-- Seed: Costa Rica Family Spring Break
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Costa Rica: Zip-lines, Wildlife & Pura Vida',
  'Costa Rica',
  '2026-03-21', '2026-03-28', '1234',
  '{"destination":{"name":"Costa Rica"},"start_date":"2026-03-21","end_date":"2026-03-28","group_members":[{"name":"Mom","type":"adult"},{"name":"Dad","type":"adult"},{"name":"Kid","type":"child","age":10}],"budget_level":"mid","vibes":["family","adventure","nature"]}'::jsonb,
  '{
    "title":"Costa Rica: Zip-lines, Wildlife & Pura Vida",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-21","day_number":1,"title":"San José to Arenal",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Drive to Arenal Volcano","description":"3-hour scenic drive from SJO airport through coffee country to La Fortuna — stop at Sarchí for painted ox carts.","category":"transport","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Route to La Fortuna"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The journey is part of the adventure — stunning green valleys"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Gallo Pinto Breakfast at Soda","description":"Traditional Costa Rican breakfast — rice and beans, eggs, plantains, fresh tropical juice at a local ''soda'' (diner).","category":"food","estimated_cost_per_person":6,"duration_minutes":30,"location":{"name":"Local soda near airport"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Start with Costa Rica''s national dish"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"La Fortuna Waterfall","description":"500 steps down (and back up!) to a 70-meter waterfall with a swimming hole at the base.","category":"adventure","estimated_cost_per_person":18,"duration_minutes":120,"location":{"name":"Catarata Río Fortuna"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Jaw-dropping waterfall — the swimming hole is refreshing after the hike"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Hanging Bridges Walk","description":"Walk through the cloud forest canopy on suspended bridges — spot toucans, howler monkeys, and sloths.","category":"nature","estimated_cost_per_person":26,"duration_minutes":120,"location":{"name":"Mistico Hanging Bridges Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Walking among the treetops is magical for kids"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Tabacón Hot Springs","description":"Natural hot springs fed by Arenal Volcano — multiple pools, waterfalls, swim-up bar, jungle setting.","category":"rest","estimated_cost_per_person":85,"duration_minutes":180,"location":{"name":"Tabacón Thermal Resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Soaking in volcanic hot springs surrounded by rainforest — unforgettable"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Dinner at Don Rufino","description":"La Fortuna''s best restaurant — grilled tenderloin, tropical cocktails, volcano views.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Don Rufino, La Fortuna"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fine dining in a jungle town"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-22","day_number":2,"title":"Zip-lines & Wildlife",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Arenal Zip-line Canopy Tour","description":"12 cables through the rainforest canopy — the longest is 750 meters over a canyon. Kids love it.","category":"adventure","estimated_cost_per_person":55,"duration_minutes":150,"location":{"name":"Sky Adventures Arenal"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Costa Rica invented the zip-line canopy tour — go where it all started"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Arenal Volcano Hike","description":"Guided hike through old lava fields on the volcano''s flanks — views of the perfect cone.","category":"adventure","estimated_cost_per_person":45,"duration_minutes":180,"location":{"name":"Arenal Volcano National Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Walk on a volcano — educational and thrilling for families"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Sloth Sanctuary Visit","description":"See two-toed and three-toed sloths up close — educational rescue center with guided tours.","category":"nature","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Sloth sanctuary near La Fortuna"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Kids go absolutely wild for sloths"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Chocolate Tour","description":"See cacao growing, learn the Mayan chocolate process, and make your own chocolate bar.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Rainforest Chocolate Tour"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Interactive, delicious, and educational"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Night Wildlife Walk","description":"Guided flashlight tour through the rainforest — frogs, spiders, sleeping birds, maybe a viper.","category":"adventure","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"Arenal rainforest"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The rainforest completely transforms at night — thrilling for kids"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Casado Dinner at Local Soda","description":"Costa Rica''s everyday meal — rice, beans, plantain, salad, and your choice of chicken/fish/beef. $8.","category":"food","estimated_cost_per_person":8,"duration_minutes":45,"location":{"name":"Soda Viquez, La Fortuna"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Eat like a Tico — honest, delicious, and incredibly cheap"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-23","day_number":3,"title":"Manuel Antonio Beach & Monkeys",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Transfer to Manuel Antonio","description":"4-hour drive through the Central Valley to the Pacific coast — stop at Tárcoles Bridge for crocodiles.","category":"transport","estimated_cost_per_person":25,"duration_minutes":240,"location":{"name":"Route to Manuel Antonio"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The Tárcoles Bridge has massive wild crocodiles visible from above — incredible roadside stop"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"White Water Rafting — Pacuare River","description":"Class III-IV rapids through jungle gorges — one of National Geographic''s top 5 rafting rivers.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":360,"location":{"name":"Pacuare River"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class rafting through pristine jungle — suitable for ages 10+"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Manuel Antonio National Park","description":"Rainforest trails to white sand beaches — white-faced monkeys, iguanas, sloths, and raccoons everywhere.","category":"nature","estimated_cost_per_person":18,"duration_minutes":180,"location":{"name":"Parque Nacional Manuel Antonio"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most family-friendly national park in Costa Rica"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Beach Afternoon at Playa Espadilla","description":"Public beach just outside the park — gentle waves, beach vendors, boogie board rentals.","category":"rest","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Playa Espadilla"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Relax after the park hike"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Sunset at El Avión","description":"Restaurant built around a 1954 cargo plane — incredible sunset views, fresh ceviche, cold Imperial beers.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"El Avión, Manuel Antonio"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sunset dinner inside an actual airplane — kids love it, adults love the view"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Emilio''s Café — Local Flavors","description":"Farm-fresh Costa Rican cooking — patacones, arroz con pollo, fresh guanabana juice.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Emilio''s Café, Manuel Antonio"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic home cooking in a family-run spot"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Tabacón, the public hot springs (Baldi or Paradise) are half the price of Tabacón and almost as nice.","location":"La Fortuna hot springs"},
      {"day_number":2,"tip":"On the zip-line, ask about the ''Superman'' or ''Tarzan swing'' add-ons — kids always want the extra thrill.","location":"Sky Adventures Arenal"},
      {"day_number":3,"tip":"At Manuel Antonio, hire a guide with a spotting scope at the entrance ($25/person) — you''ll see 10x more wildlife than on your own.","location":"Manuel Antonio National Park entrance"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Costa Rica family adventure: Arenal volcano, zip-lines, hot springs, sloths, Manuel Antonio monkeys, and pura vida vibes.',
  ARRAY['costa-rica', 'family', 'spring-break', 'adventure', 'nature', 'wildlife', 'beach', 'zip-line']
);
RAISE NOTICE 'Costa Rica family spring break inserted';
END $$;
