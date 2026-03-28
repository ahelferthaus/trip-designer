import type { IntakeFormData, TripVibe, BudgetLevel, TransportMode } from "./types";
import { loadSavedTrips } from "./tripStorage";

export interface TravelDNA {
  tripCount: number;
  topVibes: TripVibe[];
  preferredBudget: BudgetLevel | null;
  preferredTransport: TransportMode | null;
  avgGroupSize: number;
  destinations: string[];
  countriesVisited: number;
}

/**
 * Analyze past trips to build a Travel DNA profile.
 * Returns null if fewer than 3 trips exist.
 */
export function buildTravelDNA(): TravelDNA | null {
  const trips = loadSavedTrips();
  if (trips.length < 3) return null;

  const forms = trips.map(t => t.form).filter(Boolean);

  // Count vibes
  const vibeCounts = new Map<TripVibe, number>();
  for (const form of forms) {
    for (const vibe of form.vibes) {
      vibeCounts.set(vibe, (vibeCounts.get(vibe) || 0) + 1);
    }
  }
  const topVibes = [...vibeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([v]) => v);

  // Preferred budget
  const budgetCounts = new Map<BudgetLevel, number>();
  for (const form of forms) {
    if (form.budget_level) {
      budgetCounts.set(form.budget_level, (budgetCounts.get(form.budget_level) || 0) + 1);
    }
  }
  const preferredBudget = budgetCounts.size > 0
    ? [...budgetCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // Preferred transport
  const transportCounts = new Map<TransportMode, number>();
  for (const form of forms) {
    if (form.transport_mode) {
      transportCounts.set(form.transport_mode, (transportCounts.get(form.transport_mode) || 0) + 1);
    }
  }
  const preferredTransport = transportCounts.size > 0
    ? [...transportCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // Average group size
  const avgGroupSize = Math.round(
    forms.reduce((sum, f) => sum + f.group_members.length, 0) / forms.length
  );

  // Destinations & countries
  const destinations = trips
    .map(t => t.destination)
    .filter(Boolean);
  const uniqueDestinations = [...new Set(destinations)];
  // Rough country estimation from destination strings
  const countryLike = new Set(
    uniqueDestinations.map(d => {
      const parts = d.split(",").map(p => p.trim());
      return parts[parts.length - 1]; // last part is usually the country
    })
  );

  return {
    tripCount: trips.length,
    topVibes,
    preferredBudget,
    preferredTransport,
    avgGroupSize,
    destinations: uniqueDestinations,
    countriesVisited: countryLike.size,
  };
}

/**
 * Pre-fill intake form defaults based on Travel DNA.
 */
export function getDNADefaults(): Partial<IntakeFormData> | null {
  const dna = buildTravelDNA();
  if (!dna) return null;

  const defaults: Partial<IntakeFormData> = {};

  if (dna.topVibes.length > 0) {
    defaults.vibes = dna.topVibes;
  }
  if (dna.preferredBudget) {
    defaults.budget_level = dna.preferredBudget;
  }
  if (dna.preferredTransport) {
    defaults.transport_mode = dna.preferredTransport;
  }

  return defaults;
}
