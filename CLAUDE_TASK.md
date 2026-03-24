You are extending TripDesigner, an existing Vite+React+TypeScript+Tailwind app. Read the existing code before making changes. Do NOT break existing functionality.

## TASK 1: Better Booking Links

Replace `src/lib/activityLinks.ts` with smarter URL construction:

```typescript
export function getActivityLink(option: ActivityOption, destination?: string): { url: string; label: string } | null {
  const title = encodeURIComponent(option.title);
  const place = encodeURIComponent(option.location?.name ?? option.title);
  const dest = encodeURIComponent(destination ?? "");
  const query = encodeURIComponent(`${option.title} ${destination ?? ""}`);

  switch (option.category) {
    case "attraction":
      return {
        url: `https://en.wikipedia.org/wiki/Special:Search?search=${title}`,
        label: "Wikipedia",
      };
    case "food":
      return {
        url: `https://www.google.com/maps/search/${query}`,
        label: "Find on Maps",
      };
    case "adventure":
      return {
        url: `https://www.viator.com/search/${dest}?text=${title}`,
        label: "Book on Viator",
      };
    case "transport":
      return {
        url: `https://www.rome2rio.com/s/${dest}`,
        label: "Plan on Rome2Rio",
      };
    case "rest":
      return {
        url: `https://www.booking.com/searchresults.html?ss=${dest}`,
        label: "Find on Booking.com",
      };
    default:
      return {
        url: `https://www.google.com/search?q=${query}`,
        label: "Search",
      };
  }
}
```

Also add a Google Images link on every option (in addition to the category-specific link). In OptionCard, add a second link:
```
📷 See photos → https://www.google.com/search?tbm=isch&q={title}+{destination}
```

## TASK 2: AI Refinement

Add a natural language refinement prompt on the itinerary page.

1. Add a collapsible "Refine this trip" section at the TOP of the itinerary (below the nav bar, above Day 1)
2. UI: a text input + "Refine" button. Examples shown as tappable chips: "Make Day 2 more relaxed", "Add more food options", "Make it more budget-friendly"
3. Create `src/lib/refineItinerary.ts`:
   ```typescript
   import { openai } from "./openai";
   import type { GeneratedItinerary } from "./generateItinerary";
   import type { IntakeFormData } from "./types";

   export async function refineItinerary(
     current: GeneratedItinerary,
     form: IntakeFormData,
     instruction: string
   ): Promise<GeneratedItinerary> {
     const response = await openai.chat.completions.create({
       model: "gpt-4o",
       messages: [
         {
           role: "system",
           content: "You are a travel planner. The user wants to modify their existing itinerary. Return the FULL modified itinerary JSON in the exact same schema. Only change what the instruction asks for. Keep everything else identical."
         },
         {
           role: "user",
           content: `Current itinerary:\n${JSON.stringify(current, null, 2)}\n\nTrip details:\nDestination: ${form.destination?.name}\nDates: ${form.start_date} to ${form.end_date}\nBudget: ${form.budget_level}\nVibes: ${form.vibes.join(", ")}\n\nInstruction: ${instruction}`
         }
       ],
       temperature: 0.7,
       response_format: { type: "json_object" },
     });
     const raw = response.choices[0].message.content ?? "{}";
     return JSON.parse(raw) as GeneratedItinerary;
   }
   ```
4. On submit: show spinner overlay on itinerary, call refineItinerary, update itinerary in store AND re-save to localStorage via saveTrip
5. After refinement completes, collapse the refinement section and show a brief "Trip updated!" toast
6. Style: iOS-native, use existing CSS variables

## TASK 3: Supabase Collab Layer

### Database Schema
Create `supabase/schema.sql`:

```sql
create extension if not exists "uuid-ossp";

create table trips (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  passcode text not null default '1234',
  form_data jsonb not null,
  itinerary_data jsonb not null,
  created_by text not null,
  created_at timestamptz default now()
);

create table trip_members (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid references trips(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz default now(),
  unique(trip_id, display_name)
);

create table slot_selections (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid references trips(id) on delete cascade,
  member_name text not null,
  slot_id text not null,
  option_id text not null,
  updated_at timestamptz default now(),
  unique(trip_id, member_name, slot_id)
);

alter table trips enable row level security;
alter table trip_members enable row level security;
alter table slot_selections enable row level security;

create policy "Public read trips" on trips for select using (true);
create policy "Public insert trips" on trips for insert with check (true);
create policy "Public update trips" on trips for update using (true);
create policy "Public read members" on trip_members for select using (true);
create policy "Public insert members" on trip_members for insert with check (true);
create policy "Public read selections" on slot_selections for select using (true);
create policy "Public upsert selections" on slot_selections for all using (true);
```

### Supabase Service
Create `src/lib/supabaseTrips.ts` with these functions:
- `saveCloudTrip(form, itinerary, createdBy, passcode)` - save trip to Supabase, return with invite_code
- `getTripByInviteCode(code)` - fetch trip by invite code
- `joinTrip(tripId, memberName)` - upsert member
- `getTripMembers(tripId)` - list members
- `saveCloudSelection(tripId, memberName, slotId, optionId)` - upsert selection
- `getAllCloudSelections(tripId)` - get all selections grouped by member
- `subscribeToSelections(tripId, callback)` - real-time subscription to slot_selections changes

Helper: `isSupabaseConfigured()` that checks if VITE_SUPABASE_URL is set and non-empty.

### Share Trip Feature
1. After generating a trip, if Supabase is configured, auto-save to cloud alongside localStorage
2. On the itinerary page nav bar, add a "Share" button that copies invite link to clipboard: `{origin}/join/{invite_code}`
3. Show a brief "Link copied!" toast
4. Create `src/pages/JoinPage.tsx` at route `/join/:inviteCode`:
   - Fetches trip by invite code from Supabase
   - Shows trip title + destination
   - Asks for passcode (from the trip record)
   - Asks for name (free text — anyone can join, not just group members)
   - On success: joins as member, loads itinerary, navigates to /itinerary
5. Add the route in App.tsx

### Real-time Voting
On the itinerary page, if a cloud trip is active:
- Subscribe to slot_selections via Supabase real-time
- Save selections to Supabase (in addition to localStorage)
- Show who picked each option as small avatar initials next to the option

## Quality bar
- TypeScript strict — no `any`, no unused vars
- Build must pass `npm run build` with zero errors
- Do not break existing localStorage fallback — if Supabase is not configured, everything still works locally
- iOS-native styling throughout — use existing CSS variables (var(--td-accent) etc)
- All new files must use `import type` for type-only imports
- Test that `npm run build` passes before considering done
