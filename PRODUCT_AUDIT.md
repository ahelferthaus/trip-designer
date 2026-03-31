# VYBR Travel — Complete Product Audit & Strategic Plan
**Date:** March 31, 2026 | **Repo:** github.com/ahelferthaus/trip-designer | **Live:** vybrtravel.com

---

## 1. Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | React + TypeScript | 19.2.4 / 5.9.3 | SPA with client-side routing |
| Build | Vite | 8.0.1 | Fast dev + production builds |
| Styling | Tailwind CSS | 4.2.2 | Via Vite plugin. Theme vars mostly inline |
| Routing | React Router DOM | 7.13.2 | 20 routes |
| State (forms) | React Context | — | TripStore, ItineraryStore, AuthStore, ThemeStore |
| State (gamification) | Zustand | 5.0.12 | With persist middleware to localStorage |
| Backend | Supabase | 2.100.0 | Auth, Postgres, Realtime, Storage, Edge Functions |
| Hosting | Vercel + Cloudflare | — | Serverless Functions for AI proxy |
| AI Primary | OpenAI GPT-4o | — | Server-side via Vercel `/api/generate` |
| AI Fallback | Claude Sonnet 4.5, Gemini 2.0 Flash | — | Client-side fallback (disabled in prod) |
| Maps | Mapbox GL JS | 3.20.0 | 3D globe, satellite, outdoor styles |
| Geocoding | Mapbox + Nominatim | — | Shared cache, provider abstraction |
| PDF | jsPDF + html2canvas | — | Photo book export |
| Video | Canvas API + MediaRecorder | — | Trip movie generation |
| Print | Lulu API (books), Thanks.io (postcards) | — | Physical product ordering |

---

## 2. Current Functionality — Complete Feature Map

### Working Features (20 pages, 15+ DB tables)

**Trip Planning Pipeline**
- 8-step intake wizard: destination, dates (side-by-side calendars), group, transport mode, budget, vibes, notes/dietary/mobility, review
- AI itinerary generation via GPT-4o with 12 travel theme prompts
- Itinerary refinement via natural language ("make day 2 more relaxed")
- Travel DNA: pre-fills defaults after 3+ trips
- 126 seed trip definitions across 8 categories
- 42 pre-generated trips in database

**Collaboration (Real-Time)**
- Invite via shareable link (passcode protected)
- Per-user activity voting with Supabase Realtime
- Write-in custom activities
- Mark activities as "booked"
- Memorable moments per member

**Social**
- Follow/unfollow (Instagram-style, with private profile requests)
- Activity feed (published, cloned, commented, liked)
- Threaded comments, likes
- Public profiles with follower/following counts

**Maps**
- 3D globe hero with Mapbox globe projection + fly-to animation
- Satellite + outdoor itinerary maps with geocoded markers
- Day-colored route lines
- Destination photo overlays on trip-specific pages
- Map provider abstraction (Mapbox/MapTiler/Google)

**Media Creation**
- Per-activity photo uploads with client-side resize
- Auto-generated photo books (2 templates, PDF export, Lulu print)
- Postcards (3 templates, email/SMS/print delivery)
- Trip movies (Canvas+MediaRecorder, Ken Burns effect, 9:16 vertical)

**Gamification**
- XP system with 10 levels
- 8 achievement badges
- Daily check-in streaks
- 7-day reward cycle
- Cloud sync via Supabase JSONB

**Other**
- 11 visual themes (VYBR Space dark + 9 Wes Anderson films + iOS Default)
- Space background with twinkling stars, shooting stars, comets
- Year-in-review "VYBR Unpacked" page
- Trip sidebar with pre-built trips, favorites, customize & rerun
- Lodging deep links (Airbnb, VRBO, Hotels.com, Expedia)
- Activity links (Wikipedia, Google Maps, Viator, Booking.com)

---

## 3. What's NOT Built Yet (Critical Gaps)

### vs Polarsteps — Missing Core Features

| Feature | Polarsteps | VYBR | Gap |
|---------|-----------|------|-----|
| GPS trip tracking | Auto-track via GPS/WiFi/Cell | Not implemented | **Critical** |
| Photo diary with geotags | Automatic from camera roll | Manual upload per slot | **Critical** |
| Trip timeline on map | Photos + route on interactive map | No timeline view | **Critical** |
| Offline mode | Full offline with sync | None (no service worker) | **High** |
| Steps/distance tracking | Built-in pedometer | Not implemented | **High** |
| Native mobile app | iOS + Android | Web-only PWA | **High** |
| Shared group timeline | Merged photos from all members | Not implemented | **Medium** |
| Auto trip detection | Geofencing + location change | Not implemented | **Medium** |
| Weather integration | — | Field exists, no API | **Low** |
| Push notifications | Native | None | **Medium** |

### Where VYBR is Already BETTER Than Polarsteps

