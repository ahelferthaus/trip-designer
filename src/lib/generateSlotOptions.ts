import { callLLM } from "./llmClient";
import type { ActivityOption, TripVibe } from "./types";

export async function generateSlotOptions(
  destination: string,
  dayNumber: number,
  slotType: string,
  existingOptions: ActivityOption[],
  tripVibes: TripVibe[],
  budget: string | null
): Promise<ActivityOption[]> {
  const messages = [
    {
      role: "system" as const,
      content: "You are a travel planner. Generate 2 creative activity options for a specific time slot. Return ONLY valid JSON array.",
    },
    {
      role: "user" as const,
      content: `Generate 2 new activity options for ${destination}, Day ${dayNumber}, ${slotType}.

Existing options (don't duplicate these):
${existingOptions.map((o) => `- ${o.title}`).join("\n")}

Trip details:
- Vibe: ${tripVibes.join(", ") || "mixed"}
- Budget: ${budget || "mid-range"}

Return a JSON array of 2 ActivityOption objects with these fields:
{
  "title": "Activity name",
  "description": "2-3 sentences describing the activity",
  "category": "food" | "attraction" | "adventure" | "rest" | "transport",
  "estimated_cost_per_person": number (USD),
  "duration_minutes": number,
  "weather_sensitivity": "indoor" | "outdoor" | "either"
}`,
    },
  ];

  const raw = await callLLM(messages);
  const parsed = JSON.parse(raw);
  
  // Ensure it's an array
  const options = Array.isArray(parsed) ? parsed : parsed.options || [];
  
  // Add required fields
  return options.map((opt: Partial<ActivityOption>, idx: number) => ({
    id: `custom-${Date.now()}-${idx}`,
    slot_id: "temp",
    title: opt.title || "New Activity",
    description: opt.description || "",
    category: opt.category || "attraction",
    estimated_cost_per_person: opt.estimated_cost_per_person,
    duration_minutes: opt.duration_minutes,
    weather_sensitivity: opt.weather_sensitivity || "either",
    ai_generated: true,
    isCustom: false, // These are AI-generated additions
  }));
}
