import { openai } from "./openai";
import type { IntakeFormData, TripDay, ActivitySlot, ActivityOption } from "./types";

export interface GeneratedItinerary {
  title: string;
  days: Array<TripDay & { slots: Array<ActivitySlot & { options: ActivityOption[] }> }>;
}

export async function generateItinerary(form: IntakeFormData): Promise<GeneratedItinerary> {
  const days = daysBetween(form.start_date, form.end_date);
  const groupDesc = form.group_members
    .map(m => m.type === "child" ? `child age ${m.age ?? "?"}` : "adult")
    .join(", ");

  const systemPrompt = `You are a world-class travel planner. Return ONLY valid JSON — no markdown, no explanation.`;

  const userPrompt = `Plan a ${days}-day trip to ${form.destination?.name}.

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
            { /* second option for same slot */ }
          ]
        }
      ]
    }
  ]
}

Rules:
- 3 slots per day: morning, afternoon, evening
- 2 options per slot (let user pick)
- category must be one of: food, attraction, adventure, rest, transport
- weather_sensitivity must be one of: indoor, outdoor, either
- slot_type must be one of: morning, afternoon, evening, flex
- estimated_cost_per_person in USD
- Keep descriptions vivid and specific to the destination
- Vary activity types — don't stack all attractions`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as GeneratedItinerary;
}

function daysBetween(start: string, end: string) {
  if (!start || !end) return 3;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}
