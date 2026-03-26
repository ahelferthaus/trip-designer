# VYBR

AI-powered collaborative trip planning. Generate day-by-day itineraries, vote on activities with your travel group, write in your own options, and book what's confirmed.

**Live Demo**: [trip-designer.vercel.app](https://trip-designer.vercel.app)

---

## What It Is

VYBR generates complete day-by-day itineraries using AI. Enter your destination, dates, group, budget, and vibe — it creates morning, afternoon, and evening slots with 2-3 curated options each. Your group logs in, votes on favorites, writes in their own suggestions, books confirmed plans, and builds the perfect trip together.

**Core differentiator**: Real-time collaborative itinerary design with write-ins, booking, and persistence — not just AI suggestions.

---

## Feature Overview

### AI Itinerary Generation
- **Multi-LLM**: GPT-4o (primary), Claude, Gemini (automatic fallback)
- **Structured output**: Day → time slot → 2-3 options each with cost, duration, location
- **AI refinement**: Natural language edits — "Make Day 2 more relaxed", "Add more food options"
- **Hidden gems**: One local secret per day, auto-generated

### Trip Planning
- **7-step intake**: Destination, dates, group composition, budget, vibes, notes, review
- **Travel partner presets**: Save frequent companions + named groups. Load with one tap.
- **Lodging links**: Airbnb, VRBO, Hotels.com, Expedia (with check-in/out dates)
- **Flights link**: Google Flights (with destination + travel dates)
- **Activity links**: Wikipedia, Google Maps, Viator, Rome2Rio, Booking.com

### Maps
- **Google Maps embed**: Instant load, always works, centered on destination
- **Per-activity links**: Tap any activity to open it in Google Maps
- **Day filter**: Filter map activities by day number
- **Full route view**: "Open full route in Google Maps" with waypoints

### Collaboration
- **User profiles**: Sign up for persistent trips. Display name + avatar (initials or emoji).
- **Passcode login**: Simple passcode (default: 1234) → pick your name from group
- **Auto-login**: Supabase-authenticated users skip the passcode
- **Per-user voting**: Each person picks their favorite activities per slot
- **Real-time sync**: Votes, write-ins, bookings, and moments update instantly for all users
- **Voter bubbles**: See who voted for what — avatar bubbles appear next to each option
- **Share via link**: Invite code URL (`/join/{code}`)
- **Email invitations**: Send invite emails with token-based auto-accept

### Write-in Options
- **Add your own**: Every food/activity/adventure slot has a write-in form
- **Persisted**: Stored in dedicated `trip_custom_options` table (not fragile JSON)
- **Attributed**: Shows "Added by [name]" with a "write-in" badge
- **Shared**: Visible to all trip members in real-time

### Booking
- **"Book this" button**: Mark any option as confirmed
- **Full Trip view**: Only the booked option shows for that slot (clean, final itinerary)
- **Category tabs**: Still show all options for comparison
- **Green "Booked" badge**: Visual confirmation on locked options

### Most Memorable Moment
- **Per-person entry**: Each member writes their trip highlight
- **Shared view**: Everyone sees all moments with avatar + quote
- **Persisted**: Stored in dedicated `trip_moments` table

### Persistence
- **Authenticated**: localStorage (cache) + Supabase (source of truth, keyed by user_id)
- **Anonymous**: localStorage only (no account needed to get started)
- **First login**: Existing local trips migrate to cloud automatically
- **Cross-device**: Sign in on any device to see all your trips

### Themes
10 Wes Anderson film palettes + iOS default:

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
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Realtime, Edge Functions) |
| AI | OpenAI GPT-4o, Anthropic Claude, Google Gemini (priority fallback) |
| Hosting | Vercel (serverless API routes) |
| Maps | Google Maps Embed (no API key required) |
| State | React Context (lightweight stores) |

