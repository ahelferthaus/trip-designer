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

// === FAMILY SPRING BREAK ===
export const FAMILY_SPRING_BREAK: SeedTrip[] = [
  { destination: "Orlando, FL", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "adventure"], must_haves: "Walt Disney World, Universal Studios", tags: ["orlando", "usa", "family", "spring-break", "theme-park"] },
  { destination: "Cancun, Mexico", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "relaxed", "adventure"], must_haves: "Kid-friendly resort, snorkeling, Xcaret park", tags: ["cancun", "mexico", "family", "spring-break", "beach"] },
  { destination: "San Diego, CA", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "nature", "relaxed"], must_haves: "San Diego Zoo, LEGOLAND, beach day", tags: ["san-diego", "usa", "family", "spring-break"] },
  { destination: "Maui, Hawaii", days: 7, startDay: "saturday", budget: "splurge", vibes: ["family", "nature", "relaxed"], must_haves: "Road to Hana, snorkeling, luau", tags: ["maui", "hawaii", "usa", "family", "spring-break", "beach"] },
  { destination: "Costa Rica", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "adventure", "nature"], must_haves: "Zip-lining, wildlife, hot springs, beach", tags: ["costa-rica", "family", "spring-break", "adventure"] },
  { destination: "Riviera Maya, Mexico", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "culture", "relaxed"], must_haves: "Chichen Itza, cenotes, beach resort", tags: ["riviera-maya", "mexico", "family", "spring-break"] },
  { destination: "Hilton Head, SC", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "relaxed", "nature"], tags: ["hilton-head", "usa", "family", "spring-break", "beach"] },
  { destination: "Bahamas", days: 7, startDay: "saturday", budget: "splurge", vibes: ["family", "relaxed"], must_haves: "Atlantis resort, swimming with dolphins", tags: ["bahamas", "family", "spring-break", "beach"] },
  { destination: "Washington DC", days: 7, startDay: "saturday", budget: "budget", vibes: ["family", "culture"], theme: "history", must_haves: "Smithsonian museums (free), monuments, National Zoo", tags: ["dc", "usa", "family", "spring-break", "history"] },
  { destination: "Yellowstone, WY", days: 7, startDay: "saturday", budget: "mid", vibes: ["family", "nature", "adventure"], theme: "hiking-nature", must_haves: "Old Faithful, wildlife spotting, Grand Prismatic Spring", tags: ["yellowstone", "usa", "family", "spring-break", "nature"] },
];

// === COLLEGE SPRING BREAK ===
export const COLLEGE_SPRING_BREAK: SeedTrip[] = [
  { destination: "Cancun, Mexico", days: 5, startDay: "saturday", budget: "budget", vibes: ["nightlife", "relaxed"], must_haves: "Beach clubs, party zone, day trip to Isla Mujeres", tags: ["cancun", "mexico", "college", "spring-break", "party"] },
  { destination: "Miami Beach, FL", days: 5, startDay: "saturday", budget: "mid", vibes: ["nightlife", "food", "relaxed"], must_haves: "South Beach, Wynwood, clubs on Ocean Drive", tags: ["miami", "usa", "college", "spring-break", "party", "beach"] },
  { destination: "Cabo San Lucas, Mexico", days: 5, startDay: "saturday", budget: "mid", vibes: ["nightlife", "adventure", "relaxed"], must_haves: "El Arco, beach clubs, whale watching", tags: ["cabo", "mexico", "college", "spring-break", "party"] },
  { destination: "Puerto Vallarta, Mexico", days: 5, startDay: "saturday", budget: "budget", vibes: ["nightlife", "food", "relaxed"], tags: ["puerto-vallarta", "mexico", "college", "spring-break", "beach"] },
  { destination: "Nassau, Bahamas", days: 5, startDay: "saturday", budget: "mid", vibes: ["nightlife", "relaxed"], tags: ["nassau", "bahamas", "college", "spring-break", "beach"] },
  { destination: "South Padre Island, TX", days: 4, startDay: "friday", budget: "budget", vibes: ["nightlife", "relaxed"], tags: ["south-padre", "usa", "college", "spring-break", "party"] },
  { destination: "Panama City Beach, FL", days: 4, startDay: "friday", budget: "budget", vibes: ["nightlife", "relaxed"], tags: ["pcb", "usa", "college", "spring-break", "party"] },
  { destination: "Punta Cana, Dominican Republic", days: 5, startDay: "saturday", budget: "mid", vibes: ["nightlife", "relaxed"], must_haves: "All-inclusive resort, catamaran party", tags: ["punta-cana", "dr", "college", "spring-break", "beach"] },
  { destination: "Austin, TX", days: 4, startDay: "friday", budget: "budget", vibes: ["nightlife", "food"], theme: "nightlife-music", must_haves: "6th Street, live music, BBQ", tags: ["austin", "usa", "college", "spring-break", "music"] },
  { destination: "New Orleans, LA", days: 4, startDay: "friday", budget: "budget", vibes: ["nightlife", "food", "culture"], must_haves: "Bourbon Street, jazz, beignets", tags: ["nola", "usa", "college", "spring-break", "party"] },
];

