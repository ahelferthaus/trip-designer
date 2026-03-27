-- Seed: Lisbon Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Lisbon: Benfica, Fado & Pastel de Nata',
  'Lisbon, Portugal',
  '2026-06-12', '2026-06-17', '1234',
  '{"destination":{"name":"Lisbon, Portugal"},"start_date":"2026-06-12","end_date":"2026-06-17","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Lisbon: Benfica, Fado & Pastel de Nata",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-06-12","day_number":1,"title":"Alfama & Benfica",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Estádio da Luz Tour","description":"Tour Benfica''s 65,000-seat cathedral of football — museum, eagle enclosure, pitch access.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Estádio da Luz"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Home of Portugal''s most successful club"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Pastéis de Belém","description":"The original pastel de nata bakery since 1837 — warm custard tarts dusted with cinnamon.","category":"food","estimated_cost_per_person":5,"duration_minutes":30,"location":{"name":"Pastéis de Belém, Belém"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The world''s most famous pastry"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Alfama Walking Tour","description":"Wander Lisbon''s oldest neighborhood — narrow alleys, tile facades, São Jorge Castle views.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Alfama"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The soul of Lisbon"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Tram 28 Ride","description":"Iconic yellow tram rattling through the historic hills — window-seat views of Lisbon''s best neighborhoods.","category":"transport","estimated_cost_per_person":3,"duration_minutes":45,"location":{"name":"Tram 28 route"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most scenic public transport ride in Europe"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Fado Show in Alfama","description":"Intimate fado performance with dinner — the haunting soul music of Portugal, UNESCO heritage.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":120,"location":{"name":"Mesa de Frades, Alfama"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fado is Lisbon''s emotional heartbeat"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Sunset at Miradouro da Graça","description":"Red-tiled rooftops stretching to the river — bring a Super Bock and watch the sun set.","category":"attraction","estimated_cost_per_person":2,"duration_minutes":60,"location":{"name":"Miradouro da Graça"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Lisbon''s best sunset viewpoint"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-06-13","day_number":2,"title":"Belém & Sporting",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Tower of Belém","description":"16th-century fortress on the Tagus river — symbol of Portugal''s Age of Discovery.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"Torre de Belém"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Iconic Lisbon landmark"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Jerónimos Monastery","description":"Stunning Manueline gothic masterpiece — where Vasco da Gama is buried.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"Mosteiro dos Jerónimos"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Portugal''s most impressive monument"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Sporting CP Museum & Stadium","description":"Tour the home of Sporting Lisbon — where Cristiano Ronaldo started his career.","category":"attraction","estimated_cost_per_person":12,"duration_minutes":75,"location":{"name":"Estádio José Alvalade"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Where Ronaldo was discovered"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Time Out Market Lunch","description":"Lisbon''s best chefs under one roof — seafood, steak, pastries, wine, and cocktails.","category":"food","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"Time Out Market, Cais do Sodré"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The ultimate Lisbon food hall"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Benfica Match at Estádio da Luz","description":"65,000 Benfiquistas in red — flares, eagle mascot, and incredible atmosphere.","category":"adventure","estimated_cost_per_person":30,"duration_minutes":150,"location":{"name":"Estádio da Luz"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Portuguese football passion at its peak"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Ginjinha Tasting in Rossio","description":"Cherry liqueur shots from tiny hole-in-the-wall bars — Lisbon''s signature drink.","category":"food","estimated_cost_per_person":3,"duration_minutes":30,"location":{"name":"A Ginjinha, Rossio"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"€1.50 for a shot of liquid Lisbon"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-06-14","day_number":3,"title":"Sintra Day Trip",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Sintra Day Trip — Pena Palace","description":"Fairytale hilltop palace in rainbow colors — surrounded by misty forests. 40 min train from Lisbon.","category":"adventure","estimated_cost_per_person":14,"duration_minutes":360,"location":{"name":"Palácio da Pena, Sintra"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of Europe''s most romantic palaces"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"LX Factory","description":"Creative hub in a former industrial complex — indie shops, bookshops, brunch, street art.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"LX Factory, Alcântara"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Lisbon''s hipster headquarters"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Quinta da Regaleira","description":"Gothic mansion with underground tunnels, inverted tower, and mystic gardens.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Quinta da Regaleira, Sintra"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most mysterious place in Portugal"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Seafood at Cervejaria Ramiro","description":"Lisbon''s legendary seafood restaurant — giant prawns, percebes (barnacles), steak sandwich to finish.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"Cervejaria Ramiro, Intendente"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The best seafood meal you''ll ever have"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Bar Crawl in Bairro Alto","description":"Lisbon''s party district — dozens of tiny bars spilling into the streets. Cheap drinks, good energy.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Bairro Alto"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Lisbon nightlife doesn''t start until midnight"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Rooftop at PARK Bar","description":"Secret rooftop bar on top of a parking garage — panoramic views, DJ sets, cocktails.","category":"food","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"PARK Bar, Bairro Alto"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Lisbon''s coolest hidden rooftop"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-06-15","day_number":4,"title":"Tiles, Markets & Farewell",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"National Tile Museum","description":"Stunning azulejo collection spanning 500 years — housed in a former convent.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":90,"location":{"name":"Museu Nacional do Azulejo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Portugal''s tile art tradition is unique in the world"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Brunch at Dear Breakfast","description":"Lisbon''s trendiest brunch — shakshuka, açaí, avocado toast in a pink-tiled space.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Dear Breakfast, Príncipe Real"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Instagram-perfect Lisbon brunch"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Príncipe Real Gardens & Shops","description":"Leafy square with a giant cedar tree canopy, indie boutiques, and the Embaixada concept store.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Príncipe Real"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Lisbon''s most elegant neighborhood"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Benfica Official Store","description":"Pick up an Águias jersey, scarf, or Eusébio memorabilia.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Loja Benfica, Colombo"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Football souvenirs for the collection"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell Dinner at Taberna da Rua das Flores","description":"Tiny, booking-essential tapas bar — market-fresh ceviche, pork cheeks, local wine.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Taberna da Rua das Flores"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Lisbon''s most sought-after table"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Sunset at Miradouro de Santa Luzia","description":"Bougainvillea-draped terrace overlooking Alfama and the Tagus — the postcard view of Lisbon.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Miradouro de Santa Luzia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most photogenic spot in Lisbon"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The Feira da Ladra flea market (Tuesday/Saturday) near Alfama has incredible vintage finds for almost nothing.","location":"Campo de Santa Clara"},
      {"day_number":2,"tip":"At Time Out Market, skip the queues at the famous stalls and try Henrique Sá Pessoa''s counter instead — same quality, shorter wait.","location":"Time Out Market"},
      {"day_number":3,"tip":"In Sintra, arrive at Pena Palace at opening (9:30am) — by 11am the crowds are unbearable.","location":"Pena Palace, Sintra"},
      {"day_number":4,"tip":"Walk through the narrow streets behind Rua das Flores — every other building has incredible hand-painted tile facades that most tourists miss.","location":"Chiado side streets"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '5-day Lisbon trip: Benfica stadium & match, Sintra palaces, fado music, pastéis de nata, and rooftop bars.',
  ARRAY['lisbon', 'portugal', 'europe', 'soccer', 'sports', 'food', 'culture', 'budget-friendly']
);
RAISE NOTICE 'Lisbon soccer trip inserted';
END $$;
