/**
 * Seed trip definitions for pre-loaded itineraries.
 * Each entry will be generated via AI and published as a public trip.
 */

import type { IntakeFormData, BudgetLevel, TripVibe, TravelTheme } from "./types";

export interface SeedTrip {
  destination: string;
  days: number;
  startDay: "saturday" | "friday" | "monday"; // for calculating dates
  budget: BudgetLevel;
  vibes: TripVibe[];
  theme?: TravelTheme;
  must_haves?: string;
  tags: string[];
}

// Helper: get next occurrence of a weekday
function getNextWeekday(day: "saturday" | "friday" | "monday"): string {
  const dayMap = { saturday: 6, friday: 5, monday: 1 };
  const target = dayMap[day];
  const d = new Date();
  d.setMonth(d.getMonth() + 1); // Start a month out
  while (d.getDay() !== target) d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export function seedTripToForm(seed: SeedTrip): IntakeFormData {
  const start = getNextWeekday(seed.startDay);
  const end = addDays(start, seed.days);
  return {
    destination: { name: seed.destination },
    start_date: start,
    end_date: end,
    group_members: [{ name: "Traveler", type: "adult" }],
    budget_level: seed.budget,
    vibes: seed.vibes,
    travel_theme: seed.theme,
    must_haves: seed.must_haves,
  };
}

// === EUROPE: 1 week (Sat-Sat) per country ===
export const EUROPE_TRIPS: SeedTrip[] = [
  { destination: "Paris, France", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "romance"], tags: ["paris", "france", "europe"] },
  { destination: "Rome, Italy", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food"], tags: ["rome", "italy", "europe"] },
  { destination: "Barcelona, Spain", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "nightlife"], theme: "sports-soccer", must_haves: "Visit Camp Nou. Check for FC Barcelona match.", tags: ["barcelona", "spain", "europe", "soccer"] },
  { destination: "Madrid, Spain", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "nightlife"], theme: "sports-soccer", must_haves: "Visit Santiago Bernabéu. Check for Real Madrid match.", tags: ["madrid", "spain", "europe", "soccer"] },
  { destination: "London, England", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "nightlife"], tags: ["london", "england", "europe"] },
  { destination: "Amsterdam, Netherlands", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "nightlife", "nature"], tags: ["amsterdam", "netherlands", "europe"] },
  { destination: "Berlin, Germany", days: 7, startDay: "saturday", budget: "budget", vibes: ["culture", "nightlife"], tags: ["berlin", "germany", "europe"] },
  { destination: "Munich, Germany", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food"], tags: ["munich", "germany", "europe"] },
  { destination: "Prague, Czech Republic", days: 7, startDay: "saturday", budget: "budget", vibes: ["culture", "nightlife"], tags: ["prague", "czech", "europe"] },
  { destination: "Vienna, Austria", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "relaxed"], tags: ["vienna", "austria", "europe"] },
  { destination: "Lisbon, Portugal", days: 7, startDay: "saturday", budget: "budget", vibes: ["culture", "food", "nightlife"], tags: ["lisbon", "portugal", "europe"] },
  { destination: "Athens, Greece", days: 7, startDay: "saturday", budget: "budget", vibes: ["culture", "food", "nature"], tags: ["athens", "greece", "europe"] },
  { destination: "Santorini, Greece", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "relaxed", "food"], tags: ["santorini", "greece", "europe", "beach"] },
  { destination: "Dubrovnik, Croatia", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "nature", "relaxed"], tags: ["dubrovnik", "croatia", "europe"] },
  { destination: "Split, Croatia", days: 7, startDay: "saturday", budget: "mid", vibes: ["adventure", "culture", "food"], tags: ["split", "croatia", "europe"] },
  { destination: "Edinburgh, Scotland", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "nature", "food"], tags: ["edinburgh", "scotland", "europe"] },
  { destination: "Dublin, Ireland", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "nightlife", "food"], tags: ["dublin", "ireland", "europe"] },
  { destination: "Copenhagen, Denmark", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food"], tags: ["copenhagen", "denmark", "europe"] },
  { destination: "Stockholm, Sweden", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "nature"], tags: ["stockholm", "sweden", "europe"] },
  { destination: "Reykjavik, Iceland", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature"], tags: ["reykjavik", "iceland", "europe"] },
  { destination: "Budapest, Hungary", days: 7, startDay: "saturday", budget: "budget", vibes: ["culture", "nightlife", "food"], theme: "wellness-spa", tags: ["budapest", "hungary", "europe", "spa"] },
  { destination: "Florence, Italy", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food"], theme: "art-museums", tags: ["florence", "italy", "europe", "art"] },
  { destination: "Venice, Italy", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "culture"], tags: ["venice", "italy", "europe"] },
  { destination: "Amalfi Coast, Italy", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "food", "relaxed"], tags: ["amalfi", "italy", "europe", "beach"] },
  { destination: "Swiss Alps, Switzerland", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature", "relaxed"], theme: "hiking-nature", tags: ["swiss-alps", "switzerland", "europe", "hiking"] },
  { destination: "Bruges, Belgium", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "relaxed"], tags: ["bruges", "belgium", "europe"] },
  { destination: "Seville, Spain", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "nightlife"], tags: ["seville", "spain", "europe"] },
  { destination: "Istanbul, Turkey", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "adventure"], tags: ["istanbul", "turkey", "europe"] },
  { destination: "Cinque Terre, Italy", days: 7, startDay: "saturday", budget: "mid", vibes: ["nature", "food", "relaxed"], theme: "hiking-nature", tags: ["cinque-terre", "italy", "europe", "hiking"] },
  { destination: "Nice, France", days: 7, startDay: "saturday", budget: "splurge", vibes: ["relaxed", "food", "romance"], tags: ["nice", "france", "europe", "beach"] },
];

