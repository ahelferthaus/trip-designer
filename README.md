# VYBR

AI-powered travel companion. Plan trips, vote with your group, capture photos, create movies, send postcards, and order photo books.

**Live at [vybrtravel.com](https://vybrtravel.com)**

---

## Features

### Trip Planning
- **AI itinerary generation** — GPT-4o / Claude / Gemini with automatic fallback
- **7-step intake wizard** — Destination, dates, group, budget, vibes, notes, review
- **Travel partner presets** — Save companions + named groups, load with one tap
- **Real-time collaboration** — Share via invite link, vote on activities together
- **Write-in options** — Add your own activities, visible to all members
- **Per-category booking** — Book activities and food independently, unbook anytime
- **AI refinement** — "Make Day 2 more relaxed", "Add more food options"

### Maps
- **Mapbox satellite hero** — Full-bleed satellite map with route line + numbered markers (when token set)
- **Interactive detailed map** — Day filter, fly-to animation, activity popups
- **Google Maps fallback** — Works without Mapbox token

### Social
- **User profiles** — Display name, avatar, bio, home location, Polarsteps-style onboarding
- **Follow system** — One-way follows with pending/accepted for private accounts
- **Activity feed** — See friends' published trips, comments, likes, clones
- **Comments** — Threaded replies on public trips
- **Likes** — Heart toggle with count
- **Public trips** — Publish, search, clone, review with star ratings

### Media
- **Per-activity photos** — One photo per person per slot, camera or gallery upload
- **Trip movie generator** — Auto-creates 9:16 vertical video from photos + itinerary with Ken Burns effect, shareable via Web Share API
- **Photo book creator** — Auto-generates 20+ page book, 2 premium templates, thumbnail editor, PDF export, Lulu print ordering
- **Postcards** — 3 templates (Minimal, Vintage, Family), send via email/SMS/physical mail (Thanks.io API)

### Experience
- **Satellite hero map** — Cinematic trip overview with route visualization
- **Scroll-reveal animations** — Elements fade up as you scroll
- **Breathing hero photos** — Subtle scale pulse on destination images
- **Spring-back buttons** — Bouncy press interactions
- **10 Wes Anderson themes** — Color palettes from Grand Budapest to Bottle Rocket
- **Gamification** — Opt-in XP, badges, streaks, daily rewards (Settings toggle)
- **Most Memorable Moment** — Each person shares their highlight
- **Marketing landing page** — Dark hero at `/`, app at `/home`
- **College tour trips** — Campus visits with nearby college comparisons
- **Travel themes** — 13 themes (soccer, skiing, food & wine, college tour, etc.)
- **Autofill search** — Typeahead suggestions on the Explore page
- **Category filters** — 12 filter pills (Weekends, Family, Soccer, Skiing, etc.)
- **52+ seed trips** — Pre-loaded itineraries across 7 categories
- **API key tester** — `/admin/api-test` validates all connected services

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript 5.9, Vite 8, Tailwind CSS 4 |
| Backend | Supabase (Postgres, Auth, Realtime, Edge Functions, Storage) |
| AI | OpenAI GPT-4o, Anthropic Claude, Google Gemini |
| Maps | Mapbox GL (primary), Google Maps Embed (fallback) |
| Video | Canvas API + MediaRecorder (browser-native) |
| PDF | jsPDF + html2canvas |
| Print | Lulu API (photo books), Thanks.io API (postcards) |
| State | React Context + Zustand (gamification) |
| Hosting | Vercel + Cloudflare (CDN, WAF, SSL) |
| Domain | [vybrtravel.com](https://vybrtravel.com) |

---

## Getting Started

```bash
git clone https://github.com/ahelferthaus/trip-designer.git
cd trip-designer
npm install
```

Create `.env` (see `.env.example`):

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-...

# Optional AI fallbacks
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GEMINI_API_KEY=AIza...

# Optional: Mapbox (satellite hero map)
VITE_MAPBOX_TOKEN=pk.eyJ1...

# Optional: Print providers
VITE_LULU_API_KEY=...
VITE_THANKS_IO_API_KEY=...
```

### Database Setup

Run migrations in order in the Supabase SQL Editor:

```
supabase/migrations/005_catch_up.sql    — All core tables (idempotent)
supabase/migrations/006_photos.sql      — Trip photos
supabase/migrations/007_profile_onboarding.sql — Username, avatar URL
supabase/migrations/008_photo_books.sql — Photo book drafts
supabase/migrations/009_postcards.sql   — Postcards
```

### Run Locally

```bash
npm run dev
```

### Deploy to Vercel

Set env vars (use `OPENAI_API_KEY` without `VITE_` prefix for server-side) and push to main.

---

## Database Schema (14 tables)

| Table | Purpose |
|-------|---------|
| `trips` | Trip data, itinerary JSON, publishing, search vector |
| `trip_members` | Who joined each trip |
| `slot_selections` | Per-user votes |
| `trip_custom_options` | Write-in activities |
| `trip_moments` | Memorable moments |
| `trip_booked_slots` | Booked/confirmed options |
| `trip_photos` | Per-activity photos |
| `trip_reviews` | Star ratings + text reviews |
| `trip_comments` | Threaded comments |
| `trip_likes` | Like/heart on trips |
| `user_profiles` | Display name, avatar, bio, username |
| `travel_partners` | Saved companions |
| `partner_groups` | Named groups |
| `user_follows` | Social follow system |
| `activity_feed` | Activity feed items |
| `trip_invitations` | Email invite tokens |
| `photo_books` | Photo book drafts + orders |
| `postcards` | Postcard history + delivery tracking |

---

## Project Structure

```
src/
  components/
    BottomTabBar.tsx            # 5-tab navigation
    UserAvatar.tsx              # Avatar (initials/emoji/upload)
    PlanTripButton.tsx          # Island-themed CTA
    gamification/               # XP, badges, streaks, daily rewards
    itinerary/
      TripHeroMap.tsx           # Satellite hero map with route
      ItineraryMap.tsx          # Interactive detailed map
      SlotPhotos.tsx            # Per-slot photo strip + lightbox
      InviteModal.tsx           # Email invite
    intake/
      CalendarPicker.tsx        # Date picker
      GroupPresetPicker.tsx     # Load saved groups
    settings/
      TravelPartnersSection.tsx # Partner management
  lib/
    supabaseTrips.ts            # Cloud CRUD + realtime
    tripStorage.ts              # localStorage + cloud merge
    publicTrips.ts              # Search, clone, reviews
    social.ts                   # Follows, comments, likes, feed
    tripPhotos.ts               # Photo upload + retrieval
    photoBook.ts                # Book generation + CRUD
    bookExport.ts               # PDF generation
    printProvider.ts            # Lulu print ordering
    postcardProvider.ts         # Email/SMS/print postcards
    tripMovie.ts                # Video generator (Canvas + MediaRecorder)
    generateItinerary.ts        # AI generation
    refineItinerary.ts          # AI refinement
    llmClient.ts                # Multi-LLM abstraction
    userProfile.ts              # Profile CRUD
    useReveal.ts                # Scroll-reveal animation hook
    types.ts                    # TypeScript interfaces
  pages/
    HomePage.tsx                # Hero with satellite earth bg
    AuthPage.tsx                # Sign in / up
    OnboardingPage.tsx          # Polarsteps-style profile setup
    IntakePage.tsx              # 7-step wizard + generation
    ItineraryPage.tsx           # Main trip view (hero map + activities)
    TripsPage.tsx               # Saved trips list
    ExplorePage.tsx             # Public trip search
    TripDetailPage.tsx          # Public trip view + timeline itinerary
    FeedPage.tsx                # Activity feed
    ProfilePage.tsx             # User profile + trip gallery
    PhotoBookPage.tsx           # Book editor + PDF export
    PostcardPage.tsx            # Postcard composer
    TripMoviePage.tsx           # Video generator
    JoinPage.tsx                # Join via invite link
    SettingsPage.tsx            # Profile, partners, gamification toggle
    ThemePage.tsx               # 10 theme picker
  store/
    authStore.ts                # Auth + profile context
    tripStore.ts                # Intake form
    itineraryStore.ts           # Itinerary + cloud state
    themeStore.ts               # Theme context
    gamificationStore.ts        # XP, badges, streaks (Zustand)
```

---

## License

MIT
