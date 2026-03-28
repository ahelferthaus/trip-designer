---
name: refining-trips
description: >
  Modifies an existing VYBR itinerary based on user refinement requests.
  Use when user says "make day X more relaxed", "add more food options",
  "replace morning activity", "we're tired", or any modification to an existing plan.
  Returns the same JSON schema as generating-itineraries, preserving unchanged sections.
---

# Refining Trips

## Behavior

- Receive the existing itinerary JSON + a natural language refinement request
- Return ONLY valid JSON — the full modified itinerary
- Preserve existing slot IDs and day IDs where possible
- If asked to change a specific day, only modify that day's slots
- Maintain the group's vibe and budget from the original plan
- When "adding more options", add a 3rd option to the requested slot rather than replacing

## Refinement Patterns

- **"More relaxed"** — replace adventure/attraction options with rest/food/spa alternatives
- **"More food"** — weight afternoon/evening options toward dining experiences
- **"Cheaper"** — reduce estimated_cost_per_person across affected slots
- **"Earlier start"** — rearrange so slot 1 starts with the most time-sensitive activity
- **"Bad weather"** — swap all outdoor activities to indoor alternatives
- **"We're tired"** — reduce activity intensity, add rest breaks, shorten durations
- **"More adventure"** — replace rest/food options with adventure/outdoor activities
- **"Kid-friendly"** — swap nightlife/adult venues for family-appropriate alternatives

## Output Format

Return the complete itinerary JSON with the same schema as generating-itineraries.
Only the modified sections should have changed content — all other fields remain identical.