// === BUDGET TRIPS (under $1000 total) ===
export const BUDGET_TRIPS: SeedTrip[] = [
  { destination: "Lisbon, Portugal", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "food"], tags: ["lisbon", "portugal", "europe", "budget-friendly"] },
  { destination: "Bangkok, Thailand", days: 7, startDay: "saturday", budget: "budget", vibes: ["food", "culture", "adventure"], tags: ["bangkok", "thailand", "asia", "budget-friendly"] },
  { destination: "Mexico City, Mexico", days: 5, startDay: "friday", budget: "budget", vibes: ["food", "culture"], tags: ["cdmx", "mexico", "budget-friendly"] },
  { destination: "Budapest, Hungary", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "nightlife"], theme: "wellness-spa", tags: ["budapest", "hungary", "europe", "budget-friendly"] },
  { destination: "Krakow, Poland", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "food"], tags: ["krakow", "poland", "europe", "budget-friendly"] },
  { destination: "Bali, Indonesia", days: 7, startDay: "saturday", budget: "budget", vibes: ["relaxed", "nature", "culture"], tags: ["bali", "indonesia", "asia", "budget-friendly"] },
  { destination: "Marrakech, Morocco", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "food", "adventure"], tags: ["marrakech", "morocco", "africa", "budget-friendly"] },
  { destination: "Bogota, Colombia", days: 5, startDay: "friday", budget: "budget", vibes: ["culture", "food", "adventure"], tags: ["bogota", "colombia", "budget-friendly"] },
];

// === LUXURY TRIPS (splurge, $5000+) ===
export const LUXURY_TRIPS: SeedTrip[] = [
  { destination: "Maldives", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "relaxed"], tags: ["maldives", "asia", "luxury", "beach", "honeymoon"] },
  { destination: "Bora Bora, French Polynesia", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "relaxed"], tags: ["bora-bora", "luxury", "beach", "honeymoon"] },
  { destination: "Amalfi Coast, Italy", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "food", "culture"], tags: ["amalfi", "italy", "europe", "luxury"] },
  { destination: "Santorini, Greece", days: 7, startDay: "saturday", budget: "splurge", vibes: ["romance", "food", "relaxed"], tags: ["santorini", "greece", "europe", "luxury", "honeymoon"] },
  { destination: "Swiss Alps, Switzerland", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature", "relaxed"], theme: "skiing", tags: ["swiss-alps", "switzerland", "europe", "luxury"] },
  { destination: "Kyoto, Japan", days: 7, startDay: "saturday", budget: "splurge", vibes: ["culture", "food", "relaxed"], tags: ["kyoto", "japan", "asia", "luxury"] },
  { destination: "Safari — Serengeti, Tanzania", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature"], tags: ["serengeti", "tanzania", "africa", "luxury", "safari"] },
  { destination: "Patagonia, Argentina", days: 7, startDay: "saturday", budget: "splurge", vibes: ["adventure", "nature"], theme: "hiking-nature", tags: ["patagonia", "argentina", "luxury", "hiking"] },
];

export const ALL_SEED_TRIPS: SeedTrip[] = [
  ...EUROPE_TRIPS,
  ...US_WEEKEND_TRIPS,
  ...SKI_TRIPS,
  ...SOCCER_TRIPS,
  ...FAMILY_SPRING_BREAK,
  ...COLLEGE_SPRING_BREAK,
  ...BUDGET_TRIPS,
  ...LUXURY_TRIPS,
];