// === US WEEKEND TRIPS ===
export const US_WEEKEND_TRIPS: SeedTrip[] = [
  { destination: "New York City, NY", days: 3, startDay: "friday", budget: "mid", vibes: ["culture", "food", "nightlife"], tags: ["nyc", "usa", "weekend"] },
  { destination: "Los Angeles, CA", days: 3, startDay: "friday", budget: "mid", vibes: ["relaxed", "food", "nightlife"], tags: ["la", "usa", "weekend"] },
  { destination: "San Francisco, CA", days: 3, startDay: "friday", budget: "mid", vibes: ["culture", "food", "nature"], tags: ["sf", "usa", "weekend"] },
  { destination: "Chicago, IL", days: 3, startDay: "friday", budget: "mid", vibes: ["culture", "food"], tags: ["chicago", "usa", "weekend"] },
  { destination: "Miami, FL", days: 3, startDay: "friday", budget: "mid", vibes: ["nightlife", "food", "relaxed"], tags: ["miami", "usa", "weekend", "beach"] },
  { destination: "Austin, TX", days: 3, startDay: "friday", budget: "mid", vibes: ["food", "nightlife"], tags: ["austin", "usa", "weekend"] },
  { destination: "Nashville, TN", days: 3, startDay: "friday", budget: "mid", vibes: ["nightlife", "food"], theme: "nightlife-music", tags: ["nashville", "usa", "weekend", "music"] },
  { destination: "New Orleans, LA", days: 3, startDay: "friday", budget: "mid", vibes: ["food", "nightlife", "culture"], tags: ["nola", "usa", "weekend"] },
  { destination: "Denver, CO", days: 3, startDay: "friday", budget: "mid", vibes: ["adventure", "nature", "food"], tags: ["denver", "usa", "weekend"] },
  { destination: "Seattle, WA", days: 3, startDay: "friday", budget: "mid", vibes: ["culture", "food", "nature"], tags: ["seattle", "usa", "weekend"] },
  { destination: "Portland, OR", days: 3, startDay: "friday", budget: "budget", vibes: ["food", "nature"], tags: ["portland", "usa", "weekend"] },
  { destination: "San Diego, CA", days: 3, startDay: "friday", budget: "mid", vibes: ["relaxed", "food", "nature"], tags: ["san-diego", "usa", "weekend", "beach"] },
  { destination: "Washington DC", days: 3, startDay: "friday", budget: "mid", vibes: ["culture"], theme: "history", tags: ["dc", "usa", "weekend", "history"] },
  { destination: "Boston, MA", days: 3, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "history", tags: ["boston", "usa", "weekend"] },
  { destination: "Charleston, SC", days: 3, startDay: "friday", budget: "mid", vibes: ["food", "culture", "relaxed"], tags: ["charleston", "usa", "weekend"] },
  { destination: "Savannah, GA", days: 3, startDay: "friday", budget: "budget", vibes: ["culture", "food", "relaxed"], tags: ["savannah", "usa", "weekend"] },
  { destination: "Las Vegas, NV", days: 3, startDay: "friday", budget: "splurge", vibes: ["nightlife", "food"], tags: ["vegas", "usa", "weekend"] },
  { destination: "Scottsdale, AZ", days: 3, startDay: "friday", budget: "splurge", vibes: ["relaxed", "food"], theme: "wellness-spa", tags: ["scottsdale", "usa", "weekend", "spa"] },
  { destination: "Hawaii (Maui)", days: 3, startDay: "friday", budget: "splurge", vibes: ["relaxed", "nature", "adventure"], tags: ["maui", "hawaii", "usa", "weekend", "beach"] },
  { destination: "Key West, FL", days: 3, startDay: "friday", budget: "mid", vibes: ["relaxed", "food", "nightlife"], tags: ["key-west", "usa", "weekend", "beach"] },
];

