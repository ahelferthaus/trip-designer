-- Seed: Chamonix Ski Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Chamonix: Mont Blanc, Vallée Blanche & Fondue',
  'Chamonix, France',
  '2026-02-07', '2026-02-14', '1234',
  '{"destination":{"name":"Chamonix, France"},"start_date":"2026-02-07","end_date":"2026-02-14","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["adventure","nature","food"],"travel_theme":"skiing"}'::jsonb,
  '{
    "title":"Chamonix: Mont Blanc, Vallée Blanche & Fondue",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-02-07","day_number":1,"title":"Arrival & Brévent",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Ski Brévent-Flégère","description":"Chamonix''s sunniest area — incredible views of Mont Blanc from every run. Perfect warm-up for the week.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":240,"location":{"name":"Brévent-Flégère, Chamonix"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Face-to-face with Mont Blanc while you ski — the most scenic skiing in the Alps"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Croissant & Café at Poco Loco","description":"French mountain café — fresh croissants, tartines, and the best hot chocolate in the valley.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Poco Loco, Chamonix center"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Start the day the French way — butter, bread, and chocolate"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Aiguille du Midi Cable Car","description":"3,842m — the highest cable car in Europe. Step onto the glass Skywalk over a 1,000m drop. Non-skiers welcome.","category":"attraction","estimated_cost_per_person":65,"duration_minutes":120,"location":{"name":"Aiguille du Midi"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most dramatic viewpoint in the Alps — you can see 3 countries"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"On-Mountain Tartiflette","description":"Alpine cheese, potato, and lardons baked in a cast iron — eaten on a sunny terrace at altitude.","category":"food","estimated_cost_per_person":18,"duration_minutes":45,"location":{"name":"Mountain restaurant, Brévent"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Savoyard dish that defines Alpine skiing"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Fondue at La Calèche","description":"Traditional Savoyard fondue — bubbling Beaufort and Comté cheese with crusty bread and white wine.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"La Calèche, Chamonix center"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fondue in a wooden chalet — the essential Alpine evening"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Après at MBC (Micro Brasserie de Chamonix)","description":"Chamonix''s craft brewery — local ales, burgers, and a mountain-town pub atmosphere.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"MBC, Chamonix"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The meeting point for Chamonix''s international ski community"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-02-08","day_number":2,"title":"Vallée Blanche",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Vallée Blanche Off-Piste Descent","description":"20km glacier descent from Aiguille du Midi (3,842m) to Chamonix — hire a guide, it''s mandatory. The most famous ski run in the world.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":300,"location":{"name":"Vallée Blanche, Mont Blanc massif"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The bucket-list ski descent — 20km through glaciers, seracs, and crevasses with Mont Blanc towering above"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Ski Les Grands Montets","description":"Chamonix''s steepest resort — legendary off-piste, couloirs, and 2,000m vertical when conditions allow.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":240,"location":{"name":"Les Grands Montets, Argentière"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Where expert skiers come to test themselves"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Montenvers Railway & Mer de Glace","description":"Cog railway to France''s largest glacier — ice cave, museum, and views of the glacier (which is sadly retreating).","category":"attraction","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"Montenvers, Mer de Glace"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"See a real glacier up close — humbling and educational"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Crêpe at a Valley Café","description":"Sweet crêpe with Nutella and banana, or savory galette with ham, cheese, and egg — French Alps fuel.","category":"food","estimated_cost_per_person":8,"duration_minutes":20,"location":{"name":"Any crêperie in Chamonix"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The €5 French Alps snack that never disappoints"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Raclette Dinner at Le Panier des 4 Saisons","description":"Melted raclette cheese scraped onto potatoes, charcuterie, and cornichons — the other great Alpine cheese dish.","category":"food","estimated_cost_per_person":28,"duration_minutes":90,"location":{"name":"Le Panier des 4 Saisons"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Raclette is fondue''s equally delicious sibling"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Cocktails at Chambre Neuf","description":"Chamonix''s legendary après bar — Scandinavian-run, live music, dancing on tables. Wild.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Chambre Neuf, Chamonix"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Chamonix nightlife gets surprisingly rowdy — in the best way"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-02-09","day_number":3,"title":"Courmayeur Day Trip",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Day Trip to Courmayeur, Italy","description":"Drive through the Mont Blanc Tunnel to the Italian side — ski Courmayeur, eat Italian mountain food, come back French.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":300,"location":{"name":"Courmayeur, Italy"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Ski two countries in one day — through a tunnel under Mont Blanc"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Ski Le Tour / Balme","description":"Chamonix''s quietest area — north-facing slopes that hold powder, great for intermediate skiers.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":240,"location":{"name":"Le Tour-Balme, Vallorcine"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The locals'' secret — no crowds, great snow"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Italian Lunch in Courmayeur","description":"Pasta, polenta, and local Fontina cheese at a trattoria on the Via Roma — because you''re in Italy now.","category":"food","estimated_cost_per_person":22,"duration_minutes":60,"location":{"name":"Via Roma, Courmayeur"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Italian mountain food hits different after a morning of skiing"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Alpine Museum Chamonix","description":"History of alpinism from the first Mont Blanc ascent (1786) to modern extreme skiing.","category":"attraction","estimated_cost_per_person":8,"duration_minutes":60,"location":{"name":"Musée Alpin, Chamonix"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Chamonix is where alpinism was invented"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Farewell at Le Bistrot","description":"Chamonix''s most sophisticated restaurant — duck confit, mountain lamb, and a deep French wine list.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Le Bistrot, Chamonix"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"French gastronomy in a mountain setting"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Vin Chaud by the Fire","description":"Hot mulled wine (vin chaud) at any bar with a fireplace — cinnamon, orange, and red wine warmth.","category":"food","estimated_cost_per_person":6,"duration_minutes":60,"location":{"name":"Any Chamonix bar"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The simplest and most perfect way to end an Alpine day"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The Aiguille du Midi glass Skywalk (''Step into the Void'') is free with the cable car ticket — but the queue can be 30 min. Go first.","location":"Aiguille du Midi summit"},
      {"day_number":2,"tip":"For the Vallée Blanche, book a guide through the Compagnie des Guides de Chamonix — the oldest guide company in the world (founded 1821).","location":"Compagnie des Guides, Chamonix"},
      {"day_number":3,"tip":"The Mont Blanc Tunnel toll is ~€50 round trip — but having lunch in Italy and skiing back to France the same day is priceless.","location":"Mont Blanc Tunnel"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Chamonix ski trip: Vallée Blanche glacier descent, Aiguille du Midi, Courmayeur Italy day trip, fondue, raclette, and Mont Blanc views.',
  ARRAY['chamonix', 'france', 'europe', 'skiing', 'winter', 'luxury', 'alps', 'mont-blanc']
);
RAISE NOTICE 'Chamonix ski trip inserted';
END $$;
