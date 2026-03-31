# VYBR Travel

AI-powered travel companion. Plan trips with AI, vote with your group, track your journey, capture photos, create movies, send postcards, and order photo books.

**Live at [vybrtravel.com](https://vybrtravel.com)**

---

## What VYBR Does

### Pre-Trip: AI-Powered Planning
- **8-step intake wizard** — Destination, dates, group, transport mode, budget, vibes, dietary/mobility notes, review
- **Multi-LLM itinerary generation** — GPT-4o primary, Claude Sonnet & Gemini Flash fallback. 3 slots/day (morning, afternoon, evening), 2 options each
- **12 travel themes** — Soccer, skiing, food & wine, art, history, beach, hiking, nightlife, wellness, photography, college tours, general
- **Transport mode planning** — Flight, train, car, bus, or mixed baked into the AI prompt
- **Travel DNA** — After 3+ trips, analyzes your patterns (vibes, budget, transport) and pre-fills defaults
- **42 pre-built trips** in the database ready to browse and customize
- **126 seed trip definitions** across 8 categories (Europe, US Weekends, Ski, Soccer, Family, College, Budget, Luxury)
- **AI refinement** — Natural language instructions ("make day 2 more relaxed", "add more food options")

### During-Trip: Collaboration & Capture
- **Real-time group collaboration** — Share invite link, everyone votes on activities via Supabase Realtime
- **Write-in options** — Add your own activity ideas, visible to all members
- **Activity booking** — Mark activities as confirmed/booked
- **Per-activity photos** — Upload photos at each stop with client-side resize
- **Memorable moments** — Each group member shares their trip highlight

### After-Trip: Create & Share
- **Photo books** — Auto-generated 20+ page books, 2 templates, PDF export, Lulu print ordering
- **Trip movies** — Browser-native video generation with Ken Burns effect, 9:16 vertical format
- **Postcards** — 3 templates, send via email, SMS, or physical mail (Thanks.io)
- **VYBR Unpacked** — Year-in-review stats page (trips, days, destinations, vibes)

### Social
- **User profiles** — Display name, avatar (initials/emoji/upload), bio, public/private
- **Follow system** — Instagram-style with pending requests for private accounts
- **Activity feed** — See friends' published trips, comments, likes, clones
- **Threaded comments** and likes on public trips
- **Trip publishing** — Share trips on the Explore page with tags, descriptions

### Maps
- **3D globe hero** — Mapbox globe projection with cinematic fly-to animation
- **Satellite itinerary map** — Route lines, day-colored numbered markers, popups
- **Destination photos** — 70+ location-specific Unsplash photos for trip hero banners
- **Map provider abstraction** — Swap between Mapbox, MapTiler, or Google via env var

### Experience
- **11 visual themes** — VYBR Space (dark) + iOS Default + 9 Wes Anderson film palettes
- **Animated space background** — Twinkling stars, shooting stars, comets
- **Gamification** — XP, 8 badges, streaks, daily rewards (opt-in)
- **Lodging deep links** — Airbnb, VRBO, Hotels.com, Expedia with pre-filled dates
- **Activity links** — Wikipedia, Google Maps, Viator, Booking.com

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.9, Vite 8, Tailwind CSS 4 |
| State | React Context (forms, auth, theme) + Zustand (gamification) |
| Backend | Supabase (Postgres, Auth, Realtime, Storage, Edge Functions) |
| AI | OpenAI GPT-4o (server), Claude Sonnet 4.5, Gemini 2.0 Flash (fallback) |
| Maps | Mapbox GL JS 3.20 (3D globe, satellite, outdoor) |
| Video | Canvas API + MediaRecorder (zero dependencies) |
| PDF | jsPDF + html2canvas |
| Print | Lulu API (photo books), Thanks.io (postcards) |
| Hosting | Vercel (Functions + CDN) + Cloudflare (WAF, SSL) |

---

## Database Schema (18 tables)

| Table | Purpose |
|-------|---------|
| `trips` | Trip data, JSONB itinerary + form, publishing, search vector |
| `trip_members` | Users who joined a trip |
| `slot_selections` | Per-user activity votes |
| `trip_custom_options` | Write-in activities |
| `trip_moments` | Memorable moments per member |
| `trip_booked_slots` | Confirmed activities |
| `trip_photos` | Per-activity photos |
| `trip_reviews` | Star ratings + reviews |
| `trip_comments` | Threaded comments |
| `trip_likes` | Like/heart on trips |
| `user_profiles` | Profile, avatar, bio, gamification JSONB |
| `travel_partners` | Saved travel companions |
| `partner_groups` | Named groups of partners |
| `user_follows` | Follow relationships (pending/accepted) |
| `activity_feed` | Denormalized feed items |
| `trip_invitations` | Email invite tokens |
| `photo_books` | Photo book drafts + orders |
| `postcards` | Postcard history + delivery |

---

## Getting Started

```bash
git clone https://github.com/ahelferthaus/trip-designer.git
cd trip-designer
npm install
```

Create `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-...                    # Server-side (Vercel)
VITE_MAPBOX_TOKEN=pk.eyJ1...             # Maps

# Optional
VITE_OPENAI_API_KEY=sk-...              # Local dev fallback
VITE_ANTHROPIC_API_KEY=sk-ant-...       # AI fallback
VITE_GEMINI_API_KEY=AIza...             # AI fallback
VITE_LULU_API_KEY=...                   # Photo book printing
VITE_THANKS_IO_API_KEY=...             # Postcard printing
VITE_MAP_PROVIDER=mapbox               # mapbox | maptiler | google
```

```bash
npm run dev    # Local development
npm run build  # Production build
```

---

## Deploy

Push to `main` → Vercel auto-deploys. Set `OPENAI_API_KEY` (without `VITE_` prefix) in Vercel env vars for server-side AI.

---

## Documentation

- **[PRODUCT_AUDIT.md](./PRODUCT_AUDIT.md)** — Complete feature map, tech stack details, competitive analysis vs Polarsteps, strategic roadmap
- **[CLAUDE.md](./CLAUDE.md)** — AI coding instructions and conventions

---

## License

MIT
