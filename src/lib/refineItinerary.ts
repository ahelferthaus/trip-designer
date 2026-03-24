import { callRefineLLM } from "./llmClient";
import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData } from "./types";

export async function refineItinerary(
  current: GeneratedItinerary,
  form: IntakeFormData,
  instruction: string
): Promise<GeneratedItinerary> {
  const raw = await callRefineLLM([
    {
      role: "system",
      content:
        "You are a travel planner. The user wants to modify their existing itinerary. Return the FULL modified itinerary JSON in the exact same schema. Only change what the instruction asks for. Keep everything else identical.",
    },
    {
      role: "user",
      content: `Current itinerary:\n${JSON.stringify(current, null, 2)}\n\nTrip details:\nDestination: ${form.destination?.name}\nDates: ${form.start_date} to ${form.end_date}\nBudget: ${form.budget_level}\nVibes: ${form.vibes.join(", ")}\n\nInstruction: ${instruction}`,
    },
  ]);
  return JSON.parse(raw) as GeneratedItinerary;
}