### Project Structure
```
src/
  components/
    UserAvatar.tsx              # Shared avatar (initials/emoji)
    intake/
      CalendarPicker.tsx        # Date range picker
      GroupPresetPicker.tsx      # Load saved travel groups
    itinerary/
      ItineraryMap.tsx          # Google Maps embed + activity links
      InviteModal.tsx           # Email invite modal
      WriteInOption.tsx         # Write-in form component
    settings/
      TravelPartnersSection.tsx # Manage partners + groups
  lib/
    supabase.ts                 # Supabase client init
    supabaseTrips.ts            # Cloud CRUD: trips, selections, write-ins, moments, bookings
    tripStorage.ts              # localStorage + cloud merge
    tripInvitations.ts          # Email invitation helpers
    travelPartners.ts           # Partner/group CRUD
    userProfile.ts              # Profile get/upsert
    userSession.ts              # Local session (current user, selections)
    generateItinerary.ts        # AI itinerary generation
    refineItinerary.ts          # AI refinement
    llmClient.ts                # Multi-provider LLM abstraction
    types.ts                    # All TypeScript interfaces
    themes.ts                   # 10 Wes Anderson color themes
  pages/
    HomePage.tsx                # Landing page with avatar + trip count
    AuthPage.tsx                # Sign in / sign up
    IntakePage.tsx              # 7-step trip wizard
    ItineraryPage.tsx           # Main trip view (voting, write-ins, booking)
    TripsPage.tsx               # Saved trips list (local + cloud)
    JoinPage.tsx                # Join via invite link
    SettingsPage.tsx            # Profile, partners, passcode, AI providers
    ThemePage.tsx               # Theme picker
  store/
    authStore.ts                # Auth context + profile
    tripStore.ts                # Intake form state
    itineraryStore.ts           # Itinerary + cloud state
    themeStore.ts               # Theme context
supabase/
  schema.sql                    # Full database schema
  migrations/
    001_user_features.sql       # User profiles, partners, groups, invitations
    002_trip_extras.sql         # Write-ins, moments, booked slots
  functions/
    send-trip-invite/           # Edge Function: email invites
api/
  generate.ts                   # Vercel serverless: AI generation
  refine.ts                     # Vercel serverless: AI refinement
```

### Key Design Decisions
1. **Mobile-first**: Built for iPhone viewport; PWA-ready with `viewport-fit=cover`
2. **iOS-native feel**: SF Pro font, grouped lists, active:opacity-70 feedback
3. **CSS variables for themes**: All colors use `--td-*` vars; instant theme switching
4. **Dedicated tables for user data**: Write-ins, moments, bookings each get their own table (no fragile JSON mutation)
5. **LocalStorage fallback**: Works 100% offline without Supabase keys
6. **Multi-LLM resilience**: Rotates through GPT-4o → Claude → Gemini automatically

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `trips` | Trip metadata, form data, itinerary JSON, user_id FK |
| `trip_members` | Who joined each trip (display name + optional user_id) |
| `slot_selections` | Per-user votes on activity slots (real-time) |
| `trip_custom_options` | Write-in activities added by members (real-time) |
| `trip_moments` | "Most Memorable Moment" per member (real-time) |
| `trip_booked_slots` | Which option is locked/booked per slot (real-time) |
| `user_profiles` | Display name, avatar type/value |
| `travel_partners` | Saved travel companions |
| `partner_groups` | Named groups of partners |
| `trip_invitations` | Email invite tokens + status |

All trip-scoped tables use public RLS (anyone with the link can participate). User-scoped tables are restricted to the owning user.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- At least one AI API key (OpenAI, Anthropic, or Gemini)

### Setup

```bash
git clone https://github.com/ahelferthaus/trip-designer.git
cd trip-designer
npm install
```

Create `.env` in the project root:

```env
# Supabase (required for collaboration features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# At least one AI provider (priority: OpenAI > Claude > Gemini)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GEMINI_API_KEY=AIza...
```

### Database Setup

Run the full schema against your Supabase project (paste into the SQL Editor):

```bash
psql $DATABASE_URL < supabase/schema.sql
```

Or run migrations incrementally:

```bash
psql $DATABASE_URL < supabase/migrations/001_user_features.sql
psql $DATABASE_URL < supabase/migrations/002_trip_extras.sql
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Deploy to Vercel

```bash
vercel --prod
```

Set environment variables in Vercel project settings. For production, use server-side keys (without the `VITE_` prefix) in `api/` routes:

| Variable | Where | Purpose |
|----------|-------|---------|
| `OPENAI_API_KEY` | Vercel only | Server-side OpenAI calls (secure) |
| `ANTHROPIC_API_KEY` | Vercel only | Server-side Claude fallback (secure) |
| `GEMINI_API_KEY` | Vercel only | Server-side Gemini fallback (secure) |
| `VITE_OPENAI_API_KEY` | `.env` local | Client-side fallback for local dev |
| `VITE_SUPABASE_URL` | Both | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Both | Supabase anon key (safe to expose) |

**Rule**: `VITE_` = browser can see it. No prefix = server-side only on Vercel.

### Add to iPhone Home Screen
1. Open the Vercel URL in Safari
2. Tap **Share** → **Add to Home Screen**
3. Launches full-screen like a native app

---

## Wiki

Full documentation: [github.com/ahelferthaus/trip-designer/wiki](https://github.com/ahelferthaus/trip-designer/wiki)

---

## Roadmap

- **Phase 1** ✅ — Intake + AI generation + mobile UI
- **Phase 2** ✅ — Booking links, AI refinement, maps
- **Phase 3** ✅ — Supabase collab, real-time voting, share links
- **Phase 4** ✅ — User profiles, persistent trips, write-ins, booking, email invites
- **Phase 5** 🎯 — iOS wrapper (Capacitor), camera, HealthKit, post-trip memory book

---

## License

MIT — use freely, modify for your own trips.
