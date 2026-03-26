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
Budget: ${form.budget_level}${form.budget_amount ? ` — ${form.budget_currency ?? "USD"} ${form.budget_amount}${form.budget_per_person ? " per person" : " total"}` : ""}
Vibe: ${form.vibes.join(", ")}
Dates: ${form.start_date} to ${form.end_date}
${form.must_haves ? `Must include: ${form.must_haves}` : ""}
${form.avoid ? `Avoid: ${form.avoid}` : ""}
${form.dietary ? `Dietary restrictions: ${form.dietary}` : ""}
${form.mobility ? `Mobility/accessibility: ${form.mobility}` : ""}

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
              "ai_generated": true,
              "why_this_fits": "1 sentence explaining why this matches the trip vibe"
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
  
  // Ensure correct day count
  const paddedResult = padItineraryDays(result, days, form.start_date);
  
  if (paddedResult.days.length !== days) {
    console.warn(`Day count mismatch: expected ${days}, got ${paddedResult.days.length}`);
  }
  
  return paddedResult;
}

function daysBetween(start: string, end: string) {
  if (!start || !end) return 3;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

// Add days to reach the required count
function padItineraryDays(
  itinerary: GeneratedItinerary,
  requiredDays: number,
  startDate: string
): GeneratedItinerary {
  if (itinerary.days.length >= requiredDays) return itinerary;

  const paddedDays = [...itinerary.days];
  const baseDay = itinerary.days[0];

  for (let i = itinerary.days.length + 1; i <= requiredDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i - 1);
    
    paddedDays.push({
      ...baseDay,
      id: `day-${i}`,
      day_number: i,
      date: date.toISOString().split("T")[0],
      slots: baseDay.slots.map((slot, idx) => ({
        ...slot,
        id: `slot-${i}-${idx}`,
        day_id: `day-${i}`,
        options: slot.options.map((opt, optIdx) => ({
          ...opt,
          id: `opt-${i}-${idx}-${optIdx}`,
          slot_id: `slot-${i}-${idx}`,
          title: `${opt.title} (Day ${i})`,
        })),
      })),
    });
  }

  return { ...itinerary, days: paddedDays };
}