| Feature | VYBR Advantage |
|---------|---------------|
| AI itinerary generation | Multi-LLM with auto-fallback (GPT-4o/Claude/Gemini) |
| Group voting on activities | Real-time collaborative voting, write-ins |
| Travel themes | 12 specialized themes (soccer, skiing, college tour, etc.) |
| Wes Anderson design themes | 11 visual themes — unique differentiator |
| Photo books | In-app generation + physical print ordering |
| Postcards | Email, SMS, and physical mail |
| Trip movies | Browser-native video generation |
| Gamification | XP, badges, streaks, daily rewards |
| Budget planning | Per-person or total, with currency options |
| Transport mode planning | Flight/train/car/bus/mixed in itinerary prompt |
| College campus tours | Dedicated theme with campus-specific logic |
| Pre-built trip library | 42 AI-generated trips browsable in sidebar |
| Full web app | Desktop + mobile (Polarsteps desktop "coming soon") |

---

## 4. Strategic Priorities — What to Build Next

### Phase 1: During-Trip Experience (The Missing Core)

**1. Trip Tracking & GPS Recording**
- Start/stop trip recording with Geolocation API
- Background location tracking (requires service worker)
- Distance + steps calculation
- Battery-efficient polling (every 30-60s when moving)
- Store route as GeoJSON polyline

**2. Photo Diary / Travel Journal**
- Free-form journal entries (text + photos) at any time
- Auto-geotag photos using current GPS location
- Timestamp-based timeline (not just activity slots)
- Rich text support (markdown or basic formatting)
- Photo gallery per day with map overlay

**3. Interactive Trip Timeline**
- Chronological timeline showing: locations visited, photos taken, journal entries, activities completed
- Photos plotted on the map at their GPS coordinates
- Animated playback of the trip route
- Shared timeline merging all group members

### Phase 2: UX Polish & Quality

**4. Desktop Responsive Layout**
- Sidebar navigation on screens > 768px
- Trip planner in a 2-column layout (map left, details right)
- Itinerary view with persistent map alongside day cards

**5. SVG Icon System**
- Replace all emoji navigation icons with consistent SVG icons
- Accessible (aria-labels, keyboard navigation)
- Theme-aware (color matches active theme)

**6. Code Architecture Cleanup**
- Extract duplicate `daysBetween` into shared utility
- Code-split all pages with React.lazy()
- Move inline styles to Tailwind utility classes
- Decompose ItineraryPage.tsx (700+ lines) into sub-components

**7. Security Hardening**
- Fix RLS policies (owner-based access control)
- Add CORS restriction on Vercel Functions
- Atomic like/view count increments (SQL `+1`)
- Remove dead `src/lib/openai.ts`

### Phase 3: Growth & Engagement

**8. PWA Offline Mode**
- Service worker with Workbox
- Cache trip data + maps in IndexedDB
- Offline photo queue (sync when back online)
- Background sync for GPS data

**9. Social Sharing**
- Share trip cards to Instagram Stories, WhatsApp, Twitter
- OG image generation per trip (dynamic social cards)
- Public trip URLs with rich preview

**10. Smart Recommendations**
- "Travelers like you also visited..." based on Travel DNA
- Seasonal recommendations (ski in winter, beach in summer)
- Trending destinations from community data

---

## 5. The NYC-to-Boston Trip Use Case

Here's how VYBR should handle your specific trip (NYC → Boston, 1 week, coastal/island stops, college visits):

### Planning Phase (Works Today)
1. Open intake wizard → "NYC to Boston"
2. Set dates (1 week), group, budget
3. Select transport: "car" (road trip)
4. Vibes: culture, nature, family
5. Theme: college-tour
6. Must-haves: "Coastal route, stop on an island for 2-3 days, visit colleges along the way"
7. AI generates multi-stop itinerary: NYC → New Haven (Yale) → coastal CT → Block Island or Martha's Vineyard → Providence (Brown/RISD) → Boston (MIT/Harvard)
8. Share invite link with family → everyone votes on activities

### During Trip (Needs to Be Built)
- Start trip recording → GPS tracks your route
- At each stop: snap photos → auto-geotagged, timestamped
- Write journal entries: "Amazing lobster roll at..."
- See your route growing on the 3D map in real-time
- Group members' photos appear in a shared timeline
- Step counter shows daily walking distances

### After Trip (Partially Works Today)
- Generate photo book from trip photos → order print
- Create trip movie with Ken Burns effect on photos
- Send postcards to family
- Year-in-review shows this trip in your annual stats
- Trip saved and shareable on Explore page

---

## 6. Destination Photo Issues (Current Bug)

Several destinations share the same generic "college campus" photo because the lookup matches on substrings. For example, "Charlottesville, VA" and "Hamilton, NY" both match fallback campus photos. The fix should use the trip's `cover_photo_url` field from the database, falling back to the destination lookup only when null. A one-time script should update all 42 DB trips with unique `cover_photo_url` values.

---

## 7. Recommended Immediate Actions

1. **Fix destination photos** — Update `cover_photo_url` in the database for all 42 trips
2. **Fix RLS policies** — Restrict update/delete to trip owners
3. **Add password reset** — Missing from auth flow
4. **Code-split pages** — Reduce initial bundle from 1.3MB
5. **Add React Query** — Replace manual fetch/state patterns with proper caching
6. **Plan the GPS tracking architecture** — Service worker + Geolocation API + IndexedDB
7. **Design the journal/diary UI** — The core missing feature for during-trip experience
