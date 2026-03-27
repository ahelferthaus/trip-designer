# Seed Trip Data

This folder contains pre-generated trip itineraries that can be loaded
directly into Supabase without using AI API calls.

## How to load

1. Run each SQL file in the Supabase SQL Editor in order
2. Each file inserts published public trips with full itinerary data
3. Trips are tagged for search/filter on the Explore page

## Files

- `seed_soccer.sql` — 8 soccer/sports trips
- `seed_europe.sql` — 30 European week trips
- `seed_us_weekends.sql` — 20 US weekend trips
- `seed_ski.sql` — 10 ski resort trips
- `seed_spring_break.sql` — 20 spring break trips (family + college)
- `seed_budget.sql` — 8 budget-friendly trips
- `seed_luxury.sql` — 8 luxury trips

Total: ~104 pre-loaded trips
