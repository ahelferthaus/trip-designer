---
name: matching-travel-themes
description: >
  Maps user-described travel interests to VYBR travel themes and vibe tags.
  Use when helping a user choose between themes, when the user describes a trip
  type in free text, or when suggesting which intake form options to select.
  Returns a ranked list of matching theme IDs and vibe tags.
---

# Matching Travel Themes

## Available Themes

- sports-soccer
- sports-general
- food-wine
- art-museums
- history
- beach-resort
- skiing
- hiking-nature
- nightlife-music
- wellness-spa
- photography
- college-tour
- none

## Available Vibes

relaxed, adventure, culture, food, nightlife, nature, family, romance

## Matching Logic

Analyze the user's free-text description and return:

```json
{
  "recommended_theme": "theme-id or none",
  "confidence": "high|medium|low",
  "vibes": ["vibe1", "vibe2"],
  "reasoning": "One sentence explaining why"
}
```

## Examples

- "We want to eat our way through Tokyo" -> food-wine, vibes: [food, culture], high confidence
- "Bachelor party in Vegas" -> nightlife-music, vibes: [nightlife, adventure], high confidence
- "Visiting my daughter's campus" -> college-tour, vibes: [family], high confidence
- "Just want to chill on a beach somewhere" -> beach-resort, vibes: [relaxed, nature], high confidence
- "We like a bit of everything" -> none, vibes: [adventure, culture, food], low confidence
