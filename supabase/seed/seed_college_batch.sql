-- Seed: College Spring Break - ALL 10 trips in one file
-- Paste this entire file into Supabase SQL Editor and run once

DO $$ DECLARE uid uuid;
BEGIN SELECT id INTO uid FROM auth.users LIMIT 1;

-- 1. Cancun College
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Cancun: Beach Clubs & Nightlife', 'Cancun, Mexico', '2026-03-14', '2026-03-19', '1234',
  '{"destination":{"name":"Cancun, Mexico"},"start_date":"2026-03-14","end_date":"2026-03-19","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["nightlife","relaxed"]}'::jsonb,
  '{"title":"Cancun: Beach Clubs & Nightlife","days":[
    {"id":"day-1","trip_id":"t","date":"2026-03-14","day_number":1,"title":"Arrival & Hotel Zone","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Hotel Zone Beach Day","description":"Turquoise water, white sand, beach bars with $2 Coronas.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Playa Forum, Hotel Zone"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The beach that launched a million spring breaks"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Tacos & Micheladas at Tacos Rigo","description":"Best cheap tacos in the Hotel Zone — al pastor, carne asada, cold Micheladas.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Tacos Rigo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Fuel up cheap before the party starts"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Mandala Beach Club","description":"Day club with DJs, pool, open bar packages, and foam parties.","category":"adventure","estimated_cost_per_person":40,"duration_minutes":240,"location":{"name":"Mandala Beach Club"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The spring break day party experience"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Snorkeling at MUSA Underwater Museum","description":"Snorkel over 500+ underwater sculptures — art meets marine life.","category":"adventure","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"MUSA, Isla Mujeres"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Unique underwater art experience"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Coco Bongo Night Club","description":"Cirque du Soleil meets nightclub — acrobats, confetti, open bar, absolute chaos.","category":"attraction","estimated_cost_per_person":60,"duration_minutes":240,"location":{"name":"Coco Bongo, Hotel Zone"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The most insane nightclub in Mexico"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Señor Frog''s Party","description":"Legendary spring break bar — yard-long drinks, dancing on tables, wet T-shirt contests.","category":"food","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Señor Frog''s, Hotel Zone"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The name alone tells you everything"}]}]
    },
    {"id":"day-2","trip_id":"t","date":"2026-03-15","day_number":2,"title":"Isla Mujeres & Party","slots":[
      {"id":"s-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
        {"id":"o-2-1-1","slot_id":"s-2-1","title":"Ferry to Isla Mujeres","description":"20-min ferry to a chill island — rent a golf cart, hit Playa Norte (Mexico''s best beach).","category":"adventure","estimated_cost_per_person":15,"duration_minutes":300,"location":{"name":"Isla Mujeres"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Paradise island escape from the party zone"},
        {"id":"o-2-1-2","slot_id":"s-2-1","title":"Pool Party at Resort","description":"DJs, drink specials, pool games — the classic spring break afternoon.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"Hotel pool"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sometimes the pool party IS the plan"}]},
      {"id":"s-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
        {"id":"o-2-2-1","slot_id":"s-2-2","title":"Cenote Swimming","description":"Sacred underground swimming holes with crystal-clear water — Cenote Ik Kil or Casa Cenotes.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Cenotes near Cancun"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Instagram gold — swimming in a limestone cave"},
        {"id":"o-2-2-2","slot_id":"s-2-2","title":"Jet Ski in the Lagoon","description":"Rent jet skis in the Nichupté Lagoon — calmer water, cheaper than ocean side.","category":"adventure","estimated_cost_per_person":40,"duration_minutes":60,"location":{"name":"Nichupté Lagoon"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Adrenaline on the water"}]},
      {"id":"s-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
        {"id":"o-2-3-1","slot_id":"s-2-3","title":"Bar Crawl on the Strip","description":"Hit 4-5 bars along the Hotel Zone — drink specials, live music, party buses between venues.","category":"food","estimated_cost_per_person":40,"duration_minutes":240,"location":{"name":"Hotel Zone party strip"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The classic spring break bar crawl"},
        {"id":"o-2-3-2","slot_id":"s-2-3","title":"Dinner at Puerto Madero","description":"Upscale lagoon-side seafood — when you want one nice meal amid the chaos.","category":"food","estimated_cost_per_person":30,"duration_minutes":90,"location":{"name":"Puerto Madero"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Prove you have some class"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Buy an open bar wristband at Mandala for $40 — it covers drinks all day at the beach club.","location":"Mandala Beach Club"},{"day_number":2,"tip":"On Isla Mujeres, rent a golf cart ($35/day) and drive to the south tip — Punta Sur has cliff views and almost no tourists.","location":"Punta Sur, Isla Mujeres"}]}'::jsonb,
  'VYBR', uid, true, 'public', '5-day Cancun college spring break: beach clubs, Coco Bongo, Isla Mujeres, cenotes, and non-stop nightlife.',
  ARRAY['cancun', 'mexico', 'college', 'spring-break', 'party', 'beach', 'nightlife']
);

-- 2. Miami Beach College
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Miami Beach: South Beach & Clubs', 'Miami Beach, FL', '2026-03-14', '2026-03-19', '1234',
  '{"destination":{"name":"Miami Beach, FL"},"start_date":"2026-03-14","end_date":"2026-03-19","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["nightlife","food","relaxed"]}'::jsonb,
  '{"title":"Miami Beach: South Beach & Clubs","days":[
    {"id":"day-1","trip_id":"t","date":"2026-03-14","day_number":1,"title":"South Beach","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"South Beach Morning","description":"Iconic pastel lifeguard towers, turquoise water, and the beautiful people.","category":"rest","estimated_cost_per_person":0,"duration_minutes":180,"location":{"name":"South Beach, 10th-14th St"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most famous beach in America"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Cuban Coffee at David''s Cafe","description":"Cortadito and croquetas — the Miami breakfast of champions.","category":"food","estimated_cost_per_person":6,"duration_minutes":20,"location":{"name":"David''s Cafe, South Beach"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Cuban espresso is rocket fuel"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Wynwood Walls & Brewery","description":"Instagram-famous murals, galleries, then craft beer at Wynwood Brewing.","category":"attraction","estimated_cost_per_person":10,"duration_minutes":150,"location":{"name":"Wynwood Arts District"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Art, street food, and beer — the perfect afternoon"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Pool Party at a SoBe Hotel","description":"Day-club vibes at rooftop pools — DJs, bottle service, and the South Beach scene.","category":"rest","estimated_cost_per_person":20,"duration_minutes":180,"location":{"name":"South Beach hotel pools"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Miami pool parties are legendary"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Ocean Drive Dinner & Bar Hop","description":"Neon Art Deco, mojitos, people-watching — the strip that defines Miami nightlife.","category":"food","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"Ocean Drive"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic nightlife strip in Florida"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"LIV or E11EVEN Nightclub","description":"Miami''s mega clubs — celebrity DJs, bottle service, and dancing until sunrise.","category":"attraction","estimated_cost_per_person":50,"duration_minutes":240,"location":{"name":"LIV / E11EVEN"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The clubs that made Miami the nightlife capital of the US"}]}]
    },
    {"id":"day-2","trip_id":"t","date":"2026-03-15","day_number":2,"title":"Little Havana & Brickell","slots":[
      {"id":"s-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
        {"id":"o-2-1-1","slot_id":"s-2-1","title":"Little Havana Food Walk","description":"Calle Ocho — empanadas, colada shots, fruit stands, and domino park with the abuelos.","category":"food","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Calle Ocho, Little Havana"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Miami''s cultural soul — and the food is incredible"},
        {"id":"o-2-1-2","slot_id":"s-2-1","title":"Brunch at The Salty","description":"Oceanfront brunch in Surfside — lobster rolls and bottomless mimosas.","category":"food","estimated_cost_per_person":35,"duration_minutes":60,"location":{"name":"The Salty, Surfside"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Beach brunch perfection"}]},
      {"id":"s-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
        {"id":"o-2-2-1","slot_id":"s-2-2","title":"Jet Ski / Parasailing in Biscayne Bay","description":"Water sports with skyline views — jet ski rentals or parasailing from South Beach.","category":"adventure","estimated_cost_per_person":50,"duration_minutes":60,"location":{"name":"Biscayne Bay"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"See Miami from the water"},
        {"id":"o-2-2-2","slot_id":"s-2-2","title":"Design District Shopping","description":"Luxury brands, art installations, and free galleries — window shop or splurge.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"Miami Design District"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"Fashion meets art"}]},
      {"id":"s-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
        {"id":"o-2-3-1","slot_id":"s-2-3","title":"Brickell Bar Crawl","description":"Miami''s financial district turns party district at night — rooftop bars, cocktail lounges, Latin clubs.","category":"food","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Brickell"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Brickell nightlife is more local and less touristy than SoBe"},
        {"id":"o-2-3-2","slot_id":"s-2-3","title":"Late Night at Ball & Chain","description":"Live salsa, mojitos, and Cuban vibes in a 1935 jazz venue in Little Havana.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Ball & Chain, Calle Ocho"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Dance salsa with locals — the real Miami experience"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Skip the overpriced Ocean Drive restaurants — walk one block to Collins Ave for the same scene at half the price.","location":"Collins Avenue"},{"day_number":2,"tip":"Azucar Ice Cream on Calle Ocho makes ''Abuela Maria'' flavor (vanilla, guava, cream cheese) — life-changing.","location":"Azucar Ice Cream"}]}'::jsonb,
  'VYBR', uid, true, 'public', '5-day Miami college spring break: South Beach, Wynwood, Little Havana, mega clubs, pool parties, and Cuban food.',
  ARRAY['miami', 'usa', 'college', 'spring-break', 'party', 'beach', 'nightlife', 'cuban']
);

-- 3. Cabo College
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Cabo: El Arco, Beach Clubs & Tacos', 'Cabo San Lucas, Mexico', '2026-03-14', '2026-03-19', '1234',
  '{"destination":{"name":"Cabo San Lucas, Mexico"},"start_date":"2026-03-14","end_date":"2026-03-19","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"mid","vibes":["nightlife","adventure","relaxed"]}'::jsonb,
  '{"title":"Cabo: El Arco, Beach Clubs & Tacos","days":[
    {"id":"day-1","trip_id":"t","date":"2026-03-14","day_number":1,"title":"Marina & El Arco","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Glass-Bottom Boat to El Arco","description":"Boat tour to the iconic arch at Land''s End where the Pacific meets the Sea of Cortez.","category":"adventure","estimated_cost_per_person":15,"duration_minutes":45,"location":{"name":"El Arco, Land''s End"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most photographed landmark in Baja"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Breakfast at The Office","description":"Feet-in-the-sand restaurant on Médano Beach — huevos rancheros and fresh juices.","category":"food","estimated_cost_per_person":12,"duration_minutes":45,"location":{"name":"The Office on the Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Breakfast on the beach — the Cabo dream"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Mango Deck Beach Club","description":"Cabo''s legendary day party — DJ, body shots, beer pong, and the famous Mango Margarita.","category":"adventure","estimated_cost_per_person":30,"duration_minutes":240,"location":{"name":"Mango Deck, Médano Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The epicenter of Cabo spring break"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Whale Watching (Jan-March)","description":"Humpback whales breach right off the coast — 2-hour boat tour with almost guaranteed sightings.","category":"adventure","estimated_cost_per_person":50,"duration_minutes":120,"location":{"name":"Sea of Cortez"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Seeing a 40-ton whale breach 50 feet away is unforgettable"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Cabo Wabo Cantina","description":"Sammy Hagar''s legendary bar — live rock music, tequila flights, and a wild party every night.","category":"food","estimated_cost_per_person":30,"duration_minutes":180,"location":{"name":"Cabo Wabo Cantina, Marina"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The bar that put Cabo on the party map"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Fish Tacos at Los Tacos de Baja","description":"$2 fish tacos with battered mahi-mahi, cabbage slaw, and chipotle crema.","category":"food","estimated_cost_per_person":6,"duration_minutes":20,"location":{"name":"Los Tacos de Baja, downtown"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Skip the resort food — eat where the locals eat"}]}]
    },
    {"id":"day-2","trip_id":"t","date":"2026-03-15","day_number":2,"title":"ATV & Sunset Cruise","slots":[
      {"id":"s-2-1","day_id":"day-2","slot_type":"morning","status":"open","options":[
        {"id":"o-2-1-1","slot_id":"s-2-1","title":"ATV Desert Tour","description":"Ride ATVs through Baja desert to a remote beach — cactus fields, sand dunes, and Pacific views.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":180,"location":{"name":"Baja desert, Cabo"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Desert meets ocean — the Baja landscape is dramatic"},
        {"id":"o-2-1-2","slot_id":"s-2-1","title":"Snorkeling at Chileno Bay","description":"One of Cabo''s only swimmable beaches — clear water, tropical fish, easy snorkeling from shore.","category":"adventure","estimated_cost_per_person":10,"duration_minutes":120,"location":{"name":"Playa Chileno"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Crystal clear water and colorful fish right off the beach"}]},
      {"id":"s-2-2","day_id":"day-2","slot_type":"afternoon","status":"open","options":[
        {"id":"o-2-2-1","slot_id":"s-2-2","title":"Marina Bar Hopping","description":"Walk the marina — Baja Brewing (craft beer), Latitude 22 (roadhouse), and Edith''s (upscale).","category":"food","estimated_cost_per_person":25,"duration_minutes":150,"location":{"name":"Cabo Marina"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"The marina is Cabo''s social hub"},
        {"id":"o-2-2-2","slot_id":"s-2-2","title":"Parasailing over Médano Beach","description":"Fly 500 feet above Cabo — views of El Arco, the marina, and the desert mountains.","category":"adventure","estimated_cost_per_person":45,"duration_minutes":30,"location":{"name":"Médano Beach"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"See all of Cabo from the air"}]},
      {"id":"s-2-3","day_id":"day-2","slot_type":"evening","status":"open","options":[
        {"id":"o-2-3-1","slot_id":"s-2-3","title":"Sunset Booze Cruise","description":"Catamaran with open bar, DJ, snorkeling stop, and sunset over El Arco. The quintessential Cabo experience.","category":"adventure","estimated_cost_per_person":60,"duration_minutes":180,"location":{"name":"Cabo Bay"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Sunset + open bar + El Arco = peak spring break"},
        {"id":"o-2-3-2","slot_id":"s-2-3","title":"Dinner at Edith''s","description":"Upscale Mexican with open-fire grill — lobster, caesar salad (tableside), and premium tequila.","category":"food","estimated_cost_per_person":45,"duration_minutes":90,"location":{"name":"Edith''s, Médano Beach"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"When you want one classy night in Cabo"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"At Mango Deck, arrive before noon for a good spot — by 2pm it''s standing room only.","location":"Mango Deck"},{"day_number":2,"tip":"The sunset cruise boats leave from the marina dock near Puerto Paraiso — book the smaller catamarans for a better experience than the mega-boats.","location":"Cabo Marina"}]}'::jsonb,
  'VYBR', uid, true, 'public', '5-day Cabo college spring break: El Arco, Mango Deck beach club, ATV desert tour, sunset booze cruise, and Cabo Wabo.',
  ARRAY['cabo', 'mexico', 'college', 'spring-break', 'party', 'beach', 'nightlife']
);

-- 4. Austin College
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'Austin: 6th Street, BBQ & Live Music', 'Austin, TX', '2026-03-13', '2026-03-16', '1234',
  '{"destination":{"name":"Austin, TX"},"start_date":"2026-03-13","end_date":"2026-03-16","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["nightlife","food"],"travel_theme":"nightlife-music"}'::jsonb,
  '{"title":"Austin: 6th Street, BBQ & Live Music","days":[
    {"id":"day-1","trip_id":"t","date":"2026-03-13","day_number":1,"title":"6th Street & BBQ","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Breakfast Tacos at Veracruz","description":"Austin''s best — migas, bacon egg cheese, green salsa. $3 each.","category":"food","estimated_cost_per_person":8,"duration_minutes":20,"location":{"name":"Veracruz All Natural"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The breakfast taco is Austin''s religion"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"Barton Springs Pool","description":"68°F spring-fed swimming hole in Zilker Park — $5 entry, crystal clear.","category":"adventure","estimated_cost_per_person":5,"duration_minutes":120,"location":{"name":"Barton Springs"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Austin''s coolest hangout — literally"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"BBQ at la Barbecue","description":"Shorter line than Franklin, arguably as good — brisket, ribs, sausage.","category":"food","estimated_cost_per_person":22,"duration_minutes":60,"location":{"name":"la Barbecue"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"World-class brisket without the 4-hour Franklin wait"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"South Congress Stroll","description":"Austin''s coolest strip — vintage shops, food trucks, murals, and the ''I love you so much'' wall.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":90,"location":{"name":"South Congress Ave"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Keep Austin Weird lives here"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Dirty 6th Street Bar Crawl","description":"Austin''s party strip — free live music at every bar, no cover, $4 wells.","category":"attraction","estimated_cost_per_person":20,"duration_minutes":240,"location":{"name":"6th Street"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The Live Music Capital of the World on a Friday night"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Live Show at Mohawk","description":"Outdoor venue with 3 stages — catch a band you''ve never heard of that''ll blow your mind.","category":"attraction","estimated_cost_per_person":15,"duration_minutes":120,"location":{"name":"Mohawk, Red River"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Red River is where the real music scene lives"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Skip Dirty 6th and go to Rainey Street instead — converted houses with backyards, better crowds, and Via 313 pizza truck.","location":"Rainey Street"}]}'::jsonb,
  'VYBR', uid, true, 'public', '3-day Austin college spring break: 6th Street bars, world-class BBQ, Barton Springs, and non-stop live music.',
  ARRAY['austin', 'usa', 'college', 'spring-break', 'party', 'music', 'bbq', 'nightlife']
);

-- 5. NOLA College
INSERT INTO trips (title, destination, start_date, end_date, passcode, form_data, itinerary_data, created_by, user_id, is_published, visibility, description, tags) VALUES (
  'New Orleans: Bourbon Street & Beignets', 'New Orleans, LA', '2026-03-13', '2026-03-16', '1234',
  '{"destination":{"name":"New Orleans, LA"},"start_date":"2026-03-13","end_date":"2026-03-16","group_members":[{"name":"Traveler","type":"adult"}],"budget_level":"budget","vibes":["nightlife","food","culture"]}'::jsonb,
  '{"title":"New Orleans: Bourbon Street & Beignets","days":[
    {"id":"day-1","trip_id":"t","date":"2026-03-13","day_number":1,"title":"French Quarter Madness","slots":[
      {"id":"s-1-1","day_id":"day-1","slot_type":"morning","status":"open","options":[
        {"id":"o-1-1-1","slot_id":"s-1-1","title":"Beignets at Café Du Monde","description":"Powdered sugar mountains on hot fried dough — café au lait mandatory. Open 24 hours.","category":"food","estimated_cost_per_person":8,"duration_minutes":30,"location":{"name":"Café Du Monde"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most iconic breakfast in America"},
        {"id":"o-1-1-2","slot_id":"s-1-1","title":"French Quarter Walk","description":"Jackson Square, St. Louis Cathedral, Royal Street — 300 years of history and fortune tellers.","category":"attraction","estimated_cost_per_person":0,"duration_minutes":120,"location":{"name":"French Quarter"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"The most atmospheric neighborhood in America"}]},
      {"id":"s-1-2","day_id":"day-1","slot_type":"afternoon","status":"open","options":[
        {"id":"o-1-2-1","slot_id":"s-1-2","title":"Po''Boy at Parkway Bakery","description":"Fried shrimp or roast beef dressed — the NOLA sandwich on crispy French bread.","category":"food","estimated_cost_per_person":14,"duration_minutes":30,"location":{"name":"Parkway Bakery"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"Worth the drive for the best po''boy in the city"},
        {"id":"o-1-2-2","slot_id":"s-1-2","title":"Swamp Tour","description":"Airboat through the bayou — gators, herons, and Spanish moss. 30 min from downtown.","category":"adventure","estimated_cost_per_person":35,"duration_minutes":120,"location":{"name":"Bayou Lafitte"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Real alligators in the wild"}]},
      {"id":"s-1-3","day_id":"day-1","slot_type":"evening","status":"open","options":[
        {"id":"o-1-3-1","slot_id":"s-1-3","title":"Bourbon Street Night","description":"Neon, hand grenades, hurricanes, open containers, and music from every door.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":240,"location":{"name":"Bourbon Street"},"weather_sensitivity":"outdoor","ai_generated":true,"why_this_fits":"Love it or hate it — you have to experience Bourbon Street once"},
        {"id":"o-1-3-2","slot_id":"s-1-3","title":"Jazz at Preservation Hall","description":"Pure traditional jazz in a tiny room — no frills, just the music that built this city.","category":"attraction","estimated_cost_per_person":25,"duration_minutes":50,"location":{"name":"Preservation Hall"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"The purest jazz experience in the world"}]}
    ]}],"hiddenGems":[{"day_number":1,"tip":"Frenchmen Street is the locals'' Bourbon Street — better music, better vibes, better people. d.b.a. and The Spotted Cat are the moves.","location":"Frenchmen Street"}]}'::jsonb,
  'VYBR', uid, true, 'public', '3-day New Orleans college spring break: Bourbon Street, beignets, jazz, po''boys, swamp tour, and open-container madness.',
  ARRAY['nola', 'new-orleans', 'usa', 'college', 'spring-break', 'party', 'jazz', 'nightlife']
);

RAISE NOTICE 'All 5 college spring break trips inserted';
END $$;