// === SKI RESORTS ===
export const SKI_TRIPS: SeedTrip[] = [
  { destination: "Vail, CO", days: 4, startDay: "friday", budget: "splurge", vibes: ["adventure", "relaxed"], theme: "skiing", tags: ["vail", "usa", "skiing", "winter"] },
  { destination: "Aspen, CO", days: 4, startDay: "friday", budget: "splurge", vibes: ["adventure", "nightlife"], theme: "skiing", tags: ["aspen", "usa", "skiing", "winter"] },
  { destination: "Park City, UT", days: 4, startDay: "friday", budget: "mid", vibes: ["adventure", "family"], theme: "skiing", tags: ["park-city", "usa", "skiing", "winter"] },
  { destination: "Jackson Hole, WY", days: 4, startDay: "friday", budget: "splurge", vibes: ["adventure", "nature"], theme: "skiing", tags: ["jackson-hole", "usa", "skiing", "winter"] },
  { destination: "Whistler, BC, Canada", days: 4, startDay: "friday", budget: "splurge", vibes: ["adventure", "nature"], theme: "skiing", tags: ["whistler", "canada", "skiing", "winter"] },
  { destination: "Chamonix, France", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature", "food"], theme: "skiing", tags: ["chamonix", "france", "skiing", "winter", "europe"] },
  { destination: "Zermatt, Switzerland", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "relaxed"], theme: "skiing", tags: ["zermatt", "switzerland", "skiing", "winter", "europe"] },
  { destination: "Steamboat Springs, CO", days: 4, startDay: "friday", budget: "mid", vibes: ["adventure", "family"], theme: "skiing", tags: ["steamboat", "usa", "skiing", "winter"] },
  { destination: "Big Sky, MT", days: 4, startDay: "friday", budget: "mid", vibes: ["adventure", "nature"], theme: "skiing", tags: ["big-sky", "usa", "skiing", "winter"] },
  { destination: "Telluride, CO", days: 4, startDay: "friday", budget: "splurge", vibes: ["adventure", "relaxed", "nature"], theme: "skiing", tags: ["telluride", "usa", "skiing", "winter"] },
];

// === SPORTS/SOCCER TRIPS ===
export const SOCCER_TRIPS: SeedTrip[] = [
  { destination: "Barcelona, Spain", days: 5, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "Camp Nou tour, check for FC Barcelona match", tags: ["barcelona", "spain", "soccer", "sports"] },
  { destination: "Madrid, Spain", days: 5, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "Santiago Bernabéu tour, check for Real Madrid match", tags: ["madrid", "spain", "soccer", "sports"] },
  { destination: "Manchester, England", days: 4, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "Old Trafford tour, National Football Museum", tags: ["manchester", "england", "soccer", "sports"] },
  { destination: "Liverpool, England", days: 4, startDay: "friday", budget: "mid", vibes: ["culture", "nightlife"], theme: "sports-soccer", must_haves: "Anfield stadium tour, The Beatles Story", tags: ["liverpool", "england", "soccer", "sports"] },
  { destination: "Milan, Italy", days: 5, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "San Siro stadium, check for AC Milan or Inter match", tags: ["milan", "italy", "soccer", "sports"] },
  { destination: "Munich, Germany", days: 5, startDay: "friday", budget: "mid", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "Allianz Arena tour, check for Bayern Munich match", tags: ["munich", "germany", "soccer", "sports"] },
  { destination: "Lisbon, Portugal", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "food"], theme: "sports-soccer", must_haves: "Estádio da Luz tour, check for Benfica match", tags: ["lisbon", "portugal", "soccer", "sports"] },
  { destination: "Buenos Aires, Argentina", days: 7, startDay: "saturday", budget: "mid", vibes: ["culture", "food", "nightlife"], theme: "sports-soccer", must_haves: "La Bombonera tour, check for Boca Juniors match", tags: ["buenos-aires", "argentina", "soccer", "sports"] },
];

export const ALL_SEED_TRIPS: SeedTrip[] = [
  ...EUROPE_TRIPS,
  ...US_WEEKEND_TRIPS,
  ...SKI_TRIPS,
  ...SOCCER_TRIPS,
];
