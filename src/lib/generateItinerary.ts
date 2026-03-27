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

  const systemPrompt = `You are a travel planner. Return ONLY valid JSON. No markdown, no explanation, no extra text.`;

  // Travel theme prompt injection
  const themePrompts: Record<string, string> = {
    "sports-soccer": "THEME: Sports/Soccer travel. If there are soccer/football matches happening during the trip dates, include them as options. Prioritize visits to famous stadiums, football museums, sports bars showing matches. Mix with standard tourism so it's not 100% sports.",
    "sports-general": "THEME: Sports travel. Include local sporting events, stadium tours, sports museums, and sports bars. Mix with standard tourism.",
    "food-wine": "THEME: Food & wine. Prioritize food markets, cooking classes, wine tastings, Michelin restaurants, local food tours, and regional specialties.",
    "art-museums": "THEME: Art & museums. Prioritize major art museums, galleries, street art, architecture tours, and cultural landmarks.",
    "history": "THEME: History. Prioritize historical sites, monuments, walking tours, battlefields, ancient ruins, and heritage museums.",
    "beach-resort": "THEME: Beach & resort. Prioritize beach activities, water sports, seaside dining, sunset spots, and relaxation.",
    "skiing": "THEME: Skiing & winter sports. Prioritize ski resorts, slopes, après-ski, mountain dining, and winter activities.",
    "hiking-nature": "THEME: Hiking & nature. Prioritize trails, national parks, scenic viewpoints, nature reserves, and outdoor activities.",
    "nightlife-music": "THEME: Nightlife & music. Prioritize live music venues, clubs, cocktail bars, jazz clubs, and late-night food spots.",
    "wellness-spa": "THEME: Wellness & spa. Prioritize spas, thermal baths, yoga studios, meditation retreats, and healthy dining.",
    "photography": "THEME: Photography. Prioritize the most photogenic locations, golden hour spots, iconic viewpoints, and unique architecture.",
  };
  const themeText = form.travel_theme && form.travel_theme !== "none"
    ? themePrompts[form.travel_theme] || ""
    : "";

  const userPrompt = `Plan a ${days}-day trip to ${form.destination?.name}.

Group: ${form.group_members.length} people (${groupDesc})
Budget: ${form.budget_level}${form.budget_amount ? ` — ${form.budget_currency ?? "USD"} ${form.budget_amount}${form.budget_per_person ? "/person" : " total"}` : ""}
Vibe: ${form.vibes.join(", ")}
Dates: ${form.start_date} to ${form.end_date}
${themeText ? `\n${themeText}\n` : ""}${form.must_haves ? `Must: ${form.must_haves}` : ""}
${form.avoid ? `Avoid: ${form.avoid}` : ""}
${form.dietary ? `Dietary: ${form.dietary}` : ""}
${form.mobility ? `Mobility: ${form.mobility}` : ""}

Return JSON:
{
  "title": "short title",
  "days": [
    {
      "id": "day-1", "trip_id": "trip-1", "date": "${form.start_date}", "day_number": 1, "title": "day title",
      "slots": [
        {
          "id": "slot-1-1", "day_id": "day-1", "slot_type": "morning", "status": "open",
          "options": [
            {"id":"opt-1-1-1","slot_id":"slot-1-1","title":"Name","description":"1 sentence","category":"attraction","estimated_cost_per_person":20,"duration_minutes":90,"location":{"name":"Place"},"weather_sensitivity":"indoor","ai_generated":true,"why_this_fits":"short reason"},
            {"id":"opt-1-1-2","slot_id":"slot-1-1","title":"Alt","description":"1 sentence","category":"food","estimated_cost_per_person":15,"duration_minutes":60,"location":{"name":"Place2"},"weather_sensitivity":"either","ai_generated":true,"why_this_fits":"short reason"}
          ]
        }
      ]
    }
  ],
  "hiddenGems": [{"day_number":1,"tip":"local secret","location":"place"}]
}

Rules:
- EXACTLY ${days} days. Day 1=${form.start_date}, Day ${days}=${form.end_date}
- 3 slots/day: morning, afternoon, evening
- 2 options/slot. Keep descriptions to 1 sentence.
- category: food|attraction|adventure|rest|transport
- Don't repeat activities across days
- 1 hiddenGem per day`;

  console.log("Generating itinerary...", { days, destination: form.destination?.name });
  const startTime = Date.now();

  let raw: string;
  try {
    raw = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("LLM call failed:", err);
    throw new Error("AI generation failed. Check your API keys and try again.");
  }

  console.log(`LLM responded in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // Clean response — strip markdown fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  let result: GeneratedItinerary;
  try {
    result = JSON.parse(cleaned) as GeneratedItinerary;
  } catch (err) {
    console.error("JSON parse failed. Raw response:", cleaned.slice(0, 500));
    throw new Error("AI returned invalid data. Please try again.");
  }

  if (!result.days || !Array.isArray(result.days) || result.days.length === 0) {
    console.error("No days in response:", result);
    throw new Error("AI returned an empty itinerary. Please try again.");
  }

  // Ensure correct day count
  const paddedResult = padItineraryDays(result, days, form.start_date);

  if (paddedResult.days.length !== days) {
    console.warn(`Day count mismatch: expected ${days}, got ${paddedResult.days.length}`);
  }

  console.log(`Itinerary generated: "${paddedResult.title}", ${paddedResult.days.length} days`);
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
