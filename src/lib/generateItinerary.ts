import { callLLM } from "./llmClient";
import type { IntakeFormData, TripDay, ActivitySlot, ActivityOption } from "./types";

export interface GeneratedItinerary {
  title: string;
  days: Array<TripDay & { slots: Array<ActivitySlot & { options: ActivityOption[] }> }>;
  hiddenGems?: { day_number: number; tip: string; location?: string }[];
}

export async function generateItinerary(form: IntakeFormData): Promise<GeneratedItinerary> {
  const days = daysBetween(form.start_date, form.end_date);
  const groupDesc = form.group_members
    .map(m => m.type === "child" ? `child age ${m.age ?? "?"}` : "adult")
    .join(", ");

  const systemPrompt = `You are a world-class travel planner. Return ONLY valid JSON — no markdown, no explanation.`;

  const userPrompt = `Plan a ${days}-day trip to ${form.destination?.name}.

CRITICAL: You MUST return EXACTLY ${days} days in the "days" array. No more, no less.

Group: ${form.group_members.length} people (${groupDesc})
Budget: ${form.budget_level}
Vibe: ${form.vibes.join(", ")}
Dates: ${form.start_date} to ${form.end_date}
${form.must_haves ? `Must include: ${form.must_haves}` : ""}
${form.avoid ? `Avoid: ${form.avoid}` : ""}

Return JSON in this exact shape:
{
  "title": "short trip title e.g. Florence Weekend",
  "days": [
    {
      "id": "day-1",
      "trip_id": "trip-1",
      "date": "YYYY-MM-DD",
      "day_number": 1,
      "title": "optional day title",
      "slots": [
        {
          "id": "slot-1-1",
          "day_id": "day-1",
          "slot_type": "morning",
          "status": "open",
          "options": [
            {
              "id": "opt-1-1-1",
              "slot_id": "slot-1-1",
              "title": "Activity name",
              "description": "2-3 sentence description",
              "category": "attraction",
              "estimated_cost_per_person": 20,
              "duration_minutes": 90,
              "location": { "name": "Place name", "address": "Address" },
              "photo_url": "",
              "booking_url": "",
              "weather_sensitivity": "indoor",
              "ai_generated": true
            },
            { "second option here with same fields" }
          ]
        }
      ]
    }
    // REPEAT FOR ALL ${days} DAYS — Day 2, Day 3, etc.
  ],
  "hiddenGems": [
    { "day_number": 1, "tip": "local secret tip", "location": "optional place name" }
    // One hiddenGem per day for all ${days} days
  ]
}

Rules:
- EXACTLY ${days} days required — this is a ${days}-day trip
- Day 1 = ${form.start_date}, Day ${days} = ${form.end_date}
- 3 slots per day: morning, afternoon, evening
- 2 options per slot
- Each day should have different activities (don't repeat the same stuff)
- category: food, attraction, adventure, rest, or transport
- weather_sensitivity: indoor, outdoor, or either
- estimated_cost_per_person in USD
- Descriptions vivid and specific to ${form.destination?.name}
- hiddenGems: one per day, genuine local secrets most tourists miss`;

  const raw = await callLLM([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const result = JSON.parse(raw) as GeneratedItinerary;
  
  // Validate day count
  if (result.days.length !== days) {
    console.warn(`AI returned ${result.days.length} days but ${days} were requested. Prompt was: ${days}-day trip.`);
    // Pad with empty days if needed, or just return what we got
  }
  
  return result;
}

function daysBetween(start: string, end: string) {
  if (!start || !end) return 3;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}
