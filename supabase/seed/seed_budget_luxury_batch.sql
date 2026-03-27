-- Seed: Budget + Luxury trips — ALL in one file
-- Paste into Supabase SQL Editor and run once

DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;

-- === BUDGET TRIPS (under $1000) ===

-- 1. Lisbon Budget
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Lisbon on a Budget: Pastéis, Trams & Fado', 'Lisbon, Portugal', '2026-06-05', '2026-06-10', '1234',
  '{"destination":{"name":"Lisbon, Portugal"},"start_date":"2026-06-05","end_date":"2026-06-10","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["culture","food"]}'::jsonb,
  '{"title":"Lisbon on a Budget","days":[
    {"id":"day-1","trip_id":"t","date":"2026-06-05","day_number":1,"title":"Alfama & Tram 28","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Alfama Walking Tour (Free)","description":"Join a free walking tour through Lisbon''s oldest neighborhood — tips only.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":150,"location":{"name":"Alfama"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Free tours by locals — the best way to learn a city on a budget"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Pastéis de Nata at Manteigaria","description":"Custard tarts for €1.10 each — locals say these rival Pastéis de Belém.","category":"food","estimated_cost_per_person":3,"duration_minutes":15,"location":{"name":"Manteigaria, Chiado"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"World-class pastry for pocket change"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Tram 28 Ride","description":"Iconic yellow tram through the hills — €3 with a day pass. Window seats for the best views.","category":"transport","estimated_cost_per_person":3,"duration_minutes":45,"location":{"name":"Tram 28 route"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The most scenic public transport ride in Europe for €3"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Miradouro de Santa Luzia (Free)","description":"Bougainvillea-covered terrace with panoramic views of Alfama and the river.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":30,"location":{"name":"Miradouro de Santa Luzia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The best free view in Lisbon"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Ginjinha Shots in Rossio (€1.50)","description":"Cherry liqueur shots from tiny hole-in-the-wall bars — Lisbon''s signature drink.","category":"food","estimated_cost_per_person":3,"duration_minutes":15,"location":{"name":"A Ginjinha, Rossio"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"€1.50 for liquid Lisbon"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Dinner at a Tasca (€10-15)","description":"Traditional Portuguese tavern — grilled fish, bifana sandwiches, house wine by the carafe.","category":"food","estimated_cost_per_person":12,"duration_minutes":60,"location":{"name":"Any tasca in Alfama"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Eat like a local for under €15 including wine"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Lisbon''s miradouros (viewpoints) are all free — there are 10+ across the city. Each one is different and stunning.","location":"Various miradouros"}]}'::jsonb,
  'VYBR', uid, true, 'public', '5-day Lisbon budget trip: Free walking tours, €1 pastéis de nata, tram 28, fado, and dinner for under €15.',
  ARRAY['lisbon', 'portugal', 'europe', 'budget-friendly', 'culture', 'food']
);

-- 2. Bangkok Budget
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Bangkok: Temples, Street Food & $5 Days', 'Bangkok, Thailand', '2026-11-07', '2026-11-14', '1234',
  '{"destination":{"name":"Bangkok, Thailand"},"start_date":"2026-11-07","end_date":"2026-11-14","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["food","culture","adventure"]}'::jsonb,
  '{"title":"Bangkok: Temples, Street Food & $5 Days","days":[
    {"id":"day-1","trip_id":"t","date":"2026-11-07","day_number":1,"title":"Grand Palace & Chinatown","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Grand Palace & Wat Phra Kaew","description":"Thailand''s most sacred temple complex — Emerald Buddha, golden spires, intricate mosaics.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":150,"location":{"name":"Grand Palace"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most dazzling temple complex in Southeast Asia"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Pad Thai at Thip Samai","description":"Bangkok''s most famous pad Thai — wrapped in an egg net, queues around the block. $2.","category":"food","estimated_cost_per_person":2,"duration_minutes":20,"location":{"name":"Thip Samai, Phra Nakhon"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"$2 for the best pad Thai you''ll ever eat"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Wat Pho & Reclining Buddha","description":"46-meter gold reclining Buddha — then get a traditional Thai massage at the on-site school ($10/hr).","category":"attraction","estimated_cost_per_person":5,"duration_minutes":90,"location":{"name":"Wat Pho"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"A giant gold Buddha AND a $10 massage in the same visit"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Chinatown Street Food Walk","description":"Yaowarat Road comes alive at dusk — grilled seafood, mango sticky rice, roasted duck for $1-3 per dish.","category":"food","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Yaowarat Road, Chinatown"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The greatest street food scene on Earth — under $5 for a feast"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Rooftop Bar at Sky Bar (one splurge)","description":"The bar from ''The Hangover Part II'' — cocktails overlooking the Chao Phraya River. $15 for the view of a lifetime.","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Sky Bar, Lebua"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"One cocktail at the world''s most famous rooftop bar — worth the splurge"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Night Market at Rot Fai","description":"Vintage market with street food, live music, retro cars, and local craft beer. Free entry.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Rot Fai Night Market"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Bangkok''s coolest night market — all under $5"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"BTS Skytrain + river boats = $1-2 to get anywhere. Never take a tuk-tuk from a tourist area — they''ll quote 10x the real price.","location":"Bangkok transit"}]}'::jsonb,
  'VYBR', uid, true, 'public', '7-day Bangkok budget trip: Grand Palace, $2 pad Thai, Chinatown street food, temples, and nights out for under $5.',
  ARRAY['bangkok', 'thailand', 'asia', 'budget-friendly', 'food', 'culture', 'street-food']
);

-- 3. Mexico City Budget
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Mexico City: Tacos, Museums & Mezcal', 'Mexico City, Mexico', '2026-10-02', '2026-10-07', '1234',
  '{"destination":{"name":"Mexico City, Mexico"},"start_date":"2026-10-02","end_date":"2026-10-07","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["food","culture"]}'::jsonb,
  '{"title":"Mexico City: Tacos, Museums & Mezcal","days":[
    {"id":"day-1","trip_id":"t","date":"2026-10-02","day_number":1,"title":"Centro Histórico & Chapultepec","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Museo Nacional de Antropología (Free Sundays)","description":"The world''s greatest anthropology museum — Aztec sun stone, Maya jade masks, Olmec heads. Free on Sundays.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Museo Nacional de Antropología, Chapultepec"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Free on Sundays — one of the best museums on the planet"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Chilaquiles at El Cardenal","description":"Classic Mexico City breakfast — chilaquiles verdes with crema, chicken, and fresh tortillas.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"El Cardenal, Centro"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The breakfast that powers Mexico City"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Zócalo & Templo Mayor","description":"The main square, cathedral, and Aztec temple ruins right in the city center.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Zócalo / Templo Mayor"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Standing on an Aztec temple in the middle of a modern megacity"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Tacos al Pastor at El Huequito","description":"Iconic taco stand since 1959 — meat carved from a spinning trompo. $1 each.","category":"food","estimated_cost_per_person":4,"duration_minutes":15,"location":{"name":"El Huequito, Centro"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"$1 tacos that changed the world"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Mezcal Tasting at Bósforo","description":"Speakeasy-style mezcal bar — flights of artisan mezcal, dim lighting, and great music.","category":"food","estimated_cost_per_person":12,"duration_minutes":90,"location":{"name":"Bósforo, Centro"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Discover mezcal beyond the worm — smoky, complex, and cheap in CDMX"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Street Tacos in Roma Norte","description":"Taco stand hop through the hippest neighborhood — suadero, cabeza, lengua. $0.50-1 each.","category":"food","estimated_cost_per_person":5,"duration_minutes":60,"location":{"name":"Roma Norte"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Every corner has a taco stand better than most restaurants"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Mexico City''s museums are free on Sundays — plan accordingly. The Museo de Arte Popular and Palacio de Bellas Artes are also free.","location":"Various museums"}]}'::jsonb,
  'VYBR', uid, true, 'public', '5-day Mexico City budget trip: Free museums on Sundays, $1 tacos al pastor, Aztec ruins, mezcal bars, and Roma Norte.',
  ARRAY['cdmx', 'mexico-city', 'mexico', 'budget-friendly', 'food', 'culture', 'tacos']
);

-- === LUXURY TRIPS ($5000+) ===

-- 4. Maldives Luxury
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Maldives: Overwater Villas & Ocean Bliss', 'Maldives', '2026-12-05', '2026-12-12', '1234',
  '{"destination":{"name":"Maldives"},"start_date":"2026-12-05","end_date":"2026-12-12","group_members":[{"name":"Traveler","type":"adult"},{"name":"Partner","type":"adult"}],"budget_level":"splurge","vibes":["romance","relaxed"]}'::jsonb,
  '{"title":"Maldives: Overwater Villas & Ocean Bliss","days":[
    {"id":"day-1","trip_id":"t","date":"2026-12-05","day_number":1,"title":"Arrival & Villa","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Seaplane Transfer to Resort","description":"30-min seaplane from Malé over turquoise atolls — the views alone are worth the trip.","category":"transport","estimated_cost_per_person":300,"duration_minutes":30,"location":{"name":"Seaplane to resort"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most dramatic airport transfer in the world"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Overwater Villa Check-In","description":"Glass-floor villa over crystal lagoon — direct ocean access from your private deck.","category":"rest","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Overwater villa"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Step out of bed into the Indian Ocean"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Snorkel the House Reef","description":"Swim from your villa over pristine coral — manta rays, reef sharks, sea turtles within meters.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Resort house reef"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class snorkeling without even getting on a boat"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Sunset Dolphin Cruise","description":"Catamaran cruise through the atoll — pods of spinner dolphins leap alongside the boat at golden hour.","category":"adventure","estimated_cost_per_person":80,"duration_minutes":90,"location":{"name":"Resort atoll"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Dolphins in the Indian Ocean sunset — pure magic"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Underwater Restaurant","description":"Dine 5 meters below sea level surrounded by reef fish — multi-course tasting menu with wine pairing.","category":"food","estimated_cost_per_person":200,"duration_minutes":120,"location":{"name":"Underwater restaurant"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Dinner surrounded by fish — the most unique restaurant on Earth"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Private Beach Dinner","description":"Candlelit table on the sand, personal chef, Maldivian-inspired tasting menu under the stars.","category":"food","estimated_cost_per_person":150,"duration_minutes":120,"location":{"name":"Private beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Just you, the ocean, and a private chef under a billion stars"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Ask about the resort''s marine biologist — most luxury resorts offer free guided snorkel tours with a biologist who identifies species.","location":"Resort marine center"}]}'::jsonb,
  'VYBR', uid, true, 'public', '7-day Maldives luxury: Overwater villa, seaplane transfer, underwater restaurant, dolphin cruise, and private beach dinners.',
  ARRAY['maldives', 'asia', 'luxury', 'beach', 'honeymoon', 'romance', 'snorkeling']
);

-- 5. Santorini Luxury
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Santorini: Caldera Sunsets & Cave Hotels', 'Santorini, Greece', '2026-09-12', '2026-09-19', '1234',
  '{"destination":{"name":"Santorini, Greece"},"start_date":"2026-09-12","end_date":"2026-09-19","group_members":[{"name":"Traveler","type":"adult"},{"name":"Partner","type":"adult"}],"budget_level":"splurge","vibes":["romance","food","relaxed"]}'::jsonb,
  '{"title":"Santorini: Caldera Sunsets & Cave Hotels","days":[
    {"id":"day-1","trip_id":"t","date":"2026-09-12","day_number":1,"title":"Oia & Caldera Views","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Cave Hotel with Infinity Pool","description":"White-washed cave suite carved into the caldera cliff — private plunge pool overlooking the volcanic crater.","category":"rest","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Cave hotel, Oia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Wake up in a cave with an infinity pool over the Aegean — surreal"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Greek Breakfast at Karma","description":"Yogurt with honey and walnuts, spanakopita, fresh juice, and Greek coffee on a terrace.","category":"food","estimated_cost_per_person":15,"duration_minutes":30,"location":{"name":"Karma Café, Oia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Breakfast with a caldera view — no filter needed"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Oia to Fira Caldera Hike","description":"10km cliff-edge trail connecting the two main towns — white churches, blue domes, and endless Aegean views.","category":"adventure","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Caldera trail, Oia to Fira"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most scenic hike in Greece — every step is a postcard"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Catamaran Cruise to Hot Springs","description":"Sail around the caldera, swim in volcanic hot springs, snorkel at the Red Beach.","category":"adventure","estimated_cost_per_person":100,"duration_minutes":300,"location":{"name":"Santorini caldera"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sail inside a volcanic crater — the hot springs are surreal"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Oia Sunset at Castle Ruins","description":"The most famous sunset in the world — arrive 1 hour early for a spot at the castle ruins.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Oia Castle ruins"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Hundreds of people applaud when the sun disappears — it''s that good"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Dinner at Ammoudi Bay","description":"Climb 300 steps down to the tiny fishing port — grilled octopus and white wine at the water''s edge.","category":"food","estimated_cost_per_person":40,"duration_minutes":90,"location":{"name":"Ammoudi Bay, below Oia"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most romantic dinner setting in Greece — octopus drying on the line, boats bobbing"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Skip the crowds at Oia sunset — watch from the Fira side instead, or from a caldera restaurant terrace with a glass of Assyrtiko wine.","location":"Fira caldera restaurants"}]}'::jsonb,
  'VYBR', uid, true, 'public', '7-day Santorini luxury: Cave hotel, caldera infinity pool, Oia sunset, catamaran cruise, and seaside Greek dining.',
  ARRAY['santorini', 'greece', 'europe', 'luxury', 'honeymoon', 'romance', 'beach']
);

-- 6. Kyoto Luxury
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Kyoto: Temples, Kaiseki & Cherry Blossoms', 'Kyoto, Japan', '2026-04-04', '2026-04-11', '1234',
  '{"destination":{"name":"Kyoto, Japan"},"start_date":"2026-04-04","end_date":"2026-04-11","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"splurge","vibes":["culture","food","relaxed"]}'::jsonb,
  '{"title":"Kyoto: Temples, Kaiseki & Cherry Blossoms","days":[
    {"id":"day-1","trip_id":"t","date":"2026-04-04","day_number":1,"title":"Temples & Geisha District","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Fushimi Inari Shrine (Sunrise)","description":"10,000 vermillion torii gates winding up the mountain — go at 6am for empty paths and fog.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"Fushimi Inari Taisha"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic image of Japan — free and magical at sunrise"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Matcha & Wagashi at Tsujiri","description":"Ceremonial matcha and traditional sweets in Kyoto''s oldest tea district.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Tsujiri, Uji"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Kyoto invented the tea ceremony"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Kinkaku-ji (Golden Pavilion)","description":"Gold-leaf temple reflected in a mirror pond — one of the most beautiful buildings on Earth.","category":"attraction","estimated_cost_per_person":5,"duration_minutes":60,"location":{"name":"Kinkaku-ji"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The reflection in the pond makes it feel like a dream"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Arashiyama Bamboo Grove","description":"Walk through towering bamboo stalks — the light filtering through creates an otherworldly atmosphere.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Arashiyama Bamboo Grove"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The sound of wind through bamboo is haunting and beautiful"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Kaiseki Dinner at Kikunoi","description":"3-Michelin-star kaiseki — 12-course seasonal tasting menu in a traditional tatami room.","category":"food","estimated_cost_per_person":200,"duration_minutes":150,"location":{"name":"Kikunoi Honten"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The pinnacle of Japanese culinary art"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Geisha Spotting in Gion","description":"Walk the lantern-lit streets of the geisha district at dusk — you might spot a maiko heading to an engagement.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":60,"location":{"name":"Gion, Hanami-koji"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The living tradition of geisha culture"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"At Fushimi Inari, most tourists stop at the first overlook. Keep climbing — the top has almost no one and the views are better.","location":"Fushimi Inari summit"}]}'::jsonb,
  'VYBR', uid, true, 'public', '7-day Kyoto luxury: Cherry blossoms, 10,000 torii gates, Michelin kaiseki, golden temples, bamboo groves, and geisha district.',
  ARRAY['kyoto', 'japan', 'asia', 'luxury', 'culture', 'food', 'cherry-blossoms']
);

RAISE NOTICE 'All 6 budget + luxury trips inserted';
END $$;
