# VYBR — UI/UX Design Brief for Kimi

## What This Is

VYBR is an AI-powered collaborative trip planning app. It generates itineraries, lets groups vote on activities, write in their own options, book confirmed plans, share photos, and discover other travelers' trips. It's a React + TypeScript PWA targeting iPhone-first with 10 color themes.

## What's Built (Functional, Needs Visual Polish)

### Core Pages
- **HomePage** (`/`) — Landing with feature cards, CTA buttons (Plan, Explore, Feed, My Trips)
- **IntakePage** (`/intake`) — 7-step wizard: destination → dates → group → budget → vibes → notes → review
- **ItineraryPage** (`/itinerary`) — Main trip view with day-by-day slots, voting, write-ins, booking, photos, moments
- **TripsPage** (`/trips`) — Saved trips list (local + cloud synced)
- **SettingsPage** (`/settings`) — Profile (name, avatar, bio, privacy), passcode, AI providers, travel partners

### Social Pages
- **ExplorePage** (`/explore`) — Search + browse public trips with filters
- **TripDetailPage** (`/trip/:id`) — Public trip view with itinerary preview, clone, likes, comments, reviews
- **FeedPage** (`/feed`) — Activity feed from people you follow
- **ProfilePage** (`/profile/:id`) — Public profile with avatar, bio, stats, follow button, trip gallery

### Other Pages
- **AuthPage** (`/auth`) — Sign in / sign up
- **JoinPage** (`/join/:code`) — Join a shared trip via invite link
- **ThemePage** (`/theme`) — 10 Wes Anderson color theme picker

## Design System

### CSS Variables (already in use everywhere)
All colors use `--td-*` CSS custom properties set by the active theme:

| Variable | Purpose |
|----------|---------|
| `--td-bg` | Page background |
| `--td-card` | Card/surface background |
| `--td-label` | Primary text |
| `--td-secondary` | Secondary/muted text |
| `--td-accent` | Primary action color (buttons, links) |
| `--td-accent-text` | Text on accent color (always white) |
| `--td-separator` | Divider lines |
| `--td-fill` | Inactive fills, toggle backgrounds |
| `--td-nav-bg` | Navigation bar background |

**Important:** All styling must use these variables, not hardcoded colors. This ensures all 10 themes work correctly.

### Current Style
- Mobile-first (390px iPhone viewport)
- iOS-native feel: SF Pro font, grouped lists, rounded cards
- Tailwind CSS v4 utility classes
- `active:opacity-70` for tap feedback
- Rounded corners: `rounded-2xl` for cards, `rounded-full` for pills/avatars

## What to Polish

### 1. Bottom Tab Bar (HIGH PRIORITY)
Add a persistent bottom tab bar across all pages (like Instagram/Strava):
- Home (house icon)
- Explore (compass/search icon)
- + Plan (center, accent-colored)
- Feed (bell/activity icon)
- Profile (person icon, links to own profile)

Currently navigation is via buttons on the home page — a tab bar would make it feel like a real app.

### 2. Visual Hierarchy & Typography
- Tighten spacing on card layouts (Explore trip cards, Feed items, Profile trip gallery)
- Better use of font weight scale (currently mostly 13px-17px, could use more contrast)
- Section headers could be more distinctive
- Numbers/stats should pop more (follower counts, like counts, clone counts)

### 3. Trip Detail Page (`/trip/:id`)
This is the "storefront" — needs the most attention:
- Cover photo hero treatment (gradient overlay, larger text)
- Better itinerary preview layout (currently plain list)
- Social proof section (likes, clones, reviews) should be more prominent
- Clone CTA should feel premium
- Comments section styling

### 4. Itinerary Page (`/itinerary`)
- Activity cards: voter avatar bubbles + photo thumbnails could be laid out better
- Booked items: the green highlight is subtle, could be more celebratory
- Write-in form: currently bare input, could be more inviting
- Day headers: the numbered circle + title could have more presence
- The "Memorable Moment" section could be more emotional/impactful

### 5. Explore Page (`/explore`)
- Trip cards need better visual treatment (cover photos, gradient fallbacks)
- Filter bar could use pill-style toggle buttons instead of `<select>` dropdowns
- Search should feel snappy (maybe add popular destinations as chips)

### 6. Feed Page (`/feed`)
- Feed items are currently plain cards — could use richer formatting
- Different action types (published, liked, commented, cloned) could have distinct visual treatments
- Timestamps could be more subtle

### 7. Profile Page (`/profile/:id`)
- Instagram-style grid layout for published trips instead of a list
- Stats (trips/followers/following) could have more visual weight
- Follow button states need clear differentiation

### 8. Empty States
All these pages have empty states that could be more engaging:
- Feed: "Your feed is empty" — could suggest who to follow
- Explore: "No trips found" — could show popular destinations
- Trips: "No saved trips" — could be more inviting
- Profile: "No published trips" — could encourage publishing

### 9. Photo Presentation
- Slot photo thumbnails (currently 40x40) could be larger
- Photo lightbox could have swipe between photos in the same slot
- A trip-level photo gallery section would be nice

### 10. Animations & Transitions
- Page transitions (route changes feel abrupt)
- Card hover/tap states
- Loading skeleton screens instead of plain spinners
- Toast notifications could slide in/out

## What NOT to Change

- **Component structure** — Don't restructure React components or move files
- **State management** — Don't change stores, contexts, or data flow
- **Supabase integration** — Don't modify lib/ files that call Supabase
- **Functionality** — Don't add or remove features, just improve how they look
- **Theme variable names** — Keep all `--td-*` CSS variables as-is

## Tech Stack Reference

| Tech | Version |
|------|---------|
| React | 19 |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | 4 |
| React Router | 7 |
| Supabase JS | 2.x |

## File Structure (pages to focus on)

```
src/
  pages/
    HomePage.tsx          — Landing page
    IntakePage.tsx        — 7-step wizard (longest file)
    ItineraryPage.tsx     — Main trip view (most complex)
    ExplorePage.tsx       — Public trip search
    TripDetailPage.tsx    — Public trip detail
    FeedPage.tsx          — Activity feed
    ProfilePage.tsx       — User profile
    TripsPage.tsx         — Saved trips list
    SettingsPage.tsx      — Settings + profile editor
    AuthPage.tsx          — Sign in/up
    ThemePage.tsx         — Theme picker
    JoinPage.tsx          — Join via invite
  components/
    UserAvatar.tsx        — Shared avatar component
    itinerary/
      SlotPhotos.tsx      — Per-slot photo strip + upload
      ItineraryMap.tsx    — Google Maps embed
      InviteModal.tsx     — Email invite modal
      WriteInOption.tsx   — Write-in form
    intake/
      CalendarPicker.tsx  — Date picker
      GroupPresetPicker.tsx
    settings/
      TravelPartnersSection.tsx
```

## How to Test

```bash
npm install
npm run dev
# Open http://localhost:5173
# Resize browser to ~390px wide for iPhone viewport
```

Switch themes at `/theme` to verify your changes work across all 10 palettes.
