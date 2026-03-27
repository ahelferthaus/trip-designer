# VYBR — UI/UX Design Brief for Kimi (Pass 3)

## Context

VYBR is a premium AI travel companion app. The functionality is complete — this pass is purely visual polish to make every screen feel consumer-grade and premium.

**Target aesthetic: Polarsteps meets Instagram meets Apple Maps.**
Clean, photo-forward, spacious, cinematic. Not gamified, not flashy.

## What's Built (16 pages, all functional)

| Page | Route | Purpose |
|------|-------|---------|
| HomePage | `/` | Satellite earth hero, CTA, stats |
| AuthPage | `/auth` | Sign in / sign up |
| OnboardingPage | `/onboarding` | Polarsteps-style profile setup |
| IntakePage | `/intake` | 7-step trip wizard |
| ItineraryPage | `/itinerary` | Hero map + day-by-day activities |
| TripsPage | `/trips` | Saved trips list |
| ExplorePage | `/explore` | Public trip search + browse |
| TripDetailPage | `/trip/:id` | Public trip with timeline itinerary |
| FeedPage | `/feed` | Social activity feed |
| ProfilePage | `/profile/:id` | User profile + trips |
| PhotoBookPage | `/book/:id` | Book editor (dark UI) |
| PostcardPage | `/postcard` | 7-step postcard composer (dark UI) |
| TripMoviePage | `/movie` | Video generator (dark UI) |
| JoinPage | `/join/:code` | Join via invite |
| SettingsPage | `/settings` | Profile, partners, preferences |
| ThemePage | `/theme` | 10 theme picker |

## Design System Already in Place

### CSS Variables (use these, no hardcoded colors)
`--td-bg`, `--td-card`, `--td-label`, `--td-secondary`, `--td-accent`, `--td-accent-text`, `--td-separator`, `--td-fill`, `--td-nav-bg`

### Motion System (already in index.css)
- `.reveal` — scroll-triggered fade-up
- `.page-enter` — route transition animation
- `.breathe` — subtle scale pulse
- `.btn-spring` — bouncy press
- `.gradient-animate` — shifting gradient
- `.tilt-hover` — 3D perspective on hover
- `.card-hover` — scale-down on tap

### Components
- `BottomTabBar` — 5-tab nav, hides on intake/auth/book/postcard/movie
- `UserAvatar` — supports initials, emoji, upload
- `TripHeroMap` — satellite Mapbox hero (when token set)

## What to Polish (Priority Order)

### 1. ExplorePage — Trip Discovery
This is where new users browse. Needs to feel like a travel magazine.
- **Trip cards**: Larger cover photo areas (h-40 not h-28), gradient text overlay
- **Filter bar**: Horizontal pills instead of `<select>` dropdowns
- **Search**: More premium — larger, subtle border, placeholder icon
- **Card hover**: Already has `tilt-hover`, verify it works well

### 2. TripDetailPage — Public Trip View
The "storefront" that people share. Already has:
- 320px hero cover with gradient overlay
- Floating social bar with author avatar
- Timeline itinerary with vertical rail
Polish: tighten the timeline spacing, make activity cards cleaner

### 3. ProfilePage — User Profile
Needs Instagram-style treatment:
- Centered large avatar + name + bio
- Stats row (trips/followers/following) — make numbers bold, labels subtle
- Trip gallery: 2-column grid with cover images instead of list

### 4. FeedPage — Activity Feed
- Richer feed item cards — add trip cover thumbnail
- Distinct styling per action type (published, liked, commented)
- Timestamps more subtle

### 5. ItineraryPage — Main Trip View
The hero map is built. Below it:
- Tighten day header spacing
- Activity cards could be slightly more compact
- Photo thumbnails slightly larger
- "Booked" badge is good, keep it

### 6. HomePage — Landing
Already redesigned with satellite earth hero. Minor tweaks:
- "How it works" cards could have icons instead of numbers
- Bottom CTAs spacing

## Rules

1. **ONLY use `var(--td-*)` CSS variables** for colors
2. **Don't change any imports from `lib/` or `store/`** — functionality is locked
3. **Don't add npm dependencies**
4. **Test with Default, Grand Budapest, and Moonrise Kingdom themes**
5. **Mobile-first (390px)** but look decent on desktop
6. **Use existing motion classes** (`.reveal`, `.btn-spring`, etc.) — don't add new animation frameworks
7. **Keep all routes and navigation intact**

## Files to Focus On

```
src/pages/ExplorePage.tsx     — trip cards, filters
src/pages/TripDetailPage.tsx  — hero, timeline, social
src/pages/ProfilePage.tsx     — grid layout, stats
src/pages/FeedPage.tsx        — feed item cards
src/pages/ItineraryPage.tsx   — CAREFUL, complex file, only touch classes
src/pages/HomePage.tsx        — minor polish only
```

## How to Test

```bash
npm install
npm run dev
# Open http://localhost:5173
# Test: Home, Explore, Trip Detail, Profile, Feed, Itinerary
# Switch themes at /theme — try Default, Grand Budapest, Moonrise Kingdom
# Verify npm run build passes before finishing
```
