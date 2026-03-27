-- Seed: Soccer/Sports Trips (8 trips)
-- Run this in Supabase SQL Editor
-- Replace 'YOUR_USER_ID' with your actual auth.users id

DO $$
DECLARE
  uid uuid;
BEGIN
  -- Get the first user (or change to your specific user ID)
  SELECT id INTO uid FROM auth.users LIMIT 1;
  IF uid IS NULL THEN
    RAISE EXCEPTION 'No users found. Sign up first.';
  END IF;

  -- 1. Barcelona Soccer Trip
  INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags)
  VALUES (
    'Barcelona Football & Culture',
    'Barcelona, Spain',
    '2026-05-02', '2026-05-07',
    '1234',
    '{"destination":{"name":"Barcelona, Spain"},"start_date":"2026-05-02","end_date":"2026-05-07","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["culture","food"],"travel_theme":"sports-soccer"}'::jsonb,
    '{
      "title": "Barcelona Football & Culture",
      "days": [
        {
          "id": "day-1", "trip_id": "trip-1", "date": "2026-05-02", "day_number": 1, "title": "Arrival & Gothic Quarter",
          "slots": [
            {"id":"slot-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
              {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Explore the Gothic Quarter","description":"Wander through medieval streets, visit the Barcelona Cathedral and Plaça Reial.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Barri Gòtic"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Perfect introduction to Barcelona''s historic heart"},
              {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"La Boqueria Market Breakfast","description":"Iconic covered market with fresh juices, jamón, seafood tapas, and local produce.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Mercat de la Boqueria"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Best food market in Barcelona"}
            ]},
            {"id":"slot-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
              {"id":"opt-1-2-1","slot_id":"slot-1-2","title":"Camp Nou Stadium Tour","description":"Tour FC Barcelona''s legendary stadium, museum with trophies, and walk on the pitch.","category":"attraction","estimated_cost_per_person":28,"duration_minutes":120,"location":{"name":"Camp Nou"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Must-visit for any football fan"},
              {"id":"opt-1-2-2","slot_id":"slot-1-2","title":"FC Barcelona Museum & Megastore","description":"Deep dive into Barça history with interactive exhibits, Messi memorabilia, and the official store.","category":"attraction","estimated_cost_per_person":28,"duration_minutes":90,"location":{"name":"Museu del FC Barcelona"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Football heritage at its finest"}
            ]},
            {"id":"slot-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
              {"id":"opt-1-3-1","slot_id":"slot-1-3","title":"Tapas Crawl in El Born","description":"Hit 3-4 tapas bars in the trendy El Born neighborhood — patatas bravas, croquetas, pan con tomate.","category":"food","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"El Born"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic Barcelona evening experience"},
              {"id":"opt-1-3-2","slot_id":"slot-1-3","title":"Rooftop Drinks at Hotel Pulitzer","description":"Cocktails with panoramic views over the city as the sun sets.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Hotel Pulitzer Terrace"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Perfect way to end day one"}
            ]}
          ]
        },
        {
          "id": "day-2", "trip_id": "trip-1", "date": "2026-05-03", "day_number": 2, "title": "Gaudí & Matchday",
          "slots": [
            {"id":"slot-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
              {"id":"opt-2-1-1","slot_id":"slot-2-1","title":"Sagrada Família","description":"Gaudí''s masterpiece basilica — book tickets in advance for the tower climb.","category":"attraction","estimated_cost_per_person":26,"duration_minutes":120,"location":{"name":"Basílica de la Sagrada Família"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Barcelona''s most iconic landmark"},
              {"id":"opt-2-1-2","slot_id":"slot-2-1","title":"Park Güell Morning Visit","description":"Gaudí''s colorful mosaic park with stunning city views. Go early to beat crowds.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":90,"location":{"name":"Park Güell"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Gaudí''s whimsical outdoor masterpiece"}
            ]},
            {"id":"slot-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
              {"id":"opt-2-2-1","slot_id":"slot-2-2","title":"Pre-Match Atmosphere at Sports Bar","description":"Join local fans at a penya bar near the stadium, soak up the matchday atmosphere.","category":"food","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Bar Oviso, near Camp Nou"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Authentic pre-match experience with locals"},
              {"id":"opt-2-2-2","slot_id":"slot-2-2","title":"Casa Batlló","description":"Gaudí''s surreal apartment building on Passeig de Gràcia with immersive AR experience.","category":"attraction","estimated_cost_per_person":35,"duration_minutes":75,"location":{"name":"Casa Batlló"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Stunning modernist architecture"}
            ]},
            {"id":"slot-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
              {"id":"opt-2-3-1","slot_id":"slot-2-3","title":"FC Barcelona Match at Camp Nou","description":"Experience the roar of 99,000 fans at one of the world''s greatest football stadiums.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":150,"location":{"name":"Camp Nou"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The ultimate football experience"},
              {"id":"opt-2-3-2","slot_id":"slot-2-3","title":"Flamenco Show at Tablao Cordobes","description":"Passionate flamenco performance on La Rambla with dinner option.","category":"attraction","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Tablao Flamenco Cordobes"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Iconic Spanish cultural experience"}
            ]}
          ]
        },
        {
          "id": "day-3", "trip_id": "trip-1", "date": "2026-05-04", "day_number": 3, "title": "Beach & Barceloneta",
          "slots": [
            {"id":"slot-3-1","day_id":"day-3","slot_type":"morning","status":"open","options":[
              {"id":"opt-3-1-1","slot_id":"slot-3-1","title":"Barceloneta Beach Morning","description":"Swim, sunbathe, and people-watch at Barcelona''s most famous beach.","category":"rest","estimated_cost_per_person":0,"duration_minutes":150,"location":{"name":"Platja de la Barceloneta"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Relaxed beach vibes after an intense matchday"},
              {"id":"opt-3-1-2","slot_id":"slot-3-1","title":"Brunch at Federal Café","description":"Australian-style brunch with avocado toast, smoothie bowls, and excellent coffee.","category":"food","estimated_cost_per_person":18,"duration_minutes":60,"location":{"name":"Federal Café, Gòtic"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Fuel up for a beach day"}
            ]},
            {"id":"slot-3-2","day_id":"day-3","slot_type":"afternoon","status":"open","options":[
              {"id":"opt-3-2-1","slot_id":"slot-3-2","title":"Seafood Paella at La Mar Salada","description":"Authentic paella with a view of the Mediterranean, right on the Barceloneta boardwalk.","category":"food","estimated_cost_per_person":25,"duration_minutes":90,"location":{"name":"La Mar Salada"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Paella by the sea — doesn''t get more Barcelona"},
              {"id":"opt-3-2-2","slot_id":"slot-3-2","title":"Picasso Museum","description":"Extensive collection of Picasso''s early works in five medieval palaces.","category":"attraction","estimated_cost_per_person":12,"duration_minutes":90,"location":{"name":"Museu Picasso"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class art in a beautiful setting"}
            ]},
            {"id":"slot-3-3","day_id":"day-3","slot_type":"evening","status":"open","options":[
              {"id":"opt-3-3-1","slot_id":"slot-3-3","title":"Sunset at Bunkers del Carmel","description":"Locals'' secret viewpoint with 360° panoramic views of the city. Bring wine.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Bunkers del Carmel"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Best sunset spot in Barcelona"},
              {"id":"opt-3-3-2","slot_id":"slot-3-3","title":"Dinner at Can Paixano (La Xampanyeria)","description":"Standing-room cava bar with amazing bocadillos. Chaotic, fun, and cheap.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Can Paixano, Barceloneta"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Beloved local institution"}
            ]}
          ]
        },
        {
          "id": "day-4", "trip_id": "trip-1", "date": "2026-05-05", "day_number": 4, "title": "Montjuïc & Olympic Legacy",
          "slots": [
            {"id":"slot-4-1","day_id":"day-4","slot_type":"morning","status":"open","options":[
              {"id":"opt-4-1-1","slot_id":"slot-4-1","title":"Montjuïc Cable Car & Castle","description":"Ride the cable car for aerial views, explore the 17th-century fortress.","category":"attraction","estimated_cost_per_person":13,"duration_minutes":120,"location":{"name":"Castell de Montjuïc"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Panoramic city views and history"},
              {"id":"opt-4-1-2","slot_id":"slot-4-1","title":"Olympic Stadium & Museum","description":"Visit the 1992 Olympic venues including the stadium, diving pool, and sports museum.","category":"attraction","estimated_cost_per_person":6,"duration_minutes":90,"location":{"name":"Estadi Olímpic Lluís Companys"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Sports history meets Barcelona"}
            ]},
            {"id":"slot-4-2","day_id":"day-4","slot_type":"afternoon","status":"open","options":[
              {"id":"opt-4-2-1","slot_id":"slot-4-2","title":"El Raval Street Art Walk","description":"Discover Barcelona''s edgy side with murals, galleries, and the MACBA skate plaza.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"El Raval"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Barcelona''s creative counterculture"},
              {"id":"opt-4-2-2","slot_id":"slot-4-2","title":"Vermouth Hour at Bar Calders","description":"Join the local tradition of pre-lunch vermouth with olives and conservas.","category":"food","estimated_cost_per_person":10,"duration_minutes":60,"location":{"name":"Bar Calders, Sant Antoni"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Quintessential Barcelona ritual"}
            ]},
            {"id":"slot-4-3","day_id":"day-4","slot_type":"evening","status":"open","options":[
              {"id":"opt-4-3-1","slot_id":"slot-4-3","title":"Magic Fountain Light Show","description":"Free choreographed water, light, and music show at the base of Montjuïc.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":45,"location":{"name":"Font Màgica de Montjuïc"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Spectacular free entertainment"},
              {"id":"opt-4-3-2","slot_id":"slot-4-3","title":"Dinner at Cervecería Catalana","description":"Upscale tapas institution — order the mini hamburgers, fried artichokes, and Iberian ham.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Cervecería Catalana, Eixample"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Top-tier tapas experience"}
            ]}
          ]
        },
        {
          "id": "day-5", "trip_id": "trip-1", "date": "2026-05-06", "day_number": 5, "title": "Day Trip & Farewell",
          "slots": [
            {"id":"slot-5-1","day_id":"day-5","slot_type":"morning","status":"open","options":[
              {"id":"opt-5-1-1","slot_id":"slot-5-1","title":"Montserrat Day Trip","description":"Take the rack railway to the stunning mountain monastery with panoramic views.","category":"adventure","estimated_cost_per_person":25,"duration_minutes":240,"location":{"name":"Montserrat Monastery"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Breathtaking day trip from Barcelona"},
              {"id":"opt-5-1-2","slot_id":"slot-5-1","title":"Gràcia Neighborhood Stroll","description":"Charming village-like neighborhood with indie shops, cafés, and Plaça del Sol.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Gràcia"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"See how locals actually live"}
            ]},
            {"id":"slot-5-2","day_id":"day-5","slot_type":"afternoon","status":"open","options":[
              {"id":"opt-5-2-1","slot_id":"slot-5-2","title":"Shopping on Passeig de Gràcia","description":"Barcelona''s premier shopping boulevard with Zara flagship, luxury brands, and Gaudí buildings.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Passeig de Gràcia"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Architecture and shopping in one"},
              {"id":"opt-5-2-2","slot_id":"slot-5-2","title":"Craft Beer at BierCaB","description":"30+ rotating craft taps in a stylish Eixample bar.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"BierCaB, Eixample"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Barcelona''s craft beer scene is thriving"}
            ]},
            {"id":"slot-5-3","day_id":"day-5","slot_type":"evening","status":"open","options":[
              {"id":"opt-5-3-1","slot_id":"slot-5-3","title":"Farewell Dinner at 7 Portes","description":"Historic restaurant since 1836 — famous for rice dishes and seafood. Hemingway dined here.","category":"food","estimated_cost_per_person":40,"duration_minutes":120,"location":{"name":"7 Portes"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Grand farewell at a Barcelona institution"},
              {"id":"opt-5-3-2","slot_id":"slot-5-3","title":"Cocktails at Paradiso","description":"World-famous speakeasy hidden behind a pastrami shop. Enter through the fridge door.","category":"food","estimated_cost_per_person":18,"duration_minutes":90,"location":{"name":"Paradiso, El Born"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"One of the world''s best cocktail bars"}
            ]}
          ]
        }
      ],
      "hiddenGems": [
        {"day_number":1,"tip":"Skip the tourist restaurants on La Rambla — walk one block into the side streets for half the price and twice the quality.","location":"Streets off La Rambla"},
        {"day_number":2,"tip":"After the match, follow the crowd to the nearby bars — the post-match atmosphere is electric and the drinks are cheap.","location":"Bars near Camp Nou"},
        {"day_number":3,"tip":"Walk to the far end of Barceloneta beach past the W Hotel — it''s quieter and the chiringuitos (beach bars) are better.","location":"Far end of Barceloneta"},
        {"day_number":4,"tip":"The free Joan Miró Foundation terrace has incredible Montjuïc views without the museum entry fee.","location":"Fundació Joan Miró terrace"},
        {"day_number":5,"tip":"At Montserrat, take the Sant Joan funicular to the highest viewpoint — most tourists skip it but the views are unreal.","location":"Sant Joan viewpoint, Montserrat"}
      ]
    }'::jsonb,
    'VYBR',
    uid,
    true,
    'public',
    '5-day Barcelona trip mixing football culture with Gaudí architecture, beaches, and incredible food. Camp Nou tour and match day included.',
    ARRAY['barcelona', 'spain', 'europe', 'soccer', 'sports', 'culture', 'food']
  );

  RAISE NOTICE 'Barcelona soccer trip inserted';

END $$;
