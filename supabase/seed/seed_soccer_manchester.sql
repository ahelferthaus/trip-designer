-- Seed: Manchester Soccer Trip
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Manchester: Football Capital',
  'Manchester, England',
  '2026-05-15', '2026-05-19', '1234',
  '{"destination":{"name":"Manchester, England"},"start_date":"2026-05-15","end_date":"2026-05-19","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
  '{
    "title":"Manchester: Football Capital",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-05-15","day_number":1,"title":"Old Trafford & City Centre",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Old Trafford Stadium Tour","description":"Tour the Theatre of Dreams — walk through the tunnel, sit in the dugout, visit the museum with the Treble trophy.","category":"attraction","estimated_cost_per_person":28,"duration_minutes":120,"location":{"name":"Old Trafford"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Iconic home of Manchester United"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Full English at Annie''s","description":"Proper Northern English breakfast — bacon, eggs, beans, black pudding, toast, and builder''s tea.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Annie''s, Manchester Royal Exchange"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Start the day like a local"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"National Football Museum","description":"Free museum in the Urbis building — interactive exhibits, Hall of Fame, and the original rules of football.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"National Football Museum, Cathedral Gardens"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The definitive museum of the beautiful game"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Northern Quarter Street Food","description":"Manchester''s creative hub — graffiti walls, indie shops, coffee at Takk, lunch at Mackie Mayor food hall.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Northern Quarter"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Manchester''s coolest neighborhood"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Curry Mile Dinner","description":"Rusholme''s legendary strip of South Asian restaurants — order a proper Manchester curry.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Wilmslow Road, Rusholme"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s curry culture is legendary"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Drinks at The Refuge","description":"Stunning cocktail bar in a former insurance palace — tiled floors, grand staircase, DJ sets.","category":"food","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"The Refuge, Oxford Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s most beautiful bar"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-05-16","day_number":2,"title":"Etihad & Music Heritage",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Etihad Stadium Tour","description":"Tour Manchester City''s home — dressing rooms, tunnel, pitchside. See the Premier League trophies.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Etihad Stadium"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"City''s rise to the top of English football"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Breakfast at Federal Café","description":"Aussie-style brunch — smashed avo, granola bowls, flat whites in a bright corner spot.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Federal Café, NQ"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best brunch in Manchester"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Manchester Music Heritage Walk","description":"Self-guided walk past Factory Records, Salford Lads Club (The Smiths), and the Haçienda site.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"City Centre to Salford"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Oasis, The Smiths, Joy Division — Manchester is music history"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Science & Industry Museum","description":"Free museum in the world''s oldest railway station — Manchester invented the modern world.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Science and Industry Museum"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s industrial revolution heritage"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Live Music at Band on the Wall","description":"Legendary venue since 1930 — catch jazz, world music, or indie acts in an intimate setting.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Band on the Wall, Swan Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s live music scene is world-class"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Dinner at Hawksmoor","description":"Britain''s best steakhouse chain — dry-aged cuts, bone marrow, sticky toffee pudding.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Hawksmoor, Deansgate"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Treat yourself to the best steak in Manchester"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-05-17","day_number":3,"title":"Match Day & Salford",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"MediaCityUK & The Lowry","description":"Walk the futuristic BBC/ITV complex at Salford Quays, visit the Lowry gallery (free).","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"MediaCityUK, Salford Quays"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Modern Manchester meets art"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Imperial War Museum North","description":"Daniel Libeskind''s striking building — immersive exhibits on conflict from WWI to present.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"IWM North, Salford Quays"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Powerful museum in a stunning building"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Pre-Match Pint at The Bishops Blaize","description":"The closest pub to Old Trafford — packed with fans, singing, scarves on every wall.","category":"food","estimated_cost_per_person":8,"duration_minutes":90,"location":{"name":"The Bishops Blaize, Chester Road"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The definitive pre-match United pub"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Street Food at GRUB","description":"Rotating street food vendors under railway arches — burgers, Thai, tacos, craft beer.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"GRUB, Red Bank"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Manchester''s best street food market"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Manchester United Match at Old Trafford","description":"76,000 fans singing Glory Glory Man United — the atmosphere at the Theatre of Dreams is unmatched.","category":"adventure","estimated_cost_per_person":65,"duration_minutes":150,"location":{"name":"Old Trafford"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The biggest football experience in England"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Comedy Night at The Comedy Store","description":"Top stand-up acts in Manchester''s premier comedy club in Deansgate Locks.","category":"attraction","estimated_cost_per_person":18,"duration_minutes":120,"location":{"name":"The Comedy Store, Deansgate Locks"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s comedy scene is thriving"}
          ]}
        ]
      },
      {"id":"day-4","trip_id":"trip-1","date":"2026-05-18","day_number":4,"title":"Farewell & Hidden Gems",
        "slots":[
          {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
            {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"John Rylands Library","description":"Gothic masterpiece — one of the most beautiful libraries in the world. Free entry.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"John Rylands Library, Deansgate"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Jaw-dropping neo-Gothic architecture"},
            {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Manchester Art Gallery","description":"Free gallery with Pre-Raphaelites, contemporary art, and rotating exhibitions.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Manchester Art Gallery, Mosley Street"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class art, completely free"}
          ]},
          {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"Afflecks Palace Shopping","description":"Four floors of indie stalls — vintage clothes, vinyl records, Manchester merch, tattoos.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Afflecks, Northern Quarter"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Manchester''s quirkiest shopping experience"},
            {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Lunch at Rudy''s Pizza","description":"Neapolitan pizza so good there''s always a queue. The Margherita is perfect.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"Rudy''s, Ancoats"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best pizza in Manchester, hands down"}
          ]},
          {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
            {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Farewell Drinks at Cloud 23","description":"Cocktails on the 23rd floor of the Hilton — floor-to-ceiling views of the Manchester skyline.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Cloud 23, Beetham Tower"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"End the trip with the best view in the city"},
            {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Farewell Fish & Chips at Arndale Market","description":"Proper chippy tea — battered cod, mushy peas, curry sauce, and a can of Vimto.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Arndale Market"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Can''t leave Manchester without a proper chippy"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"The National Football Museum has a free kick challenge — you can test your technique on a real-size goal with sensors.","location":"National Football Museum"},
      {"day_number":2,"tip":"Walk past 5 Cavendish Ave in Salford — it''s the house on The Smiths'' ''The Queen Is Dead'' album cover.","location":"Salford"},
      {"day_number":3,"tip":"The Matt Busby statue and Munich Clock at Old Trafford are deeply moving — take a moment before the match.","location":"Old Trafford"},
      {"day_number":4,"tip":"Ancoats is Manchester''s coolest emerging neighborhood — former mills turned into craft breweries, coffee shops, and galleries.","location":"Ancoats"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '4-day Manchester trip: Old Trafford, Etihad, National Football Museum, live music scene, Northern Quarter food, and matchday atmosphere.',
  ARRAY['manchester', 'england', 'europe', 'soccer', 'sports', 'music', 'food']
);
RAISE NOTICE 'Manchester soccer trip inserted';
END $$;
