---
name: generating-itineraries
description: >
  Generates structured multi-day travel itineraries as valid JSON for VYBR trip planning.
  Use when asked to plan a trip, create an itinerary, or build a day-by-day schedule.
  Produces JSON with title, days array (with slots and options), and hiddenGems.
  Each day has 3 slots (morning, afternoon, evening), each slot 2 activity options.
  Respects travel themes, group composition, budget level, vibes, dietary restrictions, and mobility needs.
---

# Generating Itineraries

## Output Format

Always return ONLY valid JSON — no markdown fences, no explanation text.

## Core Schema

```json
{
  "title": "Short, evocative trip title",
  "days": [
    {
      "id": "day-1",
      "trip_id": "trip-1",
      "date": "YYYY-MM-DD",
      "day_number": 1,
      "title": "Day theme title",
      "slots": [
        {
          "id": "slot-1-1",
          "day_id": "day-1",
          "slot_type": "morning|afternoon|evening",
          "status": "open",
          "options": [
            {
              "id": "opt-1-1-1",
              "slot_id": "slot-1-1",
              "title": "Activity name",
              "description": "One engaging sentence.",
              "category": "food|attraction|adventure|rest|transport",
              "estimated_cost_per_person": 25,
              "duration_minutes": 90,
              "location": { "name": "Specific Venue Name" },
              "weather_sensitivity": "indoor|outdoor|either",
              "ai_generated": true,
              "why_this_fits": "One short reason this fits the group"
            }
          ]
        }
      ]
    }
  ],
  "hiddenGems": [
    { "day_number": 1, "tip": "Local secret", "location": "Specific place name" }
  ]
}
```

## Rules

- Exactly N days as specified. Day 1 = start_date, Day N = end_date
- Exactly 3 slots/day: morning, afternoon, evening
- Exactly 2 options per slot. Keep descriptions to 1 sentence
- Never repeat activities across days or slots
- Exactly 1 hiddenGem per day — must be genuinely local/non-obvious
- For multi-city trips, sequence activities geographically to minimize travel
- Budget mapping: budget=$15-30/activity, mid=$30-75, splurge=$75-200+

## Travel Theme Override

When travel_theme is set, prioritize theme activities in 2 of 3 daily slots:
- **sports-soccer**: Stadium tours, local match tickets, football culture spots
- **sports-general**: Local sporting events, adventure sports, athletic venues
- **food-wine**: Markets, cooking classes, Michelin picks, wine tastings, street food tours
- **art-museums**: Galleries, street art walks, artist studios, design districts
- **history**: Ancient sites, walking tours, museums, heritage neighborhoods
- **beach-resort**: Beaches, snorkeling, seaside dining, sunset spots
- **skiing**: Slopes, apres-ski, mountain lodges, winter activities
- **hiking-nature**: Trails, national parks, scenic viewpoints, wildlife
- **nightlife-music**: Live music, rooftop bars, club districts, jazz/blues venues
- **wellness-spa**: Spas, yoga, thermal baths, meditation retreats
- **photography**: Golden-hour spots, iconic viewpoints, hidden photo ops
- **college-tour**: Campus tours, student neighborhoods, academic landmarks, local college culture
