-- Seed: Milan Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Milan: Fashion, Food & Football',
  'Milan, Italy',
  '2026-05-29', '2026-06-03', '1234',
  '{"destination":{"name":"Milan, Italy"},"start_date":"2026-05-29","end_date":"2026-06-03","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Milan: Fashion, Food & Football",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-29","day_number":1,"title":"Duomo & San Siro",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Milan Cathedral (Duomo) Rooftop","description":"Climb to the roof terraces for incredible views among gothic spires and marble statues.","category":"attraction","estimated_cost_per_person":16,"duration_minutes":120,"location":{"name":"Duomo di Milano"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Milan''s most iconic landmark"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Espresso & Brioche at Marchesi 1824","description":"Milan''s oldest pastry shop — perfect cornetto and espresso in an elegant setting.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Pasticceria Marchesi"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Milanese breakfast perfection"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"San Siro Stadium Tour","description":"Tour the shared home of AC Milan and Inter — locker rooms, pitch access, and museum with both clubs'' trophies.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Stadio Giuseppe Meazza (San Siro)"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Two legendary clubs, one legendary stadium"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Galleria Vittorio Emanuele II","description":"The world''s oldest shopping mall — stunning glass ceiling, Prada flagship, spin on the bull mosaic.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Galleria Vittorio Emanuele II"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Milan''s living room — glamour meets architecture"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Aperitivo Hour in Navigli","description":"Milan''s canal district — spritz, Negroni, and free buffet snacks at bars along the waterway.","category":"food","estimated_cost_per_person":12,"duration_minutes":120,"location":{"name":"Navigli District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Milan''s aperitivo culture is sacred"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Risotto alla Milanese at Ratanà","description":"Saffron risotto with ossobuco — the ultimate Milanese dish in a converted railway station.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Ratanà, Porta Nuova"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best risotto in Milan"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-30","day_number":2,"title":"Art, Da Vinci & Matchday",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"The Last Supper (Cenacolo)","description":"Da Vinci''s masterpiece — book months ahead for a 15-minute viewing slot. Unmissable.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"Santa Maria delle Grazie"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of the most famous paintings in history"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Brera Art Gallery","description":"Mantegna''s Dead Christ, Raphael, Caravaggio — in Milan''s bohemian artists'' quarter.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Pinacoteca di Brera"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class Renaissance art"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Casa Milan & AC Milan Museum","description":"Visit AC Milan''s HQ — interactive museum, historic jerseys, Champions League trophies.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"Casa Milan, Portello"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Dive deep into Rossoneri history"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Lunch at Luini Panzerotti","description":"Queue-worthy fried panzerotti stuffed with mozzarella and tomato. Milan street food icon.","category":"food","estimated_cost_per_person":5,"duration_minutes":20,"location":{"name":"Luini, Via Santa Radegonda"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best €3 you''ll spend in Milan"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"AC Milan or Inter Match at San Siro","description":"90,000 capacity thundering with Curva Nord or Curva Sud ultras — an intense football experience.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":150,"location":{"name":"San Siro"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Derby della Madonnina atmosphere is electric"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Opera at La Scala","description":"One of the world''s most famous opera houses — check for available performances.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":150,"location":{"name":"Teatro alla Scala"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The pinnacle of Italian culture"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-31","day_number":3,"title":"Porta Nuova & Lake Como Day Trip",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Lake Como Day Trip","description":"1-hour train to Varenna or Bellagio — lakeside villages, villas, stunning Alpine scenery.","category":"adventure","estimated_cost_per_person":20,"duration_minutes":360,"location":{"name":"Lake Como"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the most beautiful lakes in the world"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Porta Nuova Modern Milan","description":"Milan''s new skyline — Bosco Verticale, Piazza Gae Aulenti, the Unicredit Tower.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Porta Nuova district"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Milan''s futuristic side"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Gelato at Ciacco","description":"Milan''s best gelato — creative flavors like ricotta and fig, salted caramel, pistachio.","category":"food","estimated_cost_per_person":5,"duration_minutes":20,"location":{"name":"Ciacco, Via Spadari"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Award-winning artisan gelato"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Quadrilatero della Moda Shopping","description":"Milan''s fashion district — Via Montenapoleone, Versace, Armani, window shopping heaven.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Via Montenapoleone"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Fashion capital of the world"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Dinner at Trattoria Milanese","description":"Classic trattoria since 1933 — cotoletta alla milanese (the original), ossobuco, tiramisu.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Trattoria Milanese, Via Santa Marta"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Old-school Milanese cooking at its best"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Cocktails at Ceresio 7","description":"Rooftop pool bar with 360° views — Milan''s most glamorous spot for an evening drink.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Ceresio 7, Porta Volta"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"La dolce vita, Milanese style"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-06-01","day_number":4,"title":"Markets & Arrivederci",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Mercato Metropolitano","description":"Huge sustainable food market — Italian cheeses, fresh pasta, wood-fired pizza, coffee roasters.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Mercato Metropolitano, Porta Genova"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Italian food paradise"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Fondazione Prada","description":"Rem Koolhaas-designed contemporary art museum — Wes Anderson-designed bar (Bar Luce) on site.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Fondazione Prada"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Where art meets architecture meets fashion"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Sforzesco Castle & Sempione Park","description":"15th-century fortress housing Michelangelo''s last sculpture, then relax in the park behind it.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Castello Sforzesco"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"History and green space in one visit"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Coffee at Taglio","description":"Milan''s coolest specialty coffee bar — single-origin espresso, pastries, designer vibes.","category":"food","estimated_cost_per_person":5,"duration_minutes":30,"location":{"name":"Taglio, Via Vigevano"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Milan takes its coffee very seriously"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell Pizza at Dry Milano","description":"Gourmet pizza and craft cocktails — the perfect Milan combination for a final night.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Dry Milano, Via Solferino"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Pizza + cocktails = perfect farewell"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Nightcap at The Spirit","description":"Speakeasy cocktail bar where every drink is made with a spirit chosen by personality quiz.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"The Spirit, Via Quintino Sella"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"End with a uniquely Milanese cocktail experience"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Spin 3 times on the bull''s testicles mosaic in the Galleria floor — Milanese tradition says it brings good luck.","location":"Galleria Vittorio Emanuele II"},
      {"day_number":2,"tip":"Book Last Supper tickets at least 2 months ahead at the official site — third-party markup is insane.","location":"Santa Maria delle Grazie"},
      {"day_number":3,"tip":"Skip the tourist gelato near the Duomo — Ciacco on Via Spadari is 2 blocks away and 10x better.","location":"Via Spadari"},
      {"day_number":4,"tip":"Bar Luce inside Fondazione Prada was designed by Wes Anderson — it looks exactly like a movie set and the coffee is great.","location":"Fondazione Prada"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '5-day Milan trip: San Siro stadium, AC Milan/Inter match, Da Vinci''s Last Supper, Lake Como, fashion district, and incredible Italian food.',
  ARRAY['milan', 'italy', 'europe', 'soccer', 'sports', 'fashion', 'food', 'art']
);
RAISE NOTICE 'Milan soccer trip inserted';
END $$;
