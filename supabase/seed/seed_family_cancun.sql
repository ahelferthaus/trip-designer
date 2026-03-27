-- Seed: Cancun Family Spring Break
DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
VALUES (
  'Cancun: Beach, Ruins & Family Adventure',
  'Cancun, Mexico',
  '2026-03-21', '2026-03-28', '1234',
  '{"destination":{"name":"Cancun, Mexico"},"start_date":"2026-03-21","end_date":"2026-03-28","group_members":[{"name":"Mom","type":"adult"},{"name":"Dad","type":"adult"},{"name":"Kid","type":"child","age":9}],"budget_level":"mid","vibes":["family","relaxed","adventure"]}'::jsonb,
  '{
    "title":"Cancun: Beach, Ruins & Family Adventure",
    "days":[
      {"id":"day-1","trip_id":"trip-1","date":"2026-03-21","day_number":1,"title":"Arrival & Hotel Zone Beach",
        "slots":[
          {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Hotel Zone Beach Day","description":"Settle in and hit the powdery white sand — turquoise Caribbean water, beach umbrellas, snorkel gear rental.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Playa Delfines, Hotel Zone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Caribbean beach you''ve been dreaming about"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Brunch at Puerto Madero","description":"Seafood restaurant overlooking the lagoon — huevos rancheros, fresh ceviche, tropical juices.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Puerto Madero, Hotel Zone"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Start the trip with lagoon views and fresh seafood"}
          ]},
          {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Interactive Aquarium Cancun","description":"Kids can swim with dolphins, touch stingrays, and walk through a shark tunnel.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":120,"location":{"name":"Interactive Aquarium, La Isla Shopping Village"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Perfect rainy-day backup or afternoon activity for kids"},
            {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"Snorkeling at Punta Nizuc","description":"Shallow reef right off the hotel zone — tropical fish, sea fans, and the underwater museum sculptures.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":90,"location":{"name":"Punta Nizuc"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Easy snorkeling with amazing visibility"}
          ]},
          {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
            {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Tacos at Tacos Rigo","description":"No-frills taco stand beloved by locals and tourists — al pastor, carne asada, grilled fish tacos.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Tacos Rigo, Hotel Zone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best tacos in the Hotel Zone, hands down"},
            {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Sunset Dinner Cruise","description":"Catamaran cruise on the lagoon with buffet dinner, music, and Caribbean sunset views.","category":"food","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"Cancun Lagoon"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Romantic and fun for the whole family"}
          ]}
        ]
      },
      {"id":"day-2","trip_id":"trip-1","date":"2026-03-22","day_number":2,"title":"Xcaret Park Full Day",
        "slots":[
          {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
            {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Xcaret Eco Park — Morning","description":"Underground rivers, snorkeling cove, butterfly pavilion, sea turtle nursery — Mexico''s best eco-park.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":240,"location":{"name":"Xcaret Park"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The #1 family attraction in the Riviera Maya"},
            {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Cenote Ik Kil Swimming","description":"Swim in a sacred Mayan cenote — a natural sinkhole with hanging vines and crystal blue water.","category":"adventure","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Cenote Ik Kil, near Chichén Itzá"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Swimming in a cenote is a once-in-a-lifetime experience"}
          ]},
          {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Xcaret Aviary & Wildlife","description":"Walk through a massive aviary with toucans, macaws, flamingos. Plus jaguars, monkeys, and manatees.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Xcaret Park"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Kids love the animal encounters"},
            {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Lunch at Xcaret (included)","description":"Multiple restaurants inside the park — Mexican buffet, seafood, or pizza for picky eaters.","category":"food","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Xcaret Park restaurants"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Included with all-inclusive admission"}
          ]},
          {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
            {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"Xcaret México Espectacular Night Show","description":"300+ performers, flying Mayan warriors, mariachi, traditional dance — the best show in the Riviera.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Gran Tlachco Theater, Xcaret"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Spectacular cultural show — the perfect ending to an Xcaret day"},
            {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Dinner at La Habichuela Sunset","description":"Upscale Mayan-Mexican cuisine in a garden setting — cochinita pibil, lobster, and chocolate fondant.","category":"food","estimated_cost_per_person":35,"duration_minutes":90,"location":{"name":"La Habichuela Sunset, Hotel Zone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Cancun''s finest restaurant"}
          ]}
        ]
      },
      {"id":"day-3","trip_id":"trip-1","date":"2026-03-23","day_number":3,"title":"Chichén Itzá Day Trip",
        "slots":[
          {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
            {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Chichén Itzá — Wonder of the World","description":"Early morning visit to the Mayan pyramid El Castillo — arrive before 10am to beat the heat and crowds.","category":"attraction","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Chichén Itzá"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One of the New Seven Wonders of the World"},
            {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Isla Mujeres Day Trip","description":"Ferry to the charming island — golf cart rental, Playa Norte (Mexico''s best beach), sea turtle center.","category":"adventure","estimated_cost_per_person":20,"duration_minutes":360,"location":{"name":"Isla Mujeres"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Paradise island 20 minutes from Cancun"}
          ]},
          {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
            {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Cenote Swim Near Chichén Itzá","description":"Cool off in a sacred cenote after the ruins — Cenote Suytun or Cenote Ik Kil are magical.","category":"adventure","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Cenote near Chichén Itzá"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The perfect post-ruins cooldown"},
            {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Playa del Carmen Stroll","description":"Walk 5th Avenue — shops, ice cream, street performers, beach access every few blocks.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Quinta Avenida, Playa del Carmen"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"More charming and walkable than Cancun''s Hotel Zone"}
          ]},
          {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
            {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Mayan Village Dinner Experience","description":"Traditional Mayan meal cooked over open fire — tamales, poc chuc, handmade tortillas.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"Near Valladolid"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Authentic cultural dining experience"},
            {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Pizza Night at Resort","description":"Sometimes families just need a chill pizza night by the pool. No shame.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Hotel restaurant"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Keep it easy after a long day trip"}
          ]}
        ]
      }
    ],
    "hiddenGems":[
      {"day_number":1,"tip":"Playa Delfines has the iconic CANCUN sign letters — go at sunrise for photos with zero people in the shot.","location":"Playa Delfines"},
      {"day_number":2,"tip":"At Xcaret, do the underground river float FIRST when the park opens — it''s magical with no crowds.","location":"Xcaret underground rivers"},
      {"day_number":3,"tip":"Hire a private guide at Chichén Itzá (they wait at the entrance) — $40 for 2 hours of stories you''d never learn from a sign.","location":"Chichén Itzá entrance"}
    ]
  }'::jsonb,
  'VYBR', uid, true, 'public',
  '7-day Cancun family spring break: Xcaret eco-park, Chichén Itzá ruins, cenote swimming, Caribbean beaches, and authentic Mexican cuisine.',
  ARRAY['cancun', 'mexico', 'family', 'spring-break', 'beach', 'ruins', 'adventure']
);
RAISE NOTICE 'Cancun family spring break inserted';
END $$;
