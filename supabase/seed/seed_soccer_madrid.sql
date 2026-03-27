-- Seed: Madrid Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Madrid Football & Tapas',
  'Madrid, Spain',
  '2026-05-09', '2026-05-14', '1234',
  '{"destination":{"name":"Madrid, Spain"},"start_date":"2026-05-09","end_date":"2026-05-14","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Madrid Football & Tapas",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-09","day_number":1,"title":"Arrival & Royal Madrid",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Santiago Bernabéu Stadium Tour","description":"Tour Real Madrid''s iconic stadium including the pitch, VIP boxes, and trophy room with 15 Champions League titles.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":120,"location":{"name":"Estadio Santiago Bernabéu"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The ultimate Real Madrid experience"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Breakfast at Café de Oriente","description":"Elegant café overlooking the Royal Palace with churros, tortilla española, and fresh OJ.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Café de Oriente, Plaza de Oriente"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Classic Madrid morning ritual"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Royal Palace of Madrid","description":"Europe''s largest royal palace with 3,418 rooms, stunning gardens, and the royal armory.","category":"attraction","estimated_cost_per_person":14,"duration_minutes":120,"location":{"name":"Palacio Real"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Madrid''s grandest landmark"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Mercado de San Miguel","description":"Gourmet market in a stunning iron-and-glass building — tapas, wine, oysters, and jamón.","category":"food","estimated_cost_per_person":20,"duration_minutes":60,"location":{"name":"Mercado de San Miguel"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Foodie paradise near Plaza Mayor"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Tapas Crawl in La Latina","description":"Madrid''s best tapas neighborhood — hop between Cava Baja bars for croquetas, jamón, and calamari.","category":"food","estimated_cost_per_person":30,"duration_minutes":120,"location":{"name":"La Latina, Cava Baja"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Madrid''s tapas capital"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Rooftop at Círculo de Bellas Artes","description":"Panoramic views of Gran Vía and the city skyline from this iconic cultural center rooftop.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":60,"location":{"name":"Círculo de Bellas Artes"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Best rooftop view in Madrid"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-10","day_number":2,"title":"Art & Matchday",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Museo del Prado","description":"One of the world''s greatest art museums — Velázquez, Goya, El Greco, Bosch.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":150,"location":{"name":"Museo Nacional del Prado"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class art collection"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Retiro Park Morning Walk","description":"Stroll through Madrid''s central park, rent a rowboat on the lake, visit the Crystal Palace.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Parque del Retiro"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Madrid''s green lung, perfect for morning exercise"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Pre-Match at Peña Madridista Bar","description":"Join Real Madrid fan club members for pre-game drinks and match buildup.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Sports bar near Bernabéu"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic Madrid football culture"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Reina Sofía Museum","description":"Home of Picasso''s Guernica plus Dalí and Miró masterpieces.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Museo Reina Sofía"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"See Guernica — one of the most important paintings ever made"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Real Madrid Match at Bernabéu","description":"Experience the Hala Madrid chants and the white wall of 81,000 fans at the renovated stadium.","category":"adventure","estimated_cost_per_person":90,"duration_minutes":150,"location":{"name":"Santiago Bernabéu"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Matchday at the cathedral of football"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Flamenco at Corral de la Morería","description":"Madrid''s most prestigious flamenco tablao — intimate performances with dinner.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"Corral de la Morería"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Rated the #1 flamenco venue in the world"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-11","day_number":3,"title":"Hidden Madrid & Flavors",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Malasaña Neighborhood Walk","description":"Madrid''s hipster quarter — vintage shops, street art, craft coffee at Toma Café.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Malasaña"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"See Madrid''s creative side"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Chocolatería San Ginés","description":"Open since 1894 — thick hot chocolate with freshly fried churros. A Madrid institution.","category":"food","estimated_cost_per_person":5,"duration_minutes":30,"location":{"name":"Chocolatería San Ginés"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most famous churros in Spain"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Wanda Metropolitano Tour","description":"Tour Atlético Madrid''s modern stadium — the other side of Madrid football rivalry.","category":"attraction","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Cívitas Metropolitano"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"See both sides of Madrid football"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Lunch at Sobrino de Botín","description":"The world''s oldest restaurant (Guinness record, since 1725) — famous roast suckling pig.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"Sobrino de Botín"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Hemingway''s favorite Madrid restaurant"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Sunset at Templo de Debod","description":"Ancient Egyptian temple relocated to Madrid — stunning sunset views over Casa de Campo.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Templo de Debod"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Most romantic sunset spot in Madrid"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Dinner & Drinks in Huertas","description":"Madrid''s literary quarter — pintxos bars, wine caves, and late-night energy.","category":"food","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Barrio de Huertas"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Madrid nightlife starts here"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-05-12","day_number":4,"title":"Day Trip to Toledo",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Toledo Day Trip","description":"Medieval walled city 30 min from Madrid — cathedral, synagogue, El Greco museum, sword shops.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":300,"location":{"name":"Toledo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The City of Three Cultures, stunning and easy to reach"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"El Rastro Flea Market","description":"Madrid''s legendary Sunday flea market — antiques, vintage, art, and street performers.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"El Rastro, La Latina"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sunday institution since 1740"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Marzipan Tasting in Toledo","description":"Toledo is the marzipan capital of Spain — visit Santo Tomé bakery for fresh mazapán.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Obrador Santo Tomé, Toledo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Sweet tradition dating back to medieval times"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Gran Vía Shopping Walk","description":"Madrid''s answer to Broadway — art deco buildings, Zara flagship, Primark palace.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Gran Vía"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Iconic Madrid boulevard"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Cocido Madrileño at La Barraca","description":"Madrid''s signature dish — a hearty chickpea stew served in three courses.","category":"food","estimated_cost_per_person":22,"duration_minutes":90,"location":{"name":"La Barraca"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The quintessential Madrid comfort food"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Jazz at Café Central","description":"Intimate jazz club that has hosted international legends since 1982.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Café Central, Plaza del Ángel"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of Europe''s best jazz clubs"}
          ]}
        ]
      },
      {"id":"day-5","trip_id":"trip-1","date":"2026-05-13","day_number":5,"title":"Farewell Madrid",
        "slots":[
          {"id":"slot-5-1","day_id":"day-5","slot_type":"morning","status":"open","options":[
            {"id":"opt-5-1-1","slot_id":"slot-5-1","title":"Thyssen-Bornemisza Museum","description":"Completes Madrid''s art triangle — Impressionists, Pop Art, and everything in between.","category":"attraction","estimated_cost_per_person":13,"duration_minutes":120,"location":{"name":"Museo Thyssen-Bornemisza"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The perfect art museum for those who want a bit of everything"},
            {"id":"opt-5-1-2","slot_id":"slot-5-1","title":"Brunch at Federal Café Madrid","description":"Trendy Australian-style brunch — avo toast, açaí bowls, flat whites.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Federal Café, Malasaña"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best brunch in Madrid"}
          ]},
          {"id":"slot-5-2","day_id":"day-5","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-5-2-1","slot_id":"slot-5-2","title":"Real Madrid Official Store","description":"Pick up an authentic jersey, scarf, or signed memorabilia from the Bernabéu megastore.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Real Madrid Store, Bernabéu"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Last chance for football souvenirs"},
            {"id":"opt-5-2-2","slot_id":"slot-5-2","title":"Retiro Park Rowboats","description":"Rent a rowboat on the lake in front of the Alfonso XII monument — pure Madrid magic.","category":"rest","estimated_cost_per_person":6,"duration_minutes":45,"location":{"name":"Estanque del Retiro"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Relaxed farewell afternoon"}
          ]},
          {"id":"slot-5-3","day_id":"day-5","slot_type":"evening","status":"open","options":[
            {"id":"opt-5-3-1","slot_id":"slot-5-3","title":"Farewell Dinner at StreetXO","description":"David Muñoz''s casual concept — explosive Asian-Spanish fusion tapas. Wild flavors.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"StreetXO, Gran Vía"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Madrid''s most exciting chef in a casual format"},
            {"id":"opt-5-3-2","slot_id":"slot-5-3","title":"Drinks at Salmon Guru","description":"Named among the world''s best bars — theatrical cocktails in an eclectic space.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Salmon Guru, Echegaray"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class cocktails for the last night"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"At Mercado de San Miguel, skip the expensive stalls at the entrance — the best stuff is in the back corners.","location":"Mercado de San Miguel"},
      {"day_number":2,"tip":"The Prado is free the last 2 hours before closing. The crowd thins out dramatically.","location":"Museo del Prado"},
      {"day_number":3,"tip":"Ask a local about the ''cañas route'' — the art of moving between bars ordering small beers and free tapas.","location":"La Latina"},
      {"day_number":4,"tip":"In Toledo, take the Ronda path around the outside of the city walls for photos most tourists miss.","location":"Toledo city walls"},
      {"day_number":5,"tip":"At Retiro Park, find the Ángel Caído statue — the only public monument in the world dedicated to the devil.","location":"Parque del Retiro"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '5-day Madrid trip mixing Real Madrid football with world-class art, tapas culture, and a Toledo day trip. Bernabéu tour and match included.',
  ARRAY['madrid', 'spain', 'europe', 'soccer', 'sports', 'culture', 'food']
);
RAISE NOTICE 'Madrid soccer trip inserted';
END $$;
