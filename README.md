# TripDesigner

AI-powered group trip planner. Plan together, vote on activities, collaborate in real time.

**Live Demo**: [trip-designer.vercel.app](https://trip-designer.vercel.app) *(replace with your Vercel URL)*

---

## What It Is

TripDesigner generates complete day-by-day itineraries using AI. Enter your destination, dates, group, budget, and vibe — it creates morning, afternoon, and evening slots with 2 curated options each. Your group logs in, votes on favorites, and builds the perfect trip together.

**Core differentiator**: Real-time collaborative itinerary design, not just AI suggestions.

---

## Feature Overview

### AI Itinerary Generation
- **GPT-4o** generates structured itineraries (day → slot → 2 options each)
- **Multi-LLM fallback**: Claude → Gemini if OpenAI fails or rate-limits
- **AI refinement**: Natural language edits — "make Day 2 more relaxed"
- **Hidden gems**: One local secret per day, auto-generated

### Trip Planning
- **6-step intake**: destination, dates, group composition, budget, vibes, notes
- **Lodging links**: Airbnb, VRBO, Hotels.com, Expedia (with check-in/out dates)
- **Flights link**: Google Flights (with destination + travel dates)
- **Activity links**: Wikipedia, Google Maps, Viator, Rome2Rio, Booking.com

### Maps
- **Interactive map**: Leaflet + OpenStreetMap (free, no API key)
- **Numbered markers**: Shows each stop in itinerary order
- **Route polyline**: Dashed line connecting all locations
- **Auto-fits**: Map zooms to show all points
- **Collapsible**: Starts closed, tap "🗺️ Trip Map" to open
- **Lazy-loaded**: Doesn't bloat initial page load

### Collaboration
- **Simple login**: Passcode (default: 1234) → pick your name from group
- **Per-user selections**: Each person's activity picks saved separately
- **Real-time voting**: See who picked what (avatar initials on each option)
- **Supabase cloud trips**: Share via invite link (`/join/{code}`)
- **Live updates**: Votes sync across all connected users instantly

### Persistence
- **LocalStorage**: Trips auto-save; My Trips page lists all saved
- **Supabase**: Optional cloud storage for shared trips
- **Theme**: 10 Wes Anderson film palettes + iOS default, saved to localStorage

### Themes
| Theme | Vibe |
|-------|------|
| Default | Classic, clean, predictable. Like a ham sandwich. |
| Grand Budapest | You fancy, huh? Pack your monogrammed luggage. |
| Moonrise Kingdom | Summer camp vibes. Will probably involve a canoe. |
| Royal Tenenbaums | Dysfunctional family reunion. Bring a tennis racket. |
| Fantastic Mr. Fox | Charming, slightly mischievous. Watch for farmers. |
| Life Aquatic | Marine biology meets midlife crisis. Dive in. |
| Darjeeling Limited | Train journey. Emotional baggage included. |
| French Dispatch | Journalist chic. You probably read Sartre. |
| Isle of Dogs | Dystopian but cute. Watch out for trash islands. |
| Bottle Rocket | Heist movie energy. You are definitely the mastermind. |

---

## Architecture

### Tech Stack
| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Router | React Router v7 |
| State | React Context (lightweight) |
| Maps | Leaflet + react-leaflet + OpenStreetMap |
| AI | OpenAI GPT-4o (primary), Claude/Gemini (fallback) |
| Backend | Supabase (optional) — Postgres + real-time subscriptions |
| Icons | Native emoji + inline SVG |

### Folder Structure
```
src/
├── components/
│   └── itinerary/
│       └── ItineraryMap.tsx      # Interactive map component (lazy-loaded)
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── themes.ts                 # 10 Wes Anderson palettes
│   ├── generateItinerary.ts      # GPT-4o prompt + parser
│   ├── refineItinerary.ts        # AI refinement (edit existing trip)
│   ├── llmClient.ts              # Multi-LLM fallback client
│   ├── geocode.ts                # Nominatim geocoding (OpenStreetMap)
│   ├── activityLinks.ts          # Category-specific booking links
│   ├── lodgingLinks.ts           # Airbnb/VRBO/Hotels/Expedia links
│   ├── tripStorage.ts            # LocalStorage CRUD for trips
│   ├── userSession.ts            # Current user + per-user selections
│   ├── supabase.ts               # Supabase client init
│   └── supabaseTrips.ts          # Cloud trip CRUD + real-time subscriptions
├── pages/
│   ├── HomePage.tsx              # Landing + feature cards + nav buttons
│   ├── IntakePage.tsx            # 6-step wizard
│   ├── ItineraryPage.tsx         # Full itinerary + map + voting + refinement
│   ├── TripsPage.tsx             # Saved trips list
│   ├── JoinPage.tsx              # Join shared trip via invite code
│   ├── ThemePage.tsx             # Color theme picker
│   └── SettingsPage.tsx          # AI providers, passcode, theme link
├── store/
│   ├── tripStore.ts              # Intake form state
│   ├── itineraryStore.ts         # Generated itinerary state
│   └── themeStore.ts             # Active theme + CSS variables
└── App.tsx                       # Router + providers
```

### Key Design Decisions
1. **Mobile-first**: Built for iPhone viewport; PWA-ready with `viewport-fit=cover`
2. **iOS-native**: SF Pro font, grouped lists, active:opacity-70 feedback
3. **CSS variables for themes**: All colors use `--td-*` vars; instant theme switching
4. **Lazy-loaded map**: Leaflet is ~150KB; loaded on demand via `React.lazy`
5. **LocalStorage fallback**: Works 100% offline without Supabase keys
6. **Multi-LLM resilience**: Rotates through GPT-4o → Claude → Gemini automatically

---

## Environment Variables

Create `.env` in project root:

```env
# Required: at least one LLM provider
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...      # optional fallback
VITE_GEMINI_API_KEY=AIza...            # optional fallback

# Optional: Supabase for cloud trips + real-time collaboration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select `trip-designer`
3. Add environment variables (see above)
4. Deploy — Vercel auto-detects Vite

**SPA routing fix**: `vercel.json` in repo handles React Router routes.

---

## Local Development

```bash
git clone https://github.com/ahelferthaus/trip-designer.git
cd trip-designer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Supabase Setup (Optional)

For cloud trips + real-time voting:

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL in `supabase/schema.sql` (or copy below)
3. Copy URL + anon key to `.env`

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

-- Public access policies (simpler than auth for family/friends)
alter table trips enable row level security;
alter table trip_members enable row level security;
alter table slot_selections enable row level security;

create policy "Public" on trips for all using (true) with check (true);
create policy "Public" on trip_members for all using (true) with check (true);
create policy "Public" on slot_selections for all using (true) with check (true);
```

---

## Wiki

Full documentation at: [github.com/ahelferthaus/trip-designer/wiki](https://github.com/ahelferthaus/trip-designer/wiki)

Includes:
- Architecture deep-dive
- Data model reference
- AI prompt design
- Theme system guide
- PWA & mobile setup
- Environment setup
- Phase-by-phase roadmap

---

## Roadmap

**Phase 1 ✅** — Intake + AI generation + mobile
**Phase 2 ✅** — Photos (via Google Images), booking links, AI refinement, maps
**Phase 3 ✅** — Supabase collab, real-time voting, share links
**Phase 4 🎯** — Split itineraries, conflict detection, post-trip memory book

---

## License

MIT — use freely, modify for your own trips.
